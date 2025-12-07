import { forwardRef, useMemo } from 'react'
import classNames from '../../../utils/classNames'

// Icon type styles
const iconTypeStyles = {
  payment: 'bg-accent-bg text-accent',
  message: 'bg-primary-bg text-primary',
  application: 'bg-warm-bg text-warm',
  system: 'bg-snow text-slate',
}

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
  const getIconStyles = (type) => {
    return iconTypeStyles[type?.toLowerCase()] || iconTypeStyles.system
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
    <div
      ref={ref}
      className={classNames('flex flex-col bg-white rounded-lg overflow-hidden', className)}
      {...props}
    >
      {showFilter && (
        <div className="flex items-center justify-between py-3 px-4 border-b border-cloud">
          <div className="flex gap-2" role="tablist">
            <button
              type="button"
              className={classNames(
                'py-2 px-3 bg-transparent border-0 text-sm font-medium text-slate cursor-pointer rounded-md transition-all',
                'hover:bg-snow hover:text-charcoal',
                filter === 'all' && 'bg-cloud text-charcoal'
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
                'py-2 px-3 bg-transparent border-0 text-sm font-medium text-slate cursor-pointer rounded-md transition-all',
                'hover:bg-snow hover:text-charcoal',
                filter === 'unread' && 'bg-cloud text-charcoal'
              )}
              onClick={() => onFilterChange?.('unread')}
              role="tab"
              aria-selected={filter === 'unread'}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
          {unreadCount > 0 && onMarkAllRead && (
            <button
              type="button"
              className="py-2 px-3 bg-transparent border-0 text-sm font-medium text-primary cursor-pointer transition-colors hover:text-primary/80"
              onClick={onMarkAllRead}
            >
              Mark all as read
            </button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto" role="list" aria-label="Notifications">
        {isEmpty ? (
          <div className="py-12 px-6 text-center">
            {emptyState || (
              <div className="flex flex-col items-center gap-3">
                <span className="text-4xl opacity-50">🔔</span>
                <p className="text-sm text-slate m-0">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </p>
              </div>
            )}
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([group, items]) => {
            if (items.length === 0) return null

            return (
              <div key={group}>
                <div className="py-3 px-6 bg-snow text-xs font-semibold uppercase tracking-wider text-slate">
                  {group}
                </div>
                {items.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    className={classNames(
                      'flex gap-4 w-full py-5 px-6 bg-white border-0 border-b border-cloud cursor-pointer text-left transition-colors',
                      'hover:bg-snow',
                      !notification.read &&
                        'bg-primary-bg border-l-4 border-l-primary hover:bg-primary-bg/80'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                    role="listitem"
                  >
                    <div
                      className={classNames(
                        'shrink-0 w-12 h-12 flex items-center justify-center text-xl rounded-full',
                        getIconStyles(notification.type)
                      )}
                    >
                      {notification.icon || getDefaultIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-charcoal">{notification.title}</span>
                        {!notification.read && (
                          <span
                            className="w-2.5 h-2.5 bg-primary rounded-full"
                            aria-label="Unread"
                          />
                        )}
                      </div>
                      {notification.description && (
                        <p className="text-sm text-slate leading-relaxed m-0 mb-2">
                          {notification.description}
                        </p>
                      )}
                      <span className="text-xs text-slate">
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
