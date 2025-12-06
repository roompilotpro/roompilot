import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'
import './LandingPage.css'

/**
 * LandingPage - Main marketing/home page
 * Features hero section, problems/pain points, solution steps,
 * features grid, comparison table, and dual CTA sections
 */
function LandingPage() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-pattern" />

        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Now accepting early hosts
            </div>

            <h1 className="hero-title">
              Room rentals,
              <br />
              <span className="hero-title-accent">your way.</span>
            </h1>

            <p className="hero-subtitle">
              The automation-first marketplace that gives co-living landlords full control, fast
              payouts, and fees that don't eat your profits.
            </p>

            <div className="hero-ctas">
              <Link to={ROUTES.SIGNUP}>
                <Button variant="primary" size="lg">
                  List Your Property
                </Button>
              </Link>
              <Link to={ROUTES.SEARCH}>
                <Button variant="outline" size="lg">
                  Find a Room
                </Button>
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">
                  <span className="accent">2%</span>
                </div>
                <div className="hero-stat-label">Platform fee</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">Daily</div>
                <div className="hero-stat-label">Payouts available</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">100%</div>
                <div className="hero-stat-label">Your control</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-image" />
              <div className="hero-card-content">
                <div className="hero-card-header">
                  <div>
                    <div className="hero-card-title">Sunny Private Room</div>
                    <div className="hero-card-location">Midtown, Atlanta</div>
                  </div>
                  <div className="hero-card-price">
                    <div className="hero-card-price-value">$165</div>
                    <div className="hero-card-price-period">/week</div>
                  </div>
                </div>
                <div className="hero-card-tags">
                  <span className="hero-card-tag">Private bath</span>
                  <span className="hero-card-tag">Furnished</span>
                  <span className="hero-card-tag">Utilities incl.</span>
                </div>
              </div>
            </div>

            <div className="hero-float hero-float-1">
              <div className="hero-float-icon green">&#9889;</div>
              <div>
                <div className="hero-float-label">Payout sent</div>
                <div className="hero-float-value">$2,340.00</div>
              </div>
            </div>

            <div className="hero-float hero-float-2">
              <div className="hero-float-icon blue">&#10003;</div>
              <div>
                <div className="hero-float-label">Auto-collected</div>
                <div className="hero-float-value">Rent received</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="problems">
        <div className="problems-container">
          <div className="problems-header">
            <div className="section-label light">The Problem</div>
            <h2 className="problems-title">Current platforms take too much and give too little</h2>
            <p className="problems-subtitle">
              Co-living landlords are stuck with high fees, slow payouts, and platforms that treat
              them like employees instead of partners.
            </p>
          </div>

          <div className="problems-grid">
            <div className="problem-card">
              <div className="problem-icon">&#128184;</div>
              <h3 className="problem-title">Crushing Fees</h3>
              <p className="problem-description">
                Other platforms charge 8-10% of every payment, plus booking fees that take the first
                10 days of rent. That's hundreds lost per room, per year.
              </p>
              <div className="problem-stat">
                <span className="problem-stat-value">8%+</span>
                <span className="problem-stat-label">typical platform fee</span>
              </div>
            </div>

            <div className="problem-card">
              <div className="problem-icon">&#9203;</div>
              <h3 className="problem-title">Glacial Payouts</h3>
              <p className="problem-description">
                Monthly payouts with 30-day holds mean you're floating expenses while the platform
                sits on your money. Your cash flow shouldn't suffer for their convenience.
              </p>
              <div className="problem-stat">
                <span className="problem-stat-value">30+ days</span>
                <span className="problem-stat-label">to see your money</span>
              </div>
            </div>

            <div className="problem-card">
              <div className="problem-icon">&#127917;</div>
              <h3 className="problem-title">Zero Control</h3>
              <p className="problem-description">
                Forced tenant transfers, strict house rules you didn't set, and fines you have to
                enforce. You own the property, but they run the show.
              </p>
              <div className="problem-stat">
                <span className="problem-stat-value">$50</span>
                <span className="problem-stat-label">fines for minor violations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution">
        <div className="solution-container">
          <div className="solution-header">
            <div className="section-label dark">How It Works</div>
            <h2 className="solution-title">Simple for everyone</h2>
            <p className="solution-subtitle">
              Get started in minutes. List rooms, find tenants, collect rent—all on autopilot.
            </p>
          </div>

          <div className="solution-grid">
            <div className="solution-card">
              <div className="solution-card-number">1</div>
              <div className="solution-card-icon">&#127968;</div>
              <h3 className="solution-card-title">List Your Rooms</h3>
              <p className="solution-card-description">
                Add photos, set your price and rules. Connect Stripe for instant payouts.
              </p>
            </div>

            <div className="solution-card">
              <div className="solution-card-number">2</div>
              <div className="solution-card-icon">&#128100;</div>
              <h3 className="solution-card-title">Review Applications</h3>
              <p className="solution-card-description">
                Screen tenants your way. Approve who you want—we never force placements.
              </p>
            </div>

            <div className="solution-card">
              <div className="solution-card-number">3</div>
              <div className="solution-card-icon">&#129302;</div>
              <h3 className="solution-card-title">Automate Everything</h3>
              <p className="solution-card-description">
                Rent collection, reminders, late fees—all handled automatically.
              </p>
            </div>

            <div className="solution-card">
              <div className="solution-card-number">4</div>
              <div className="solution-card-icon">&#128176;</div>
              <h3 className="solution-card-title">Get Paid Fast</h3>
              <p className="solution-card-description">
                Daily or weekly payouts. No more waiting a month to see your money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="features-header">
            <div className="section-label dark">Why RoomPilot</div>
            <h2 className="features-title">Built for landlords who want to stay in charge</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card highlight">
              <div className="feature-icon white">&#9889;</div>
              <div className="feature-content">
                <h3 className="feature-title">2% fees. That's it.</h3>
                <p className="feature-description">
                  No booking fees. No first-10-days skim. No hidden charges. Just a simple 2%
                  transaction fee—or choose our flat $15/room monthly plan. Either way, you keep
                  more of what you earn.
                </p>
                <div className="feature-metrics">
                  <div className="feature-metric">
                    <span className="feature-metric-icon">&#10003;</span>
                    <span className="feature-metric-text">Save $500+/year per room</span>
                  </div>
                  <div className="feature-metric">
                    <span className="feature-metric-icon">&#10003;</span>
                    <span className="feature-metric-text">Transparent pricing</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">&#127939;</div>
              <div className="feature-content">
                <h3 className="feature-title">Daily Payouts</h3>
                <p className="feature-description">
                  Why wait 30 days? Get paid as tenants pay. Weekly billing means predictable income
                  and faster access to your money via Stripe.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon blue">&#128274;</div>
              <div className="feature-content">
                <h3 className="feature-title">Your House, Your Rules</h3>
                <p className="feature-description">
                  Set your own policies. Approve your own tenants. No forced transfers, no corporate
                  meddling. You're the landlord—act like it.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon amber">&#129302;</div>
              <div className="feature-content">
                <h3 className="feature-title">Fully Automated</h3>
                <p className="feature-description">
                  Payment reminders, late fees, receipts, notices—all handled automatically. Less
                  admin work, more time for what matters.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon purple">&#128172;</div>
              <div className="feature-content">
                <h3 className="feature-title">Built-in Communication</h3>
                <p className="feature-description">
                  House group chats, direct messaging, maintenance requests. Keep everything in one
                  place instead of juggling texts and emails.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison">
        <div className="comparison-container">
          <div className="comparison-header">
            <div className="section-label dark">Compare</div>
            <h2 className="comparison-title">See the difference</h2>
          </div>

          <div className="comparison-table">
            <div className="comparison-row header">
              <div className="comparison-cell label" />
              <div className="comparison-cell header roompilot">
                <div className="comparison-logo">
                  <div className="comparison-logo-icon rp">R</div>
                  RoomPilot
                </div>
              </div>
              <div className="comparison-cell header">
                <div className="comparison-logo">
                  <div className="comparison-logo-icon ps">P</div>
                  PadSplit
                </div>
              </div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Platform Fee</div>
              <div className="comparison-cell value roompilot comparison-good">2%</div>
              <div className="comparison-cell value comparison-bad">8%</div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Booking Fee</div>
              <div className="comparison-cell value roompilot comparison-good">None</div>
              <div className="comparison-cell value comparison-bad">First 10 days rent</div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Payouts</div>
              <div className="comparison-cell value roompilot comparison-good">Daily / Weekly</div>
              <div className="comparison-cell value">Monthly</div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Tenant Approval</div>
              <div className="comparison-cell value roompilot comparison-good">You decide</div>
              <div className="comparison-cell value">Platform assigns</div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Network Transfers</div>
              <div className="comparison-cell value roompilot comparison-good">Not allowed</div>
              <div className="comparison-cell value">Encouraged</div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">House Rules</div>
              <div className="comparison-cell value roompilot comparison-good">You set them</div>
              <div className="comparison-cell value">Platform mandates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className="dual-cta">
        <div className="dual-cta-container">
          <div className="cta-card landlord">
            <span className="cta-card-badge">For Landlords</span>
            <h3 className="cta-card-title">Start earning more from your rooms</h3>
            <p className="cta-card-description">
              Join the marketplace that respects your business. Lower fees, faster payouts, and zero
              micromanagement.
            </p>

            <div className="cta-card-features">
              <div className="cta-card-feature">
                <span className="cta-card-feature-icon">&#10003;</span>
                List unlimited rooms
              </div>
              <div className="cta-card-feature">
                <span className="cta-card-feature-icon">&#10003;</span>
                Automated rent collection
              </div>
              <div className="cta-card-feature">
                <span className="cta-card-feature-icon">&#10003;</span>
                Daily payouts via Stripe
              </div>
              <div className="cta-card-feature">
                <span className="cta-card-feature-icon">&#10003;</span>
                Full tenant control
              </div>
            </div>

            <Link to={ROUTES.SIGNUP}>
              <Button variant="primary" size="lg" fullWidth>
                List Your Property &rarr;
              </Button>
            </Link>
          </div>

          <div className="cta-card">
            <span className="cta-card-badge">For Renters</span>
            <h3 className="cta-card-title">Find affordable rooms near you</h3>
            <p className="cta-card-description">
              Browse private rooms at prices you can actually afford. No membership fees, no
              surprises. Just simple, honest renting.
            </p>

            <div className="cta-card-features">
              <div className="cta-card-feature">
                <span className="cta-card-feature-icon">&#10003;</span>
                Weekly payment options
              </div>
              <div className="cta-card-feature">
                <span className="cta-card-feature-icon">&#10003;</span>
                No hidden membership fees
              </div>
              <div className="cta-card-feature">
                <span className="cta-card-feature-icon">&#10003;</span>
                Fast application process
              </div>
              <div className="cta-card-feature">
                <span className="cta-card-feature-icon">&#10003;</span>
                Transparent pricing
              </div>
            </div>

            <Link to={ROUTES.SEARCH}>
              <Button variant="secondary" size="lg" fullWidth>
                Browse Rooms &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
