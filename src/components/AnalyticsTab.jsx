import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

export const AnalyticsTab = ({ interviews }) => {
  const getScoreData = () => {
    const last7Interviews = interviews.slice(0, 7).reverse();
    return {
      labels: last7Interviews.map((_, i) => `Interview ${i + 1}`),
      datasets: [{
        label: 'Score',
        data: last7Interviews.map(int => int.score || 0),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }]
    };
  };

  const getTypeDistribution = () => {
    const types = {};
    interviews.forEach(int => {
      types[int.type] = (types[int.type] || 0) + 1;
    });
    return {
      labels: Object.keys(types),
      datasets: [{
        label: 'Interviews by Type',
        data: Object.values(types),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
        ],
        borderWidth: 1,
      }]
    };
  };

  return (
    <div className="analytics-section">
      <h2>Performance Analytics</h2>
      {interviews.length > 1 ? (
        <div className="charts-container">
          <div className="chart-card">
            <h3>Score Progress (Last 7 Interviews)</h3>
            <Line data={getScoreData()} />
          </div>
          <div className="chart-card">
            <h3>Interview Types Distribution</h3>
            <Bar data={getTypeDistribution()} />
          </div>
        </div>
      ) : (
        <p>Complete more interviews to see analytics.</p>
      )}
    </div>
  );
};