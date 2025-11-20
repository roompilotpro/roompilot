import { createContext, useState, useEffect } from 'react';
import { getToken, setToken as saveToken, removeToken } from '../utils/tokenStorage';
import { getCurrentUser } from '../services/authService';

/**
 * Authentication context for managing global auth state.
 */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Check authentication status on mount and when token changes.
   */
  useEffect(() => {
    const checkAuth = async () => {
      const currentToken = getToken();

      if (!currentToken) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  /**
   * Login user with JWT token and user data.
   * @param {string} newToken - JWT token
   * @param {object} userData - User data
   */
  const login = (newToken, userData) => {
    saveToken(newToken);
    setTokenState(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * Logout user and clear authentication state.
   */
  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Update user data (e.g., after role selection).
   * @param {object} userData - Updated user data
   */
  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
