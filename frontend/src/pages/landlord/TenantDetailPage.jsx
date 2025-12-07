import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button, Badge } from '../../components/primitives'

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
      <div>
        <Link
          to={ROUTES.LANDLORD.TENANTS}
          className="inline-flex items-center gap-1.5 text-primary no-underline font-medium mb-6 transition-all duration-200 hover:gap-2.5"
        >
          ← Back to Tenants
        </Link>

        <div className="grid grid-cols-[1fr_340px] lg:grid-cols-1 gap-6">
          {/* Main Column */}
          <div className="flex flex-col gap-6">
            {/* Tenant Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex gap-5 items-start">
                <img
                  src={mockTenantDetail.avatar}
                  alt={mockTenantDetail.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h1 className="font-display text-[28px] font-bold mb-2 text-midnight">
                    {mockTenantDetail.name}
                  </h1>
                  <div className="flex gap-6 mb-3">
                    <span className="flex items-center gap-1.5 text-slate text-sm">
                      📞 {mockTenantDetail.phone}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate text-sm">
                      ✉️ {mockTenantDetail.email}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-primary-bg text-primary rounded-lg font-semibold text-sm">
                    🏠 {mockTenantDetail.property} - {mockTenantDetail.room}
                  </div>
                </div>
              </div>
            </div>

            {/* Tenancy Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold mb-5 text-midnight">Tenancy Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                    Move-in Date
                  </span>
                  <span className="font-medium text-midnight">{mockTenantDetail.moveInDate}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                    Lease Term
                  </span>
                  <span className="font-medium text-midnight">{mockTenantDetail.leaseTerm}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                    Rent Amount
                  </span>
                  <span className="font-medium text-midnight">
                    ${mockTenantDetail.rentAmount}/week
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                    Lease End Date
                  </span>
                  <span className="font-medium text-midnight">{mockTenantDetail.leaseEndDate}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                    Security Deposit
                  </span>
                  <span className="font-medium text-midnight">
                    ${mockTenantDetail.securityDeposit} (Held)
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate uppercase tracking-wide">
                    Payment Frequency
                  </span>
                  <span className="font-medium text-midnight">
                    {mockTenantDetail.paymentFrequency}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div
              className="rounded-xl p-6 shadow-sm text-white"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent) 0%, #059669 100%)',
              }}
            >
              <div className="font-display text-[40px] font-bold mb-4">
                ${mockTenantDetail.currentBalance}
              </div>
              <div className="text-sm opacity-95 mb-5">
                Current balance • Next payment due: {mockTenantDetail.nextPaymentDue}
              </div>
              <div className="flex items-center gap-2 py-3 px-4 bg-white/20 rounded-lg backdrop-blur-sm">
                <span className="text-xl">🔥</span>
                <span className="font-semibold">
                  {mockTenantDetail.onTimeStreak} consecutive on-time payments
                </span>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold mb-5 text-midnight">Payment History</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-snow">
                    <tr>
                      <th className="text-left py-3 px-4 text-[11px] font-bold text-slate uppercase tracking-wide border-b border-cloud">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-[11px] font-bold text-slate uppercase tracking-wide border-b border-cloud">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-[11px] font-bold text-slate uppercase tracking-wide border-b border-cloud">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-[11px] font-bold text-slate uppercase tracking-wide border-b border-cloud">
                        Method
                      </th>
                      <th className="text-left py-3 px-4 text-[11px] font-bold text-slate uppercase tracking-wide border-b border-cloud">
                        Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTenantDetail.paymentHistory.map((payment) => (
                      <tr key={payment.id}>
                        <td className="py-4 px-4 border-b border-cloud text-sm last:border-b-0">
                          {payment.date}
                        </td>
                        <td className="py-4 px-4 border-b border-cloud text-sm last:border-b-0">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 border-b border-cloud text-sm last:border-b-0">
                          <Badge variant="success">Paid</Badge>
                        </td>
                        <td className="py-4 px-4 border-b border-cloud text-sm last:border-b-0">
                          {payment.method}
                        </td>
                        <td className="py-4 px-4 border-b border-cloud text-sm last:border-b-0">
                          <button className="bg-transparent border-none text-primary font-medium cursor-pointer p-0 text-sm font-body hover:underline">
                            📥 Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <button className="py-2 px-3 border border-cloud bg-white rounded-md cursor-pointer font-body text-sm text-slate transition-all duration-200 hover:border-primary hover:text-primary">
                  Previous
                </button>
                <button className="py-2 px-3 border border-primary bg-primary rounded-md cursor-pointer font-body text-sm text-white">
                  1
                </button>
                <button className="py-2 px-3 border border-cloud bg-white rounded-md cursor-pointer font-body text-sm text-slate transition-all duration-200 hover:border-primary hover:text-primary">
                  2
                </button>
                <button className="py-2 px-3 border border-cloud bg-white rounded-md cursor-pointer font-body text-sm text-slate transition-all duration-200 hover:border-primary hover:text-primary">
                  3
                </button>
                <button className="py-2 px-3 border border-cloud bg-white rounded-md cursor-pointer font-body text-sm text-slate transition-all duration-200 hover:border-primary hover:text-primary">
                  4
                </button>
                <button className="py-2 px-3 border border-cloud bg-white rounded-md cursor-pointer font-body text-sm text-slate transition-all duration-200 hover:border-primary hover:text-primary">
                  5
                </button>
                <button className="py-2 px-3 border border-cloud bg-white rounded-md cursor-pointer font-body text-sm text-slate transition-all duration-200 hover:border-primary hover:text-primary">
                  Next
                </button>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold mb-5 text-midnight">Internal Notes</h2>
              <p className="text-slate text-sm mb-3">
                Private notes only visible to you. Not shared with tenant.
              </p>
              <textarea
                className="w-full min-h-[120px] p-3 border border-cloud rounded-lg font-body text-sm resize-y focus:outline-none focus:border-primary"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this tenant..."
              />
              <div className="mt-3">
                <Button variant="primary">Save Notes</Button>
              </div>
            </div>
          </div>

          {/* Actions Panel */}
          <aside className="sticky top-8 flex flex-col gap-4 self-start lg:static">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-display text-xl font-bold mb-5 text-midnight">Actions</h3>
              <Button variant="primary" fullWidth>
                💬 Send Message
              </Button>
              <Button variant="outline" fullWidth>
                📥 Download Payment History
              </Button>
              <div className="h-px bg-cloud my-2" />
              <Button variant="danger" fullWidth onClick={() => setShowEndTenancyModal(true)}>
                End Tenancy
              </Button>
            </div>
          </aside>
        </div>

        {/* End Tenancy Modal */}
        {showEndTenancyModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
            onClick={() => setShowEndTenancyModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-[500px] w-[90%]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-display text-2xl font-bold mb-4">End Tenancy</h2>
              <div className="mb-6">
                <p className="text-slate leading-relaxed mb-4">
                  Are you sure you want to end {mockTenantDetail.name}'s tenancy at{' '}
                  {mockTenantDetail.property} - {mockTenantDetail.room}?
                </p>

                <div className="mb-4">
                  <label className="block font-semibold text-midnight mb-2 text-sm">End Date</label>
                  <input
                    type="date"
                    className="w-full py-2.5 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-semibold text-midnight mb-2 text-sm">
                    Reason (Optional)
                  </label>
                  <textarea
                    className="w-full py-2.5 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight min-h-[80px] resize-y focus:outline-none focus:border-primary"
                    placeholder="Reason for ending tenancy..."
                  />
                </div>

                <p className="text-[13px] text-coral mt-4">
                  ⚠️ This action cannot be undone. The tenant will be notified via email.
                </p>
              </div>
              <div className="flex gap-3 justify-end">
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
