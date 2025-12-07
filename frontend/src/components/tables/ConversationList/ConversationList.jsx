import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import { Avatar } from '../../primitives'
import { Input } from '../../forms'

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
    <div ref={ref} className={classNames('flex flex-col h-full bg-white', className)} {...props}>
      {showSearch && (
        <div className="p-4 border-b border-cloud">
          <Input
            type="search"
            placeholder="Search messages..."
            value={searchValue}
            onChange={(e) => onSearch?.(e.target.value)}
            aria-label="Search conversations"
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto" role="listbox" aria-label="Conversations">
        {filteredConversations.length === 0 ? (
          <div className="py-12 px-6 text-center">
            {emptyState || (
              <div className="flex flex-col items-center gap-3">
                <span className="text-4xl opacity-50">💬</span>
                <p className="text-sm text-slate m-0">No conversations</p>
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
                  'flex gap-3 w-full py-4 px-5 border-0 border-b border-cloud bg-white cursor-pointer text-left transition-colors',
                  'hover:bg-snow',
                  isActive && 'bg-primary-bg border-l-3 border-l-primary hover:bg-primary-bg/80',
                  isUnread && !isActive && 'bg-warm-bg hover:bg-warm-bg/80'
                )}
                onClick={() => onSelect?.(conversation)}
                role="option"
                aria-selected={isActive}
              >
                <Avatar
                  src={conversation.avatar}
                  name={conversation.name}
                  size="md"
                  className="shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-semibold text-charcoal overflow-hidden text-ellipsis whitespace-nowrap">
                      {conversation.name}
                    </span>
                    <span className="shrink-0 text-xs text-slate">
                      {formatTimestamp(conversation.timestamp)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm text-slate overflow-hidden text-ellipsis whitespace-nowrap">
                      {conversation.lastMessage}
                    </span>
                    {isUnread && (
                      <span className="shrink-0 inline-flex items-center justify-center min-w-5 h-5 px-2 bg-primary text-white text-xs font-semibold rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  {conversation.property && (
                    <span className="text-xs text-slate">{conversation.property}</span>
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
