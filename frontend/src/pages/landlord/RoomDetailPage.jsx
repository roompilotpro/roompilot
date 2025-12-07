import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button, Badge } from '../../components/primitives'

// Mock room detail data
const mockRoomDetail = {
  id: 'r1',
  name: 'Room 1A',
  property: {
    name: 'Sunshine House',
    address: '123 Main Street, Boston, MA',
  },
  status: 'occupied',
  details: {
    type: 'Private Room',
    bathroom: 'Private',
    size: 150,
    bedType: 'Queen Bed',
    furnished: 'Yes',
    availability: 'Currently Occupied',
  },
  amenities: [
    { icon: '🛏️', label: 'Queen Bed' },
    { icon: '🚿', label: 'Private Bath' },
    { icon: '🪟', label: 'Large Window' },
    { icon: '🗄️', label: 'Closet' },
    { icon: '💡', label: 'Desk Lamp' },
    { icon: '🔌', label: 'Multiple Outlets' },
  ],
  pricing: {
    monthlyRent: 650,
    weeklyRate: 162.5,
    lateFee: 50,
    lateFeeAfter: '5 days',
    moveInFee: 650,
    securityDeposit: 650,
  },
  lease: {
    start: 'March 15, 2024',
    end: 'Month-to-month',
    minimumStay: '3 months',
    noticePeriod: '30 days',
  },
  tenant: {
    name: 'John Smith',
    initials: 'JS',
    moveInDate: 'March 15, 2024',
    paymentStatus: 'on-time',
  },
  paymentHistory: [
    {
      id: 'p1',
      month: 'December 2025',
      amount: 650,
      datePaid: 'Dec 1, 2025',
      status: 'paid',
    },
    {
      id: 'p2',
      month: 'November 2025',
      amount: 650,
      datePaid: 'Nov 1, 2025',
      status: 'paid',
    },
    {
      id: 'p3',
      month: 'October 2025',
      amount: 650,
      datePaid: 'Oct 2, 2025',
      status: 'paid',
    },
    {
      id: 'p4',
      month: 'September 2025',
      amount: 650,
      datePaid: 'Sep 1, 2025',
      status: 'paid',
    },
  ],
}

function RoomDetailPage() {
  useNavigate() // Hook required for future navigation
  useParams() // Hook required for future id usage
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [isEditingRent, setIsEditingRent] = useState(false)

  return (
    <AppShell sidebar={{ links: navLinks, user, logoBadge }}>
      <div>
        <div className="text-slate text-sm mb-6">
          <Link
            to={ROUTES.LANDLORD.PROPERTIES}
            className="text-primary no-underline hover:underline"
          >
            Properties
          </Link>
          <span className="mx-2">›</span>
          <Link
            to={`/landlord/properties/${mockRoomDetail.property.id}`}
            className="text-primary no-underline hover:underline"
          >
            {mockRoomDetail.property.name}
          </Link>
          <span className="mx-2">›</span>
          <span>{mockRoomDetail.name}</span>
        </div>

        <div className="flex justify-between items-start mb-8 lg:flex-col lg:gap-4">
          <div>
            <h1 className="font-display text-[32px] text-midnight mb-2">{mockRoomDetail.name}</h1>
            <p className="text-slate text-[15px]">
              {mockRoomDetail.property.name} • {mockRoomDetail.property.address}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Badge variant={mockRoomDetail.status === 'occupied' ? 'success' : 'warning'}>
              {mockRoomDetail.status === 'occupied' ? 'Occupied' : 'Vacant'}
            </Badge>
            <Button variant="outline">Edit Room</Button>
          </div>
        </div>

        <div className="grid grid-cols-[2fr_1fr] lg:grid-cols-1 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Room Photos */}
            <div className="bg-white rounded-xl border border-cloud p-6">
              <h2 className="text-lg font-bold text-midnight mb-4">Room Photos</h2>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="col-span-2 h-[300px] rounded-lg flex items-center justify-center text-[64px]"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-primary-bg) 0%, var(--color-accent-bg) 100%)',
                  }}
                >
                  📷
                </div>
                <div
                  className="h-[200px] rounded-lg flex items-center justify-center text-5xl"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-primary-bg) 0%, var(--color-accent-bg) 100%)',
                  }}
                >
                  📷
                </div>
                <div
                  className="h-[200px] rounded-lg flex items-center justify-center text-5xl"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-primary-bg) 0%, var(--color-accent-bg) 100%)',
                  }}
                >
                  📷
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div className="bg-white rounded-xl border border-cloud p-6">
              <h2 className="text-lg font-bold text-midnight mb-4">Room Details</h2>
              <div className="flex justify-between py-3 border-b border-cloud last:border-b-0">
                <span className="text-slate font-medium">Room Type</span>
                <span className="text-midnight font-semibold">{mockRoomDetail.details.type}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-cloud last:border-b-0">
                <span className="text-slate font-medium">Bathroom</span>
                <span className="text-midnight font-semibold">
                  {mockRoomDetail.details.bathroom}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-cloud last:border-b-0">
                <span className="text-slate font-medium">Size</span>
                <span className="text-midnight font-semibold">
                  {mockRoomDetail.details.size} sq ft
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-cloud last:border-b-0">
                <span className="text-slate font-medium">Bed Type</span>
                <span className="text-midnight font-semibold">
                  {mockRoomDetail.details.bedType}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-cloud last:border-b-0">
                <span className="text-slate font-medium">Furnished</span>
                <span className="text-midnight font-semibold">
                  {mockRoomDetail.details.furnished}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b-0">
                <span className="text-slate font-medium">Availability</span>
                <span className="text-midnight font-semibold">
                  {mockRoomDetail.details.availability}
                </span>
              </div>
            </div>

            {/* Room Amenities */}
            <div className="bg-white rounded-xl border border-cloud p-6">
              <h2 className="text-lg font-bold text-midnight mb-4">Room Amenities</h2>
              <div className="grid grid-cols-2 gap-2">
                {mockRoomDetail.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 py-2 text-midnight">
                    <span className="text-lg">{amenity.icon}</span>
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Tenant */}
            <div className="bg-white rounded-xl border border-cloud p-6">
              <h2 className="text-lg font-bold text-midnight mb-4">Current Tenant</h2>
              <div className="flex gap-4 items-start p-5 bg-snow rounded-lg">
                <div className="w-16 h-16 rounded-full bg-primary-bg flex items-center justify-center font-bold text-primary text-2xl shrink-0">
                  {mockRoomDetail.tenant.initials}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-midnight mb-1">
                    {mockRoomDetail.tenant.name}
                  </div>
                  <div className="text-slate text-sm mb-3">
                    Moved in: {mockRoomDetail.tenant.moveInDate}
                  </div>
                  <div className="inline-flex items-center gap-2 py-2 px-3 bg-accent-bg rounded-md text-[13px] font-semibold text-accent">
                    ✓ Payment on time
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline">Message Tenant</Button>
                    <Button variant="outline">View Payments</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl border border-cloud p-6">
              <h2 className="text-lg font-bold text-midnight mb-4">Payment History</h2>
              <table className="w-full border-collapse">
                <thead className="bg-snow">
                  <tr>
                    <th className="text-left p-3 border-b-2 border-cloud text-[13px] font-semibold text-slate">
                      Month
                    </th>
                    <th className="text-left p-3 border-b-2 border-cloud text-[13px] font-semibold text-slate">
                      Amount
                    </th>
                    <th className="text-left p-3 border-b-2 border-cloud text-[13px] font-semibold text-slate">
                      Date Paid
                    </th>
                    <th className="text-left p-3 border-b-2 border-cloud text-[13px] font-semibold text-slate">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockRoomDetail.paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td className="p-3 border-b border-cloud text-sm text-midnight last:border-b-0">
                        {payment.month}
                      </td>
                      <td className="p-3 border-b border-cloud text-sm text-midnight last:border-b-0">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="p-3 border-b border-cloud text-sm text-midnight last:border-b-0">
                        {payment.datePaid}
                      </td>
                      <td className="p-3 border-b border-cloud text-sm text-midnight last:border-b-0">
                        <Badge variant="success" size="sm">
                          Paid
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Pricing */}
            <div className="bg-white rounded-xl border border-cloud p-6">
              <h2 className="text-lg font-bold text-midnight mb-4">Pricing</h2>
              <div className="mb-4">
                <label className="block font-semibold text-midnight mb-2 text-sm">
                  Monthly Rent
                </label>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-midnight">
                    ${mockRoomDetail.pricing.monthlyRent}
                  </div>
                  <button
                    className="py-1 px-3 text-xs bg-transparent text-primary border border-primary rounded-md cursor-pointer font-semibold font-body hover:bg-primary-bg"
                    onClick={() => setIsEditingRent(!isEditingRent)}
                  >
                    Edit
                  </button>
                </div>
              </div>
              <div className="flex justify-between py-3 border-b-0">
                <span className="text-slate font-medium">Weekly Rate</span>
                <span className="text-midnight font-semibold">
                  ${mockRoomDetail.pricing.weeklyRate}
                </span>
              </div>
            </div>

            {/* Billing Settings */}
            <div className="bg-white rounded-xl border border-cloud p-6">
              <h2 className="text-lg font-bold text-midnight mb-4">Billing Settings</h2>
              <div className="mb-4">
                <label className="block font-semibold text-midnight mb-2 text-sm">Late Fee</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 py-2.5 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight focus:outline-none focus:border-primary"
                    defaultValue={`$${mockRoomDetail.pricing.lateFee}`}
                  />
                  <input
                    type="text"
                    className="flex-1 py-2.5 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight focus:outline-none focus:border-primary"
                    defaultValue={`After ${mockRoomDetail.pricing.lateFeeAfter}`}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-semibold text-midnight mb-2 text-sm">
                  Move-in Fee
                </label>
                <input
                  type="text"
                  className="w-full py-2.5 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight focus:outline-none focus:border-primary"
                  defaultValue={`$${mockRoomDetail.pricing.moveInFee}`}
                />
              </div>
              <div className="mb-0">
                <label className="block font-semibold text-midnight mb-2 text-sm">
                  Security Deposit
                </label>
                <input
                  type="text"
                  className="w-full py-2.5 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight focus:outline-none focus:border-primary"
                  defaultValue={`$${mockRoomDetail.pricing.securityDeposit}`}
                />
              </div>
            </div>

            {/* Lease Information */}
            <div className="bg-white rounded-xl border border-cloud p-6">
              <h2 className="text-lg font-bold text-midnight mb-4">Lease Information</h2>
              <div className="flex justify-between py-3 border-b border-cloud last:border-b-0">
                <span className="text-slate font-medium">Lease Start</span>
                <span className="text-midnight font-semibold">{mockRoomDetail.lease.start}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-cloud last:border-b-0">
                <span className="text-slate font-medium">Lease End</span>
                <span className="text-midnight font-semibold">{mockRoomDetail.lease.end}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-cloud last:border-b-0">
                <span className="text-slate font-medium">Minimum Stay</span>
                <span className="text-midnight font-semibold">
                  {mockRoomDetail.lease.minimumStay}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b-0">
                <span className="text-slate font-medium">Notice Period</span>
                <span className="text-midnight font-semibold">
                  {mockRoomDetail.lease.noticePeriod}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-cloud p-6">
              <h2 className="text-lg font-bold text-midnight mb-4">Actions</h2>
              <Button variant="danger" fullWidth>
                End Tenancy
              </Button>
              <p className="text-xs text-slate mt-2">
                This will notify the tenant and begin the move-out process
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export default RoomDetailPage
