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
    <div className="bg-white" style={{ lineHeight: 1.6 }}>
      {/* Hero Section */}
      <section
        className="bg-gradient-to-br from-accent-bg to-white px-8 text-center"
        style={{ padding: '5rem 2rem' }}
      >
        <div className="max-w-[800px] mx-auto">
          <h1
            className="font-display font-bold text-[3rem] text-midnight leading-[1.2]"
            style={{ marginBottom: '1rem' }}
          >
            Start Earning More From Your Rooms
          </h1>
          <p className="text-[1.25rem] text-slate leading-[1.6]" style={{ marginBottom: '1.5rem' }}>
            Weekly rent collection, automated billing, and better cashflow. List your property and
            start earning in days, not weeks.
          </p>
          <a href="#steps" className="no-underline">
            <Button variant="primary" size="lg">
              See How It Works
            </Button>
          </a>
        </div>
        <div
          className="flex justify-center md:flex-col md:gap-6"
          style={{ gap: '2rem', marginTop: '1.5rem' }}
        >
          <div className="text-center">
            <div className="font-display text-[2.5rem] text-accent font-bold leading-none">15%</div>
            <div className="text-[0.875rem] text-slate leading-[1.6]">Higher occupancy rates</div>
          </div>
          <div className="text-center">
            <div className="font-display text-[2.5rem] text-accent font-bold leading-none">2x</div>
            <div className="text-[0.875rem] text-slate leading-[1.6]">Faster tenant placement</div>
          </div>
          <div className="text-center">
            <div className="font-display text-[2.5rem] text-accent font-bold leading-none">98%</div>
            <div className="text-[0.875rem] text-slate leading-[1.6]">On-time payments</div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="steps" className="bg-white" style={{ padding: '5rem 2rem' }}>
        <div className="max-w-[1200px] mx-auto text-center" style={{ marginBottom: '4rem' }}>
          <h2
            className="font-display font-bold text-[2.5rem] text-midnight"
            style={{ marginBottom: '1rem' }}
          >
            Your Journey as a Host
          </h2>
          <p className="text-[1.125rem] text-slate max-w-[600px] mx-auto leading-[1.6]">
            From listing to getting paid, we automate the entire rental process.
          </p>
        </div>
        <div
          className="max-w-[1200px] mx-auto grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}
        >
          <div className="text-center">
            <div
              className="w-20 h-20 bg-accent-bg rounded-full flex items-center justify-center text-[2rem] mx-auto"
              style={{ marginBottom: '1rem' }}
            >
              🏡
            </div>
            <div
              className="inline-block w-8 h-8 bg-accent text-white text-sm font-bold rounded-full"
              style={{ lineHeight: '32px', marginBottom: '0.5rem' }}
            >
              1
            </div>
            <h3
              className="font-display font-bold text-[1.5rem] text-midnight"
              style={{ marginBottom: '0.5rem' }}
            >
              List Your Property
            </h3>
            <p className="text-slate leading-[1.7]">
              Upload photos, set your prices, and define house rules. List individual rooms or
              entire properties. Set weekly or monthly rates, include utilities, and control every
              detail of your listing.
            </p>
          </div>
          <div className="text-center">
            <div
              className="w-20 h-20 bg-accent-bg rounded-full flex items-center justify-center text-[2rem] mx-auto"
              style={{ marginBottom: '1rem' }}
            >
              ✅
            </div>
            <div
              className="inline-block w-8 h-8 bg-accent text-white text-sm font-bold rounded-full"
              style={{ lineHeight: '32px', marginBottom: '0.5rem' }}
            >
              2
            </div>
            <h3
              className="font-display font-bold text-[1.5rem] text-midnight"
              style={{ marginBottom: '0.5rem' }}
            >
              Review Applications
            </h3>
            <p className="text-slate leading-[1.7]">
              View renter profiles, employment history, and references. Request background checks if
              desired. You have complete control over who lives in your property - approve or
              decline with one click.
            </p>
          </div>
          <div className="text-center">
            <div
              className="w-20 h-20 bg-accent-bg rounded-full flex items-center justify-center text-[2rem] mx-auto"
              style={{ marginBottom: '1rem' }}
            >
              🔄
            </div>
            <div
              className="inline-block w-8 h-8 bg-accent text-white text-sm font-bold rounded-full"
              style={{ lineHeight: '32px', marginBottom: '0.5rem' }}
            >
              3
            </div>
            <h3
              className="font-display font-bold text-[1.5rem] text-midnight"
              style={{ marginBottom: '0.5rem' }}
            >
              Automate Billing
            </h3>
            <p className="text-slate leading-[1.7]">
              Set it and forget it. Weekly or monthly rent is automatically charged to tenants'
              payment methods. Late fees applied automatically, reminders sent, zero manual
              invoicing required.
            </p>
          </div>
          <div className="text-center">
            <div
              className="w-20 h-20 bg-accent-bg rounded-full flex items-center justify-center text-[2rem] mx-auto"
              style={{ marginBottom: '1rem' }}
            >
              💰
            </div>
            <div
              className="inline-block w-8 h-8 bg-accent text-white text-sm font-bold rounded-full"
              style={{ lineHeight: '32px', marginBottom: '0.5rem' }}
            >
              4
            </div>
            <h3
              className="font-display font-bold text-[1.5rem] text-midnight"
              style={{ marginBottom: '0.5rem' }}
            >
              Get Paid Fast
            </h3>
            <p className="text-slate leading-[1.7]">
              Receive payouts daily or weekly via Stripe Connect. Funds deposited directly to your
              bank account. Track earnings in real-time, download reports, and manage multiple
              properties from one dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Features Section */}
      <section className="bg-snow" style={{ padding: '5rem 2rem' }}>
        <div className="max-w-[1200px] mx-auto text-center" style={{ marginBottom: '4rem' }}>
          <h2
            className="font-display font-bold text-[2.5rem] text-midnight"
            style={{ marginBottom: '1rem' }}
          >
            Powerful Dashboard, Simple Interface
          </h2>
          <p className="text-[1.125rem] text-slate max-w-[600px] mx-auto leading-[1.6]">
            Everything you need to manage your rental business in one place.
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto">
          <div
            className="bg-white border border-cloud"
            style={{
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <h3
              className="font-display font-bold text-[1.75rem] text-midnight"
              style={{ marginBottom: '1.5rem' }}
            >
              Host Dashboard Features
            </h3>
            <div
              className="grid"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}
            >
              <div className="flex items-start" style={{ gap: '1rem' }}>
                <div className="w-10 h-10 bg-primary-bg rounded-lg flex items-center justify-center flex-shrink-0">
                  📊
                </div>
                <div>
                  <h4 className="font-semibold text-midnight" style={{ marginBottom: '0.25rem' }}>
                    Revenue Analytics
                  </h4>
                  <p className="text-[0.9375rem] text-slate leading-[1.6]">
                    Track income, occupancy rates, and performance metrics across all properties.
                  </p>
                </div>
              </div>
              <div className="flex items-start" style={{ gap: '1rem' }}>
                <div className="w-10 h-10 bg-primary-bg rounded-lg flex items-center justify-center flex-shrink-0">
                  👥
                </div>
                <div>
                  <h4 className="font-semibold text-midnight" style={{ marginBottom: '0.25rem' }}>
                    Tenant Management
                  </h4>
                  <p className="text-[0.9375rem] text-slate leading-[1.6]">
                    View all current and past tenants, payment history, and lease details in one
                    place.
                  </p>
                </div>
              </div>
              <div className="flex items-start" style={{ gap: '1rem' }}>
                <div className="w-10 h-10 bg-primary-bg rounded-lg flex items-center justify-center flex-shrink-0">
                  💬
                </div>
                <div>
                  <h4 className="font-semibold text-midnight" style={{ marginBottom: '0.25rem' }}>
                    Secure Messaging
                  </h4>
                  <p className="text-[0.9375rem] text-slate leading-[1.6]">
                    Communicate with applicants and tenants through our built-in messaging system.
                  </p>
                </div>
              </div>
              <div className="flex items-start" style={{ gap: '1rem' }}>
                <div className="w-10 h-10 bg-primary-bg rounded-lg flex items-center justify-center flex-shrink-0">
                  🔔
                </div>
                <div>
                  <h4 className="font-semibold text-midnight" style={{ marginBottom: '0.25rem' }}>
                    Smart Notifications
                  </h4>
                  <p className="text-[0.9375rem] text-slate leading-[1.6]">
                    Get alerts for new applications, late payments, lease expirations, and
                    maintenance requests.
                  </p>
                </div>
              </div>
              <div className="flex items-start" style={{ gap: '1rem' }}>
                <div className="w-10 h-10 bg-primary-bg rounded-lg flex items-center justify-center flex-shrink-0">
                  📝
                </div>
                <div>
                  <h4 className="font-semibold text-midnight" style={{ marginBottom: '0.25rem' }}>
                    Digital Leases
                  </h4>
                  <p className="text-[0.9375rem] text-slate leading-[1.6]">
                    Generate, send, and sign leases electronically. All documents stored securely in
                    the cloud.
                  </p>
                </div>
              </div>
              <div className="flex items-start" style={{ gap: '1rem' }}>
                <div className="w-10 h-10 bg-primary-bg rounded-lg flex items-center justify-center flex-shrink-0">
                  📄
                </div>
                <div>
                  <h4 className="font-semibold text-midnight" style={{ marginBottom: '0.25rem' }}>
                    Financial Reports
                  </h4>
                  <p className="text-[0.9375rem] text-slate leading-[1.6]">
                    Export transaction history, tax documents, and profit/loss statements for
                    accounting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section className="bg-white" style={{ padding: '5rem 2rem' }}>
        <div className="max-w-[1200px] mx-auto text-center" style={{ marginBottom: '4rem' }}>
          <h2
            className="font-display font-bold text-[2.5rem] text-midnight"
            style={{ marginBottom: '1rem' }}
          >
            Transparent, Competitive Pricing
          </h2>
          <p className="text-[1.125rem] text-slate max-w-[600px] mx-auto leading-[1.6]">
            Compare our fees to the competition - we're significantly cheaper.
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto">
          <div
            className="bg-white overflow-hidden border border-cloud"
            style={{ borderRadius: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-accent text-white">
                  <th className="text-left font-semibold" style={{ padding: '1.25rem' }}>
                    Platform
                  </th>
                  <th className="text-left font-semibold" style={{ padding: '1.25rem' }}>
                    Monthly Fee
                  </th>
                  <th className="text-left font-semibold" style={{ padding: '1.25rem' }}>
                    Transaction Fee
                  </th>
                  <th className="text-left font-semibold" style={{ padding: '1.25rem' }}>
                    Cost for 5 Rooms at $600/mo
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICING_DATA.map((row, index) => (
                  <tr
                    key={index}
                    className={`${row.highlight ? 'bg-accent-bg font-semibold text-accent' : (index + 1) % 2 === 0 ? 'bg-snow' : 'bg-white'}`}
                  >
                    <td
                      style={{
                        padding: '1.25rem',
                        borderBottom:
                          index < PRICING_DATA.length - 1 ? '1px solid #e8ecef' : 'none',
                      }}
                    >
                      {row.highlight && <strong>{row.platform}</strong>}
                      {!row.highlight && row.platform}
                    </td>
                    <td
                      style={{
                        padding: '1.25rem',
                        borderBottom:
                          index < PRICING_DATA.length - 1 ? '1px solid #e8ecef' : 'none',
                      }}
                    >
                      {row.monthlyFee}
                    </td>
                    <td
                      style={{
                        padding: '1.25rem',
                        borderBottom:
                          index < PRICING_DATA.length - 1 ? '1px solid #e8ecef' : 'none',
                      }}
                    >
                      {row.transactionFee}
                    </td>
                    <td
                      style={{
                        padding: '1.25rem',
                        borderBottom:
                          index < PRICING_DATA.length - 1 ? '1px solid #e8ecef' : 'none',
                      }}
                    >
                      {row.highlight && <strong>{row.cost}</strong>}
                      {!row.highlight && row.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Automation Features Section */}
      <section className="bg-snow" style={{ padding: '5rem 2rem' }}>
        <div className="max-w-[1200px] mx-auto text-center" style={{ marginBottom: '4rem' }}>
          <h2
            className="font-display font-bold text-[2.5rem] text-midnight"
            style={{ marginBottom: '1rem' }}
          >
            Built for Automation
          </h2>
          <p className="text-[1.125rem] text-slate max-w-[600px] mx-auto leading-[1.6]">
            Spend less time on admin work, more time growing your business.
          </p>
        </div>
        <div
          className="max-w-[1200px] mx-auto grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
        >
          <div
            className="bg-white border border-cloud"
            style={{ borderRadius: '1rem', padding: '2rem' }}
          >
            <div
              className="w-12 h-12 bg-warm-bg rounded-lg flex items-center justify-center text-[1.5rem]"
              style={{ marginBottom: '1rem' }}
            >
              ⚡
            </div>
            <h3
              className="font-display font-bold text-[1.25rem] text-midnight"
              style={{ marginBottom: '0.75rem' }}
            >
              Auto Rent Collection
            </h3>
            <p className="text-slate leading-[1.6]">
              Rent is automatically charged weekly or monthly. No more chasing payments or manual
              invoicing. Late fees applied automatically based on your rules.
            </p>
          </div>
          <div
            className="bg-white border border-cloud"
            style={{ borderRadius: '1rem', padding: '2rem' }}
          >
            <div
              className="w-12 h-12 bg-warm-bg rounded-lg flex items-center justify-center text-[1.5rem]"
              style={{ marginBottom: '1rem' }}
            >
              🔒
            </div>
            <h3
              className="font-display font-bold text-[1.25rem] text-midnight"
              style={{ marginBottom: '0.75rem' }}
            >
              Tenant Screening
            </h3>
            <p className="text-slate leading-[1.6]">
              Background checks, employment verification, and reference checks handled through the
              platform. Review reports and make informed decisions fast.
            </p>
          </div>
          <div
            className="bg-white border border-cloud"
            style={{ borderRadius: '1rem', padding: '2rem' }}
          >
            <div
              className="w-12 h-12 bg-warm-bg rounded-lg flex items-center justify-center text-[1.5rem]"
              style={{ marginBottom: '1rem' }}
            >
              📧
            </div>
            <h3
              className="font-display font-bold text-[1.25rem] text-midnight"
              style={{ marginBottom: '0.75rem' }}
            >
              Automated Reminders
            </h3>
            <p className="text-slate leading-[1.6]">
              Payment reminders, lease renewal notices, and maintenance updates sent automatically.
              Keep tenants informed without lifting a finger.
            </p>
          </div>
          <div
            className="bg-white border border-cloud"
            style={{ borderRadius: '1rem', padding: '2rem' }}
          >
            <div
              className="w-12 h-12 bg-warm-bg rounded-lg flex items-center justify-center text-[1.5rem]"
              style={{ marginBottom: '1rem' }}
            >
              💳
            </div>
            <h3
              className="font-display font-bold text-[1.25rem] text-midnight"
              style={{ marginBottom: '0.75rem' }}
            >
              Stripe Integration
            </h3>
            <p className="text-slate leading-[1.6]">
              Bank-level security for all transactions. Fast payouts, fraud protection, and seamless
              ACH/card processing built-in.
            </p>
          </div>
          <div
            className="bg-white border border-cloud"
            style={{ borderRadius: '1rem', padding: '2rem' }}
          >
            <div
              className="w-12 h-12 bg-warm-bg rounded-lg flex items-center justify-center text-[1.5rem]"
              style={{ marginBottom: '1rem' }}
            >
              📱
            </div>
            <h3
              className="font-display font-bold text-[1.25rem] text-midnight"
              style={{ marginBottom: '0.75rem' }}
            >
              Mobile App Access
            </h3>
            <p className="text-slate leading-[1.6]">
              Manage your properties from anywhere. Approve applications, respond to messages, and
              track payments on the go.
            </p>
          </div>
          <div
            className="bg-white border border-cloud"
            style={{ borderRadius: '1rem', padding: '2rem' }}
          >
            <div
              className="w-12 h-12 bg-warm-bg rounded-lg flex items-center justify-center text-[1.5rem]"
              style={{ marginBottom: '1rem' }}
            >
              🔧
            </div>
            <h3
              className="font-display font-bold text-[1.25rem] text-midnight"
              style={{ marginBottom: '0.75rem' }}
            >
              Maintenance Tracking
            </h3>
            <p className="text-slate leading-[1.6]">
              Tenants submit maintenance requests through the app. Track status, assign vendors, and
              keep a complete repair history.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="bg-gradient-to-br from-accent to-[#059669] text-center text-white"
        style={{ padding: '5rem 2rem' }}
      >
        <h2 className="font-display font-bold text-[2.5rem]" style={{ marginBottom: '1rem' }}>
          Ready to Start Hosting?
        </h2>
        <p className="text-[1.25rem] opacity-90" style={{ marginBottom: '2rem' }}>
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
