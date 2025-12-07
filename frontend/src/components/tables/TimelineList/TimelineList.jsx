import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'

// Icon type border/text color styles
const iconTypeStyles = {
  success: 'border-accent text-accent',
  completed: 'border-accent text-accent',
  paid: 'border-accent text-accent',
  warning: 'border-warm text-warm',
  pending: 'border-warm text-warm',
  error: 'border-coral text-coral',
  failed: 'border-coral text-coral',
  overdue: 'border-coral text-coral',
  info: 'border-primary text-primary',
}

/**
 * TimelineList - Vertical timeline with icons
 *
 * @param {Array} events - Array of event objects
 * @param {ReactNode} [emptyState] - Custom empty state content
 * @param {string} [className] - Additional CSS classes
 */
const TimelineList = forwardRef(function TimelineList(
  { events = [], emptyState, className, ...props },
  ref
) {
  const getIconStyles = (type) => {
    return iconTypeStyles[type?.toLowerCase()] || 'border-cloud'
  }

  const getDefaultIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        return '✓'
      case 'warning':
      case 'pending':
        return '!'
      case 'error':
      case 'failed':
      case 'overdue':
        return '✕'
      case 'payment':
        return '💰'
      case 'message':
        return '💬'
      case 'lease':
        return '📄'
      case 'move-in':
        return '🏠'
      case 'maintenance':
        return '🔧'
      default:
        return '•'
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (events.length === 0) {
    return (
      <div ref={ref} className={classNames('relative pl-1', className)} {...props}>
        <div className="py-12 px-6 text-center">
          {emptyState || (
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl opacity-50">📅</span>
              <p className="text-sm text-slate m-0">No events</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={classNames('relative pl-1', className)}
      role="list"
      aria-label="Timeline"
      {...props}
    >
      {/* Connector line */}
      <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-cloud" aria-hidden="true" />
      {events.map((event, index) => (
        <div
          key={event.id ?? index}
          className="flex gap-4 py-4 relative first:pt-0 last:pb-0"
          role="listitem"
        >
          <div
            className={classNames(
              'shrink-0 w-12 h-12 flex items-center justify-center text-lg bg-white border-2 rounded-full z-[1]',
              getIconStyles(event.type)
            )}
          >
            {event.icon || getDefaultIcon(event.type)}
          </div>
          <div className="flex-1 pt-3 min-w-0">
            <span className="block font-semibold text-charcoal">{event.title}</span>
            {event.description && (
              <p className="text-sm text-slate leading-relaxed mt-1 mb-0">{event.description}</p>
            )}
            <span className="block text-xs text-slate mt-1">
              {formatTimestamp(event.timestamp)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
})

export default TimelineList
