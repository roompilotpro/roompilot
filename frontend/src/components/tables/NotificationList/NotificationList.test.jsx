import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import NotificationList from './NotificationList'

const mockNotifications = [
  {
    id: 1,
    type: 'payment',
    title: 'Payment Received',
    description: 'You received $175 from John Doe',
    timestamp: new Date(), // Today
    read: false,
  },
  {
    id: 2,
    type: 'message',
    title: 'New Message',
    description: 'Jane Smith sent you a message',
    timestamp: new Date(Date.now() - 86400000), // Yesterday
    read: true,
  },
  {
    id: 3,
    type: 'application',
    title: 'New Application',
    description: 'Bob Johnson applied for Room A',
    timestamp: new Date(Date.now() - 3 * 86400000), // 3 days ago
    read: false,
  },
]

describe('NotificationList', () => {
  // Basic rendering
  it('renders the list', () => {
    render(<NotificationList notifications={mockNotifications} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('renders all notifications', () => {
    render(<NotificationList notifications={mockNotifications} />)
    expect(screen.getByText('Payment Received')).toBeInTheDocument()
    expect(screen.getByText('New Message')).toBeInTheDocument()
    expect(screen.getByText('New Application')).toBeInTheDocument()
  })

  it('renders notification descriptions', () => {
    render(<NotificationList notifications={mockNotifications} />)
    expect(screen.getByText('You received $175 from John Doe')).toBeInTheDocument()
  })

  // Empty state
  it('renders default empty state when no notifications', () => {
    render(<NotificationList notifications={[]} />)
    expect(screen.getByText('No notifications')).toBeInTheDocument()
  })

  it('renders unread-specific empty message when filter is unread', () => {
    render(<NotificationList notifications={[]} filter="unread" />)
    expect(screen.getByText('No unread notifications')).toBeInTheDocument()
  })

  it('renders custom empty state', () => {
    render(<NotificationList notifications={[]} emptyState={<div>Custom empty</div>} />)
    expect(screen.getByText('Custom empty')).toBeInTheDocument()
  })

  // Grouping
  it('groups notifications by date', () => {
    render(<NotificationList notifications={mockNotifications} />)
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Yesterday')).toBeInTheDocument()
    expect(screen.getByText('Earlier')).toBeInTheDocument()
  })

  // Filter
  it('renders filter tabs by default', () => {
    render(<NotificationList notifications={mockNotifications} />)
    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Unread/ })).toBeInTheDocument()
  })

  it('hides filter tabs when showFilter is false', () => {
    render(<NotificationList notifications={mockNotifications} showFilter={false} />)
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })

  it('shows unread count in filter tab', () => {
    render(<NotificationList notifications={mockNotifications} />)
    expect(screen.getByText(/Unread \(2\)/)).toBeInTheDocument()
  })

  it('calls onFilterChange when filter tab clicked', () => {
    const handleFilterChange = vi.fn()
    render(
      <NotificationList notifications={mockNotifications} onFilterChange={handleFilterChange} />
    )
    fireEvent.click(screen.getByRole('tab', { name: /Unread/ }))
    expect(handleFilterChange).toHaveBeenCalledWith('unread')
  })

  it('filters to only unread when filter is unread', () => {
    render(<NotificationList notifications={mockNotifications} filter="unread" />)
    expect(screen.getByText('Payment Received')).toBeInTheDocument()
    expect(screen.queryByText('New Message')).not.toBeInTheDocument() // read
    expect(screen.getByText('New Application')).toBeInTheDocument()
  })

  // Read state
  it('applies unread class to unread notifications', () => {
    const { container } = render(<NotificationList notifications={mockNotifications} />)
    expect(container.querySelector('.notification-list__item--unread')).toBeInTheDocument()
  })

  it('shows unread dot on unread notifications', () => {
    render(<NotificationList notifications={mockNotifications} />)
    expect(screen.getAllByLabelText('Unread')).toHaveLength(2)
  })

  it('calls onMarkRead when unread notification clicked', () => {
    const handleMarkRead = vi.fn()
    render(<NotificationList notifications={mockNotifications} onMarkRead={handleMarkRead} />)
    fireEvent.click(screen.getByText('Payment Received'))
    expect(handleMarkRead).toHaveBeenCalledWith(mockNotifications[0])
  })

  it('does not call onMarkRead when read notification clicked', () => {
    const handleMarkRead = vi.fn()
    render(<NotificationList notifications={mockNotifications} onMarkRead={handleMarkRead} />)
    fireEvent.click(screen.getByText('New Message'))
    expect(handleMarkRead).not.toHaveBeenCalled()
  })

  // Mark all as read
  it('shows mark all as read button when unread exist', () => {
    render(<NotificationList notifications={mockNotifications} onMarkAllRead={() => {}} />)
    expect(screen.getByText('Mark all as read')).toBeInTheDocument()
  })

  it('hides mark all as read when all are read', () => {
    const allRead = mockNotifications.map((n) => ({ ...n, read: true }))
    render(<NotificationList notifications={allRead} onMarkAllRead={() => {}} />)
    expect(screen.queryByText('Mark all as read')).not.toBeInTheDocument()
  })

  it('calls onMarkAllRead when button clicked', () => {
    const handleMarkAllRead = vi.fn()
    render(<NotificationList notifications={mockNotifications} onMarkAllRead={handleMarkAllRead} />)
    fireEvent.click(screen.getByText('Mark all as read'))
    expect(handleMarkAllRead).toHaveBeenCalled()
  })

  // Icon types
  it('renders payment icon with correct class', () => {
    const { container } = render(<NotificationList notifications={mockNotifications} />)
    expect(container.querySelector('.notification-list__icon--payment')).toBeInTheDocument()
  })

  it('renders message icon with correct class', () => {
    const { container } = render(<NotificationList notifications={mockNotifications} />)
    expect(container.querySelector('.notification-list__icon--message')).toBeInTheDocument()
  })

  it('renders application icon with correct class', () => {
    const { container } = render(<NotificationList notifications={mockNotifications} />)
    expect(container.querySelector('.notification-list__icon--application')).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(
      <NotificationList notifications={mockNotifications} className="custom-list" />
    )
    expect(container.querySelector('.notification-list')).toHaveClass('custom-list')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<NotificationList ref={ref} notifications={mockNotifications} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('notification-list')
  })
})
