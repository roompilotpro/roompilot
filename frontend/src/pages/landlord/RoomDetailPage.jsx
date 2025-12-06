import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button, Badge } from '../../components/primitives'
import './RoomDetailPage.css'

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
      <div className="room-detail-content">
        <div className="breadcrumb">
          <Link to={ROUTES.LANDLORD.PROPERTIES}>Properties</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to={`/landlord/properties/${mockRoomDetail.property.id}`}>
            {mockRoomDetail.property.name}
          </Link>
          <span className="breadcrumb-separator">›</span>
          <span>{mockRoomDetail.name}</span>
        </div>

        <div className="room-header">
          <div className="room-title-section">
            <h1>{mockRoomDetail.name}</h1>
            <p className="room-meta">
              {mockRoomDetail.property.name} • {mockRoomDetail.property.address}
            </p>
          </div>
          <div className="header-actions">
            <Badge variant={mockRoomDetail.status === 'occupied' ? 'success' : 'warning'}>
              {mockRoomDetail.status === 'occupied' ? 'Occupied' : 'Vacant'}
            </Badge>
            <Button variant="outline">Edit Room</Button>
          </div>
        </div>

        <div className="room-content-grid">
          {/* Left Column */}
          <div className="room-left-column">
            {/* Room Photos */}
            <div className="card">
              <h2 className="card-title">Room Photos</h2>
              <div className="photo-gallery">
                <div className="photo-item large">📷</div>
                <div className="photo-item">📷</div>
                <div className="photo-item">📷</div>
              </div>
            </div>

            {/* Room Details */}
            <div className="card">
              <h2 className="card-title">Room Details</h2>
              <div className="detail-row">
                <span className="detail-label">Room Type</span>
                <span className="detail-value">{mockRoomDetail.details.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Bathroom</span>
                <span className="detail-value">{mockRoomDetail.details.bathroom}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Size</span>
                <span className="detail-value">{mockRoomDetail.details.size} sq ft</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Bed Type</span>
                <span className="detail-value">{mockRoomDetail.details.bedType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Furnished</span>
                <span className="detail-value">{mockRoomDetail.details.furnished}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Availability</span>
                <span className="detail-value">{mockRoomDetail.details.availability}</span>
              </div>
            </div>

            {/* Room Amenities */}
            <div className="card">
              <h2 className="card-title">Room Amenities</h2>
              <div className="amenities-list">
                {mockRoomDetail.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-icon">{amenity.icon}</span>
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Tenant */}
            <div className="card">
              <h2 className="card-title">Current Tenant</h2>
              <div className="tenant-section">
                <div className="tenant-avatar">{mockRoomDetail.tenant.initials}</div>
                <div className="tenant-info">
                  <div className="tenant-name">{mockRoomDetail.tenant.name}</div>
                  <div className="tenant-meta">Moved in: {mockRoomDetail.tenant.moveInDate}</div>
                  <div className="payment-indicator">✓ Payment on time</div>
                  <div className="tenant-actions">
                    <Button variant="outline">Message Tenant</Button>
                    <Button variant="outline">View Payments</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="card">
              <h2 className="card-title">Payment History</h2>
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Amount</th>
                    <th>Date Paid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRoomDetail.paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.month}</td>
                      <td>${payment.amount.toFixed(2)}</td>
                      <td>{payment.datePaid}</td>
                      <td>
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
          <div className="room-right-column">
            {/* Pricing */}
            <div className="card">
              <h2 className="card-title">Pricing</h2>
              <div className="form-group">
                <label className="form-label">Monthly Rent</label>
                <div className="editable-field">
                  <div className="rent-value">${mockRoomDetail.pricing.monthlyRent}</div>
                  <button className="edit-btn" onClick={() => setIsEditingRent(!isEditingRent)}>
                    Edit
                  </button>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-label">Weekly Rate</span>
                <span className="detail-value">${mockRoomDetail.pricing.weeklyRate}</span>
              </div>
            </div>

            {/* Billing Settings */}
            <div className="card">
              <h2 className="card-title">Billing Settings</h2>
              <div className="form-group">
                <label className="form-label">Late Fee</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={`$${mockRoomDetail.pricing.lateFee}`}
                  />
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={`After ${mockRoomDetail.pricing.lateFeeAfter}`}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Move-in Fee</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={`$${mockRoomDetail.pricing.moveInFee}`}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Security Deposit</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={`$${mockRoomDetail.pricing.securityDeposit}`}
                />
              </div>
            </div>

            {/* Lease Information */}
            <div className="card">
              <h2 className="card-title">Lease Information</h2>
              <div className="detail-row">
                <span className="detail-label">Lease Start</span>
                <span className="detail-value">{mockRoomDetail.lease.start}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Lease End</span>
                <span className="detail-value">{mockRoomDetail.lease.end}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Minimum Stay</span>
                <span className="detail-value">{mockRoomDetail.lease.minimumStay}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Notice Period</span>
                <span className="detail-value">{mockRoomDetail.lease.noticePeriod}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <h2 className="card-title">Actions</h2>
              <Button variant="danger" fullWidth>
                End Tenancy
              </Button>
              <p className="action-note">
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
