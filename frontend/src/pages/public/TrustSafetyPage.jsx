import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'
import { classNames } from '../../utils'

const SAFETY_FEATURES = [
  {
    icon: '🛡️',
    title: 'Host Verification',
    description:
      'Every host on RoomPilot undergoes thorough verification before listing properties:',
    items: [
      'Government-issued ID verification',
      'Stripe Connect KYC compliance',
      'Property ownership verification',
      'Contact information validation',
      'Criminal background screening available',
    ],
  },
  {
    icon: '🔍',
    title: 'Tenant Screening',
    description: 'Hosts can request comprehensive background checks and screening reports:',
    items: [
      'Criminal history reports',
      'Eviction history searches',
      'Employment verification',
      'Reference checks',
      'Identity verification',
    ],
  },
  {
    icon: '💳',
    title: 'Secure Payments',
    description:
      'All financial transactions are processed through Stripe, the industry leader in payment security:',
    items: [
      'Bank-level 256-bit SSL encryption',
      'PCI DSS Level 1 certified',
      'Fraud detection and prevention',
      'Never store payment info on our servers',
      'Automatic payment protection',
    ],
  },
  {
    icon: '💬',
    title: 'Communication Safety',
    description: 'Keep all conversations on-platform for your protection:',
    items: [
      'In-app secure messaging system',
      'No need to share personal contact info',
      'Complete message history archived',
      'Report suspicious behavior instantly',
      'AI-powered scam detection',
    ],
  },
  {
    icon: '⚖️',
    title: 'Dispute Resolution',
    description: 'Fair and transparent process for resolving conflicts:',
    items: [
      'Dedicated support team available 24/7',
      'Mediation services for disagreements',
      'Documentation of all agreements',
      'Security deposit protection',
      'Clear terms and policies',
    ],
  },
  {
    icon: '🏠',
    title: 'Property Standards',
    description: 'We ensure all listings meet basic safety and quality standards:',
    items: [
      'Photo verification required',
      'Accurate property descriptions',
      'Working smoke and CO detectors',
      'Safe living conditions',
      'Compliance with local housing laws',
    ],
  },
]

const FAQ_ITEMS = [
  {
    q: 'How do you verify hosts?',
    a: 'All hosts must verify their identity with a government-issued ID. We also verify property ownership through public records or mortgage/deed documentation. Additionally, hosts undergo Stripe Connect KYC verification, which includes background checks and fraud screening.',
  },
  {
    q: 'What if I encounter a scam or fraud?',
    a: 'Report it immediately through the "Report User" button in any conversation or listing. Our trust and safety team investigates all reports within 24 hours. Never send money outside the platform, share personal banking info, or wire transfer deposits. All legitimate payments go through RoomPilot\'s secure system.',
  },
  {
    q: 'Is my payment information safe?',
    a: 'Yes. We use Stripe for all payment processing, which is PCI DSS Level 1 certified (the highest security standard). Your credit card and bank details are never stored on RoomPilot servers. All payment data is encrypted in transit and at rest using bank-level 256-bit SSL encryption.',
  },
  {
    q: 'Can hosts see my personal information?',
    a: "Only information you choose to share in your profile is visible. Hosts cannot see your payment methods, social security number, or background check details unless you explicitly grant access. Your phone number and email are hidden until you're approved and accept a lease.",
  },
  {
    q: 'What happens if a host or renter violates policies?',
    a: 'Policy violations are taken seriously. Depending on severity, consequences range from warnings to permanent account suspension. Serious violations (fraud, discrimination, violence) result in immediate removal and potential legal action. We maintain a zero-tolerance policy for scams, harassment, and illegal activity.',
  },
  {
    q: 'How do background checks work?',
    a: "Background checks are optional and requested by hosts. If a host requests one, you'll receive a secure link to authorize the check. The report includes criminal history, eviction records, and identity verification. You control who sees your report, and it's valid for 30 days across multiple applications.",
  },
  {
    q: "What if there's a dispute about a security deposit?",
    a: 'Security deposits are held in escrow. When a lease ends, hosts have 14 days to claim deductions with photo evidence. Renters can dispute claims through our resolution center. Our mediation team reviews evidence from both parties and makes a fair determination based on the lease terms and local laws.',
  },
  {
    q: 'How do you prevent discrimination?',
    a: 'We strictly enforce Fair Housing laws. Hosts cannot discriminate based on race, color, religion, sex, national origin, familial status, or disability. Our platform monitors listings and communications for discriminatory language. Violations result in immediate listing removal and potential account termination.',
  },
]

function TrustSafetyPage() {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-[#1d4ed8] py-20 px-10 text-center text-white md:py-15 md:px-5">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mb-4">
          Your Safety is Our Priority
        </h1>
        <p className="text-lg opacity-90 max-w-[600px] mx-auto">
          We\'ve built multiple layers of protection to create a trusted community for hosts and
          renters.
        </p>
      </section>

      {/* Safety Features Section */}
      <section className="py-20 px-10 bg-white md:py-15 md:px-5">
        <div className="max-w-[1000px] mx-auto text-center mb-12">
          <h2 className="font-display text-[2rem] text-midnight mb-4">How We Keep You Safe</h2>
          <p className="text-lg text-slate">
            From verification to payments, we protect every step of your rental journey.
          </p>
        </div>
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {SAFETY_FEATURES.map((feature, index) => (
            <div key={index} className="bg-white border border-cloud rounded-lg p-6">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-display text-xl text-midnight mb-2">{feature.title}</h3>
              <p className="text-sm text-slate mb-4">{feature.description}</p>
              <ul className="text-sm text-slate space-y-2">
                {feature.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-20 px-10 bg-snow md:py-15 md:px-5">
        <div className="max-w-[800px] mx-auto text-center mb-12">
          <h2 className="font-display text-[2rem] text-midnight mb-4">Built on Trust</h2>
          <p className="text-lg text-slate">Industry-leading security and compliance standards</p>
        </div>
        <div className="max-w-[800px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-4xl mb-3">🔒</div>
            <h4 className="font-display text-lg text-midnight mb-1">SSL Encrypted</h4>
            <p className="text-sm text-slate">256-bit encryption for all data transmission</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-4xl mb-3">💎</div>
            <h4 className="font-display text-lg text-midnight mb-1">Stripe Verified</h4>
            <p className="text-sm text-slate">Powered by Stripe\'s secure payment infrastructure</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-4xl mb-3">✓</div>
            <h4 className="font-display text-lg text-midnight mb-1">GDPR Compliant</h4>
            <p className="text-sm text-slate">Your data privacy is protected</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-4xl mb-3">🏆</div>
            <h4 className="font-display text-lg text-midnight mb-1">Verified Reviews</h4>
            <p className="text-sm text-slate">Only real tenants can leave reviews</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-10 bg-white md:py-15 md:px-5">
        <div className="max-w-[800px] mx-auto text-center mb-12">
          <h2 className="font-display text-[2rem] text-midnight mb-4">Safety FAQ</h2>
          <p className="text-lg text-slate">Common questions about trust and safety on RoomPilot</p>
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
        <h2 className="font-display text-[2rem] mb-4">Questions About Safety?</h2>
        <p className="text-lg mb-8 opacity-90">Our trust and safety team is here to help 24/7.</p>
        <Link to={ROUTES.CONTACT} className="no-underline">
          <Button variant="white" size="lg">
            Contact Support
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default TrustSafetyPage
