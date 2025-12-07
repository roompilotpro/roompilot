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
    <div className="flex items-center gap-3">
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
      <div className="p-8 md:p-5">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Property Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 mb-8">
          <div className="h-[280px] rounded-2xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-[80px] bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe]">🏠</div>
          </div>
          <div className="flex flex-col justify-end">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-cloud text-center">
                <span className="block font-display text-[28px] font-bold text-midnight mb-1">{property.totalRooms}</span>
                <span className="text-[13px] text-slate">Total Rooms</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-cloud text-center">
                <span className="block font-display text-[28px] font-bold text-midnight mb-1">{property.occupiedRooms}</span>
                <span className="text-[13px] text-slate">Occupied</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-cloud text-center">
                <span className="block font-display text-[28px] font-bold text-midnight mb-1">
                  ${property.revenue.toLocaleString()}
                </span>
                <span className="text-[13px] text-slate">Monthly Revenue</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-cloud text-center">
                <span className="block font-display text-[28px] font-bold text-midnight mb-1">{property.rating}</span>
                <span className="text-[13px] text-slate">Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="About This Property" className="md:col-span-2">
                  <p className="text-[15px] leading-relaxed text-charcoal">{property.description}</p>
                </Card>

                <Card title="Amenities">
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
                    {property.amenities?.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2.5 p-3 bg-snow rounded-xl">
                        <span className="text-xl">{amenity.icon}</span>
                        <span className="text-sm text-charcoal">{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="House Rules">
                  <ul className="list-none m-0 p-0 flex flex-col gap-3">
                    {property.rules?.map((rule, index) => (
                      <li key={index} className="flex items-center gap-3 p-3 bg-snow rounded-xl">
                        <span className="text-xl">{rule.icon}</span>
                        <span className="text-sm text-charcoal">{rule.text}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {/* Rooms Tab */}
          {activeTab === 'rooms' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
                {property.rooms?.map((room) => {
                  const statusInfo = getRoomStatusBadge(room.status)
                  return (
                    <Card key={room.id} className="flex flex-col gap-4" hoverable>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-[17px] font-semibold text-charcoal mb-1">{room.name}</h3>
                          <p className="text-[13px] text-slate">
                            {room.type} &middot; {room.bathroom}
                          </p>
                        </div>
                        <Badge variant={statusInfo.variant} dot>
                          {statusInfo.label}
                        </Badge>
                      </div>

                      <div className="flex gap-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate">Size</span>
                          <span className="text-[15px] font-semibold text-charcoal">{room.size} sq ft</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate">Price</span>
                          <span className="text-[15px] font-semibold text-charcoal">${room.price}/mo</span>
                        </div>
                      </div>

                      {room.tenant ? (
                        <div className="flex items-center gap-3 p-3 bg-snow rounded-xl">
                          <Avatar name={room.tenant.name} size="sm" />
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm font-semibold text-charcoal">{room.tenant.name}</span>
                            <span className="text-xs text-slate">
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
                        <div className="flex items-center justify-between p-3 bg-warm-bg rounded-xl">
                          <span className="text-sm text-warm font-medium">
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
            <div>
              <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
                {property.rooms
                  ?.filter((room) => room.tenant)
                  .map((room) => (
                    <Card key={room.id} className="flex flex-col gap-4" hoverable>
                      <div className="flex items-center gap-4">
                        <Avatar name={room.tenant.name} size="lg" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[17px] font-semibold text-charcoal mb-1">{room.tenant.name}</h3>
                          <p className="text-[13px] text-slate">{room.name}</p>
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-snow rounded-xl">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate">Move-in Date</span>
                          <span className="text-sm font-semibold text-charcoal">{room.tenant.moveInDate}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate">Monthly Rent</span>
                          <span className="text-sm font-semibold text-charcoal">${room.price}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate">Payment Status</span>
                          <Badge
                            variant={getPaymentStatusBadge(room.tenant.paymentStatus).variant}
                            size="sm"
                          >
                            {getPaymentStatusBadge(room.tenant.paymentStatus).label}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-3">
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
            <div>
              <div className="flex flex-col gap-4">
                {mockApplications.map((application) => (
                  <Card key={application.id} className="flex flex-col gap-4" hoverable>
                    <div className="flex items-center gap-4">
                      <Avatar name={application.applicant.name} size="lg" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[17px] font-semibold text-charcoal mb-1">{application.applicant.name}</h3>
                        <p className="text-sm text-slate mb-0.5">Applied for {application.room}</p>
                        <p className="text-[13px] text-slate">{application.appliedDate}</p>
                      </div>
                      <Badge variant="warning">Pending Review</Badge>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 md:gap-6 p-3 bg-snow rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-slate">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-slate"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <span>{application.applicant.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-slate"
                        >
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                        </svg>
                        <span>{application.applicant.phone}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
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
            <div>
              <div className="flex flex-col gap-4">
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
