import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import { Avatar, Badge } from '../../primitives'
import { Button } from '../../primitives'

/**
 * PropertyTable - Table for displaying tenant/property data
 *
 * @param {Array} tenants - Array of tenant objects
 * @param {Function} [onRowClick] - Handler when row is clicked
 * @param {Function} [onMessage] - Handler for message action
 * @param {Function} [onView] - Handler for view action
 * @param {boolean} [showActions=true] - Show action buttons
 * @param {ReactNode} [emptyState] - Custom empty state content
 * @param {string} [className] - Additional CSS classes
 */
const PropertyTable = forwardRef(function PropertyTable(
  {
    tenants = [],
    onRowClick,
    onMessage,
    onView,
    showActions = true,
    emptyState,
    className,
    ...props
  },
  ref
) {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'current':
        return 'success'
      case 'due-soon':
      case 'due soon':
        return 'warning'
      case 'late':
      case 'overdue':
        return 'error'
      case 'at-risk':
      case 'at risk':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status) => {
    if (!status) return 'Unknown'
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  const formatDate = (date) => {
    if (!date) return '-'
    const d = date instanceof Date ? date : new Date(date)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount) => {
    if (amount == null) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleRowClick = (tenant, e) => {
    // Don't trigger row click if clicking on interactive element
    if (e.target.closest('button, a')) return
    onRowClick?.(tenant)
  }

  const handleMessage = (tenant, e) => {
    e.stopPropagation()
    onMessage?.(tenant)
  }

  const handleView = (tenant, e) => {
    e.stopPropagation()
    onView?.(tenant)
  }

  if (tenants.length === 0) {
    return (
      <div ref={ref} className={classNames('w-full overflow-x-auto', className)} {...props}>
        <div className="py-12 px-6 text-center bg-white rounded-lg border border-cloud">
          {emptyState || (
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl opacity-50">👥</span>
              <p className="text-sm text-slate m-0">No tenants found</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className={classNames('w-full overflow-x-auto', className)} {...props}>
      <table className="w-full border-collapse text-sm" role="grid">
        <thead className="bg-snow">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-slate whitespace-nowrap border-b border-cloud">
              Tenant
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-slate whitespace-nowrap border-b border-cloud">
              Property & Room
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-slate whitespace-nowrap border-b border-cloud">
              Move-in Date
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-slate whitespace-nowrap border-b border-cloud">
              Payment Status
            </th>
            <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider text-slate whitespace-nowrap border-b border-cloud">
              Balance/Due
            </th>
            {showActions && (
              <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider text-slate whitespace-nowrap border-b border-cloud">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white">
          {tenants.map((tenant) => (
            <tr
              key={tenant.id}
              className={classNames(
                'border-b border-cloud last:border-b-0 transition-colors hover:bg-snow',
                onRowClick && 'cursor-pointer'
              )}
              onClick={onRowClick ? (e) => handleRowClick(tenant, e) : undefined}
              role="row"
            >
              <td className="p-4 align-middle">
                <div className="flex items-center gap-3">
                  <Avatar src={tenant.avatar} name={tenant.name} size="md" />
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-charcoal">{tenant.name}</span>
                    <span className="text-sm text-slate">{tenant.email}</span>
                  </div>
                </div>
              </td>
              <td className="p-4 align-middle">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-charcoal">{tenant.property}</span>
                  <span className="text-xs text-slate">{tenant.room}</span>
                </div>
              </td>
              <td className="p-4 align-middle">
                <span className="text-sm text-slate">{formatDate(tenant.moveInDate)}</span>
              </td>
              <td className="p-4 align-middle">
                <Badge variant={getStatusVariant(tenant.paymentStatus)}>
                  {getStatusLabel(tenant.paymentStatus)}
                </Badge>
              </td>
              <td className="p-4 align-middle text-right">
                <div className="flex flex-col items-end gap-1">
                  <span className="font-semibold text-charcoal">
                    {formatCurrency(tenant.balance)}
                  </span>
                  {tenant.dueDate && (
                    <span className="text-xs text-slate">Due {formatDate(tenant.dueDate)}</span>
                  )}
                </div>
              </td>
              {showActions && (
                <td className="p-4 align-middle text-right">
                  <div className="flex gap-2 justify-end md:flex-row flex-col md:gap-2 gap-1">
                    {onMessage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleMessage(tenant, e)}
                        aria-label={`Message ${tenant.name}`}
                      >
                        Message
                      </Button>
                    )}
                    {onView && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => handleView(tenant, e)}
                        aria-label={`View ${tenant.name}`}
                      >
                        View
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default PropertyTable
