import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { OAuthButtons, PasswordStrength } from '../../../components/auth'
import { Input, Checkbox, Button } from '../../../components'
import { usePasswordValidation } from '../../../hooks'
import { ROUTES } from '../../../router/routes'
import './SignupFormPage.css'

function SignupFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const role = searchParams.get('role') || 'renter'
  const isHost = role === 'host'

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    termsAccepted: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const passwordValidation = usePasswordValidation(formData.password)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleGoogleSignup = () => {
    console.log('Google signup initiated for:', role)
    // OAuth flow would be implemented here
  }

  const handleAppleSignup = () => {
    console.log('Apple signup initiated for:', role)
    // OAuth flow would be implemented here
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      console.log('Form submitted:', { ...formData, role })
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to appropriate onboarding
      if (isHost) {
        navigate(ROUTES.ONBOARDING_HOST)
      } else {
        navigate(ROUTES.ONBOARDING_RENTER)
      }
    } catch (error) {
      console.error('Signup failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-form-page">
      <div className="signup-form-page__container">
        <Link to={ROUTES.SIGNUP} className="signup-form-page__logo">
          RoomPilot
        </Link>

        <div className={`signup-form-page__role-badge ${isHost ? 'signup-form-page__role-badge--host' : ''}`}>
          <span>{isHost ? '🔑' : '🏠'}</span>
          <span>Signing up as a {isHost ? 'Host' : 'Renter'}</span>
        </div>

        <div className="signup-form-page__card">
          <h1 className="signup-form-page__title">Create your account</h1>
          <p className="signup-form-page__subtitle">
            {isHost
              ? 'Start listing your rooms and connecting with renters'
              : 'Start your journey to finding the perfect room'}
          </p>

          <OAuthButtons
            mode="signup"
            onGoogleClick={handleGoogleSignup}
            onAppleClick={handleAppleSignup}
          />

          <div className="signup-form-page__divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              fullWidth
            />

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

            <div className="signup-form-page__password-group">
              <Input
                type="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
              />
              <PasswordStrength
                strength={passwordValidation.strength}
                strengthLevel={passwordValidation.strengthLevel}
                strengthLabel={passwordValidation.strengthLabel}
              />
            </div>

            <Input
              type="tel"
              name="phone"
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              required
              fullWidth
            />

            <div className="signup-form-page__terms">
              <Checkbox
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
                label={
                  <>
                    I agree to RoomPilot's{' '}
                    <Link to={ROUTES.TERMS}>Terms of Service</Link> and{' '}
                    <Link to={ROUTES.PRIVACY}>Privacy Policy</Link>
                  </>
                }
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={!formData.termsAccepted}
            >
              Create Account
            </Button>
          </form>

          <p className="signup-form-page__login-link">
            Already have an account? <Link to={ROUTES.LOGIN}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupFormPage
