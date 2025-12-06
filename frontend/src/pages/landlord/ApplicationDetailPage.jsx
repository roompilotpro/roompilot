import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button, Badge } from '../../components/primitives'
import './ApplicationDetailPage.css'

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
      <div className="application-detail-content">
        <Link to={ROUTES.LANDLORD.APPLICATIONS} className="back-link">
          ← Back to Applications
        </Link>

        <div className="application-detail-grid">
          {/* Main Column */}
          <div className="application-main-column">
            {/* Applicant Header */}
            <div className="card">
              <div className="applicant-header">
                <img
                  src={mockApplicationDetail.applicant.avatar}
                  alt={mockApplicationDetail.applicant.name}
                  className="applicant-avatar-large"
                />
                <div className="applicant-header-info">
                  <h1 className="applicant-name">{mockApplicationDetail.applicant.name}</h1>
                  <div className="contact-info">
                    <span className="contact-item">📞 {mockApplicationDetail.applicant.phone}</span>
                    <span className="contact-item">✉️ {mockApplicationDetail.applicant.email}</span>
                  </div>
                  <div className="verification-badges">
                    <Badge variant="success">✓ Email Verified</Badge>
                    <Badge variant="success">✓ Phone Verified</Badge>
                    <Badge variant="success">✓ ID Verified</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Summary */}
            <div className="card">
              <h2 className="card-title">Application Summary</h2>

              <div className="room-info">
                <img
                  src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop"
                  alt="Room"
                  className="room-thumbnail"
                />
                <div className="room-details">
                  <h4>
                    {mockApplicationDetail.property} - {mockApplicationDetail.room}
                  </h4>
                  <p>
                    {mockApplicationDetail.roomType} • {mockApplicationDetail.bathroom}
                  </p>
                  <p className="room-price">${mockApplicationDetail.rent}/month</p>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Move-in Date</span>
                  <span className="info-value">{mockApplicationDetail.moveInDate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Planned Stay</span>
                  <span className="info-value">{mockApplicationDetail.plannedStay}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Applied</span>
                  <span className="info-value">{mockApplicationDetail.appliedDate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Application ID</span>
                  <span className="info-value">{mockApplicationDetail.applicationId}</span>
                </div>
              </div>

              <div className="message-section">
                <h4 className="message-title">Message from Applicant</h4>
                <div className="message-from-applicant">{mockApplicationDetail.message}</div>
              </div>
            </div>

            {/* Background Check */}
            <div className="card">
              <div className="bg-check-header">
                <h2 className="card-title">Background Check</h2>
                <Badge variant="success">✓ Clear</Badge>
              </div>

              <div className="bg-check-summary">
                <div className="bg-check-item">
                  <div className="bg-check-item-label">Credit Score</div>
                  <div className="bg-check-item-value">
                    {mockApplicationDetail.backgroundCheck.creditScore}
                  </div>
                </div>
                <div className="bg-check-item">
                  <div className="bg-check-item-label">Criminal Record</div>
                  <div className="bg-check-item-value">
                    {mockApplicationDetail.backgroundCheck.criminalRecord}
                  </div>
                </div>
                <div className="bg-check-item">
                  <div className="bg-check-item-label">Eviction History</div>
                  <div className="bg-check-item-value">
                    {mockApplicationDetail.backgroundCheck.evictionHistory}
                  </div>
                </div>
              </div>

              <button className="link-button">View Full Background Report →</button>
            </div>

            {/* Applicant Profile */}
            <div className="card">
              <h2 className="card-title">Applicant Profile</h2>

              <div className="detail-section">
                <h3 className="section-heading">Employment Information</h3>
                <div className="detail-list">
                  <div className="detail-list-item">
                    <strong>Current Employer</strong>
                    <p>{mockApplicationDetail.employment.employer}</p>
                  </div>
                  <div className="detail-list-item">
                    <strong>Position</strong>
                    <p>{mockApplicationDetail.employment.position}</p>
                  </div>
                  <div className="detail-list-item">
                    <strong>Annual Income</strong>
                    <p>${mockApplicationDetail.employment.income.toLocaleString()}</p>
                  </div>
                  <div className="detail-list-item">
                    <strong>Employment Duration</strong>
                    <p>{mockApplicationDetail.employment.duration}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="section-heading">Rental History</h3>
                <div className="detail-list">
                  <div className="detail-list-item">
                    <strong>Previous Address</strong>
                    <p>{mockApplicationDetail.rentalHistory.address}</p>
                  </div>
                  <div className="detail-list-item">
                    <strong>Landlord</strong>
                    <p>{mockApplicationDetail.rentalHistory.landlord}</p>
                  </div>
                  <div className="detail-list-item">
                    <strong>Rental Period</strong>
                    <p>{mockApplicationDetail.rentalHistory.period}</p>
                  </div>
                  <div className="detail-list-item">
                    <strong>Reason for Leaving</strong>
                    <p>{mockApplicationDetail.rentalHistory.reason}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="section-heading">References</h3>
                <div className="detail-list">
                  {mockApplicationDetail.references.map((ref, index) => (
                    <div key={index} className="detail-list-item">
                      <strong>{ref.type} Reference</strong>
                      <p>
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
            <div className="card">
              <h2 className="card-title">Message Thread</h2>
              <div className="chat-section">
                {mockApplicationDetail.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-message ${msg.sender === 'applicant' ? 'from-applicant' : 'from-landlord'}`}
                  >
                    <div className="chat-message-header">
                      {msg.sender === 'applicant' && (
                        <>
                          <span className="chat-message-sender">{msg.name}</span>
                          <span className="chat-message-time">{msg.time}</span>
                        </>
                      )}
                      {msg.sender === 'landlord' && (
                        <>
                          <span className="chat-message-time">{msg.time}</span>
                          <span className="chat-message-sender">{msg.name}</span>
                        </>
                      )}
                    </div>
                    <div className="chat-message-bubble">{msg.text}</div>
                  </div>
                ))}
              </div>

              <div className="chat-input-area">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Button variant="primary">Send</Button>
              </div>
            </div>
          </div>

          {/* Decision Panel */}
          <aside className="decision-panel">
            <div className="card">
              <h3 className="card-title">Decision</h3>
              <Button variant="success" fullWidth onClick={() => setShowApprovalModal(true)}>
                ✓ Approve Application
              </Button>
              <Button variant="outline" fullWidth>
                Request More Info
              </Button>
              <div className="divider" />
              <Button
                variant="outline"
                fullWidth
                className="decline-btn"
                onClick={() => setShowDeclineReason(!showDeclineReason)}
              >
                Decline Application
              </Button>

              {showDeclineReason && (
                <div className="decline-reason">
                  <label className="form-label">Decline Reason</label>
                  <select
                    className="form-select"
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
                  <Button variant="danger" fullWidth className="confirm-decline-btn">
                    Confirm Decline
                  </Button>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && (
          <div className="modal" onClick={() => setShowApprovalModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Approve Application</h2>
              <div className="modal-body">
                <p>
                  You're about to approve {mockApplicationDetail.applicant.name}'s application for{' '}
                  {mockApplicationDetail.room} at {mockApplicationDetail.property}.
                </p>

                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Move-in Date</span>
                    <span className="info-value">{mockApplicationDetail.moveInDate}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Monthly Rent</span>
                    <span className="info-value">${mockApplicationDetail.rent}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Initial Term</span>
                    <span className="info-value">{mockApplicationDetail.plannedStay}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Security Deposit</span>
                    <span className="info-value">${mockApplicationDetail.rent}</span>
                  </div>
                </div>

                <p className="modal-note">
                  {mockApplicationDetail.applicant.name} will receive an email notification with the
                  lease agreement to review and sign digitally.
                </p>
              </div>
              <div className="modal-actions">
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
