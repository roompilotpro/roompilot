import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Card } from '../../components/cards'
import { Button, Badge, IconButton } from '../../components/primitives'
import { Select } from '../../components/forms'
import { mockProperties } from '../../data/mockLandlordData'
import { classNames } from '../../utils'

function PropertiesListPage() {
  const navigate = useNavigate()
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [viewMode, setViewMode] = useState('grid')
  const [statusFilter, setStatusFilter] = useState('all')
  const [occupancyFilter, setOccupancyFilter] = useState('all')

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'issue', label: 'Has Issues' },
  ]

  const occupancyOptions = [
    { value: 'all', label: 'All Occupancy' },
    { value: 'full', label: 'Fully Occupied' },
    { value: 'partial', label: 'Partially Occupied' },
    { value: 'vacant', label: 'Vacant' },
  ]

  const filteredProperties = mockProperties.filter((property) => {
    if (statusFilter !== 'all' && property.status !== statusFilter) return false
    if (occupancyFilter !== 'all') {
      const occupancyRate = property.occupiedRooms / property.totalRooms
      if (occupancyFilter === 'full' && occupancyRate < 1) return false
      if (occupancyFilter === 'partial' && (occupancyRate === 0 || occupancyRate === 1))
        return false
      if (occupancyFilter === 'vacant' && occupancyRate > 0) return false
    }
    return true
  })

  const headerContent = (
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
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { variant: 'success', label: 'All good' }
      case 'pending':
        return { variant: 'warning', label: 'Vacancy' }
      case 'issue':
        return { variant: 'danger', label: 'Has Issues' }
      default:
        return { variant: 'default', label: status }
    }
  }

  const getPlaceholderGradient = (id) => {
    const idx = (parseInt(id, 10) % 3) + 1
    if (idx === 1) return 'bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe]'
    if (idx === 2) return 'bg-gradient-to-br from-[#fef3c7] to-[#fde68a]'
    return 'bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0]'
  }

  const getOccupancyBarColor = (occupied, total) => {
    const rate = occupied / total
    if (rate === 1) return 'bg-accent'
    if (rate >= 0.5) return 'bg-warm'
    return 'bg-coral'
  }

  return (
    <AppShell
      sidebar={{
        links: navLinks,
        user,
        logoBadge,
      }}
      header={{
        title: 'Properties',
        subtitle: `${mockProperties.length} properties`,
        rightContent: headerContent,
      }}
    >
      <div className="p-8 md:p-5">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-6 gap-4">
          <div className="flex gap-1 bg-white p-1 rounded-xl border border-cloud">
            <button
              className={classNames(
                'flex items-center justify-center w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer transition-all duration-200',
                viewMode === 'grid'
                  ? 'bg-primary-bg text-primary'
                  : 'text-slate hover:bg-snow hover:text-charcoal'
              )}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              className={classNames(
                'flex items-center justify-center w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer transition-all duration-200',
                viewMode === 'list'
                  ? 'bg-primary-bg text-primary'
                  : 'text-slate hover:bg-snow hover:text-charcoal'
              )}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="sm"
            />
            <Select
              options={occupancyOptions}
              value={occupancyFilter}
              onChange={(e) => setOccupancyFilter(e.target.value)}
              size="sm"
            />
          </div>
        </div>

        {/* Properties Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
            {filteredProperties.map((property) => {
              const statusInfo = getStatusBadge(property.status)
              return (
                <Card
                  key={property.id}
                  className="cursor-pointer overflow-hidden"
                  hoverable
                  padding="none"
                  onClick={() => navigate(`/landlord/properties/${property.id}`)}
                >
                  <div className="relative h-[180px] overflow-hidden">
                    <div
                      className={classNames(
                        'w-full h-full flex items-center justify-center text-5xl',
                        getPlaceholderGradient(property.id)
                      )}
                    >
                      🏠
                    </div>
                    <Badge variant={statusInfo.variant} className="absolute top-3 right-3">
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[17px] font-semibold text-charcoal mb-1">
                      {property.name}
                    </h3>
                    <p className="text-[13px] text-slate mb-4">{property.address}</p>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-slate">Occupancy</span>
                        <div className="flex items-center gap-2">
                          <div className="w-[60px] h-1.5 bg-cloud rounded-full overflow-hidden">
                            <div
                              className={classNames(
                                'h-full rounded-full transition-all duration-300',
                                getOccupancyBarColor(property.occupiedRooms, property.totalRooms)
                              )}
                              style={{
                                width: `${(property.occupiedRooms / property.totalRooms) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-[13px] text-slate">
                            {property.occupiedRooms}/{property.totalRooms}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-slate">Revenue</span>
                        <span className="text-sm font-semibold text-charcoal">
                          ${property.revenue.toLocaleString()}/mo
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card padding="none">
            <div className="w-full">
              {filteredProperties.map((property, index) => {
                const statusInfo = getStatusBadge(property.status)
                return (
                  <div
                    key={property.id}
                    className={classNames(
                      'grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_1fr_auto] lg:grid-cols-[2fr_1fr_1fr_1fr_auto] items-center py-4 px-6 cursor-pointer transition-all duration-200 hover:bg-snow gap-3',
                      index < filteredProperties.length - 1 && 'border-b border-cloud'
                    )}
                    onClick={() => navigate(`/landlord/properties/${property.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <div
                          className={classNames(
                            'w-full h-full flex items-center justify-center text-2xl',
                            getPlaceholderGradient(property.id)
                          )}
                        >
                          🏠
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[15px] font-semibold text-charcoal mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                          {property.name}
                        </div>
                        <div className="text-[13px] text-slate">{property.address}</div>
                      </div>
                    </div>
                    <div className="hidden md:block text-center">
                      <div className="w-[60px] h-1.5 bg-cloud rounded-full overflow-hidden mx-auto">
                        <div
                          className={classNames(
                            'h-full rounded-full transition-all duration-300',
                            getOccupancyBarColor(property.occupiedRooms, property.totalRooms)
                          )}
                          style={{
                            width: `${(property.occupiedRooms / property.totalRooms) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-[13px] text-slate mt-1">
                        {property.occupiedRooms}/{property.totalRooms} rooms
                      </div>
                    </div>
                    <div className="hidden lg:block text-center">
                      <div className="font-display text-base font-bold text-charcoal">
                        ${property.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate">/month</div>
                    </div>
                    <div className="hidden md:block text-center">
                      <Badge variant={statusInfo.variant} dot>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <IconButton
                        label="View property"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/landlord/properties/${property.id}`)
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </IconButton>
                      <IconButton
                        label="More options"
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </IconButton>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {filteredProperties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="text-[64px] mb-4">🏠</div>
            <h3 className="font-display text-2xl font-semibold text-charcoal mb-2">
              No properties found
            </h3>
            <p className="text-[15px] text-slate mb-6">
              Try adjusting your filters or add a new property
            </p>
            <Button variant="primary" onClick={() => navigate(ROUTES.LANDLORD.PROPERTY_NEW)}>
              Add Property
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default PropertiesListPage
