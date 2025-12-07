import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button, Badge } from '../../components/primitives'

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
          <div className="flex items-center gap-3">
            Applications
            <Badge variant="primary">{pendingCount} Pending</Badge>
          </div>
        ),
      }}
    >
      <div>
        {/* Filter Bar */}
        <div className="bg-white py-5 px-6 rounded-xl mb-6 flex gap-4 items-center shadow-sm">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate uppercase tracking-wide">Property</label>
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
            <label className="text-xs font-bold text-slate uppercase tracking-wide">Status</label>
            <select
              className="py-2.5 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white min-w-[180px] cursor-pointer focus:outline-none focus:border-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium text-slate">Sort by:</span>
            <select
              className="py-2.5 px-3.5 border border-cloud rounded-lg font-body text-sm text-midnight bg-white min-w-[180px] cursor-pointer focus:outline-none focus:border-primary"
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
          <div className="bg-primary-bg py-4 px-6 rounded-xl mb-4 flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedApplications.size === mockApplicationsData.length}
              onChange={handleSelectAll}
              className="w-[18px] h-[18px] cursor-pointer"
            />
            <span className="font-medium text-primary-dark">
              {selectedApplications.size} applications selected
            </span>
            <div className="flex gap-2 ml-auto">
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
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-snow">
              <tr>
                <th
                  className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud"
                  style={{ width: '40px' }}
                ></th>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Applicant
                </th>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Property & Room
                </th>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Applied
                </th>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Move-in Date
                </th>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Background Check
                </th>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Status
                </th>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate uppercase tracking-wide border-b border-cloud">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockApplicationsData.map((application) => (
                <tr key={application.id} className="transition-colors duration-200 hover:bg-snow">
                  <td className="py-5 px-5 border-b border-cloud last:border-b-0">
                    <input
                      type="checkbox"
                      checked={selectedApplications.has(application.id)}
                      onChange={() => handleSelectOne(application.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-[18px] h-[18px] cursor-pointer"
                    />
                  </td>
                  <td
                    className="py-5 px-5 border-b border-cloud cursor-pointer"
                    onClick={() => handleRowClick(application.id)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={application.applicant.avatar}
                        alt={application.applicant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex flex-col gap-0.5">
                        <div className="font-semibold text-midnight">
                          {application.applicant.name}
                        </div>
                        <div className="text-sm text-slate">{application.applicant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td
                    className="py-5 px-5 border-b border-cloud cursor-pointer"
                    onClick={() => handleRowClick(application.id)}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="font-semibold text-midnight">{application.property}</div>
                      <div className="text-sm text-slate">{application.room}</div>
                    </div>
                  </td>
                  <td
                    className="py-5 px-5 border-b border-cloud cursor-pointer"
                    onClick={() => handleRowClick(application.id)}
                  >
                    <span className="text-sm text-slate">{application.appliedDate}</span>
                  </td>
                  <td
                    className="py-5 px-5 border-b border-cloud cursor-pointer"
                    onClick={() => handleRowClick(application.id)}
                  >
                    <span className="text-sm text-slate">{application.moveInDate}</span>
                  </td>
                  <td
                    className="py-5 px-5 border-b border-cloud cursor-pointer"
                    onClick={() => handleRowClick(application.id)}
                  >
                    {getBackgroundCheckBadge(application.backgroundCheck)}
                  </td>
                  <td
                    className="py-5 px-5 border-b border-cloud cursor-pointer"
                    onClick={() => handleRowClick(application.id)}
                  >
                    {getStatusBadge(application.status)}
                  </td>
                  <td className="py-5 px-5 border-b border-cloud">
                    <div className="flex gap-2">
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
