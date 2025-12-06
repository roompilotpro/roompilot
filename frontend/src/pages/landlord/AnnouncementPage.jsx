import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import './AnnouncementPage.css'

function AnnouncementPage() {
  const navigate = useNavigate()
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [recipientType, setRecipientType] = useState('all')
  const [selectedProperty, setSelectedProperty] = useState('sunset')
  const [selectedRooms, setSelectedRooms] = useState([])
  const [subject, setSubject] = useState('')
  const [messageBody, setMessageBody] = useState('')
  const [showSchedule, setShowSchedule] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const templates = {
    rent: {
      subject: 'Rent Payment Reminder',
      body: 'Dear Tenants,\n\nThis is a friendly reminder that rent for the upcoming month is due on the 1st. Please ensure your payment is submitted on time to avoid any late fees.\n\nThank you for your cooperation!',
    },
    rules: {
      subject: 'House Rules Reminder',
      body: 'Dear Tenants,\n\nAs a reminder, please keep noise levels down after 10 PM and ensure common areas are kept clean. We appreciate your cooperation in maintaining a pleasant living environment for everyone.',
    },
    maintenance: {
      subject: 'Scheduled Maintenance Notice',
      body: 'Dear Tenants,\n\nWe will be conducting scheduled maintenance on [DATE] from [TIME] to [TIME]. Please plan accordingly. We apologize for any inconvenience this may cause.',
    },
    general: {
      subject: '',
      body: '',
    },
  }

  const handleTemplateSelect = (templateKey) => {
    const template = templates[templateKey]
    setSubject(template.subject)
    setMessageBody(template.body)
  }

  const handleRoomToggle = (roomId) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    )
  }

  const getRecipientCount = () => {
    if (recipientType === 'all') return 24
    if (recipientType === 'property') return 8
    return selectedRooms.length
  }

  const handleSendClick = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmSend = () => {
    setShowConfirmModal(false)
    navigate('/landlord/messages')
  }

  return (
    <AppShell sidebar={{ links: navLinks, user, logoBadge }}>
      <div className="announcement-page">
        <div className="announcement-header">
          <h1 className="announcement-header-title">Send Announcement</h1>
          <p className="announcement-header-subtitle">Communicate with your tenants effectively</p>
        </div>

        <div className="announcement-layout">
          {/* Form */}
          <div className="announcement-form">
            {/* Recipients */}
            <div className="form-section">
              <h2 className="form-section-title">Recipients</h2>
              <div className="radio-group">
                <label
                  className={`radio-option ${recipientType === 'all' ? 'selected' : ''}`}
                  onClick={() => setRecipientType('all')}
                >
                  <input
                    type="radio"
                    name="recipients"
                    value="all"
                    checked={recipientType === 'all'}
                    onChange={() => setRecipientType('all')}
                  />
                  <div className="radio-label">
                    <div className="radio-label-title">All Tenants</div>
                    <div className="radio-label-desc">Send to everyone across all properties</div>
                  </div>
                </label>
                <label
                  className={`radio-option ${recipientType === 'property' ? 'selected' : ''}`}
                  onClick={() => setRecipientType('property')}
                >
                  <input
                    type="radio"
                    name="recipients"
                    value="property"
                    checked={recipientType === 'property'}
                    onChange={() => setRecipientType('property')}
                  />
                  <div className="radio-label">
                    <div className="radio-label-title">Specific Property</div>
                    <div className="radio-label-desc">Send to all tenants in one property</div>
                  </div>
                </label>
                <label
                  className={`radio-option ${recipientType === 'rooms' ? 'selected' : ''}`}
                  onClick={() => setRecipientType('rooms')}
                >
                  <input
                    type="radio"
                    name="recipients"
                    value="rooms"
                    checked={recipientType === 'rooms'}
                    onChange={() => setRecipientType('rooms')}
                  />
                  <div className="radio-label">
                    <div className="radio-label-title">Specific Rooms</div>
                    <div className="radio-label-desc">Select individual rooms or tenants</div>
                  </div>
                </label>
              </div>

              {recipientType === 'property' && (
                <div className="conditional-field show">
                  <label className="form-label">Select Property</label>
                  <select
                    className="form-select"
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                  >
                    <option value="sunset">Sunset Villa</option>
                    <option value="oak">Oak Street Apartments</option>
                    <option value="downtown">Downtown Loft</option>
                  </select>
                </div>
              )}

              {recipientType === 'rooms' && (
                <div className="conditional-field show">
                  <label className="form-label">Select Rooms</label>
                  <div className="checkbox-group">
                    {[
                      { id: 'room1', label: 'Sunset Villa - Room 1A (Sarah Martinez)' },
                      { id: 'room2', label: 'Sunset Villa - Room 1B (Marcus Rodriguez)' },
                      { id: 'room3', label: 'Sunset Villa - Room 3A (Emily Chen)' },
                      { id: 'room4', label: 'Oak Street - Room 2B (James Parker)' },
                      { id: 'room5', label: 'Oak Street - Room 4C (Lisa Johnson)' },
                    ].map((room) => (
                      <label key={room.id} className="checkbox-option">
                        <input
                          type="checkbox"
                          value={room.id}
                          checked={selectedRooms.includes(room.id)}
                          onChange={() => handleRoomToggle(room.id)}
                        />
                        <span>{room.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <span className="recipient-count">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{getRecipientCount()} recipients</span>
              </span>
            </div>

            {/* Templates */}
            <div className="form-section">
              <h2 className="form-section-title">Message Templates</h2>
              <div className="template-grid">
                {[
                  { key: 'rent', title: 'Rent Reminder', desc: 'Monthly payment due date' },
                  { key: 'rules', title: 'Rule Reminder', desc: 'House rules and policies' },
                  {
                    key: 'maintenance',
                    title: 'Maintenance Notice',
                    desc: 'Scheduled repairs or updates',
                  },
                  { key: 'general', title: 'General Announcement', desc: 'Custom message' },
                ].map((template) => (
                  <div
                    key={template.key}
                    className="template-card"
                    onClick={() => handleTemplateSelect(template.key)}
                  >
                    <div className="template-title">{template.title}</div>
                    <div className="template-desc">{template.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Composer */}
            <div className="form-section">
              <h2 className="form-section-title">Message</h2>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter announcement subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Message Body</label>
                <textarea
                  className="form-textarea"
                  placeholder="Type your announcement here..."
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Attachments */}
            <div className="form-section">
              <h2 className="form-section-title">Attachments</h2>
              <div className="attachment-upload">
                <svg
                  className="attachment-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div className="attachment-text">Click to upload files or drag and drop</div>
              </div>
            </div>

            {/* Send Options */}
            <div className="form-section">
              <h2 className="form-section-title">Send Options</h2>
              <div className="send-options">
                <button className="btn btn-primary" onClick={handleSendClick}>
                  Send Now
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowSchedule(!showSchedule)}
                >
                  Schedule for Later
                </button>
              </div>
              {showSchedule && (
                <div className="datetime-picker show">
                  <div>
                    <label className="form-label">Date</label>
                    <input type="date" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Time</label>
                    <input type="time" className="form-input" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="preview-panel">
            <h3 className="preview-title">Preview</h3>
            <div className="preview-card">
              {subject || messageBody ? (
                <div>
                  <div className="preview-header">
                    <div className="preview-icon">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="preview-from">RoomPilot Announcement</div>
                      <div className="preview-to">To: Selected Recipients</div>
                    </div>
                  </div>
                  {subject && <div className="preview-subject">{subject}</div>}
                  {messageBody && (
                    <div className="preview-body">
                      {messageBody.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="preview-placeholder">
                  Your announcement preview will appear here as you type
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="modal show" onClick={() => setShowConfirmModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Confirm Send</h2>
              <div className="modal-body">
                <p>
                  Are you sure you want to send this announcement to{' '}
                  <strong>{getRecipientCount()} recipients</strong>?
                </p>
                <p style={{ marginTop: '12px', color: 'var(--color-mist)' }}>
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleConfirmSend}>
                  Send Announcement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default AnnouncementPage
