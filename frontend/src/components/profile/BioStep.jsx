import { useState } from 'react'

const BioStep = ({ bio, onBioChange, onNext, onBack }) => {
  const [error, setError] = useState('')
  const minLength = 50
  const maxLength = 1000

  const handleChange = (e) => {
    const value = e.target.value
    onBioChange(value)

    if (value.length > 0 && value.length < minLength) {
      setError(`Bio must be at least ${minLength} characters (${value.length}/${minLength})`)
    } else if (value.length > maxLength) {
      setError(`Bio cannot exceed ${maxLength} characters`)
    } else {
      setError('')
    }
  }

  const handleNext = () => {
    if (bio.length < minLength) {
      setError(`Bio must be at least ${minLength} characters`)
      return
    }
    if (bio.length > maxLength) {
      setError(`Bio cannot exceed ${maxLength} characters`)
      return
    }
    onNext()
  }

  const isValid = bio.length >= minLength && bio.length <= maxLength

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Tell us about yourself</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Write a brief bio that hosts can review when considering your rental application.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="bio"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}
        >
          Bio *
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={handleChange}
          placeholder="Share a bit about yourself, your lifestyle, work situation, and what you're looking for in a rental..."
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '1rem',
            border: error ? '2px solid #f44336' : '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '16px',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0.5rem'
        }}>
          <span style={{
            color: error ? '#f44336' : '#666',
            fontSize: '14px'
          }}>
            {error || `${minLength}-${maxLength} characters required`}
          </span>
          <span style={{
            color: bio.length > maxLength ? '#f44336' : '#666',
            fontSize: '14px'
          }}>
            {bio.length}/{maxLength}
          </span>
        </div>
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
          onClick={handleNext}
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

export default BioStep
