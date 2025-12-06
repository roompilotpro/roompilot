import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { StatCard, Card, QuickActionCard, WalletCard, PropertyCard } from '../../components/cards'
import { Button, Avatar, Badge, IconButton } from '../../components/primitives'
import {
  mockProperties,
  mockPayments,
  mockPendingActions,
  mockDashboardStats,
  mockRevenueChart,
  mockWalletBalance,
} from '../../data/mockLandlordData'
import './LandlordDashboardPage.css'

function LandlordDashboardPage() {
  const navigate = useNavigate()
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [chartPeriod, setChartPeriod] = useState('month')

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const maxRevenue = Math.max(...mockRevenueChart.map((d) => d.amount))

  const headerContent = (
    <div className="dashboard-header-actions">
      <IconButton label="Search" variant="ghost">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </IconButton>
      <IconButton label="Notifications" variant="ghost" className="notification-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        <span className="notification-badge" />
      </IconButton>
      <Button
        variant="primary"
        leftIcon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
        }
        onClick={() => navigate(ROUTES.LANDLORD.PROPERTY_NEW)}
      >
        Add Property
      </Button>
    </div>
  )

  return (
    <AppShell
      sidebar={{
        links: navLinks,
        user,
        logoBadge,
      }}
      header={{
        title: 'Dashboard',
        subtitle: today,
        rightContent: headerContent,
      }}
    >
      <div className="dashboard-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon="💰"
            color="blue"
            value={`$${mockDashboardStats.revenue.value.toLocaleString()}`}
            label={mockDashboardStats.revenue.label}
            trendValue={mockDashboardStats.revenue.trend}
            trendDirection="positive"
          />
          <StatCard
            icon="🏠"
            color="green"
            value={`${mockDashboardStats.occupancy.value}%`}
            label={mockDashboardStats.occupancy.label}
            trendValue={mockDashboardStats.occupancy.trend}
            trendDirection="positive"
          />
          <StatCard
            icon="👥"
            color="amber"
            value={mockDashboardStats.tenants.value}
            label={mockDashboardStats.tenants.label}
          />
          <StatCard
            icon="📥"
            color="purple"
            value={mockDashboardStats.applications.value}
            label={mockDashboardStats.applications.label}
          />
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="dashboard-left">
            {/* Properties */}
            <Card
              title="Your Properties"
              headerAction={
                <Link to={ROUTES.LANDLORD.PROPERTIES} className="card-action-link">
                  View all &rarr;
                </Link>
              }
              padding="none"
              className="properties-card"
            >
              <div className="properties-table">
                {mockProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    imageUrl={property.imageUrl}
                    name={property.name}
                    address={property.address}
                    occupiedRooms={property.occupiedRooms}
                    totalRooms={property.totalRooms}
                    revenue={property.revenue}
                    status={property.status}
                    onView={() => navigate(`/landlord/properties/${property.id}`)}
                    onMenuClick={() => {}}
                  />
                ))}
              </div>
            </Card>

            {/* Revenue Chart */}
            <Card
              title="Revenue Overview"
              headerAction={
                <Link to={ROUTES.LANDLORD.PAYOUTS} className="card-action-link">
                  View reports &rarr;
                </Link>
              }
              className="chart-card"
            >
              <div className="chart-container">
                <div className="chart-header">
                  <div className="chart-tabs">
                    {['week', 'month', 'year'].map((period) => (
                      <button
                        key={period}
                        className={`chart-tab ${chartPeriod === period ? 'active' : ''}`}
                        onClick={() => setChartPeriod(period)}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="chart-total">
                    <div className="chart-total-label">December total</div>
                    <div className="chart-total-value">$8,450</div>
                  </div>
                </div>
                <div className="chart-bars">
                  {mockRevenueChart.map((data, index) => (
                    <div key={data.month} className="chart-bar-group">
                      <div
                        className={`chart-bar ${index === mockRevenueChart.length - 1 ? 'current' : ''}`}
                        style={{ height: `${(data.amount / maxRevenue) * 100}%` }}
                      >
                        <span className="chart-bar-tooltip">${data.amount.toLocaleString()}</span>
                      </div>
                      <span className="chart-bar-label">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Recent Payments */}
            <Card
              title="Recent Payments"
              headerAction={
                <Link to={ROUTES.LANDLORD.PAYOUTS} className="card-action-link">
                  View all &rarr;
                </Link>
              }
              padding="none"
              className="payments-card"
            >
              <div className="payments-list">
                {mockPayments.slice(0, 4).map((payment) => (
                  <div key={payment.id} className="payment-row">
                    <Avatar name={payment.tenant} size="md" />
                    <div className="payment-info">
                      <div className="payment-tenant">{payment.tenant}</div>
                      <div className="payment-property">
                        {payment.property} &middot; {payment.room}
                      </div>
                    </div>
                    <div className="payment-amount">
                      <div className="payment-value">+${payment.amount}</div>
                      <div className="payment-date">{payment.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="dashboard-right">
            {/* Payout Summary */}
            <WalletCard
              balance={mockWalletBalance.available}
              label="Available for payout"
              onAddFunds={() => navigate(ROUTES.LANDLORD.PAYOUTS)}
              className="payout-card"
            />

            {/* Pending Actions */}
            <Card title="Needs Attention" className="pending-card">
              <div className="pending-list">
                {mockPendingActions.map((action) => (
                  <Link key={action.id} to={action.href} className="pending-item">
                    <div className={`pending-icon ${action.icon === '📝' ? 'application' : action.icon === '💳' ? 'payment' : 'maintenance'}`}>
                      {action.icon}
                    </div>
                    <div className="pending-content">
                      <div className="pending-title">{action.title}</div>
                      <div className="pending-description">{action.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Automation Status */}
            <Card className="automation-card" padding="none">
              <div className="automation-header">
                <span className="automation-title">Automation Status</span>
              </div>
              <div className="automation-stats">
                <div className="automation-stat">
                  <div className="automation-stat-value">47</div>
                  <div className="automation-stat-label">Payments collected</div>
                </div>
                <div className="automation-stat">
                  <div className="automation-stat-value">12</div>
                  <div className="automation-stat-label">Reminders sent</div>
                </div>
                <div className="automation-stat">
                  <div className="automation-stat-value">3</div>
                  <div className="automation-stat-label">Late fees applied</div>
                </div>
              </div>
              <div className="automation-features">
                <div className="automation-feature">
                  <span className="automation-feature-dot" />
                  Auto-billing active
                </div>
                <div className="automation-feature">
                  <span className="automation-feature-dot" />
                  Reminders on
                </div>
                <div className="automation-feature">
                  <span className="automation-feature-dot" />
                  Late fees enabled
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions" padding="none" className="quick-actions-card">
              <div className="quick-actions-grid">
                <QuickActionCard icon="🏠" label="Add Room" onClick={() => navigate(ROUTES.LANDLORD.ROOM_NEW)} />
                <QuickActionCard icon="👤" label="Add Tenant" onClick={() => navigate(ROUTES.LANDLORD.TENANTS)} />
                <QuickActionCard icon="💬" label="Message" onClick={() => navigate(ROUTES.LANDLORD.MESSAGES)} />
                <QuickActionCard icon="📄" label="Reports" onClick={() => navigate(ROUTES.LANDLORD.PAYOUTS)} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export default LandlordDashboardPage
