import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Card } from '../../components/cards'
import { Button } from '../../components/primitives'
import { ProgressSteps } from '../../components/navigation'
import { Input, Select, Textarea, Checkbox, Toggle, FileUpload } from '../../components/forms'
import { propertyTypeOptions, propertyAmenities } from '../../data/mockLandlordData'
import './AddPropertyPage.css'

const STEPS = [
  { id: 1, label: 'Basic Details' },
  { id: 2, label: 'Photos' },
  { id: 3, label: 'Amenities' },
  { id: 4, label: 'Rooms' },
  { id: 5, label: 'Review' },
]

function AddPropertyPage() {
  const navigate = useNavigate()
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: '',
    description: '',
    photos: [],
    amenities: {},
    rules: {
      smoking: false,
      pets: false,
      guests: true,
      quietHours: true,
    },
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    additionalRules: '',
    rooms: [],
  })

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleAmenity = (amenityId) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenityId]: !prev.amenities[amenityId],
      },
    }))
  }

  const toggleRule = (ruleId) => {
    setFormData((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        [ruleId]: !prev.rules[ruleId],
      },
    }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePublish = () => {
    // In production, this would submit to API
    console.log('Publishing property:', formData)
    navigate(ROUTES.LANDLORD.PROPERTIES)
  }

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2 className="step-title">Basic Property Details</h2>
            <p className="step-description">Tell us about your property</p>

            <div className="form-grid">
              <Input
                label="Property Name"
                placeholder="e.g., Sunshine House"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                required
                fullWidth
              />

              <Select
                label="Property Type"
                options={propertyTypeOptions}
                value={formData.propertyType}
                onChange={(e) => updateFormData('propertyType', e.target.value)}
                required
                fullWidth
              />

              <Input
                label="Street Address"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                required
                fullWidth
                className="full-width"
              />

              <Input
                label="City"
                placeholder="Boston"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                required
                fullWidth
              />

              <Input
                label="State"
                placeholder="MA"
                value={formData.state}
                onChange={(e) => updateFormData('state', e.target.value)}
                required
                fullWidth
              />

              <Input
                label="ZIP Code"
                placeholder="02115"
                value={formData.zipCode}
                onChange={(e) => updateFormData('zipCode', e.target.value)}
                required
                fullWidth
              />

              <Textarea
                label="Description"
                placeholder="Describe your property, neighborhood, and what makes it special..."
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                minRows={4}
                fullWidth
                className="full-width"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="step-content">
            <h2 className="step-title">Property Photos</h2>
            <p className="step-description">Add photos to showcase your property</p>

            <FileUpload
              label="Upload Photos"
              accept="image/*"
              multiple
              helperText="Upload up to 10 photos. JPG, PNG up to 10MB each."
              onChange={(files) => updateFormData('photos', files)}
            />

            {formData.photos.length > 0 && (
              <div className="photo-preview-grid">
                {Array.from(formData.photos).map((photo, index) => (
                  <div key={index} className="photo-preview">
                    <span className="photo-preview-icon">📷</span>
                    <span className="photo-preview-name">{photo.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="step-content">
            <h2 className="step-title">Amenities & House Rules</h2>
            <p className="step-description">Select what your property offers</p>

            <div className="section-group">
              <h3 className="section-subtitle">Amenities</h3>
              <div className="amenities-selection-grid">
                {propertyAmenities.map((amenity) => (
                  <Checkbox
                    key={amenity.id}
                    id={amenity.id}
                    label={`${amenity.icon} ${amenity.label}`}
                    checked={formData.amenities[amenity.id] || false}
                    onChange={() => toggleAmenity(amenity.id)}
                    card
                  />
                ))}
              </div>
            </div>

            <div className="section-group">
              <h3 className="section-subtitle">House Rules</h3>
              <div className="rules-toggles">
                <div className="rule-toggle">
                  <div className="rule-toggle-info">
                    <span className="rule-toggle-icon">🚭</span>
                    <div>
                      <span className="rule-toggle-label">Smoking Allowed</span>
                      <span className="rule-toggle-description">Permit smoking in designated areas</span>
                    </div>
                  </div>
                  <Toggle
                    checked={formData.rules.smoking}
                    onChange={() => toggleRule('smoking')}
                  />
                </div>

                <div className="rule-toggle">
                  <div className="rule-toggle-info">
                    <span className="rule-toggle-icon">🐕</span>
                    <div>
                      <span className="rule-toggle-label">Pets Allowed</span>
                      <span className="rule-toggle-description">Allow tenants to have pets</span>
                    </div>
                  </div>
                  <Toggle
                    checked={formData.rules.pets}
                    onChange={() => toggleRule('pets')}
                  />
                </div>

                <div className="rule-toggle">
                  <div className="rule-toggle-info">
                    <span className="rule-toggle-icon">👥</span>
                    <div>
                      <span className="rule-toggle-label">Guests Allowed</span>
                      <span className="rule-toggle-description">Allow overnight guests</span>
                    </div>
                  </div>
                  <Toggle
                    checked={formData.rules.guests}
                    onChange={() => toggleRule('guests')}
                  />
                </div>

                <div className="rule-toggle">
                  <div className="rule-toggle-info">
                    <span className="rule-toggle-icon">🔇</span>
                    <div>
                      <span className="rule-toggle-label">Quiet Hours</span>
                      <span className="rule-toggle-description">Enforce quiet hours for shared spaces</span>
                    </div>
                  </div>
                  <Toggle
                    checked={formData.rules.quietHours}
                    onChange={() => toggleRule('quietHours')}
                  />
                </div>
              </div>

              <Textarea
                label="Additional Rules (Optional)"
                placeholder="Any other rules or expectations for tenants..."
                value={formData.additionalRules}
                onChange={(e) => updateFormData('additionalRules', e.target.value)}
                minRows={3}
                fullWidth
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="step-content">
            <h2 className="step-title">Rooms</h2>
            <p className="step-description">You can add rooms now or after publishing</p>

            <div className="rooms-placeholder">
              <div className="rooms-placeholder-icon">🛏️</div>
              <h3 className="rooms-placeholder-title">No rooms added yet</h3>
              <p className="rooms-placeholder-text">
                You can add rooms after creating the property, or skip this step for now.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  // Would open a modal or navigate to add room
                  console.log('Add room clicked')
                }}
              >
                Add a Room
              </Button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="step-content">
            <h2 className="step-title">Review & Publish</h2>
            <p className="step-description">Review your property details before publishing</p>

            <div className="review-sections">
              <div className="review-section">
                <h3 className="review-section-title">Basic Details</h3>
                <div className="review-grid">
                  <div className="review-item">
                    <span className="review-label">Property Name</span>
                    <span className="review-value">{formData.name || 'Not set'}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Type</span>
                    <span className="review-value">
                      {propertyTypeOptions.find((o) => o.value === formData.propertyType)?.label || 'Not set'}
                    </span>
                  </div>
                  <div className="review-item full-width">
                    <span className="review-label">Address</span>
                    <span className="review-value">
                      {formData.address
                        ? `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`
                        : 'Not set'}
                    </span>
                  </div>
                  <div className="review-item full-width">
                    <span className="review-label">Description</span>
                    <span className="review-value">{formData.description || 'Not set'}</span>
                  </div>
                </div>
              </div>

              <div className="review-section">
                <h3 className="review-section-title">Photos</h3>
                <span className="review-value">{formData.photos.length} photos uploaded</span>
              </div>

              <div className="review-section">
                <h3 className="review-section-title">Amenities</h3>
                <div className="review-amenities">
                  {Object.entries(formData.amenities)
                    .filter(([, enabled]) => enabled)
                    .map(([id]) => {
                      const amenity = propertyAmenities.find((a) => a.id === id)
                      return amenity ? (
                        <span key={id} className="review-amenity">
                          {amenity.icon} {amenity.label}
                        </span>
                      ) : null
                    })}
                  {Object.values(formData.amenities).filter(Boolean).length === 0 && (
                    <span className="review-value">No amenities selected</span>
                  )}
                </div>
              </div>

              <div className="review-section">
                <h3 className="review-section-title">House Rules</h3>
                <div className="review-rules">
                  <span className="review-rule">
                    🚭 Smoking: {formData.rules.smoking ? 'Allowed' : 'Not allowed'}
                  </span>
                  <span className="review-rule">
                    🐕 Pets: {formData.rules.pets ? 'Allowed' : 'Not allowed'}
                  </span>
                  <span className="review-rule">
                    👥 Guests: {formData.rules.guests ? 'Allowed' : 'Not allowed'}
                  </span>
                  <span className="review-rule">
                    🔇 Quiet Hours: {formData.rules.quietHours ? 'Enforced' : 'Not enforced'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AppShell
      sidebar={{
        links: navLinks,
        user,
        logoBadge,
      }}
      header={{
        title: 'Add New Property',
        subtitle: 'List a new property on RoomPilot',
      }}
    >
      <div className="add-property-content">
        {/* Progress Steps */}
        <ProgressSteps
          steps={STEPS}
          currentStep={currentStep}
          className="add-property-progress"
        />

        {/* Form Card */}
        <Card className="add-property-card">
          {renderStepContent()}

          {/* Actions */}
          <div className="add-property-actions">
            <div className="add-property-actions-left">
              {currentStep > 1 && (
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>
            <div className="add-property-actions-right">
              <Button variant="outline" onClick={handleSaveDraft}>
                Save Draft
              </Button>
              {currentStep < STEPS.length ? (
                <Button variant="primary" onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <Button variant="primary" onClick={handlePublish}>
                  Publish Property
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

export default AddPropertyPage
