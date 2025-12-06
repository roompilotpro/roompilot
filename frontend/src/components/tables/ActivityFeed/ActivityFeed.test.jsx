import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ActivityFeed from './ActivityFeed'

const mockActivities = [
  {
    id: 1,
    type: 'payment',
    actor: 'John Doe',
    action: 'paid rent for',
    target: 'Room A',
    timestamp: new Date(),
  },
  {
    id: 2,
    type: 'message',
    actor: 'Jane Smith',
    action: 'sent a message about',
    target: 'Room B',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: 3,
    type: 'application',
    actor: 'Bob Johnson',
    action: 'submitted application for',
    target: 'Room C',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: 4,
    type: 'maintenance',
    actor: 'Alice Brown',
    action: 'reported an issue',
    timestamp: new Date(Date.now() - 7 * 86400000), // 7 days ago
  },
]

describe('ActivityFeed', () => {
  // Basic rendering
  it('renders the feed', () => {
    render(<ActivityFeed activities={mockActivities} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('renders all activities', () => {
    render(<ActivityFeed activities={mockActivities} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    expect(screen.getByText('Alice Brown')).toBeInTheDocument()
  })

  it('renders actor, action, and target', () => {
    render(<ActivityFeed activities={mockActivities} />)
    expect(screen.getByText('John Doe')).toHaveClass('activity-feed__actor')
    expect(screen.getByText('paid rent for')).toHaveClass('activity-feed__action')
    expect(screen.getByText('Room A')).toHaveClass('activity-feed__target')
  })

  it('renders activities without target', () => {
    render(<ActivityFeed activities={mockActivities} />)
    expect(screen.getByText('reported an issue')).toBeInTheDocument()
  })

  // Empty state
  it('renders default empty state when no activities', () => {
    render(<ActivityFeed activities={[]} />)
    expect(screen.getByText('No activity')).toBeInTheDocument()
  })

  it('renders custom empty state', () => {
    render(<ActivityFeed activities={[]} emptyState={<div>Custom empty</div>} />)
    expect(screen.getByText('Custom empty')).toBeInTheDocument()
  })

  // Relative timestamps
  it('renders "Just now" for recent activity', () => {
    const recentActivities = [
      { id: 1, type: 'payment', actor: 'Test', action: 'did something', timestamp: new Date() },
    ]
    render(<ActivityFeed activities={recentActivities} />)
    expect(screen.getByText('Just now')).toBeInTheDocument()
  })

  it('renders minutes ago for recent activity', () => {
    const activitiesMinutesAgo = [
      {
        id: 1,
        type: 'payment',
        actor: 'Test',
        action: 'did something',
        timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      },
    ]
    render(<ActivityFeed activities={activitiesMinutesAgo} />)
    expect(screen.getByText('5m ago')).toBeInTheDocument()
  })

  it('renders hours ago for activity within 24 hours', () => {
    render(<ActivityFeed activities={mockActivities} />)
    expect(screen.getByText('1h ago')).toBeInTheDocument()
  })

  it('renders days ago for activity within a week', () => {
    render(<ActivityFeed activities={mockActivities} />)
    expect(screen.getByText('1d ago')).toBeInTheDocument()
  })

  // maxItems
  it('limits displayed activities when maxItems is set', () => {
    render(<ActivityFeed activities={mockActivities} maxItems={2} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
  })

  // View all button
  it('shows view all button when showViewAll is true and more items exist', () => {
    render(
      <ActivityFeed activities={mockActivities} maxItems={2} showViewAll onViewAll={() => {}} />
    )
    expect(screen.getByText('View all activity')).toBeInTheDocument()
  })

  it('hides view all button when all items are shown', () => {
    render(<ActivityFeed activities={mockActivities} showViewAll onViewAll={() => {}} />)
    expect(screen.queryByText('View all activity')).not.toBeInTheDocument()
  })

  it('calls onViewAll when button clicked', () => {
    const handleViewAll = vi.fn()
    render(
      <ActivityFeed
        activities={mockActivities}
        maxItems={2}
        showViewAll
        onViewAll={handleViewAll}
      />
    )
    fireEvent.click(screen.getByText('View all activity'))
    expect(handleViewAll).toHaveBeenCalled()
  })

  // Icon types
  it('renders payment icon with correct class', () => {
    const { container } = render(<ActivityFeed activities={mockActivities} />)
    expect(container.querySelector('.activity-feed__icon--payment')).toBeInTheDocument()
  })

  it('renders message icon with correct class', () => {
    const { container } = render(<ActivityFeed activities={mockActivities} />)
    expect(container.querySelector('.activity-feed__icon--message')).toBeInTheDocument()
  })

  it('renders application icon with correct class', () => {
    const { container } = render(<ActivityFeed activities={mockActivities} />)
    expect(container.querySelector('.activity-feed__icon--application')).toBeInTheDocument()
  })

  it('renders maintenance icon with correct class', () => {
    const { container } = render(<ActivityFeed activities={mockActivities} />)
    expect(container.querySelector('.activity-feed__icon--maintenance')).toBeInTheDocument()
  })

  it('renders lease icon with correct class', () => {
    const leaseActivities = [
      { id: 1, type: 'lease', actor: 'Test', action: 'signed lease', timestamp: new Date() },
    ]
    render(<ActivityFeed activities={leaseActivities} />)
    expect(screen.getByText('📄')).toBeInTheDocument()
  })

  // Default icons
  it('shows default icon for payment type', () => {
    render(<ActivityFeed activities={mockActivities} />)
    expect(screen.getByText('💰')).toBeInTheDocument()
  })

  it('shows default icon for message type', () => {
    render(<ActivityFeed activities={mockActivities} />)
    expect(screen.getByText('💬')).toBeInTheDocument()
  })

  it('shows default icon for application type', () => {
    render(<ActivityFeed activities={mockActivities} />)
    expect(screen.getByText('📋')).toBeInTheDocument()
  })

  it('shows default icon for maintenance type', () => {
    render(<ActivityFeed activities={mockActivities} />)
    expect(screen.getByText('🔧')).toBeInTheDocument()
  })

  // Custom icon
  it('uses custom icon when provided', () => {
    const activitiesWithCustomIcon = [
      {
        id: 1,
        type: 'payment',
        actor: 'Test',
        action: 'did something',
        icon: '🎉',
        timestamp: new Date(),
      },
    ]
    render(<ActivityFeed activities={activitiesWithCustomIcon} />)
    expect(screen.getByText('🎉')).toBeInTheDocument()
  })

  // Accessibility
  it('has accessible list structure', () => {
    render(<ActivityFeed activities={mockActivities} />)
    expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Activity feed')
  })

  it('renders list items with proper role', () => {
    render(<ActivityFeed activities={mockActivities} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(
      <ActivityFeed activities={mockActivities} className="custom-feed" />
    )
    expect(container.querySelector('.activity-feed')).toHaveClass('custom-feed')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<ActivityFeed ref={ref} activities={mockActivities} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('activity-feed')
  })

  // Fallback for missing id
  it('works with activities without id using index', () => {
    const activitiesWithoutId = [
      { type: 'payment', actor: 'User 1', action: 'did something', timestamp: new Date() },
      { type: 'message', actor: 'User 2', action: 'sent message', timestamp: new Date() },
    ]
    render(<ActivityFeed activities={activitiesWithoutId} />)
    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.getByText('User 2')).toBeInTheDocument()
  })
})
