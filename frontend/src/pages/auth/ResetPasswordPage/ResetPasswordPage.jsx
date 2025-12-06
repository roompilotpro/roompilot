import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout, PasswordRequirements } from '../../../components/auth'
import { Input, Button } from '../../../components'
import { usePasswordValidation } from '../../../hooks'
import { ROUTES } from '../../../router/routes'
import './ResetPasswordPage.css'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validation = usePasswordValidation(newPassword, confirmPassword)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validation.isValid || !validation.requirements.match) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      console.log('Password reset successfully')
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSuccess(true)
    } catch (error) {
      console.error('Password reset failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout variant="centered">
      <div className="reset-password__card">
        {!isSuccess ? (
          <>
            <div className="reset-password__icon">🔑</div>
            <h1 className="reset-password__title">Create new password</h1>
            <p className="reset-password__description">
              Your new password must be different from previously used passwords.
            </p>

            <form onSubmit={handleSubmit}>
              <Input
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                fullWidth
              />

              <Input
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
              />

              <PasswordRequirements
                requirements={{
                  ...validation.requirements,
                  match: newPassword === confirmPassword && newPassword.length > 0,
                }}
                showMatch
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={!validation.isValid || !validation.requirements.match}
              >
                Reset Password
              </Button>
            </form>
          </>
        ) : (
          <div className="reset-password__success">
            <div className="reset-password__success-icon">✓</div>
            <h2 className="reset-password__success-title">Password updated!</h2>
            <p className="reset-password__success-text">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate(ROUTES.LOGIN)}>
              Continue to Login
            </Button>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default ResetPasswordPage
