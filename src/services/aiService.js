const DEFAULT_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'gemma3:1b';
const OLLAMA_ENABLED = import.meta.env.VITE_ENABLE_OLLAMA !== 'false';
const OLLAMA_CHAT_URL = '/api/ollama/api/chat';
const OLLAMA_TIMEOUT_MS = 25000;

const parseJsonResponse = (content) => {
  if (!content) {
    throw new Error('AI returned an empty response.');
  }

  try {
    return JSON.parse(content);
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI returned invalid JSON.');
    }
    return JSON.parse(jsonMatch[0]);
  }
};

const clampScore = (value) => {
  const normalized = Number(value);
  if (Number.isNaN(normalized)) return 0;
  return Math.max(0, Math.min(100, Math.round(normalized)));
};

export const aiService = {
  generateFeedback: (score) => {
    if (score >= 90) return "Excellent performance! You demonstrated strong technical knowledge and clear communication skills.";
    if (score >= 80) return "Good job! You showed solid understanding with room for minor improvements in depth.";
    if (score >= 70) return "Decent performance. Focus on deepening your technical knowledge and practice more.";
    return "Keep practicing! Work on building confidence and expanding your knowledge base.";
  },

  generateHighlights: (score, type) => {
    const focusMap = {
      technical: ['Clarify tradeoffs as you explain solutions.', 'Name the tools or concepts you would reach for under pressure.'],
      behavioral: ['Use the STAR format to keep answers structured.', 'Quantify impact so your examples feel more credible.'],
      'system-design': ['State your assumptions before diving into architecture.', 'Talk through scaling and failure handling more explicitly.'],
      mock: ['Lead with confidence and keep each answer outcome-focused.', 'Turn broad answers into specific examples.'],
      quick: ['Keep your answer concise and concrete.', 'Finish with one memorable insight or example.'],
      skill: ['Make your process visible step by step.', 'Connect your skill to a measurable outcome.'],
    };

    if (score >= 85) {
      return [
        'You kept the answer quality strong across the session.',
        'Your communication likely felt confident and organized.',
      ];
    }

    if (score >= 70) {
      return [
        'You showed a workable foundation with room to sharpen depth.',
        'A bit more structure would make your responses more persuasive.',
      ];
    }

    return focusMap[type] || [
      'Use clearer structure so each answer has context, approach, and result.',
      'Practice slower, more deliberate explanations before adding more detail.',
    ];
  },

  getFallbackEvaluation: (type, answers = [], errorMessage = '') => {
    const answerCount = answers.length;
    const totalWords = answers.reduce(
      (sum, item) => sum + item.answer.trim().split(/\s+/).filter(Boolean).length,
      0
    );
    const averageWords = answerCount > 0 ? totalWords / answerCount : 0;
    const score = clampScore(55 + Math.min(answerCount * 6, 20) + Math.min(averageWords / 8, 20));
    const feedback = errorMessage
      ? `Local AI evaluation was unavailable, so a fallback score was used. ${errorMessage}`
      : aiService.generateFeedback(score);
    const highlights = [
      ...aiService.generateHighlights(score, type),
      'To enable real AI scoring, start Ollama locally and keep the selected model installed.',
    ];

    return {
      score,
      feedback,
      highlights,
      model: 'fallback',
      provider: 'local-fallback',
    };
  },

  evaluateInterview: async ({ type, answers }) => {
    if (!OLLAMA_ENABLED) {
      return aiService.getFallbackEvaluation(
        type,
        answers,
        'Local AI evaluation is disabled in environment settings.'
      );
    }

    const transcript = answers
      .map(
        (item, index) =>
          `${index + 1}. Question: ${item.question}\nAnswer: ${item.answer}`
      )
      .join('\n\n');

    const prompt = `
You are an expert interview evaluator.

Evaluate this mock interview. Consider:
- correctness
- clarity
- structure
- depth
- communication

Return ONLY valid JSON with this exact shape:
{
  "score": 0,
  "feedback": "",
  "highlights": ["", ""]
}

Rules:
- score must be an integer from 0 to 100
- feedback should be 2 to 4 sentences
- highlights should contain 2 to 4 concise coaching points

Interview type: ${type}

Questions and answers:
${transcript || 'No answers were submitted.'}
    `.trim();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(OLLAMA_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          stream: false,
          format: 'json',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
        signal: controller.signal,
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Ollama evaluation timed out after 25 seconds. Check that Ollama is running and the model is installed.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error('Could not reach Ollama. Make sure Ollama is running locally on port 11434.');
    }

    const data = await response.json();
    const parsed = parseJsonResponse(data?.message?.content);

    return {
      score: clampScore(parsed.score),
      feedback: parsed.feedback || aiService.generateFeedback(clampScore(parsed.score)),
      highlights:
        Array.isArray(parsed.highlights) && parsed.highlights.length > 0
          ? parsed.highlights.slice(0, 4)
          : aiService.generateHighlights(clampScore(parsed.score), type),
      model: DEFAULT_MODEL,
      provider: 'ollama',
    };
  },
};
