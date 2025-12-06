import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { StatusBadge, IconButton, ProgressBar } from '../../primitives'
import './PropertyCard.css'

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
    <article ref={ref} className={classNames('property-card', className)} {...props}>
      {/* Property Info Column */}
      <div className="property-card__info">
        <div
          className={classNames(
            'property-card__image',
            `property-card__image--${placeholderColor}`
          )}
        >
          {imageUrl ? <img src={imageUrl} alt={name} /> : <span aria-hidden="true">🏠</span>}
        </div>
        <div className="property-card__details">
          <h3 className="property-card__name">{name}</h3>
          <p className="property-card__address">{address}</p>
        </div>
      </div>

      {/* Occupancy Column */}
      <div className="property-card__occupancy">
        <div className="property-card__occupancy-bar">
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
        <span className="property-card__occupancy-text">{occupancyText}</span>
      </div>

      {/* Revenue Column */}
      <div className="property-card__revenue">
        <div className="property-card__revenue-value">{revenueValue}</div>
        <div className="property-card__revenue-period">{revenuePeriod}</div>
      </div>

      {/* Status Column */}
      <div className="property-card__status">
        <StatusBadge status={statusMapping[status]}>{displayLabel}</StatusBadge>
      </div>

      {/* Actions Column */}
      <div className="property-card__actions">
        {onView && (
          <IconButton label="View property" onClick={onView} size="sm">
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
          <IconButton label="More options" onClick={onMenuClick} size="sm">
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
