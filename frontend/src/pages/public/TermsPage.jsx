function TermsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-snow to-white py-20 px-10 pb-[60px] text-center md:px-5 md:py-[60px]">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-midnight mb-2">Terms of Service</h1>
        <p className="text-sm text-mist">Last updated: January 2025</p>
      </section>

      <section className="py-[60px] px-10 pb-[100px] md:px-5 md:py-[60px]">
        <div className="max-w-[800px] mx-auto">
          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">1. Acceptance of Terms</h2>
            <p className="text-base text-slate leading-[1.7] mb-4">
              By accessing or using RoomPilot's services, you agree to be bound by these Terms of
              Service and all applicable laws and regulations. If you do not agree with any of these
              terms, you are prohibited from using or accessing this site.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">2. Use of Service</h2>
            <p className="text-base text-slate leading-[1.7] mb-4">
              RoomPilot provides a platform that connects property owners ("Hosts") with individuals
              seeking room rentals ("Renters"). We facilitate the listing, discovery, and payment
              processing for room rentals but are not a party to any rental agreement between Hosts
              and Renters.
            </p>
            <h3 className="text-lg text-charcoal my-6 mb-3">2.1 Account Registration</h3>
            <p className="text-base text-slate leading-[1.7] mb-4">
              You must register for an account to use certain features of our service. You agree to
              provide accurate, current, and complete information during registration and to update
              such information to keep it accurate.
            </p>
            <h3 className="text-lg text-charcoal my-6 mb-3">2.2 Account Security</h3>
            <p className="text-base text-slate leading-[1.7] mb-4">
              You are responsible for safeguarding your account credentials and for any activities
              or actions under your account. Notify us immediately of any unauthorized use.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">3. Host Responsibilities</h2>
            <p className="text-base text-slate leading-[1.7] mb-4">As a Host, you agree to:</p>
            <ul className="my-4 pl-6 list-disc [&_li]:text-base [&_li]:text-slate [&_li]:leading-[1.7] [&_li]:mb-2">
              <li>Provide accurate and complete information about your listings</li>
              <li>Comply with all applicable laws, including Fair Housing laws</li>
              <li>Maintain safe and habitable living conditions</li>
              <li>Respond to renter inquiries and maintenance requests in a timely manner</li>
              <li>Not discriminate against renters based on protected characteristics</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">4. Renter Responsibilities</h2>
            <p className="text-base text-slate leading-[1.7] mb-4">As a Renter, you agree to:</p>
            <ul className="my-4 pl-6 list-disc [&_li]:text-base [&_li]:text-slate [&_li]:leading-[1.7] [&_li]:mb-2">
              <li>Provide accurate information in your application</li>
              <li>Pay rent on time according to your lease agreement</li>
              <li>Respect house rules and common areas</li>
              <li>Report maintenance issues promptly</li>
              <li>Not engage in illegal activities on the premises</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">5. Payments and Fees</h2>
            <p className="text-base text-slate leading-[1.7] mb-4">
              RoomPilot facilitates payment processing through Stripe. All payment terms, including
              rent amounts, payment schedules, and late fees are established between Hosts and
              Renters. RoomPilot charges service fees as outlined on our Pricing page.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">6. Limitation of Liability</h2>
            <p className="text-base text-slate leading-[1.7] mb-4">
              RoomPilot is not responsible for the conduct of any user, the condition of any
              property, or disputes between Hosts and Renters. We provide the platform "as is"
              without warranties of any kind.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-[1.75rem] text-midnight mb-4 pb-3 border-b-2 border-cloud">7. Contact Us</h2>
            <p className="text-base text-slate leading-[1.7] mb-4">
              If you have questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@roompilot.com" className="text-primary no-underline hover:underline">legal@roompilot.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsPage
