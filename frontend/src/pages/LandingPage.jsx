import { Link } from 'react-router-dom';
import './LandingPage.css';

/**
 * Public landing page with marketing content.
 * Visible without authentication.
 */
const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <nav>
            <a href="#hero" className="logo">🚀 RoomPilot</a>
            <div className="nav-menu">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <Link to="/test">Test App</Link>
              <Link to="/login" className="btn-gradient">Login</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="animated-bg">
          <div className="floating-shape shape1"></div>
          <div className="floating-shape shape2"></div>
          <div className="floating-shape shape3"></div>
        </div>

        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1>
                Your Rental Business on <span className="highlight">Autopilot</span>
              </h1>
              <p>
                RoomPilot automates 90% of your property management tasks. Collect
                rent, screen residents, and manage communications - all while you
                sleep.
              </p>

              <div className="hero-buttons">
                <Link to="/login" className="btn-gradient">Launch Your Business</Link>
                <a href="#automation" className="btn-outline">See It In Action</a>
              </div>

              <div style={{ display: 'flex', gap: '40px' }}>
                <div>
                  <strong style={{ fontSize: '24px', color: '#667eea' }}>2%</strong><br />
                  <span style={{ color: '#999' }}>Platform Fee</span>
                </div>
                <div>
                  <strong style={{ fontSize: '24px', color: '#667eea' }}>24hr</strong><br />
                  <span style={{ color: '#999' }}>Payouts</span>
                </div>
                <div>
                  <strong style={{ fontSize: '24px', color: '#667eea' }}>100%</strong><br />
                  <span style={{ color: '#999' }}>Your Control</span>
                </div>
              </div>
            </div>

            <div className="automation-preview">
              <div className="automation-header">
                <div className="automation-icon">⚡</div>
                <div className="automation-title">
                  <h3>Automation in Action</h3>
                  <p>Watch your business run itself</p>
                </div>
              </div>

              <div className="automation-steps">
                <div className="step">
                  <span className="step-number">1</span>
                  <div className="step-content">
                    Resident applies through your listing
                  </div>
                  <span className="step-check">✓</span>
                </div>
                <div className="step">
                  <span className="step-number">2</span>
                  <div className="step-content">
                    Background check runs automatically
                  </div>
                  <span className="step-check">✓</span>
                </div>
                <div className="step">
                  <span className="step-number">3</span>
                  <div className="step-content">
                    Weekly rent collected on autopilot
                  </div>
                  <span className="step-check">✓</span>
                </div>
                <div className="step">
                  <span className="step-number">4</span>
                  <div className="step-content">
                    Instant payout to your bank account
                  </div>
                  <span className="step-check">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="stats-banner">
        <div className="container">
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-number">$14,400</div>
              <div className="stat-label">Saved Annually (5 Rooms)</div>
            </div>
            <div className="stat">
              <div className="stat-number">90%</div>
              <div className="stat-label">Tasks Automated</div>
            </div>
            <div className="stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Always Working</div>
            </div>
            <div className="stat">
              <div className="stat-number">0</div>
              <div className="stat-label">Hidden Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Automation Features */}
      <section className="automation-features" id="automation">
        <div className="container">
          <div className="section-header" id="features">
            <h2>Automation That Actually Works</h2>
            <p>Set it once, forget it forever</p>
          </div>

          <div className="automation-grid">
            <div className="automation-card">
              <h3><span className="icon">💰</span> Smart Billing Engine</h3>
              <p>
                Our intelligent billing system handles everything from weekly
                collections to late fees, all customizable to your rules.
              </p>
              <ul className="automation-benefits">
                <li>Auto-charge weekly or monthly</li>
                <li>Smart retry on failed payments</li>
                <li>Automatic late fee application</li>
                <li>Instant receipt generation</li>
              </ul>
            </div>

            <div className="automation-card">
              <h3><span className="icon">👤</span> Resident Screening AI</h3>
              <p>
                Advanced screening that runs automatically when someone applies,
                giving you instant recommendations.
              </p>
              <ul className="automation-benefits">
                <li>Background checks in minutes</li>
                <li>Income verification</li>
                <li>Reference checking</li>
                <li>Risk scoring algorithm</li>
              </ul>
            </div>

            <div className="automation-card">
              <h3><span className="icon">💬</span> Communication Hub</h3>
              <p>
                Automated messages keep everyone informed without you lifting a
                finger.
              </p>
              <ul className="automation-benefits">
                <li>Payment reminders</li>
                <li>Move-in instructions</li>
                <li>House announcements</li>
                <li>Maintenance updates</li>
              </ul>
            </div>

            <div className="automation-card">
              <h3><span className="icon">📊</span> Smart Analytics</h3>
              <p>
                Real-time insights and reporting that help you optimize your
                business.
              </p>
              <ul className="automation-benefits">
                <li>Revenue tracking</li>
                <li>Occupancy optimization</li>
                <li>Resident behavior insights</li>
                <li>Financial forecasting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Choose the plan that works for your business</p>
          </div>

          <div className="pricing-options">
            <div className="pricing-card">
              <h3>Transaction Based</h3>
              <div className="price">2%</div>
              <p className="price-description">Of rent collected</p>
              <ul className="pricing-features">
                <li>Pay only when you earn</li>
                <li>No upfront costs</li>
                <li>All features included</li>
                <li>Unlimited properties</li>
                <li>24/7 automation</li>
              </ul>
              <Link to="/login" className="btn-gradient">Start Earning</Link>
            </div>

            <div className="pricing-card popular">
              <span className="popular-badge">Most Popular</span>
              <h3>Flat Monthly</h3>
              <div className="price">$15</div>
              <p className="price-description">Per room per month</p>
              <ul className="pricing-features">
                <li>Predictable costs</li>
                <li>Save on high-rent rooms</li>
                <li>All features included</li>
                <li>Priority support</li>
                <li>Advanced analytics</li>
              </ul>
              <Link to="/login" className="btn-gradient">Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta" id="cta">
        <div className="container">
          <h2>Ready to Automate Your Success?</h2>
          <p>Join hundreds of hosts who've already made the switch</p>

          <form
            action="https://formspree.io/f/mldadzqy"
            method="POST"
            className="email-capture"
          >
            <input
              type="email"
              name="email"
              className="email-input"
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="btn-gradient">Get Early Access</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>RoomPilot</h3>
              <p>
                The future of room rental management. Automate everything, keep
                more profit, maintain full control.
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 RoomPilot. Built with ❤️ for independent hosts.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
