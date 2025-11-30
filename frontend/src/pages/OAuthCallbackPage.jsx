import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { handleCallback } from '../services/authService'

/**
 * OAuth callback page.
 * Handles Google OAuth redirect, exchanges code for token, and redirects based on user role.
 */
const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState(null)

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')

      if (errorParam) {
        setError('Authentication cancelled or failed')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      if (!code) {
        setError('No authorization code received')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      try {
        const response = await handleCallback(code)
        const { token, user, hasSelectedRole } = response

        // Login user with token and user data
        login(token, user)

        // Redirect based on role
        if (!hasSelectedRole || user.role === null) {
          navigate('/onboarding/role-selection')
        } else if (user.role === 'ADMIN') {
          navigate('/admin/dashboard')
        } else if (user.role === 'HOST') {
          navigate('/host/dashboard')
        } else if (user.role === 'RESIDENT') {
          navigate('/resident/dashboard')
        } else {
          navigate('/')
        }
      } catch (err) {
        console.error('OAuth callback error:', err)
        setError('Authentication failed. Please try again.')
        setTimeout(() => navigate('/login'), 3000)
      }
    }

    processCallback()
  }, [searchParams, navigate, login])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        {error ? (
          <>
            <h2 style={{ color: '#d32f2f' }}>Error</h2>
            <p>{error}</p>
            <p style={{ fontSize: '14px', color: '#666' }}>Redirecting to login...</p>
          </>
        ) : (
          <>
            <h2>Authenticating...</h2>
            <div style={{ marginTop: '1rem' }}>
              <div
                className="spinner"
                style={{
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #3498db',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto',
                }}
              />
            </div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </>
        )}
      </div>
    </div>
  )
}

export default OAuthCallbackPage
