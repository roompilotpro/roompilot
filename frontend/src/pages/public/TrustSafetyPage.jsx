import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'

function TrustSafetyPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-bg to-white py-20 px-10 pb-[60px] text-center md:px-5 md:py-[60px]">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-midnight mb-2">
          Trust & Safety
        </h1>
        <p className="text-xl text-slate max-w-[600px] mx-auto">
          Your safety is our top priority. Learn how we protect our community.
        </p>
      </section>

      <section className="py-[60px] px-10 pb-[100px] md:px-5 md:py-[60px]">
        <div className="max-w-[800px] mx-auto">
          <div className="grid grid-cols-2 gap-6 mb-[60px] md:grid-cols-1">
            <div className="bg-snow rounded-lg p-8 text-center transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-1">
              <span className="text-5xl block mb-4">&#128100;</span>
              <h3 className="font-display text-xl text-midnight mb-3">Verified Users</h3>
              <p className="text-sm text-slate leading-relaxed">
                All hosts must verify their identity with government-issued ID and pass Stripe KYC
                verification before listing.
              </p>
            </div>
            <div className="bg-snow rounded-lg p-8 text-center transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-1">
              <span className="text-5xl block mb-4">&#128274;</span>
              <h3 className="font-display text-xl text-midnight mb-3">Secure Payments</h3>
              <p className="text-sm text-slate leading-relaxed">
                All payments are processed through Stripe with bank-level 256-bit SSL encryption.
                Never send money outside the platform.
              </p>
            </div>
            <div className="bg-snow rounded-lg p-8 text-center transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-1">
              <span className="text-5xl block mb-4">&#128269;</span>
              <h3 className="font-display text-xl text-midnight mb-3">Background Checks</h3>
              <p className="text-sm text-slate leading-relaxed">
                Optional background checks available for hosts who want additional screening. You
                control who sees your report.
              </p>
            </div>
            <div className="bg-snow rounded-lg p-8 text-center transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-1">
              <span className="text-5xl block mb-4">&#128172;</span>
              <h3 className="font-display text-xl text-midnight mb-3">Secure Messaging</h3>
              <p className="text-sm text-slate leading-relaxed">
                All communication happens through our platform, creating a record and keeping your
                personal contact info private.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">
              How We Protect You
            </h2>
            <h3 className="text-lg text-charcoal my-6 mb-3">For Hosts</h3>
            <ul className="my-4 pl-6 list-disc [&_li]:text-base [&_li]:text-slate [&_li]:leading-[1.7] [&_li]:mb-2">
              <li>Screen tenants with optional background checks</li>
              <li>Automated payment collection reduces missed payments</li>
              <li>Built-in lease templates and legal resources</li>
              <li>24/7 support for disputes and emergencies</li>
            </ul>
            <h3 className="text-lg text-charcoal my-6 mb-3">For Renters</h3>
            <ul className="my-4 pl-6 list-disc [&_li]:text-base [&_li]:text-slate [&_li]:leading-[1.7] [&_li]:mb-2">
              <li>All hosts are verified with ID and property ownership</li>
              <li>Secure deposits held in escrow</li>
              <li>Review system to share experiences</li>
              <li>Resolution center for disputes</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">
              Reporting Issues
            </h2>
            <p className="text-base text-slate leading-[1.7] mb-4">
              If you encounter suspicious activity, scams, or safety concerns, report them
              immediately using the "Report" button in any conversation or listing. Our team
              investigates all reports within 24 hours.
            </p>
            <h3 className="text-lg text-charcoal my-6 mb-3">Red Flags to Watch For</h3>
            <ul className="my-4 pl-6 list-disc [&_li]:text-base [&_li]:text-slate [&_li]:leading-[1.7] [&_li]:mb-2">
              <li>Requests to pay outside the platform</li>
              <li>Pressure to make quick decisions</li>
              <li>Listings that seem too good to be true</li>
              <li>Requests for sensitive personal information</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">
              Emergency Contacts
            </h2>
            <p className="text-base text-slate leading-[1.7] mb-4">
              For immediate safety concerns, contact local emergency services (911). For
              non-emergency safety issues, contact our Trust & Safety team at{' '}
              <a
                href="mailto:safety@roompilot.com"
                className="text-primary no-underline hover:underline"
              >
                safety@roompilot.com
              </a>
              .
            </p>
          </div>

          <div className="text-center py-[60px] mt-10 border-t border-cloud">
            <h2 className="font-display text-[2rem] text-midnight mb-3">Questions?</h2>
            <p className="text-slate mb-6">
              Our support team is available 24/7 to help with any safety concerns.
            </p>
            <Link to={ROUTES.CONTACT} className="no-underline">
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
