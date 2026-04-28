import React from 'react';
import { useNavigate } from 'react-router-dom';

const PRACTICE_MODES = [
  {
    type: 'quick',
    title: 'Quick Practice',
    description: '5-10 minute focused practice sessions',
    cta: 'Start Quick Practice',
  },
  {
    type: 'mock',
    title: 'Full Interview',
    description: 'Complete 45-60 minute mock interview',
    cta: 'Start Full Interview',
  },
  {
    type: 'skill',
    title: 'Skill Builder',
    description: 'Targeted practice for specific skills',
    cta: 'Start Skill Builder',
  },
];

export const PracticeTab = () => {
  const navigate = useNavigate();

  const startInterview = (type) => {
    navigate(`/interview?type=${type}`);
  };

  return (
    <div className="practice-section">
      <h2>Practice Modes</h2>
      <p className="section-copy">
        Pick the amount of structure you want right now.
      </p>
      <div className="practice-modes">
        {PRACTICE_MODES.map((mode) => (
          <div key={mode.type} className="practice-card">
            <h3>{mode.title}</h3>
            <p>{mode.description}</p>
            <button onClick={() => startInterview(mode.type)} className="practice-btn">
              {mode.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
