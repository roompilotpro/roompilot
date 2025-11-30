const ProfileReview = ({
  bio,
  employmentStatus,
  employmentLabel,
  phone,
  onSubmit,
  onBack,
  isSubmitting,
}) => {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Review your profile</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Please review your information before submitting.
      </p>

      <div
        style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              fontWeight: '600',
              color: '#333',
              marginBottom: '0.5rem',
            }}
          >
            Bio
          </label>
          <div
            style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              whiteSpace: 'pre-wrap',
            }}
          >
            {bio}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              fontWeight: '600',
              color: '#333',
              marginBottom: '0.5rem',
            }}
          >
            Employment Status
          </label>
          <div
            style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                backgroundColor: '#667eea',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '14px',
              }}
            >
              {employmentLabel || employmentStatus}
            </span>
          </div>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontWeight: '600',
              color: '#333',
              marginBottom: '0.5rem',
            }}
          >
            Phone Number
          </label>
          <div
            style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              color: phone ? '#333' : '#999',
            }}
          >
            {phone || 'Not provided'}
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#e8f5e9',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
        }}
      >
        <span style={{ color: '#4caf50', fontSize: '20px' }}>*</span>
        <div style={{ fontSize: '14px', color: '#2e7d32' }}>
          You can update your profile anytime from your dashboard after completing this setup.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '2rem',
        }}
      >
        <button
          onClick={onBack}
          disabled={isSubmitting}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#f5f5f5',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: isSubmitting ? 0.8 : 1,
          }}
        >
          {isSubmitting ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              Saving...
            </>
          ) : (
            'Complete Profile'
          )}
        </button>
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default ProfileReview
