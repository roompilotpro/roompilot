import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { StatusBadge, IconButton, ProgressBar } from '../../primitives'

// Image placeholder gradient variants
const imageColorStyles = {
  blue: 'bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe]',
  amber: 'bg-gradient-to-br from-[#fef3c7] to-[#fde68a]',
  green: 'bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0]',
}

/**
 * PropertyCard - Property listing row for dashboard tables
 */
const PropertyCard = forwardRef(function PropertyCard(
  {
    imageUrl,
    placeholderColor = 'blue',
    name,
    address,
    occupiedRooms = 0,
    totalRooms = 0,
    revenue,
    status = 'active',
    statusLabel,
    onView,
    onMenuClick,
    className,
    ...props
  },
  ref
) {
  const occupancyPercentage = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0
  const occupancyText = `${occupiedRooms}/${totalRooms} rooms`

  // Parse revenue to separate value and period
  const revenueValue = revenue ? revenue.replace('/month', '').replace('/mo', '') : ''
  const revenuePeriod = '/month'

  const defaultStatusLabels = {
    active: 'All good',
    pending: '1 vacancy',
    issue: '1 late payment',
  }

  const statusMapping = {
    active: 'success',
    pending: 'warning',
    issue: 'error',
  }

  const displayLabel = statusLabel || defaultStatusLabels[status]

  return (
    <article
      ref={ref}
      className={classNames(
        'grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4 md:gap-0 p-4 md:py-4 md:px-6 bg-white border-b border-cloud last:border-b-0 transition-colors duration-200 hover:bg-snow',
        className
      )}
      {...props}
    >
      {/* Property Info Column */}
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={classNames(
            'shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-md overflow-hidden flex items-center justify-center text-2xl',
            imageColorStyles[placeholderColor]
          )}
        >
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span aria-hidden="true">🏠</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="m-0 mb-0.5 text-[15px] font-semibold text-charcoal truncate">{name}</h3>
          <p className="m-0 text-[13px] text-mist truncate">{address}</p>
        </div>
      </div>

      {/* Occupancy Column - hidden on mobile */}
      <div className="hidden md:block text-center">
        <div className="w-[60px] mx-auto mb-1">
          <ProgressBar
            value={occupancyPercentage}
            variant={
              occupancyPercentage >= 80
                ? 'success'
                : occupancyPercentage >= 50
                  ? 'warning'
                  : 'danger'
            }
            size="sm"
          />
        </div>
        <span className="text-[13px] text-slate">{occupancyText}</span>
      </div>

      {/* Revenue Column - hidden on mobile */}
      <div className="hidden md:block text-center">
        <div className="font-display text-base font-bold text-charcoal">{revenueValue}</div>
        <div className="text-xs text-mist">{revenuePeriod}</div>
      </div>

      {/* Status Column - hidden on mobile */}
      <div className="hidden md:block text-center">
        <StatusBadge status={statusMapping[status]}>{displayLabel}</StatusBadge>
      </div>

      {/* Actions Column */}
      <div className="flex items-center gap-2">
        {onView && (
          <IconButton
            label="View property"
            onClick={onView}
            size="sm"
            className="!w-9 !h-9 !rounded-sm !bg-transparent !border !border-cloud !text-slate hover:!bg-snow hover:!border-charcoal hover:!text-charcoal"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M10 4C5.5 4 2 10 2 10C2 10 5.5 16 10 16C14.5 16 18 10 18 10C18 10 14.5 4 10 4Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </IconButton>
        )}
        {onMenuClick && (
          <IconButton
            label="More options"
            onClick={onMenuClick}
            size="sm"
            className="!w-9 !h-9 !rounded-sm !bg-transparent !border !border-cloud !text-slate hover:!bg-snow hover:!border-charcoal hover:!text-charcoal"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <circle cx="4" cy="10" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="16" cy="10" r="1.5" />
            </svg>
          </IconButton>
        )}
      </div>
    </article>
  )
})

export default PropertyCard
