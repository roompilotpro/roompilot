import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'

function HowItWorksLandlordsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-accent-bg to-white py-[100px] px-10 text-center md:py-15 md:px-5">
        <div className="max-w-[800px] mx-auto">
          <span className="inline-block py-2 px-4 bg-[rgba(37,99,235,0.1)] rounded-full text-sm font-semibold text-primary mb-5 uppercase tracking-wide">
            For Landlords
          </span>
          <h1 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] text-midnight mb-4 leading-tight">
            Maximize Your Rental Income
          </h1>
          <p className="text-xl text-slate mb-8 max-w-[600px] mx-auto">
            Low fees, fast payouts, and full control over your property. The automation-first
            platform built for co-living landlords.
          </p>
          <Link to={ROUTES.SIGNUP} className="no-underline">
            <Button variant="primary" size="lg">
              List Your Property
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-[100px] bg-white md:py-15 md:px-5">
        <div className="max-w-[1200px] mx-auto px-10 md:px-5">
          <h2 className="font-display text-[clamp(2rem,4vw,2.5rem)] text-midnight text-center mb-15">
            How It Works
          </h2>
          <div className="grid grid-cols-4 gap-8 lg:grid-cols-2 md:grid-cols-1">
            <div className="text-center p-10 px-6 bg-snow rounded-xl relative transition-all hover:bg-white hover:shadow-lg hover:-translate-y-2">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-lg mx-auto mb-6">
                1
              </div>
              <div className="text-5xl mb-4">&#127968;</div>
              <h3 className="font-display text-xl text-midnight mb-3">List Your Rooms</h3>
              <p className="text-sm text-slate leading-relaxed">
                Add photos, set your price, and define house rules. It's free to list - you only pay
                when you earn.
              </p>
            </div>
            <div className="text-center p-10 px-6 bg-snow rounded-xl relative transition-all hover:bg-white hover:shadow-lg hover:-translate-y-2">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-lg mx-auto mb-6">
                2
              </div>
              <div className="text-5xl mb-4">&#128176;</div>
              <h3 className="font-display text-xl text-midnight mb-3">Connect Stripe</h3>
              <p className="text-sm text-slate leading-relaxed">
                Set up Stripe Connect in minutes to receive payments directly. Choose daily or
                weekly payouts.
              </p>
            </div>
            <div className="text-center p-10 px-6 bg-snow rounded-xl relative transition-all hover:bg-white hover:shadow-lg hover:-translate-y-2">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-lg mx-auto mb-6">
                3
              </div>
              <div className="text-5xl mb-4">&#128101;</div>
              <h3 className="font-display text-xl text-midnight mb-3">Review Applications</h3>
              <p className="text-sm text-slate leading-relaxed">
                Screen tenants your way. You decide who lives in your property - we never force
                placements.
              </p>
            </div>
            <div className="text-center p-10 px-6 bg-snow rounded-xl relative transition-all hover:bg-white hover:shadow-lg hover:-translate-y-2">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-lg mx-auto mb-6">
                4
              </div>
              <div className="text-5xl mb-4">&#129302;</div>
              <h3 className="font-display text-xl text-midnight mb-3">Automate Everything</h3>
              <p className="text-sm text-slate leading-relaxed">
                Rent collection, reminders, late fees, and receipts - all handled automatically
                while you focus on growing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[100px] bg-white md:py-15 md:px-5">
        <div className="max-w-[1200px] mx-auto px-10 md:px-5">
          <h2 className="font-display text-[clamp(2rem,4vw,2.5rem)] text-midnight text-center mb-15">
            Why Landlords Choose RoomPilot
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-1">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-cloud transition-all hover:shadow-md hover:-translate-y-1">
              <span className="text-[40px] block mb-4">&#9889;</span>
              <h3 className="font-display text-xl text-midnight mb-3">Only 2% Fees</h3>
              <p className="text-[15px] text-slate leading-relaxed">
                Keep more of what you earn. No booking fees, no first-10-days skim. Save $500+/year
                per room.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-cloud transition-all hover:shadow-md hover:-translate-y-1">
              <span className="text-[40px] block mb-4">&#128176;</span>
              <h3 className="font-display text-xl text-midnight mb-3">Daily Payouts</h3>
              <p className="text-[15px] text-slate leading-relaxed">
                Get paid as tenants pay. No more waiting 30 days for monthly payouts while floating
                expenses.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-cloud transition-all hover:shadow-md hover:-translate-y-1">
              <span className="text-[40px] block mb-4">&#127917;</span>
              <h3 className="font-display text-xl text-midnight mb-3">Full Control</h3>
              <p className="text-[15px] text-slate leading-relaxed">
                Your house, your rules. Approve your own tenants, set your own policies. No forced
                transfers.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-cloud transition-all hover:shadow-md hover:-translate-y-1">
              <span className="text-[40px] block mb-4">&#129302;</span>
              <h3 className="font-display text-xl text-midnight mb-3">100% Automated</h3>
              <p className="text-[15px] text-slate leading-relaxed">
                Payment reminders, late fees, receipts, and notices. Less admin work, more time for
                growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[100px] bg-snow md:py-15 md:px-5">
        <div className="max-w-[1200px] mx-auto px-10 md:px-5">
          <h2 className="font-display text-[clamp(2rem,4vw,2.5rem)] text-midnight text-center mb-15">
            Compare the Savings
          </h2>
          <div className="grid grid-cols-2 gap-8 max-w-[800px] mx-auto md:grid-cols-1">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="font-display text-2xl text-midnight mb-6 text-center">
                Other Platforms
              </h3>
              <ul className="list-none">
                <li className="py-3 border-b border-cloud text-[15px] text-coral">
                  8-12% platform fees
                </li>
                <li className="py-3 border-b border-cloud text-[15px] text-coral">
                  30+ day payout delays
                </li>
                <li className="py-3 border-b border-cloud text-[15px] text-coral">
                  Forced tenant placements
                </li>
                <li className="py-3 text-[15px] text-coral">Platform-mandated rules</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md border-2 border-primary">
              <h3 className="font-display text-2xl text-midnight mb-6 text-center">RoomPilot</h3>
              <ul className="list-none">
                <li className="py-3 border-b border-cloud text-[15px] text-accent">
                  Just 2% per payment
                </li>
                <li className="py-3 border-b border-cloud text-[15px] text-accent">
                  Daily/weekly payouts
                </li>
                <li className="py-3 border-b border-cloud text-[15px] text-accent">
                  You approve all tenants
                </li>
                <li className="py-3 text-[15px] text-accent">Your rules, your way</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[100px] px-10 bg-gradient-to-br from-primary to-[#1d4ed8] text-center text-white md:py-15 md:px-5">
        <h2 className="font-display text-[clamp(2rem,4vw,2.5rem)] mb-4">Ready to Earn More?</h2>
        <p className="text-xl mb-8 opacity-90">Join the marketplace that respects your business</p>
        <Link to={ROUTES.SIGNUP} className="no-underline">
          <Button variant="white" size="lg">
            Get Started Free
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default HowItWorksLandlordsPage
