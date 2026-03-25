import React from 'react';
import { useNavigate } from 'react-router-dom';

export const OverviewTab = ({ interviews }) => {
  const navigate = useNavigate();

  const getAverageScore = () => {
    if (interviews.length === 0) return 0;
    const total = interviews.reduce((sum, interview) => sum + (interview.score || 0), 0);
    return Math.round(total / interviews.length);
  };

  const getTotalPracticeHours = () => {
    const totalMinutes = interviews.reduce((sum, int) => sum + (int.duration || 0), 0);
    return Math.round((totalMinutes / 60) * 10) / 10;
  };

  const getImprovement = () => {
    if (interviews.length <= 1) return '--';
    const latestScore = interviews[0]?.score || 0;
    const earliestScore = interviews[interviews.length - 1]?.score || 0;
    return Math.round(latestScore - earliestScore);
  };

  const startInterview = (type) => {
    navigate(`/interview?type=${type}`);
  };

  return (
    <div className="dashboard-content">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Interviews</h3>
          <p className="stat-number">{interviews.length}</p>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <p className="stat-number">{getAverageScore()}%</p>
        </div>
        <div className="stat-card">
          <h3>Practice Hours</h3>
          <p className="stat-number">{getTotalPracticeHours()}</p>
        </div>
        <div className="stat-card">
          <h3>Improvement</h3>
          <p className="stat-number">{getImprovement()}%</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Start</h2>
        <div className="action-buttons">
          <button onClick={() => startInterview('technical')} className="action-btn">
            Technical Interview
          </button>
          <button onClick={() => startInterview('behavioral')} className="action-btn">
            Behavioral Interview
          </button>
          <button onClick={() => startInterview('system-design')} className="action-btn">
            System Design
          </button>
          <button onClick={() => startInterview('mock')} className="action-btn">
            Full Mock Interview
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Interviews</h2>
        {interviews.length > 0 ? (
          <div className="recent-list">
            {interviews.slice(0, 3).map((interview) => (
              <div key={interview.id} className="recent-item">
                <div className="interview-info">
                  <h4>{interview.topic}</h4>
                  <p>{interview.type} | {new Date(interview.created_at).toLocaleDateString()}</p>
                </div>
                <div className="interview-score">
                  {interview.score ? `${interview.score}%` : 'In Progress'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No interviews yet. Start your first practice session!</p>
        )}
      </div>
    </div>
  );
};
