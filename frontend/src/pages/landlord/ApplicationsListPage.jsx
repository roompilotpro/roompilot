import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button, Badge } from '../../components/primitives'
import './ApplicationsListPage.css'

// Mock applications data
const mockApplicationsData = [
  {
    id: 'a1',
    applicant: {
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    property: 'Sunset Gardens',
    room: 'Room 2A',
    appliedDate: '2 days ago',
    moveInDate: 'Jan 15, 2026',
    backgroundCheck: 'clear',
    status: 'pending',
  },
  {
    id: 'a2',
    applicant: {
      name: 'Marcus Johnson',
      email: 'marcus.j@email.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    property: 'City View Apartments',
    room: 'Studio 5B',
    appliedDate: '3 days ago',
    moveInDate: 'Feb 1, 2026',
    backgroundCheck: 'pending',
    status: 'pending',
  },
  {
    id: 'a3',
    applicant: {
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    property: 'Oak Street House',
    room: 'Room 1',
    appliedDate: '5 days ago',
    moveInDate: 'Jan 20, 2026',
    backgroundCheck: 'review',
    status: 'pending',
  },
  {
    id: 'a4',
    applicant: {
      name: 'David Park',
      email: 'david.park@email.com',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    property: 'Sunset Gardens',
    room: 'Room 3C',
    appliedDate: '1 week ago',
    moveInDate: 'Jan 10, 2026',
    backgroundCheck: 'clear',
    status: 'approved',
  },
  {
    id: 'a5',
    applicant: {
      name: 'Lisa Thompson',
      email: 'lisa.t@email.com',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    property: 'City View Apartments',
    room: 'Room 4A',
    appliedDate: '1 week ago',
    moveInDate: 'Dec 28, 2025',
    backgroundCheck: 'clear',
    status: 'declined',
  },
]

function ApplicationsListPage() {
  const navigate = useNavigate()
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [selectedApplications, setSelectedApplications] = useState(new Set())
  const [propertyFilter, setPropertyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const pendingCount = mockApplicationsData.filter((app) => app.status === 'pending').length

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(mockApplicationsData.map((app) => app.id))
      setSelectedApplications(allIds)
    } else {
      setSelectedApplications(new Set())
    }
  }

  const handleSelectOne = (id) => {
    const newSelection = new Set(selectedApplications)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedApplications(newSelection)
  }

  const getBackgroundCheckBadge = (status) => {
    if (status === 'clear') {
      return <Badge variant="success">Clear</Badge>
    } else if (status === 'pending') {
      return <Badge variant="warning">Pending</Badge>
    } else if (status === 'review') {
      return <Badge variant="warning">Review</Badge>
    }
    return null
  }

  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return <Badge variant="warning">Pending</Badge>
    } else if (status === 'approved') {
      return <Badge variant="success">Approved</Badge>
    } else if (status === 'declined') {
      return <Badge variant="danger">Declined</Badge>
    }
    return null
  }

  const handleRowClick = (appId) => {
    navigate(`/landlord/applications/${appId}`)
  }

  return (
    <AppShell
      sidebar={{ links: navLinks, user, logoBadge }}
      header={{
        title: (
          <div className="applications-header-title">
            Applications
            <Badge variant="primary">{pendingCount} Pending</Badge>
          </div>
        ),
      }}
    >
      <div className="applications-content">
        {/* Filter Bar */}
        <div className="applications-filter-bar">
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
            <label className="filter-label">Status</label>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div className="sort-group">
            <span className="sort-label">Sort by:</span>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="move-in">Move-in Date</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedApplications.size > 0 && (
          <div className="bulk-actions">
            <input
              type="checkbox"
              checked={selectedApplications.size === mockApplicationsData.length}
              onChange={handleSelectAll}
            />
            <span className="bulk-actions-text">
              {selectedApplications.size} applications selected
            </span>
            <div className="bulk-actions-buttons">
              <Button variant="success" size="sm">
                Approve Selected
              </Button>
              <Button variant="danger" size="sm">
                Decline Selected
              </Button>
            </div>
          </div>
        )}

        {/* Applications Table */}
        <div className="applications-table-container">
          <table className="applications-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Applicant</th>
                <th>Property & Room</th>
                <th>Applied</th>
                <th>Move-in Date</th>
                <th>Background Check</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockApplicationsData.map((application) => (
                <tr key={application.id} className="application-row">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedApplications.has(application.id)}
                      onChange={() => handleSelectOne(application.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td onClick={() => handleRowClick(application.id)}>
                    <div className="applicant-cell">
                      <img
                        src={application.applicant.avatar}
                        alt={application.applicant.name}
                        className="applicant-avatar"
                      />
                      <div className="applicant-info">
                        <div className="applicant-name">{application.applicant.name}</div>
                        <div className="applicant-email">{application.applicant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td onClick={() => handleRowClick(application.id)}>
                    <div className="property-cell">
                      <div className="property-name">{application.property}</div>
                      <div className="property-room">{application.room}</div>
                    </div>
                  </td>
                  <td onClick={() => handleRowClick(application.id)}>
                    <span className="date-text">{application.appliedDate}</span>
                  </td>
                  <td onClick={() => handleRowClick(application.id)}>
                    <span className="date-text">{application.moveInDate}</span>
                  </td>
                  <td onClick={() => handleRowClick(application.id)}>
                    {getBackgroundCheckBadge(application.backgroundCheck)}
                  </td>
                  <td onClick={() => handleRowClick(application.id)}>
                    {getStatusBadge(application.status)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(application.id)
                        }}
                      >
                        View
                      </Button>
                      {application.status === 'pending' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log('Approve:', application.id)
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log('Decline:', application.id)
                            }}
                          >
                            Decline
                          </Button>
                        </>
                      )}
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

export default ApplicationsListPage
