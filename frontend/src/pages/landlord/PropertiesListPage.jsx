import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Card } from '../../components/cards'
import { Button, Badge, IconButton } from '../../components/primitives'
import { Select } from '../../components/forms'
import { mockProperties } from '../../data/mockLandlordData'
import './PropertiesListPage.css'

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
      if (occupancyFilter === 'partial' && (occupancyRate === 0 || occupancyRate === 1)) return false
      if (occupancyFilter === 'vacant' && occupancyRate > 0) return false
    }
    return true
  })

  const headerContent = (
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
  )

  const getOccupancyClass = (occupied, total) => {
    const rate = occupied / total
    if (rate === 1) return 'full'
    if (rate >= 0.5) return 'partial'
    return 'low'
  }

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
      <div className="properties-content">
        {/* Controls Bar */}
        <div className="properties-controls">
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>

          <div className="properties-filters">
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
          <div className="properties-grid">
            {filteredProperties.map((property) => {
              const statusInfo = getStatusBadge(property.status)
              return (
                <Card
                  key={property.id}
                  className="property-grid-card"
                  hoverable
                  padding="none"
                  onClick={() => navigate(`/landlord/properties/${property.id}`)}
                >
                  <div className="property-grid-image">
                    <div className={`property-placeholder img-${(parseInt(property.id, 10) % 3) + 1}`}>🏠</div>
                    <Badge variant={statusInfo.variant} className="property-status-badge">
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <div className="property-grid-content">
                    <h3 className="property-grid-name">{property.name}</h3>
                    <p className="property-grid-address">{property.address}</p>

                    <div className="property-grid-stats">
                      <div className="property-grid-stat">
                        <span className="property-grid-stat-label">Occupancy</span>
                        <div className="occupancy-indicator">
                          <div className="occupancy-bar">
                            <div
                              className={`occupancy-bar-fill ${getOccupancyClass(property.occupiedRooms, property.totalRooms)}`}
                              style={{ width: `${(property.occupiedRooms / property.totalRooms) * 100}%` }}
                            />
                          </div>
                          <span className="occupancy-text">
                            {property.occupiedRooms}/{property.totalRooms}
                          </span>
                        </div>
                      </div>
                      <div className="property-grid-stat">
                        <span className="property-grid-stat-label">Revenue</span>
                        <span className="property-grid-stat-value">${property.revenue.toLocaleString()}/mo</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card padding="none" className="properties-list-card">
            <div className="properties-list">
              {filteredProperties.map((property) => {
                const statusInfo = getStatusBadge(property.status)
                return (
                  <div
                    key={property.id}
                    className="property-list-row"
                    onClick={() => navigate(`/landlord/properties/${property.id}`)}
                  >
                    <div className="property-list-info">
                      <div className="property-list-image">
                        <div className={`property-placeholder img-${(parseInt(property.id, 10) % 3) + 1}`}>🏠</div>
                      </div>
                      <div className="property-list-details">
                        <div className="property-list-name">{property.name}</div>
                        <div className="property-list-address">{property.address}</div>
                      </div>
                    </div>
                    <div className="property-list-occupancy">
                      <div className="occupancy-bar">
                        <div
                          className={`occupancy-bar-fill ${getOccupancyClass(property.occupiedRooms, property.totalRooms)}`}
                          style={{ width: `${(property.occupiedRooms / property.totalRooms) * 100}%` }}
                        />
                      </div>
                      <div className="occupancy-text">
                        {property.occupiedRooms}/{property.totalRooms} rooms
                      </div>
                    </div>
                    <div className="property-list-revenue">
                      <div className="revenue-value">${property.revenue.toLocaleString()}</div>
                      <div className="revenue-period">/month</div>
                    </div>
                    <div className="property-list-status">
                      <Badge variant={statusInfo.variant} dot>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="property-list-actions">
                      <IconButton
                        label="View property"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/landlord/properties/${property.id}`)
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </IconButton>
                      <IconButton
                        label="More options"
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <div className="properties-empty">
            <div className="properties-empty-icon">🏠</div>
            <h3 className="properties-empty-title">No properties found</h3>
            <p className="properties-empty-text">Try adjusting your filters or add a new property</p>
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
