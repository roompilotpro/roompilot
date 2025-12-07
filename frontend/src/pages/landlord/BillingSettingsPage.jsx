import { useState } from 'react'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button, Badge } from '../../components/primitives'
import { Toggle } from '../../components/forms'
import { classNames } from '../../utils'

function BillingSettingsPage() {
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [feeType, setFeeType] = useState('flat')
  const [hasChanges, setHasChanges] = useState(false)
  const [autoBilling, setAutoBilling] = useState(true)
  const [autoReminders, setAutoReminders] = useState(true)
  const [autoLateFees, setAutoLateFees] = useState(true)
  const [showOverrideModal, setShowOverrideModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)

  const markAsChanged = () => {
    setHasChanges(true)
  }

  const saveChanges = () => {
    setHasChanges(false)
    alert('Settings saved successfully!')
  }

  const discardChanges = () => {
    setHasChanges(false)
    window.location.reload()
  }

  const openOverrideModal = (propertyName) => {
    setSelectedProperty(propertyName)
    setShowOverrideModal(true)
  }

  return (
    <AppShell
      sidebar={{
        links: navLinks,
        user,
        logoBadge,
      }}
      header={{
        title: 'Billing & Automation',
        subtitle: 'Configure default billing settings and automation for all your properties',
      }}
    >
      <div className="max-w-[1200px] pb-8">
        {/* Global Defaults */}
        <div className="bg-white rounded-xl p-7 shadow-sm mb-6">
          <h2 className="font-display text-xl font-bold mb-2">Global Defaults</h2>
          <p className="text-slate mb-6 text-sm leading-relaxed">
            These settings will apply to all properties unless overridden at the property level.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-midnight text-sm">Billing Frequency</label>
              <select
                className="py-3 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white focus:outline-none focus:border-primary"
                defaultValue="weekly"
                onChange={markAsChanged}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly (Default)</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <span className="text-[13px] text-slate">How often tenants are charged</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-midnight text-sm">Grace Period</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="py-3 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white focus:outline-none focus:border-primary"
                  defaultValue="3"
                  min="0"
                  max="30"
                  onChange={markAsChanged}
                />
                <span className="py-3 px-4 bg-snow border border-cloud rounded-lg font-medium text-slate">
                  days
                </span>
              </div>
              <span className="text-[13px] text-slate">
                Days after due date before late fees apply
              </span>
            </div>

            <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
              <label className="font-semibold text-midnight text-sm">Late Fee Structure</label>
              <div className="flex gap-3 p-1 bg-snow rounded-lg">
                <button
                  className={classNames(
                    'flex-1 py-2.5 px-4 border-none bg-transparent rounded-md font-body text-sm font-semibold cursor-pointer transition-all duration-200',
                    feeType === 'flat' ? 'bg-white text-primary shadow-sm' : 'text-slate'
                  )}
                  onClick={() => {
                    setFeeType('flat')
                    markAsChanged()
                  }}
                >
                  Flat Amount
                </button>
                <button
                  className={classNames(
                    'flex-1 py-2.5 px-4 border-none bg-transparent rounded-md font-body text-sm font-semibold cursor-pointer transition-all duration-200',
                    feeType === 'percentage' ? 'bg-white text-primary shadow-sm' : 'text-slate'
                  )}
                  onClick={() => {
                    setFeeType('percentage')
                    markAsChanged()
                  }}
                >
                  Percentage
                </button>
              </div>
            </div>

            {feeType === 'flat' && (
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-midnight text-sm">Flat Late Fee Amount</label>
                <div className="flex items-center gap-2">
                  <span className="py-3 px-4 bg-snow border border-cloud rounded-lg font-medium text-slate">
                    $
                  </span>
                  <input
                    type="number"
                    className="py-3 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white focus:outline-none focus:border-primary"
                    defaultValue="50"
                    min="0"
                    step="5"
                    onChange={markAsChanged}
                  />
                </div>
                <span className="text-[13px] text-slate">Fixed fee charged per late payment</span>
              </div>
            )}

            {feeType === 'percentage' && (
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-midnight text-sm">Late Fee Percentage</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="py-3 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white focus:outline-none focus:border-primary"
                    defaultValue="5"
                    min="0"
                    max="25"
                    step="0.5"
                    onChange={markAsChanged}
                  />
                  <span className="py-3 px-4 bg-snow border border-cloud rounded-lg font-medium text-slate">
                    %
                  </span>
                </div>
                <span className="text-[13px] text-slate">Percentage of rent amount</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-midnight text-sm">Maximum Late Fee Cap</label>
              <div className="flex items-center gap-2">
                <span className="py-3 px-4 bg-snow border border-cloud rounded-lg font-medium text-slate">
                  $
                </span>
                <input
                  type="number"
                  className="py-3 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white focus:outline-none focus:border-primary"
                  defaultValue="200"
                  min="0"
                  step="10"
                  onChange={markAsChanged}
                />
              </div>
              <span className="text-[13px] text-slate">Maximum total late fees allowed</span>
            </div>
          </div>
        </div>

        {/* Automation Toggles */}
        <div className="bg-white rounded-xl p-7 shadow-sm mb-6">
          <h2 className="font-display text-xl font-bold mb-2">Automation Settings</h2>
          <p className="text-slate mb-6 text-sm leading-relaxed">
            Enable or disable automated billing and communication features.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-4 bg-snow rounded-lg">
              <div>
                <h4 className="font-semibold mb-1 text-midnight">Auto-billing</h4>
                <p className="text-[13px] text-slate">
                  Automatically charge tenants on their billing schedule
                </p>
              </div>
              <Toggle
                checked={autoBilling}
                onChange={(e) => {
                  setAutoBilling(e.target.checked)
                  markAsChanged()
                }}
              />
            </div>

            <div className="flex justify-between items-center p-4 bg-snow rounded-lg">
              <div>
                <h4 className="font-semibold mb-1 text-midnight">Auto-reminders</h4>
                <p className="text-[13px] text-slate">
                  Send automatic payment reminders to tenants
                </p>
              </div>
              <Toggle
                checked={autoReminders}
                onChange={(e) => {
                  setAutoReminders(e.target.checked)
                  markAsChanged()
                }}
              />
            </div>

            <div className="flex justify-between items-center p-4 bg-snow rounded-lg">
              <div>
                <h4 className="font-semibold mb-1 text-midnight">Auto-late fees</h4>
                <p className="text-[13px] text-slate">
                  Automatically apply late fees after grace period
                </p>
              </div>
              <Toggle
                checked={autoLateFees}
                onChange={(e) => {
                  setAutoLateFees(e.target.checked)
                  markAsChanged()
                }}
              />
            </div>
          </div>
        </div>

        {/* Reminder Schedule */}
        <div className="bg-white rounded-xl p-7 shadow-sm mb-6">
          <h2 className="font-display text-xl font-bold mb-2">Reminder Schedule</h2>
          <p className="text-slate mb-6 text-sm leading-relaxed">
            Configure when automatic payment reminders are sent to tenants.
          </p>

          <div className="flex items-center gap-3 p-3.5 bg-snow rounded-lg mb-2">
            <input
              type="number"
              className="w-20 py-3 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white"
              defaultValue="3"
              min="0"
              max="30"
              onChange={markAsChanged}
            />
            <span className="flex-1 font-medium text-midnight">days before due date</span>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-snow rounded-lg mb-2">
            <input
              type="number"
              className="w-20 py-3 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white opacity-60"
              defaultValue="0"
              min="0"
              max="0"
              disabled
            />
            <span className="flex-1 font-medium text-midnight">on the due date</span>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-snow rounded-lg mb-2">
            <input
              type="number"
              className="w-20 py-3 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white"
              defaultValue="1"
              min="0"
              max="30"
              onChange={markAsChanged}
            />
            <span className="flex-1 font-medium text-midnight">
              days after due date (if unpaid)
            </span>
          </div>

          <div className="p-4 bg-primary-bg border-l-4 border-primary rounded-lg mt-4">
            <div className="font-semibold mb-2 text-primary-dark">📅 Preview Schedule</div>
            <ul className="list-none flex flex-col gap-1.5">
              <li className="text-sm text-slate flex items-center gap-2">
                🔔 Reminder sent 3 days before payment due
              </li>
              <li className="text-sm text-slate flex items-center gap-2">
                🔔 Reminder sent on payment due date
              </li>
              <li className="text-sm text-slate flex items-center gap-2">
                🔔 Reminder sent 1 day after due date if unpaid
              </li>
              <li className="text-sm text-slate flex items-center gap-2">
                ⏰ Late fees applied after 3-day grace period
              </li>
            </ul>
          </div>
        </div>

        {/* Property Overrides */}
        <div className="bg-white rounded-xl p-7 shadow-sm mb-6">
          <h2 className="font-display text-xl font-bold mb-2">Property-Specific Overrides</h2>
          <p className="text-slate mb-6 text-sm leading-relaxed">
            Override global settings for individual properties with unique billing needs.
          </p>

          <div className="flex items-center justify-between p-4 bg-snow rounded-lg mb-3">
            <div>
              <h4 className="font-semibold mb-1 text-midnight">Sunset Gardens</h4>
              <p className="text-[13px] text-slate">5 active tenants • Weekly billing</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="neutral">Using Defaults</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openOverrideModal('Sunset Gardens')}
              >
                Edit Override
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-snow rounded-lg mb-3">
            <div>
              <h4 className="font-semibold mb-1 text-midnight">City View Apartments</h4>
              <p className="text-[13px] text-slate">8 active tenants • Monthly billing (Custom)</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="warning">⚡ Custom Settings</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openOverrideModal('City View Apartments')}
              >
                Edit Override
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-snow rounded-lg mb-3">
            <div>
              <h4 className="font-semibold mb-1 text-midnight">Oak Street House</h4>
              <p className="text-[13px] text-slate">3 active tenants • Weekly billing</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="neutral">Using Defaults</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openOverrideModal('Oak Street House')}
              >
                Edit Override
              </Button>
            </div>
          </div>
        </div>

        <div className="h-20" />
      </div>

      {/* Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-[260px] right-0 bg-white py-4 px-10 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-between items-center z-[100]">
          <span className="font-medium text-slate">You have unsaved changes</span>
          <div className="flex gap-3">
            <Button variant="outline" onClick={discardChanges}>
              Discard
            </Button>
            <Button variant="primary" onClick={saveChanges}>
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Property Override Modal */}
      {showOverrideModal && (
        <div
          className="flex fixed inset-0 bg-black/50 items-center justify-center z-[1000]"
          onClick={() => setShowOverrideModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[600px] w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl font-bold mb-2">Override Settings</h2>
            <p className="text-slate mb-6">
              Configure custom billing settings for {selectedProperty}
            </p>

            <div className="mb-6">
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold text-midnight text-sm">Billing Frequency</label>
                <select className="py-3 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white focus:outline-none focus:border-primary">
                  <option value="default">Use Global Default (Weekly)</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold text-midnight text-sm">Grace Period</label>
                <select className="py-3 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white focus:outline-none focus:border-primary">
                  <option value="default">Use Global Default (3 days)</option>
                  <option value="0">No grace period</option>
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="5">5 days</option>
                  <option value="7">7 days</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold text-midnight text-sm">Late Fee Amount</label>
                <select className="py-3 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white focus:outline-none focus:border-primary">
                  <option value="default">Use Global Default ($50)</option>
                  <option value="custom">Custom Amount</option>
                </select>
              </div>

              <div className="flex justify-between items-center p-4 bg-snow rounded-lg">
                <div>
                  <h4 className="font-semibold mb-1 text-midnight">
                    Auto-billing for this property
                  </h4>
                  <p className="text-[13px] text-slate">Override global auto-billing setting</p>
                </div>
                <Toggle checked={true} />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowOverrideModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowOverrideModal(false)
                  markAsChanged()
                }}
              >
                Save Override
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}

export default BillingSettingsPage
