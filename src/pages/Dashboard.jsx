import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useInterviews } from '../hooks/useInterviews';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { DashboardHeader } from '../components/DashboardHeader';
import { OverviewTab } from '../components/OverviewTab';
import { HistoryTab } from '../components/HistoryTab';
import { AnalyticsTab } from '../components/AnalyticsTab';
import { PracticeTab } from '../components/PracticeTab';
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
  const latestCompletedScore = useMemo(
    () => (completionState?.interviewComplete ? completionState.score : interviews[0]?.score),
    [completionState, interviews]
  );
  const headline = interviews.length > 0
    ? 'Keep the streak alive and sharpen the weak spots.'
    : 'Start your first mock session and build your interview baseline.';

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
              <strong>{interviews.length}</strong>
            </div>
            <div className="hero-metric">
              <span>Latest Score</span>
              <strong>{latestCompletedScore ? `${latestCompletedScore}%` : 'N/A'}</strong>
            </div>
          </div>
        </section>

        {completionState?.interviewComplete && (
          <div className="inline-banner">
            <strong>Interview completed.</strong> Your {completionState.type} session scored{' '}
            {completionState.score}% and has been added to your history.
          </div>
        )}

        <div className="dashboard-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            Interview History
          </button>
          <button
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={activeTab === 'practice' ? 'active' : ''}
            onClick={() => setActiveTab('practice')}
          >
            Practice
          </button>
        </div>

        {interviews.length === 0 && activeTab === 'overview' && (
          <section className="empty-spotlight">
            <span className="eyebrow">First Session</span>
            <h3>No interviews yet</h3>
            <p>
              Start with a technical or behavioral round to unlock analytics, history, and
              progress trends across your sessions.
            </p>
          </section>
        )}

        {activeTab === 'overview' && <OverviewTab interviews={interviews} />}
        {activeTab === 'history' && <HistoryTab interviews={interviews} />}
        {activeTab === 'analytics' && <AnalyticsTab interviews={interviews} />}
        {activeTab === 'practice' && <PracticeTab />}
      </div>
    </ErrorBoundary>
  );
}

export default Dashboard;
