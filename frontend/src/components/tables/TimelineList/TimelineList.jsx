import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import './TimelineList.css'

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
  const getIconClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        return 'timeline-list__icon--success'
      case 'warning':
      case 'pending':
        return 'timeline-list__icon--warning'
      case 'error':
      case 'failed':
      case 'overdue':
        return 'timeline-list__icon--error'
      case 'info':
        return 'timeline-list__icon--info'
      default:
        return ''
    }
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
      <div ref={ref} className={classNames('timeline-list', className)} {...props}>
        <div className="timeline-list__empty">
          {emptyState || (
            <div className="timeline-list__empty-default">
              <span className="timeline-list__empty-icon">📅</span>
              <p className="timeline-list__empty-text">No events</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={classNames('timeline-list', className)}
      role="list"
      aria-label="Timeline"
      {...props}
    >
      <div className="timeline-list__line" aria-hidden="true" />
      {events.map((event, index) => (
        <div key={event.id ?? index} className="timeline-list__item" role="listitem">
          <div className={classNames('timeline-list__icon', getIconClass(event.type))}>
            {event.icon || getDefaultIcon(event.type)}
          </div>
          <div className="timeline-list__content">
            <span className="timeline-list__title">{event.title}</span>
            {event.description && <p className="timeline-list__description">{event.description}</p>}
            <span className="timeline-list__time">{formatTimestamp(event.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  )
})

export default TimelineList
