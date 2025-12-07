import { useState } from 'react'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { classNames } from '../../utils'

// Icon style config by type
const iconStyles = {
  plumbing: 'bg-primary-bg text-primary',
  electrical: 'bg-warm-bg text-warm',
  hvac: 'bg-accent-bg text-accent',
  appliance: 'bg-coral-bg text-coral',
}

// Priority badge style config
const priorityStyles = {
  low: 'bg-cloud text-slate',
  medium: 'bg-warm-bg text-warm',
  high: 'bg-coral-bg text-coral',
  urgent: 'bg-coral text-white',
}

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
    <div className="flex gap-4 items-center">
      <select
        className="py-2.5 px-4 border border-cloud rounded-lg font-body text-sm bg-white cursor-pointer"
        value={selectedProperty}
        onChange={(e) => setSelectedProperty(e.target.value)}
      >
        <option value="all">All Properties</option>
        <option value="sunset">Sunset Villa</option>
        <option value="oak">Oak Street Apartments</option>
        <option value="downtown">Downtown Loft</option>
      </select>
      <div className="flex bg-white border border-cloud rounded-lg overflow-hidden">
        <button
          className={classNames(
            'py-2.5 px-5 border-none bg-transparent text-slate font-body font-semibold cursor-pointer transition-all duration-200 text-sm',
            viewMode === 'kanban' && 'bg-primary text-white'
          )}
          onClick={() => setViewMode('kanban')}
        >
          Kanban
        </button>
        <button
          className={classNames(
            'py-2.5 px-5 border-none bg-transparent text-slate font-body font-semibold cursor-pointer transition-all duration-200 text-sm',
            viewMode === 'list' && 'bg-primary text-white'
          )}
          onClick={() => setViewMode('list')}
        >
          List
        </button>
      </div>
    </div>
  )

  const renderRequestCard = (request) => (
    <div
      key={request.id}
      className="bg-snow border border-cloud rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-md"
      onClick={() => openDetailModal(request)}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className={classNames(
            'w-8 h-8 rounded-md flex items-center justify-center shrink-0',
            iconStyles[request.type]
          )}
        >
          {getIconForType(request.type)}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-midnight mb-1">{request.title}</div>
          <div className="text-[13px] text-slate mb-2">
            {request.property} - {request.room}
          </div>
          <div className="text-[13px] text-slate">{request.tenant}</div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-cloud">
        <span className="text-xs text-slate">{request.date}</span>
        <span
          className={classNames(
            'py-1 px-2.5 rounded text-[11px] font-semibold uppercase',
            priorityStyles[request.priority]
          )}
        >
          {request.priority}
        </span>
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
      <div className="h-full">
        {/* Kanban View */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-4 xl:grid-cols-2 md:grid-cols-1 gap-6 h-[calc(100vh-200px)]">
            {/* New Column */}
            <div className="bg-white rounded-xl p-5 flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-cloud">
                <span className="font-bold text-base text-midnight">New</span>
                <span className="bg-cloud text-slate py-1 px-3 rounded-xl text-sm font-semibold">
                  {getRequestsByStatus('new').length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                {getRequestsByStatus('new').map(renderRequestCard)}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-white rounded-xl p-5 flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-cloud">
                <span className="font-bold text-base text-midnight">In Progress</span>
                <span className="bg-cloud text-slate py-1 px-3 rounded-xl text-sm font-semibold">
                  {getRequestsByStatus('in-progress').length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                {getRequestsByStatus('in-progress').map(renderRequestCard)}
              </div>
            </div>

            {/* Waiting on Parts Column */}
            <div className="bg-white rounded-xl p-5 flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-cloud">
                <span className="font-bold text-base text-midnight">Waiting on Parts</span>
                <span className="bg-cloud text-slate py-1 px-3 rounded-xl text-sm font-semibold">
                  {getRequestsByStatus('waiting').length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                {getRequestsByStatus('waiting').map(renderRequestCard)}
              </div>
            </div>

            {/* Resolved Column */}
            <div className="bg-white rounded-xl p-5 flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-cloud">
                <span className="font-bold text-base text-midnight">Resolved</span>
                <span className="bg-cloud text-slate py-1 px-3 rounded-xl text-sm font-semibold">
                  {getRequestsByStatus('resolved').length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                {getRequestsByStatus('resolved').map(renderRequestCard)}
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-snow py-4 px-4 text-left font-bold text-midnight text-sm border-b-2 border-cloud">
                    Issue
                  </th>
                  <th className="bg-snow py-4 px-4 text-left font-bold text-midnight text-sm border-b-2 border-cloud">
                    Property
                  </th>
                  <th className="bg-snow py-4 px-4 text-left font-bold text-midnight text-sm border-b-2 border-cloud">
                    Tenant
                  </th>
                  <th className="bg-snow py-4 px-4 text-left font-bold text-midnight text-sm border-b-2 border-cloud">
                    Date
                  </th>
                  <th className="bg-snow py-4 px-4 text-left font-bold text-midnight text-sm border-b-2 border-cloud">
                    Priority
                  </th>
                  <th className="bg-snow py-4 px-4 text-left font-bold text-midnight text-sm border-b-2 border-cloud">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-snow cursor-pointer"
                    onClick={() => openDetailModal(request)}
                  >
                    <td className="py-4 px-4 border-b border-cloud text-sm">
                      <strong>{request.title}</strong>
                    </td>
                    <td className="py-4 px-4 border-b border-cloud text-sm">
                      {request.property} - {request.room}
                    </td>
                    <td className="py-4 px-4 border-b border-cloud text-sm">{request.tenant}</td>
                    <td className="py-4 px-4 border-b border-cloud text-sm">{request.date}</td>
                    <td className="py-4 px-4 border-b border-cloud text-sm">
                      <span
                        className={classNames(
                          'py-1 px-2.5 rounded text-[11px] font-semibold uppercase',
                          priorityStyles[request.priority]
                        )}
                      >
                        {request.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4 border-b border-cloud text-sm capitalize">
                      {request.status.replace('-', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedRequest && (
          <div
            className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center overflow-y-auto py-10 px-5"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-xl max-w-[800px] w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-6 px-8 border-b border-cloud flex justify-between items-center">
                <h2 className="font-display text-2xl font-bold text-midnight">
                  {selectedRequest.title}
                </h2>
                <button
                  className="bg-transparent border-none text-[28px] text-slate cursor-pointer p-0 w-8 h-8 flex items-center justify-center"
                  onClick={closeModal}
                >
                  &times;
                </button>
              </div>
              <div className="p-8">
                <div className="mb-8">
                  <span className="font-bold text-midnight mb-2 block">Description</span>
                  <p className="text-slate leading-relaxed">
                    {selectedRequest.description ||
                      'No description provided for this maintenance request.'}
                  </p>
                </div>

                <div className="mb-8">
                  <span className="font-bold text-midnight mb-2 block">Property &amp; Tenant</span>
                  <p className="text-slate leading-relaxed">
                    {selectedRequest.property} - {selectedRequest.room}
                    <br />
                    {selectedRequest.tenant}
                  </p>
                </div>

                <div className="mb-8">
                  <span className="font-bold text-midnight mb-2 block">Photos</span>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                    <div className="aspect-square rounded-lg overflow-hidden cursor-pointer">
                      <img
                        src="https://via.placeholder.com/150"
                        alt="Photo 1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden cursor-pointer">
                      <img
                        src="https://via.placeholder.com/150"
                        alt="Photo 2"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <span className="font-bold text-midnight mb-2 block">Communication Thread</span>
                  <div className="p-4 bg-snow rounded-lg mb-3">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-midnight">{selectedRequest.tenant}</span>
                      <span className="text-[13px] text-slate">{selectedRequest.date}</span>
                    </div>
                    <div className="text-slate">
                      {selectedRequest.description || 'Hi, can someone take a look at this issue?'}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <span className="font-bold text-midnight mb-2 block">Internal Notes</span>
                  <textarea
                    className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm resize-y min-h-[100px]"
                    placeholder="Add notes visible only to you..."
                  ></textarea>
                </div>

                <div className="mb-8">
                  <span className="font-bold text-midnight mb-2 block">Assign Vendor</span>
                  <input
                    type="text"
                    className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm"
                    placeholder="Enter vendor name or search..."
                  />
                </div>

                <div className="mb-8">
                  <span className="font-bold text-midnight mb-2 block">Update Status</span>
                  <select className="w-full py-3 px-4 border border-cloud rounded-lg font-body text-sm">
                    <option>New</option>
                    <option>In Progress</option>
                    <option>Waiting on Parts/Vendor</option>
                    <option>Resolved</option>
                  </select>
                </div>

                <div>
                  <button className="py-3 px-6 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 border-none font-body bg-accent text-white hover:bg-accent-dark">
                    Mark as Resolved
                  </button>
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
