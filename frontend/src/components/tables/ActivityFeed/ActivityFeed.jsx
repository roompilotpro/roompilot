import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import './ActivityFeed.css'

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
  const getIconClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'payment':
        return 'activity-feed__icon--payment'
      case 'message':
        return 'activity-feed__icon--message'
      case 'application':
        return 'activity-feed__icon--application'
      case 'maintenance':
        return 'activity-feed__icon--maintenance'
      case 'lease':
        return 'activity-feed__icon--lease'
      default:
        return 'activity-feed__icon--default'
    }
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
      <div ref={ref} className={classNames('activity-feed', className)} {...props}>
        <div className="activity-feed__empty">
          {emptyState || (
            <div className="activity-feed__empty-default">
              <span className="activity-feed__empty-icon">📋</span>
              <p className="activity-feed__empty-text">No activity</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={classNames('activity-feed', className)}
      role="list"
      aria-label="Activity feed"
      {...props}
    >
      {displayActivities.map((activity, index) => (
        <div key={activity.id ?? index} className="activity-feed__item" role="listitem">
          <div className={classNames('activity-feed__icon', getIconClass(activity.type))}>
            {activity.icon || getDefaultIcon(activity.type)}
          </div>
          <div className="activity-feed__content">
            <p className="activity-feed__text">
              <span className="activity-feed__actor">{activity.actor}</span>{' '}
              <span className="activity-feed__action">{activity.action}</span>
              {activity.target && (
                <>
                  {' '}
                  <span className="activity-feed__target">{activity.target}</span>
                </>
              )}
            </p>
            <span className="activity-feed__time">{formatTimestamp(activity.timestamp)}</span>
          </div>
        </div>
      ))}

      {showViewAll && maxItems && activities.length > maxItems && (
        <button type="button" className="activity-feed__view-all" onClick={onViewAll}>
          View all activity
        </button>
      )}
    </div>
  )
})

export default ActivityFeed
