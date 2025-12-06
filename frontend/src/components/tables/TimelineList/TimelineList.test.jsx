import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TimelineList from './TimelineList'

const mockEvents = [
  {
    id: 1,
    type: 'success',
    title: 'Lease Signed',
    description: 'John Doe signed the lease agreement',
    timestamp: new Date('2024-12-01T10:00:00'),
  },
  {
    id: 2,
    type: 'payment',
    title: 'First Payment',
    description: 'Received $175 deposit',
    timestamp: new Date('2024-11-28T14:30:00'),
  },
  {
    id: 3,
    type: 'warning',
    title: 'Application Pending',
    timestamp: new Date('2024-11-25T09:00:00'),
  },
  {
    id: 4,
    type: 'error',
    title: 'Payment Failed',
    description: 'Card declined',
    timestamp: new Date('2024-11-20T16:45:00'),
  },
]

describe('TimelineList', () => {
  // Basic rendering
  it('renders the timeline', () => {
    render(<TimelineList events={mockEvents} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('renders all events', () => {
    render(<TimelineList events={mockEvents} />)
    expect(screen.getByText('Lease Signed')).toBeInTheDocument()
    expect(screen.getByText('First Payment')).toBeInTheDocument()
    expect(screen.getByText('Application Pending')).toBeInTheDocument()
    expect(screen.getByText('Payment Failed')).toBeInTheDocument()
  })

  it('renders event descriptions', () => {
    render(<TimelineList events={mockEvents} />)
    expect(screen.getByText('John Doe signed the lease agreement')).toBeInTheDocument()
    expect(screen.getByText('Received $175 deposit')).toBeInTheDocument()
  })

  it('renders formatted timestamps', () => {
    render(<TimelineList events={mockEvents} />)
    expect(screen.getByText(/Dec 1, 2024/)).toBeInTheDocument()
  })

  // Empty state
  it('renders default empty state when no events', () => {
    render(<TimelineList events={[]} />)
    expect(screen.getByText('No events')).toBeInTheDocument()
  })

  it('renders custom empty state', () => {
    render(<TimelineList events={[]} emptyState={<div>Custom empty</div>} />)
    expect(screen.getByText('Custom empty')).toBeInTheDocument()
  })

  // Connector line
  it('renders connector line', () => {
    const { container } = render(<TimelineList events={mockEvents} />)
    expect(container.querySelector('.timeline-list__line')).toBeInTheDocument()
  })

  it('hides connector line from accessibility tree', () => {
    const { container } = render(<TimelineList events={mockEvents} />)
    const line = container.querySelector('.timeline-list__line')
    expect(line).toHaveAttribute('aria-hidden', 'true')
  })

  // Icon types
  it('renders success icon with correct class', () => {
    const { container } = render(<TimelineList events={mockEvents} />)
    expect(container.querySelector('.timeline-list__icon--success')).toBeInTheDocument()
  })

  it('renders warning icon with correct class', () => {
    const { container } = render(<TimelineList events={mockEvents} />)
    expect(container.querySelector('.timeline-list__icon--warning')).toBeInTheDocument()
  })

  it('renders error icon with correct class', () => {
    const { container } = render(<TimelineList events={mockEvents} />)
    expect(container.querySelector('.timeline-list__icon--error')).toBeInTheDocument()
  })

  // Custom icons
  it('uses custom icon when provided', () => {
    const eventsWithCustomIcon = [
      { id: 1, type: 'success', title: 'Test', icon: '🎉', timestamp: new Date() },
    ]
    render(<TimelineList events={eventsWithCustomIcon} />)
    expect(screen.getByText('🎉')).toBeInTheDocument()
  })

  // Default icons by type
  it('shows default icon for payment type', () => {
    const paymentEvents = [{ id: 1, type: 'payment', title: 'Payment', timestamp: new Date() }]
    render(<TimelineList events={paymentEvents} />)
    expect(screen.getByText('💰')).toBeInTheDocument()
  })

  it('shows default icon for message type', () => {
    const messageEvents = [{ id: 1, type: 'message', title: 'Message', timestamp: new Date() }]
    render(<TimelineList events={messageEvents} />)
    expect(screen.getByText('💬')).toBeInTheDocument()
  })

  it('shows default icon for maintenance type', () => {
    const maintenanceEvents = [
      { id: 1, type: 'maintenance', title: 'Maintenance', timestamp: new Date() },
    ]
    render(<TimelineList events={maintenanceEvents} />)
    expect(screen.getByText('🔧')).toBeInTheDocument()
  })

  // Accessibility
  it('has accessible list structure', () => {
    render(<TimelineList events={mockEvents} />)
    expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Timeline')
  })

  it('renders list items with proper role', () => {
    render(<TimelineList events={mockEvents} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  // Without description
  it('renders events without description', () => {
    render(<TimelineList events={mockEvents} />)
    expect(screen.getByText('Application Pending')).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<TimelineList events={mockEvents} className="custom-timeline" />)
    expect(container.querySelector('.timeline-list')).toHaveClass('custom-timeline')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<TimelineList ref={ref} events={mockEvents} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('timeline-list')
  })

  // Fallback for missing id
  it('works with events without id using index', () => {
    const eventsWithoutId = [
      { type: 'success', title: 'Event 1', timestamp: new Date() },
      { type: 'info', title: 'Event 2', timestamp: new Date() },
    ]
    render(<TimelineList events={eventsWithoutId} />)
    expect(screen.getByText('Event 1')).toBeInTheDocument()
    expect(screen.getByText('Event 2')).toBeInTheDocument()
  })
})
