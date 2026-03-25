import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

export const useProfiles = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await userService.fetchProfile(user.id);
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates) => {
    try {
      await userService.updateProfile(user.id, updates);
      // Refresh profile after update
      await fetchProfile();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
};
