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
    <div className="bg-white leading-[1.6]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-bg to-white py-20 px-8 text-center">
        <div className="max-w-[800px] mx-auto">
          <h1 className="font-display font-bold text-[3rem] text-midnight mb-6 leading-[1.2]">
            Find Your Room in 3 Simple Steps
          </h1>
          <p className="text-[1.25rem] text-slate mb-8">
            No massive deposits. No long-term leases. Just flexible, affordable housing that works
            for your life.
          </p>
          <a href="#steps" className="no-underline">
            <Button variant="primary" size="lg">
              See How It Works
            </Button>
          </a>
        </div>
      </section>

      {/* Steps Section */}
      <section id="steps" className="py-20 px-8 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-[2.5rem] text-midnight mb-4">
              Your Journey to a New Room
            </h2>
            <p className="text-[1.125rem] text-slate max-w-[600px] mx-auto">
              From search to move-in, we've made finding affordable housing simple and stress-free.
            </p>
          </div>
          <div
            className="grid gap-12 mb-12"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-bg rounded-full flex items-center justify-center mx-auto mb-6 text-[2rem]">
                🔍
              </div>
              <div className="inline-block w-8 h-8 bg-primary text-white text-sm font-bold rounded-full leading-8 mb-4">
                1
              </div>
              <h3 className="font-display font-bold text-[1.5rem] text-midnight mb-4">
                Search & Browse
              </h3>
              <p className="text-slate leading-[1.7]">
                Find rooms by location, price range, and amenities. Filter for shared bathrooms,
                private rooms, utilities included, and more. Browse photos, read house rules, and
                see exactly what you're getting.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-bg rounded-full flex items-center justify-center mx-auto mb-6 text-[2rem]">
                📋
              </div>
              <div className="inline-block w-8 h-8 bg-primary text-white text-sm font-bold rounded-full leading-8 mb-4">
                2
              </div>
              <h3 className="font-display font-bold text-[1.5rem] text-midnight mb-4">
                Apply Instantly
              </h3>
              <p className="text-slate leading-[1.7]">
                Submit your profile with just a few clicks. Share employment info, references, and
                optionally run a background check to boost your application. Hosts review and
                approve within 24-48 hours.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-bg rounded-full flex items-center justify-center mx-auto mb-6 text-[2rem]">
                🏠
              </div>
              <div className="inline-block w-8 h-8 bg-primary text-white text-sm font-bold rounded-full leading-8 mb-4">
                3
              </div>
              <h3 className="font-display font-bold text-[1.5rem] text-midnight mb-4">
                Move In & Pay Weekly
              </h3>
              <p className="text-slate leading-[1.7]">
                Low upfront costs mean you can move in fast. Pay rent weekly through our secure
                platform. No massive deposits, no credit checks, no annual lease commitments
                required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-8 bg-snow">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-[2.5rem] text-midnight mb-4">
              Why Renters Love RoomPilot
            </h2>
            <p className="text-[1.125rem] text-slate">
              Affordable, flexible housing designed for real life.
            </p>
          </div>
          <div
            className="grid gap-8"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}
          >
            <div className="bg-white rounded-2xl p-8 border border-cloud">
              <h4 className="font-display font-bold text-[1.25rem] text-midnight mb-3">
                No Membership Fees
              </h4>
              <p className="text-slate">
                Unlike competitors, we never charge renters monthly membership fees. Find and rent
                rooms completely free.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-cloud">
              <h4 className="font-display font-bold text-[1.25rem] text-midnight mb-3">
                Weekly Payments
              </h4>
              <p className="text-slate">
                Break up rent into manageable weekly chunks. Perfect for hourly workers, gig
                economy, or anyone living paycheck to paycheck.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-cloud">
              <h4 className="font-display font-bold text-[1.25rem] text-midnight mb-3">
                Transparent Pricing
              </h4>
              <p className="text-slate">
                What you see is what you pay. No hidden fees, no surprise charges. Rent, utilities,
                and fees are clearly listed upfront.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-cloud">
              <h4 className="font-display font-bold text-[1.25rem] text-midnight mb-3">
                Flexible Terms
              </h4>
              <p className="text-slate">
                Month-to-month agreements mean you're never locked into a long-term lease. Stay as
                long as you need, leave when you're ready.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-cloud">
              <h4 className="font-display font-bold text-[1.25rem] text-midnight mb-3">
                Verified Hosts
              </h4>
              <p className="text-slate">
                All hosts undergo ID verification and background screening. Communicate safely
                through our in-app messaging system.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-cloud">
              <h4 className="font-display font-bold text-[1.25rem] text-midnight mb-3">
                Quick Move-In
              </h4>
              <p className="text-slate">
                Low upfront costs and fast approvals mean you can move in within days, not weeks.
                Perfect for urgent housing needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-[2.5rem] text-midnight mb-4">
              RoomPilot vs Traditional Renting
            </h2>
            <p className="text-[1.125rem] text-slate">
              See how we stack up against conventional apartment leasing.
            </p>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden border border-cloud">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left p-5">Feature</th>
                  <th className="text-left p-5">RoomPilot</th>
                  <th className="text-left p-5">Traditional Apartment</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'bg-snow' : ''}>
                    <td className="p-5 text-left text-midnight">{row.feature}</td>
                    <td className="p-5 text-left text-accent font-bold">{row.roompilot}</td>
                    <td className="p-5 text-left text-mist">{row.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-8 bg-snow">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-[2.5rem] text-midnight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[1.125rem] text-slate">
              Everything you need to know about renting with RoomPilot.
            </p>
          </div>
          <div className="max-w-[800px] mx-auto">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-cloud rounded-lg mb-4 overflow-hidden"
              >
                <button
                  className="w-full p-5 bg-transparent border-none text-left font-body text-[1.125rem] font-semibold text-midnight cursor-pointer flex justify-between items-center hover:bg-snow"
                  onClick={() => toggleFaq(index)}
                >
                  {item.q}
                  <span
                    className={classNames(
                      'transition-transform duration-300 shrink-0 ml-4',
                      openFaq === index && 'rotate-180'
                    )}
                  >
                    ▼
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-[max-height] duration-300"
                  style={{ maxHeight: openFaq === index ? '500px' : '0' }}
                >
                  <div className="px-5 pb-5 text-slate">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-gradient-to-br from-primary to-[#1d4ed8] text-center text-white">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-display font-bold text-[2.5rem] mb-4">Ready to Find Your Room?</h2>
          <p className="text-[1.25rem] mb-8 opacity-90">
            Join thousands of renters who've found affordable, flexible housing with RoomPilot.
          </p>
          <Link to={ROUTES.SEARCH} className="no-underline">
            <Button variant="white" size="lg">
              Browse Rooms Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HowItWorksRentersPage
