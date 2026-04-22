import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 20,
      },
      grid: {
        color: 'rgba(15, 23, 42, 0.08)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(15, 23, 42, 0.08)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

export const AnalyticsTab = ({ metrics }) => {
  const hasChartData = metrics.totalSessions > 0;

  return (
    <div className="analytics-section">
      <div className="panel-head analytics-head">
        <div>
          <span className="eyebrow">Insights</span>
          <h2>Performance Analytics</h2>
        </div>
        <p className="section-copy">
          These numbers now separate started sessions from completed reviews, so the counts and graphs stay accurate.
        </p>
      </div>

      {hasChartData ? (
        <>
          <div className="analytics-summary-grid">
            <div className="analytics-mini-card">
              <span>Total sessions</span>
              <strong>{metrics.totalSessions}</strong>
            </div>
            <div className="analytics-mini-card">
              <span>Completed reviews</span>
              <strong>{metrics.completedSessions}</strong>
            </div>
            <div className="analytics-mini-card">
              <span>Completion rate</span>
              <strong>{metrics.completionRate}%</strong>
            </div>
            <div className="analytics-mini-card">
              <span>Average score</span>
              <strong>{metrics.averageScore}%</strong>
            </div>
          </div>

          <div className="charts-container charts-container-balanced">
            <div className="chart-card chart-card-wide">
              <div className="chart-card-head">
                <h3>Score Trend</h3>
                <p>Your most recent completed interview scores.</p>
              </div>
              <div className="chart-canvas-wrap">
                <Line data={metrics.scoreTrendData} options={lineOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card-head">
                <h3>Session Duration</h3>
                <p>How long your recent completed sessions lasted.</p>
              </div>
              <div className="chart-canvas-wrap">
                <Bar data={metrics.durationTrendData} options={barOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card-head">
                <h3>Interview Type Mix</h3>
                <p>The formats you practice most often.</p>
              </div>
              <div className="chart-canvas-wrap">
                <Bar data={metrics.typeDistributionData} options={barOptions} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="analytics-empty">
          <span className="eyebrow">No Data Yet</span>
          <h3>Complete more interviews to unlock analytics</h3>
          <p>Once you start and finish a few sessions, this area will show progress, duration, and format trends.</p>
        </div>
      )}
    </div>
  );
};
