import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'
import './HowItWorksPages.css'

function HowItWorksRentersPage() {
  return (
    <div className="hiw-page">
      <section className="hiw-hero">
        <div className="hiw-hero-content">
          <span className="hiw-badge">For Renters</span>
          <h1>Find Your Perfect Room</h1>
          <p>
            Affordable rooms with flexible weekly payments, no credit checks required, and
            transparent pricing.
          </p>
          <Link to={ROUTES.SEARCH}>
            <Button variant="primary" size="lg">
              Browse Rooms
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
              <div className="hiw-step-icon">&#128269;</div>
              <h3>Search & Browse</h3>
              <p>
                Browse rooms in your area. Filter by price, amenities, and location. See all costs
                upfront with no hidden fees.
              </p>
            </div>
            <div className="hiw-step">
              <div className="hiw-step-number">2</div>
              <div className="hiw-step-icon">&#128221;</div>
              <h3>Apply Online</h3>
              <p>
                Submit a quick application. No credit checks required. Some hosts may request a
                background check.
              </p>
            </div>
            <div className="hiw-step">
              <div className="hiw-step-number">3</div>
              <div className="hiw-step-icon">&#129309;</div>
              <h3>Get Approved</h3>
              <p>
                Chat with the host, schedule a tour, and get approved. Sign your lease digitally and
                set up payments.
              </p>
            </div>
            <div className="hiw-step">
              <div className="hiw-step-number">4</div>
              <div className="hiw-step-icon">&#127968;</div>
              <h3>Move In</h3>
              <p>
                Pay your first week's rent and move in. Rent is collected automatically - weekly or
                monthly, you choose.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hiw-features">
        <div className="hiw-container">
          <h2>Why Renters Love RoomPilot</h2>
          <div className="hiw-features-grid">
            <div className="hiw-feature">
              <span className="hiw-feature-icon">&#128176;</span>
              <h3>Low Move-In Costs</h3>
              <p>
                Just your first week's rent to move in. No first/last/deposit requirements like
                traditional apartments.
              </p>
            </div>
            <div className="hiw-feature">
              <span className="hiw-feature-icon">&#128197;</span>
              <h3>Flexible Payments</h3>
              <p>
                Pay weekly or monthly based on your paycheck schedule. Budget-friendly for gig
                workers and hourly employees.
              </p>
            </div>
            <div className="hiw-feature">
              <span className="hiw-feature-icon">&#128101;</span>
              <h3>No Credit Checks</h3>
              <p>
                Bad credit? No credit? No problem. We believe everyone deserves access to affordable
                housing.
              </p>
            </div>
            <div className="hiw-feature">
              <span className="hiw-feature-icon">&#128274;</span>
              <h3>Transparent Pricing</h3>
              <p>
                No hidden membership fees or service charges. The price you see is the price you
                pay.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hiw-cta">
        <h2>Ready to Find Your Room?</h2>
        <p>Browse hundreds of affordable rooms near you</p>
        <Link to={ROUTES.SEARCH}>
          <Button variant="white" size="lg">
            Start Searching
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default HowItWorksRentersPage
