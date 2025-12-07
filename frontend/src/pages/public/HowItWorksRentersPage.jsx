import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'

function HowItWorksRentersPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-bg to-white py-[100px] px-10 text-center md:py-15 md:px-5">
        <div className="max-w-[800px] mx-auto">
          <span className="inline-block py-2 px-4 bg-[rgba(37,99,235,0.1)] rounded-full text-sm font-semibold text-primary mb-5 uppercase tracking-wide">For Renters</span>
          <h1 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] text-midnight mb-4 leading-tight">Find Your Perfect Room</h1>
          <p className="text-xl text-slate mb-8 max-w-[600px] mx-auto">
            Affordable rooms with flexible weekly payments, no credit checks required, and
            transparent pricing.
          </p>
          <Link to={ROUTES.SEARCH} className="no-underline">
            <Button variant="primary" size="lg">
              Browse Rooms
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-[100px] bg-white md:py-15 md:px-5">
        <div className="max-w-[1200px] mx-auto px-10 md:px-5">
          <h2 className="font-display text-[clamp(2rem,4vw,2.5rem)] text-midnight text-center mb-15">How It Works</h2>
          <div className="grid grid-cols-4 gap-8 lg:grid-cols-2 md:grid-cols-1">
            <div className="text-center p-10 px-6 bg-snow rounded-xl relative transition-all hover:bg-white hover:shadow-lg hover:-translate-y-2">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-lg mx-auto mb-6">1</div>
              <div className="text-5xl mb-4">&#128269;</div>
              <h3 className="font-display text-xl text-midnight mb-3">Search & Browse</h3>
              <p className="text-sm text-slate leading-relaxed">
                Browse rooms in your area. Filter by price, amenities, and location. See all costs
                upfront with no hidden fees.
              </p>
            </div>
            <div className="text-center p-10 px-6 bg-snow rounded-xl relative transition-all hover:bg-white hover:shadow-lg hover:-translate-y-2">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-lg mx-auto mb-6">2</div>
              <div className="text-5xl mb-4">&#128221;</div>
              <h3 className="font-display text-xl text-midnight mb-3">Apply Online</h3>
              <p className="text-sm text-slate leading-relaxed">
                Submit a quick application. No credit checks required. Some hosts may request a
                background check.
              </p>
            </div>
            <div className="text-center p-10 px-6 bg-snow rounded-xl relative transition-all hover:bg-white hover:shadow-lg hover:-translate-y-2">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-lg mx-auto mb-6">3</div>
              <div className="text-5xl mb-4">&#129309;</div>
              <h3 className="font-display text-xl text-midnight mb-3">Get Approved</h3>
              <p className="text-sm text-slate leading-relaxed">
                Chat with the host, schedule a tour, and get approved. Sign your lease digitally and
                set up payments.
              </p>
            </div>
            <div className="text-center p-10 px-6 bg-snow rounded-xl relative transition-all hover:bg-white hover:shadow-lg hover:-translate-y-2">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-lg mx-auto mb-6">4</div>
              <div className="text-5xl mb-4">&#127968;</div>
              <h3 className="font-display text-xl text-midnight mb-3">Move In</h3>
              <p className="text-sm text-slate leading-relaxed">
                Pay your first week's rent and move in. Rent is collected automatically - weekly or
                monthly, you choose.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[100px] bg-snow md:py-15 md:px-5">
        <div className="max-w-[1200px] mx-auto px-10 md:px-5">
          <h2 className="font-display text-[clamp(2rem,4vw,2.5rem)] text-midnight text-center mb-15">Why Renters Love RoomPilot</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-1">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-cloud transition-all hover:shadow-md hover:-translate-y-1">
              <span className="text-[40px] block mb-4">&#128176;</span>
              <h3 className="font-display text-xl text-midnight mb-3">Low Move-In Costs</h3>
              <p className="text-[15px] text-slate leading-relaxed">
                Just your first week's rent to move in. No first/last/deposit requirements like
                traditional apartments.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-cloud transition-all hover:shadow-md hover:-translate-y-1">
              <span className="text-[40px] block mb-4">&#128197;</span>
              <h3 className="font-display text-xl text-midnight mb-3">Flexible Payments</h3>
              <p className="text-[15px] text-slate leading-relaxed">
                Pay weekly or monthly based on your paycheck schedule. Budget-friendly for gig
                workers and hourly employees.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-cloud transition-all hover:shadow-md hover:-translate-y-1">
              <span className="text-[40px] block mb-4">&#128101;</span>
              <h3 className="font-display text-xl text-midnight mb-3">No Credit Checks</h3>
              <p className="text-[15px] text-slate leading-relaxed">
                Bad credit? No credit? No problem. We believe everyone deserves access to affordable
                housing.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-cloud transition-all hover:shadow-md hover:-translate-y-1">
              <span className="text-[40px] block mb-4">&#128274;</span>
              <h3 className="font-display text-xl text-midnight mb-3">Transparent Pricing</h3>
              <p className="text-[15px] text-slate leading-relaxed">
                No hidden membership fees or service charges. The price you see is the price you
                pay.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[100px] px-10 bg-gradient-to-br from-primary to-[#1d4ed8] text-center text-white md:py-15 md:px-5">
        <h2 className="font-display text-[clamp(2rem,4vw,2.5rem)] mb-4">Ready to Find Your Room?</h2>
        <p className="text-xl mb-8 opacity-90">Browse hundreds of affordable rooms near you</p>
        <Link to={ROUTES.SEARCH} className="no-underline">
          <Button variant="white" size="lg">
            Start Searching
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default HowItWorksRentersPage
