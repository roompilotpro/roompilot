import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button, Badge } from '../../components/primitives'
import './TenantDetailPage.css'

// Mock tenant detail data
const mockTenantDetail = {
  id: 't1',
  name: 'Emma Wilson',
  email: 'emma.w@email.com',
  phone: '(555) 234-5678',
  avatar: 'https://i.pravatar.cc/150?img=10',
  property: 'Sunset Gardens',
  room: 'Room 1A',
  moveInDate: 'March 1, 2024',
  leaseEndDate: 'February 28, 2026',
  leaseTerm: '12 months',
  rentAmount: 850,
  paymentFrequency: 'Weekly',
  securityDeposit: 850,
  currentBalance: 0,
  nextPaymentDue: 'December 8, 2025',
  onTimeStreak: 38,
  paymentHistory: [
    { id: 'p1', date: 'Dec 1, 2025', amount: 850, status: 'paid', method: 'Bank Transfer' },
    { id: 'p2', date: 'Nov 24, 2025', amount: 850, status: 'paid', method: 'Bank Transfer' },
    { id: 'p3', date: 'Nov 17, 2025', amount: 850, status: 'paid', method: 'Bank Transfer' },
    { id: 'p4', date: 'Nov 10, 2025', amount: 850, status: 'paid', method: 'Bank Transfer' },
    { id: 'p5', date: 'Nov 3, 2025', amount: 850, status: 'paid', method: 'Bank Transfer' },
    { id: 'p6', date: 'Oct 27, 2025', amount: 850, status: 'paid', method: 'Bank Transfer' },
    { id: 'p7', date: 'Oct 20, 2025', amount: 850, status: 'paid', method: 'Bank Transfer' },
    { id: 'p8', date: 'Oct 13, 2025', amount: 850, status: 'paid', method: 'Bank Transfer' },
  ],
  notes:
    'Excellent tenant. Always pays on time. Very clean and respectful. Renewed lease without hesitation.',
}

function TenantDetailPage() {
  useNavigate() // Hook required for future navigation
  useParams() // Hook required for future id usage
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [notes, setNotes] = useState(mockTenantDetail.notes)
  const [showEndTenancyModal, setShowEndTenancyModal] = useState(false)

  return (
    <AppShell sidebar={{ links: navLinks, user, logoBadge }}>
      <div className="tenant-detail-content">
        <Link to={ROUTES.LANDLORD.TENANTS} className="back-link">
          ← Back to Tenants
        </Link>

        <div className="tenant-detail-grid">
          {/* Main Column */}
          <div className="tenant-main-column">
            {/* Tenant Header */}
            <div className="card tenant-header-card">
              <div className="tenant-header">
                <img
                  src={mockTenantDetail.avatar}
                  alt={mockTenantDetail.name}
                  className="tenant-avatar-large"
                />
                <div className="tenant-header-info">
                  <h1 className="tenant-name">{mockTenantDetail.name}</h1>
                  <div className="contact-info">
                    <span className="contact-item">📞 {mockTenantDetail.phone}</span>
                    <span className="contact-item">✉️ {mockTenantDetail.email}</span>
                  </div>
                  <div className="current-room">
                    🏠 {mockTenantDetail.property} - {mockTenantDetail.room}
                  </div>
                </div>
              </div>
            </div>

            {/* Tenancy Details */}
            <div className="card">
              <h2 className="card-title">Tenancy Details</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Move-in Date</span>
                  <span className="info-value">{mockTenantDetail.moveInDate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Lease Term</span>
                  <span className="info-value">{mockTenantDetail.leaseTerm}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Rent Amount</span>
                  <span className="info-value">${mockTenantDetail.rentAmount}/week</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Lease End Date</span>
                  <span className="info-value">{mockTenantDetail.leaseEndDate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Security Deposit</span>
                  <span className="info-value">${mockTenantDetail.securityDeposit} (Held)</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Payment Frequency</span>
                  <span className="info-value">{mockTenantDetail.paymentFrequency}</span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="card payment-status-card">
              <div className="payment-amount">${mockTenantDetail.currentBalance}</div>
              <div className="payment-detail">
                Current balance • Next payment due: {mockTenantDetail.nextPaymentDue}
              </div>
              <div className="payment-streak">
                <span className="payment-streak-icon">🔥</span>
                <span className="payment-streak-text">
                  {mockTenantDetail.onTimeStreak} consecutive on-time payments
                </span>
              </div>
            </div>

            {/* Payment History */}
            <div className="card">
              <h2 className="card-title">Payment History</h2>
              <div className="table-container">
                <table className="payment-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Method</th>
                      <th>Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTenantDetail.paymentHistory.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.date}</td>
                        <td>${payment.amount.toFixed(2)}</td>
                        <td>
                          <Badge variant="success">Paid</Badge>
                        </td>
                        <td>{payment.method}</td>
                        <td>
                          <button className="link-button">📥 Download</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <button className="pagination-btn">Previous</button>
                <button className="pagination-btn active">1</button>
                <button className="pagination-btn">2</button>
                <button className="pagination-btn">3</button>
                <button className="pagination-btn">4</button>
                <button className="pagination-btn">5</button>
                <button className="pagination-btn">Next</button>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="card">
              <h2 className="card-title">Internal Notes</h2>
              <p className="notes-description">
                Private notes only visible to you. Not shared with tenant.
              </p>
              <textarea
                className="notes-area"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this tenant..."
              />
              <div className="notes-actions">
                <Button variant="primary">Save Notes</Button>
              </div>
            </div>
          </div>

          {/* Actions Panel */}
          <aside className="actions-panel">
            <div className="card">
              <h3 className="card-title">Actions</h3>
              <Button variant="primary" fullWidth>
                💬 Send Message
              </Button>
              <Button variant="outline" fullWidth>
                📥 Download Payment History
              </Button>
              <div className="divider" />
              <Button variant="danger" fullWidth onClick={() => setShowEndTenancyModal(true)}>
                End Tenancy
              </Button>
            </div>
          </aside>
        </div>

        {/* End Tenancy Modal */}
        {showEndTenancyModal && (
          <div className="modal" onClick={() => setShowEndTenancyModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">End Tenancy</h2>
              <div className="modal-body">
                <p>
                  Are you sure you want to end {mockTenantDetail.name}'s tenancy at{' '}
                  {mockTenantDetail.property} - {mockTenantDetail.room}?
                </p>

                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Reason (Optional)</label>
                  <textarea className="form-textarea" placeholder="Reason for ending tenancy..." />
                </div>

                <p className="modal-warning">
                  ⚠️ This action cannot be undone. The tenant will be notified via email.
                </p>
              </div>
              <div className="modal-actions">
                <Button variant="outline" onClick={() => setShowEndTenancyModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger">Confirm End Tenancy</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default TenantDetailPage
