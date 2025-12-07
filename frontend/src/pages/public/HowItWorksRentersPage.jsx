import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'
import { classNames } from '../../utils'

const FAQ_ITEMS = [
  {
    q: 'Do I need good credit to rent?',
    a: "No! We don't require credit checks. Hosts may request optional background checks, but your credit score doesn't factor into applications. We believe housing should be accessible to everyone.",
  },
  {
    q: 'How much do I need to move in?',
    a: "Typically just your first week's rent. Some hosts may require a small security deposit (usually $100-$300), but it's nowhere near the first month + last month + security deposit that traditional apartments require.",
  },
  {
    q: 'Can I pay rent weekly?',
    a: 'Yes! Most listings offer weekly payment options. This is perfect if you get paid weekly or bi-weekly and prefer to budget rent in smaller increments instead of one large monthly payment.',
  },
  {
    q: 'What if I need to move out early?',
    a: "Most rooms are month-to-month with 30 days notice required. No lease-breaking penalties, no paying multiple months of rent to get out. Just give notice and go when you're ready.",
  },
  {
    q: 'Are utilities included?',
    a: "It varies by listing. Many hosts include utilities (water, electric, WiFi) in the rent price, while others charge separately. Each listing clearly shows what's included and what's not.",
  },
  {
    q: 'How do I know hosts are legitimate?',
    a: 'All hosts must verify their identity and pass background checks. We also verify property ownership before listings go live. Read reviews from past tenants and communicate through our secure messaging system.',
  },
]

const COMPARISON_DATA = [
  {
    feature: 'Upfront Deposit',
    roompilot: 'First week only',
    traditional: '1st + Last + Security (3x rent)',
  },
  { feature: 'Credit Check Required', roompilot: 'No', traditional: 'Yes, hard inquiry' },
  { feature: 'Lease Length', roompilot: 'Month-to-month', traditional: '12 months minimum' },
  { feature: 'Payment Frequency', roompilot: 'Weekly or monthly', traditional: 'Monthly only' },
  { feature: 'Move-In Time', roompilot: '2-3 days', traditional: '2-4 weeks' },
  { feature: 'Application Fee', roompilot: 'Free', traditional: '$50-$100' },
  {
    feature: 'Breaking Lease Penalty',
    roompilot: 'None (month-to-month)',
    traditional: '2-3 months rent',
  },
]

function HowItWorksRentersPage() {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-bg to-white py-20 px-10 text-center md:py-15 md:px-5">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-midnight mb-4">
          Find Your Room in 3 Simple Steps
        </h1>
        <p className="text-lg text-slate mb-8 max-w-[600px] mx-auto">
          No massive deposits. No long-term leases. Just flexible, affordable housing that works for
          your life.
        </p>
        <a href="#steps" className="no-underline">
          <Button variant="primary" size="lg">
            See How It Works
          </Button>
        </a>
      </section>

      {/* Steps Section */}
      <section id="steps" className="py-20 px-10 bg-white md:py-15 md:px-5">
        <div className="max-w-[1000px] mx-auto text-center mb-12">
          <h2 className="font-display text-[2rem] text-midnight mb-4">
            Your Journey to a New Room
          </h2>
          <p className="text-lg text-slate">
            From search to move-in, we've made finding affordable housing simple and stress-free.
          </p>
        </div>
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="text-center">
            <div className="text-5xl mb-4">🔍</div>
            <div className="inline-block bg-primary text-white text-sm font-bold py-1 px-3 rounded-full mb-4">
              1
            </div>
            <h3 className="font-display text-xl text-midnight mb-3">Search & Browse</h3>
            <p className="text-slate leading-relaxed">
              Find rooms by location, price range, and amenities. Filter for shared bathrooms,
              private rooms, utilities included, and more. Browse photos, read house rules, and see
              exactly what you're getting.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">📋</div>
            <div className="inline-block bg-primary text-white text-sm font-bold py-1 px-3 rounded-full mb-4">
              2
            </div>
            <h3 className="font-display text-xl text-midnight mb-3">Apply Instantly</h3>
            <p className="text-slate leading-relaxed">
              Submit your profile with just a few clicks. Share employment info, references, and
              optionally run a background check to boost your application. Hosts review and approve
              within 24-48 hours.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🏠</div>
            <div className="inline-block bg-primary text-white text-sm font-bold py-1 px-3 rounded-full mb-4">
              3
            </div>
            <h3 className="font-display text-xl text-midnight mb-3">Move In & Pay Weekly</h3>
            <p className="text-slate leading-relaxed">
              Low upfront costs mean you can move in fast. Pay rent weekly through our secure
              platform. No massive deposits, no credit checks, no annual lease commitments required.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-10 bg-snow md:py-15 md:px-5">
        <div className="max-w-[1000px] mx-auto text-center mb-12">
          <h2 className="font-display text-[2rem] text-midnight mb-4">
            Why Renters Love RoomPilot
          </h2>
          <p className="text-lg text-slate">Affordable, flexible housing designed for real life.</p>
        </div>
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-display text-lg text-midnight mb-2">No Membership Fees</h4>
            <p className="text-sm text-slate leading-relaxed">
              Unlike competitors, we never charge renters monthly membership fees. Find and rent
              rooms completely free.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-display text-lg text-midnight mb-2">Weekly Payments</h4>
            <p className="text-sm text-slate leading-relaxed">
              Break up rent into manageable weekly chunks. Perfect for hourly workers, gig economy,
              or anyone living paycheck to paycheck.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-display text-lg text-midnight mb-2">Transparent Pricing</h4>
            <p className="text-sm text-slate leading-relaxed">
              What you see is what you pay. No hidden fees, no surprise charges. Rent, utilities,
              and fees are clearly listed upfront.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-display text-lg text-midnight mb-2">Flexible Terms</h4>
            <p className="text-sm text-slate leading-relaxed">
              Month-to-month agreements mean you're never locked into a long-term lease. Stay as
              long as you need, leave when you're ready.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-display text-lg text-midnight mb-2">Verified Hosts</h4>
            <p className="text-sm text-slate leading-relaxed">
              All hosts undergo ID verification and background screening. Communicate safely through
              our in-app messaging system.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-display text-lg text-midnight mb-2">Quick Move-In</h4>
            <p className="text-sm text-slate leading-relaxed">
              Low upfront costs and fast approvals mean you can move in within days, not weeks.
              Perfect for urgent housing needs.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 px-10 bg-white md:py-15 md:px-5">
        <div className="max-w-[800px] mx-auto text-center mb-12">
          <h2 className="font-display text-[2rem] text-midnight mb-4">
            RoomPilot vs Traditional Renting
          </h2>
          <p className="text-lg text-slate">
            See how we stack up against conventional apartment leasing.
          </p>
        </div>
        <div className="max-w-[800px] mx-auto overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-4 px-6 font-semibold">Feature</th>
                <th className="text-left py-4 px-6 font-semibold">RoomPilot</th>
                <th className="text-left py-4 px-6 font-semibold">Traditional Apartment</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row, index) => (
                <tr key={index} className="border-b border-cloud">
                  <td className="py-4 px-6 text-midnight font-medium">{row.feature}</td>
                  <td className="py-4 px-6 text-primary font-semibold">{row.roompilot}</td>
                  <td className="py-4 px-6 text-slate">{row.traditional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-10 bg-snow md:py-15 md:px-5">
        <div className="max-w-[800px] mx-auto text-center mb-12">
          <h2 className="font-display text-[2rem] text-midnight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate">
            Everything you need to know about renting with RoomPilot.
          </p>
        </div>
        <div className="max-w-[800px] mx-auto">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-cloud rounded-sm mb-4 overflow-hidden"
            >
              <button
                className="w-full p-5 bg-transparent border-none text-left font-body text-lg font-semibold text-midnight cursor-pointer flex justify-between items-center hover:bg-snow"
                onClick={() => toggleFaq(index)}
              >
                {item.q}
                <span
                  className={classNames(
                    'transition-transform duration-300 shrink-0 ml-4',
                    openFaq === index && 'rotate-180'
                  )}
                >
                  &#9660;
                </span>
              </button>
              <div
                className="overflow-hidden transition-[max-height] duration-300"
                style={{ maxHeight: openFaq === index ? '500px' : '0' }}
              >
                <div className="px-5 pb-5 text-slate leading-relaxed">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-10 bg-gradient-to-br from-primary to-[#1d4ed8] text-center text-white md:py-15 md:px-5">
        <h2 className="font-display text-[2rem] mb-4">Ready to Find Your Room?</h2>
        <p className="text-lg mb-8 opacity-90">
          Join thousands of renters who've found affordable, flexible housing with RoomPilot.
        </p>
        <Link to={ROUTES.SEARCH} className="no-underline">
          <Button variant="white" size="lg">
            Browse Rooms Now
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default HowItWorksRentersPage
