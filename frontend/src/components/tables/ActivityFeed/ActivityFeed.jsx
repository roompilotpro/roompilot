import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'

// Icon type background/color styles
const iconTypeStyles = {
  payment: 'bg-accent-bg text-accent',
  message: 'bg-primary-bg text-primary',
  application: 'bg-warm-bg text-warm',
  maintenance: 'bg-snow text-slate',
  lease: 'bg-primary-bg text-primary',
  default: 'bg-snow text-slate',
}

/**
 * ActivityFeed - Activity log with actor/action/target pattern
 *
 * @param {Array} activities - Array of activity objects
 * @param {number} [maxItems] - Maximum number of items to display
 * @param {boolean} [showViewAll] - Show "View all" button
 * @param {Function} [onViewAll] - Callback when "View all" clicked
 * @param {ReactNode} [emptyState] - Custom empty state content
 * @param {string} [className] - Additional CSS classes
 */
const ActivityFeed = forwardRef(function ActivityFeed(
  { activities = [], maxItems, showViewAll = false, onViewAll, emptyState, className, ...props },
  ref
) {
  const getIconStyles = (type) => {
    return iconTypeStyles[type?.toLowerCase()] || iconTypeStyles.default
  }

  const getDefaultIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'payment':
        return '💰'
      case 'message':
        return '💬'
      case 'application':
        return '📋'
      case 'maintenance':
        return '🔧'
      case 'lease':
        return '📄'
      default:
        return '📌'
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const displayActivities = maxItems ? activities.slice(0, maxItems) : activities

  if (activities.length === 0) {
    return (
      <div ref={ref} className={classNames('flex flex-col', className)} {...props}>
        <div className="py-12 px-6 text-center">
          {emptyState || (
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl opacity-50">📋</span>
              <p className="text-sm text-slate m-0">No activity</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={classNames('flex flex-col', className)}
      role="list"
      aria-label="Activity feed"
      {...props}
    >
      {displayActivities.map((activity, index) => (
        <div
          key={activity.id ?? index}
          className="flex gap-3 p-4 border-b border-cloud last:border-b-0"
          role="listitem"
        >
          <div
            className={classNames(
              'shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base',
              getIconStyles(activity.type)
            )}
          >
            {activity.icon || getDefaultIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-relaxed text-slate m-0">
              <span className="font-semibold text-charcoal">{activity.actor}</span>{' '}
              <span>{activity.action}</span>
              {activity.target && (
                <>
                  {' '}
                  <span className="font-medium text-primary">{activity.target}</span>
                </>
              )}
            </p>
            <span className="block text-xs text-slate mt-1">
              {formatTimestamp(activity.timestamp)}
            </span>
          </div>
        </div>
      ))}

      {showViewAll && maxItems && activities.length > maxItems && (
        <button
          type="button"
          className="w-full p-4 bg-transparent border-0 border-t border-cloud text-primary text-sm font-medium text-center cursor-pointer transition-colors hover:bg-snow focus:outline-none focus:bg-primary-bg"
          onClick={onViewAll}
        >
          View all activity
        </button>
      )}
    </div>
  )
})

export default ActivityFeed
