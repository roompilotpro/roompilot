import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout, PasswordRequirements } from '../../../components/auth'
import { Input, Button } from '../../../components'
import { usePasswordValidation } from '../../../hooks'
import { ROUTES } from '../../../router/routes'

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
      <div className="bg-white rounded-2xl py-10 px-8 sm:py-8 sm:px-6 shadow-md">
        {!isSuccess ? (
          <>
            <div className="w-16 h-16 bg-primary-bg rounded-full flex items-center justify-center mx-auto mb-6 text-[2rem]">
              🔑
            </div>
            <h1 className="font-display text-[1.875rem] sm:text-2xl font-bold text-midnight mb-3 text-center">
              Create new password
            </h1>
            <p className="text-center text-slate mb-8 text-base leading-relaxed">
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
          <div className="text-center">
            <div className="w-20 h-20 bg-accent-bg rounded-full flex items-center justify-center mx-auto mb-6 text-5xl text-accent">
              ✓
            </div>
            <h2 className="font-display text-[1.75rem] sm:text-2xl font-bold text-midnight mb-4">
              Password updated!
            </h2>
            <p className="text-slate leading-relaxed mb-8">
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
