import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout, OAuthButtons } from '../../../components/auth'
import { Input, Checkbox, Button } from '../../../components'
import { ROUTES } from '../../../router/routes'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleGoogleLogin = () => {
    console.log('Google login initiated')
    // OAuth flow would be implemented here
  }

  const handleAppleLogin = () => {
    console.log('Apple login initiated')
    // OAuth flow would be implemented here
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      console.log('Login submitted:', formData)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate based on user role (would come from API response)
      navigate(ROUTES.LANDLORD.DASHBOARD)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      variant="split"
      panelIcon="🏠"
      panelTitle="Welcome back to RoomPilot"
      panelDescription="Your next perfect room is waiting. Sign in to continue your search or manage your listings."
    >
      <h1 className="login-page__title">Log in</h1>
      <p className="login-page__subtitle">Enter your credentials to access your account</p>

      <OAuthButtons onGoogleClick={handleGoogleLogin} onAppleClick={handleAppleLogin} />

      <div className="login-page__divider">
        <span>or</span>
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          fullWidth
        />

        <Input
          type="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          fullWidth
        />

        <div className="login-page__form-row">
          <Checkbox
            name="rememberMe"
            label="Remember me"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <Link to={ROUTES.FORGOT_PASSWORD} className="login-page__forgot-link">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
          Log In
        </Button>
      </form>

      <p className="login-page__signup-link">
        Don't have an account? <Link to={ROUTES.SIGNUP}>Sign up</Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage
