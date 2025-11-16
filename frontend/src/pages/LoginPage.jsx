import { useState } from 'react'
import { Link } from 'react-router-dom'
import { initiateGoogleLogin } from '../services/authService'
import './LoginPage.css'

/**
 * Login page with Google OAuth button.
 */
const LoginPage = () => {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = () => {
    setLoading(true)
    initiateGoogleLogin()
  }

  return (
    <div className="login-page">
      {/* Header */}
      <header className="login-header">
        <div className="container">
          <nav>
            <Link to="/" className="logo">
              🚀 RoomPilot
            </Link>
            <div className="nav-menu">
              <Link to="/">Home</Link>
              <Link to="/test">Test App</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Login Content */}
      <div className="login-content">
        <div className="login-container">
          <div className="login-card">
            <div className="login-icon">
              <div className="icon-circle">🔐</div>
            </div>

            <h1>Welcome Back</h1>
            <p className="login-subtitle">Sign in to access your RoomPilot dashboard</p>

            <button onClick={handleGoogleLogin} disabled={loading} className="google-btn">
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                <g fill="none" fillRule="evenodd">
                  <path
                    d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z"
                    fill="#EA4335"
                  />
                  <path
                    d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z"
                    fill="#4285F4"
                  />
                  <path
                    d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z"
                    fill="#34A853"
                  />
                </g>
              </svg>
              <span>{loading ? 'Redirecting...' : 'Sign in with Google'}</span>
            </button>

            <div className="login-divider">
              <span>or</span>
            </div>

            <div className="dev-login-info">
              <p>For development testing:</p>
              <code>POST /api/auth/dev/login</code>
            </div>

            <p className="login-footer">
              Authorized users only • Secure authentication via Google OAuth 2.0
            </p>
          </div>

          <div className="login-features">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <h3>Secure Access</h3>
                <p>Enterprise-grade security with Google OAuth</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <h3>Role-Based Access</h3>
                <p>Different dashboards for hosts, residents, and admins</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <h3>Instant Setup</h3>
                <p>Get started in seconds with your Google account</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
