import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button, Badge, Avatar } from '../../components/primitives'
import { Select } from '../../components/forms'
import './TenantsListPage.css'

// Mock data for tenants list
const mockTenantsData = [
  {
    id: 't1',
    name: 'Emma Wilson',
    email: 'emma.w@email.com',
    avatar: 'https://i.pravatar.cc/150?img=10',
    property: 'Sunset Gardens',
    room: 'Room 1A',
    moveInDate: 'Mar 1, 2024',
    paymentStatus: 'current',
    balance: 0,
  },
  {
    id: 't2',
    name: 'James Lee',
    email: 'james.lee@email.com',
    avatar: 'https://i.pravatar.cc/150?img=11',
    property: 'City View Apartments',
    room: 'Studio 3B',
    moveInDate: 'Jan 15, 2024',
    paymentStatus: 'due-soon',
    daysUntilDue: 3,
    balance: 950,
  },
  {
    id: 't3',
    name: 'Sophia Martinez',
    email: 'sophia.m@email.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
    property: 'Oak Street House',
    room: 'Room 2',
    moveInDate: 'Jun 1, 2024',
    paymentStatus: 'late',
    daysLate: 5,
    balance: 850,
  },
  {
    id: 't4',
    name: 'Michael Chen',
    email: 'michael.c@email.com',
    avatar: 'https://i.pravatar.cc/150?img=13',
    property: 'Sunset Gardens',
    room: 'Room 2C',
    moveInDate: 'Feb 10, 2024',
    paymentStatus: 'current',
    balance: 0,
  },
  {
    id: 't5',
    name: 'Olivia Brown',
    email: 'olivia.b@email.com',
    avatar: 'https://i.pravatar.cc/150?img=14',
    property: 'City View Apartments',
    room: 'Room 5A',
    moveInDate: 'Apr 20, 2024',
    paymentStatus: 'at-risk',
    daysLate: 15,
    balance: 1700,
  },
  {
    id: 't6',
    name: 'Daniel Kim',
    email: 'daniel.k@email.com',
    avatar: 'https://i.pravatar.cc/150?img=15',
    property: 'Oak Street House',
    room: 'Room 1',
    moveInDate: 'May 5, 2024',
    paymentStatus: 'current',
    balance: 0,
  },
  {
    id: 't7',
    name: 'Ava Johnson',
    email: 'ava.j@email.com',
    avatar: 'https://i.pravatar.cc/150?img=16',
    property: 'Sunset Gardens',
    room: 'Room 3B',
    moveInDate: 'Jul 1, 2024',
    paymentStatus: 'due-soon',
    daysUntilDue: 1,
    balance: 800,
  },
  {
    id: 't8',
    name: 'Liam Garcia',
    email: 'liam.g@email.com',
    avatar: 'https://i.pravatar.cc/150?img=17',
    property: 'City View Apartments',
    room: 'Studio 2A',
    moveInDate: 'Aug 15, 2024',
    paymentStatus: 'current',
    balance: 0,
  },
]

function TenantsListPage() {
  const navigate = useNavigate()
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [propertyFilter, setPropertyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name-asc')

  const totalTenants = mockTenantsData.length
  const latePayments = mockTenantsData.filter(
    (t) => t.paymentStatus === 'late' || t.paymentStatus === 'at-risk'
  ).length
  const revenueAtRisk = mockTenantsData
    .filter((t) => t.paymentStatus === 'late' || t.paymentStatus === 'at-risk')
    .reduce((sum, t) => sum + t.balance, 0)

  const getPaymentBadge = (tenant) => {
    if (tenant.paymentStatus === 'current') {
      return <Badge variant="success">Current</Badge>
    } else if (tenant.paymentStatus === 'due-soon') {
      return (
        <Badge variant="warning">
          Due in {tenant.daysUntilDue} {tenant.daysUntilDue === 1 ? 'Day' : 'Days'}
        </Badge>
      )
    } else if (tenant.paymentStatus === 'late') {
      return <Badge variant="danger">Late ({tenant.daysLate} days)</Badge>
    } else if (tenant.paymentStatus === 'at-risk') {
      return <Badge variant="error">At Risk ({tenant.daysLate} days late)</Badge>
    }
    return null
  }

  const handleRowClick = (tenantId) => {
    navigate(`/landlord/tenants/${tenantId}`)
  }

  const headerContent = (
    <Button variant="outline" className="export-btn">
      📥 Export List
    </Button>
  )

  return (
    <AppShell
      sidebar={{ links: navLinks, user, logoBadge }}
      header={{
        title: (
          <div className="tenants-header-title">
            Tenants
            <Badge variant="primary">{totalTenants} Active</Badge>
          </div>
        ),
        rightContent: headerContent,
      }}
    >
      <div className="tenants-content">
        {/* Summary Stats */}
        <div className="tenants-stats">
          <div className="stat-card">
            <div className="stat-label">Total Active Tenants</div>
            <div className="stat-value">{totalTenants}</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-label">Late Payments</div>
            <div className="stat-value">{latePayments}</div>
          </div>
          <div className="stat-card revenue">
            <div className="stat-label">Revenue at Risk</div>
            <div className="stat-value">${revenueAtRisk.toLocaleString()}</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="tenants-filter-bar">
          <div className="filter-group">
            <label className="filter-label">Property</label>
            <select
              className="filter-select"
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              <option value="all">All Properties</option>
              <option value="sunset">Sunset Gardens</option>
              <option value="city">City View Apartments</option>
              <option value="oak">Oak Street House</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Payment Status</label>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="current">Current</option>
              <option value="due-soon">Due Soon</option>
              <option value="late">Late</option>
              <option value="at-risk">At Risk</option>
            </select>
          </div>
          <div className="sort-group">
            <span className="sort-label">Sort by:</span>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="move-in">Move-in Date</option>
              <option value="status">Payment Status</option>
              <option value="balance">Balance Due</option>
            </select>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="tenants-table-container">
          <table className="tenants-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Property & Room</th>
                <th>Move-in Date</th>
                <th>Payment Status</th>
                <th>Balance/Due</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockTenantsData.map((tenant) => (
                <tr
                  key={tenant.id}
                  onClick={() => handleRowClick(tenant.id)}
                  className="tenant-row"
                >
                  <td>
                    <div className="tenant-cell">
                      <img src={tenant.avatar} alt={tenant.name} className="tenant-avatar" />
                      <div className="tenant-info">
                        <div className="tenant-name">{tenant.name}</div>
                        <div className="tenant-email">{tenant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="property-cell">
                      <div className="property-name">{tenant.property}</div>
                      <div className="property-room">{tenant.room}</div>
                    </div>
                  </td>
                  <td>
                    <span className="date-text">{tenant.moveInDate}</span>
                  </td>
                  <td>{getPaymentBadge(tenant)}</td>
                  <td>
                    <span className={`balance-text ${tenant.balance > 0 ? 'negative' : ''}`}>
                      ${tenant.balance}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('Message tenant:', tenant.id)
                        }}
                      >
                        💬 Message
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(tenant.id)
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  )
}

export default TenantsListPage
