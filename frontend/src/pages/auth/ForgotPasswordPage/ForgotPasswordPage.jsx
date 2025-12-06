import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../../../components/auth'
import { Input, Button } from '../../../components'
import { ROUTES } from '../../../router/routes'
import './ForgotPasswordPage.css'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      console.log('Password reset requested for:', email)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSuccess(true)
    } catch (error) {
      console.error('Reset request failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    console.log('Resending email to:', email)
    // Resend logic
  }

  return (
    <AuthLayout variant="centered">
      <div className="forgot-password__card">
        {!isSuccess ? (
          <>
            <div className="forgot-password__icon">🔒</div>
            <h1 className="forgot-password__title">Reset your password</h1>
            <p className="forgot-password__description">
              Enter the email address associated with your account and we'll send you a link to
              reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />

              <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
                Send reset link
              </Button>
            </form>

            <p className="forgot-password__back-link">
              <Link to={ROUTES.LOGIN}>← Back to login</Link>
            </p>
          </>
        ) : (
          <div className="forgot-password__success">
            <div className="forgot-password__success-icon">✉️</div>
            <h2 className="forgot-password__success-title">Check your email</h2>
            <p className="forgot-password__success-text">We've sent a password reset link to:</p>
            <div className="forgot-password__email-sent">{email}</div>
            <p className="forgot-password__success-text">
              Click the link in the email to create a new password. The link will expire in 24
              hours.
            </p>
            <p className="forgot-password__back-link">
              <Link to={ROUTES.LOGIN}>← Back to login</Link>
            </p>
            <p className="forgot-password__resend">
              Didn't receive the email?{' '}
              <button type="button" onClick={handleResend}>
                Resend
              </button>
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
