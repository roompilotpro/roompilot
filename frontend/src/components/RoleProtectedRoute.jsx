import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ProtectedRoute from './ProtectedRoute'

/**
 * Role-protected route component.
 * Extends ProtectedRoute with role-based access control.
 * For RESIDENT users accessing the dashboard, also checks profile completion.
 *
 * @param {Array<string>} allowedRoles - Array of allowed roles (e.g., ['HOST', 'ADMIN'])
 * @param {boolean} requireProfileCompleted - Whether to require completed profile (default: true for dashboard routes)
 */
const RoleProtectedRoute = ({ children, allowedRoles, requireProfileCompleted = true }) => {
  const { user, profileCompleted } = useAuth()
  const location = useLocation()

  // Check if this is the resident dashboard route
  const isResidentDashboard = location.pathname === '/resident/dashboard'

  return (
    <ProtectedRoute>
      {user && allowedRoles.includes(user.role) ? (
        // For RESIDENT dashboard, also check profile completion
        user.role === 'RESIDENT' && isResidentDashboard && requireProfileCompleted && !profileCompleted ? (
          <Navigate to="/onboarding/resident-profile" replace />
        ) : (
          children
        )
      ) : (
        <Navigate to="/unauthorized" replace />
      )}
    </ProtectedRoute>
  )
}

export default RoleProtectedRoute
