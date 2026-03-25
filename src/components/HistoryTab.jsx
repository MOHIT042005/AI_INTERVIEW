import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HistoryTab = ({ interviews }) => {
  const navigate = useNavigate();

  return (
    <div className="interview-history">
      <h2>Interview History</h2>
      {interviews.length > 0 ? (
        <div className="history-list">
          {interviews.map((interview) => (
            <div key={interview.id} className="history-item">
              <div className="history-header">
                <h3>{interview.topic}</h3>
                <span className="interview-type">{interview.type}</span>
              </div>
              <div className="history-details">
                <p><strong>Date:</strong> {new Date(interview.created_at).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> {interview.duration || 0} minutes</p>
                <p><strong>Score:</strong> {interview.score ? `${interview.score}%` : 'Not completed'}</p>
              </div>
              {interview.feedback && (
                <div className="history-feedback">
                  <h4>Feedback</h4>
                  <p>{interview.feedback}</p>
                </div>
              )}
              <button
                className="history-link-btn"
                onClick={() => navigate(`/results?id=${interview.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No interview history available.</p>
      )}
    </div>
  );
};
