import { useState } from 'react'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { classNames } from '../../utils'

const statusStyles = {
  paid: 'bg-accent-bg text-accent',
  pending: 'bg-warm-bg text-warm',
  failed: 'bg-coral-bg text-coral',
}

function PayoutsPage() {
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const transactions = [
    {
      id: 'NOV-2025-001',
      date: 'Nov 24, 2025',
      amount: 7650.0,
      status: 'paid',
      properties: 3,
      breakdown: {
        properties: [
          { name: 'Sunset Gardens', payments: 5, rooms: 'Room 1A, 2C, 3B, 4A, 5D', amount: 4250.0 },
          {
            name: 'City View Apartments',
            payments: 3,
            rooms: 'Studio 2A, 3B, 5A',
            amount: 2850.0,
          },
          { name: 'Oak Street House', payments: 2, rooms: 'Room 1, Room 2', amount: 1700.0 },
        ],
        gross: 8800.0,
        serviceFee: 880.0,
        processingFee: 270.0,
        net: 7650.0,
      },
    },
    {
      id: 'NOV-2025-002',
      date: 'Nov 10, 2025',
      amount: 8200.0,
      status: 'paid',
      properties: 3,
    },
    {
      id: 'OCT-2025-003',
      date: 'Oct 27, 2025',
      amount: 7850.0,
      status: 'paid',
      properties: 3,
    },
    {
      id: 'OCT-2025-004',
      date: 'Oct 13, 2025',
      amount: 8100.0,
      status: 'pending',
      properties: 3,
    },
    {
      id: 'SEP-2025-005',
      date: 'Sep 29, 2025',
      amount: 0.0,
      status: 'failed',
      properties: 3,
    },
    {
      id: 'SEP-2025-006',
      date: 'Sep 15, 2025',
      amount: 7950.0,
      status: 'paid',
      properties: 3,
    },
    {
      id: 'SEP-2025-007',
      date: 'Sep 1, 2025',
      amount: 8300.0,
      status: 'paid',
      properties: 3,
    },
    {
      id: 'AUG-2025-008',
      date: 'Aug 18, 2025',
      amount: 7700.0,
      status: 'paid',
      properties: 2,
    },
  ]

  const openTransactionDetail = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetailModal(true)
  }

  const closeModal = () => {
    setShowDetailModal(false)
    setSelectedTransaction(null)
  }

  const headerContent = (
    <div className="flex gap-3">
      <button className="py-3 px-5 rounded-lg font-body text-sm font-semibold cursor-pointer transition-all duration-200 border border-cloud text-slate bg-transparent hover:border-primary hover:text-primary inline-flex items-center justify-center gap-2">
        <span>📥</span> Export Transactions
      </button>
      <button className="py-3 px-5 rounded-lg font-body text-sm font-semibold cursor-pointer transition-all duration-200 border border-cloud text-slate bg-transparent hover:border-primary hover:text-primary inline-flex items-center justify-center gap-2">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
        Stripe Dashboard
      </button>
    </div>
  )

  return (
    <AppShell
      sidebar={{ links: navLinks, user, logoBadge }}
      header={{
        title: 'Payouts & Earnings',
        rightContent: headerContent,
      }}
    >
      <div className="max-w-[1400px]">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-5 mb-8">
          <div
            className="p-6 rounded-xl shadow-sm text-white"
            style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, #059669 100%)' }}
          >
            <div className="text-[13px] text-white/90 mb-2 font-medium">Available for Payout</div>
            <div className="font-display text-4xl font-bold text-white mb-3">$8,450</div>
            <button className="w-full py-3 px-5 rounded-lg font-body text-[15px] font-semibold cursor-pointer transition-colors duration-200 bg-white text-accent hover:bg-white/90">
              Get Paid Now
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-[13px] text-slate mb-2 font-medium">Next Scheduled Payout</div>
            <div className="font-display text-4xl font-bold text-midnight mb-3">Dec 8</div>
            <div className="text-[13px] text-slate">In 7 days</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-[13px] text-slate mb-2 font-medium">Earned This Month</div>
            <div className="font-display text-4xl font-bold text-midnight mb-3">$18,700</div>
            <div className="text-[13px] text-slate">+12% from last month</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-[13px] text-slate mb-2 font-medium">All-Time Earnings</div>
            <div className="font-display text-4xl font-bold text-midnight mb-3">$156K</div>
            <div className="text-[13px] text-slate">Since March 2024</div>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="bg-white rounded-xl p-7 shadow-sm mb-6">
          <h2 className="font-display text-[22px] font-bold mb-6">Earnings Overview</h2>
          <div className="h-[300px] bg-snow rounded-lg flex items-center justify-center border-2 border-dashed border-cloud">
            <div className="text-slate text-sm">
              📊 Monthly earnings chart will be displayed here
            </div>
          </div>
        </div>

        {/* Upcoming Payouts */}
        <div className="bg-white rounded-xl p-7 shadow-sm mb-6">
          <h2 className="font-display text-[22px] font-bold mb-6">Upcoming Payouts</h2>
          <div className="flex justify-between items-center p-4 bg-accent-bg rounded-lg border-l-4 border-l-accent">
            <div>
              <h4 className="font-semibold mb-1 text-midnight">Next Automatic Payout</h4>
              <p className="text-sm text-slate">December 8, 2025 • 3 properties included</p>
            </div>
            <div className="font-display text-2xl font-bold text-accent">$8,450</div>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-xl p-7 shadow-sm mb-6">
          <h2 className="font-display text-[22px] font-bold mb-6">Payout History</h2>
          <table className="w-full border-collapse">
            <thead className="bg-snow">
              <tr>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Date
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Amount
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Status
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Properties
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  onClick={() => openTransactionDetail(transaction)}
                  className="transition-colors duration-200 cursor-pointer hover:bg-snow"
                >
                  <td className="py-[18px] px-4 border-b border-cloud text-sm last:border-b-0">
                    {transaction.date}
                  </td>
                  <td className="py-[18px] px-4 border-b border-cloud text-sm last:border-b-0">
                    <span className="font-semibold text-midnight">
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-[18px] px-4 border-b border-cloud text-sm last:border-b-0">
                    <span
                      className={classNames(
                        'inline-flex items-center justify-center py-1.5 px-3 rounded-xl text-xs font-semibold capitalize',
                        statusStyles[transaction.status]
                      )}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-[18px] px-4 border-b border-cloud text-sm last:border-b-0">
                    <span className="inline-flex items-center gap-1 py-1 px-2.5 bg-snow rounded-md text-[13px] font-medium">
                      🏠 {transaction.properties} properties
                    </span>
                  </td>
                  <td className="py-[18px] px-4 border-b border-cloud text-sm last:border-b-0">
                    <button
                      className="bg-transparent border-none text-primary font-medium cursor-pointer p-0 text-sm font-body hover:underline"
                      onClick={(e) => {
                        e.stopPropagation()
                        openTransactionDetail(transaction)
                      }}
                    >
                      View Breakdown →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Transaction Detail Modal */}
        {showDetailModal && selectedTransaction && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-[600px] w-[90%] max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-display text-2xl font-bold mb-2">Payout Breakdown</h2>
              <p className="text-slate mb-6">
                Payout ID: {selectedTransaction.id} • Paid on {selectedTransaction.date}
              </p>

              {selectedTransaction.breakdown && (
                <>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-midnight">Payments Included</h3>
                    <div className="flex flex-col gap-2">
                      {selectedTransaction.breakdown.properties.map((prop, index) => (
                        <div key={index} className="flex justify-between p-3 bg-snow rounded-md">
                          <div>
                            <strong>{prop.name}</strong>
                            <p className="text-[13px] text-slate">
                              {prop.payments} payments • {prop.rooms}
                            </p>
                          </div>
                          <div className="font-semibold text-midnight">
                            ${prop.amount.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-midnight">Fee Breakdown</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between py-2.5 border-b border-cloud">
                        <span className="text-slate text-sm">Gross Amount</span>
                        <span className="font-medium text-midnight">
                          ${selectedTransaction.breakdown.gross.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2.5 border-b border-cloud">
                        <span className="text-slate text-sm">RoomPilot Service Fee (10%)</span>
                        <span className="font-medium text-midnight">
                          -${selectedTransaction.breakdown.serviceFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2.5 border-b border-cloud">
                        <span className="text-slate text-sm">
                          Stripe Processing Fee (2.9% + $0.30)
                        </span>
                        <span className="font-medium text-midnight">
                          -${selectedTransaction.breakdown.processingFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-4 border-t-2 border-cloud text-base">
                        <span className="font-semibold text-midnight">Net Payout</span>
                        <span className="font-display text-xl font-bold text-accent">
                          ${selectedTransaction.breakdown.net.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-6">
                <button
                  className="w-full py-3 px-5 rounded-lg font-body text-sm font-semibold cursor-pointer transition-colors duration-200 bg-primary text-white hover:bg-primary-dark"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default PayoutsPage
