import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout, ProgressSteps } from '../../../components/auth'
import { Input, Select, Button } from '../../../components'
import { ROUTES } from '../../../router/routes'
import './OnboardingHostPage.css'

const STEPS = ['Basic Info', 'Payouts', 'First Property']

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

const PROPERTY_TYPE_OPTIONS = [
  { value: '', label: 'Select type' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'studio', label: 'Studio' },
]

function OnboardingHostPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    city: '',
    propertyAddress: '',
    propertyType: '',
    bedrooms: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

  const connectStripe = () => {
    console.log('Connecting to Stripe...')
    // Stripe Connect flow would be implemented here
    nextStep()
  }

  const skipStripe = () => {
    console.log('Skipping Stripe setup')
    nextStep()
  }

  const togglePropertyForm = (show) => {
    setShowPropertyForm(show)
  }

  const completeOnboarding = () => {
    console.log('Onboarding complete:', formData)
    setCurrentStep(4)
  }

  const goToDashboard = () => {
    navigate(ROUTES.LANDLORD.DASHBOARD)
  }

  return (
    <AuthLayout variant="onboarding">
      <ProgressSteps steps={STEPS} currentStep={currentStep} />

      <div className="onboarding-host__content">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="onboarding-host__card">
            <h1 className="onboarding-host__title">Let's get you set up</h1>
            <p className="onboarding-host__subtitle">Tell us a bit about yourself to get started</p>

            <form>
              <Input
                type="text"
                name="businessName"
                label="Business/Host Name"
                placeholder="Your name or business name"
                value={formData.businessName}
                onChange={handleChange}
                required
                fullWidth
              />

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
                label="City/Region"
                options={CITY_OPTIONS}
                value={formData.city}
                onChange={handleChange}
                required
                fullWidth
              />

              <div className="onboarding-host__btn-group">
                <Button variant="primary" size="lg" fullWidth onClick={nextStep}>
                  Continue
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Payouts */}
        {currentStep === 2 && (
          <div className="onboarding-host__card">
            <h1 className="onboarding-host__title">Set up your payouts</h1>
            <p className="onboarding-host__subtitle">Connect Stripe to receive payments securely</p>

            <div className="onboarding-host__stripe-card">
              <div className="onboarding-host__stripe-header">
                <span className="onboarding-host__stripe-logo">Stripe</span>
                <span>Powered by</span>
              </div>
              <h3>Fast, secure payments</h3>
              <p>Stripe handles all payment processing, making it easy to get paid on time.</p>
              <ul className="onboarding-host__stripe-benefits">
                <li>✓ Automatic weekly payouts</li>
                <li>✓ Bank-level security</li>
                <li>✓ Track all transactions in one place</li>
                <li>✓ Support for multiple payment methods</li>
              </ul>
            </div>

            <div className="onboarding-host__btn-group">
              <Button variant="outline" size="lg" onClick={prevStep}>
                Back
              </Button>
              <Button variant="primary" size="lg" onClick={connectStripe}>
                Connect with Stripe
              </Button>
            </div>

            <div className="onboarding-host__skip">
              <button type="button" onClick={skipStripe}>
                I'll do this later
              </button>
            </div>
          </div>
        )}

        {/* Step 3: First Property */}
        {currentStep === 3 && (
          <div className="onboarding-host__card">
            <h1 className="onboarding-host__title">Add your first property</h1>
            <p className="onboarding-host__subtitle">You can always add more properties later</p>

            <div className="onboarding-host__option-cards">
              <div
                className={`onboarding-host__option-card ${showPropertyForm ? 'onboarding-host__option-card--selected' : ''}`}
                onClick={() => togglePropertyForm(true)}
              >
                <div className="onboarding-host__option-icon">🏠</div>
                <div className="onboarding-host__option-title">Add property now</div>
                <div className="onboarding-host__option-desc">Get started immediately</div>
              </div>

              <div
                className={`onboarding-host__option-card ${!showPropertyForm ? 'onboarding-host__option-card--selected' : ''}`}
                onClick={() => togglePropertyForm(false)}
              >
                <div className="onboarding-host__option-icon">⏰</div>
                <div className="onboarding-host__option-title">I'll do this later</div>
                <div className="onboarding-host__option-desc">Set up from dashboard</div>
              </div>
            </div>

            {showPropertyForm && (
              <div className="onboarding-host__property-fields">
                <Input
                  type="text"
                  name="propertyAddress"
                  label="Property Address"
                  placeholder="123 Main Street"
                  value={formData.propertyAddress}
                  onChange={handleChange}
                  fullWidth
                />

                <Select
                  name="propertyType"
                  label="Property Type"
                  options={PROPERTY_TYPE_OPTIONS}
                  value={formData.propertyType}
                  onChange={handleChange}
                  fullWidth
                />

                <Input
                  type="text"
                  name="bedrooms"
                  label="Number of Bedrooms"
                  placeholder="e.g., 3"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  fullWidth
                />
              </div>
            )}

            <div className="onboarding-host__btn-group">
              <Button variant="outline" size="lg" onClick={prevStep}>
                Back
              </Button>
              <Button variant="primary" size="lg" onClick={completeOnboarding}>
                Complete Setup
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Completion */}
        {currentStep === 4 && (
          <div className="onboarding-host__card">
            <div className="onboarding-host__completion">
              <div className="onboarding-host__celebration">🎉</div>
              <h2 className="onboarding-host__completion-title">Welcome to RoomPilot!</h2>
              <p className="onboarding-host__completion-text">
                You're all set up and ready to start listing your properties
              </p>

              <div className="onboarding-host__next-steps">
                <h3>Next Steps:</h3>
                <ul>
                  <li>📝 Complete your property listings</li>
                  <li>📸 Add photos to attract more renters</li>
                  <li>💰 Set competitive pricing</li>
                  <li>📧 Start receiving rental applications</li>
                </ul>
              </div>

              <Button variant="primary" size="lg" onClick={goToDashboard}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default OnboardingHostPage
