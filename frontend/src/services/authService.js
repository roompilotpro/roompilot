import api from './api'
import { removeToken } from '../utils/tokenStorage'

/**
 * Authentication service for handling OAuth flow and user authentication.
 */

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

/**
 * Initiate Google OAuth login flow.
 * Redirects browser to Google consent screen.
 */
export const initiateGoogleLogin = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const redirectUri =
    import.meta.env.VITE_OAUTH_REDIRECT_URI || `${window.location.origin}/auth/callback`
  const scope = 'profile email'

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope,
    access_type: 'offline',
    prompt: 'consent',
  })

  window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`
}

/**
 * Exchange authorization code for JWT token.
 * @param {string} code - Authorization code from Google OAuth callback
 * @returns {Promise<{token: string, user: object, hasSelectedRole: boolean}>}
 */
export const handleCallback = async (code) => {
  const response = await api.post('/api/auth/google/callback', { code })
  return response.data
}

/**
 * Get current authenticated user.
 * @returns {Promise<object>} Current user data
 */
export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me')
  return response.data
}

/**
 * Logout current user.
 * Clears local storage and optionally calls backend logout endpoint.
 */
export const logout = async () => {
  try {
    await api.post('/api/auth/logout')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    removeToken()
  }
}

/**
 * Development authentication for testing.
 * @param {string} email - User email
 * @param {string} role - Optional role (HOST, RESIDENT, ADMIN)
 * @returns {Promise<{token: string, user: object, hasSelectedRole: boolean}>}
 */
export const devLogin = async (email, role = null) => {
  const response = await api.post('/api/auth/dev/login', { email, role })
  return response.data
}
