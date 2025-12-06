import { useState } from 'react'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button } from '../../components/primitives'
import './SettingsPage.css'

function SettingsPage() {
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [show2FA, setShow2FA] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [showCloseAccountModal, setShowCloseAccountModal] = useState(false)

  const [notificationSettings, setNotificationSettings] = useState({
    applications: { email: true, sms: true, push: false },
    paymentsReceived: { email: true, sms: false, push: true },
    latePayments: { email: true, sms: true, push: true },
    messages: { email: true, sms: false, push: true },
    maintenance: { email: true, sms: true, push: true },
  })

  const toggleNotification = (category, channel) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !prev[category][channel],
      },
    }))
  }

  return (
    <AppShell
      sidebar={{
        links: navLinks,
        user,
        logoBadge,
      }}
      header={{
        title: 'Settings',
        subtitle: 'Manage your account preferences',
      }}
    >
      <div className="settings-page">
        {/* Account Info */}
        <div className="settings-card">
          <h2 className="settings-card-title">Account Information</h2>

          <div className="settings-item">
            <div className="settings-item-info">
              <h4>Email Address</h4>
              <p>john.doe@example.com</p>
            </div>
            <Button variant="secondary" onClick={() => setShowEmailModal(true)}>
              Change Email
            </Button>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <h4>Password</h4>
              <p>Last changed 3 months ago</p>
            </div>
            <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
              Change Password
            </Button>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <h4>Phone Number</h4>
              <p>+1 (555) 123-4567</p>
            </div>
            <Button variant="secondary" onClick={() => setShowPhoneModal(true)}>
              Update
            </Button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="settings-card">
          <h2 className="settings-card-title">Notification Preferences</h2>

          <div className="settings-notification-grid">
            <div className="settings-notification-category">
              <div className="settings-category-title">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Applications
              </div>
              <div className="settings-notification-options">
                <div className="settings-notification-option">
                  <span className="settings-notification-label">New applications</span>
                  <div className="settings-toggle-group">
                    <span
                      className={`settings-toggle-pill ${notificationSettings.applications.email ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('applications', 'email')}
                    >
                      Email
                    </span>
                    <span
                      className={`settings-toggle-pill ${notificationSettings.applications.sms ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('applications', 'sms')}
                    >
                      SMS
                    </span>
                    <span
                      className={`settings-toggle-pill ${notificationSettings.applications.push ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('applications', 'push')}
                    >
                      Push
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-notification-category">
              <div className="settings-category-title">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Payments
              </div>
              <div className="settings-notification-options">
                <div className="settings-notification-option">
                  <span className="settings-notification-label">Payments received</span>
                  <div className="settings-toggle-group">
                    <span
                      className={`settings-toggle-pill ${notificationSettings.paymentsReceived.email ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('paymentsReceived', 'email')}
                    >
                      Email
                    </span>
                    <span
                      className={`settings-toggle-pill ${notificationSettings.paymentsReceived.sms ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('paymentsReceived', 'sms')}
                    >
                      SMS
                    </span>
                    <span
                      className={`settings-toggle-pill ${notificationSettings.paymentsReceived.push ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('paymentsReceived', 'push')}
                    >
                      Push
                    </span>
                  </div>
                </div>
                <div className="settings-notification-option">
                  <span className="settings-notification-label">Late payment alerts</span>
                  <div className="settings-toggle-group">
                    <span
                      className={`settings-toggle-pill ${notificationSettings.latePayments.email ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('latePayments', 'email')}
                    >
                      Email
                    </span>
                    <span
                      className={`settings-toggle-pill ${notificationSettings.latePayments.sms ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('latePayments', 'sms')}
                    >
                      SMS
                    </span>
                    <span
                      className={`settings-toggle-pill ${notificationSettings.latePayments.push ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('latePayments', 'push')}
                    >
                      Push
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-notification-category">
              <div className="settings-category-title">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Messages
              </div>
              <div className="settings-notification-options">
                <div className="settings-notification-option">
                  <span className="settings-notification-label">New messages</span>
                  <div className="settings-toggle-group">
                    <span
                      className={`settings-toggle-pill ${notificationSettings.messages.email ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('messages', 'email')}
                    >
                      Email
                    </span>
                    <span
                      className={`settings-toggle-pill ${notificationSettings.messages.sms ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('messages', 'sms')}
                    >
                      SMS
                    </span>
                    <span
                      className={`settings-toggle-pill ${notificationSettings.messages.push ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('messages', 'push')}
                    >
                      Push
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-notification-category">
              <div className="settings-category-title">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Maintenance Requests
              </div>
              <div className="settings-notification-options">
                <div className="settings-notification-option">
                  <span className="settings-notification-label">New requests</span>
                  <div className="settings-toggle-group">
                    <span
                      className={`settings-toggle-pill ${notificationSettings.maintenance.email ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('maintenance', 'email')}
                    >
                      Email
                    </span>
                    <span
                      className={`settings-toggle-pill ${notificationSettings.maintenance.sms ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('maintenance', 'sms')}
                    >
                      SMS
                    </span>
                    <span
                      className={`settings-toggle-pill ${notificationSettings.maintenance.push ? 'settings-toggle-pill--active' : ''}`}
                      onClick={() => toggleNotification('maintenance', 'push')}
                    >
                      Push
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="settings-card">
          <h2 className="settings-card-title">Security</h2>

          <div className="settings-item">
            <div className="settings-item-info">
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security to your account</p>
            </div>
            <div className="settings-item-action">
              <div
                className={`settings-toggle-switch ${show2FA ? 'settings-toggle-switch--active' : ''}`}
                onClick={() => setShow2FA(!show2FA)}
              >
                <div className="settings-toggle-slider" />
              </div>
            </div>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <h4>Active Sessions</h4>
              <p>Manage devices where you're logged in</p>
            </div>
          </div>

          <div className="settings-session-list">
            <div className="settings-session-item">
              <div className="settings-session-info">
                <div className="settings-session-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="settings-session-details">
                  <h4>Windows - Chrome</h4>
                  <p>Seattle, WA - Last active now</p>
                </div>
              </div>
              <span className="settings-current-badge">Current Session</span>
            </div>

            <div className="settings-session-item">
              <div className="settings-session-info">
                <div className="settings-session-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="settings-session-details">
                  <h4>iPhone 12 - Safari</h4>
                  <p>Seattle, WA - Last active 2 hours ago</p>
                </div>
              </div>
              <Button variant="secondary">Log Out</Button>
            </div>
          </div>
        </div>

        {/* Plan & Billing */}
        <div className="settings-card">
          <h2 className="settings-card-title">Plan & Billing</h2>

          <div className="settings-plan-card">
            <div className="settings-plan-header">
              <span className="settings-plan-name">Professional Plan</span>
              <div className="settings-plan-price">
                $49<span>/month</span>
              </div>
            </div>
            <p style={{ color: 'var(--color-mist)', marginBottom: '16px' }}>
              For landlords with multiple properties
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="primary">Upgrade Plan</Button>
              <Button variant="secondary">Manage Subscription</Button>
            </div>
          </div>

          <div className="settings-usage-stats">
            <div className="settings-usage-stat">
              <div className="settings-usage-value">3 / 10</div>
              <div className="settings-usage-label">Properties</div>
            </div>
            <div className="settings-usage-stat">
              <div className="settings-usage-value">18 / 50</div>
              <div className="settings-usage-label">Total Rooms</div>
            </div>
            <div className="settings-usage-stat">
              <div className="settings-usage-value">156 / ∞</div>
              <div className="settings-usage-label">Messages/Month</div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-card">
          <div className="settings-danger-zone">
            <h3>Close Account</h3>
            <p>
              Permanently delete your RoomPilot account and all associated data. This action cannot
              be undone.
            </p>
            <Button variant="danger" onClick={() => setShowCloseAccountModal(true)}>
              Close My Account
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEmailModal && (
        <div className="settings-modal" onClick={() => setShowEmailModal(false)}>
          <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="settings-modal-title">Change Email</h2>
            <div className="settings-modal-body">
              <input type="email" className="settings-form-input" placeholder="New email address" />
              <input
                type="password"
                className="settings-form-input"
                placeholder="Confirm password"
              />
            </div>
            <div className="settings-modal-actions">
              <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">Update Email</Button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="settings-modal" onClick={() => setShowPasswordModal(false)}>
          <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="settings-modal-title">Change Password</h2>
            <div className="settings-modal-body">
              <input
                type="password"
                className="settings-form-input"
                placeholder="Current password"
              />
              <input type="password" className="settings-form-input" placeholder="New password" />
              <input
                type="password"
                className="settings-form-input"
                placeholder="Confirm new password"
              />
            </div>
            <div className="settings-modal-actions">
              <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">Update Password</Button>
            </div>
          </div>
        </div>
      )}

      {showPhoneModal && (
        <div className="settings-modal" onClick={() => setShowPhoneModal(false)}>
          <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="settings-modal-title">Update Phone Number</h2>
            <div className="settings-modal-body">
              <input type="tel" className="settings-form-input" placeholder="New phone number" />
              <p style={{ fontSize: '13px', color: 'var(--color-mist)' }}>
                We'll send a verification code to this number
              </p>
            </div>
            <div className="settings-modal-actions">
              <Button variant="secondary" onClick={() => setShowPhoneModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">Send Code</Button>
            </div>
          </div>
        </div>
      )}

      {showCloseAccountModal && (
        <div className="settings-modal" onClick={() => setShowCloseAccountModal(false)}>
          <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="settings-modal-title">Close Account</h2>
            <div className="settings-modal-body">
              <p style={{ marginBottom: '16px', color: 'var(--color-coral)', fontWeight: 600 }}>
                Warning: This action is permanent and cannot be undone.
              </p>
              <p style={{ marginBottom: '16px' }}>
                All your properties, listings, messages, and data will be permanently deleted.
              </p>
              <input
                type="password"
                className="settings-form-input"
                placeholder="Enter your password to confirm"
              />
            </div>
            <div className="settings-modal-actions">
              <Button variant="secondary" onClick={() => setShowCloseAccountModal(false)}>
                Cancel
              </Button>
              <Button variant="danger">Close Account</Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}

export default SettingsPage
