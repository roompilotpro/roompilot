import { useAuth } from '../hooks/useAuth'
import { logout } from '../services/authService'
import { useNavigate } from 'react-router-dom'

/**
 * Dashboard for Admin users.
 */
const AdminDashboard = () => {
  const { user, logout: authLogout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    authLogout()
    navigate('/login')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <div>
          <h1>Admin Dashboard</h1>
          <p style={{ color: '#666' }}>Administrator Panel - {user?.fullName}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '1.5rem',
            borderRadius: '8px',
          }}
        >
          <h3>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>0</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Registered users</p>
        </div>

        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '1.5rem',
            borderRadius: '8px',
          }}
        >
          <h3>Properties</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>0</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Total properties</p>
        </div>

        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '1.5rem',
            borderRadius: '8px',
          }}
        >
          <h3>Active Leases</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>0</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Current leases</p>
        </div>
      </div>

      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
        }}
      >
        <h2>Admin Controls</h2>
        <p style={{ color: '#666' }}>Platform management tools:</p>
        <ul style={{ color: '#666' }}>
          <li>User management</li>
          <li>Property oversight</li>
          <li>System configuration</li>
          <li>Analytics and reporting</li>
        </ul>
        <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic' }}>
          Admin features coming soon...
        </p>
      </div>
    </div>
  )
}

export default AdminDashboard
