import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { StatCard, Card, QuickActionCard, PropertyCard } from '../../components/cards'
import { Button, Avatar, Badge, IconButton } from '../../components/primitives'
import { classNames } from '../../utils/classNames'
import {
  mockProperties,
  mockPayments,
  mockPendingActions,
  mockDashboardStats,
  mockRevenueChart,
  mockWalletBalance,
} from '../../data/mockLandlordData'

// Animation styles for pulse effect
const dashboardStyles = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`

// Pending icon background styles
const pendingIconStyles = {
  application: 'bg-primary-bg',
  payment: 'bg-coral-bg',
  maintenance: 'bg-warm-bg',
}

// Pending tag styles
const pendingTagStyles = {
  urgent: 'bg-coral-bg text-coral',
  new: 'bg-primary-bg text-primary',
}

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
    <div className="flex items-center gap-3">
      <IconButton label="Search" variant="ghost">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </IconButton>
      <IconButton label="Notifications" variant="ghost" className="relative">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full border-2 border-white" />
      </IconButton>
      <Button
        variant="primary"
        leftIcon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
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
    <>
      <style>{dashboardStyles}</style>
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
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
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
          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              {/* Properties */}
              <Card
                title="Your Properties"
                headerAction={
                  <Link
                    to={ROUTES.LANDLORD.PROPERTIES}
                    className="text-[13px] font-semibold text-primary no-underline hover:underline"
                  >
                    View all &rarr;
                  </Link>
                }
                padding="none"
              >
                <div className="w-full">
                  {mockProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      imageUrl={property.imageUrl}
                      placeholderColor={property.placeholderColor}
                      name={property.name}
                      address={property.address}
                      occupiedRooms={property.occupiedRooms}
                      totalRooms={property.totalRooms}
                      revenue={`$${property.revenue.toLocaleString()}/month`}
                      status={property.status}
                      statusLabel={property.statusLabel}
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
                  <Link
                    to={ROUTES.LANDLORD.PAYOUTS}
                    className="text-[13px] font-semibold text-primary no-underline hover:underline"
                  >
                    View reports &rarr;
                  </Link>
                }
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-1 bg-snow p-1 rounded-md">
                      {['week', 'month', 'year'].map((period) => (
                        <button
                          key={period}
                          className={classNames(
                            'py-2 px-4 rounded-sm text-[13px] font-medium border-none cursor-pointer transition-all duration-200',
                            chartPeriod === period
                              ? 'bg-white text-charcoal shadow-sm'
                              : 'bg-transparent text-slate'
                          )}
                          onClick={() => setChartPeriod(period)}
                        >
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate mb-0.5">December total</div>
                      <div className="font-display text-2xl font-bold text-midnight">$8,450</div>
                    </div>
                  </div>
                  <div className="flex items-end gap-3 h-[120px] md:h-40 pt-5">
                    {mockRevenueChart.map((data, index) => (
                      <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className={classNames(
                            'w-full max-w-10 rounded-t-md relative transition-all duration-300 cursor-pointer min-h-1 group',
                            index === mockRevenueChart.length - 1
                              ? 'bg-accent hover:bg-accent-dark'
                              : 'bg-primary hover:bg-primary-dark'
                          )}
                          style={{ height: `${(data.amount / maxRevenue) * 100}%` }}
                        >
                          <span className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-charcoal text-white py-1.5 px-2.5 rounded-md text-xs font-semibold whitespace-nowrap opacity-0 invisible transition-all duration-200 pointer-events-none group-hover:opacity-100 group-hover:visible">
                            ${data.amount.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs text-slate font-medium">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Recent Payments */}
              <Card
                title="Recent Payments"
                headerAction={
                  <Link
                    to={ROUTES.LANDLORD.PAYOUTS}
                    className="text-[13px] font-semibold text-primary no-underline hover:underline"
                  >
                    View all &rarr;
                  </Link>
                }
                padding="none"
              >
                <div>
                  {mockPayments.slice(0, 4).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center gap-4 py-4 px-6 border-b border-cloud last:border-b-0 transition-colors duration-200 hover:bg-snow"
                    >
                      <Avatar name={payment.tenant} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-charcoal mb-0.5">
                          {payment.tenant}
                        </div>
                        <div className="text-[13px] text-slate">
                          {payment.property} &middot; {payment.room}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-base font-bold text-accent mb-0.5">
                          +${payment.amount}
                        </div>
                        <div className="text-xs text-slate">{payment.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {/* Payout Summary */}
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
                }}
              >
                <div className="p-6 text-white">
                  <div className="text-[13px] opacity-80 mb-1">Available for payout</div>
                  <div className="font-display text-4xl font-bold mb-4">
                    $
                    {mockWalletBalance.available.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div className="flex gap-6 mb-5">
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                      </svg>
                      Next payout: {mockWalletBalance.nextPayout}
                    </div>
                  </div>
                  <button
                    className="w-full py-3.5 bg-white/20 border-none rounded-md text-white font-body text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-white/30"
                    onClick={() => navigate(ROUTES.LANDLORD.PAYOUTS)}
                  >
                    View Payout Details
                  </button>
                </div>
              </div>

              {/* Pending Actions */}
              <Card title="Needs Attention">
                <div className="flex flex-col -mx-2">
                  {mockPendingActions.map((action) => (
                    <Link
                      key={action.id}
                      to={action.href}
                      className="flex items-start gap-3.5 p-4 rounded-md transition-colors duration-200 cursor-pointer no-underline text-inherit hover:bg-snow"
                    >
                      <div
                        className={classNames(
                          'w-10 h-10 rounded-[10px] flex items-center justify-center text-xl shrink-0',
                          pendingIconStyles[action.type]
                        )}
                      >
                        {action.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-charcoal mb-0.5">
                          {action.title}
                        </div>
                        <div className="text-[13px] text-slate mb-2">{action.description}</div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate">{action.time}</span>
                          {action.tag && (
                            <span
                              className={classNames(
                                'text-[11px] font-semibold py-0.5 px-2 rounded uppercase tracking-wide',
                                pendingTagStyles[action.tag]
                              )}
                            >
                              {action.tag === 'new' ? 'New' : 'Urgent'}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>

              {/* Automation Status */}
              <Card
                padding="none"
                className="border-none"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-charcoal) 0%, var(--color-midnight) 100%)',
                }}
              >
                <div className="py-5 px-6 border-b border-white/10">
                  <span className="font-display text-lg font-semibold text-white">
                    🤖 Automation Status
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                  <div className="text-center p-4 bg-white/5 rounded-md">
                    <div className="font-display text-[28px] font-bold text-accent-light mb-1">
                      47
                    </div>
                    <div className="text-xs text-white/60">Payments collected</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-md">
                    <div className="font-display text-[28px] font-bold text-accent-light mb-1">
                      12
                    </div>
                    <div className="text-xs text-white/60">Reminders sent</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-md">
                    <div className="font-display text-[28px] font-bold text-accent-light mb-1">
                      3
                    </div>
                    <div className="text-xs text-white/60">Late fees applied</div>
                  </div>
                </div>
                <div className="flex gap-3 px-6 pb-6 flex-wrap">
                  <div className="flex items-center gap-2 py-2 px-3.5 bg-white/10 rounded-full text-[13px] text-white/90">
                    <span className="w-2 h-2 bg-accent rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
                    Auto-billing active
                  </div>
                  <div className="flex items-center gap-2 py-2 px-3.5 bg-white/10 rounded-full text-[13px] text-white/90">
                    <span className="w-2 h-2 bg-accent rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
                    Reminders on
                  </div>
                  <div className="flex items-center gap-2 py-2 px-3.5 bg-white/10 rounded-full text-[13px] text-white/90">
                    <span className="w-2 h-2 bg-accent rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
                    Late fees enabled
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card title="Quick Actions" padding="none">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-5 px-6">
                  <QuickActionCard
                    icon="🏠"
                    label="Add Room"
                    onClick={() => navigate(ROUTES.LANDLORD.ROOM_NEW)}
                  />
                  <QuickActionCard
                    icon="👤"
                    label="Add Tenant"
                    onClick={() => navigate(ROUTES.LANDLORD.TENANTS)}
                  />
                  <QuickActionCard
                    icon="💬"
                    label="Message"
                    onClick={() => navigate(ROUTES.LANDLORD.MESSAGES)}
                  />
                  <QuickActionCard
                    icon="📄"
                    label="Reports"
                    onClick={() => navigate(ROUTES.LANDLORD.PAYOUTS)}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </AppShell>
    </>
  )
}

export default LandlordDashboardPage
