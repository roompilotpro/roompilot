import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'
import './HowItWorksPages.css'

function HowItWorksLandlordsPage() {
  return (
    <div className="hiw-page hiw-page--landlord">
      <section className="hiw-hero hiw-hero--landlord">
        <div className="hiw-hero-content">
          <span className="hiw-badge">For Landlords</span>
          <h1>Maximize Your Rental Income</h1>
          <p>
            Low fees, fast payouts, and full control over your property. The automation-first
            platform built for co-living landlords.
          </p>
          <Link to={ROUTES.SIGNUP}>
            <Button variant="primary" size="lg">
              List Your Property
            </Button>
          </Link>
        </div>
      </section>

      <section className="hiw-steps">
        <div className="hiw-container">
          <h2>How It Works</h2>
          <div className="hiw-steps-grid">
            <div className="hiw-step">
              <div className="hiw-step-number">1</div>
              <div className="hiw-step-icon">&#127968;</div>
              <h3>List Your Rooms</h3>
              <p>
                Add photos, set your price, and define house rules. It's free to list - you only pay
                when you earn.
              </p>
            </div>
            <div className="hiw-step">
              <div className="hiw-step-number">2</div>
              <div className="hiw-step-icon">&#128176;</div>
              <h3>Connect Stripe</h3>
              <p>
                Set up Stripe Connect in minutes to receive payments directly. Choose daily or
                weekly payouts.
              </p>
            </div>
            <div className="hiw-step">
              <div className="hiw-step-number">3</div>
              <div className="hiw-step-icon">&#128101;</div>
              <h3>Review Applications</h3>
              <p>
                Screen tenants your way. You decide who lives in your property - we never force
                placements.
              </p>
            </div>
            <div className="hiw-step">
              <div className="hiw-step-number">4</div>
              <div className="hiw-step-icon">&#129302;</div>
              <h3>Automate Everything</h3>
              <p>
                Rent collection, reminders, late fees, and receipts - all handled automatically
                while you focus on growing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hiw-features hiw-features--landlord">
        <div className="hiw-container">
          <h2>Why Landlords Choose RoomPilot</h2>
          <div className="hiw-features-grid">
            <div className="hiw-feature">
              <span className="hiw-feature-icon">&#9889;</span>
              <h3>Only 2% Fees</h3>
              <p>
                Keep more of what you earn. No booking fees, no first-10-days skim. Save $500+/year
                per room.
              </p>
            </div>
            <div className="hiw-feature">
              <span className="hiw-feature-icon">&#128176;</span>
              <h3>Daily Payouts</h3>
              <p>
                Get paid as tenants pay. No more waiting 30 days for monthly payouts while floating
                expenses.
              </p>
            </div>
            <div className="hiw-feature">
              <span className="hiw-feature-icon">&#127917;</span>
              <h3>Full Control</h3>
              <p>
                Your house, your rules. Approve your own tenants, set your own policies. No forced
                transfers.
              </p>
            </div>
            <div className="hiw-feature">
              <span className="hiw-feature-icon">&#129302;</span>
              <h3>100% Automated</h3>
              <p>
                Payment reminders, late fees, receipts, and notices. Less admin work, more time for
                growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hiw-comparison">
        <div className="hiw-container">
          <h2>Compare the Savings</h2>
          <div className="hiw-comparison-cards">
            <div className="hiw-comparison-card other">
              <h3>Other Platforms</h3>
              <ul>
                <li className="bad">8-12% platform fees</li>
                <li className="bad">30+ day payout delays</li>
                <li className="bad">Forced tenant placements</li>
                <li className="bad">Platform-mandated rules</li>
              </ul>
            </div>
            <div className="hiw-comparison-card roompilot">
              <h3>RoomPilot</h3>
              <ul>
                <li className="good">Just 2% per payment</li>
                <li className="good">Daily/weekly payouts</li>
                <li className="good">You approve all tenants</li>
                <li className="good">Your rules, your way</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="hiw-cta">
        <h2>Ready to Earn More?</h2>
        <p>Join the marketplace that respects your business</p>
        <Link to={ROUTES.SIGNUP}>
          <Button variant="white" size="lg">
            Get Started Free
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default HowItWorksLandlordsPage
