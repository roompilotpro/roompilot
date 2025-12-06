import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import { Avatar } from '../../primitives'
import { Input } from '../../forms'
import './ConversationList.css'

/**
 * ConversationList - Message thread sidebar list
 *
 * @param {Array} conversations - Array of conversation objects
 * @param {string|number} [activeId] - Currently active conversation ID
 * @param {Function} [onSelect] - Handler when conversation is selected
 * @param {Function} [onSearch] - Handler for search input changes
 * @param {string} [searchValue] - Current search value
 * @param {boolean} [showSearch=true] - Show search input
 * @param {ReactNode} [emptyState] - Custom empty state content
 * @param {string} [className] - Additional CSS classes
 */
const ConversationList = forwardRef(function ConversationList(
  {
    conversations = [],
    activeId,
    onSelect,
    onSearch,
    searchValue = '',
    showSearch = true,
    emptyState,
    className,
    ...props
  },
  ref
) {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const filteredConversations = searchValue
    ? conversations.filter(
        (conv) =>
          conv.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          conv.lastMessage?.toLowerCase().includes(searchValue.toLowerCase())
      )
    : conversations

  return (
    <div ref={ref} className={classNames('conversation-list', className)} {...props}>
      {showSearch && (
        <div className="conversation-list__search">
          <Input
            type="search"
            placeholder="Search messages..."
            value={searchValue}
            onChange={(e) => onSearch?.(e.target.value)}
            aria-label="Search conversations"
          />
        </div>
      )}

      <div className="conversation-list__items" role="listbox" aria-label="Conversations">
        {filteredConversations.length === 0 ? (
          <div className="conversation-list__empty">
            {emptyState || (
              <div className="conversation-list__empty-default">
                <span className="conversation-list__empty-icon">💬</span>
                <p className="conversation-list__empty-text">No conversations</p>
              </div>
            )}
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const isActive = activeId === conversation.id
            const isUnread = conversation.unreadCount > 0

            return (
              <button
                key={conversation.id}
                type="button"
                className={classNames(
                  'conversation-list__item',
                  isActive && 'conversation-list__item--active',
                  isUnread && !isActive && 'conversation-list__item--unread'
                )}
                onClick={() => onSelect?.(conversation)}
                role="option"
                aria-selected={isActive}
              >
                <Avatar
                  src={conversation.avatar}
                  name={conversation.name}
                  size="md"
                  className="conversation-list__avatar"
                />
                <div className="conversation-list__content">
                  <div className="conversation-list__header">
                    <span className="conversation-list__name">{conversation.name}</span>
                    <span className="conversation-list__time">
                      {formatTimestamp(conversation.timestamp)}
                    </span>
                  </div>
                  <div className="conversation-list__footer">
                    <span className="conversation-list__preview">{conversation.lastMessage}</span>
                    {isUnread && (
                      <span className="conversation-list__badge">{conversation.unreadCount}</span>
                    )}
                  </div>
                  {conversation.property && (
                    <span className="conversation-list__property">{conversation.property}</span>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
})

export default ConversationList
