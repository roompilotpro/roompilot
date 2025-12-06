import { forwardRef, useMemo } from 'react'
import classNames from '../../../utils/classNames'
import './NotificationList.css'

/**
 * NotificationList - Grouped notification list with read states
 *
 * @param {Array} notifications - Array of notification objects
 * @param {Function} [onMarkRead] - Handler when notification is clicked/read
 * @param {Function} [onMarkAllRead] - Handler to mark all as read
 * @param {string} [filter='all'] - Filter: 'all' | 'unread'
 * @param {Function} [onFilterChange] - Handler for filter changes
 * @param {boolean} [showFilter=true] - Show filter tabs
 * @param {ReactNode} [emptyState] - Custom empty state content
 * @param {string} [className] - Additional CSS classes
 */
const NotificationList = forwardRef(function NotificationList(
  {
    notifications = [],
    onMarkRead,
    onMarkAllRead,
    filter = 'all',
    onFilterChange,
    showFilter = true,
    emptyState,
    className,
    ...props
  },
  ref
) {
  const getIconClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'payment':
        return 'notification-list__icon--payment'
      case 'message':
        return 'notification-list__icon--message'
      case 'application':
        return 'notification-list__icon--application'
      case 'system':
      default:
        return 'notification-list__icon--system'
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
      case 'system':
      default:
        return '🔔'
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getDateGroup = (timestamp) => {
    if (!timestamp) return 'Earlier'
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 86400000)

    if (date >= today) return 'Today'
    if (date >= yesterday) return 'Yesterday'
    return 'Earlier'
  }

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((n) => !n.read)
    }
    return notifications
  }, [notifications, filter])

  // Group by date
  const groupedNotifications = useMemo(() => {
    const groups = { Today: [], Yesterday: [], Earlier: [] }

    filteredNotifications.forEach((notification) => {
      const group = getDateGroup(notification.timestamp)
      groups[group].push(notification)
    })

    return groups
  }, [filteredNotifications])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      onMarkRead?.(notification)
    }
  }

  const isEmpty = filteredNotifications.length === 0

  return (
    <div ref={ref} className={classNames('notification-list', className)} {...props}>
      {showFilter && (
        <div className="notification-list__toolbar">
          <div className="notification-list__filters" role="tablist">
            <button
              type="button"
              className={classNames(
                'notification-list__filter',
                filter === 'all' && 'notification-list__filter--active'
              )}
              onClick={() => onFilterChange?.('all')}
              role="tab"
              aria-selected={filter === 'all'}
            >
              All
            </button>
            <button
              type="button"
              className={classNames(
                'notification-list__filter',
                filter === 'unread' && 'notification-list__filter--active'
              )}
              onClick={() => onFilterChange?.('unread')}
              role="tab"
              aria-selected={filter === 'unread'}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
          {unreadCount > 0 && onMarkAllRead && (
            <button type="button" className="notification-list__mark-all" onClick={onMarkAllRead}>
              Mark all as read
            </button>
          )}
        </div>
      )}

      <div className="notification-list__content" role="list" aria-label="Notifications">
        {isEmpty ? (
          <div className="notification-list__empty">
            {emptyState || (
              <div className="notification-list__empty-default">
                <span className="notification-list__empty-icon">🔔</span>
                <p className="notification-list__empty-text">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </p>
              </div>
            )}
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([group, items]) => {
            if (items.length === 0) return null

            return (
              <div key={group} className="notification-list__group">
                <div className="notification-list__group-header">{group}</div>
                {items.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    className={classNames(
                      'notification-list__item',
                      !notification.read && 'notification-list__item--unread'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                    role="listitem"
                  >
                    <div
                      className={classNames(
                        'notification-list__icon',
                        getIconClass(notification.type)
                      )}
                    >
                      {notification.icon || getDefaultIcon(notification.type)}
                    </div>
                    <div className="notification-list__body">
                      <div className="notification-list__header">
                        <span className="notification-list__title">{notification.title}</span>
                        {!notification.read && (
                          <span className="notification-list__dot" aria-label="Unread" />
                        )}
                      </div>
                      {notification.description && (
                        <p className="notification-list__description">{notification.description}</p>
                      )}
                      <span className="notification-list__time">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
})

export default NotificationList
