import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PracticeTab = () => {
  const navigate = useNavigate();

  const startInterview = (type) => {
    navigate(`/interview?type=${type}`);
  };

  return (
    <div className="practice-section">
      <h2>Practice Modes</h2>
      <div className="practice-modes">
        <div className="practice-card">
          <h3>Quick Practice</h3>
          <p>5-10 minute focused practice sessions</p>
          <button onClick={() => startInterview('quick')} className="practice-btn">
            Start Quick Practice
          </button>
        </div>
        <div className="practice-card">
          <h3>Full Interview</h3>
          <p>Complete 45-60 minute mock interview</p>
          <button onClick={() => startInterview('mock')} className="practice-btn">
            Start Full Interview
          </button>
        </div>
        <div className="practice-card">
          <h3>Skill Builder</h3>
          <p>Targeted practice for specific skills</p>
          <button onClick={() => startInterview('skill')} className="practice-btn">
            Start Skill Builder
          </button>
        </div>
      </div>
    </div>
  );
};