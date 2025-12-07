import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { classNames } from '../../utils'

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
      <div className="max-w-[1400px]">
        <div className="mb-8">
          <h1 className="font-display text-[32px] font-bold text-midnight mb-2">
            Send Announcement
          </h1>
          <p className="text-slate text-base">Communicate with your tenants effectively</p>
        </div>

        <div className="grid grid-cols-[1fr_400px] lg:grid-cols-1 gap-8">
          {/* Form */}
          <div className="bg-white rounded-xl p-8">
            {/* Recipients */}
            <div className="mb-8">
              <h2 className="font-bold text-lg text-midnight mb-4">Recipients</h2>
              <div className="flex flex-col gap-3">
                <label
                  className={classNames(
                    'flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all duration-200',
                    recipientType === 'all'
                      ? 'border-primary bg-primary-bg'
                      : 'border-cloud hover:border-primary-light hover:bg-primary-bg'
                  )}
                  onClick={() => setRecipientType('all')}
                >
                  <input
                    type="radio"
                    name="recipients"
                    value="all"
                    checked={recipientType === 'all'}
                    onChange={() => setRecipientType('all')}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-midnight">All Tenants</div>
                    <div className="text-sm text-slate">Send to everyone across all properties</div>
                  </div>
                </label>
                <label
                  className={classNames(
                    'flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all duration-200',
                    recipientType === 'property'
                      ? 'border-primary bg-primary-bg'
                      : 'border-cloud hover:border-primary-light hover:bg-primary-bg'
                  )}
                  onClick={() => setRecipientType('property')}
                >
                  <input
                    type="radio"
                    name="recipients"
                    value="property"
                    checked={recipientType === 'property'}
                    onChange={() => setRecipientType('property')}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-midnight">Specific Property</div>
                    <div className="text-sm text-slate">Send to all tenants in one property</div>
                  </div>
                </label>
                <label
                  className={classNames(
                    'flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all duration-200',
                    recipientType === 'rooms'
                      ? 'border-primary bg-primary-bg'
                      : 'border-cloud hover:border-primary-light hover:bg-primary-bg'
                  )}
                  onClick={() => setRecipientType('rooms')}
                >
                  <input
                    type="radio"
                    name="recipients"
                    value="rooms"
                    checked={recipientType === 'rooms'}
                    onChange={() => setRecipientType('rooms')}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-midnight">Specific Rooms</div>
                    <div className="text-sm text-slate">Select individual rooms or tenants</div>
                  </div>
                </label>
              </div>

              {recipientType === 'property' && (
                <div className="mt-4 p-4 bg-snow rounded-lg">
                  <label className="block font-semibold text-midnight mb-2">Select Property</label>
                  <select
                    className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm transition-colors duration-200 focus:outline-none focus:border-primary"
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
                <div className="mt-4 p-4 bg-snow rounded-lg">
                  <label className="block font-semibold text-midnight mb-2">Select Rooms</label>
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto p-3 bg-white border border-cloud rounded-lg">
                    {[
                      { id: 'room1', label: 'Sunset Villa - Room 1A (Sarah Martinez)' },
                      { id: 'room2', label: 'Sunset Villa - Room 1B (Marcus Rodriguez)' },
                      { id: 'room3', label: 'Sunset Villa - Room 3A (Emily Chen)' },
                      { id: 'room4', label: 'Oak Street - Room 2B (James Parker)' },
                      { id: 'room5', label: 'Oak Street - Room 4C (Lisa Johnson)' },
                    ].map((room) => (
                      <label key={room.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={room.id}
                          checked={selectedRooms.includes(room.id)}
                          onChange={() => handleRoomToggle(room.id)}
                          className="w-[18px] h-[18px] cursor-pointer"
                        />
                        <span>{room.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <span className="inline-flex items-center gap-2 py-2 px-4 bg-accent-bg text-accent rounded-md font-semibold text-sm mt-2">
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
            <div className="mb-8">
              <h2 className="font-bold text-lg text-midnight mb-4">Message Templates</h2>
              <div className="grid grid-cols-2 gap-3">
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
                    className="p-4 border-2 border-cloud rounded-lg cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary-bg"
                    onClick={() => handleTemplateSelect(template.key)}
                  >
                    <div className="font-semibold text-midnight mb-1">{template.title}</div>
                    <div className="text-[13px] text-slate">{template.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Composer */}
            <div className="mb-8">
              <h2 className="font-bold text-lg text-midnight mb-4">Message</h2>
              <div className="mb-4">
                <label className="block font-semibold text-midnight mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm transition-colors duration-200 focus:outline-none focus:border-primary"
                  placeholder="Enter announcement subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-semibold text-midnight mb-2">Message Body</label>
                <textarea
                  className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm min-h-[200px] resize-y transition-colors duration-200 focus:outline-none focus:border-primary"
                  placeholder="Type your announcement here..."
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Attachments */}
            <div className="mb-8">
              <h2 className="font-bold text-lg text-midnight mb-4">Attachments</h2>
              <div className="border-2 border-dashed border-cloud rounded-lg p-6 text-center cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary-bg">
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-50"
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
                <div className="text-slate text-sm">Click to upload files or drag and drop</div>
              </div>
            </div>

            {/* Send Options */}
            <div>
              <h2 className="font-bold text-lg text-midnight mb-4">Send Options</h2>
              <div className="flex gap-3">
                <button
                  className="py-3.5 px-7 rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 border-none font-body bg-primary text-white hover:bg-primary-dark"
                  onClick={handleSendClick}
                >
                  Send Now
                </button>
                <button
                  className="py-3.5 px-7 rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 font-body bg-white text-primary border-2 border-primary hover:bg-primary-bg"
                  onClick={() => setShowSchedule(!showSchedule)}
                >
                  Schedule for Later
                </button>
              </div>
              {showSchedule && (
                <div className="grid grid-cols-2 gap-3 mt-3 p-4 bg-snow rounded-lg">
                  <div>
                    <label className="block font-semibold text-midnight mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-midnight mb-2">Time</label>
                    <input
                      type="time"
                      className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-xl p-8 sticky top-8 h-fit lg:static">
            <h3 className="font-bold text-lg text-midnight mb-4">Preview</h3>
            <div className="border border-cloud rounded-lg p-5 bg-snow">
              {subject || messageBody ? (
                <div>
                  <div className="flex items-center gap-3 pb-4 border-b border-cloud mb-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
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
                      <div className="font-semibold text-midnight">RoomPilot Announcement</div>
                      <div className="text-[13px] text-slate">To: Selected Recipients</div>
                    </div>
                  </div>
                  {subject && <div className="font-bold text-lg text-midnight mb-3">{subject}</div>}
                  {messageBody && (
                    <div className="text-slate leading-relaxed">
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
                <div className="text-slate italic text-center py-10 px-5">
                  Your announcement preview will appear here as you type
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
            onClick={() => setShowConfirmModal(false)}
          >
            <div
              className="bg-white rounded-xl p-8 max-w-[500px] w-[90%]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-display text-2xl font-bold text-midnight mb-4">Confirm Send</h2>
              <div className="text-slate mb-6">
                <p>
                  Are you sure you want to send this announcement to{' '}
                  <strong>{getRecipientCount()} recipients</strong>?
                </p>
                <p className="mt-3 text-slate">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  className="py-3.5 px-7 rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 font-body bg-white text-primary border-2 border-primary hover:bg-primary-bg"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="py-3.5 px-7 rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 border-none font-body bg-primary text-white hover:bg-primary-dark"
                  onClick={handleConfirmSend}
                >
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
