import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';

/**
 * Role-protected route component.
 * Extends ProtectedRoute with role-based access control.
 *
 * @param {Array<string>} allowedRoles - Array of allowed roles (e.g., ['HOST', 'ADMIN'])
 */
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user && allowedRoles.includes(user.role) ? (
        children
      ) : (
        <Navigate to="/unauthorized" replace />
      )}
    </ProtectedRoute>
  );
};

export default RoleProtectedRoute;
