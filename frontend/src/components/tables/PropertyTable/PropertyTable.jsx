import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import { Avatar, Badge } from '../../primitives'
import { Button } from '../../primitives'
import './PropertyTable.css'

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
      <div ref={ref} className={classNames('property-table', className)} {...props}>
        <div className="property-table__empty">
          {emptyState || (
            <div className="property-table__empty-default">
              <span className="property-table__empty-icon">👥</span>
              <p className="property-table__empty-text">No tenants found</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className={classNames('property-table', className)} {...props}>
      <table className="property-table__table" role="grid">
        <thead className="property-table__header">
          <tr>
            <th className="property-table__header-cell">Tenant</th>
            <th className="property-table__header-cell">Property & Room</th>
            <th className="property-table__header-cell">Move-in Date</th>
            <th className="property-table__header-cell">Payment Status</th>
            <th className="property-table__header-cell property-table__header-cell--right">
              Balance/Due
            </th>
            {showActions && (
              <th className="property-table__header-cell property-table__header-cell--right">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="property-table__body">
          {tenants.map((tenant) => (
            <tr
              key={tenant.id}
              className={classNames(
                'property-table__row',
                onRowClick && 'property-table__row--clickable'
              )}
              onClick={onRowClick ? (e) => handleRowClick(tenant, e) : undefined}
              role="row"
            >
              <td className="property-table__cell">
                <div className="property-table__tenant-cell">
                  <Avatar src={tenant.avatar} name={tenant.name} size="md" />
                  <div className="property-table__tenant-info">
                    <span className="property-table__name">{tenant.name}</span>
                    <span className="property-table__email">{tenant.email}</span>
                  </div>
                </div>
              </td>
              <td className="property-table__cell">
                <div className="property-table__property-cell">
                  <span className="property-table__property">{tenant.property}</span>
                  <span className="property-table__room">{tenant.room}</span>
                </div>
              </td>
              <td className="property-table__cell">
                <span className="property-table__date">{formatDate(tenant.moveInDate)}</span>
              </td>
              <td className="property-table__cell">
                <Badge variant={getStatusVariant(tenant.paymentStatus)}>
                  {getStatusLabel(tenant.paymentStatus)}
                </Badge>
              </td>
              <td className="property-table__cell property-table__cell--right">
                <div className="property-table__balance-cell">
                  <span className="property-table__balance">{formatCurrency(tenant.balance)}</span>
                  {tenant.dueDate && (
                    <span className="property-table__due-date">
                      Due {formatDate(tenant.dueDate)}
                    </span>
                  )}
                </div>
              </td>
              {showActions && (
                <td className="property-table__cell property-table__cell--right">
                  <div className="property-table__actions">
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
