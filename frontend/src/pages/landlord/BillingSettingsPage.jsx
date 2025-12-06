import { useState } from 'react'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button, Badge } from '../../components/primitives'
import { Toggle } from '../../components/forms'
import './BillingSettingsPage.css'

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
      <div className="billing-settings-page">
        {/* Global Defaults */}
        <div className="billing-card">
          <h2 className="billing-card-title">Global Defaults</h2>
          <p className="billing-card-description">
            These settings will apply to all properties unless overridden at the property level.
          </p>

          <div className="billing-form-grid">
            <div className="billing-form-group">
              <label className="billing-form-label">Billing Frequency</label>
              <select
                className="billing-form-select"
                defaultValue="weekly"
                onChange={markAsChanged}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly (Default)</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <span className="billing-form-hint">How often tenants are charged</span>
            </div>

            <div className="billing-form-group">
              <label className="billing-form-label">Grace Period</label>
              <div className="billing-input-group">
                <input
                  type="number"
                  className="billing-form-input"
                  defaultValue="3"
                  min="0"
                  max="30"
                  onChange={markAsChanged}
                />
                <span className="billing-input-addon">days</span>
              </div>
              <span className="billing-form-hint">Days after due date before late fees apply</span>
            </div>

            <div className="billing-form-group billing-form-group--full">
              <label className="billing-form-label">Late Fee Structure</label>
              <div className="billing-fee-type-toggle">
                <button
                  className={`billing-fee-type-option ${feeType === 'flat' ? 'billing-fee-type-option--active' : ''}`}
                  onClick={() => {
                    setFeeType('flat')
                    markAsChanged()
                  }}
                >
                  Flat Amount
                </button>
                <button
                  className={`billing-fee-type-option ${feeType === 'percentage' ? 'billing-fee-type-option--active' : ''}`}
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
              <div className="billing-form-group">
                <label className="billing-form-label">Flat Late Fee Amount</label>
                <div className="billing-input-group">
                  <span className="billing-input-addon">$</span>
                  <input
                    type="number"
                    className="billing-form-input"
                    defaultValue="50"
                    min="0"
                    step="5"
                    onChange={markAsChanged}
                  />
                </div>
                <span className="billing-form-hint">Fixed fee charged per late payment</span>
              </div>
            )}

            {feeType === 'percentage' && (
              <div className="billing-form-group">
                <label className="billing-form-label">Late Fee Percentage</label>
                <div className="billing-input-group">
                  <input
                    type="number"
                    className="billing-form-input"
                    defaultValue="5"
                    min="0"
                    max="25"
                    step="0.5"
                    onChange={markAsChanged}
                  />
                  <span className="billing-input-addon">%</span>
                </div>
                <span className="billing-form-hint">Percentage of rent amount</span>
              </div>
            )}

            <div className="billing-form-group">
              <label className="billing-form-label">Maximum Late Fee Cap</label>
              <div className="billing-input-group">
                <span className="billing-input-addon">$</span>
                <input
                  type="number"
                  className="billing-form-input"
                  defaultValue="200"
                  min="0"
                  step="10"
                  onChange={markAsChanged}
                />
              </div>
              <span className="billing-form-hint">Maximum total late fees allowed</span>
            </div>
          </div>
        </div>

        {/* Automation Toggles */}
        <div className="billing-card">
          <h2 className="billing-card-title">Automation Settings</h2>
          <p className="billing-card-description">
            Enable or disable automated billing and communication features.
          </p>

          <div className="billing-toggle-list">
            <div className="billing-toggle-item">
              <div className="billing-toggle-info">
                <h4>Auto-billing</h4>
                <p>Automatically charge tenants on their billing schedule</p>
              </div>
              <Toggle
                checked={autoBilling}
                onChange={(e) => {
                  setAutoBilling(e.target.checked)
                  markAsChanged()
                }}
              />
            </div>

            <div className="billing-toggle-item">
              <div className="billing-toggle-info">
                <h4>Auto-reminders</h4>
                <p>Send automatic payment reminders to tenants</p>
              </div>
              <Toggle
                checked={autoReminders}
                onChange={(e) => {
                  setAutoReminders(e.target.checked)
                  markAsChanged()
                }}
              />
            </div>

            <div className="billing-toggle-item">
              <div className="billing-toggle-info">
                <h4>Auto-late fees</h4>
                <p>Automatically apply late fees after grace period</p>
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
        <div className="billing-card">
          <h2 className="billing-card-title">Reminder Schedule</h2>
          <p className="billing-card-description">
            Configure when automatic payment reminders are sent to tenants.
          </p>

          <div className="billing-reminder-item">
            <input
              type="number"
              className="billing-reminder-input"
              defaultValue="3"
              min="0"
              max="30"
              onChange={markAsChanged}
            />
            <span className="billing-reminder-label">days before due date</span>
          </div>

          <div className="billing-reminder-item">
            <input
              type="number"
              className="billing-reminder-input"
              defaultValue="0"
              min="0"
              max="0"
              disabled
              style={{ opacity: 0.6 }}
            />
            <span className="billing-reminder-label">on the due date</span>
          </div>

          <div className="billing-reminder-item">
            <input
              type="number"
              className="billing-reminder-input"
              defaultValue="1"
              min="0"
              max="30"
              onChange={markAsChanged}
            />
            <span className="billing-reminder-label">days after due date (if unpaid)</span>
          </div>

          <div className="billing-reminder-preview">
            <div className="billing-reminder-preview-title">📅 Preview Schedule</div>
            <ul className="billing-reminder-preview-list">
              <li>🔔 Reminder sent 3 days before payment due</li>
              <li>🔔 Reminder sent on payment due date</li>
              <li>🔔 Reminder sent 1 day after due date if unpaid</li>
              <li>⏰ Late fees applied after 3-day grace period</li>
            </ul>
          </div>
        </div>

        {/* Property Overrides */}
        <div className="billing-card">
          <h2 className="billing-card-title">Property-Specific Overrides</h2>
          <p className="billing-card-description">
            Override global settings for individual properties with unique billing needs.
          </p>

          <div className="billing-property-override-item">
            <div className="billing-property-override-info">
              <h4>Sunset Gardens</h4>
              <p>5 active tenants • Weekly billing</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

          <div className="billing-property-override-item">
            <div className="billing-property-override-info">
              <h4>City View Apartments</h4>
              <p>8 active tenants • Monthly billing (Custom)</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

          <div className="billing-property-override-item">
            <div className="billing-property-override-info">
              <h4>Oak Street House</h4>
              <p>3 active tenants • Weekly billing</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

        <div style={{ height: '80px' }} />
      </div>

      {/* Save Bar */}
      {hasChanges && (
        <div className="billing-save-bar">
          <span className="billing-save-bar-text">You have unsaved changes</span>
          <div className="billing-save-bar-actions">
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
        <div className="billing-modal" onClick={() => setShowOverrideModal(false)}>
          <div className="billing-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="billing-modal-title">Override Settings</h2>
            <p className="billing-modal-subtitle">
              Configure custom billing settings for {selectedProperty}
            </p>

            <div className="billing-modal-body">
              <div className="billing-form-group" style={{ marginBottom: '16px' }}>
                <label className="billing-form-label">Billing Frequency</label>
                <select className="billing-form-select">
                  <option value="default">Use Global Default (Weekly)</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="billing-form-group" style={{ marginBottom: '16px' }}>
                <label className="billing-form-label">Grace Period</label>
                <select className="billing-form-select">
                  <option value="default">Use Global Default (3 days)</option>
                  <option value="0">No grace period</option>
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="5">5 days</option>
                  <option value="7">7 days</option>
                </select>
              </div>

              <div className="billing-form-group" style={{ marginBottom: '16px' }}>
                <label className="billing-form-label">Late Fee Amount</label>
                <select className="billing-form-select">
                  <option value="default">Use Global Default ($50)</option>
                  <option value="custom">Custom Amount</option>
                </select>
              </div>

              <div className="billing-toggle-item">
                <div className="billing-toggle-info">
                  <h4>Auto-billing for this property</h4>
                  <p>Override global auto-billing setting</p>
                </div>
                <Toggle checked={true} />
              </div>
            </div>

            <div className="billing-modal-actions">
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
