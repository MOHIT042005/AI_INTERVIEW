import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useInterviews } from '../hooks/useInterviews';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { DashboardHeader } from '../components/DashboardHeader';
import { OverviewTab } from '../components/OverviewTab';
import { HistoryTab } from '../components/HistoryTab';
import { AnalyticsTab } from '../components/AnalyticsTab';
import { PracticeTab } from '../components/PracticeTab';
import { deriveDashboardMetrics, getTrackedInterviews } from '../utils/dashboardMetrics';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const { interviews, loading, error } = useInterviews();
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  const completionState = location.state;
  const trackedInterviews = useMemo(() => getTrackedInterviews(interviews), [interviews]);
  const metrics = useMemo(() => deriveDashboardMetrics(trackedInterviews), [trackedInterviews]);
  const latestCompletedScore = completionState?.interviewComplete
    ? completionState.score
    : metrics.latestCompletedScore;
  const headline = trackedInterviews.length > 0
    ? 'Review progress and keep improving the weak spots.'
    : 'Start your first mock session and set a baseline.';
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'Interview History' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'practice', label: 'Practice' },
  ];

  if (error) {
    return (
      <div className="state-screen">
        <div className="state-card state-error">
          <span className="eyebrow">Dashboard Unavailable</span>
          <h2>Error loading dashboard</h2>
          <p>{error}</p>
          <p>Your login worked, but the dashboard could not load interview data.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="state-screen">
        <div className="state-card">
          <div className="spinner"></div>
          <h2>Loading dashboard...</h2>
          <p>Pulling your interview history, scores, and practice insights.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="dashboard-container">
        <DashboardHeader />

        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Performance Snapshot</span>
            <h2>Your interview workspace</h2>
            <p>{headline}</p>
          </div>
          <div className="dashboard-hero-metrics">
            <div className="hero-metric">
              <span>Sessions</span>
              <strong>{metrics.totalSessions}</strong>
            </div>
            <div className="hero-metric">
              <span>Completed</span>
              <strong>{metrics.completedSessions}</strong>
            </div>
            <div className="hero-metric">
              <span>Latest Score</span>
              <strong>{latestCompletedScore !== null ? `${latestCompletedScore}%` : 'N/A'}</strong>
            </div>
          </div>
        </section>

        {completionState?.interviewComplete && (
          <div className="inline-banner">
            <strong>Interview completed.</strong> Your {completionState.type} session scored {completionState.score}%.
          </div>
        )}

        <div className="dashboard-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {trackedInterviews.length === 0 && activeTab === 'overview' && (
          <section className="empty-spotlight">
            <span className="eyebrow">First Session</span>
            <h3>No interviews yet</h3>
            <p>
              Start with a technical or behavioral round to unlock analytics and session history.
            </p>
          </section>
        )}

        {activeTab === 'overview' && <OverviewTab interviews={trackedInterviews} metrics={metrics} />}
        {activeTab === 'history' && <HistoryTab interviews={trackedInterviews} />}
        {activeTab === 'analytics' && <AnalyticsTab metrics={metrics} />}
        {activeTab === 'practice' && <PracticeTab />}
      </div>
    </ErrorBoundary>
  );
}

export default Dashboard;
