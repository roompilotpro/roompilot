import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button, Badge } from '../../components/primitives'
import { PricingCard } from '../../components/cards'
import { ROUTES } from '../../router/routes'

/**
 * PricingPage - Pricing plans and comparison
 * Shows pricing options, calculator, and competitor comparison
 */
function PricingPage() {
  const [numRooms, setNumRooms] = useState(5)
  const [avgRent, setAvgRent] = useState(600)

  const calculations = useMemo(() => {
    const totalRent = numRooms * avgRent
    const rpTransaction = Math.round(totalRent * 0.02)
    const rpFlat = numRooms * 15
    const padsplit = 99 + numRooms * 10 + Math.round(totalRent * 0.03)
    const bungalow = Math.round(totalRent * 0.12)
    const bestRP = Math.min(rpTransaction, rpFlat)
    const savings = padsplit - bestRP

    return {
      rpTransaction,
      rpFlat,
      padsplit,
      bungalow,
      savings,
    }
  }, [numRooms, avgRent])

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-bg to-white py-20 px-10 text-center md:py-15 md:px-5">
        <div className="max-w-[800px] mx-auto">
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-midnight mb-4 leading-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate">
            No hidden fees. No surprises. Choose the plan that works best for your business.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-10 md:py-15 md:px-5">
        <div className="max-w-[900px] mx-auto px-10 md:px-5">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8 md:grid-cols-1">
            <div className="bg-white border-2 border-primary rounded-lg p-10 relative shadow-[0_8px_16px_rgba(37,99,235,0.15)]">
              <Badge variant="primary" className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
              <h3 className="font-display text-[1.75rem] text-midnight mb-2">
                Transaction Fee Plan
              </h3>
              <p className="text-slate mb-6 min-h-[3rem]">
                Perfect for hosts who want zero monthly overhead
              </p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display text-5xl font-bold text-midnight">2%</span>
                <span className="text-slate text-lg">per payment</span>
              </div>
              <ul className="list-none mb-8">
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> No monthly subscription
                  fee
                </li>
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> Unlimited rooms
                </li>
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> Automated rent collection
                </li>
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> Daily/weekly payouts
                </li>
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> Full dashboard access
                </li>
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> Tenant screening tools
                </li>
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> In-app messaging
                </li>
                <li className="py-3 flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> Payment protection
                </li>
              </ul>
              <Link to={ROUTES.SIGNUP} className="no-underline">
                <Button variant="primary" fullWidth>
                  Get Started Free
                </Button>
              </Link>
            </div>

            <div className="bg-white border-2 border-cloud rounded-lg p-10 relative">
              <h3 className="font-display text-[1.75rem] text-midnight mb-2">Flat Rate Plan</h3>
              <p className="text-slate mb-6 min-h-[3rem]">
                Great for high-volume hosts with many rooms
              </p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display text-5xl font-bold text-midnight">$15</span>
                <span className="text-slate text-lg">per room/month</span>
              </div>
              <ul className="list-none mb-8">
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> 0% transaction fees
                </li>
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> Unlimited rooms
                </li>
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> Automated rent collection
                </li>
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> Daily/weekly payouts
                </li>
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> Full dashboard access
                </li>
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> Tenant screening tools
                </li>
                <li className="py-3 border-b border-cloud flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> In-app messaging
                </li>
                <li className="py-3 flex items-start gap-3">
                  <span className="text-accent font-bold">&#10003;</span> Payment protection
                </li>
              </ul>
              <Link to={ROUTES.SIGNUP} className="no-underline">
                <Button variant="secondary" fullWidth>
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-10 bg-snow md:py-15 md:px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-15">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] text-midnight mb-4">
              Everything You Need, Included
            </h2>
            <p className="text-lg text-slate max-w-[600px] mx-auto">
              Both plans include all features. No upgrades, add-ons, or premium tiers.
            </p>
          </div>
          <div className="max-w-[800px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
            <div>
              <h4 className="font-semibold text-midnight mb-4">Payment Processing</h4>
              <ul className="list-none text-slate">
                <li className="py-2">&#10003; Weekly/monthly rent collection</li>
                <li className="py-2">&#10003; Automatic late fees</li>
                <li className="py-2">&#10003; ACH & card payments</li>
                <li className="py-2">&#10003; Fast payouts via Stripe</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-midnight mb-4">Tenant Management</h4>
              <ul className="list-none text-slate">
                <li className="py-2">&#10003; Application review system</li>
                <li className="py-2">&#10003; Background check integration</li>
                <li className="py-2">&#10003; Digital lease signing</li>
                <li className="py-2">&#10003; Maintenance requests</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-midnight mb-4">Business Tools</h4>
              <ul className="list-none text-slate">
                <li className="py-2">&#10003; Revenue analytics</li>
                <li className="py-2">&#10003; Financial reports</li>
                <li className="py-2">&#10003; Multi-property management</li>
                <li className="py-2">&#10003; Mobile app access</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-20 px-10 md:py-15 md:px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-15">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] text-midnight mb-4">
              Calculate Your Savings
            </h2>
            <p className="text-lg text-slate max-w-[600px] mx-auto">
              See how much you'll save compared to competitors
            </p>
          </div>
          <div className="bg-white rounded-lg p-12 border border-cloud max-w-[700px] mx-auto md:p-8">
            <h3 className="font-display text-[2rem] text-center mb-8">Savings Calculator</h3>
            <div className="grid gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label htmlFor="numRooms" className="font-semibold text-midnight">
                  Number of Rooms
                </label>
                <input
                  type="number"
                  id="numRooms"
                  value={numRooms}
                  onChange={(e) => setNumRooms(parseInt(e.target.value) || 0)}
                  min="1"
                  max="50"
                  className="py-3 px-3 border border-cloud rounded-sm text-base font-body focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="avgRent" className="font-semibold text-midnight">
                  Average Monthly Rent per Room
                </label>
                <input
                  type="number"
                  id="avgRent"
                  value={avgRent}
                  onChange={(e) => setAvgRent(parseInt(e.target.value) || 0)}
                  min="100"
                  step="50"
                  className="py-3 px-3 border border-cloud rounded-sm text-base font-body focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="bg-primary-bg rounded-md p-8">
              <div className="flex justify-between py-3 border-b border-cloud">
                <span>RoomPilot (Transaction Plan):</span>
                <span>${calculations.rpTransaction}/mo</span>
              </div>
              <div className="flex justify-between py-3 border-b border-cloud">
                <span>RoomPilot (Flat Rate Plan):</span>
                <span>${calculations.rpFlat}/mo</span>
              </div>
              <div className="flex justify-between py-3 border-b border-cloud">
                <span>PadSplit:</span>
                <span>${calculations.padsplit}/mo</span>
              </div>
              <div className="flex justify-between py-3 border-b border-cloud">
                <span>Bungalow:</span>
                <span>${calculations.bungalow}/mo</span>
              </div>
              <div className="flex justify-between pt-4 text-xl font-bold text-primary">
                <span>You Save (vs PadSplit):</span>
                <span>${calculations.savings}/mo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-10 bg-snow md:py-15 md:px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-15">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] text-midnight mb-4">
              How We Compare
            </h2>
            <p className="text-lg text-slate max-w-[600px] mx-auto">
              Side-by-side comparison with industry competitors
            </p>
          </div>
          <div className="bg-white rounded-lg overflow-hidden border border-cloud overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="bg-midnight text-white">
                <tr>
                  <th className="p-5 text-left font-semibold">Feature</th>
                  <th className="p-5 text-left font-semibold bg-primary">RoomPilot</th>
                  <th className="p-5 text-left font-semibold">PadSplit</th>
                  <th className="p-5 text-left font-semibold">Bungalow</th>
                </tr>
              </thead>
              <tbody>
                <tr className="[&_td]:bg-accent-bg">
                  <td className="p-5 border-b border-cloud">Starting Price</td>
                  <td className="p-5 border-b border-cloud bg-[rgba(37,99,235,0.05)] text-accent font-semibold">
                    <strong>2% or $15/room</strong>
                  </td>
                  <td className="p-5 border-b border-cloud">$99 + $10/room + 3%</td>
                  <td className="p-5 border-b border-cloud">12% of rent</td>
                </tr>
                <tr className="even:bg-snow">
                  <td className="p-5 border-b border-cloud">Weekly Rent Collection</td>
                  <td className="p-5 border-b border-cloud bg-[rgba(37,99,235,0.05)] text-accent font-semibold">
                    &#10003; Included
                  </td>
                  <td className="p-5 border-b border-cloud">&#10003; Included</td>
                  <td className="p-5 border-b border-cloud text-coral">&#10007; Monthly only</td>
                </tr>
                <tr className="even:bg-snow">
                  <td className="p-5 border-b border-cloud">Payout Speed</td>
                  <td className="p-5 border-b border-cloud bg-[rgba(37,99,235,0.05)] text-accent font-semibold">
                    Daily or weekly
                  </td>
                  <td className="p-5 border-b border-cloud">Weekly</td>
                  <td className="p-5 border-b border-cloud">Monthly</td>
                </tr>
                <tr className="even:bg-snow">
                  <td className="p-5 border-b border-cloud">Setup Fee</td>
                  <td className="p-5 border-b border-cloud bg-[rgba(37,99,235,0.05)] text-accent font-semibold">
                    $0
                  </td>
                  <td className="p-5 border-b border-cloud">$0</td>
                  <td className="p-5 border-b border-cloud text-coral">$500+</td>
                </tr>
                <tr className="even:bg-snow">
                  <td className="p-5 border-b border-cloud">Host Controls Approval</td>
                  <td className="p-5 border-b border-cloud bg-[rgba(37,99,235,0.05)] text-accent font-semibold">
                    &#10003; Yes
                  </td>
                  <td className="p-5 border-b border-cloud">&#10003; Yes</td>
                  <td className="p-5 border-b border-cloud text-coral">&#10007; No</td>
                </tr>
                <tr className="even:bg-snow">
                  <td className="p-5">Custom House Rules</td>
                  <td className="p-5 bg-[rgba(37,99,235,0.05)] text-accent font-semibold">
                    &#10003; Yes
                  </td>
                  <td className="p-5">Limited</td>
                  <td className="p-5 text-coral">&#10007; No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-[#1d4ed8] text-white text-center py-20 px-10 md:py-15 md:px-5">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-display text-[2.5rem] mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join RoomPilot today and start saving on property management fees.
          </p>
          <Link to={ROUTES.SIGNUP} className="no-underline">
            <Button variant="white" size="lg">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
