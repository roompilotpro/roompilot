/**
 * Token storage utilities for managing JWT tokens in localStorage.
 */

const TOKEN_KEY = 'roompilot_auth_token'

/**
 * Get JWT token from localStorage.
 * @returns {string|null} JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Store JWT token in localStorage.
 * @param {string} token - JWT token to store
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Remove JWT token from localStorage.
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Clean token from URL after OAuth callback.
 * Removes token query parameter to prevent exposure in browser history.
 */
export const cleanUrlToken = () => {
  const url = new URL(window.location.href)
  url.searchParams.delete('token')
  window.history.replaceState({}, document.title, url.pathname + url.search)
}
