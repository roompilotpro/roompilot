import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import HostDashboard from './pages/HostDashboard';
import ResidentDashboard from './pages/ResidentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected routes - require authentication */}
      <Route
        path="/onboarding/role-selection"
        element={
          <ProtectedRoute>
            <RoleSelectionPage />
          </ProtectedRoute>
        }
      />

      {/* Role-specific dashboards */}
      <Route
        path="/host/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={['HOST']}>
            <HostDashboard />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/resident/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={['RESIDENT']}>
            <ResidentDashboard />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </RoleProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
