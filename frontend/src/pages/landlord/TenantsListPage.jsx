import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button, Badge, Avatar } from '../../components/primitives'
import { Select } from '../../components/forms'
import { classNames } from '../../utils'

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
    <Button variant="outline" className="inline-flex items-center gap-1.5">
      📥 Export List
    </Button>
  )

  return (
    <AppShell
      sidebar={{ links: navLinks, user, logoBadge }}
      header={{
        title: (
          <div className="flex items-center gap-3">
            Tenants
            <Badge variant="primary">{totalTenants} Active</Badge>
          </div>
        ),
        rightContent: headerContent,
      }}
    >
      <div>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 md:grid-cols-1 gap-5 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="text-[13px] text-slate mb-2 font-medium">Total Active Tenants</div>
            <div className="font-display text-[32px] font-bold text-midnight">{totalTenants}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="text-[13px] text-slate mb-2 font-medium">Late Payments</div>
            <div className="font-display text-[32px] font-bold text-coral">{latePayments}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="text-[13px] text-slate mb-2 font-medium">Revenue at Risk</div>
            <div className="font-display text-[32px] font-bold text-warm">
              ${revenueAtRisk.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white py-5 px-6 rounded-xl mb-6 flex gap-4 items-center shadow-sm">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate uppercase tracking-wide">
              Property
            </label>
            <select
              className="py-2.5 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white min-w-[180px] cursor-pointer focus:outline-none focus:border-primary"
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              <option value="all">All Properties</option>
              <option value="sunset">Sunset Gardens</option>
              <option value="city">City View Apartments</option>
              <option value="oak">Oak Street House</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate uppercase tracking-wide">
              Payment Status
            </label>
            <select
              className="py-2.5 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white min-w-[180px] cursor-pointer focus:outline-none focus:border-primary"
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
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium text-slate">Sort by:</span>
            <select
              className="py-2.5 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white min-w-[180px] cursor-pointer focus:outline-none focus:border-primary"
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
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-snow">
              <tr>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Tenant
                </th>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Property & Room
                </th>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Move-in Date
                </th>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Payment Status
                </th>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Balance/Due
                </th>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockTenantsData.map((tenant) => (
                <tr
                  key={tenant.id}
                  onClick={() => handleRowClick(tenant.id)}
                  className="transition-colors duration-200 cursor-pointer hover:bg-snow"
                >
                  <td className="py-5 px-5 border-b border-cloud last:border-b-0">
                    <div className="flex items-center gap-3">
                      <img
                        src={tenant.avatar}
                        alt={tenant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex flex-col gap-0.5">
                        <div className="font-semibold text-midnight">{tenant.name}</div>
                        <div className="text-sm text-slate">{tenant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-5 border-b border-cloud last:border-b-0">
                    <div className="flex flex-col gap-0.5">
                      <div className="font-semibold text-midnight">{tenant.property}</div>
                      <div className="text-sm text-slate">{tenant.room}</div>
                    </div>
                  </td>
                  <td className="py-5 px-5 border-b border-cloud last:border-b-0">
                    <span className="text-sm text-slate">{tenant.moveInDate}</span>
                  </td>
                  <td className="py-5 px-5 border-b border-cloud last:border-b-0">
                    {getPaymentBadge(tenant)}
                  </td>
                  <td className="py-5 px-5 border-b border-cloud last:border-b-0">
                    <span
                      className={classNames(
                        'font-semibold',
                        tenant.balance > 0 ? 'text-coral' : 'text-midnight'
                      )}
                    >
                      ${tenant.balance}
                    </span>
                  </td>
                  <td className="py-5 px-5 border-b border-cloud last:border-b-0">
                    <div className="flex gap-2">
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
