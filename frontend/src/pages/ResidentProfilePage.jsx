import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ProfileWizard from '../components/profile/ProfileWizard'
import { createResidentProfile } from '../services/residentService'

const ResidentProfilePage = () => {
  const { user, updateProfileCompleted } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleComplete = async (profileData) => {
    setIsSubmitting(true)
    setError('')

    try {
      await createResidentProfile(profileData)
      // Update profile completion status in auth context
      updateProfileCompleted(true)
      // Navigate to resident dashboard after successful profile creation
      navigate('/resident/dashboard', { replace: true })
    } catch (err) {
      console.error('Failed to create profile:', err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.data?.validationErrors) {
        // Handle validation errors
        const errors = Object.values(err.response.data.validationErrors).join(', ')
        setError(errors)
      } else {
        setError('Failed to save your profile. Please try again.')
      }
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: 'white',
          padding: '1rem 2rem',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            RoomPilot
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user?.profilePictureUrl && (
              <img
                src={user.profilePictureUrl}
                alt={user.fullName}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                }}
              />
            )}
            <span style={{ color: '#666' }}>{user?.fullName}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Welcome message */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '0.5rem',
                color: '#1a1a1a',
              }}
            >
              Complete Your Profile
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Help hosts get to know you better by completing your profile. This information will be
              visible in your rental applications.
            </p>
          </div>

          {/* Profile wizard */}
          <ProfileWizard onComplete={handleComplete} isSubmitting={isSubmitting} error={error} />
        </div>

        {/* Info cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>*</div>
            <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Privacy First</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Your information is only shared when you apply for a room.
            </p>
          </div>
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>*</div>
            <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Stand Out</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>
              A complete profile helps hosts choose you over others.
            </p>
          </div>
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>*</div>
            <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Edit Anytime</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>
              You can update your profile later from your dashboard.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ResidentProfilePage
