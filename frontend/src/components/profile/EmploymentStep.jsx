import { useState, useEffect } from 'react'
import { getEmploymentStatuses } from '../../services/residentService'

const EmploymentStep = ({ employmentStatus, onEmploymentChange, onNext, onBack }) => {
  const [statuses, setStatuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const data = await getEmploymentStatuses()
        setStatuses(data)
      } catch (err) {
        console.error('Failed to load employment statuses:', err)
        setError('Failed to load options. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchStatuses()
  }, [])

  const handleSelect = (status) => {
    onEmploymentChange(status)
  }

  const isValid = employmentStatus !== ''

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading options...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ color: '#f44336' }}>{error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>What's your employment status?</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        This helps hosts understand your situation when reviewing applications.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {statuses.map((status) => (
          <div
            key={status.value}
            onClick={() => handleSelect(status.value)}
            style={{
              padding: '1rem',
              border: employmentStatus === status.value
                ? '2px solid #667eea'
                : '2px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: employmentStatus === status.value
                ? '#f0f3ff'
                : 'white',
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: employmentStatus === status.value
                    ? '6px solid #667eea'
                    : '2px solid #ccc',
                  backgroundColor: 'white',
                }}
              />
              <div>
                <div style={{ fontWeight: '500' }}>{status.label}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {status.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '2rem'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#f5f5f5',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: isValid ? '#667eea' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: isValid ? 'pointer' : 'not-allowed',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default EmploymentStep
