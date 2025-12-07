import { useState } from 'react'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button } from '../../components/primitives'
import { classNames } from '../../utils'

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
      <div className="max-w-[1000px]">
        {/* Stripe Connect Status */}
        <div className="bg-white rounded-xl p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl font-bold text-midnight">Stripe Connect</h2>
            <span className="inline-flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm bg-accent-bg text-accent">
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

          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 mb-6">
            <div className="p-4 bg-snow rounded-lg">
              <div className="text-[13px] text-slate mb-1">Account Status</div>
              <div className="font-semibold text-midnight">Verified</div>
            </div>
            <div className="p-4 bg-snow rounded-lg">
              <div className="text-[13px] text-slate mb-1">Account Email</div>
              <div className="font-semibold text-midnight">john.doe@example.com</div>
            </div>
            <div className="p-4 bg-snow rounded-lg">
              <div className="text-[13px] text-slate mb-1">Connected Since</div>
              <div className="font-semibold text-midnight">January 15, 2023</div>
            </div>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary no-underline font-semibold transition-all duration-200 hover:text-primary-dark"
          >
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
        <div className="bg-white rounded-xl p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl font-bold text-midnight">Bank Accounts</h2>
            <Button variant="primary">Add New Account</Button>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex justify-between items-center p-5 border-2 rounded-lg transition-all duration-200 border-accent bg-accent-bg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-primary">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-midnight mb-1">Chase Bank</h4>
                  <p className="text-sm text-slate">Account ending in 4242</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <span className="bg-accent text-white py-1.5 px-3 rounded-md text-xs font-semibold">
                  Default
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-5 bg-snow border-2 border-cloud rounded-lg transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-primary">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-midnight mb-1">Bank of America</h4>
                  <p className="text-sm text-slate">Account ending in 8888</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <button className="bg-transparent text-primary py-2 px-4 border-none rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 font-body hover:bg-primary-bg">
                  Set as Default
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Schedule */}
        <div className="bg-white rounded-xl p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl font-bold text-midnight">Payout Schedule</h2>
          </div>

          <div className="mb-5">
            <label className="block font-semibold text-midnight mb-2">Payout Frequency</label>
            <div className="flex bg-snow rounded-lg p-1 mb-4">
              <button
                className={classNames(
                  'flex-1 py-3 px-6 border-none bg-transparent font-body font-semibold cursor-pointer rounded-md transition-all duration-200',
                  frequency === 'daily' ? 'bg-white text-primary shadow-md' : 'text-slate'
                )}
                onClick={() => setFrequency('daily')}
              >
                Daily
              </button>
              <button
                className={classNames(
                  'flex-1 py-3 px-6 border-none bg-transparent font-body font-semibold cursor-pointer rounded-md transition-all duration-200',
                  frequency === 'weekly' ? 'bg-white text-primary shadow-md' : 'text-slate'
                )}
                onClick={() => setFrequency('weekly')}
              >
                Weekly
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label className="block font-semibold text-midnight mb-2">
              Minimum Payout Threshold
            </label>
            <input
              type="number"
              className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm focus:outline-none focus:border-primary"
              defaultValue="100"
              placeholder="Enter amount"
            />
            <div className="text-[13px] text-slate mt-1.5">
              Payouts will only be initiated when your balance reaches this amount
            </div>
          </div>

          <div className="p-4 bg-primary-bg rounded-lg border-l-4 border-primary mt-4">
            <p className="text-slate leading-relaxed">
              <strong>Next Expected Payout:</strong> Tomorrow, December 2, 2025
            </p>
            <p className="text-slate leading-relaxed mt-2">
              <strong>Estimated Amount:</strong> $2,450.00
            </p>
          </div>

          <div className="mt-6">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>

        {/* Tax Documents */}
        <div className="bg-white rounded-xl p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl font-bold text-midnight">Tax Documents</h2>
            <select
              className="py-2 px-4 border border-cloud rounded-md font-body"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-4 bg-snow rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-bg rounded-lg flex items-center justify-center text-primary">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-midnight mb-1">1099-K Form (2024)</h4>
                  <p className="text-[13px] text-slate">Available after January 31, 2025</p>
                </div>
              </div>
              <Button variant="secondary" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="flex justify-between items-center p-4 bg-snow rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-bg rounded-lg flex items-center justify-center text-primary">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-midnight mb-1">Annual Tax Summary (2024)</h4>
                  <p className="text-[13px] text-slate">PDF - Last updated Dec 1, 2025</p>
                </div>
              </div>
              <Button variant="primary">Download</Button>
            </div>

            <div className="flex justify-between items-center p-4 bg-snow rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-bg rounded-lg flex items-center justify-center text-primary">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-midnight mb-1">
                    Monthly Payout Report (November 2024)
                  </h4>
                  <p className="text-[13px] text-slate">CSV - Transaction details</p>
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
