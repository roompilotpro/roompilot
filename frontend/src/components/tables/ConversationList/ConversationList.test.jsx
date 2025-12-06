import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConversationList from './ConversationList'

const mockConversations = [
  {
    id: 1,
    name: 'John Doe',
    avatar: null,
    lastMessage: 'Thanks for getting back to me!',
    timestamp: new Date(Date.now() - 5 * 60000), // 5 mins ago
    unreadCount: 2,
    property: '123 Main Street',
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: null,
    lastMessage: 'When can I move in?',
    timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    unreadCount: 0,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    avatar: null,
    lastMessage: 'The maintenance request has been completed.',
    timestamp: new Date(Date.now() - 2 * 86400000), // 2 days ago
    unreadCount: 0,
  },
]

describe('ConversationList', () => {
  // Basic rendering
  it('renders the list', () => {
    render(<ConversationList conversations={mockConversations} />)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('renders all conversations', () => {
    render(<ConversationList conversations={mockConversations} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
  })

  it('renders conversation details', () => {
    render(<ConversationList conversations={mockConversations} />)
    expect(screen.getByText('Thanks for getting back to me!')).toBeInTheDocument()
    expect(screen.getByText('123 Main Street')).toBeInTheDocument()
  })

  // Empty state
  it('renders default empty state when no conversations', () => {
    render(<ConversationList conversations={[]} />)
    expect(screen.getByText('No conversations')).toBeInTheDocument()
  })

  it('renders custom empty state', () => {
    render(<ConversationList conversations={[]} emptyState={<div>Custom empty</div>} />)
    expect(screen.getByText('Custom empty')).toBeInTheDocument()
  })

  // Search
  it('renders search input by default', () => {
    render(<ConversationList conversations={mockConversations} />)
    expect(screen.getByLabelText('Search conversations')).toBeInTheDocument()
  })

  it('hides search when showSearch is false', () => {
    render(<ConversationList conversations={mockConversations} showSearch={false} />)
    expect(screen.queryByLabelText('Search conversations')).not.toBeInTheDocument()
  })

  it('calls onSearch when typing in search', () => {
    const handleSearch = vi.fn()
    render(<ConversationList conversations={mockConversations} onSearch={handleSearch} />)
    const searchInput = screen.getByLabelText('Search conversations')
    fireEvent.change(searchInput, { target: { value: 'John' } })
    expect(handleSearch).toHaveBeenCalledWith('John')
  })

  it('filters conversations by search value', () => {
    render(<ConversationList conversations={mockConversations} searchValue="John" />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  // Selection
  it('calls onSelect when conversation is clicked', () => {
    const handleSelect = vi.fn()
    render(<ConversationList conversations={mockConversations} onSelect={handleSelect} />)
    fireEvent.click(screen.getByText('John Doe'))
    expect(handleSelect).toHaveBeenCalledWith(mockConversations[0])
  })

  it('applies active class to selected conversation', () => {
    const { container } = render(
      <ConversationList conversations={mockConversations} activeId={1} />
    )
    expect(container.querySelector('.conversation-list__item--active')).toBeInTheDocument()
  })

  it('sets aria-selected on active conversation', () => {
    render(<ConversationList conversations={mockConversations} activeId={1} />)
    const activeItem = screen.getByRole('option', { selected: true })
    expect(activeItem).toHaveTextContent('John Doe')
  })

  // Unread state
  it('shows unread badge when unreadCount > 0', () => {
    render(<ConversationList conversations={mockConversations} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('applies unread class to unread conversations', () => {
    const { container } = render(<ConversationList conversations={mockConversations} />)
    expect(container.querySelector('.conversation-list__item--unread')).toBeInTheDocument()
  })

  it('does not show unread class on active conversation', () => {
    const { container } = render(
      <ConversationList conversations={mockConversations} activeId={1} />
    )
    const activeItem = container.querySelector('.conversation-list__item--active')
    expect(activeItem).not.toHaveClass('conversation-list__item--unread')
  })

  // Timestamp formatting
  it('formats recent timestamps', () => {
    render(<ConversationList conversations={mockConversations} />)
    expect(screen.getByText('5m ago')).toBeInTheDocument()
  })

  it('formats hour timestamps', () => {
    render(<ConversationList conversations={mockConversations} />)
    expect(screen.getByText('2h ago')).toBeInTheDocument()
  })

  it('formats day timestamps', () => {
    render(<ConversationList conversations={mockConversations} />)
    expect(screen.getByText('2d ago')).toBeInTheDocument()
  })

  // Avatar
  it('renders avatar for each conversation', () => {
    const { container } = render(<ConversationList conversations={mockConversations} />)
    const avatars = container.querySelectorAll('.avatar')
    expect(avatars).toHaveLength(3)
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(
      <ConversationList conversations={mockConversations} className="custom-list" />
    )
    expect(container.querySelector('.conversation-list')).toHaveClass('custom-list')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<ConversationList ref={ref} conversations={mockConversations} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('conversation-list')
  })
})
