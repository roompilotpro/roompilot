function PrivacyPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-snow to-white py-20 px-10 pb-[60px] text-center md:px-5 md:py-[60px]">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-midnight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-mist">Last updated: January 2025</p>
      </section>

      <section className="py-[60px] px-10 pb-[100px] md:px-5 md:py-[60px]">
        <div className="max-w-[800px] mx-auto">
          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">
              1. Information We Collect
            </h2>
            <p className="text-base text-slate leading-[1.7] mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="my-4 pl-6 list-disc [&_li]:text-base [&_li]:text-slate [&_li]:leading-[1.7] [&_li]:mb-2">
              <li>Account information (name, email, phone number)</li>
              <li>Profile information (photo, bio, verification documents)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Communications between users</li>
              <li>Property listing information</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">
              2. How We Use Your Information
            </h2>
            <p className="text-base text-slate leading-[1.7] mb-4">
              We use the information we collect to:
            </p>
            <ul className="my-4 pl-6 list-disc [&_li]:text-base [&_li]:text-slate [&_li]:leading-[1.7] [&_li]:mb-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Prevent fraudulent transactions and monitor against theft</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">
              3. Information Sharing
            </h2>
            <p className="text-base text-slate leading-[1.7] mb-4">
              We may share your information with:
            </p>
            <ul className="my-4 pl-6 list-disc [&_li]:text-base [&_li]:text-slate [&_li]:leading-[1.7] [&_li]:mb-2">
              <li>
                Other users as needed to facilitate rentals (e.g., hosts see renter applications)
              </li>
              <li>Service providers who assist in our operations (payment processing, hosting)</li>
              <li>Law enforcement when required by law</li>
              <li>Background check providers, with your consent</li>
            </ul>
            <p className="text-base text-slate leading-[1.7] mb-4">
              We do not sell your personal information to third parties.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">
              4. Data Security
            </h2>
            <p className="text-base text-slate leading-[1.7] mb-4">
              We implement industry-standard security measures to protect your data, including
              encryption in transit (SSL/TLS) and at rest. Payment information is processed through
              Stripe, which is PCI DSS Level 1 certified.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">
              5. Your Rights
            </h2>
            <p className="text-base text-slate leading-[1.7] mb-4">You have the right to:</p>
            <ul className="my-4 pl-6 list-disc [&_li]:text-base [&_li]:text-slate [&_li]:leading-[1.7] [&_li]:mb-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">
              6. Cookies
            </h2>
            <p className="text-base text-slate leading-[1.7] mb-4">
              We use cookies and similar technologies to provide functionality, analyze usage, and
              personalize your experience. You can control cookies through your browser settings.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">
              7. Contact Us
            </h2>
            <p className="text-base text-slate leading-[1.7] mb-4">
              For privacy-related inquiries, please contact us at{' '}
              <a
                href="mailto:privacy@roompilot.com"
                className="text-primary no-underline hover:underline"
              >
                privacy@roompilot.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPage
