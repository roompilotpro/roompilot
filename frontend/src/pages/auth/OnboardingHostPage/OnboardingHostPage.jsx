import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout, ProgressSteps } from '../../../components/auth'
import { Input, Select, Button } from '../../../components'
import { ROUTES } from '../../../router/routes'
import { classNames } from '../../../utils'

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

      <div className="max-w-[800px] mx-auto">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-10 md:p-6 shadow-md mb-8 animate-fade-in">
            <h1 className="font-display text-[2rem] md:text-[1.625rem] font-bold text-midnight mb-2">Let's get you set up</h1>
            <p className="text-lg text-slate mb-8">Tell us a bit about yourself to get started</p>

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

              <div className="flex flex-col md:flex-row gap-4 mt-8 [&_.btn]:flex-1">
                <Button variant="primary" size="lg" fullWidth onClick={nextStep}>
                  Continue
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Payouts */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl p-10 md:p-6 shadow-md mb-8 animate-fade-in">
            <h1 className="font-display text-[2rem] md:text-[1.625rem] font-bold text-midnight mb-2">Set up your payouts</h1>
            <p className="text-lg text-slate mb-8">Connect Stripe to receive payments securely</p>

            <div className="bg-gradient-to-br from-[#635bff] to-[#4b43c8] text-white p-8 rounded-xl mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold">Stripe</span>
                <span>Powered by</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">Fast, secure payments</h3>
              <p className="opacity-90 leading-relaxed mb-2">Stripe handles all payment processing, making it easy to get paid on time.</p>
              <ul className="list-none p-0 mt-4">
                <li className="py-2 flex items-center gap-2">✓ Automatic weekly payouts</li>
                <li className="py-2 flex items-center gap-2">✓ Bank-level security</li>
                <li className="py-2 flex items-center gap-2">✓ Track all transactions in one place</li>
                <li className="py-2 flex items-center gap-2">✓ Support for multiple payment methods</li>
              </ul>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-8 [&_.btn]:flex-1">
              <Button variant="outline" size="lg" onClick={prevStep}>
                Back
              </Button>
              <Button variant="primary" size="lg" onClick={connectStripe}>
                Connect with Stripe
              </Button>
            </div>

            <div className="text-center mt-4">
              <button type="button" onClick={skipStripe} className="bg-transparent border-none text-slate p-4 cursor-pointer font-body text-base hover:text-primary">
                I'll do this later
              </button>
            </div>
          </div>
        )}

        {/* Step 3: First Property */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-10 md:p-6 shadow-md mb-8 animate-fade-in">
            <h1 className="font-display text-[2rem] md:text-[1.625rem] font-bold text-midnight mb-2">Add your first property</h1>
            <p className="text-lg text-slate mb-8">You can always add more properties later</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div
                className={classNames(
                  'p-6 border-2 rounded-xl cursor-pointer transition-all text-center',
                  showPropertyForm ? 'border-primary bg-primary-bg' : 'border-cloud hover:border-primary hover:bg-primary-bg'
                )}
                onClick={() => togglePropertyForm(true)}
              >
                <div className="text-[2.5rem] mb-3">🏠</div>
                <div className="font-semibold text-midnight mb-1">Add property now</div>
                <div className="text-sm text-slate">Get started immediately</div>
              </div>

              <div
                className={classNames(
                  'p-6 border-2 rounded-xl cursor-pointer transition-all text-center',
                  !showPropertyForm ? 'border-primary bg-primary-bg' : 'border-cloud hover:border-primary hover:bg-primary-bg'
                )}
                onClick={() => togglePropertyForm(false)}
              >
                <div className="text-[2.5rem] mb-3">⏰</div>
                <div className="font-semibold text-midnight mb-1">I'll do this later</div>
                <div className="text-sm text-slate">Set up from dashboard</div>
              </div>
            </div>

            {showPropertyForm && (
              <div className="mt-6 pt-6 border-t-2 border-cloud animate-fade-in">
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

            <div className="flex flex-col md:flex-row gap-4 mt-8 [&_.btn]:flex-1">
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
          <div className="bg-white rounded-2xl p-10 md:p-6 shadow-md mb-8 animate-fade-in">
            <div className="text-center py-12 px-8">
              <div className="text-[5rem] mb-6 animate-bounce">🎉</div>
              <h2 className="font-display text-[2.25rem] font-bold text-midnight mb-4">Welcome to RoomPilot!</h2>
              <p className="text-lg text-slate mb-8">
                You're all set up and ready to start listing your properties
              </p>

              <div className="bg-snow rounded-xl p-6 my-8 text-left">
                <h3 className="font-bold mb-4 text-midnight">Next Steps:</h3>
                <ul className="list-none p-0 m-0">
                  <li className="py-3 flex items-center gap-3 text-slate">📝 Complete your property listings</li>
                  <li className="py-3 flex items-center gap-3 text-slate">📸 Add photos to attract more renters</li>
                  <li className="py-3 flex items-center gap-3 text-slate">💰 Set competitive pricing</li>
                  <li className="py-3 flex items-center gap-3 text-slate">📧 Start receiving rental applications</li>
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
