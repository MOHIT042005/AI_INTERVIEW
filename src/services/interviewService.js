import { apiRequest } from '../config/api';

export const interviewService = {
  createInterview: async (type) => {
    const payload = await apiRequest('/interviews', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });

    return payload.interview;
  },

  fetchUserInterviews: async () => {
    const payload = await apiRequest('/interviews');
    return payload.interviews || [];
  },

  fetchInterviewById: async (interviewId) => {
    const payload = await apiRequest(`/interviews/${interviewId}`);
    return payload.interview;
  },

  updateInterview: async (interviewId, score, duration, feedback, metadata = {}) => {
    await apiRequest(`/interviews/${interviewId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        score,
        duration,
        feedback,
        answer_log: metadata.answers || [],
        highlights: metadata.highlights || [],
      }),
    });
  },
};
