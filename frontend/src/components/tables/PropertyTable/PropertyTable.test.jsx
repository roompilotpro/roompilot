import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PropertyTable from './PropertyTable'

const mockTenants = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    property: '123 Main Street',
    room: 'Room A',
    moveInDate: new Date('2024-01-15T12:00:00'),
    paymentStatus: 'paid',
    balance: 0,
    dueDate: null,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: null,
    property: '456 Oak Avenue',
    room: 'Room B',
    moveInDate: new Date('2024-02-01T12:00:00'),
    paymentStatus: 'due-soon',
    balance: 175,
    dueDate: new Date('2024-12-15T12:00:00'),
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: null,
    property: '789 Pine Lane',
    room: 'Room C',
    moveInDate: new Date('2024-03-10T12:00:00'),
    paymentStatus: 'late',
    balance: 350,
    dueDate: new Date('2024-12-01T12:00:00'),
  },
]

describe('PropertyTable', () => {
  // Basic rendering
  it('renders the table', () => {
    render(<PropertyTable tenants={mockTenants} />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(<PropertyTable tenants={mockTenants} />)
    expect(screen.getByText('Tenant')).toBeInTheDocument()
    expect(screen.getByText('Property & Room')).toBeInTheDocument()
    expect(screen.getByText('Move-in Date')).toBeInTheDocument()
    expect(screen.getByText('Payment Status')).toBeInTheDocument()
    expect(screen.getByText('Balance/Due')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('renders tenant rows', () => {
    render(<PropertyTable tenants={mockTenants} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
  })

  it('renders tenant details', () => {
    render(<PropertyTable tenants={mockTenants} />)
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('123 Main Street')).toBeInTheDocument()
    expect(screen.getByText('Room A')).toBeInTheDocument()
  })

  // Empty state
  it('renders default empty state when no tenants', () => {
    render(<PropertyTable tenants={[]} />)
    expect(screen.getByText('No tenants found')).toBeInTheDocument()
  })

  it('renders custom empty state', () => {
    render(<PropertyTable tenants={[]} emptyState={<div>Custom empty</div>} />)
    expect(screen.getByText('Custom empty')).toBeInTheDocument()
  })

  // Status badges
  it('renders paid status badge', () => {
    render(<PropertyTable tenants={mockTenants} />)
    expect(screen.getByText('Paid')).toBeInTheDocument()
  })

  it('renders due-soon status badge', () => {
    render(<PropertyTable tenants={mockTenants} />)
    expect(screen.getByText('Due-soon')).toBeInTheDocument()
  })

  it('renders late status badge', () => {
    render(<PropertyTable tenants={mockTenants} />)
    expect(screen.getByText('Late')).toBeInTheDocument()
  })

  // Date formatting
  it('formats move-in dates', () => {
    render(<PropertyTable tenants={mockTenants} />)
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
  })

  // Currency formatting
  it('formats balance amounts', () => {
    render(<PropertyTable tenants={mockTenants} />)
    expect(screen.getByText('$175')).toBeInTheDocument()
    expect(screen.getByText('$350')).toBeInTheDocument()
  })

  // Row click
  it('calls onRowClick when row is clicked', () => {
    const handleRowClick = vi.fn()
    render(<PropertyTable tenants={mockTenants} onRowClick={handleRowClick} />)
    fireEvent.click(screen.getByText('John Doe').closest('tr'))
    expect(handleRowClick).toHaveBeenCalledWith(mockTenants[0])
  })

  it('applies clickable class when onRowClick provided', () => {
    const { container } = render(<PropertyTable tenants={mockTenants} onRowClick={() => {}} />)
    expect(container.querySelector('.property-table__row--clickable')).toBeInTheDocument()
  })

  // Actions
  it('renders message button when onMessage provided', () => {
    render(<PropertyTable tenants={mockTenants} onMessage={() => {}} />)
    expect(screen.getAllByRole('button', { name: /message/i })).toHaveLength(3)
  })

  it('renders view button when onView provided', () => {
    render(<PropertyTable tenants={mockTenants} onView={() => {}} />)
    expect(screen.getAllByRole('button', { name: /view/i })).toHaveLength(3)
  })

  it('calls onMessage when message button clicked', () => {
    const handleMessage = vi.fn()
    render(<PropertyTable tenants={mockTenants} onMessage={handleMessage} />)
    const messageButtons = screen.getAllByRole('button', { name: /message/i })
    fireEvent.click(messageButtons[0])
    expect(handleMessage).toHaveBeenCalledWith(mockTenants[0])
  })

  it('calls onView when view button clicked', () => {
    const handleView = vi.fn()
    render(<PropertyTable tenants={mockTenants} onView={handleView} />)
    const viewButtons = screen.getAllByRole('button', { name: /view/i })
    fireEvent.click(viewButtons[0])
    expect(handleView).toHaveBeenCalledWith(mockTenants[0])
  })

  it('does not trigger row click when action button clicked', () => {
    const handleRowClick = vi.fn()
    const handleMessage = vi.fn()
    render(
      <PropertyTable tenants={mockTenants} onRowClick={handleRowClick} onMessage={handleMessage} />
    )
    const messageButtons = screen.getAllByRole('button', { name: /message/i })
    fireEvent.click(messageButtons[0])
    expect(handleMessage).toHaveBeenCalled()
    expect(handleRowClick).not.toHaveBeenCalled()
  })

  // Hide actions
  it('hides actions column when showActions is false', () => {
    render(<PropertyTable tenants={mockTenants} showActions={false} />)
    expect(screen.queryByText('Actions')).not.toBeInTheDocument()
  })

  // Accessibility
  it('has accessible action button labels', () => {
    render(<PropertyTable tenants={mockTenants} onMessage={() => {}} />)
    expect(screen.getByLabelText('Message John Doe')).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<PropertyTable tenants={mockTenants} className="custom-table" />)
    expect(container.querySelector('.property-table')).toHaveClass('custom-table')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<PropertyTable ref={ref} tenants={mockTenants} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('property-table')
  })

  // Avatar rendering
  it('renders avatar for each tenant', () => {
    const { container } = render(<PropertyTable tenants={mockTenants} />)
    const avatars = container.querySelectorAll('.avatar')
    expect(avatars).toHaveLength(3)
  })

  // Due date display
  it('shows due date when balance is present', () => {
    render(<PropertyTable tenants={mockTenants} />)
    expect(screen.getByText(/Due Dec 15, 2024/)).toBeInTheDocument()
  })
})
