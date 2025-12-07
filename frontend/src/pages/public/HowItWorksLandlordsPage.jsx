import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'

const PRICING_DATA = [
  {
    platform: 'RoomPilot (Transaction Plan)',
    monthlyFee: '$0',
    transactionFee: '2%',
    cost: '$60/month',
    highlight: true,
  },
  {
    platform: 'RoomPilot (Flat Rate Plan)',
    monthlyFee: '$15/room',
    transactionFee: '0%',
    cost: '$75/month',
    highlight: true,
  },
  {
    platform: 'PadSplit',
    monthlyFee: '$99 + $10/room',
    transactionFee: '3%',
    cost: '$239/month',
    highlight: false,
  },
  {
    platform: 'Bungalow',
    monthlyFee: '12% of rent',
    transactionFee: 'Included',
    cost: '$360/month',
    highlight: false,
  },
  {
    platform: 'Traditional Property Manager',
    monthlyFee: '8-10% of rent',
    transactionFee: 'Varies',
    cost: '$240-300/month',
    highlight: false,
  },
]

function HowItWorksLandlordsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-bg to-white py-20 px-10 text-center md:py-15 md:px-5">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-midnight mb-4">
          Start Earning More From Your Rooms
        </h1>
        <p className="text-lg text-slate mb-8 max-w-[600px] mx-auto">
          Weekly rent collection, automated billing, and better cashflow. List your property and
          start earning in days, not weeks.
        </p>
        <a href="#steps" className="no-underline">
          <Button variant="primary" size="lg">
            See How It Works
          </Button>
        </a>
        <div className="flex justify-center gap-12 mt-10 md:flex-col md:gap-6">
          <div className="text-center">
            <div className="font-display text-4xl text-accent font-bold">15%</div>
            <div className="text-sm text-slate">Higher occupancy rates</div>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl text-accent font-bold">2x</div>
            <div className="text-sm text-slate">Faster tenant placement</div>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl text-accent font-bold">98%</div>
            <div className="text-sm text-slate">On-time payments</div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="steps" className="py-20 px-10 bg-white md:py-15 md:px-5">
        <div className="max-w-[1000px] mx-auto text-center mb-12">
          <h2 className="font-display text-[2rem] text-midnight mb-4">Your Journey as a Host</h2>
          <p className="text-lg text-slate">
            From listing to getting paid, we automate the entire rental process.
          </p>
        </div>
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          <div className="text-center">
            <div className="text-5xl mb-4">🏡</div>
            <div className="inline-block bg-primary text-white text-sm font-bold py-1 px-3 rounded-full mb-4">
              1
            </div>
            <h3 className="font-display text-xl text-midnight mb-3">List Your Property</h3>
            <p className="text-slate leading-relaxed">
              Upload photos, set your prices, and define house rules. List individual rooms or
              entire properties. Set weekly or monthly rates, include utilities, and control every
              detail of your listing.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <div className="inline-block bg-primary text-white text-sm font-bold py-1 px-3 rounded-full mb-4">
              2
            </div>
            <h3 className="font-display text-xl text-midnight mb-3">Review Applications</h3>
            <p className="text-slate leading-relaxed">
              View renter profiles, employment history, and references. Request background checks if
              desired. You have complete control over who lives in your property - approve or
              decline with one click.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🔄</div>
            <div className="inline-block bg-primary text-white text-sm font-bold py-1 px-3 rounded-full mb-4">
              3
            </div>
            <h3 className="font-display text-xl text-midnight mb-3">Automate Billing</h3>
            <p className="text-slate leading-relaxed">
              Set it and forget it. Weekly or monthly rent is automatically charged to tenants'
              payment methods. Late fees applied automatically, reminders sent, zero manual
              invoicing required.
            </p>
          </div>
        </div>
        <div className="max-w-[350px] mx-auto text-center">
          <div className="text-5xl mb-4">💰</div>
          <div className="inline-block bg-primary text-white text-sm font-bold py-1 px-3 rounded-full mb-4">
            4
          </div>
          <h3 className="font-display text-xl text-midnight mb-3">Get Paid Fast</h3>
          <p className="text-slate leading-relaxed">
            Receive payouts daily or weekly via Stripe Connect. Funds deposited directly to your
            bank account. Track earnings in real-time, download reports, and manage multiple
            properties from one dashboard.
          </p>
        </div>
      </section>

      {/* Dashboard Features Section */}
      <section className="py-20 px-10 bg-snow md:py-15 md:px-5">
        <div className="max-w-[1000px] mx-auto text-center mb-12">
          <h2 className="font-display text-[2rem] text-midnight mb-4">
            Powerful Dashboard, Simple Interface
          </h2>
          <p className="text-lg text-slate">
            Everything you need to manage your rental business in one place.
          </p>
        </div>
        <div className="max-w-[1000px] mx-auto">
          <h3 className="font-display text-xl text-midnight mb-6">Host Dashboard Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 bg-white p-4 rounded-lg">
              <div className="text-2xl">📊</div>
              <div>
                <h4 className="font-display text-lg text-midnight mb-1">Revenue Analytics</h4>
                <p className="text-sm text-slate">
                  Track income, occupancy rates, and performance metrics across all properties.
                </p>
              </div>
            </div>
            <div className="flex gap-4 bg-white p-4 rounded-lg">
              <div className="text-2xl">👥</div>
              <div>
                <h4 className="font-display text-lg text-midnight mb-1">Tenant Management</h4>
                <p className="text-sm text-slate">
                  View all current and past tenants, payment history, and lease details in one
                  place.
                </p>
              </div>
            </div>
            <div className="flex gap-4 bg-white p-4 rounded-lg">
              <div className="text-2xl">💬</div>
              <div>
                <h4 className="font-display text-lg text-midnight mb-1">Secure Messaging</h4>
                <p className="text-sm text-slate">
                  Communicate with applicants and tenants through our built-in messaging system.
                </p>
              </div>
            </div>
            <div className="flex gap-4 bg-white p-4 rounded-lg">
              <div className="text-2xl">🔔</div>
              <div>
                <h4 className="font-display text-lg text-midnight mb-1">Smart Notifications</h4>
                <p className="text-sm text-slate">
                  Get alerts for new applications, late payments, lease expirations, and maintenance
                  requests.
                </p>
              </div>
            </div>
            <div className="flex gap-4 bg-white p-4 rounded-lg">
              <div className="text-2xl">📝</div>
              <div>
                <h4 className="font-display text-lg text-midnight mb-1">Digital Leases</h4>
                <p className="text-sm text-slate">
                  Generate, send, and sign leases electronically. All documents stored securely in
                  the cloud.
                </p>
              </div>
            </div>
            <div className="flex gap-4 bg-white p-4 rounded-lg">
              <div className="text-2xl">📄</div>
              <div>
                <h4 className="font-display text-lg text-midnight mb-1">Financial Reports</h4>
                <p className="text-sm text-slate">
                  Export transaction history, tax documents, and profit/loss statements for
                  accounting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section className="py-20 px-10 bg-white md:py-15 md:px-5">
        <div className="max-w-[900px] mx-auto text-center mb-12">
          <h2 className="font-display text-[2rem] text-midnight mb-4">
            Transparent, Competitive Pricing
          </h2>
          <p className="text-lg text-slate">
            Compare our fees to the competition - we're significantly cheaper.
          </p>
        </div>
        <div className="max-w-[900px] mx-auto overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-4 px-6 font-semibold">Platform</th>
                <th className="text-left py-4 px-6 font-semibold">Monthly Fee</th>
                <th className="text-left py-4 px-6 font-semibold">Transaction Fee</th>
                <th className="text-left py-4 px-6 font-semibold">Cost for 5 Rooms at $600/mo</th>
              </tr>
            </thead>
            <tbody>
              {PRICING_DATA.map((row, index) => (
                <tr key={index} className="border-b border-cloud">
                  <td
                    className={`py-4 px-6 ${row.highlight ? 'font-semibold text-midnight' : 'text-slate'}`}
                  >
                    {row.platform}
                  </td>
                  <td className="py-4 px-6 text-slate">{row.monthlyFee}</td>
                  <td className="py-4 px-6 text-slate">{row.transactionFee}</td>
                  <td
                    className={`py-4 px-6 ${row.highlight ? 'font-semibold text-accent' : 'text-slate'}`}
                  >
                    {row.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Automation Features Section */}
      <section className="py-20 px-10 bg-snow md:py-15 md:px-5">
        <div className="max-w-[1000px] mx-auto text-center mb-12">
          <h2 className="font-display text-[2rem] text-midnight mb-4">Built for Automation</h2>
          <p className="text-lg text-slate">
            Spend less time on admin work, more time growing your business.
          </p>
        </div>
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-display text-lg text-midnight mb-2">Auto Rent Collection</h3>
            <p className="text-sm text-slate leading-relaxed">
              Rent is automatically charged weekly or monthly. No more chasing payments or manual
              invoicing. Late fees applied automatically based on your rules.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-display text-lg text-midnight mb-2">Tenant Screening</h3>
            <p className="text-sm text-slate leading-relaxed">
              Background checks, employment verification, and reference checks handled through the
              platform. Review reports and make informed decisions fast.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="font-display text-lg text-midnight mb-2">Automated Reminders</h3>
            <p className="text-sm text-slate leading-relaxed">
              Payment reminders, lease renewal notices, and maintenance updates sent automatically.
              Keep tenants informed without lifting a finger.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="font-display text-lg text-midnight mb-2">Stripe Integration</h3>
            <p className="text-sm text-slate leading-relaxed">
              Bank-level security for all transactions. Fast payouts, fraud protection, and seamless
              ACH/card processing built-in.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="font-display text-lg text-midnight mb-2">Mobile App Access</h3>
            <p className="text-sm text-slate leading-relaxed">
              Manage your properties from anywhere. Approve applications, respond to messages, and
              track payments on the go.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="font-display text-lg text-midnight mb-2">Maintenance Tracking</h3>
            <p className="text-sm text-slate leading-relaxed">
              Tenants submit maintenance requests through the app. Track status, assign vendors, and
              keep a complete repair history.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-10 bg-gradient-to-br from-primary to-[#1d4ed8] text-center text-white md:py-15 md:px-5">
        <h2 className="font-display text-[2rem] mb-4">Ready to Start Hosting?</h2>
        <p className="text-lg mb-8 opacity-90">
          Join hundreds of landlords earning more with RoomPilot's automated platform.
        </p>
        <Link to={ROUTES.SIGNUP} className="no-underline">
          <Button variant="white" size="lg">
            List Your Property
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default HowItWorksLandlordsPage
