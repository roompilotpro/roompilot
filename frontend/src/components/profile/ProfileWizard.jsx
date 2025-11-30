import { useState, useEffect } from 'react'
import BioStep from './BioStep'
import EmploymentStep from './EmploymentStep'
import PhoneStep from './PhoneStep'
import ProfileReview from './ProfileReview'
import { getEmploymentStatuses } from '../../services/residentService'

const STEPS = [
  { id: 'bio', label: 'Bio' },
  { id: 'employment', label: 'Employment' },
  { id: 'phone', label: 'Contact' },
  { id: 'review', label: 'Review' },
]

const ProfileWizard = ({ onComplete, isSubmitting, error }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    bio: '',
    employmentStatus: '',
    phone: '',
  })
  const [employmentLabels, setEmploymentLabels] = useState({})

  // Fetch employment labels for display in review
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const statuses = await getEmploymentStatuses()
        const labels = {}
        statuses.forEach(s => {
          labels[s.value] = s.label
        })
        setEmploymentLabels(labels)
      } catch (err) {
        console.error('Failed to load employment labels:', err)
      }
    }
    fetchLabels()
  }, [])

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleBioChange = (bio) => {
    setFormData((prev) => ({ ...prev, bio }))
  }

  const handleEmploymentChange = (employmentStatus) => {
    setFormData((prev) => ({ ...prev, employmentStatus }))
  }

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({ ...prev, phone }))
  }

  const handleSubmit = () => {
    onComplete(formData)
  }

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'bio':
        return (
          <BioStep
            bio={formData.bio}
            onBioChange={handleBioChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 'employment':
        return (
          <EmploymentStep
            employmentStatus={formData.employmentStatus}
            onEmploymentChange={handleEmploymentChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 'phone':
        return (
          <PhoneStep
            phone={formData.phone}
            onPhoneChange={handlePhoneChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 'review':
        return (
          <ProfileReview
            bio={formData.bio}
            employmentStatus={formData.employmentStatus}
            employmentLabel={employmentLabels[formData.employmentStatus]}
            phone={formData.phone}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )
      default:
        return null
    }
  }

  return (
    <div>
      {/* Progress indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        {STEPS.map((step, index) => (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: index <= currentStep ? '#667eea' : '#e0e0e0',
                  color: index <= currentStep ? 'white' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.3s',
                }}
              >
                {index < currentStep ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span style={{
                marginTop: '0.5rem',
                fontSize: '12px',
                color: index <= currentStep ? '#667eea' : '#999',
                fontWeight: index === currentStep ? '600' : '400',
              }}>
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                style={{
                  width: '60px',
                  height: '3px',
                  backgroundColor: index < currentStep ? '#667eea' : '#e0e0e0',
                  margin: '0 0.5rem',
                  marginBottom: '1.5rem',
                  transition: 'all 0.3s',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {/* Current step content */}
      {renderStep()}
    </div>
  )
}

export default ProfileWizard
