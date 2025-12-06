import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { Avatar, StatusBadge, Button } from '../../primitives'
import './TenantCard.css'

const statusTextMap = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
}

/**
 * TenantCard - Tenant information card
 */
const TenantCard = forwardRef(function TenantCard(
  {
    avatarUrl,
    name,
    roomAssignment,
    rentAmount,
    status = 'active',
    onView,
    onEdit,
    className,
    ...props
  },
  ref
) {
  return (
    <div ref={ref} className={classNames('tenant-card', className)} {...props}>
      <Avatar src={avatarUrl} name={name} alt={name} size="lg" className="tenant-card__avatar" />

      <div className="tenant-card__info">
        <h3 className="tenant-card__name">{name}</h3>
        <p className="tenant-card__room">{roomAssignment}</p>
      </div>

      <div className="tenant-card__rent">
        <span className="tenant-card__rent-value">${rentAmount}</span>
        <span className="tenant-card__rent-period">/mo</span>
      </div>

      <StatusBadge status={status} className="tenant-card__status">
        {statusTextMap[status]}
      </StatusBadge>

      <div className="tenant-card__actions">
        {onView && (
          <Button variant="ghost" size="sm" onClick={onView}>
            View
          </Button>
        )}
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
        )}
      </div>
    </div>
  )
})

export default TenantCard
