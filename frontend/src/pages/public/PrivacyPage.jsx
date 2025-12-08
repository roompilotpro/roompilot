import { Link } from 'react-router-dom'
import { ROUTES } from '../../router/routes'

const TOC_ITEMS = [
  { id: 'introduction', label: '1. Introduction' },
  { id: 'collection', label: '2. Information We Collect' },
  { id: 'usage', label: '3. How We Use Your Information' },
  { id: 'sharing', label: '4. Information Sharing' },
  { id: 'retention', label: '5. Data Retention' },
  { id: 'security', label: '6. Data Security' },
  { id: 'rights', label: '7. Your Privacy Rights' },
  { id: 'cookies', label: '8. Cookies and Tracking' },
  { id: 'children', label: "9. Children's Privacy" },
  { id: 'international', label: '10. International Transfers' },
  { id: 'changes', label: '11. Changes to Privacy Policy' },
  { id: 'contact', label: '12. Contact Us' },
]

function PrivacyPage() {
  const scrollToSection = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="bg-white" style={{ lineHeight: '1.7' }}>
      {/* Header */}
      <section className="bg-snow px-8 py-12 border-b border-cloud">
        <div className="max-w-[800px] mx-auto">
          <h1 className="font-display font-bold text-[2.5rem] text-midnight mb-2">
            Privacy Policy
          </h1>
          <p className="text-mist text-[0.9375rem] leading-[1.7]">Last Updated: December 1, 2024</p>
        </div>
      </section>

      {/* Content with TOC */}
      <div className="flex max-w-[1200px] mx-auto px-8 py-12 gap-12">
        {/* Table of Contents */}
        <aside className="hidden lg:block flex-shrink-0 w-[250px] sticky top-8 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
          <h3 className="text-[0.875rem] font-semibold text-mist uppercase tracking-[0.05em] mb-4 leading-[1.7]">
            Contents
          </h3>
          <ul className="list-none">
            {TOC_ITEMS.map((item) => (
              <li key={item.id} className="mb-2">
                <a
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className="text-slate text-[0.9375rem] hover:text-primary transition-colors block py-1 no-underline leading-[1.7]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-[800px]">
          {/* Section 1: Introduction */}
          <section id="introduction" className="mb-12">
            <h2 className="font-display font-bold text-[1.75rem] text-midnight mb-4 pt-4">
              1. Introduction
            </h2>
            <p className="text-slate mb-4 leading-[1.7]">
              Welcome to RoomPilot. We respect your privacy and are committed to protecting your
              personal information. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our platform, website, and mobile application
              (collectively, the "Platform").
            </p>
            <p className="text-slate mb-4 leading-[1.7]">
              By using the Platform, you agree to the collection and use of information in
              accordance with this Privacy Policy. If you do not agree with our policies and
              practices, please do not use the Platform.
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section id="collection" className="mb-12">
            <h2 className="font-display font-bold text-[1.75rem] text-midnight mb-4 pt-4">
              2. Information We Collect
            </h2>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              2.1 Information You Provide
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              We collect information you provide directly to us, including:
            </p>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">
                <strong>Account Information:</strong> Name, email address, phone number, password,
                and profile photo
              </li>
              <li className="mb-2">
                <strong>Profile Information:</strong> Bio, employment history, references, and
                preferences
              </li>
              <li className="mb-2">
                <strong>Identity Verification:</strong> Government-issued ID, date of birth, and
                Social Security number (for hosts)
              </li>
              <li className="mb-2">
                <strong>Payment Information:</strong> Bank account details, credit/debit card
                information (processed by Stripe)
              </li>
              <li className="mb-2">
                <strong>Listing Information:</strong> Property details, photos, descriptions, and
                pricing
              </li>
              <li className="mb-2">
                <strong>Communications:</strong> Messages, reviews, and other communications with
                users or support
              </li>
            </ul>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              2.2 Automatically Collected Information
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              When you use the Platform, we automatically collect:
            </p>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">
                <strong>Device Information:</strong> IP address, browser type, operating system, and
                device identifiers
              </li>
              <li className="mb-2">
                <strong>Usage Information:</strong> Pages viewed, features used, search queries, and
                interaction patterns
              </li>
              <li className="mb-2">
                <strong>Location Information:</strong> Approximate location based on IP address or
                precise location (with permission)
              </li>
              <li className="mb-2">
                <strong>Cookies and Similar Technologies:</strong> See Section 8 for details
              </li>
            </ul>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              2.3 Information from Third Parties
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              We may receive information from third parties, including:
            </p>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">
                Background check providers (criminal history, eviction records)
              </li>
              <li className="mb-2">Identity verification services</li>
              <li className="mb-2">Payment processors (Stripe)</li>
              <li className="mb-2">Social media platforms (if you connect your accounts)</li>
              <li className="mb-2">Public databases and records</li>
            </ul>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section id="usage" className="mb-12">
            <h2 className="font-display font-bold text-[1.75rem] text-midnight mb-4 pt-4">
              3. How We Use Your Information
            </h2>
            <p className="text-slate mb-4 leading-[1.7]">
              We use your information for the following purposes:
            </p>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              3.1 Platform Operation
            </h3>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">Create and manage your account</li>
              <li className="mb-2">Process bookings and payments</li>
              <li className="mb-2">Facilitate communication between hosts and renters</li>
              <li className="mb-2">Provide customer support</li>
              <li className="mb-2">Send transactional emails and notifications</li>
            </ul>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              3.2 Safety and Security
            </h3>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">Verify user identities</li>
              <li className="mb-2">Conduct background checks (with consent)</li>
              <li className="mb-2">Detect and prevent fraud, spam, and abuse</li>
              <li className="mb-2">Enforce our Terms of Service</li>
              <li className="mb-2">Comply with legal obligations</li>
            </ul>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              3.3 Improvement and Personalization
            </h3>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">Analyze usage patterns and trends</li>
              <li className="mb-2">Improve Platform features and functionality</li>
              <li className="mb-2">Personalize search results and recommendations</li>
              <li className="mb-2">Conduct research and development</li>
            </ul>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              3.4 Marketing and Communications
            </h3>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">Send promotional emails and newsletters (with consent)</li>
              <li className="mb-2">Display targeted advertisements</li>
              <li className="mb-2">Conduct surveys and gather feedback</li>
            </ul>
          </section>

          {/* Section 4: Information Sharing */}
          <section id="sharing" className="mb-12">
            <h2 className="font-display font-bold text-[1.75rem] text-midnight mb-4 pt-4">
              4. Information Sharing
            </h2>
            <p className="text-slate mb-4 leading-[1.7]">
              We share your information in the following circumstances:
            </p>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              4.1 With Other Users
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              When you create a listing or apply to rent, certain information is shared with other
              users:
            </p>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">
                Hosts can see renter profiles, employment history, and references
              </li>
              <li className="mb-2">Renters can see host profiles and property information</li>
              <li className="mb-2">Reviews and ratings are publicly visible</li>
            </ul>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              4.2 Service Providers
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              We share information with third-party service providers who perform services on our
              behalf:
            </p>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">Payment processing (Stripe)</li>
              <li className="mb-2">Background checks (Checkr, TransUnion)</li>
              <li className="mb-2">Identity verification</li>
              <li className="mb-2">Cloud hosting and data storage</li>
              <li className="mb-2">Email and communication services</li>
              <li className="mb-2">Analytics and advertising providers</li>
            </ul>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              4.3 Legal Requirements
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              We may disclose your information if required by law or in response to:
            </p>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">Court orders, subpoenas, or legal processes</li>
              <li className="mb-2">Government or regulatory requests</li>
              <li className="mb-2">Protection of our rights, property, or safety</li>
              <li className="mb-2">Emergency situations involving danger or death</li>
            </ul>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              4.4 Business Transfers
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              In the event of a merger, acquisition, or sale of assets, your information may be
              transferred to the acquiring entity.
            </p>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              4.5 With Your Consent
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              We may share your information for other purposes with your explicit consent.
            </p>
          </section>

          {/* Section 5: Data Retention */}
          <section id="retention" className="mb-12">
            <h2 className="font-display font-bold text-[1.75rem] text-midnight mb-4 pt-4">
              5. Data Retention
            </h2>
            <p className="text-slate mb-4 leading-[1.7]">
              We retain your information for as long as necessary to provide our services and comply
              with legal obligations:
            </p>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">
                <strong>Active Accounts:</strong> Information is retained while your account is
                active
              </li>
              <li className="mb-2">
                <strong>Deleted Accounts:</strong> Most information is deleted within 30 days, but
                some data may be retained for legal or business purposes
              </li>
              <li className="mb-2">
                <strong>Transaction Records:</strong> Payment and booking history retained for 7
                years for tax and legal compliance
              </li>
              <li className="mb-2">
                <strong>Communications:</strong> Messages and support tickets retained for 2 years
              </li>
            </ul>
          </section>

          {/* Section 6: Data Security */}
          <section id="security" className="mb-12">
            <h2 className="font-display font-bold text-[1.75rem] text-midnight mb-4 pt-4">
              6. Data Security
            </h2>
            <p className="text-slate mb-4 leading-[1.7]">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">256-bit SSL/TLS encryption for data transmission</li>
              <li className="mb-2">Encrypted data storage</li>
              <li className="mb-2">Regular security audits and penetration testing</li>
              <li className="mb-2">Access controls and authentication requirements</li>
              <li className="mb-2">Employee training on data privacy and security</li>
            </ul>

            <div className="bg-primary-bg border-l-4 border-primary p-5 rounded-sm my-6">
              <p className="text-slate mb-2 last:mb-0 leading-[1.7]">
                <strong>Important:</strong> While we use reasonable security measures, no method of
                transmission over the internet is 100% secure. You are responsible for maintaining
                the confidentiality of your account credentials.
              </p>
            </div>
          </section>

          {/* Section 7: Your Privacy Rights */}
          <section id="rights" className="mb-12">
            <h2 className="font-display font-bold text-[1.75rem] text-midnight mb-4 pt-4">
              7. Your Privacy Rights
            </h2>
            <p className="text-slate mb-4 leading-[1.7]">
              Depending on your location, you may have the following rights:
            </p>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              7.1 Access and Portability
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              You can request a copy of your personal information in a portable format.
            </p>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              7.2 Correction
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              You can update or correct your information through account settings or by contacting
              us.
            </p>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              7.3 Deletion
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              You can request deletion of your account and personal information, subject to legal
              retention requirements.
            </p>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              7.4 Objection and Restriction
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              You can object to certain processing activities or request restrictions on how we use
              your data.
            </p>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              7.5 Opt-Out
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              You can opt out of marketing communications by clicking "unsubscribe" in emails or
              adjusting settings.
            </p>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              7.6 California Privacy Rights
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              California residents have additional rights under CCPA, including the right to know
              what personal information is collected and the right to opt-out of sale (we do not
              sell personal information).
            </p>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              7.7 GDPR Rights
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              EU residents have rights under GDPR, including data portability, erasure, and the
              right to lodge complaints with supervisory authorities.
            </p>

            <p className="text-slate mb-4 leading-[1.7]">
              To exercise these rights, contact us at privacy@roompilot.com.
            </p>
          </section>

          {/* Section 8: Cookies and Tracking */}
          <section id="cookies" className="mb-12">
            <h2 className="font-display font-bold text-[1.75rem] text-midnight mb-4 pt-4">
              8. Cookies and Tracking Technologies
            </h2>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              8.1 What We Use
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              We use cookies, web beacons, and similar technologies to:
            </p>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">Remember your preferences and settings</li>
              <li className="mb-2">Authenticate your account</li>
              <li className="mb-2">Analyze site traffic and usage patterns</li>
              <li className="mb-2">Deliver targeted advertising</li>
              <li className="mb-2">Prevent fraud and abuse</li>
            </ul>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              8.2 Types of Cookies
            </h3>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">
                <strong>Essential Cookies:</strong> Required for Platform functionality
              </li>
              <li className="mb-2">
                <strong>Analytics Cookies:</strong> Help us understand how users interact with the
                Platform
              </li>
              <li className="mb-2">
                <strong>Advertising Cookies:</strong> Used to deliver relevant ads
              </li>
              <li className="mb-2">
                <strong>Preference Cookies:</strong> Remember your settings and choices
              </li>
            </ul>

            <h3 className="font-display font-bold text-[1.25rem] text-midnight mt-6 mb-3">
              8.3 Your Choices
            </h3>
            <p className="text-slate mb-4 leading-[1.7]">
              Most browsers allow you to block or delete cookies. However, disabling cookies may
              affect Platform functionality. You can also opt out of targeted advertising through
              industry opt-out tools.
            </p>
          </section>

          {/* Section 9: Children Privacy */}
          <section id="children" className="mb-12">
            <h2 className="font-display font-bold text-[1.75rem] text-midnight mb-4 pt-4">
              9. Children&apos;s Privacy
            </h2>
            <p className="text-slate mb-4 leading-[1.7]">
              The Platform is not intended for children under 18. We do not knowingly collect
              information from children. If you believe we have inadvertently collected information
              from a child, please contact us immediately.
            </p>
          </section>

          {/* Section 10: International Transfers */}
          <section id="international" className="mb-12">
            <h2 className="font-display font-bold text-[1.75rem] text-midnight mb-4 pt-4">
              10. International Data Transfers
            </h2>
            <p className="text-slate mb-4 leading-[1.7]">
              Your information may be transferred to and processed in countries other than your own.
              We ensure adequate protections through:
            </p>
            <ul className="text-slate mb-4 pl-6 list-disc leading-[1.7]">
              <li className="mb-2">
                Standard contractual clauses approved by the European Commission
              </li>
              <li className="mb-2">Data processing agreements with third-party providers</li>
              <li className="mb-2">Compliance with applicable data protection laws</li>
            </ul>
          </section>

          {/* Section 11: Changes */}
          <section id="changes" className="mb-12">
            <h2 className="font-display font-bold text-[1.75rem] text-midnight mb-4 pt-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-slate mb-4 leading-[1.7]">
              We may update this Privacy Policy from time to time. We will notify you of material
              changes via email or Platform notification. Your continued use of the Platform after
              such changes constitutes acceptance of the updated policy.
            </p>
            <p className="text-slate mb-4 leading-[1.7]">
              We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          {/* Section 12: Contact Us */}
          <section id="contact" className="mb-12">
            <h2 className="font-display font-bold text-[1.75rem] text-midnight mb-4 pt-4">
              12. Contact Us
            </h2>
            <p className="text-slate mb-4 leading-[1.7]">
              If you have questions or concerns about this Privacy Policy or our privacy practices,
              please contact us:
            </p>

            <div className="bg-primary-bg border-l-4 border-primary p-5 rounded-sm my-6">
              <p className="text-slate mb-2 last:mb-0 leading-[1.7]">
                <strong>RoomPilot, Inc.</strong>
              </p>
              <p className="text-slate mb-2 last:mb-0 leading-[1.7]">
                Email: privacy@roompilot.com
              </p>
              <p className="text-slate mb-2 last:mb-0 leading-[1.7]">
                Address: 123 Main Street, San Francisco, CA 94105
              </p>
              <p className="text-slate mb-2 last:mb-0 leading-[1.7]">Phone: (555) 123-4567</p>
            </div>

            <p className="text-slate mb-4 leading-[1.7]">
              For EU residents, our Data Protection Officer can be reached at dpo@roompilot.com.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default PrivacyPage
