import {
  apiRequest,
  clearStoredToken,
  normalizeUser,
  setStoredToken,
} from '../config/api';

const persistAuth = (payload) => {
  if (payload?.token) {
    setStoredToken(payload.token);
  }

  return {
    ...payload,
    user: normalizeUser(payload?.user),
  };
};

export const authService = {
  signup: async (email, password, fullName) => {
    const payload = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });

    return persistAuth(payload);
  },

  login: async (email, password) => {
    const payload = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    return persistAuth(payload);
  },

  getCurrentUser: async () => {
    const payload = await apiRequest('/auth/me');
    return normalizeUser(payload.user);
  },

  logout: async () => {
    clearStoredToken();
  },

  resetPassword: async (email) => {
    await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};
