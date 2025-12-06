import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout, ProgressSteps } from '../../../components/auth'
import { Input, Select, Button, Checkbox, RangeSlider, TagInput } from '../../../components'
import { ROUTES } from '../../../router/routes'
import './OnboardingRenterPage.css'

const STEPS = ['Profile', 'Background Check', 'Preferences']

const CITY_OPTIONS = [
  { value: '', label: 'Select your city' },
  { value: 'auckland', label: 'Auckland' },
  { value: 'wellington', label: 'Wellington' },
  { value: 'christchurch', label: 'Christchurch' },
  { value: 'hamilton', label: 'Hamilton' },
  { value: 'tauranga', label: 'Tauranga' },
  { value: 'dunedin', label: 'Dunedin' },
  { value: 'other', label: 'Other' },
]

const EMPLOYMENT_OPTIONS = [
  { value: '', label: 'Select your status' },
  { value: 'employed', label: 'Employed Full-Time' },
  { value: 'part-time', label: 'Employed Part-Time' },
  { value: 'self-employed', label: 'Self-Employed' },
  { value: 'student', label: 'Student' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'retired', label: 'Retired' },
]

const TIMELINE_OPTIONS = [
  { value: '', label: 'Select timeline' },
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '2-3-months', label: '2-3 months' },
  { value: 'flexible', label: 'Flexible / Just browsing' },
]

const AMENITIES = [
  { value: 'parking', label: 'Parking' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'furnished', label: 'Furnished' },
  { value: 'pet-friendly', label: 'Pet Friendly' },
  { value: 'gym', label: 'Gym' },
]

function OnboardingRenterPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    phone: '',
    city: '',
    employment: '',
    moveInTimeline: '',
    budget: 500,
    neighborhoods: [],
    amenities: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBudgetChange = (value) => {
    setFormData((prev) => ({ ...prev, budget: value }))
  }

  const handleNeighborhoodsChange = (tags) => {
    setFormData((prev) => ({ ...prev, neighborhoods: tags }))
  }

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addBackgroundCheck = () => {
    console.log('Adding background check...')
    // Payment flow would be implemented here
    nextStep()
  }

  const completeOnboarding = () => {
    console.log('Onboarding complete:', formData)
    setCurrentStep(4)
  }

  const startSearching = () => {
    navigate(ROUTES.SEARCH)
  }

  return (
    <AuthLayout variant="onboarding">
      <ProgressSteps steps={STEPS} currentStep={currentStep} />

      <div className="onboarding-renter__content">
        {/* Step 1: Profile */}
        {currentStep === 1 && (
          <div className="onboarding-renter__card">
            <h1 className="onboarding-renter__title">Tell us about yourself</h1>
            <p className="onboarding-renter__subtitle">Help us find the perfect room for you</p>

            <form>
              <Input
                type="tel"
                name="phone"
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                required
                fullWidth
              />

              <Select
                name="city"
                label="Current City"
                options={CITY_OPTIONS}
                value={formData.city}
                onChange={handleChange}
                required
                fullWidth
              />

              <Select
                name="employment"
                label="Employment Status"
                options={EMPLOYMENT_OPTIONS}
                value={formData.employment}
                onChange={handleChange}
                required
                fullWidth
              />

              <Select
                name="moveInTimeline"
                label="When are you looking to move?"
                options={TIMELINE_OPTIONS}
                value={formData.moveInTimeline}
                onChange={handleChange}
                required
                fullWidth
              />

              <div className="onboarding-renter__btn-group">
                <Button variant="primary" size="lg" fullWidth onClick={nextStep}>
                  Continue
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Background Check */}
        {currentStep === 2 && (
          <div className="onboarding-renter__card">
            <h1 className="onboarding-renter__title">Stand out to landlords</h1>
            <p className="onboarding-renter__subtitle">
              Optional but recommended to increase your chances
            </p>

            <div className="onboarding-renter__bg-check">
              <div className="onboarding-renter__bg-check-header">
                <div className="onboarding-renter__bg-check-icon">✓</div>
                <h3>Background Check</h3>
              </div>
              <p>
                Get verified and stand out from other applicants. Landlords love renters with
                background checks!
              </p>
              <ul className="onboarding-renter__bg-benefits">
                <li>🔒 Secure and confidential</li>
                <li>⚡ Results in 24-48 hours</li>
                <li>📈 3x more likely to get accepted</li>
                <li>♻️ Reusable for multiple applications</li>
              </ul>
              <div className="onboarding-renter__price-tag">$30 one-time fee</div>
            </div>

            <div className="onboarding-renter__btn-group">
              <Button variant="outline" size="lg" onClick={prevStep}>
                Back
              </Button>
              <Button variant="primary" size="lg" onClick={addBackgroundCheck}>
                Add Background Check
              </Button>
            </div>

            <div className="onboarding-renter__skip">
              <button type="button" onClick={nextStep}>
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {currentStep === 3 && (
          <div className="onboarding-renter__card">
            <h1 className="onboarding-renter__title">Set your preferences</h1>
            <p className="onboarding-renter__subtitle">
              We'll help you find rooms that match what you're looking for
            </p>

            <form>
              <div className="onboarding-renter__form-group">
                <label className="onboarding-renter__label">Weekly Budget Range</label>
                <div className="onboarding-renter__budget">
                  <div className="onboarding-renter__budget-display">
                    <span className="onboarding-renter__budget-values">
                      $150 - ${formData.budget}
                    </span>
                    <span className="onboarding-renter__budget-unit">per week</span>
                  </div>
                  <RangeSlider
                    min={100}
                    max={800}
                    value={formData.budget}
                    onChange={handleBudgetChange}
                  />
                </div>
              </div>

              <div className="onboarding-renter__form-group">
                <label className="onboarding-renter__label">Preferred Neighborhoods</label>
                <TagInput
                  tags={formData.neighborhoods}
                  onChange={handleNeighborhoodsChange}
                  placeholder="Type neighborhood and press Enter"
                />
                <p className="onboarding-renter__helper">
                  Add neighborhoods you'd like to live in (e.g., Ponsonby, Mt Eden, Newtown)
                </p>
              </div>

              <div className="onboarding-renter__form-group">
                <label className="onboarding-renter__label">Must-Have Amenities</label>
                <div className="onboarding-renter__amenities">
                  {AMENITIES.map((amenity) => (
                    <div
                      key={amenity.value}
                      className={`onboarding-renter__amenity ${
                        formData.amenities.includes(amenity.value)
                          ? 'onboarding-renter__amenity--checked'
                          : ''
                      }`}
                      onClick={() => handleAmenityToggle(amenity.value)}
                    >
                      <Checkbox
                        checked={formData.amenities.includes(amenity.value)}
                        onChange={() => {}}
                        label={amenity.label}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="onboarding-renter__btn-group">
                <Button variant="outline" size="lg" onClick={prevStep}>
                  Back
                </Button>
                <Button variant="primary" size="lg" onClick={completeOnboarding}>
                  Complete Setup
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Completion */}
        {currentStep === 4 && (
          <div className="onboarding-renter__card">
            <div className="onboarding-renter__completion">
              <div className="onboarding-renter__celebration">🎉</div>
              <h2 className="onboarding-renter__completion-title">You're all set!</h2>
              <p className="onboarding-renter__completion-text">
                Time to find your perfect room
              </p>

              <div className="onboarding-renter__cta-card">
                <h3>Start browsing rooms</h3>
                <p>We've got thousands of verified listings waiting for you</p>
                <Button
                  variant="white"
                  size="lg"
                  onClick={startSearching}
                >
                  Start Searching
                </Button>
              </div>

              <p className="onboarding-renter__settings-note">
                You can update your preferences anytime from your profile settings.
              </p>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default OnboardingRenterPage
