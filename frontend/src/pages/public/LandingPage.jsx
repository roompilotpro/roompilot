import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'

/**
 * LandingPage - Main marketing/home page
 * Features hero section, problems/pain points, solution steps,
 * features grid, comparison table, and dual CTA sections
 */
function LandingPage() {
  return (
    <div className="overflow-x-hidden pb-8">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-start pt-28 px-10 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.08)_0%,transparent_50%),radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(16,185,129,0.06)_0%,transparent_50%),linear-gradient(180deg,var(--color-white)_0%,var(--color-snow)_100%)]" />
        {/* Dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-cloud)_1px,transparent_1px)] bg-[length:40px_40px] opacity-50" />

        <div className="relative max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center text-center lg:text-left">
          <div className="animate-[fadeSlideUp_0.8s_ease-out]">
            <div className="inline-flex items-center gap-2 py-2 px-4 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] rounded-full text-sm font-semibold text-accent mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
              Now accepting early hosts
            </div>

            <h1 className="font-display text-[clamp(42px,5vw,64px)] font-semibold leading-[1.1] text-midnight tracking-[-0.03em] mb-6">
              Room rentals,
              <br />
              <span className="text-primary italic">your way.</span>
            </h1>

            <p className="text-[19px] leading-[1.7] text-slate max-w-[520px] mb-10 mx-auto lg:mx-0">
              The automation-first marketplace that gives co-living landlords full control, fast
              payouts, and fees that don't eat your profits.
            </p>

            <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
              <Link to={ROUTES.SIGNUP} className="no-underline">
                <Button variant="primary" size="lg" className="px-9 py-5">
                  List Your Property
                </Button>
              </Link>
              <Link to={ROUTES.SEARCH} className="no-underline">
                <Button variant="outline" size="lg" className="px-9 py-5">
                  Find a Room
                </Button>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-12 mt-14 pt-10 border-t border-cloud justify-center lg:justify-start">
              <div className="animate-[fadeSlideUp_0.8s_ease-out_0.2s_backwards]">
                <div className="font-display text-4xl font-bold text-midnight leading-none mb-2">
                  <span className="text-primary">2%</span>
                </div>
                <div className="text-sm text-mist font-medium">Platform fee</div>
              </div>
              <div className="animate-[fadeSlideUp_0.8s_ease-out_0.3s_backwards]">
                <div className="font-display text-4xl font-bold text-midnight leading-none mb-2">
                  Daily
                </div>
                <div className="text-sm text-mist font-medium">Payouts available</div>
              </div>
              <div className="animate-[fadeSlideUp_0.8s_ease-out_0.4s_backwards]">
                <div className="font-display text-4xl font-bold text-midnight leading-none mb-2">
                  100%
                </div>
                <div className="text-sm text-mist font-medium">Your control</div>
              </div>
            </div>
          </div>

          <div className="relative animate-[fadeSlideUp_0.8s_ease-out_0.2s_backwards] max-w-[500px] mx-auto lg:max-w-none lg:mx-0">
            <div
              className="relative bg-white rounded-xl shadow-xl overflow-hidden"
              style={{ transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)' }}
            >
              <div className="w-full h-[280px] bg-[linear-gradient(135deg,rgba(37,99,235,0.1)_0%,transparent_50%),url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80')] bg-cover bg-center" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-display text-xl font-semibold text-midnight mb-1">
                      Sunny Private Room
                    </div>
                    <div className="text-sm text-mist">Midtown, Atlanta</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-bold text-primary">$165</div>
                    <div className="text-[13px] text-mist">/week</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="py-1.5 px-3 bg-snow rounded-full text-[13px] font-medium text-slate">
                    Private bath
                  </span>
                  <span className="py-1.5 px-3 bg-snow rounded-full text-[13px] font-medium text-slate">
                    Furnished
                  </span>
                  <span className="py-1.5 px-3 bg-snow rounded-full text-[13px] font-medium text-slate">
                    Utilities incl.
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute top-5 -right-5 bg-white rounded-[20px] shadow-lg py-4 px-5 flex items-center gap-3 animate-[float_4s_ease-in-out_infinite] [animation-delay:-1s]">
              <div className="w-10 h-10 rounded-[10px] bg-[rgba(16,185,129,0.1)] flex items-center justify-center text-xl">
                &#9889;
              </div>
              <div>
                <div className="text-[13px] text-mist">Payout sent</div>
                <div className="text-base font-bold text-midnight">$2,340.00</div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-12 bg-white rounded-[20px] shadow-lg py-4 px-5 flex items-center gap-3 animate-[float_4s_ease-in-out_infinite] [animation-delay:-2s]">
              <div className="w-10 h-10 rounded-[10px] bg-[rgba(37,99,235,0.1)] flex items-center justify-center text-xl">
                &#10003;
              </div>
              <div>
                <div className="text-[13px] text-mist">Auto-collected</div>
                <div className="text-base font-bold text-midnight">Rent received</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-[120px] px-10 bg-midnight relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-transparent" />
        <div className="max-w-[1200px] mx-auto relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-mist mb-4">
              The Problem
            </div>
            <h2 className="font-display text-[clamp(32px,4vw,48px)] font-semibold text-white leading-[1.2] tracking-[-0.02em] max-w-[700px] mx-auto mb-5">
              Current platforms take too much and give too little
            </h2>
            <p className="text-lg text-mist max-w-[600px] mx-auto">
              Co-living landlords are stuck with high fees, slow payouts, and platforms that treat
              them like employees instead of partners.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg p-8 transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)] hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[rgba(244,63,94,0.15)] flex items-center justify-center text-2xl mb-5">
                &#128184;
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-3">Crushing Fees</h3>
              <p className="text-[15px] text-mist leading-[1.6]">
                Other platforms charge 8-10% of every payment, plus booking fees that take the first
                10 days of rent. That's hundreds lost per room, per year.
              </p>
              <div className="mt-5 pt-5 border-t border-[rgba(255,255,255,0.06)] text-sm">
                <span className="font-display text-[28px] font-bold text-coral block mb-1">
                  8%+
                </span>
                <span className="text-mist">typical platform fee</span>
              </div>
            </div>

            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg p-8 transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)] hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[rgba(244,63,94,0.15)] flex items-center justify-center text-2xl mb-5">
                &#9203;
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-3">
                Glacial Payouts
              </h3>
              <p className="text-[15px] text-mist leading-[1.6]">
                Monthly payouts with 30-day holds mean you're floating expenses while the platform
                sits on your money. Your cash flow shouldn't suffer for their convenience.
              </p>
              <div className="mt-5 pt-5 border-t border-[rgba(255,255,255,0.06)] text-sm">
                <span className="font-display text-[28px] font-bold text-coral block mb-1">
                  30+ days
                </span>
                <span className="text-mist">to see your money</span>
              </div>
            </div>

            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg p-8 transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)] hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[rgba(244,63,94,0.15)] flex items-center justify-center text-2xl mb-5">
                &#127917;
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-3">Zero Control</h3>
              <p className="text-[15px] text-mist leading-[1.6]">
                Forced tenant transfers, strict house rules you didn't set, and fines you have to
                enforce. You own the property, but they run the show.
              </p>
              <div className="mt-5 pt-5 border-t border-[rgba(255,255,255,0.06)] text-sm">
                <span className="font-display text-[28px] font-bold text-coral block mb-1">
                  $50
                </span>
                <span className="text-mist">fines for minor violations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-[120px] px-10 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-primary mb-4">
              How It Works
            </div>
            <h2 className="font-display text-[clamp(32px,4vw,48px)] font-semibold text-midnight leading-[1.2] tracking-[-0.02em] mb-5">
              Simple for everyone
            </h2>
            <p className="text-lg text-slate max-w-[600px] mx-auto">
              Get started in minutes. List rooms, find tenants, collect rent—all on autopilot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center py-10 px-6 bg-snow rounded-xl transition-all duration-300 relative hover:bg-white hover:shadow-lg hover:-translate-y-2 after:absolute after:top-1/2 after:-right-4 after:w-8 after:h-0.5 after:bg-cloud xl:after:block after:hidden [&:last-child]:after:hidden">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-lg mx-auto mb-6">
                1
              </div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[32px] mx-auto mb-5">
                &#127968;
              </div>
              <h3 className="font-display text-lg font-semibold text-midnight mb-3">
                List Your Rooms
              </h3>
              <p className="text-sm text-slate leading-[1.6]">
                Add photos, set your price and rules. Connect Stripe for instant payouts.
              </p>
            </div>

            <div className="text-center py-10 px-6 bg-snow rounded-xl transition-all duration-300 relative hover:bg-white hover:shadow-lg hover:-translate-y-2 after:absolute after:top-1/2 after:-right-4 after:w-8 after:h-0.5 after:bg-cloud xl:after:block after:hidden [&:last-child]:after:hidden">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-lg mx-auto mb-6">
                2
              </div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[32px] mx-auto mb-5">
                &#128100;
              </div>
              <h3 className="font-display text-lg font-semibold text-midnight mb-3">
                Review Applications
              </h3>
              <p className="text-sm text-slate leading-[1.6]">
                Screen tenants your way. Approve who you want—we never force placements.
              </p>
            </div>

            <div className="text-center py-10 px-6 bg-snow rounded-xl transition-all duration-300 relative hover:bg-white hover:shadow-lg hover:-translate-y-2 after:absolute after:top-1/2 after:-right-4 after:w-8 after:h-0.5 after:bg-cloud xl:after:block after:hidden [&:last-child]:after:hidden">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-lg mx-auto mb-6">
                3
              </div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[32px] mx-auto mb-5">
                &#129302;
              </div>
              <h3 className="font-display text-lg font-semibold text-midnight mb-3">
                Automate Everything
              </h3>
              <p className="text-sm text-slate leading-[1.6]">
                Rent collection, reminders, late fees—all handled automatically.
              </p>
            </div>

            <div className="text-center py-10 px-6 bg-snow rounded-xl transition-all duration-300 relative hover:bg-white hover:shadow-lg hover:-translate-y-2 after:absolute after:top-1/2 after:-right-4 after:w-8 after:h-0.5 after:bg-cloud xl:after:block after:hidden [&:last-child]:after:hidden">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-lg mx-auto mb-6">
                4
              </div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[32px] mx-auto mb-5">
                &#128176;
              </div>
              <h3 className="font-display text-lg font-semibold text-midnight mb-3">
                Get Paid Fast
              </h3>
              <p className="text-sm text-slate leading-[1.6]">
                Daily or weekly payouts. No more waiting a month to see your money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-[120px] px-10 bg-gradient-to-b from-snow to-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-primary mb-4">
              Why RoomPilot
            </div>
            <h2 className="font-display text-[clamp(32px,4vw,48px)] font-semibold text-midnight leading-[1.2] tracking-[-0.02em] mb-5">
              Built for landlords who want to stay in charge
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Highlight card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-primary to-[#1e40af] rounded-xl p-10 shadow-sm transition-all duration-300 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 rounded-[14px] bg-[rgba(255,255,255,0.15)] flex items-center justify-center text-[28px] shrink-0">
                &#9889;
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-[22px] font-semibold text-white mb-3">
                  2% fees. That's it.
                </h3>
                <p className="text-[15px] text-white/90 leading-[1.7]">
                  No booking fees. No first-10-days skim. No hidden charges. Just a simple 2%
                  transaction fee—or choose our flat $15/room monthly plan. Either way, you keep
                  more of what you earn.
                </p>
                <div className="flex flex-col md:flex-row gap-8 mt-5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-xs">
                      &#10003;
                    </span>
                    <span className="text-sm font-semibold text-white">
                      Save $500+/year per room
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-xs">
                      &#10003;
                    </span>
                    <span className="text-sm font-semibold text-white">Transparent pricing</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-10 shadow-sm border border-cloud transition-all duration-300 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start hover:shadow-lg hover:border-transparent hover:-translate-y-1">
              <div className="w-14 h-14 rounded-[14px] bg-[rgba(16,185,129,0.1)] flex items-center justify-center text-[28px] shrink-0">
                &#127939;
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-[22px] font-semibold text-midnight mb-3">
                  Daily Payouts
                </h3>
                <p className="text-[15px] text-slate leading-[1.7]">
                  Why wait 30 days? Get paid as tenants pay. Weekly billing means predictable income
                  and faster access to your money via Stripe.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-10 shadow-sm border border-cloud transition-all duration-300 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start hover:shadow-lg hover:border-transparent hover:-translate-y-1">
              <div className="w-14 h-14 rounded-[14px] bg-[rgba(37,99,235,0.1)] flex items-center justify-center text-[28px] shrink-0">
                &#128274;
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-[22px] font-semibold text-midnight mb-3">
                  Your House, Your Rules
                </h3>
                <p className="text-[15px] text-slate leading-[1.7]">
                  Set your own policies. Approve your own tenants. No forced transfers, no corporate
                  meddling. You're the landlord—act like it.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-10 shadow-sm border border-cloud transition-all duration-300 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start hover:shadow-lg hover:border-transparent hover:-translate-y-1">
              <div className="w-14 h-14 rounded-[14px] bg-[rgba(245,158,11,0.1)] flex items-center justify-center text-[28px] shrink-0">
                &#129302;
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-[22px] font-semibold text-midnight mb-3">
                  Fully Automated
                </h3>
                <p className="text-[15px] text-slate leading-[1.7]">
                  Payment reminders, late fees, receipts, notices—all handled automatically. Less
                  admin work, more time for what matters.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-10 shadow-sm border border-cloud transition-all duration-300 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start hover:shadow-lg hover:border-transparent hover:-translate-y-1">
              <div className="w-14 h-14 rounded-[14px] bg-[rgba(139,92,246,0.1)] flex items-center justify-center text-[28px] shrink-0">
                &#128172;
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-[22px] font-semibold text-midnight mb-3">
                  Built-in Communication
                </h3>
                <p className="text-[15px] text-slate leading-[1.7]">
                  House group chats, direct messaging, maintenance requests. Keep everything in one
                  place instead of juggling texts and emails.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-[120px] px-10 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-[60px]">
            <div className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-primary mb-4">
              Compare
            </div>
            <h2 className="font-display text-[clamp(32px,4vw,42px)] font-semibold text-midnight leading-[1.2] mb-4">
              See the difference
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-cloud">
            {/* Header row */}
            <div className="grid grid-cols-3 border-b border-cloud bg-snow">
              <div className="p-5 px-6 text-[15px]" />
              <div className="p-5 px-6 text-[15px] font-bold text-midnight text-center bg-[rgba(37,99,235,0.03)] border-x border-cloud">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-primary text-white flex items-center justify-center font-bold text-sm">
                    R
                  </div>
                  RoomPilot
                </div>
              </div>
              <div className="p-5 px-6 text-[15px] font-bold text-midnight text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-mist text-white flex items-center justify-center font-bold text-sm">
                    P
                  </div>
                  PadSplit
                </div>
              </div>
            </div>

            {/* Data rows */}
            <div className="grid grid-cols-3 border-b border-cloud">
              <div className="p-5 px-6 text-[15px] font-semibold text-charcoal">Platform Fee</div>
              <div className="p-5 px-6 text-[15px] text-center bg-[rgba(37,99,235,0.03)] border-x border-cloud text-accent font-semibold">
                2%
              </div>
              <div className="p-5 px-6 text-[15px] text-center text-coral">8%</div>
            </div>

            <div className="grid grid-cols-3 border-b border-cloud">
              <div className="p-5 px-6 text-[15px] font-semibold text-charcoal">Booking Fee</div>
              <div className="p-5 px-6 text-[15px] text-center bg-[rgba(37,99,235,0.03)] border-x border-cloud text-accent font-semibold">
                None
              </div>
              <div className="p-5 px-6 text-[15px] text-center text-coral">First 10 days rent</div>
            </div>

            <div className="grid grid-cols-3 border-b border-cloud">
              <div className="p-5 px-6 text-[15px] font-semibold text-charcoal">Payouts</div>
              <div className="p-5 px-6 text-[15px] text-center bg-[rgba(37,99,235,0.03)] border-x border-cloud text-accent font-semibold">
                Daily / Weekly
              </div>
              <div className="p-5 px-6 text-[15px] text-center text-slate">Monthly</div>
            </div>

            <div className="grid grid-cols-3 border-b border-cloud">
              <div className="p-5 px-6 text-[15px] font-semibold text-charcoal">
                Tenant Approval
              </div>
              <div className="p-5 px-6 text-[15px] text-center bg-[rgba(37,99,235,0.03)] border-x border-cloud text-accent font-semibold">
                You decide
              </div>
              <div className="p-5 px-6 text-[15px] text-center text-slate">Platform assigns</div>
            </div>

            <div className="grid grid-cols-3 border-b border-cloud">
              <div className="p-5 px-6 text-[15px] font-semibold text-charcoal">
                Network Transfers
              </div>
              <div className="p-5 px-6 text-[15px] text-center bg-[rgba(37,99,235,0.03)] border-x border-cloud text-accent font-semibold">
                Not allowed
              </div>
              <div className="p-5 px-6 text-[15px] text-center text-slate">Encouraged</div>
            </div>

            <div className="grid grid-cols-3">
              <div className="p-5 px-6 text-[15px] font-semibold text-charcoal">House Rules</div>
              <div className="p-5 px-6 text-[15px] text-center bg-[rgba(37,99,235,0.03)] border-x border-cloud text-accent font-semibold">
                You set them
              </div>
              <div className="p-5 px-6 text-[15px] text-center text-slate">Platform mandates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className="py-[120px] px-10 bg-snow">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Landlord CTA */}
          <div className="bg-gradient-to-br from-charcoal to-midnight rounded-xl p-12 shadow-md transition-all duration-300 relative overflow-hidden hover:shadow-xl hover:-translate-y-1">
            <span className="inline-block py-1.5 px-3 bg-[rgba(255,255,255,0.1)] rounded-full text-xs font-semibold text-[#6ee7b7] uppercase tracking-[0.05em] mb-5">
              For Landlords
            </span>
            <h3 className="font-display text-[28px] font-semibold text-white leading-[1.2] mb-4">
              Start earning more from your rooms
            </h3>
            <p className="text-[16px] text-white/80 leading-[1.6] mb-8">
              Join the marketplace that respects your business. Lower fees, faster payouts, and zero
              micromanagement.
            </p>

            <div className="mb-8">
              <div className="flex items-center gap-3 py-3 text-[15px] text-white border-b border-[rgba(255,255,255,0.1)]">
                <span className="w-6 h-6 rounded-full bg-[rgba(16,185,129,0.2)] flex items-center justify-center shrink-0 text-accent text-sm">
                  &#10003;
                </span>
                List unlimited rooms
              </div>
              <div className="flex items-center gap-3 py-3 text-[15px] text-white border-b border-[rgba(255,255,255,0.1)]">
                <span className="w-6 h-6 rounded-full bg-[rgba(16,185,129,0.2)] flex items-center justify-center shrink-0 text-accent text-sm">
                  &#10003;
                </span>
                Automated rent collection
              </div>
              <div className="flex items-center gap-3 py-3 text-[15px] text-white border-b border-[rgba(255,255,255,0.1)]">
                <span className="w-6 h-6 rounded-full bg-[rgba(16,185,129,0.2)] flex items-center justify-center shrink-0 text-accent text-sm">
                  &#10003;
                </span>
                Daily payouts via Stripe
              </div>
              <div className="flex items-center gap-3 py-3 text-[15px] text-white">
                <span className="w-6 h-6 rounded-full bg-[rgba(16,185,129,0.2)] flex items-center justify-center shrink-0 text-accent text-sm">
                  &#10003;
                </span>
                Full tenant control
              </div>
            </div>

            <Link to={ROUTES.SIGNUP} className="no-underline block">
              <Button variant="primary" size="lg" fullWidth>
                List Your Property &rarr;
              </Button>
            </Link>
          </div>

          {/* Renter CTA */}
          <div className="bg-white rounded-xl p-12 shadow-md border border-cloud transition-all duration-300 relative overflow-hidden hover:shadow-xl hover:-translate-y-1">
            <span className="inline-block py-1.5 px-3 bg-[rgba(37,99,235,0.1)] rounded-full text-xs font-semibold text-primary uppercase tracking-[0.05em] mb-5">
              For Renters
            </span>
            <h3 className="font-display text-[28px] font-semibold text-midnight leading-[1.2] mb-4">
              Find affordable rooms near you
            </h3>
            <p className="text-[16px] text-slate leading-[1.6] mb-8">
              Browse private rooms at prices you can actually afford. No membership fees, no
              surprises. Just simple, honest renting.
            </p>

            <div className="mb-8">
              <div className="flex items-center gap-3 py-3 text-[15px] text-charcoal border-b border-cloud">
                <span className="w-6 h-6 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center shrink-0 text-accent text-sm">
                  &#10003;
                </span>
                Weekly payment options
              </div>
              <div className="flex items-center gap-3 py-3 text-[15px] text-charcoal border-b border-cloud">
                <span className="w-6 h-6 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center shrink-0 text-accent text-sm">
                  &#10003;
                </span>
                No hidden membership fees
              </div>
              <div className="flex items-center gap-3 py-3 text-[15px] text-charcoal border-b border-cloud">
                <span className="w-6 h-6 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center shrink-0 text-accent text-sm">
                  &#10003;
                </span>
                Fast application process
              </div>
              <div className="flex items-center gap-3 py-3 text-[15px] text-charcoal">
                <span className="w-6 h-6 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center shrink-0 text-accent text-sm">
                  &#10003;
                </span>
                Transparent pricing
              </div>
            </div>

            <Link to={ROUTES.SEARCH} className="no-underline block">
              <Button variant="secondary" size="lg" fullWidth>
                Browse Rooms &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
