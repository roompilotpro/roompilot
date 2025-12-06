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
    name,
    address,
    occupiedRooms = 0,
    totalRooms = 0,
    revenue,
    status = 'active',
    onView,
    onMenuClick,
    className,
    ...props
  },
  ref
) {
  const occupancyPercentage = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0
  const occupancyText = `${occupiedRooms}/${totalRooms}`

  const statusLabels = {
    active: 'Active',
    pending: 'Pending',
    issue: 'Issue',
  }

  const statusMapping = {
    active: 'success',
    pending: 'pending',
    issue: 'error',
  }

  return (
    <article ref={ref} className={classNames('property-card', className)} {...props}>
      {/* Property Info Column */}
      <div className="property-card__info">
        <div className="property-card__image">
          {imageUrl ? (
            <img src={imageUrl} alt={name} />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 21V7L12 2L21 7V21H15V14H9V21H3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          )}
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
                  ? 'primary'
                  : 'warning'
            }
            size="sm"
          />
        </div>
        <span className="property-card__occupancy-text">{occupancyText}</span>
      </div>

      {/* Revenue Column */}
      <div className="property-card__revenue">{revenue}</div>

      {/* Status Column */}
      <div className="property-card__status">
        <StatusBadge status={statusMapping[status]}>{statusLabels[status]}</StatusBadge>
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
              <circle cx="10" cy="4" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="10" cy="16" r="1.5" />
            </svg>
          </IconButton>
        )}
      </div>
    </article>
  )
})

export default PropertyCard
