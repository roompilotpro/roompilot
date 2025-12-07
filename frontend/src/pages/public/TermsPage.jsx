import { Link } from 'react-router-dom'
import { ROUTES } from '../../router/routes'

const TOC_ITEMS = [
  { id: 'acceptance', label: '1. Acceptance of Terms' },
  { id: 'definitions', label: '2. Definitions' },
  { id: 'eligibility', label: '3. Eligibility' },
  { id: 'account', label: '4. Account Registration' },
  { id: 'hosts', label: '5. Host Responsibilities' },
  { id: 'renters', label: '6. Renter Responsibilities' },
  { id: 'payments', label: '7. Payments and Fees' },
  { id: 'cancellation', label: '8. Cancellation Policy' },
  { id: 'prohibited', label: '9. Prohibited Conduct' },
  { id: 'intellectual', label: '10. Intellectual Property' },
  { id: 'privacy', label: '11. Privacy' },
  { id: 'disputes', label: '12. Dispute Resolution' },
  { id: 'limitation', label: '13. Limitation of Liability' },
  { id: 'indemnification', label: '14. Indemnification' },
  { id: 'termination', label: '15. Termination' },
  { id: 'changes', label: '16. Changes to Terms' },
  { id: 'contact', label: '17. Contact Information' },
]

function TermsPage() {
  const scrollToSection = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-snow py-12 px-8 border-b border-cloud">
        <div className="max-w-[800px] mx-auto">
          <h1 className="font-display text-[2.5rem] text-midnight mb-2">Terms of Service</h1>
          <p className="text-mist text-[0.9375rem]">Last Updated: December 1, 2024</p>
        </div>
      </section>

      {/* Content with TOC */}
      <div className="flex max-w-[1200px] mx-auto py-12 px-8 gap-12">
        {/* Table of Contents */}
        <aside className="hidden lg:block flex-shrink-0 w-[250px] sticky top-8 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
          <h3 className="text-sm font-semibold text-mist uppercase tracking-wide mb-4">Contents</h3>
          <ul className="space-y-2">
            {TOC_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className="text-slate text-[0.9375rem] hover:text-primary transition-colors block py-1"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-[800px]">
          {/* Section 1: Acceptance of Terms */}
          <section id="acceptance" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-slate mb-4 leading-relaxed">
              Welcome to RoomPilot. By accessing or using our website, mobile application, or
              services (collectively, the "Platform"), you agree to be bound by these Terms of
              Service ("Terms"). If you do not agree to these Terms, you may not use the Platform.
            </p>
            <p className="text-slate leading-relaxed">
              These Terms constitute a legally binding agreement between you and RoomPilot, Inc.
              ("RoomPilot," "we," "us," or "our"). We reserve the right to modify these Terms at any
              time, and your continued use of the Platform after such modifications constitutes
              acceptance of the updated Terms.
            </p>
          </section>

          {/* Section 2: Definitions */}
          <section id="definitions" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">2. Definitions</h2>
            <ul className="text-slate pl-6 list-disc space-y-2">
              <li>
                <strong>"Host":</strong> A user who lists a property or room for rent on the
                Platform.
              </li>
              <li>
                <strong>"Renter":</strong> A user who searches for and rents a room through the
                Platform.
              </li>
              <li>
                <strong>"Listing":</strong> A room or property advertised for rent by a Host on the
                Platform.
              </li>
              <li>
                <strong>"Booking":</strong> A confirmed rental agreement between a Host and Renter.
              </li>
              <li>
                <strong>"Service Fees":</strong> Fees charged by RoomPilot for use of the Platform.
              </li>
            </ul>
          </section>

          {/* Section 3: Eligibility */}
          <section id="eligibility" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">3. Eligibility</h2>
            <p className="text-slate mb-4">To use the Platform, you must:</p>
            <ul className="text-slate mb-4 pl-6 list-disc space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>
                Not be prohibited from using the Platform under the laws of the United States or
                your jurisdiction
              </li>
              <li>Provide accurate, current, and complete information during registration</li>
            </ul>
            <p className="text-slate">
              By using the Platform, you represent and warrant that you meet these eligibility
              requirements.
            </p>
          </section>

          {/* Section 4: Account Registration */}
          <section id="account" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">
              4. Account Registration
            </h2>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">4.1 Account Creation</h3>
            <p className="text-slate mb-4">
              You must create an account to access certain features of the Platform. You agree to
              provide accurate and complete information during registration and to update this
              information as necessary.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">4.2 Account Security</h3>
            <p className="text-slate mb-4">
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You must immediately notify us
              of any unauthorized use of your account.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">
              4.3 Identity Verification
            </h3>
            <p className="text-slate">
              Hosts must complete identity verification, including providing government-issued
              identification and undergoing background screening. We reserve the right to verify the
              identity of any user at any time.
            </p>
          </section>

          {/* Section 5: Host Responsibilities */}
          <section id="hosts" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">
              5. Host Responsibilities
            </h2>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">5.1 Listing Accuracy</h3>
            <p className="text-slate mb-4">
              Hosts must provide accurate, complete, and up-to-date information in their Listings,
              including property descriptions, photos, amenities, house rules, and pricing.
              Misleading or false information is strictly prohibited.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">5.2 Legal Compliance</h3>
            <p className="text-slate mb-4">
              Hosts are responsible for ensuring their Listings comply with all applicable laws,
              regulations, zoning ordinances, and homeowner association rules. This includes
              obtaining necessary permits, licenses, and insurance.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">5.3 Property Standards</h3>
            <p className="text-slate mb-4">
              Hosts must maintain their properties in safe, habitable condition and comply with all
              applicable housing codes and safety regulations, including working smoke detectors,
              carbon monoxide detectors, and emergency exits.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">5.4 Fair Housing</h3>
            <p className="text-slate mb-4">
              Hosts must comply with all applicable fair housing laws and may not discriminate based
              on race, color, religion, sex, national origin, familial status, disability, or any
              other protected characteristic.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">5.5 Communication</h3>
            <p className="text-slate">
              Hosts must respond to inquiries and booking requests in a timely manner and maintain
              professional communication with Renters throughout the rental period.
            </p>
          </section>

          {/* Section 6: Renter Responsibilities */}
          <section id="renters" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">
              6. Renter Responsibilities
            </h2>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">
              6.1 Accurate Information
            </h3>
            <p className="text-slate mb-4">
              Renters must provide accurate information in their profiles and rental applications,
              including employment history, references, and any other information requested by
              Hosts.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">6.2 Property Use</h3>
            <p className="text-slate mb-4">
              Renters must use the property only for residential purposes and in accordance with the
              Listing description and house rules. Subletting or assigning the rental without Host
              permission is prohibited.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">6.3 Property Care</h3>
            <p className="text-slate mb-4">
              Renters must maintain the property in good condition, report maintenance issues
              promptly, and reimburse Hosts for any damages beyond normal wear and tear.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">
              6.4 Payment Obligations
            </h3>
            <p className="text-slate">
              Renters are responsible for timely payment of all rent, fees, and other charges as
              specified in their rental agreement.
            </p>
          </section>

          {/* Section 7: Payments and Fees */}
          <section id="payments" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">
              7. Payments and Fees
            </h2>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">7.1 Payment Processing</h3>
            <p className="text-slate mb-4">
              All payments are processed through Stripe. By using the Platform, you agree to
              Stripe's terms of service. RoomPilot is not responsible for any errors or issues with
              payment processing by third-party providers.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">7.2 Service Fees</h3>
            <p className="text-slate mb-4">
              Hosts pay service fees as outlined in our pricing plans. Fees are subject to change
              with 30 days' notice. Current pricing is available at roompilot.com/pricing.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">7.3 Rent Collection</h3>
            <p className="text-slate mb-4">
              Rent is automatically charged to Renters' payment methods according to the agreed
              schedule (weekly or monthly). Failed payments may result in late fees and potential
              eviction proceedings.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">7.4 Security Deposits</h3>
            <p className="text-slate mb-4">
              Security deposits are held in escrow. Hosts may claim deductions for damages within 14
              days of lease termination, providing photographic evidence. Renters may dispute claims
              through our resolution process.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">7.5 Refunds</h3>
            <p className="text-slate">
              Refunds are handled according to the cancellation policy outlined in Section 8.
              Service fees are generally non-refundable.
            </p>
          </section>

          {/* Section 8: Cancellation Policy */}
          <section id="cancellation" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">
              8. Cancellation Policy
            </h2>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">
              8.1 Pre-Move-In Cancellations
            </h3>
            <p className="text-slate mb-4">
              Renters may cancel bookings before move-in with full refund up to 48 hours before the
              scheduled move-in date. Cancellations within 48 hours forfeit the first week's rent.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">8.2 Lease Termination</h3>
            <p className="text-slate mb-4">
              For month-to-month agreements, either party may terminate with 30 days' written
              notice. Fixed-term leases require adherence to the terms specified in the lease
              agreement.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">8.3 Host Cancellations</h3>
            <p className="text-slate">
              Hosts who cancel confirmed bookings without valid reason may face penalties, including
              suspension from the Platform and liability for Renter relocation costs.
            </p>
          </section>

          {/* Section 9: Prohibited Conduct */}
          <section id="prohibited" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">
              9. Prohibited Conduct
            </h2>
            <p className="text-slate mb-4">Users may not:</p>
            <ul className="text-slate pl-6 list-disc space-y-2">
              <li>Violate any laws, regulations, or third-party rights</li>
              <li>Engage in fraudulent, deceptive, or misleading activities</li>
              <li>Harass, threaten, or intimidate other users</li>
              <li>Post false, inaccurate, or misleading content</li>
              <li>Circumvent or manipulate our fee structure or payment systems</li>
              <li>Use automated tools to access or scrape the Platform</li>
              <li>Transmit viruses, malware, or other harmful code</li>
              <li>Impersonate another person or entity</li>
              <li>Discriminate based on protected characteristics</li>
              <li>Use the Platform for any illegal purpose</li>
            </ul>
          </section>

          {/* Section 10: Intellectual Property */}
          <section id="intellectual" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">
              10. Intellectual Property
            </h2>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">
              10.1 Platform Ownership
            </h3>
            <p className="text-slate mb-4">
              The Platform, including all software, text, graphics, logos, and other content, is
              owned by RoomPilot and protected by copyright, trademark, and other intellectual
              property laws.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">10.2 User Content</h3>
            <p className="text-slate mb-4">
              You retain ownership of content you post to the Platform but grant RoomPilot a
              worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display
              such content for the purpose of operating and promoting the Platform.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">10.3 Trademarks</h3>
            <p className="text-slate">
              RoomPilot, the RoomPilot logo, and other marks are trademarks of RoomPilot, Inc. You
              may not use these marks without our prior written permission.
            </p>
          </section>

          {/* Section 11: Privacy */}
          <section id="privacy" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">11. Privacy</h2>
            <p className="text-slate">
              Your use of the Platform is subject to our Privacy Policy, which is incorporated into
              these Terms by reference. Please review our Privacy Policy to understand how we
              collect, use, and protect your personal information.
            </p>
          </section>

          {/* Section 12: Dispute Resolution */}
          <section id="disputes" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">
              12. Dispute Resolution
            </h2>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">12.1 Between Users</h3>
            <p className="text-slate mb-4">
              RoomPilot provides a resolution center to help users resolve disputes. While we may
              offer mediation services, we are not responsible for resolving disputes between users.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">12.2 With RoomPilot</h3>
            <p className="text-slate mb-4">
              Any disputes between you and RoomPilot shall be resolved through binding arbitration
              in accordance with the American Arbitration Association's rules, except where
              prohibited by law.
            </p>

            <h3 className="font-display text-xl text-midnight mt-6 mb-3">
              12.3 Class Action Waiver
            </h3>
            <p className="text-slate">
              You agree to resolve disputes with RoomPilot on an individual basis and waive any
              right to participate in class action lawsuits or class-wide arbitration.
            </p>
          </section>

          {/* Section 13: Limitation of Liability */}
          <section id="limitation" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">
              13. Limitation of Liability
            </h2>
            <p className="text-slate mb-4 uppercase text-sm">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ROOMPILOT SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA,
              USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            <p className="text-slate uppercase text-sm">
              IN NO EVENT SHALL ROOMPILOT'S TOTAL LIABILITY EXCEED THE AMOUNT OF FEES PAID BY YOU TO
              ROOMPILOT IN THE TWELVE MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.
            </p>
          </section>

          {/* Section 14: Indemnification */}
          <section id="indemnification" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">
              14. Indemnification
            </h2>
            <p className="text-slate mb-4">
              You agree to indemnify, defend, and hold harmless RoomPilot and its officers,
              directors, employees, and agents from any claims, liabilities, damages, losses, and
              expenses arising from:
            </p>
            <ul className="text-slate pl-6 list-disc space-y-2">
              <li>Your use of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another person or entity</li>
              <li>Your Listings or rental activities</li>
            </ul>
          </section>

          {/* Section 15: Termination */}
          <section id="termination" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">15. Termination</h2>
            <p className="text-slate">
              We may suspend or terminate your account at any time for any reason, including
              violation of these Terms. Upon termination, you must cease all use of the Platform.
              Sections that by their nature should survive termination shall survive, including
              intellectual property provisions, disclaimers, and limitations of liability.
            </p>
          </section>

          {/* Section 16: Changes to Terms */}
          <section id="changes" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">
              16. Changes to Terms
            </h2>
            <p className="text-slate">
              We reserve the right to modify these Terms at any time. We will notify users of
              material changes via email or Platform notification. Your continued use of the
              Platform after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Section 17: Contact Information */}
          <section id="contact" className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pt-4">
              17. Contact Information
            </h2>
            <p className="text-slate mb-4">
              For questions about these Terms, please contact us at:
            </p>
            <div className="text-slate">
              <p className="mb-1">
                <strong>RoomPilot, Inc.</strong>
              </p>
              <p className="mb-1">Email: legal@roompilot.com</p>
              <p>Address: 123 Main Street, San Francisco, CA 94105</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default TermsPage
