import './LegalPages.css'

function TermsPage() {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: January 2025</p>
      </section>

      <section className="legal-content">
        <div className="legal-container">
          <div className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using RoomPilot's services, you agree to be bound by these Terms of
              Service and all applicable laws and regulations. If you do not agree with any of these
              terms, you are prohibited from using or accessing this site.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Use of Service</h2>
            <p>
              RoomPilot provides a platform that connects property owners ("Hosts") with individuals
              seeking room rentals ("Renters"). We facilitate the listing, discovery, and payment
              processing for room rentals but are not a party to any rental agreement between Hosts
              and Renters.
            </p>
            <h3>2.1 Account Registration</h3>
            <p>
              You must register for an account to use certain features of our service. You agree to
              provide accurate, current, and complete information during registration and to update
              such information to keep it accurate.
            </p>
            <h3>2.2 Account Security</h3>
            <p>
              You are responsible for safeguarding your account credentials and for any activities
              or actions under your account. Notify us immediately of any unauthorized use.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. Host Responsibilities</h2>
            <p>As a Host, you agree to:</p>
            <ul>
              <li>Provide accurate and complete information about your listings</li>
              <li>Comply with all applicable laws, including Fair Housing laws</li>
              <li>Maintain safe and habitable living conditions</li>
              <li>Respond to renter inquiries and maintenance requests in a timely manner</li>
              <li>Not discriminate against renters based on protected characteristics</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Renter Responsibilities</h2>
            <p>As a Renter, you agree to:</p>
            <ul>
              <li>Provide accurate information in your application</li>
              <li>Pay rent on time according to your lease agreement</li>
              <li>Respect house rules and common areas</li>
              <li>Report maintenance issues promptly</li>
              <li>Not engage in illegal activities on the premises</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Payments and Fees</h2>
            <p>
              RoomPilot facilitates payment processing through Stripe. All payment terms, including
              rent amounts, payment schedules, and late fees are established between Hosts and
              Renters. RoomPilot charges service fees as outlined on our Pricing page.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Limitation of Liability</h2>
            <p>
              RoomPilot is not responsible for the conduct of any user, the condition of any
              property, or disputes between Hosts and Renters. We provide the platform "as is"
              without warranties of any kind.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Contact Us</h2>
            <p>
              If you have questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@roompilot.com">legal@roompilot.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsPage
