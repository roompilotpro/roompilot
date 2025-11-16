import { useAuth } from '../hooks/useAuth'
import { logout } from '../services/authService'
import { useNavigate } from 'react-router-dom'

/**
 * Dashboard for Resident users.
 */
const ResidentDashboard = () => {
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
          <h1>Resident Dashboard</h1>
          <p style={{ color: '#666' }}>Welcome, {user?.fullName}</p>
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
          <h3>My Room</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>-</p>
          <p style={{ color: '#666', fontSize: '14px' }}>No room assigned yet</p>
        </div>

        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '1.5rem',
            borderRadius: '8px',
          }}
        >
          <h3>Applications</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>0</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Pending applications</p>
        </div>

        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '1.5rem',
            borderRadius: '8px',
          }}
        >
          <h3>Messages</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>0</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Unread messages</p>
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
        <h2>Find Your Next Room</h2>
        <p style={{ color: '#666' }}>Welcome to your Resident dashboard! Here you can:</p>
        <ul style={{ color: '#666' }}>
          <li>Browse available rooms</li>
          <li>Submit rental applications</li>
          <li>Track application status</li>
          <li>Communicate with hosts</li>
        </ul>
        <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic' }}>
          Room browsing features coming soon...
        </p>
      </div>
    </div>
  )
}

export default ResidentDashboard
