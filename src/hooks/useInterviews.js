import { useState, useEffect, useCallback } from 'react';
import { interviewService } from '../services/interviewService';
import { useAuth } from '../context/AuthContext';

export const useInterviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInterviews = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await interviewService.fetchUserInterviews(user.id);
      setInterviews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const createInterview = async (type) => {
    try {
      const data = await interviewService.createInterview(user.id, type);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateInterview = async (interviewId, score, duration, feedback, metadata) => {
    try {
      await interviewService.updateInterview(interviewId, score, duration, feedback, metadata);
      // Refresh interviews after update
      await fetchInterviews();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    interviews,
    loading,
    error,
    fetchInterviews,
    createInterview,
    updateInterview,
  };
};
