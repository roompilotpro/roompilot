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
          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-midnight mb-2">
              Basic Property Details
            </h2>
            <p className="text-[15px] text-slate mb-6">Tell us about your property</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                className="md:col-span-2"
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
                className="md:col-span-2"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-midnight mb-2">
              Property Photos
            </h2>
            <p className="text-[15px] text-slate mb-6">Add photos to showcase your property</p>

            <FileUpload
              label="Upload Photos"
              accept="image/*"
              multiple
              helperText="Upload up to 10 photos. JPG, PNG up to 10MB each."
              onChange={(files) => updateFormData('photos', files)}
            />

            {formData.photos.length > 0 && (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 mt-6">
                {Array.from(formData.photos).map((photo, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 p-4 bg-snow rounded-xl"
                  >
                    <span className="text-[32px]">📷</span>
                    <span className="text-xs text-slate text-center break-all max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {photo.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-midnight mb-2">
              Amenities & House Rules
            </h2>
            <p className="text-[15px] text-slate mb-6">Select what your property offers</p>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-charcoal mb-4 pb-3 border-b-2 border-cloud">
                Amenities
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
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

            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-4 pb-3 border-b-2 border-cloud">
                House Rules
              </h3>
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-snow rounded-xl">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">🚭</span>
                    <div>
                      <span className="block text-[15px] font-semibold text-charcoal mb-0.5">
                        Smoking Allowed
                      </span>
                      <span className="block text-[13px] text-slate">
                        Permit smoking in designated areas
                      </span>
                    </div>
                  </div>
                  <Toggle checked={formData.rules.smoking} onChange={() => toggleRule('smoking')} />
                </div>

                <div className="flex items-center justify-between p-4 bg-snow rounded-xl">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">🐕</span>
                    <div>
                      <span className="block text-[15px] font-semibold text-charcoal mb-0.5">
                        Pets Allowed
                      </span>
                      <span className="block text-[13px] text-slate">
                        Allow tenants to have pets
                      </span>
                    </div>
                  </div>
                  <Toggle checked={formData.rules.pets} onChange={() => toggleRule('pets')} />
                </div>

                <div className="flex items-center justify-between p-4 bg-snow rounded-xl">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">👥</span>
                    <div>
                      <span className="block text-[15px] font-semibold text-charcoal mb-0.5">
                        Guests Allowed
                      </span>
                      <span className="block text-[13px] text-slate">Allow overnight guests</span>
                    </div>
                  </div>
                  <Toggle checked={formData.rules.guests} onChange={() => toggleRule('guests')} />
                </div>

                <div className="flex items-center justify-between p-4 bg-snow rounded-xl">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">🔇</span>
                    <div>
                      <span className="block text-[15px] font-semibold text-charcoal mb-0.5">
                        Quiet Hours
                      </span>
                      <span className="block text-[13px] text-slate">
                        Enforce quiet hours for shared spaces
                      </span>
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
          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-midnight mb-2">Rooms</h2>
            <p className="text-[15px] text-slate mb-6">You can add rooms now or after publishing</p>

            <div className="flex flex-col items-center justify-center py-16 px-6 bg-snow rounded-2xl text-center">
              <div className="text-5xl mb-4">🛏️</div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">No rooms added yet</h3>
              <p className="text-sm text-slate mb-6 max-w-[300px]">
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
          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-midnight mb-2">
              Review & Publish
            </h2>
            <p className="text-[15px] text-slate mb-6">
              Review your property details before publishing
            </p>

            <div className="flex flex-col gap-6">
              <div className="p-5 bg-snow rounded-xl">
                <h3 className="text-base font-semibold text-charcoal mb-4 pb-3 border-b border-cloud">
                  Basic Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate uppercase tracking-wide">
                      Property Name
                    </span>
                    <span className="text-sm text-charcoal">{formData.name || 'Not set'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate uppercase tracking-wide">Type</span>
                    <span className="text-sm text-charcoal">
                      {propertyTypeOptions.find((o) => o.value === formData.propertyType)?.label ||
                        'Not set'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <span className="text-xs text-slate uppercase tracking-wide">Address</span>
                    <span className="text-sm text-charcoal">
                      {formData.address
                        ? `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`
                        : 'Not set'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <span className="text-xs text-slate uppercase tracking-wide">Description</span>
                    <span className="text-sm text-charcoal">
                      {formData.description || 'Not set'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-snow rounded-xl">
                <h3 className="text-base font-semibold text-charcoal mb-4 pb-3 border-b border-cloud">
                  Photos
                </h3>
                <span className="text-sm text-charcoal">
                  {formData.photos.length} photos uploaded
                </span>
              </div>

              <div className="p-5 bg-snow rounded-xl">
                <h3 className="text-base font-semibold text-charcoal mb-4 pb-3 border-b border-cloud">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(formData.amenities)
                    .filter(([, enabled]) => enabled)
                    .map(([id]) => {
                      const amenity = propertyAmenities.find((a) => a.id === id)
                      return amenity ? (
                        <span
                          key={id}
                          className="py-2 px-3 bg-white rounded-lg text-[13px] text-charcoal"
                        >
                          {amenity.icon} {amenity.label}
                        </span>
                      ) : null
                    })}
                  {Object.values(formData.amenities).filter(Boolean).length === 0 && (
                    <span className="text-sm text-charcoal">No amenities selected</span>
                  )}
                </div>
              </div>

              <div className="p-5 bg-snow rounded-xl">
                <h3 className="text-base font-semibold text-charcoal mb-4 pb-3 border-b border-cloud">
                  House Rules
                </h3>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-charcoal">
                    🚭 Smoking: {formData.rules.smoking ? 'Allowed' : 'Not allowed'}
                  </span>
                  <span className="text-sm text-charcoal">
                    🐕 Pets: {formData.rules.pets ? 'Allowed' : 'Not allowed'}
                  </span>
                  <span className="text-sm text-charcoal">
                    👥 Guests: {formData.rules.guests ? 'Allowed' : 'Not allowed'}
                  </span>
                  <span className="text-sm text-charcoal">
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
      <div className="p-8 max-w-[900px] mx-auto md:p-5">
        {/* Progress Steps */}
        <ProgressSteps steps={STEPS} currentStep={currentStep} className="mb-8" />

        {/* Form Card */}
        <Card className="p-8 md:p-6">
          {renderStepContent()}

          {/* Actions */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-cloud gap-4">
            <div className="flex gap-3 w-full md:w-auto justify-center md:justify-start">
              {currentStep > 1 && (
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end">
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
