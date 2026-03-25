import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { interviewService } from '../services/interviewService';

function Results() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const [storedInterview, setStoredInterview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const interviewId = state?.interviewId || searchParams.get('id');

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId || state?.interviewComplete) {
        return;
      }

      try {
        setLoading(true);
        setLoadError('');
        const data = await interviewService.fetchInterviewById(interviewId);
        setStoredInterview(data);
      } catch (err) {
        setLoadError(err.message || 'Unable to load saved interview details.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, state]);

  const resultState = useMemo(() => {
    if (state?.interviewComplete) {
      return state;
    }

    if (!storedInterview) {
      return null;
    }

    return {
      interviewComplete: true,
      interviewId: storedInterview.id,
      score: storedInterview.score,
      type: storedInterview.type,
      feedback: storedInterview.feedback,
      duration: storedInterview.duration,
      answers: storedInterview.answer_log || [],
      highlights: storedInterview.highlights || [],
    };
  }, [state, storedInterview]);

  if (loading) {
    return (
      <div className="state-screen">
        <div className="state-card">
          <div className="spinner"></div>
          <h2>Loading results...</h2>
          <p>Pulling your saved interview summary.</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="state-screen">
        <div className="state-card state-error">
          <span className="eyebrow">Results Unavailable</span>
          <h2>Could not load saved interview details</h2>
          <p>{loadError}</p>
          <button className="state-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!resultState?.interviewComplete) {
    return (
      <div className="state-screen">
        <div className="state-card">
          <span className="eyebrow">No Results</span>
          <h2>No interview results to show</h2>
          <p>Finish an interview first, then we will bring you back here with your summary.</p>
          <button className="state-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const {
    score,
    type,
    feedback,
    duration,
    answers = [],
    highlights = [],
    evaluationModel,
    evaluationProvider,
  } = resultState;

  const scoreTone =
    score >= 85 ? 'score-excellent' :
    score >= 70 ? 'score-good' :
    'score-improving';

  return (
    <div className="results-page">
      <section className="results-hero">
        <div>
          <span className="eyebrow">Session Complete</span>
          <h1>{type} interview review</h1>
          <p>Your latest mock is now saved. Use this summary to decide what to practice next.</p>
        </div>
        <div className={`results-score-card ${scoreTone}`}>
          <span>Overall Score</span>
          <strong>{score}%</strong>
        </div>
      </section>

      <section className="results-grid">
        <article className="results-panel">
          <h2>Performance summary</h2>
          <p>{feedback}</p>
          <div className="results-stats">
            <div>
              <span>Interview Type</span>
              <strong>{type}</strong>
            </div>
            <div>
              <span>Duration</span>
              <strong>{duration} min</strong>
            </div>
            <div>
              <span>Responses Saved</span>
              <strong>{answers.length}</strong>
            </div>
            <div>
              <span>Evaluation</span>
              <strong>{evaluationProvider === 'ollama' ? evaluationModel : 'Fallback'}</strong>
            </div>
          </div>
        </article>

        <article className="results-panel">
          <h2>Focus areas</h2>
          <div className="results-list">
            {highlights.map((item) => (
              <div key={item} className="results-list-item">{item}</div>
            ))}
          </div>
        </article>
      </section>

      <section className="results-panel">
        <div className="results-panel-head">
          <h2>Answer recap</h2>
          <p>Review the way you responded so you can spot patterns before the next round.</p>
        </div>
        <div className="results-answer-list">
          {answers.length > 0 ? (
            answers.map((entry, index) => (
              <div key={`${entry.question}-${index}`} className="results-answer-card">
                <span className="results-answer-index">Question {index + 1}</span>
                <h3>{entry.question}</h3>
                <p>{entry.answer}</p>
              </div>
            ))
          ) : (
            <p>No answers were recorded for this interview.</p>
          )}
        </div>
      </section>

      <div className="results-actions">
        <Link to="/dashboard" className="nav-btn dashboard-link">Back To Dashboard</Link>
        <Link to={`/interview?type=${type.toLowerCase()}`} className="nav-btn login-link">Retry This Format</Link>
        <Link to="/profile" className="nav-btn dashboard-link">Profile And Settings</Link>
      </div>
    </div>
  );
}

export default Results;
