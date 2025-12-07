import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { Badge } from '../../primitives'

// Category icon styles
const categoryStyles = {
  plumbing: 'bg-primary-bg text-primary',
  electrical: 'bg-warm-bg text-warm',
  hvac: 'bg-purple-bg text-purple',
  appliance: 'bg-coral-bg text-coral',
  general: 'bg-cloud text-slate',
}

// Status border styles
const statusStyles = {
  new: 'border-l-[3px] border-l-primary',
  'in-progress': 'border-l-[3px] border-l-warm',
  resolved: 'border-l-[3px] border-l-accent',
  closed: 'border-l-[3px] border-l-slate opacity-80',
}

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
        'relative flex bg-snow border border-cloud rounded-md p-4 cursor-pointer transition-all duration-150 hover:border-primary hover:shadow-[0_4px_12px_rgba(37,99,235,0.1)] sm:p-3',
        statusStyles[status],
        draggable && 'cursor-grab active:cursor-grabbing',
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
        <div className="shrink-0 w-4 mr-3 flex items-start pt-1 text-slate" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <circle cx="5" cy="4" r="1.5" />
            <circle cx="11" cy="4" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="11" cy="12" r="1.5" />
          </svg>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={classNames(
              'shrink-0 w-8 h-8 rounded-sm flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4 sm:w-7 sm:h-7',
              categoryStyles[category] || categoryStyles.general
            )}
          >
            {categoryIcons[category] || categoryIcons.general}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="m-0 mb-1 text-sm font-semibold text-charcoal leading-tight">{title}</h3>
            {location && <p className="m-0 mb-1 text-xs text-slate">{location}</p>}
            {tenant && <p className="m-0 text-xs text-slate">{tenant}</p>}
          </div>
        </div>

        {/* Expanded Description */}
        {expanded && description && (
          <div className="mt-3 pt-3 border-t border-cloud">
            <p className="m-0 text-sm text-charcoal/80 leading-normal">{description}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-cloud">
          {timestamp && <span className="text-xs text-slate">{timestamp}</span>}
          <Badge color={priorityColors[priority]} size="sm">
            {priorityLabels[priority]}
          </Badge>
        </div>

        {/* Expand Toggle */}
        {description && onExpandToggle && (
          <button
            type="button"
            className="absolute bottom-2 right-2 w-6 h-6 p-0 border-none bg-transparent text-slate cursor-pointer flex items-center justify-center transition-colors duration-150 hover:text-charcoal"
            onClick={(e) => {
              e.stopPropagation()
              onExpandToggle()
            }}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className={classNames(
                'w-4 h-4 transition-transform duration-150',
                expanded && 'rotate-180'
              )}
            >
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
