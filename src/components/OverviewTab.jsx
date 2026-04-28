import React from 'react';
import { useNavigate } from 'react-router-dom';

const QUICK_ACTIONS = [
  {
    type: 'technical',
    title: 'Technical Interview',
    description: 'Problem solving, coding logic, and tradeoffs',
  },
  {
    type: 'behavioral',
    title: 'Behavioral Interview',
    description: 'Storytelling, clarity, and leadership examples',
  },
  {
    type: 'system-design',
    title: 'System Design',
    description: 'Architecture thinking, scale, and decisions',
  },
  {
    type: 'mock',
    title: 'Full Mock Interview',
    description: 'A longer session to simulate the real experience',
  },
];

export const OverviewTab = ({ interviews, metrics }) => {
  const navigate = useNavigate();
  const recentInterview = metrics.recentInterview;

  const startInterview = (type) => {
    navigate(`/interview?type=${type}`);
  };

  return (
    <div className="dashboard-overview">
      <section className="stats-grid dashboard-stats-grid">
        <div className="stat-card stat-card-featured">
          <h3>Total Sessions</h3>
          <p className="stat-number">{metrics.totalSessions}</p>
          <span className="stat-note">Every mock session you have started so far</span>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <p className="stat-number">{metrics.averageScore}%</p>
          <span className="stat-note">Calculated only from completed interview reviews</span>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{metrics.completedSessions}</p>
          <span className="stat-note">{metrics.completionRate}% of your started sessions were finished</span>
        </div>
        <div className="stat-card">
          <h3>Practice Hours</h3>
          <p className="stat-number">{metrics.totalPracticeHours}</p>
          <span className="stat-note">
            Improvement {metrics.improvement === null ? 'N/A' : `${metrics.improvement}%`} from earliest to latest completed session
          </span>
        </div>
      </section>

      <div className="dashboard-main-grid">
        <div className="dashboard-primary-column">
          <section className="quick-actions dashboard-panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">Start Strong</span>
                <h2>Quick Start</h2>
              </div>
              <p className="section-copy">
                Choose a format and begin.
              </p>
            </div>
            <div className="action-buttons action-buttons-rich">
              {QUICK_ACTIONS.map((action) => (
                <button key={action.type} onClick={() => startInterview(action.type)} className="action-btn">
                  <strong>{action.title}</strong>
                  <span>{action.description}</span>
                </button>
              ))}
            </div>
          </section>

          {recentInterview && (
            <section className="quick-actions dashboard-panel focus-panel">
              <div className="panel-head">
                <div>
                <span className="eyebrow">Recommended Next</span>
                <h2>Current focus</h2>
              </div>
              <p className="section-copy">
                Your latest session was <strong>{recentInterview.topic}</strong>. Retry it or balance it with a different format.
              </p>
            </div>
              <div className="action-buttons">
                <button onClick={() => startInterview(recentInterview.type)} className="action-btn">
                  Retry {recentInterview.type}
                </button>
                <button onClick={() => startInterview('behavioral')} className="action-btn">
                  Balance With Behavioral
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className="dashboard-secondary-column">
          <section className="recent-activity dashboard-panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">Recent Activity</span>
                <h2>Latest interviews</h2>
              </div>
              <p className="section-copy">
                Most practiced: {metrics.topPracticeType}.
              </p>
            </div>
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
              <p>No interviews yet. Start your first practice session to unlock your timeline.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};
