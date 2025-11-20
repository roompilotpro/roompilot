import api from './api';

/**
 * User service for managing user profile and role selection.
 */

/**
 * Select user role during onboarding.
 * @param {string} role - Role to select (HOST or RESIDENT)
 * @returns {Promise<object>} Updated user data
 */
export const selectRole = async (role) => {
  const response = await api.post('/api/auth/role', { role });
  return response.data;
};

/**
 * Get current user profile.
 * @returns {Promise<object>} User profile data
 */
export const getProfile = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};
