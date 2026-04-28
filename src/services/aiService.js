const DEFAULT_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'gemma3:1b';
const OLLAMA_ENABLED = import.meta.env.VITE_ENABLE_OLLAMA !== 'false';
const OLLAMA_CHAT_URL = '/api/ollama/api/chat';
const OLLAMA_TIMEOUT_MS = 100000;
const SCORE_DIMENSIONS = ['clarity', 'structure', 'relevance', 'depth', 'communication'];
const STOP_WORDS = new Set([
  'about', 'after', 'again', 'against', 'also', 'because', 'before', 'being', 'between',
  'could', 'every', 'first', 'from', 'have', 'into', 'just', 'like', 'more', 'most',
  'other', 'over', 'same', 'some', 'such', 'than', 'that', 'their', 'there', 'these',
  'they', 'this', 'those', 'through', 'under', 'very', 'what', 'when', 'where', 'which',
  'while', 'with', 'would', 'your'
]);

const TYPE_KEYWORDS = {
  technical: ['algorithm', 'complexity', 'performance', 'debug', 'optimize', 'tradeoff', 'data', 'logic'],
  behavioral: ['team', 'challenge', 'stakeholder', 'learned', 'result', 'impact', 'situation', 'action'],
  'system-design': ['scale', 'latency', 'cache', 'database', 'queue', 'availability', 'throughput', 'service'],
  mock: ['experience', 'strength', 'example', 'result', 'goal', 'team', 'approach'],
  quick: ['clear', 'simple', 'example', 'reason', 'concise'],
  skill: ['process', 'debugging', 'testing', 'quality', 'version control', 'approach'],
};

const TRANSITION_RE = /\b(first|second|third|then|next|finally|because|therefore|however|for example|for instance|in practice|as a result)\b/gi;
const STAR_RE = /\b(situation|task|action|result)\b/gi;
const OUTCOME_RE = /\b(result|outcome|impact|improved|reduced|increased|delivered|learned|shipped|resolved)\b/gi;
const METRIC_RE = /\b\d+([.,]\d+)?(%|x|ms|s|sec|seconds|minutes|hours|users|requests|queries|days|weeks|months)?\b/gi;
const FILLER_RE = /\b(um|uh|like|basically|kind of|sort of|you know)\b/gi;
const EXPLANATION_RE = /\b(because|so that|which meant|therefore|tradeoff|reason|approach|decision)\b/gi;

const average = (values) => {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const clampPercentage = (value) => Math.max(0, Math.min(100, Math.round(value)));

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

const bandScore = (value, { min, idealMin, idealMax, max }) => {
  if (value <= min) return 0;
  if (value < idealMin) {
    return clampPercentage(((value - min) / Math.max(idealMin - min, 1)) * 100);
  }
  if (value <= idealMax) return 100;
  if (value >= max) return 45;
  return clampPercentage(100 - (((value - idealMax) / Math.max(max - idealMax, 1)) * 55));
};

const countWords = (text = '') => text.trim().split(/\s+/).filter(Boolean).length;
const countSentences = (text = '') =>
  text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length;

const countMatches = (text = '', regex) => {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
};

const extractKeywords = (question = '') => {
  const words = question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word));

  return [...new Set(words)].slice(0, 8);
};

const buildHeuristicBreakdown = ({ type, answers = [], expectedQuestions }) => {
  const safeAnswers = answers.filter((item) => item?.answer?.trim());
  const answerCount = safeAnswers.length;
  const completionRatio = expectedQuestions
    ? Math.min(answerCount / expectedQuestions, 1)
    : answerCount > 0
      ? 1
      : 0;

  if (answerCount === 0) {
    return {
      clarity: 8,
      structure: 6,
      relevance: 8,
      depth: 6,
      communication: 10,
      completionRatio,
      answerCount,
    };
  }

  const typeKeywords = TYPE_KEYWORDS[type] || [];
  const answerMetrics = safeAnswers.map((entry) => {
    const answer = entry.answer.trim();
    const questionKeywords = extractKeywords(entry.question);
    const lowerAnswer = answer.toLowerCase();
    const wordCount = countWords(answer);
    const sentenceCount = countSentences(answer);
    const keywordHits = questionKeywords.filter((word) => lowerAnswer.includes(word)).length;
    const typeHits = typeKeywords.filter((word) => lowerAnswer.includes(word)).length;
    const transitionHits = countMatches(answer, TRANSITION_RE);
    const starHits = countMatches(answer, STAR_RE);
    const outcomeHits = countMatches(answer, OUTCOME_RE);
    const metricHits = countMatches(answer, METRIC_RE);
    const fillerHits = countMatches(answer, FILLER_RE);
    const explanationHits = countMatches(answer, EXPLANATION_RE);
    const uniqueWords = new Set(
      answer.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(Boolean)
    ).size;
    const vocabularyRatio = wordCount > 0 ? uniqueWords / wordCount : 0;

    return {
      wordCount,
      sentenceCount,
      keywordCoverage: questionKeywords.length ? keywordHits / questionKeywords.length : 0.5,
      typeCoverage: typeKeywords.length ? Math.min(typeHits / Math.min(typeKeywords.length, 4), 1) : 0.5,
      transitionHits,
      starHits,
      outcomeHits,
      metricHits,
      fillerHits,
      explanationHits,
      vocabularyRatio,
    };
  });

  const averageWords = average(answerMetrics.map((item) => item.wordCount));
  const averageSentences = average(answerMetrics.map((item) => item.sentenceCount));
  const keywordCoverage = average(answerMetrics.map((item) => item.keywordCoverage));
  const typeCoverage = average(answerMetrics.map((item) => item.typeCoverage));
  const structureSignal = average(
    answerMetrics.map((item) =>
      Math.min((item.transitionHits + item.starHits + item.outcomeHits) / 3, 1)
    )
  );
  const explanationSignal = average(
    answerMetrics.map((item) => Math.min(item.explanationHits / 2, 1))
  );
  const evidenceSignal = average(
    answerMetrics.map((item) => Math.min((item.metricHits + item.outcomeHits) / 2, 1))
  );
  const fillerPenalty = average(
    answerMetrics.map((item) => Math.min(item.fillerHits / 3, 1))
  );
  const vocabularySignal = average(
    answerMetrics.map((item) => Math.min(item.vocabularyRatio / 0.62, 1))
  );

  const wordScore = bandScore(averageWords, { min: 10, idealMin: 35, idealMax: 120, max: 260 });
  const sentenceScore = bandScore(averageSentences, { min: 1, idealMin: 2, idealMax: 5, max: 8 });

  const clarity = clampPercentage(
    wordScore * 0.28 +
    sentenceScore * 0.22 +
    explanationSignal * 100 * 0.22 +
    keywordCoverage * 100 * 0.14 +
    (1 - fillerPenalty) * 100 * 0.14
  );

  const structure = clampPercentage(
    structureSignal * 100 * 0.42 +
    completionRatio * 100 * 0.22 +
    sentenceScore * 0.18 +
    explanationSignal * 100 * 0.18
  );

  const relevance = clampPercentage(
    keywordCoverage * 100 * 0.52 +
    typeCoverage * 100 * 0.24 +
    completionRatio * 100 * 0.24
  );

  const depth = clampPercentage(
    wordScore * 0.26 +
    explanationSignal * 100 * 0.24 +
    evidenceSignal * 100 * 0.28 +
    typeCoverage * 100 * 0.22
  );

  const communication = clampPercentage(
    sentenceScore * 0.22 +
    vocabularySignal * 100 * 0.22 +
    (1 - fillerPenalty) * 100 * 0.18 +
    completionRatio * 100 * 0.16 +
    structureSignal * 100 * 0.22
  );

  return {
    clarity,
    structure,
    relevance,
    depth,
    communication,
    completionRatio,
    answerCount,
  };
};

const scoreFromBreakdown = (breakdown) =>
  clampScore(
    breakdown.clarity * 0.22 +
    breakdown.structure * 0.2 +
    breakdown.relevance * 0.24 +
    breakdown.depth * 0.22 +
    breakdown.communication * 0.12
  );

const normalizeBreakdown = (input = {}, fallback = {}) => {
  const output = {};
  for (const key of SCORE_DIMENSIONS) {
    const source = input[key] ?? fallback[key] ?? 0;
    output[key] = clampScore(source);
  }
  return output;
};

export const aiService = {
  generateFeedback: (score, breakdown = null) => {
    if (!breakdown) {
      if (score >= 90) return "Excellent performance! You demonstrated strong technical knowledge and clear communication skills.";
      if (score >= 80) return "Good job! You showed solid understanding with room for minor improvements in depth.";
      if (score >= 70) return "Decent performance. Focus on deepening your technical knowledge and practice more.";
      return "Keep practicing! Work on building confidence and expanding your knowledge base.";
    }

    const ranked = [...SCORE_DIMENSIONS].sort((a, b) => breakdown[b] - breakdown[a]);
    const strongest = ranked[0];
    const weakest = ranked[ranked.length - 1];
    const labels = {
      clarity: 'clarity',
      structure: 'structure',
      relevance: 'relevance',
      depth: 'depth',
      communication: 'communication',
    };

    if (score >= 85) {
      return `Strong performance overall. Your ${labels[strongest]} stood out, and the answers felt mostly interview-ready. The next gain is in ${labels[weakest]}, where a little more precision would make the session even sharper.`;
    }

    if (score >= 70) {
      return `You have a solid base to build on. The session was strongest in ${labels[strongest]}, but ${labels[weakest]} held the score back. Tightening that area should make your next round noticeably stronger.`;
    }

    return `This session shows early progress, but the answers need more support in ${labels[weakest]}. Focus first on clearer structure and more direct reasoning. Once that improves, the rest of the score should rise with it.`;
  },

  generateHighlights: (score, type, breakdown = null) => {
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

    if (breakdown) {
      const ranked = [...SCORE_DIMENSIONS].sort((a, b) => breakdown[a] - breakdown[b]);
      const suggestions = {
        clarity: 'Shorten long explanations and make your main point earlier in each answer.',
        structure: 'Use a clearer beginning, middle, and outcome so the answer is easier to follow.',
        relevance: 'Answer the exact question more directly before adding supporting detail.',
        depth: 'Add one stronger example, tradeoff, or technical reason to show deeper understanding.',
        communication: 'Keep the explanation smoother and more deliberate, especially under time pressure.',
      };

      return ranked.slice(0, 2).map((key) => suggestions[key]);
    }

    return focusMap[type] || [
      'Use clearer structure so each answer has context, approach, and result.',
      'Practice slower, more deliberate explanations before adding more detail.',
    ];
  },

  getFallbackEvaluation: (type, answers = [], errorMessage = '', expectedQuestions) => {
    const heuristic = buildHeuristicBreakdown({ type, answers, expectedQuestions });
    const breakdown = normalizeBreakdown(heuristic);
    const score = scoreFromBreakdown(breakdown);
    const feedback = errorMessage
      ? `Local AI evaluation was unavailable, so a rubric-based fallback score was used. ${errorMessage}`
      : aiService.generateFeedback(score, breakdown);
    const highlights = [
      ...aiService.generateHighlights(score, type, breakdown),
      'To enable real AI scoring, start Ollama locally and keep the selected model installed.',
    ];

    return {
      score,
      breakdown,
      feedback,
      highlights,
      model: 'fallback',
      provider: 'local-fallback',
    };
  },

  evaluateInterview: async ({ type, answers, expectedQuestions }) => {
    if (!OLLAMA_ENABLED) {
      return aiService.getFallbackEvaluation(
        type,
        answers,
        'Local AI evaluation is disabled in environment settings.',
        expectedQuestions
      );
    }

    const heuristic = buildHeuristicBreakdown({ type, answers, expectedQuestions });

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
  "breakdown": {
    "clarity": 0,
    "structure": 0,
    "relevance": 0,
    "depth": 0,
    "communication": 0
  },
  "feedback": "",
  "highlights": ["", ""]
}

Rules:
- score must be an integer from 0 to 100
- breakdown values must each be integers from 0 to 100
- feedback should be 2 to 4 sentences
- highlights should contain 2 to 4 concise coaching points
- grade with a realistic interview rubric, not just based on answer length
- penalize vague, generic, or incomplete answers
- reward direct relevance, concrete examples, clear reasoning, and good structure
- overall score should roughly reflect this weighting:
  relevance 24%, clarity 22%, depth 22%, structure 20%, communication 12%

Interview type: ${type}
Expected question count: ${expectedQuestions || answers.length}

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
    const parsedBreakdown = normalizeBreakdown(parsed.breakdown, heuristic);
    const heuristicBreakdown = normalizeBreakdown(heuristic);
    const mergedBreakdown = normalizeBreakdown(
      Object.fromEntries(
        SCORE_DIMENSIONS.map((key) => [
          key,
          Math.round(parsedBreakdown[key] * 0.75 + heuristicBreakdown[key] * 0.25),
        ])
      )
    );
    const aiScore = clampScore(parsed.score);
    const rubricScore = scoreFromBreakdown(mergedBreakdown);
    const finalScore = clampScore(aiScore ? (aiScore * 0.7 + rubricScore * 0.3) : rubricScore);

    return {
      score: finalScore,
      breakdown: mergedBreakdown,
      feedback: parsed.feedback || aiService.generateFeedback(finalScore, mergedBreakdown),
      highlights:
        Array.isArray(parsed.highlights) && parsed.highlights.length > 0
          ? parsed.highlights.slice(0, 4)
          : aiService.generateHighlights(finalScore, type, mergedBreakdown),
      model: DEFAULT_MODEL,
      provider: 'ollama',
    };
  },
};
