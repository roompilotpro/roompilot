import './LegalPages.css'

function PrivacyPage() {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: January 2025</p>
      </section>

      <section className="legal-content">
        <div className="legal-container">
          <div className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li>Account information (name, email, phone number)</li>
              <li>Profile information (photo, bio, verification documents)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Communications between users</li>
              <li>Property listing information</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Prevent fraudulent transactions and monitor against theft</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>
                Other users as needed to facilitate rentals (e.g., hosts see renter applications)
              </li>
              <li>Service providers who assist in our operations (payment processing, hosting)</li>
              <li>Law enforcement when required by law</li>
              <li>Background check providers, with your consent</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </div>

          <div className="legal-section">
            <h2>4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including
              encryption in transit (SSL/TLS) and at rest. Payment information is processed through
              Stripe, which is PCI DSS Level 1 certified.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Cookies</h2>
            <p>
              We use cookies and similar technologies to provide functionality, analyze usage, and
              personalize your experience. You can control cookies through your browser settings.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Contact Us</h2>
            <p>
              For privacy-related inquiries, please contact us at{' '}
              <a href="mailto:privacy@roompilot.com">privacy@roompilot.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPage
