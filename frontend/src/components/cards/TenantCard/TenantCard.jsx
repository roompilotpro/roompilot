import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { Avatar, StatusBadge, Button } from '../../primitives'

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
    <div
      ref={ref}
      className={classNames(
        'flex items-center gap-4 p-4 bg-white border border-cloud rounded-lg transition-colors duration-150 hover:bg-snow sm:flex-wrap',
        className
      )}
      {...props}
    >
      <Avatar src={avatarUrl} name={name} alt={name} size="lg" className="shrink-0" />

      <div className="flex-1 min-w-0 sm:basis-[calc(100%-60px)]">
        <h3 className="m-0 text-base font-semibold text-charcoal whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </h3>
        <p className="m-0 mt-1 text-sm text-slate">{roomAssignment}</p>
      </div>

      <div className="flex items-baseline shrink-0">
        <span className="font-display text-base font-bold text-charcoal">${rentAmount}</span>
        <span className="text-xs text-slate ml-0.5">/mo</span>
      </div>

      <StatusBadge status={status} className="shrink-0 min-w-[80px]">
        {statusTextMap[status]}
      </StatusBadge>

      <div className="flex gap-2 shrink-0">
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
