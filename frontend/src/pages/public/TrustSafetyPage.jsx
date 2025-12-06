import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'
import './LegalPages.css'

function TrustSafetyPage() {
  return (
    <div className="legal-page trust-safety-page">
      <section className="legal-hero trust-hero">
        <h1>Trust & Safety</h1>
        <p>Your safety is our top priority. Learn how we protect our community.</p>
      </section>

      <section className="legal-content">
        <div className="legal-container">
          <div className="trust-grid">
            <div className="trust-card">
              <span className="trust-icon">&#128100;</span>
              <h3>Verified Users</h3>
              <p>
                All hosts must verify their identity with government-issued ID and pass Stripe KYC
                verification before listing.
              </p>
            </div>
            <div className="trust-card">
              <span className="trust-icon">&#128274;</span>
              <h3>Secure Payments</h3>
              <p>
                All payments are processed through Stripe with bank-level 256-bit SSL encryption.
                Never send money outside the platform.
              </p>
            </div>
            <div className="trust-card">
              <span className="trust-icon">&#128269;</span>
              <h3>Background Checks</h3>
              <p>
                Optional background checks available for hosts who want additional screening. You
                control who sees your report.
              </p>
            </div>
            <div className="trust-card">
              <span className="trust-icon">&#128172;</span>
              <h3>Secure Messaging</h3>
              <p>
                All communication happens through our platform, creating a record and keeping your
                personal contact info private.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>How We Protect You</h2>
            <h3>For Hosts</h3>
            <ul>
              <li>Screen tenants with optional background checks</li>
              <li>Automated payment collection reduces missed payments</li>
              <li>Built-in lease templates and legal resources</li>
              <li>24/7 support for disputes and emergencies</li>
            </ul>
            <h3>For Renters</h3>
            <ul>
              <li>All hosts are verified with ID and property ownership</li>
              <li>Secure deposits held in escrow</li>
              <li>Review system to share experiences</li>
              <li>Resolution center for disputes</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>Reporting Issues</h2>
            <p>
              If you encounter suspicious activity, scams, or safety concerns, report them
              immediately using the "Report" button in any conversation or listing. Our team
              investigates all reports within 24 hours.
            </p>
            <h3>Red Flags to Watch For</h3>
            <ul>
              <li>Requests to pay outside the platform</li>
              <li>Pressure to make quick decisions</li>
              <li>Listings that seem too good to be true</li>
              <li>Requests for sensitive personal information</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>Emergency Contacts</h2>
            <p>
              For immediate safety concerns, contact local emergency services (911). For
              non-emergency safety issues, contact our Trust & Safety team at{' '}
              <a href="mailto:safety@roompilot.com">safety@roompilot.com</a>.
            </p>
          </div>

          <div className="trust-cta">
            <h2>Questions?</h2>
            <p>Our support team is available 24/7 to help with any safety concerns.</p>
            <Link to={ROUTES.CONTACT}>
              <Button variant="primary" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TrustSafetyPage
