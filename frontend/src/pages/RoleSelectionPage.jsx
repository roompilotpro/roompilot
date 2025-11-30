import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { selectRole } from '../services/userService'

/**
 * Role selection page for new users.
 * Allows users to choose between HOST and RESIDENT roles.
 */
const RoleSelectionPage = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleRoleSelection = async (role) => {
    setLoading(true)
    setError(null)

    try {
      const updatedUser = await selectRole(role)
      updateUser(updatedUser)

      // Redirect based on role
      if (role === 'HOST') {
        navigate('/host/dashboard')
      } else if (role === 'RESIDENT') {
        // RESIDENT users need to complete their profile first
        navigate('/onboarding/resident-profile')
      }
    } catch (err) {
      console.error('Role selection error:', err)
      setError('Failed to select role. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '800px',
        }}
      >
        <h1>Welcome, {user?.fullName}!</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Please select your role to continue</p>

        {error && (
          <div
            style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          {/* Host Card */}
          <div
            onClick={() => !loading && handleRoleSelection('HOST')}
            style={{
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              padding: '2rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = '#3498db'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🏠</div>
            <h2>I'm a Host</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>
              I manage properties and list rooms for rent
            </p>
          </div>

          {/* Resident Card */}
          <div
            onClick={() => !loading && handleRoleSelection('RESIDENT')}
            style={{
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              padding: '2rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = '#2ecc71'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>👤</div>
            <h2>I'm a Resident</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>I'm looking for a room to rent</p>
          </div>
        </div>

        {loading && <p style={{ marginTop: '1rem', color: '#666' }}>Saving your selection...</p>}
      </div>
    </div>
  )
}

export default RoleSelectionPage
