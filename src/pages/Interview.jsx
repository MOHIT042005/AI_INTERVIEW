import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useInterviews } from '../hooks/useInterviews';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/aiService';
import { ErrorBoundary } from '../components/ErrorBoundary';

const INTERVIEW_QUESTIONS = {
  technical: [
    'Explain how a binary search algorithm works.',
    'What is the difference between let, const, and var in JavaScript?',
    'How would you optimize a slow database query?',
    'Explain the concept of closures in JavaScript.',
    'What are React hooks and how do they work?'
  ],
  behavioral: [
    'Tell me about a time when you faced a difficult challenge at work.',
    'How do you handle conflicts with team members?',
    'Describe a situation where you had to learn something new quickly.',
    'How do you prioritize tasks when you have multiple deadlines?',
    "Tell me about a project you worked on that you're particularly proud of."
  ],
  'system-design': [
    'Design a URL shortening service like bit.ly.',
    'How would you design a notification system for a large-scale application?',
    'Design a caching system for a high-traffic website.',
    'How would you implement a rate limiter for an API?',
    'Design a chat system that can handle millions of users.'
  ],
  mock: [
    'Introduce yourself and tell us about your background.',
    'Why are you interested in this position?',
    'What are your strengths and weaknesses?',
    'Where do you see yourself in 5 years?',
    'Do you have any questions for us?'
  ],
  quick: [
    'What is your favorite programming language and why?',
    'Explain a complex concept in simple terms.',
    'How do you stay updated with technology trends?'
  ],
  skill: [
    'Walk me through your problem-solving process.',
    'How do you approach debugging a complex issue?',
    'Explain your experience with version control.',
    'How do you ensure code quality?',
    'Tell me about your testing approach.'
  ]
};

function Interview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createInterview, updateInterview } = useInterviews();
  const interviewType = searchParams.get('type') || 'technical';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draftAnswer, setDraftAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);

  const currentQuestions = INTERVIEW_QUESTIONS[interviewType] || INTERVIEW_QUESTIONS.technical;

  useEffect(() => {
    const initializeInterview = async () => {
      try {
        setError(null);
        const data = await createInterview(interviewType);
        setInterviewId(data.id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      initializeInterview();
    }
  }, [user?.id, interviewType, createInterview]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFinishInterview = async (submittedAnswers = answers) => {
    try {
      if (!interviewId) return;
      setEvaluating(true);

      const duration = Math.round((1800 - timeLeft) / 60);
      let evaluation;

      try {
        evaluation = await aiService.evaluateInterview({
          type: interviewType,
          answers: submittedAnswers,
        });
      } catch (evaluationError) {
        console.error('Ollama evaluation failed, using fallback:', evaluationError);
        evaluation = aiService.getFallbackEvaluation(
          interviewType,
          submittedAnswers,
          evaluationError.message
        );
      }

      const score = evaluation.score;
      const feedback = evaluation.feedback;
      const highlights = evaluation.highlights;

      await updateInterview(interviewId, score, duration, feedback, {
        answers: submittedAnswers,
        highlights,
      });

      navigate('/results', {
        state: {
          interviewComplete: true,
          interviewId,
          score,
          type: interviewType,
          feedback,
          duration,
          highlights,
          answers: submittedAnswers,
          evaluationModel: evaluation.model,
          evaluationProvider: evaluation.provider,
        },
      });
    } catch (err) {
      console.error('Error finishing interview:', err);
      setError(err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const handleAnswer = (answer) => {
    const normalizedAnswer = answer.trim();
    if (!normalizedAnswer) return;

    const nextAnswers = [
      ...answers,
      {
        question: currentQuestions[currentQuestion],
        answer: normalizedAnswer,
        timestamp: new Date(),
      },
    ];

    setAnswers(nextAnswers);
    setDraftAnswer('');

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleFinishInterview(nextAnswers);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="state-screen">
        <div className="state-card state-error">
          <span className="eyebrow">Interview Blocked</span>
          <h2>Error starting interview</h2>
          <p>{error}</p>
          <button className="state-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="state-screen">
        <div className="state-card">
          <div className="spinner"></div>
          <h2>Preparing interview...</h2>
          <p>Setting up your question flow and saving the session.</p>
        </div>
      </div>
    );
  }

  if (!currentQuestions[currentQuestion]) {
    return (
      <div className="interview-container">
        <div className="interview-card">
          <h2>Interview Complete!</h2>
          <p>Calculating your results...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="interview-container">
        <div className="interview-shell">
          <aside className="interview-sidebar">
            <span className="eyebrow">Live Session</span>
            <h1>{interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Interview</h1>
            <p>
              Stay concise, keep your examples specific, and use the progress panel to pace
              yourself.
            </p>

            <div className="interview-sidebar-card">
              <span>Question</span>
              <strong>{currentQuestion + 1} / {currentQuestions.length}</strong>
            </div>

            <div className="interview-sidebar-card">
              <span>Responses Saved</span>
              <strong>{answers.length}</strong>
            </div>

            <div className="interview-sidebar-card">
              <span>Time Left</span>
              <strong className="timer">{formatTime(timeLeft)}</strong>
            </div>

            <button className="finish-btn" onClick={() => handleFinishInterview()} disabled={evaluating}>
              {evaluating ? 'Evaluating...' : 'Finish Interview'}
            </button>
          </aside>

          <main className="interview-main">
            <div className="interview-card interview-card-accent">
              <div className="question-section">
                <span className="eyebrow">Current Prompt</span>
                <h2>{currentQuestions[currentQuestion]}</h2>
              </div>

              <div className="interview-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }}
                  ></div>
                </div>
                <p>{Math.round(((currentQuestion + 1) / currentQuestions.length) * 100)}% Complete</p>
              </div>
            </div>

            <div className="interview-card">
              <div className="answer-section">
                <div className="answer-input">
                  <textarea
                    placeholder="Structure your answer with context, approach, and outcome."
                    rows="10"
                    value={draftAnswer}
                    onChange={(e) => setDraftAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleAnswer(draftAnswer);
                      }
                    }}
                  />
                  <div className="answer-meta">
                    <p className="hint">Press Ctrl+Enter to submit your answer</p>
                    <span>{draftAnswer.trim().split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>

                <div className="answer-controls">
                  <button
                    className="record-btn"
                    onClick={() => setIsRecording(!isRecording)}
                    disabled={evaluating}
                  >
                    {isRecording ? 'Stop Recording' : 'Voice Notes'}
                  </button>
                  <button
                    className="next-btn"
                    onClick={() => handleAnswer(draftAnswer)}
                    disabled={!draftAnswer.trim() || evaluating}
                  >
                    {evaluating
                      ? 'Evaluating Answers...'
                      : currentQuestion === currentQuestions.length - 1
                        ? 'Submit And Finish'
                        : 'Save And Continue'}
                  </button>
                </div>
              </div>
            </div>

            <div className="interview-card compact-card">
              <h3>Response tips</h3>
              <p>Use one concrete example, explain your reasoning, and end with the result or tradeoff.</p>
              <div className="tips-row">
                <span className="tip-chip">Situation</span>
                <span className="tip-chip">Approach</span>
                <span className="tip-chip">Outcome</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Interview;
