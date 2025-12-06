import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Card, TenantCard, RequestCard } from '../../components/cards'
import { Button, Avatar, Badge, IconButton } from '../../components/primitives'
import { Tabs, Breadcrumb } from '../../components/navigation'
import {
  mockProperties,
  mockApplications,
  mockMaintenanceRequests,
} from '../../data/mockLandlordData'
import './PropertyDetailPage.css'

function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [activeTab, setActiveTab] = useState('overview')

  // Find property by ID
  const property = mockProperties.find((p) => p.id === id) || mockProperties[0]

  const breadcrumbItems = [
    { label: 'Properties', href: ROUTES.LANDLORD.PROPERTIES },
    { label: property.name },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'rooms', label: 'Rooms', badge: property.rooms?.length?.toString() },
    {
      id: 'tenants',
      label: 'Tenants',
      badge: property.rooms?.filter((r) => r.tenant).length?.toString(),
    },
    { id: 'applications', label: 'Applications', badge: '2' },
    { id: 'maintenance', label: 'Maintenance', badge: '1' },
  ]

  const headerContent = (
    <div className="property-header-actions">
      <Button
        variant="outline"
        leftIcon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        }
      >
        Edit Property
      </Button>
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
        onClick={() => navigate(ROUTES.LANDLORD.ROOM_NEW)}
      >
        Add Room
      </Button>
    </div>
  )

  const getRoomStatusBadge = (status) => {
    switch (status) {
      case 'occupied':
        return { variant: 'success', label: 'Occupied' }
      case 'vacant':
        return { variant: 'warning', label: 'Vacant' }
      default:
        return { variant: 'default', label: status }
    }
  }

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return { variant: 'success', label: 'Paid' }
      case 'late':
        return { variant: 'danger', label: 'Late' }
      case 'pending':
        return { variant: 'warning', label: 'Pending' }
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
        title: property.name,
        subtitle: property.address,
        rightContent: headerContent,
      }}
    >
      <div className="property-detail-content">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="property-breadcrumb" />

        {/* Property Header */}
        <div className="property-hero">
          <div className="property-hero-image">
            <div className="property-placeholder-large">🏠</div>
          </div>
          <div className="property-hero-info">
            <div className="property-hero-stats">
              <div className="property-hero-stat">
                <span className="property-hero-stat-value">{property.totalRooms}</span>
                <span className="property-hero-stat-label">Total Rooms</span>
              </div>
              <div className="property-hero-stat">
                <span className="property-hero-stat-value">{property.occupiedRooms}</span>
                <span className="property-hero-stat-label">Occupied</span>
              </div>
              <div className="property-hero-stat">
                <span className="property-hero-stat-value">
                  ${property.revenue.toLocaleString()}
                </span>
                <span className="property-hero-stat-label">Monthly Revenue</span>
              </div>
              <div className="property-hero-stat">
                <span className="property-hero-stat-value">{property.rating}</span>
                <span className="property-hero-stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="property-tabs" />

        {/* Tab Content */}
        <div className="property-tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="property-overview">
              <div className="property-overview-grid">
                <Card title="About This Property" className="property-about-card">
                  <p className="property-description">{property.description}</p>
                </Card>

                <Card title="Amenities" className="property-amenities-card">
                  <div className="amenities-grid">
                    {property.amenities?.map((amenity, index) => (
                      <div key={index} className="amenity-item">
                        <span className="amenity-icon">{amenity.icon}</span>
                        <span className="amenity-label">{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="House Rules" className="property-rules-card">
                  <ul className="rules-list">
                    {property.rules?.map((rule, index) => (
                      <li key={index} className="rule-item">
                        <span className="rule-icon">{rule.icon}</span>
                        <span className="rule-text">{rule.text}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {/* Rooms Tab */}
          {activeTab === 'rooms' && (
            <div className="property-rooms">
              <div className="rooms-grid">
                {property.rooms?.map((room) => {
                  const statusInfo = getRoomStatusBadge(room.status)
                  return (
                    <Card key={room.id} className="room-card" hoverable>
                      <div className="room-card-header">
                        <div className="room-card-info">
                          <h3 className="room-card-name">{room.name}</h3>
                          <p className="room-card-type">
                            {room.type} &middot; {room.bathroom}
                          </p>
                        </div>
                        <Badge variant={statusInfo.variant} dot>
                          {statusInfo.label}
                        </Badge>
                      </div>

                      <div className="room-card-details">
                        <div className="room-card-detail">
                          <span className="room-card-detail-label">Size</span>
                          <span className="room-card-detail-value">{room.size} sq ft</span>
                        </div>
                        <div className="room-card-detail">
                          <span className="room-card-detail-label">Price</span>
                          <span className="room-card-detail-value">${room.price}/mo</span>
                        </div>
                      </div>

                      {room.tenant ? (
                        <div className="room-card-tenant">
                          <Avatar name={room.tenant.name} size="sm" />
                          <div className="room-card-tenant-info">
                            <span className="room-card-tenant-name">{room.tenant.name}</span>
                            <span className="room-card-tenant-since">
                              Since {room.tenant.moveInDate}
                            </span>
                          </div>
                          <Badge
                            variant={getPaymentStatusBadge(room.tenant.paymentStatus).variant}
                            size="sm"
                          >
                            {getPaymentStatusBadge(room.tenant.paymentStatus).label}
                          </Badge>
                        </div>
                      ) : (
                        <div className="room-card-vacant">
                          <span className="room-card-vacant-text">
                            Available {room.availableDate || 'Now'}
                          </span>
                          <Button size="sm" variant="primary">
                            List Room
                          </Button>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tenants Tab */}
          {activeTab === 'tenants' && (
            <div className="property-tenants">
              <div className="tenants-grid">
                {property.rooms
                  ?.filter((room) => room.tenant)
                  .map((room) => (
                    <Card key={room.id} className="tenant-card" hoverable>
                      <div className="tenant-card-header">
                        <Avatar name={room.tenant.name} size="lg" />
                        <div className="tenant-card-info">
                          <h3 className="tenant-card-name">{room.tenant.name}</h3>
                          <p className="tenant-card-room">{room.name}</p>
                        </div>
                        <IconButton label="More options" variant="ghost">
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

                      <div className="tenant-card-details">
                        <div className="tenant-card-detail">
                          <span className="tenant-card-detail-label">Move-in Date</span>
                          <span className="tenant-card-detail-value">{room.tenant.moveInDate}</span>
                        </div>
                        <div className="tenant-card-detail">
                          <span className="tenant-card-detail-label">Monthly Rent</span>
                          <span className="tenant-card-detail-value">${room.price}</span>
                        </div>
                        <div className="tenant-card-detail">
                          <span className="tenant-card-detail-label">Payment Status</span>
                          <Badge
                            variant={getPaymentStatusBadge(room.tenant.paymentStatus).variant}
                            size="sm"
                          >
                            {getPaymentStatusBadge(room.tenant.paymentStatus).label}
                          </Badge>
                        </div>
                      </div>

                      <div className="tenant-card-actions">
                        <Button size="sm" variant="outline">
                          Message
                        </Button>
                        <Button size="sm" variant="ghost">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="property-applications">
              <div className="applications-list">
                {mockApplications.map((application) => (
                  <Card key={application.id} className="application-card" hoverable>
                    <div className="application-card-header">
                      <Avatar name={application.applicant.name} size="lg" />
                      <div className="application-card-info">
                        <h3 className="application-card-name">{application.applicant.name}</h3>
                        <p className="application-card-room">Applied for {application.room}</p>
                        <p className="application-card-date">{application.appliedDate}</p>
                      </div>
                      <Badge variant="warning">Pending Review</Badge>
                    </div>

                    <div className="application-card-contact">
                      <div className="application-card-contact-item">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <span>{application.applicant.email}</span>
                      </div>
                      <div className="application-card-contact-item">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                        </svg>
                        <span>{application.applicant.phone}</span>
                      </div>
                    </div>

                    <div className="application-card-actions">
                      <Button variant="danger" size="sm">
                        Decline
                      </Button>
                      <Button variant="primary" size="sm">
                        Approve
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div className="property-maintenance">
              <div className="maintenance-list">
                {mockMaintenanceRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    id={request.id}
                    title={request.title}
                    description={request.description}
                    category={request.category}
                    priority={request.priority}
                    location={request.location}
                    tenant={request.tenant}
                    timestamp={request.timestamp}
                    status={request.status}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

export default PropertyDetailPage
