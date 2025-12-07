import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button, Badge } from '../../components/primitives'
import { classNames } from '../../utils'

// Mock application detail data
const mockApplicationDetail = {
  id: 'a1',
  applicant: {
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '(555) 123-4567',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  property: 'Sunset Gardens',
  room: 'Room 2A',
  roomType: 'Private room',
  bathroom: 'Shared bathroom',
  rent: 850,
  appliedDate: '2 days ago',
  moveInDate: 'January 15, 2026',
  plannedStay: '6 months',
  applicationId: '#APP-2847',
  message:
    "Hi! I'm a software engineer relocating to the area for work. I'm a clean, quiet tenant who values a peaceful living environment. I work from home 3 days a week and enjoy cooking and reading in my free time. Looking forward to potentially joining your community!",
  backgroundCheck: {
    status: 'clear',
    creditScore: 742,
    criminalRecord: 'Clear',
    evictionHistory: 'None',
  },
  employment: {
    employer: 'TechCorp Solutions',
    position: 'Senior Software Engineer',
    income: 95000,
    duration: '3 years 2 months',
  },
  rentalHistory: {
    address: '456 Oak Avenue, Apartment 12B, Seattle, WA 98101',
    landlord: 'Pine Street Properties - (555) 987-6543',
    period: 'January 2022 - December 2025 (4 years)',
    reason: 'Job relocation',
  },
  references: [
    {
      type: 'Professional',
      name: 'Michael Torres',
      title: 'Manager at TechCorp Solutions',
      email: 'michael.torres@techcorp.com',
      phone: '(555) 234-5678',
    },
    {
      type: 'Personal',
      name: 'Jennifer Kim',
      title: 'Friend',
      email: 'jennifer.kim@email.com',
      phone: '(555) 345-6789',
    },
  ],
  messages: [
    {
      id: 'm1',
      sender: 'applicant',
      name: 'Sarah Chen',
      text: "Hi! I just submitted my application for Room 2A. I'm very interested in this property and would love to schedule a viewing if possible. I'm available most afternoons this week.",
      time: '2 days ago',
    },
    {
      id: 'm2',
      sender: 'landlord',
      name: 'You',
      text: "Thanks for your interest, Sarah! I'd be happy to arrange a viewing. How does Thursday at 3pm work for you?",
      time: '1 day ago',
    },
    {
      id: 'm3',
      sender: 'applicant',
      name: 'Sarah Chen',
      text: "Perfect! Thursday at 3pm works great. I'll see you then. Should I bring anything specific?",
      time: '1 day ago',
    },
  ],
}

function ApplicationDetailPage() {
  useNavigate() // Hook required for future navigation
  useParams() // Hook required for future id usage
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showDeclineReason, setShowDeclineReason] = useState(false)
  const [declineReason, setDeclineReason] = useState('')
  const [messageText, setMessageText] = useState('')

  return (
    <AppShell sidebar={{ links: navLinks, user, logoBadge }}>
      <div>
        <Link
          to={ROUTES.LANDLORD.APPLICATIONS}
          className="inline-flex items-center gap-1.5 text-primary no-underline font-medium mb-6 transition-[gap] duration-200 hover:gap-2.5"
        >
          ← Back to Applications
        </Link>

        <div className="grid grid-cols-[1fr_360px] lg:grid-cols-1 gap-6">
          {/* Main Column */}
          <div className="flex flex-col gap-6">
            {/* Applicant Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex gap-5 items-start">
                <img
                  src={mockApplicationDetail.applicant.avatar}
                  alt={mockApplicationDetail.applicant.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h1 className="font-display text-[28px] font-bold mb-2 text-midnight">
                    {mockApplicationDetail.applicant.name}
                  </h1>
                  <div className="flex gap-6 mb-3">
                    <span className="flex items-center gap-1.5 text-slate text-sm">
                      📞 {mockApplicationDetail.applicant.phone}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate text-sm">
                      ✉️ {mockApplicationDetail.applicant.email}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="success">✓ Email Verified</Badge>
                    <Badge variant="success">✓ Phone Verified</Badge>
                    <Badge variant="success">✓ ID Verified</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold mb-5 text-midnight">
                Application Summary
              </h2>

              <div className="flex gap-4 items-start p-4 bg-snow rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop"
                  alt="Room"
                  className="w-[100px] h-20 rounded-md object-cover"
                />
                <div>
                  <h4 className="font-semibold mb-1 text-midnight">
                    {mockApplicationDetail.property} - {mockApplicationDetail.room}
                  </h4>
                  <p className="text-sm text-slate">
                    {mockApplicationDetail.roomType} • {mockApplicationDetail.bathroom}
                  </p>
                  <p className="mt-1 font-semibold text-midnight">
                    ${mockApplicationDetail.rent}/month
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                    Move-in Date
                  </span>
                  <span className="font-medium text-midnight">
                    {mockApplicationDetail.moveInDate}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                    Planned Stay
                  </span>
                  <span className="font-medium text-midnight">
                    {mockApplicationDetail.plannedStay}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                    Applied
                  </span>
                  <span className="font-medium text-midnight">
                    {mockApplicationDetail.appliedDate}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                    Application ID
                  </span>
                  <span className="font-medium text-midnight">
                    {mockApplicationDetail.applicationId}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <h4 className="mb-2 font-semibold text-midnight">Message from Applicant</h4>
                <div className="p-4 bg-snow rounded-lg border-l-4 border-primary text-sm leading-relaxed text-slate">
                  {mockApplicationDetail.message}
                </div>
              </div>
            </div>

            {/* Background Check */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display text-xl font-bold text-midnight">Background Check</h2>
                <Badge variant="success">✓ Clear</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center p-3 bg-snow rounded-lg">
                  <div className="text-xs text-slate mb-1">Credit Score</div>
                  <div className="font-semibold text-midnight">
                    {mockApplicationDetail.backgroundCheck.creditScore}
                  </div>
                </div>
                <div className="text-center p-3 bg-snow rounded-lg">
                  <div className="text-xs text-slate mb-1">Criminal Record</div>
                  <div className="font-semibold text-midnight">
                    {mockApplicationDetail.backgroundCheck.criminalRecord}
                  </div>
                </div>
                <div className="text-center p-3 bg-snow rounded-lg">
                  <div className="text-xs text-slate mb-1">Eviction History</div>
                  <div className="font-semibold text-midnight">
                    {mockApplicationDetail.backgroundCheck.evictionHistory}
                  </div>
                </div>
              </div>

              <button className="bg-transparent border-none text-primary font-medium cursor-pointer p-0 text-sm font-body hover:underline">
                View Full Background Report →
              </button>
            </div>

            {/* Applicant Profile */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold mb-5 text-midnight">
                Applicant Profile
              </h2>

              <div className="mb-5 last:mb-0">
                <h3 className="font-semibold mb-3 text-midnight">Employment Information</h3>
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-snow rounded-md">
                    <strong className="block mb-1 text-midnight">Current Employer</strong>
                    <p className="text-sm text-slate m-0">
                      {mockApplicationDetail.employment.employer}
                    </p>
                  </div>
                  <div className="p-3 bg-snow rounded-md">
                    <strong className="block mb-1 text-midnight">Position</strong>
                    <p className="text-sm text-slate m-0">
                      {mockApplicationDetail.employment.position}
                    </p>
                  </div>
                  <div className="p-3 bg-snow rounded-md">
                    <strong className="block mb-1 text-midnight">Annual Income</strong>
                    <p className="text-sm text-slate m-0">
                      ${mockApplicationDetail.employment.income.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-snow rounded-md">
                    <strong className="block mb-1 text-midnight">Employment Duration</strong>
                    <p className="text-sm text-slate m-0">
                      {mockApplicationDetail.employment.duration}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-5 last:mb-0">
                <h3 className="font-semibold mb-3 text-midnight">Rental History</h3>
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-snow rounded-md">
                    <strong className="block mb-1 text-midnight">Previous Address</strong>
                    <p className="text-sm text-slate m-0">
                      {mockApplicationDetail.rentalHistory.address}
                    </p>
                  </div>
                  <div className="p-3 bg-snow rounded-md">
                    <strong className="block mb-1 text-midnight">Landlord</strong>
                    <p className="text-sm text-slate m-0">
                      {mockApplicationDetail.rentalHistory.landlord}
                    </p>
                  </div>
                  <div className="p-3 bg-snow rounded-md">
                    <strong className="block mb-1 text-midnight">Rental Period</strong>
                    <p className="text-sm text-slate m-0">
                      {mockApplicationDetail.rentalHistory.period}
                    </p>
                  </div>
                  <div className="p-3 bg-snow rounded-md">
                    <strong className="block mb-1 text-midnight">Reason for Leaving</strong>
                    <p className="text-sm text-slate m-0">
                      {mockApplicationDetail.rentalHistory.reason}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-5 last:mb-0">
                <h3 className="font-semibold mb-3 text-midnight">References</h3>
                <div className="flex flex-col gap-3">
                  {mockApplicationDetail.references.map((ref, index) => (
                    <div key={index} className="p-3 bg-snow rounded-md">
                      <strong className="block mb-1 text-midnight">{ref.type} Reference</strong>
                      <p className="text-sm text-slate m-0">
                        {ref.name}, {ref.title}
                        <br />
                        {ref.email} • {ref.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold mb-5 text-midnight">Message Thread</h2>
              <div className="max-h-[400px] overflow-y-auto">
                {mockApplicationDetail.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={classNames(
                      'mb-4 flex flex-col gap-1.5',
                      msg.sender === 'landlord' && 'items-end'
                    )}
                  >
                    <div className="flex items-center gap-2 text-[13px]">
                      {msg.sender === 'applicant' && (
                        <>
                          <span className="font-semibold text-midnight">{msg.name}</span>
                          <span className="text-slate">{msg.time}</span>
                        </>
                      )}
                      {msg.sender === 'landlord' && (
                        <>
                          <span className="text-slate">{msg.time}</span>
                          <span className="font-semibold text-midnight">{msg.name}</span>
                        </>
                      )}
                    </div>
                    <div
                      className={classNames(
                        'py-3 px-4 rounded-xl max-w-[80%] text-sm leading-relaxed',
                        msg.sender === 'applicant'
                          ? 'bg-snow text-midnight'
                          : 'bg-primary text-white'
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  className="flex-1 py-3 px-4 border border-cloud rounded-lg font-body text-sm focus:outline-none focus:border-primary"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Button variant="primary">Send</Button>
              </div>
            </div>
          </div>

          {/* Decision Panel */}
          <aside className="sticky top-8 flex flex-col gap-4 self-start lg:static">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-display text-xl font-bold mb-5 text-midnight">Decision</h3>
              <Button variant="success" fullWidth onClick={() => setShowApprovalModal(true)}>
                ✓ Approve Application
              </Button>
              <Button variant="outline" fullWidth>
                Request More Info
              </Button>
              <div className="h-px bg-cloud my-3" />
              <Button
                variant="outline"
                fullWidth
                className="text-coral border-coral hover:bg-coral-bg"
                onClick={() => setShowDeclineReason(!showDeclineReason)}
              >
                Decline Application
              </Button>

              {showDeclineReason && (
                <div className="mt-3">
                  <label className="block font-semibold text-midnight mb-2 text-sm">
                    Decline Reason
                  </label>
                  <select
                    className="w-full py-3 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white mb-3 focus:outline-none focus:border-primary"
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                  >
                    <option value="">Select a reason...</option>
                    <option value="incomplete">Incomplete application</option>
                    <option value="income">Insufficient income</option>
                    <option value="background">Background check concerns</option>
                    <option value="unavailable">Room no longer available</option>
                    <option value="other">Other</option>
                  </select>
                  <Button variant="danger" fullWidth>
                    Confirm Decline
                  </Button>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
            onClick={() => setShowApprovalModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-[500px] w-[90%]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-display text-2xl font-bold mb-4">Approve Application</h2>
              <div className="mb-6">
                <p className="text-slate leading-relaxed mb-4">
                  You're about to approve {mockApplicationDetail.applicant.name}'s application for{' '}
                  {mockApplicationDetail.room} at {mockApplicationDetail.property}.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                      Move-in Date
                    </span>
                    <span className="font-medium text-midnight">
                      {mockApplicationDetail.moveInDate}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                      Monthly Rent
                    </span>
                    <span className="font-medium text-midnight">${mockApplicationDetail.rent}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                      Initial Term
                    </span>
                    <span className="font-medium text-midnight">
                      {mockApplicationDetail.plannedStay}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                      Security Deposit
                    </span>
                    <span className="font-medium text-midnight">${mockApplicationDetail.rent}</span>
                  </div>
                </div>

                <p className="text-sm text-slate mt-4">
                  {mockApplicationDetail.applicant.name} will receive an email notification with the
                  lease agreement to review and sign digitally.
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
                  Cancel
                </Button>
                <Button variant="success">Confirm & Send Lease</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default ApplicationDetailPage
