import { useState, useEffect } from 'react'
import { getToken, setToken as saveToken, removeToken } from '../utils/tokenStorage'
import { getCurrentUser } from '../services/authService'
import { getProfileStatus } from '../services/residentService'
import { AuthContext } from './authContext'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setTokenState] = useState(getToken())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profileCompleted, setProfileCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  /**
   * Check authentication status on mount and when token changes.
   */
  useEffect(() => {
    const checkAuth = async () => {
      const currentToken = getToken()

      if (!currentToken) {
        setIsAuthenticated(false)
        setUser(null)
        setProfileCompleted(false)
        setLoading(false)
        return
      }

      try {
        const userData = await getCurrentUser()
        setUser(userData)
        setIsAuthenticated(true)

        // Check profile completion for RESIDENT users
        if (userData.role === 'RESIDENT') {
          try {
            const status = await getProfileStatus()
            setProfileCompleted(status.profileCompleted)
          } catch (profileError) {
            // Profile not found means not completed
            console.log('Profile status check:', profileError)
            setProfileCompleted(false)
          }
        } else {
          // Non-RESIDENT users don't need profile completion
          setProfileCompleted(true)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
        setUser(null)
        setProfileCompleted(false)
        removeToken()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [token])

  /**
   * Login user with JWT token and user data.
   * @param {string} newToken - JWT token
   * @param {object} userData - User data
   * @param {boolean} isProfileCompleted - Whether profile is completed
   */
  const login = (newToken, userData, isProfileCompleted = false) => {
    saveToken(newToken)
    setTokenState(newToken)
    setUser(userData)
    setIsAuthenticated(true)
    setProfileCompleted(isProfileCompleted)
  }

  /**
   * Logout user and clear authentication state.
   */
  const logout = () => {
    removeToken()
    setTokenState(null)
    setUser(null)
    setIsAuthenticated(false)
    setProfileCompleted(false)
  }

  /**
   * Update user data (e.g., after role selection).
   * @param {object} userData - Updated user data
   */
  const updateUser = (userData) => {
    setUser(userData)
  }

  /**
   * Update profile completion status.
   * @param {boolean} completed - Whether profile is completed
   */
  const updateProfileCompleted = (completed) => {
    setProfileCompleted(completed)
  }

  const value = {
    user,
    token,
    isAuthenticated,
    profileCompleted,
    loading,
    login,
    logout,
    updateUser,
    updateProfileCompleted,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
