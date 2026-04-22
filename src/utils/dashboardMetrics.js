const TYPE_LABELS = {
  technical: 'Technical',
  behavioral: 'Behavioral',
  'system-design': 'System Design',
  mock: 'Mock',
  quick: 'Quick',
  skill: 'Skill',
};

const isCompletedInterview = (interview) =>
  Boolean(interview?.completed_at || interview?.score !== null || interview?.feedback);

const formatSessionLabel = (value, fallbackIndex) => {
  if (!value) {
    return `Session ${fallbackIndex + 1}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `Session ${fallbackIndex + 1}`;
  }

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const deriveDashboardMetrics = (interviews = []) => {
  const totalSessions = interviews.length;
  const completedInterviews = interviews.filter(isCompletedInterview);
  const completedSessions = completedInterviews.length;
  const scoredInterviews = completedInterviews.filter((item) => typeof item.score === 'number');
  const totalPracticeMinutes = interviews.reduce((sum, item) => sum + (item.duration || 0), 0);
  const totalPracticeHours = Math.round((totalPracticeMinutes / 60) * 10) / 10;
  const averageScore = scoredInterviews.length
    ? Math.round(scoredInterviews.reduce((sum, item) => sum + item.score, 0) / scoredInterviews.length)
    : 0;
  const latestCompletedScore = scoredInterviews[0]?.score ?? null;
  const earliestCompletedScore = scoredInterviews[scoredInterviews.length - 1]?.score ?? null;
  const improvement =
    latestCompletedScore !== null && earliestCompletedScore !== null && scoredInterviews.length > 1
      ? Math.round(latestCompletedScore - earliestCompletedScore)
      : null;
  const completionRate = totalSessions
    ? Math.round((completedSessions / totalSessions) * 100)
    : 0;

  const typeCounts = interviews.reduce((acc, interview) => {
    const key = interview.type || 'other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const scoreTrendSessions = scoredInterviews.slice(0, 6).reverse();
  const durationTrendSessions = completedInterviews.slice(0, 6).reverse();
  const topPracticeType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    totalSessions,
    completedSessions,
    averageScore,
    totalPracticeHours,
    improvement,
    latestCompletedScore,
    completionRate,
    topPracticeType: topPracticeType ? TYPE_LABELS[topPracticeType] || topPracticeType : 'N/A',
    recentInterview: interviews[0] || null,
    scoreTrendData: {
      labels: scoreTrendSessions.map((item, index) => formatSessionLabel(item.completed_at || item.created_at, index)),
      datasets: [
        {
          label: 'Score',
          data: scoreTrendSessions.map((item) => item.score || 0),
          borderColor: '#0b84d8',
          backgroundColor: 'rgba(11, 132, 216, 0.16)',
          borderWidth: 3,
          tension: 0.35,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 5,
        },
      ],
    },
    durationTrendData: {
      labels: durationTrendSessions.map((item, index) => formatSessionLabel(item.completed_at || item.created_at, index)),
      datasets: [
        {
          label: 'Duration (min)',
          data: durationTrendSessions.map((item) => item.duration || 0),
          backgroundColor: 'rgba(19, 59, 92, 0.82)',
          borderRadius: 10,
          maxBarThickness: 34,
        },
      ],
    },
    typeDistributionData: {
      labels: Object.keys(typeCounts).map((key) => TYPE_LABELS[key] || key),
      datasets: [
        {
          label: 'Sessions',
          data: Object.values(typeCounts),
          backgroundColor: ['#0b84d8', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#334155'],
          borderRadius: 10,
          maxBarThickness: 38,
        },
      ],
    },
  };
};
