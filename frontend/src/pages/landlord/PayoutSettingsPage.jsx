import { useState } from 'react'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button } from '../../components/primitives'
import './PayoutSettingsPage.css'

function PayoutSettingsPage() {
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [frequency, setFrequency] = useState('daily')
  const [yearFilter, setYearFilter] = useState('2024')

  return (
    <AppShell
      sidebar={{
        links: navLinks,
        user,
        logoBadge,
      }}
      header={{
        title: 'Payout Settings',
        subtitle: 'Manage how you receive payments',
      }}
    >
      <div className="payout-settings-page">
        {/* Stripe Connect Status */}
        <div className="payout-settings-card">
          <div className="payout-card-header">
            <h2 className="payout-card-title">Stripe Connect</h2>
            <span className="payout-status-badge payout-status-badge--connected">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Connected
            </span>
          </div>

          <div className="payout-info-grid">
            <div className="payout-info-item">
              <div className="payout-info-label">Account Status</div>
              <div className="payout-info-value">Verified</div>
            </div>
            <div className="payout-info-item">
              <div className="payout-info-label">Account Email</div>
              <div className="payout-info-value">john.doe@example.com</div>
            </div>
            <div className="payout-info-item">
              <div className="payout-info-label">Connected Since</div>
              <div className="payout-info-value">January 15, 2023</div>
            </div>
          </div>

          <a href="#" className="payout-link-button">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open Stripe Dashboard
          </a>
        </div>

        {/* Bank Accounts */}
        <div className="payout-settings-card">
          <div className="payout-card-header">
            <h2 className="payout-card-title">Bank Accounts</h2>
            <Button variant="primary">Add New Account</Button>
          </div>

          <div className="payout-bank-account-list">
            <div className="payout-bank-account-item payout-bank-account-item--default">
              <div className="payout-account-info">
                <div className="payout-bank-icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div className="payout-account-details">
                  <h4>Chase Bank</h4>
                  <p>Account ending in 4242</p>
                </div>
              </div>
              <div className="payout-account-actions">
                <span className="payout-default-badge">Default</span>
              </div>
            </div>

            <div className="payout-bank-account-item">
              <div className="payout-account-info">
                <div className="payout-bank-icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div className="payout-account-details">
                  <h4>Bank of America</h4>
                  <p>Account ending in 8888</p>
                </div>
              </div>
              <div className="payout-account-actions">
                <button className="payout-btn-text">Set as Default</button>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Schedule */}
        <div className="payout-settings-card">
          <div className="payout-card-header">
            <h2 className="payout-card-title">Payout Schedule</h2>
          </div>

          <div className="payout-form-group">
            <label className="payout-form-label">Payout Frequency</label>
            <div className="payout-toggle-group">
              <button
                className={`payout-toggle-option ${frequency === 'daily' ? 'payout-toggle-option--active' : ''}`}
                onClick={() => setFrequency('daily')}
              >
                Daily
              </button>
              <button
                className={`payout-toggle-option ${frequency === 'weekly' ? 'payout-toggle-option--active' : ''}`}
                onClick={() => setFrequency('weekly')}
              >
                Weekly
              </button>
            </div>
          </div>

          <div className="payout-form-group">
            <label className="payout-form-label">Minimum Payout Threshold</label>
            <input
              type="number"
              className="payout-form-input"
              defaultValue="100"
              placeholder="Enter amount"
            />
            <div className="payout-form-hint">
              Payouts will only be initiated when your balance reaches this amount
            </div>
          </div>

          <div className="payout-info-box">
            <p>
              <strong>Next Expected Payout:</strong> Tomorrow, December 2, 2025
            </p>
            <p style={{ marginTop: '8px' }}>
              <strong>Estimated Amount:</strong> $2,450.00
            </p>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>

        {/* Tax Documents */}
        <div className="payout-settings-card">
          <div className="payout-card-header">
            <h2 className="payout-card-title">Tax Documents</h2>
            <select
              className="payout-year-selector"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div className="payout-document-list">
            <div className="payout-document-item">
              <div className="payout-document-info">
                <div className="payout-document-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="payout-document-details">
                  <h4>1099-K Form (2024)</h4>
                  <p>Available after January 31, 2025</p>
                </div>
              </div>
              <Button variant="secondary" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="payout-document-item">
              <div className="payout-document-info">
                <div className="payout-document-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="payout-document-details">
                  <h4>Annual Tax Summary (2024)</h4>
                  <p>PDF - Last updated Dec 1, 2025</p>
                </div>
              </div>
              <Button variant="primary">Download</Button>
            </div>

            <div className="payout-document-item">
              <div className="payout-document-info">
                <div className="payout-document-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="payout-document-details">
                  <h4>Monthly Payout Report (November 2024)</h4>
                  <p>CSV - Transaction details</p>
                </div>
              </div>
              <Button variant="primary">Download</Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export default PayoutSettingsPage
