const PhoneStep = ({ phone, onPhoneChange, onNext, onBack }) => {
  const handleChange = (e) => {
    onPhoneChange(e.target.value)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Add your phone number</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        This is optional but can help hosts contact you more easily.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="phone"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
          }}
        >
          Phone Number (Optional)
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={handleChange}
          placeholder="e.g., +1 (555) 123-4567"
          style={{
            width: '100%',
            padding: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '16px',
          }}
        />
        <p
          style={{
            fontSize: '14px',
            color: '#666',
            marginTop: '0.5rem',
          }}
        >
          Your phone number will only be shared with hosts when you apply for a room.
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <span style={{ fontSize: '20px' }}>*</span>
          <div>
            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
              Why provide a phone number?
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Having a phone number on file makes it easier for hosts to reach you for scheduling
              viewings or discussing details about the room.
            </div>
          </div>
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
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          {phone ? 'Continue' : 'Skip for now'}
        </button>
      </div>
    </div>
  )
}

export default PhoneStep
