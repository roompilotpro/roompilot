import { useState } from 'react'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import './MaintenancePage.css'

function MaintenancePage() {
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' or 'list'
  const [selectedProperty, setSelectedProperty] = useState('all')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  // Mock data for maintenance requests
  const requests = [
    {
      id: 1,
      title: 'Leaking Faucet',
      property: 'Sunset Villa',
      room: 'Room 3A',
      tenant: 'Sarah Martinez',
      date: '2 hours ago',
      priority: 'medium',
      status: 'new',
      type: 'plumbing',
      description:
        'The bathroom faucet has been dripping constantly for the past few days. It seems to be getting worse and is wasting water. The drip is coming from the handle area.',
    },
    {
      id: 2,
      title: 'Outlet Not Working',
      property: 'Oak Street',
      room: 'Room 2B',
      tenant: 'James Chen',
      date: '5 hours ago',
      priority: 'high',
      status: 'new',
      type: 'electrical',
    },
    {
      id: 3,
      title: 'Refrigerator Making Noise',
      property: 'Downtown Loft',
      room: 'Room 1A',
      tenant: 'Emily Parker',
      date: '1 day ago',
      priority: 'low',
      status: 'new',
      type: 'appliance',
    },
    {
      id: 4,
      title: 'Heater Not Working',
      property: 'Sunset Villa',
      room: 'Room 1B',
      tenant: 'Marcus Rodriguez',
      date: '2 days ago',
      priority: 'urgent',
      status: 'in-progress',
      type: 'hvac',
    },
    {
      id: 5,
      title: 'Low Water Pressure',
      property: 'Oak Street',
      room: 'Room 4C',
      tenant: 'Lisa Johnson',
      date: '3 days ago',
      priority: 'medium',
      status: 'in-progress',
      type: 'plumbing',
    },
    {
      id: 6,
      title: 'Dishwasher Repair',
      property: 'Sunset Villa',
      room: 'Kitchen',
      tenant: 'Common Area',
      date: '5 days ago',
      priority: 'medium',
      status: 'waiting',
      type: 'appliance',
    },
    {
      id: 7,
      title: 'Light Bulb Replacement',
      property: 'Oak Street',
      room: 'Room 1A',
      tenant: 'Alex Kim',
      date: '1 week ago',
      priority: 'low',
      status: 'resolved',
      type: 'electrical',
    },
  ]

  const getRequestsByStatus = (status) => {
    return requests.filter((req) => req.status === status)
  }

  const getIconForType = (type) => {
    const icons = {
      plumbing: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      electrical: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      hvac: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
      ),
      appliance: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      ),
    }
    return icons[type]
  }

  const openDetailModal = (request) => {
    setSelectedRequest(request)
    setShowDetailModal(true)
  }

  const closeModal = () => {
    setShowDetailModal(false)
    setSelectedRequest(null)
  }

  const headerContent = (
    <div className="maintenance-header-controls">
      <select
        className="property-filter"
        value={selectedProperty}
        onChange={(e) => setSelectedProperty(e.target.value)}
      >
        <option value="all">All Properties</option>
        <option value="sunset">Sunset Villa</option>
        <option value="oak">Oak Street Apartments</option>
        <option value="downtown">Downtown Loft</option>
      </select>
      <div className="view-toggle">
        <button
          className={viewMode === 'kanban' ? 'active' : ''}
          onClick={() => setViewMode('kanban')}
        >
          Kanban
        </button>
        <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
          List
        </button>
      </div>
    </div>
  )

  return (
    <AppShell
      sidebar={{ links: navLinks, user, logoBadge }}
      header={{
        title: 'Maintenance Requests',
        rightContent: headerContent,
      }}
    >
      <div className="maintenance-page">
        {/* Kanban View */}
        {viewMode === 'kanban' && (
          <div className="kanban-board">
            {/* New Column */}
            <div className="kanban-column">
              <div className="kanban-header">
                <span className="kanban-title">New</span>
                <span className="kanban-count">{getRequestsByStatus('new').length}</span>
              </div>
              <div className="kanban-cards">
                {getRequestsByStatus('new').map((request) => (
                  <div
                    key={request.id}
                    className="request-card"
                    onClick={() => openDetailModal(request)}
                  >
                    <div className="card-header">
                      <div className={`card-icon ${request.type}`}>
                        {getIconForType(request.type)}
                      </div>
                      <div className="card-content">
                        <div className="card-title">{request.title}</div>
                        <div className="card-property">
                          {request.property} - {request.room}
                        </div>
                        <div className="card-tenant">{request.tenant}</div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <span className="card-date">{request.date}</span>
                      <span className={`priority-badge priority-${request.priority}`}>
                        {request.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="kanban-column">
              <div className="kanban-header">
                <span className="kanban-title">In Progress</span>
                <span className="kanban-count">{getRequestsByStatus('in-progress').length}</span>
              </div>
              <div className="kanban-cards">
                {getRequestsByStatus('in-progress').map((request) => (
                  <div
                    key={request.id}
                    className="request-card"
                    onClick={() => openDetailModal(request)}
                  >
                    <div className="card-header">
                      <div className={`card-icon ${request.type}`}>
                        {getIconForType(request.type)}
                      </div>
                      <div className="card-content">
                        <div className="card-title">{request.title}</div>
                        <div className="card-property">
                          {request.property} - {request.room}
                        </div>
                        <div className="card-tenant">{request.tenant}</div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <span className="card-date">{request.date}</span>
                      <span className={`priority-badge priority-${request.priority}`}>
                        {request.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Waiting on Parts Column */}
            <div className="kanban-column">
              <div className="kanban-header">
                <span className="kanban-title">Waiting on Parts</span>
                <span className="kanban-count">{getRequestsByStatus('waiting').length}</span>
              </div>
              <div className="kanban-cards">
                {getRequestsByStatus('waiting').map((request) => (
                  <div
                    key={request.id}
                    className="request-card"
                    onClick={() => openDetailModal(request)}
                  >
                    <div className="card-header">
                      <div className={`card-icon ${request.type}`}>
                        {getIconForType(request.type)}
                      </div>
                      <div className="card-content">
                        <div className="card-title">{request.title}</div>
                        <div className="card-property">
                          {request.property} - {request.room}
                        </div>
                        <div className="card-tenant">{request.tenant}</div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <span className="card-date">{request.date}</span>
                      <span className={`priority-badge priority-${request.priority}`}>
                        {request.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolved Column */}
            <div className="kanban-column">
              <div className="kanban-header">
                <span className="kanban-title">Resolved</span>
                <span className="kanban-count">{getRequestsByStatus('resolved').length}</span>
              </div>
              <div className="kanban-cards">
                {getRequestsByStatus('resolved').map((request) => (
                  <div
                    key={request.id}
                    className="request-card"
                    onClick={() => openDetailModal(request)}
                  >
                    <div className="card-header">
                      <div className={`card-icon ${request.type}`}>
                        {getIconForType(request.type)}
                      </div>
                      <div className="card-content">
                        <div className="card-title">{request.title}</div>
                        <div className="card-property">
                          {request.property} - {request.room}
                        </div>
                        <div className="card-tenant">{request.tenant}</div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <span className="card-date">{request.date}</span>
                      <span className={`priority-badge priority-${request.priority}`}>
                        {request.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="list-view">
            <table className="list-table">
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Property</th>
                  <th>Tenant</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} onClick={() => openDetailModal(request)}>
                    <td>
                      <strong>{request.title}</strong>
                    </td>
                    <td>
                      {request.property} - {request.room}
                    </td>
                    <td>{request.tenant}</td>
                    <td>{request.date}</td>
                    <td>
                      <span className={`priority-badge priority-${request.priority}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td>{request.status.replace('-', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedRequest && (
          <div className="modal show" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{selectedRequest.title}</h2>
                <button className="modal-close" onClick={closeModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <span className="detail-label">Description</span>
                  <p className="detail-value">
                    {selectedRequest.description ||
                      'No description provided for this maintenance request.'}
                  </p>
                </div>

                <div className="detail-section">
                  <span className="detail-label">Property &amp; Tenant</span>
                  <p className="detail-value">
                    {selectedRequest.property} - {selectedRequest.room}
                    <br />
                    {selectedRequest.tenant}
                  </p>
                </div>

                <div className="detail-section">
                  <span className="detail-label">Photos</span>
                  <div className="photo-gallery">
                    <div className="photo-item">
                      <img src="https://via.placeholder.com/150" alt="Photo 1" />
                    </div>
                    <div className="photo-item">
                      <img src="https://via.placeholder.com/150" alt="Photo 2" />
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <span className="detail-label">Communication Thread</span>
                  <div className="thread-message">
                    <div className="thread-header">
                      <span className="thread-author">{selectedRequest.tenant}</span>
                      <span className="thread-time">{selectedRequest.date}</span>
                    </div>
                    <div className="thread-content">
                      {selectedRequest.description || 'Hi, can someone take a look at this issue?'}
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <span className="detail-label">Internal Notes</span>
                  <textarea
                    className="form-textarea"
                    placeholder="Add notes visible only to you..."
                  ></textarea>
                </div>

                <div className="detail-section">
                  <span className="detail-label">Assign Vendor</span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter vendor name or search..."
                  />
                </div>

                <div className="detail-section">
                  <span className="detail-label">Update Status</span>
                  <select className="form-select">
                    <option>New</option>
                    <option>In Progress</option>
                    <option>Waiting on Parts/Vendor</option>
                    <option>Resolved</option>
                  </select>
                </div>

                <div className="detail-section">
                  <button className="btn btn-success">Mark as Resolved</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default MaintenancePage
