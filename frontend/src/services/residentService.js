import api from './api'

/**
 * Service for resident profile API operations.
 */

/**
 * Create a new resident profile.
 * @param {Object} profileData - The profile data
 * @param {string} profileData.bio - Bio (50-1000 characters)
 * @param {string} profileData.employmentStatus - Employment status enum value
 * @param {string} [profileData.phone] - Optional phone number
 * @returns {Promise<Object>} The created profile
 */
export const createResidentProfile = async (profileData) => {
  const response = await api.post('/api/residents/profile', profileData)
  return response.data
}

/**
 * Get the current user's resident profile.
 * @returns {Promise<Object>} The resident profile
 */
export const getResidentProfile = async () => {
  const response = await api.get('/api/residents/profile')
  return response.data
}

/**
 * Update the current user's resident profile.
 * @param {Object} profileData - The profile data to update
 * @param {string} profileData.bio - Bio (50-1000 characters)
 * @param {string} profileData.employmentStatus - Employment status enum value
 * @param {string} [profileData.phone] - Optional phone number
 * @returns {Promise<Object>} The updated profile
 */
export const updateResidentProfile = async (profileData) => {
  const response = await api.put('/api/residents/profile', profileData)
  return response.data
}

/**
 * Check if the current user's profile is completed.
 * @returns {Promise<Object>} Object with profileCompleted boolean
 */
export const getProfileStatus = async () => {
  const response = await api.get('/api/residents/profile/status')
  return response.data
}

/**
 * Get all available employment status options.
 * @returns {Promise<Array>} Array of employment status options with value, label, description
 */
export const getEmploymentStatuses = async () => {
  const response = await api.get('/api/residents/employment-statuses')
  return response.data
}
