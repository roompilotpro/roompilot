import { useState } from 'react'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button } from '../../components/primitives'
import { classNames } from '../../utils'

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
      <div className="max-w-[1000px]">
        {/* Account Info */}
        <div className="bg-white rounded-xl p-8 mb-6">
          <h2 className="font-display text-2xl font-bold text-midnight mb-6">
            Account Information
          </h2>

          <div className="flex justify-between items-center py-5 border-b border-cloud last:border-b-0">
            <div>
              <h4 className="font-semibold text-midnight mb-1">Email Address</h4>
              <p className="text-sm text-slate">john.doe@example.com</p>
            </div>
            <Button variant="secondary" onClick={() => setShowEmailModal(true)}>
              Change Email
            </Button>
          </div>

          <div className="flex justify-between items-center py-5 border-b border-cloud last:border-b-0">
            <div>
              <h4 className="font-semibold text-midnight mb-1">Password</h4>
              <p className="text-sm text-slate">Last changed 3 months ago</p>
            </div>
            <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
              Change Password
            </Button>
          </div>

          <div className="flex justify-between items-center py-5 border-b-0">
            <div>
              <h4 className="font-semibold text-midnight mb-1">Phone Number</h4>
              <p className="text-sm text-slate">+1 (555) 123-4567</p>
            </div>
            <Button variant="secondary" onClick={() => setShowPhoneModal(true)}>
              Update
            </Button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-xl p-8 mb-6">
          <h2 className="font-display text-2xl font-bold text-midnight mb-6">
            Notification Preferences
          </h2>

          <div className="grid gap-5">
            <div className="p-5 bg-snow rounded-lg">
              <div className="font-bold text-midnight mb-4 flex items-center gap-2">
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
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate">New applications</span>
                  <div className="flex gap-2">
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.applications.email
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('applications', 'email')}
                    >
                      Email
                    </span>
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.applications.sms
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('applications', 'sms')}
                    >
                      SMS
                    </span>
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.applications.push
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('applications', 'push')}
                    >
                      Push
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-snow rounded-lg">
              <div className="font-bold text-midnight mb-4 flex items-center gap-2">
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
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate">Payments received</span>
                  <div className="flex gap-2">
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.paymentsReceived.email
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('paymentsReceived', 'email')}
                    >
                      Email
                    </span>
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.paymentsReceived.sms
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('paymentsReceived', 'sms')}
                    >
                      SMS
                    </span>
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.paymentsReceived.push
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('paymentsReceived', 'push')}
                    >
                      Push
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate">Late payment alerts</span>
                  <div className="flex gap-2">
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.latePayments.email
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('latePayments', 'email')}
                    >
                      Email
                    </span>
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.latePayments.sms
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('latePayments', 'sms')}
                    >
                      SMS
                    </span>
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.latePayments.push
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('latePayments', 'push')}
                    >
                      Push
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-snow rounded-lg">
              <div className="font-bold text-midnight mb-4 flex items-center gap-2">
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
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate">New messages</span>
                  <div className="flex gap-2">
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.messages.email
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('messages', 'email')}
                    >
                      Email
                    </span>
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.messages.sms
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('messages', 'sms')}
                    >
                      SMS
                    </span>
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.messages.push
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('messages', 'push')}
                    >
                      Push
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-snow rounded-lg">
              <div className="font-bold text-midnight mb-4 flex items-center gap-2">
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
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate">New requests</span>
                  <div className="flex gap-2">
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.maintenance.email
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('maintenance', 'email')}
                    >
                      Email
                    </span>
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.maintenance.sms
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
                      onClick={() => toggleNotification('maintenance', 'sms')}
                    >
                      SMS
                    </span>
                    <span
                      className={classNames(
                        'py-1.5 px-3 border rounded-md text-xs cursor-pointer transition-all duration-200',
                        notificationSettings.maintenance.push
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate border-cloud'
                      )}
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
        <div className="bg-white rounded-xl p-8 mb-6">
          <h2 className="font-display text-2xl font-bold text-midnight mb-6">Security</h2>

          <div className="flex justify-between items-center py-5 border-b border-cloud">
            <div>
              <h4 className="font-semibold text-midnight mb-1">Two-Factor Authentication</h4>
              <p className="text-sm text-slate">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={classNames(
                  'relative w-[52px] h-7 rounded-full cursor-pointer transition-colors duration-300',
                  show2FA ? 'bg-accent' : 'bg-cloud'
                )}
                onClick={() => setShow2FA(!show2FA)}
              >
                <div
                  className={classNames(
                    'absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300',
                    show2FA && 'translate-x-6'
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center py-5 border-b border-cloud">
            <div>
              <h4 className="font-semibold text-midnight mb-1">Active Sessions</h4>
              <p className="text-sm text-slate">Manage devices where you're logged in</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <div className="flex justify-between items-center p-4 bg-snow rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-bg rounded-lg flex items-center justify-center text-primary">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-midnight mb-1">Windows - Chrome</h4>
                  <p className="text-[13px] text-slate">Seattle, WA - Last active now</p>
                </div>
              </div>
              <span className="bg-accent-bg text-accent py-1 px-2.5 rounded text-xs font-semibold mr-3">
                Current Session
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-snow rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-bg rounded-lg flex items-center justify-center text-primary">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-midnight mb-1">iPhone 12 - Safari</h4>
                  <p className="text-[13px] text-slate">Seattle, WA - Last active 2 hours ago</p>
                </div>
              </div>
              <Button variant="secondary">Log Out</Button>
            </div>
          </div>
        </div>

        {/* Plan & Billing */}
        <div className="bg-white rounded-xl p-8 mb-6">
          <h2 className="font-display text-2xl font-bold text-midnight mb-6">Plan & Billing</h2>

          <div className="p-6 bg-snow border-2 border-primary rounded-xl mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-xl text-midnight">Professional Plan</span>
              <div className="text-[28px] font-bold text-primary">
                $49<span className="text-base text-slate">/month</span>
              </div>
            </div>
            <p className="text-slate mb-4">For landlords with multiple properties</p>
            <div className="flex gap-3">
              <Button variant="primary">Upgrade Plan</Button>
              <Button variant="secondary">Manage Subscription</Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3 / 10</div>
              <div className="text-[13px] text-slate mt-1">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">18 / 50</div>
              <div className="text-[13px] text-slate mt-1">Total Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">156 / ∞</div>
              <div className="text-[13px] text-slate mt-1">Messages/Month</div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl p-8 mb-6">
          <div className="bg-coral-bg border-2 border-coral rounded-xl p-6">
            <h3 className="text-coral mb-2">Close Account</h3>
            <p className="text-slate mb-4">
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
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
          onClick={() => setShowEmailModal(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-[500px] w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl font-bold text-midnight mb-4">Change Email</h2>
            <div className="text-slate mb-6">
              <input
                type="email"
                className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm mb-3 focus:outline-none focus:border-primary"
                placeholder="New email address"
              />
              <input
                type="password"
                className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm mb-3 focus:outline-none focus:border-primary"
                placeholder="Confirm password"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">Update Email</Button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-[500px] w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl font-bold text-midnight mb-4">Change Password</h2>
            <div className="text-slate mb-6">
              <input
                type="password"
                className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm mb-3 focus:outline-none focus:border-primary"
                placeholder="Current password"
              />
              <input
                type="password"
                className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm mb-3 focus:outline-none focus:border-primary"
                placeholder="New password"
              />
              <input
                type="password"
                className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm mb-3 focus:outline-none focus:border-primary"
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">Update Password</Button>
            </div>
          </div>
        </div>
      )}

      {showPhoneModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
          onClick={() => setShowPhoneModal(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-[500px] w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl font-bold text-midnight mb-4">
              Update Phone Number
            </h2>
            <div className="text-slate mb-6">
              <input
                type="tel"
                className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm mb-3 focus:outline-none focus:border-primary"
                placeholder="New phone number"
              />
              <p className="text-[13px] text-slate">
                We'll send a verification code to this number
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowPhoneModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">Send Code</Button>
            </div>
          </div>
        </div>
      )}

      {showCloseAccountModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
          onClick={() => setShowCloseAccountModal(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-[500px] w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl font-bold text-midnight mb-4">Close Account</h2>
            <div className="text-slate mb-6">
              <p className="mb-4 text-coral font-semibold">
                Warning: This action is permanent and cannot be undone.
              </p>
              <p className="mb-4">
                All your properties, listings, messages, and data will be permanently deleted.
              </p>
              <input
                type="password"
                className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm mb-3 focus:outline-none focus:border-primary"
                placeholder="Enter your password to confirm"
              />
            </div>
            <div className="flex gap-3 justify-end">
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
