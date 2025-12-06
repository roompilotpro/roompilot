import { useState } from 'react'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import './PayoutsPage.css'

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
    <div style={{ display: 'flex', gap: '12px' }}>
      <button className="btn btn-outline">
        <span>📥</span> Export Transactions
      </button>
      <button className="btn btn-outline">
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
      <div className="payouts-page">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card featured">
            <div className="summary-label">Available for Payout</div>
            <div className="summary-value">$8,450</div>
            <button className="btn btn-success">Get Paid Now</button>
          </div>
          <div className="summary-card">
            <div className="summary-label">Next Scheduled Payout</div>
            <div className="summary-value">Dec 8</div>
            <div className="summary-detail">In 7 days</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Earned This Month</div>
            <div className="summary-value">$18,700</div>
            <div className="summary-detail">+12% from last month</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">All-Time Earnings</div>
            <div className="summary-value">$156K</div>
            <div className="summary-detail">Since March 2024</div>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="card">
          <h2 className="card-title">Earnings Overview</h2>
          <div className="chart-placeholder">
            <div className="chart-placeholder-text">
              📊 Monthly earnings chart will be displayed here
            </div>
          </div>
        </div>

        {/* Upcoming Payouts */}
        <div className="card">
          <h2 className="card-title">Upcoming Payouts</h2>
          <div className="upcoming-payout">
            <div className="upcoming-payout-info">
              <h4>Next Automatic Payout</h4>
              <p>December 8, 2025 • 3 properties included</p>
            </div>
            <div className="upcoming-payout-amount">$8,450</div>
          </div>
        </div>

        {/* Payout History */}
        <div className="card">
          <h2 className="card-title">Payout History</h2>
          <table className="payout-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Properties</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} onClick={() => openTransactionDetail(transaction)}>
                  <td>{transaction.date}</td>
                  <td>
                    <span className="amount-text">${transaction.amount.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${transaction.status}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td>
                    <span className="property-count">🏠 {transaction.properties} properties</span>
                  </td>
                  <td>
                    <button
                      className="link-button"
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
          <div className="modal active" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Payout Breakdown</h2>
              <p className="modal-subtitle">
                Payout ID: {selectedTransaction.id} • Paid on {selectedTransaction.date}
              </p>

              {selectedTransaction.breakdown && (
                <>
                  <div className="modal-section">
                    <h3 className="modal-section-title">Payments Included</h3>
                    <div className="payment-list">
                      {selectedTransaction.breakdown.properties.map((prop, index) => (
                        <div key={index} className="payment-item">
                          <div className="payment-item-info">
                            <strong>{prop.name}</strong>
                            <p>
                              {prop.payments} payments • {prop.rooms}
                            </p>
                          </div>
                          <div className="payment-item-amount">${prop.amount.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="modal-section">
                    <h3 className="modal-section-title">Fee Breakdown</h3>
                    <div className="fee-breakdown">
                      <div className="fee-item">
                        <span className="fee-label">Gross Amount</span>
                        <span className="fee-amount">
                          ${selectedTransaction.breakdown.gross.toFixed(2)}
                        </span>
                      </div>
                      <div className="fee-item">
                        <span className="fee-label">RoomPilot Service Fee (10%)</span>
                        <span className="fee-amount">
                          -${selectedTransaction.breakdown.serviceFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="fee-item">
                        <span className="fee-label">Stripe Processing Fee (2.9% + $0.30)</span>
                        <span className="fee-amount">
                          -${selectedTransaction.breakdown.processingFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="fee-item total">
                        <span className="fee-label">Net Payout</span>
                        <span className="fee-amount">
                          ${selectedTransaction.breakdown.net.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="modal-close-btn">
                <button className="btn btn-primary" onClick={closeModal} style={{ width: '100%' }}>
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
