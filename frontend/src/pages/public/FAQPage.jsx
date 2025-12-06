import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'
import './FAQPage.css'

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
    <div className="faq-page">
      <section className="faq-hero">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about RoomPilot</p>
        <div className="faq-search">
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">&#128269;</span>
        </div>
      </section>

      <section className="faq-content">
        <div className="faq-container">
          <div className="faq-tabs">
            <button
              className={`faq-tab ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`faq-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {FAQ_DATA[cat].title}
              </button>
            ))}
          </div>

          {Object.entries(filteredData).map(([key, category]) => (
            <div key={key} className="faq-category">
              <h2 className="faq-category-title">{category.title}</h2>
              {category.questions.map((item, idx) => {
                const itemKey = `${key}-${idx}`
                return (
                  <div key={itemKey} className={`faq-item ${openItems[itemKey] ? 'active' : ''}`}>
                    <button className="faq-question" onClick={() => toggleItem(itemKey)}>
                      {item.q}
                      <span className="faq-icon">&#9660;</span>
                    </button>
                    <div
                      className="faq-answer"
                      style={{ maxHeight: openItems[itemKey] ? '500px' : '0' }}
                    >
                      <div className="faq-answer-content">{item.a}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="faq-cta">
        <h2>Still Have Questions?</h2>
        <p>Our support team is here to help 24/7</p>
        <Link to={ROUTES.CONTACT}>
          <Button variant="primary" size="lg">
            Contact Support
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default FAQPage
