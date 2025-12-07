import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../../../components/auth'
import { Input, Button } from '../../../components'
import { ROUTES } from '../../../router/routes'

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
      <div className="bg-white rounded-2xl py-10 px-8 sm:py-8 sm:px-6 shadow-md">
        {!isSuccess ? (
          <>
            <div className="w-16 h-16 bg-primary-bg rounded-full flex items-center justify-center mx-auto mb-6 text-[2rem]">🔒</div>
            <h1 className="font-display text-[1.875rem] sm:text-2xl font-bold text-midnight mb-3 text-center">Reset your password</h1>
            <p className="text-center text-slate mb-8 text-base leading-relaxed">
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

            <p className="text-center text-sm text-slate mt-4">
              <Link to={ROUTES.LOGIN} className="text-primary no-underline font-semibold hover:underline">← Back to login</Link>
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-accent-bg rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">✉️</div>
            <h2 className="font-display text-[1.75rem] sm:text-2xl font-bold text-midnight mb-4">Check your email</h2>
            <p className="text-slate leading-relaxed mb-4">We've sent a password reset link to:</p>
            <div className="bg-primary-bg p-4 rounded-lg mb-4 font-semibold text-primary">{email}</div>
            <p className="text-slate leading-relaxed mb-4">
              Click the link in the email to create a new password. The link will expire in 24
              hours.
            </p>
            <p className="text-center text-sm text-slate mt-4">
              <Link to={ROUTES.LOGIN} className="text-primary no-underline font-semibold hover:underline">← Back to login</Link>
            </p>
            <p className="text-sm text-slate mt-4">
              Didn't receive the email?{' '}
              <button type="button" onClick={handleResend} className="bg-transparent border-none text-primary font-semibold cursor-pointer font-body text-sm p-0 hover:underline">
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
