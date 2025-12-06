import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { Badge } from '../../primitives'
import './RequestCard.css'

/**
 * RequestCard - Maintenance request card for kanban boards
 */
const RequestCard = forwardRef(function RequestCard(
  {
    id,
    title,
    category = 'general',
    priority = 'normal',
    location,
    tenant,
    timestamp,
    description,
    status = 'new',
    expanded = false,
    onExpandToggle,
    draggable = false,
    onDragStart,
    onDragEnd,
    onClick,
    className,
    ...props
  },
  ref
) {
  const categoryIcons = {
    plumbing: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2v6m0 0c-3 0-5 2-5 5v7h10v-7c0-3-2-5-5-5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
    electrical: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
    hvac: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9.5 14.5L3 21m12.5-6.5L22 21M12 3v3m0 6v6m6-9h-3m-6 0H6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    appliance: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M3 9h18M12 15a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    general: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 11-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  }

  const priorityColors = {
    urgent: 'danger',
    normal: 'default',
    low: 'secondary',
  }

  const priorityLabels = {
    urgent: 'Urgent',
    normal: 'Normal',
    low: 'Low',
  }

  const handleDragStart = (e) => {
    if (draggable && onDragStart) {
      onDragStart(e, id)
    }
  }

  const handleDragEnd = (e) => {
    if (draggable && onDragEnd) {
      onDragEnd(e, id)
    }
  }

  return (
    <article
      ref={ref}
      className={classNames(
        'request-card',
        `request-card--${status}`,
        expanded && 'request-card--expanded',
        draggable && 'request-card--draggable',
        className
      )}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      {...props}
    >
      {/* Drag Handle */}
      {draggable && (
        <div className="request-card__drag-handle" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="4" r="1.5" />
            <circle cx="11" cy="4" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="11" cy="12" r="1.5" />
          </svg>
        </div>
      )}

      <div className="request-card__main">
        {/* Header */}
        <div className="request-card__header">
          <div className={classNames('request-card__icon', `request-card__icon--${category}`)}>
            {categoryIcons[category] || categoryIcons.general}
          </div>
          <div className="request-card__content">
            <h3 className="request-card__title">{title}</h3>
            {location && <p className="request-card__location">{location}</p>}
            {tenant && <p className="request-card__tenant">{tenant}</p>}
          </div>
        </div>

        {/* Expanded Description */}
        {expanded && description && (
          <div className="request-card__description">
            <p>{description}</p>
          </div>
        )}

        {/* Footer */}
        <div className="request-card__footer">
          {timestamp && <span className="request-card__timestamp">{timestamp}</span>}
          <Badge color={priorityColors[priority]} size="sm">
            {priorityLabels[priority]}
          </Badge>
        </div>

        {/* Expand Toggle */}
        {description && onExpandToggle && (
          <button
            type="button"
            className="request-card__toggle"
            onClick={(e) => {
              e.stopPropagation()
              onExpandToggle()
            }}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </article>
  )
})

export default RequestCard
