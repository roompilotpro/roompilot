import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'
import { classNames } from '../../utils'

const FAQ_DATA = {
  'getting-started': {
    title: 'Getting Started',
    questions: [
      {
        q: 'What is RoomPilot?',
        a: 'RoomPilot is a rental platform that connects hosts with people looking for affordable rooms. We offer flexible weekly rent payments, low upfront costs, and automated property management tools.',
      },
      {
        q: 'How is RoomPilot different from other rental platforms?',
        a: "We charge significantly lower fees (2% vs 12%+ competitors), offer weekly rent collection, don't require credit checks, and give hosts full control over who lives in their property.",
      },
      {
        q: 'How do I create an account?',
        a: "Click 'Sign Up' in the top right corner, enter your email and create a password. You'll need to verify your email address. For hosts, you'll also need to verify your identity and connect a Stripe account.",
      },
    ],
  },
  hosts: {
    title: 'For Hosts',
    questions: [
      {
        q: 'How much does it cost to list my property?',
        a: 'Listing is completely free. You only pay when you start earning rent. Choose between our Transaction Fee Plan (2% per payment) or Flat Rate Plan ($15/room/month).',
      },
      {
        q: 'Do I have to accept every applicant?',
        a: 'No! You have complete control over who lives in your property. Review applications, request background checks, and approve or decline based on your criteria.',
      },
      {
        q: 'When do I get paid?',
        a: 'You can choose daily or weekly payouts through Stripe Connect. Funds are typically deposited 1-2 business days after rent is collected.',
      },
      {
        q: "What if a tenant doesn't pay rent?",
        a: "Rent is automatically charged to the tenant's payment method. If payment fails, automatic retries occur and late fees are applied per your settings.",
      },
    ],
  },
  renters: {
    title: 'For Renters',
    questions: [
      {
        q: 'Do I need good credit to rent?',
        a: "No! RoomPilot doesn't require credit checks. We believe everyone deserves access to safe, affordable housing regardless of their credit history.",
      },
      {
        q: 'How much does it cost to move in?',
        a: "Typically just your first week's rent. Some hosts may require a small security deposit ($100-$300), but there are no application fees or membership fees.",
      },
      {
        q: 'Can I pay rent weekly instead of monthly?',
        a: "Yes! If the listing offers weekly payments, you can choose to pay weekly. This helps budget rent if you're paid weekly or bi-weekly.",
      },
    ],
  },
  payments: {
    title: 'Payments',
    questions: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept all major credit cards and ACH bank transfers through Stripe. ACH transfers are free, while card payments have a small processing fee.',
      },
      {
        q: 'Is it safe to pay through RoomPilot?',
        a: 'Yes! All payments are processed through Stripe with bank-level 256-bit SSL encryption. We never store your payment information on our servers.',
      },
      {
        q: 'How do security deposits work?',
        a: 'Security deposits are held in escrow. When you move out, the host has 14 days to claim deductions with evidence. Otherwise, the full deposit is returned.',
      },
    ],
  },
}

function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [openItems, setOpenItems] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const categories = Object.keys(FAQ_DATA)

  const filteredData = Object.entries(FAQ_DATA).reduce((acc, [key, category]) => {
    if (activeCategory !== 'all' && activeCategory !== key) return acc

    const filteredQuestions = category.questions.filter((item) => {
      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      return item.q.toLowerCase().includes(term) || item.a.toLowerCase().includes(term)
    })

    if (filteredQuestions.length > 0) {
      acc[key] = { ...category, questions: filteredQuestions }
    }
    return acc
  }, {})

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-bg to-white py-20 px-10 text-center md:px-5 md:py-15">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-midnight mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-slate mb-8">Find answers to common questions about RoomPilot</p>
        <div className="max-w-[600px] mx-auto relative">
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-4 pr-12 pl-5 border-2 border-cloud rounded-md text-base font-body focus:outline-none focus:border-primary"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate">&#128269;</span>
        </div>
      </section>

      <section className="py-15 px-10 md:px-5">
        <div className="max-w-[900px] mx-auto">
          <div className="flex gap-4 mb-12 flex-wrap justify-center border-b-2 border-cloud pb-0 md:gap-2">
            <button
              className={classNames(
                'py-3 px-6 bg-transparent border-none font-body text-base font-semibold text-slate cursor-pointer border-b-[3px] border-transparent -mb-0.5 transition-colors hover:text-primary md:py-2 md:px-4 md:text-sm',
                activeCategory === 'all' && 'text-primary border-b-primary'
              )}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={classNames(
                  'py-3 px-6 bg-transparent border-none font-body text-base font-semibold text-slate cursor-pointer border-b-[3px] border-transparent -mb-0.5 transition-colors hover:text-primary md:py-2 md:px-4 md:text-sm',
                  activeCategory === cat && 'text-primary border-b-primary'
                )}
                onClick={() => setActiveCategory(cat)}
              >
                {FAQ_DATA[cat].title}
              </button>
            ))}
          </div>

          {Object.entries(filteredData).map(([key, category]) => (
            <div key={key} className="mb-12">
              <h2 className="font-display text-[2rem] text-midnight mb-6 pb-3 border-b-2 border-cloud">{category.title}</h2>
              {category.questions.map((item, idx) => {
                const itemKey = `${key}-${idx}`
                return (
                  <div key={itemKey} className="bg-white border border-cloud rounded-sm mb-4 overflow-hidden">
                    <button
                      className="w-full p-5 bg-transparent border-none text-left font-body text-lg font-semibold text-midnight cursor-pointer flex justify-between items-center hover:bg-snow"
                      onClick={() => toggleItem(itemKey)}
                    >
                      {item.q}
                      <span className={classNames('transition-transform duration-300 shrink-0 ml-4', openItems[itemKey] && 'rotate-180')}>&#9660;</span>
                    </button>
                    <div
                      className="overflow-hidden transition-[max-height] duration-300"
                      style={{ maxHeight: openItems[itemKey] ? '500px' : '0' }}
                    >
                      <div className="px-5 pb-5 text-slate leading-relaxed">{item.a}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-snow py-20 px-10 text-center md:px-5 md:py-15">
        <h2 className="font-display text-[2rem] text-midnight mb-4">Still Have Questions?</h2>
        <p className="text-lg text-slate mb-8">Our support team is here to help 24/7</p>
        <Link to={ROUTES.CONTACT} className="no-underline">
          <Button variant="primary" size="lg">
            Contact Support
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default FAQPage
