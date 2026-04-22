// Basic validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test((email || '').trim());
};

export const validatePassword = (password) => {
  return (password || '').length >= 6;
};

export const validateFullName = (name) => {
  return (name || '').trim().length >= 2;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};