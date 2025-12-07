import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { OAuthButtons, PasswordStrength } from '../../../components/auth'
import { Input, Checkbox, Button } from '../../../components'
import { usePasswordValidation } from '../../../hooks'
import { ROUTES } from '../../../router/routes'
import { classNames } from '../../../utils'

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
    <div className="font-body bg-gradient-to-br from-snow to-cloud min-h-screen flex flex-col text-midnight p-8 sm:p-4">
      <div className="max-w-[480px] mx-auto w-full">
        <Link to={ROUTES.SIGNUP} className="font-display text-[2rem] font-bold text-primary no-underline text-center block mb-8">
          RoomPilot
        </Link>

        <div
          className={classNames(
            'flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-semibold mx-auto mb-8',
            isHost ? 'bg-accent-bg text-accent' : 'bg-primary-bg text-primary'
          )}
        >
          <span>{isHost ? '🔑' : '🏠'}</span>
          <span>Signing up as a {isHost ? 'Host' : 'Renter'}</span>
        </div>

        <div className="bg-white rounded-2xl py-10 px-8 sm:py-8 sm:px-6 shadow-md">
          <h1 className="font-display text-[1.875rem] sm:text-2xl font-bold text-midnight mb-2 text-center">Create your account</h1>
          <p className="text-center text-slate mb-8 text-base">
            {isHost
              ? 'Start listing your rooms and connecting with renters'
              : 'Start your journey to finding the perfect room'}
          </p>

          <OAuthButtons
            mode="signup"
            onGoogleClick={handleGoogleSignup}
            onAppleClick={handleAppleSignup}
          />

          <div className="flex items-center text-center my-6 text-slate text-sm">
            <span className="flex-1 border-b border-cloud" />
            <span className="px-4">or</span>
            <span className="flex-1 border-b border-cloud" />
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

            <div className="mb-6">
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

            <div className="mb-4 [&_a]:text-primary [&_a]:no-underline [&_a:hover]:underline">
              <Checkbox
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
                label={
                  <>
                    I agree to RoomPilot's <Link to={ROUTES.TERMS}>Terms of Service</Link> and{' '}
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

          <p className="text-center mt-6 text-sm text-slate">
            Already have an account? <Link to={ROUTES.LOGIN} className="text-primary no-underline font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupFormPage
