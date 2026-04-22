import { apiRequest } from '../config/api';

export const userService = {
  fetchProfile: async () => {
    const payload = await apiRequest('/profile');
    return payload.profile;
  },

  updateProfile: async (updates) => {
    const payload = await apiRequest('/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });

    return payload.profile;
  },
};
