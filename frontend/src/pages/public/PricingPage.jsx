import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button, Badge } from '../../components/primitives'
import { PricingCard } from '../../components/cards'
import { ROUTES } from '../../router/routes'
import './PricingPage.css'

/**
 * PricingPage - Pricing plans and comparison
 * Shows pricing options, calculator, and competitor comparison
 */
function PricingPage() {
  const [numRooms, setNumRooms] = useState(5)
  const [avgRent, setAvgRent] = useState(600)

  const calculations = useMemo(() => {
    const totalRent = numRooms * avgRent
    const rpTransaction = Math.round(totalRent * 0.02)
    const rpFlat = numRooms * 15
    const padsplit = 99 + numRooms * 10 + Math.round(totalRent * 0.03)
    const bungalow = Math.round(totalRent * 0.12)
    const bestRP = Math.min(rpTransaction, rpFlat)
    const savings = padsplit - bestRP

    return {
      rpTransaction,
      rpFlat,
      padsplit,
      bungalow,
      savings,
    }
  }, [numRooms, avgRent])

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="pricing-hero-container">
          <h1>Simple, Transparent Pricing</h1>
          <p>No hidden fees. No surprises. Choose the plan that works best for your business.</p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-section">
        <div className="pricing-cards-container">
          <div className="pricing-cards">
            <div className="pricing-card recommended">
              <Badge variant="primary" className="pricing-badge">
                Most Popular
              </Badge>
              <h3>Transaction Fee Plan</h3>
              <p className="pricing-description">
                Perfect for hosts who want zero monthly overhead
              </p>
              <div className="pricing-price">
                <span className="pricing-amount">2%</span>
                <span className="pricing-period">per payment</span>
              </div>
              <ul className="pricing-features">
                <li>
                  <span className="check">&#10003;</span> No monthly subscription fee
                </li>
                <li>
                  <span className="check">&#10003;</span> Unlimited rooms
                </li>
                <li>
                  <span className="check">&#10003;</span> Automated rent collection
                </li>
                <li>
                  <span className="check">&#10003;</span> Daily/weekly payouts
                </li>
                <li>
                  <span className="check">&#10003;</span> Full dashboard access
                </li>
                <li>
                  <span className="check">&#10003;</span> Tenant screening tools
                </li>
                <li>
                  <span className="check">&#10003;</span> In-app messaging
                </li>
                <li>
                  <span className="check">&#10003;</span> Payment protection
                </li>
              </ul>
              <Link to={ROUTES.SIGNUP}>
                <Button variant="primary" fullWidth>
                  Get Started Free
                </Button>
              </Link>
            </div>

            <div className="pricing-card">
              <h3>Flat Rate Plan</h3>
              <p className="pricing-description">Great for high-volume hosts with many rooms</p>
              <div className="pricing-price">
                <span className="pricing-amount">$15</span>
                <span className="pricing-period">per room/month</span>
              </div>
              <ul className="pricing-features">
                <li>
                  <span className="check">&#10003;</span> 0% transaction fees
                </li>
                <li>
                  <span className="check">&#10003;</span> Unlimited rooms
                </li>
                <li>
                  <span className="check">&#10003;</span> Automated rent collection
                </li>
                <li>
                  <span className="check">&#10003;</span> Daily/weekly payouts
                </li>
                <li>
                  <span className="check">&#10003;</span> Full dashboard access
                </li>
                <li>
                  <span className="check">&#10003;</span> Tenant screening tools
                </li>
                <li>
                  <span className="check">&#10003;</span> In-app messaging
                </li>
                <li>
                  <span className="check">&#10003;</span> Payment protection
                </li>
              </ul>
              <Link to={ROUTES.SIGNUP}>
                <Button variant="secondary" fullWidth>
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="pricing-section pricing-section--alt">
        <div className="pricing-container">
          <div className="pricing-header">
            <h2>Everything You Need, Included</h2>
            <p>Both plans include all features. No upgrades, add-ons, or premium tiers.</p>
          </div>
          <div className="included-grid">
            <div className="included-column">
              <h4>Payment Processing</h4>
              <ul>
                <li>&#10003; Weekly/monthly rent collection</li>
                <li>&#10003; Automatic late fees</li>
                <li>&#10003; ACH & card payments</li>
                <li>&#10003; Fast payouts via Stripe</li>
              </ul>
            </div>
            <div className="included-column">
              <h4>Tenant Management</h4>
              <ul>
                <li>&#10003; Application review system</li>
                <li>&#10003; Background check integration</li>
                <li>&#10003; Digital lease signing</li>
                <li>&#10003; Maintenance requests</li>
              </ul>
            </div>
            <div className="included-column">
              <h4>Business Tools</h4>
              <ul>
                <li>&#10003; Revenue analytics</li>
                <li>&#10003; Financial reports</li>
                <li>&#10003; Multi-property management</li>
                <li>&#10003; Mobile app access</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="pricing-section">
        <div className="pricing-container">
          <div className="pricing-header">
            <h2>Calculate Your Savings</h2>
            <p>See how much you'll save compared to competitors</p>
          </div>
          <div className="calculator">
            <h3>Savings Calculator</h3>
            <div className="calculator-inputs">
              <div className="input-group">
                <label htmlFor="numRooms">Number of Rooms</label>
                <input
                  type="number"
                  id="numRooms"
                  value={numRooms}
                  onChange={(e) => setNumRooms(parseInt(e.target.value) || 0)}
                  min="1"
                  max="50"
                />
              </div>
              <div className="input-group">
                <label htmlFor="avgRent">Average Monthly Rent per Room</label>
                <input
                  type="number"
                  id="avgRent"
                  value={avgRent}
                  onChange={(e) => setAvgRent(parseInt(e.target.value) || 0)}
                  min="100"
                  step="50"
                />
              </div>
            </div>
            <div className="calculator-results">
              <div className="result-row">
                <span>RoomPilot (Transaction Plan):</span>
                <span>${calculations.rpTransaction}/mo</span>
              </div>
              <div className="result-row">
                <span>RoomPilot (Flat Rate Plan):</span>
                <span>${calculations.rpFlat}/mo</span>
              </div>
              <div className="result-row">
                <span>PadSplit:</span>
                <span>${calculations.padsplit}/mo</span>
              </div>
              <div className="result-row">
                <span>Bungalow:</span>
                <span>${calculations.bungalow}/mo</span>
              </div>
              <div className="result-row savings">
                <span>You Save (vs PadSplit):</span>
                <span>${calculations.savings}/mo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pricing-section pricing-section--alt">
        <div className="pricing-container">
          <div className="pricing-header">
            <h2>How We Compare</h2>
            <p>Side-by-side comparison with industry competitors</p>
          </div>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="highlight">RoomPilot</th>
                  <th>PadSplit</th>
                  <th>Bungalow</th>
                </tr>
              </thead>
              <tbody>
                <tr className="highlight-row">
                  <td>Starting Price</td>
                  <td className="highlight good">
                    <strong>2% or $15/room</strong>
                  </td>
                  <td>$99 + $10/room + 3%</td>
                  <td>12% of rent</td>
                </tr>
                <tr>
                  <td>Weekly Rent Collection</td>
                  <td className="highlight good">&#10003; Included</td>
                  <td>&#10003; Included</td>
                  <td className="bad">&#10007; Monthly only</td>
                </tr>
                <tr>
                  <td>Payout Speed</td>
                  <td className="highlight good">Daily or weekly</td>
                  <td>Weekly</td>
                  <td>Monthly</td>
                </tr>
                <tr>
                  <td>Setup Fee</td>
                  <td className="highlight good">$0</td>
                  <td>$0</td>
                  <td className="bad">$500+</td>
                </tr>
                <tr>
                  <td>Host Controls Approval</td>
                  <td className="highlight good">&#10003; Yes</td>
                  <td>&#10003; Yes</td>
                  <td className="bad">&#10007; No</td>
                </tr>
                <tr>
                  <td>Custom House Rules</td>
                  <td className="highlight good">&#10003; Yes</td>
                  <td>Limited</td>
                  <td className="bad">&#10007; No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pricing-cta">
        <div className="pricing-container">
          <h2>Ready to Get Started?</h2>
          <p>Join RoomPilot today and start saving on property management fees.</p>
          <Link to={ROUTES.SIGNUP}>
            <Button variant="white" size="lg">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
