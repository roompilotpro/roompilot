import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TenantCard from './TenantCard'

describe('TenantCard', () => {
  const defaultProps = {
    name: 'John Doe',
    roomAssignment: 'Room 2, Midtown House',
    rentAmount: 175,
  }

  it('renders tenant name', () => {
    render(<TenantCard {...defaultProps} />)
    expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument()
  })

  it('renders room assignment', () => {
    render(<TenantCard {...defaultProps} />)
    expect(screen.getByText('Room 2, Midtown House')).toBeInTheDocument()
  })

  it('renders rent amount with dollar sign', () => {
    render(<TenantCard {...defaultProps} />)
    expect(screen.getByText('$175')).toBeInTheDocument()
    expect(screen.getByText('/mo')).toBeInTheDocument()
  })

  // Avatar
  it('displays avatar with image when provided', () => {
    render(<TenantCard {...defaultProps} avatarUrl="https://example.com/avatar.jpg" />)
    expect(screen.getByRole('img', { name: 'John Doe' })).toHaveAttribute(
      'src',
      'https://example.com/avatar.jpg'
    )
  })

  it('shows initials when no avatar image', () => {
    render(<TenantCard {...defaultProps} />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('handles single name for initials', () => {
    render(<TenantCard {...defaultProps} name="Madonna" />)
    expect(screen.getByText('M')).toBeInTheDocument()
  })

  // Status
  it('displays correct status badge for active', () => {
    render(<TenantCard {...defaultProps} status="active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('displays correct status badge for inactive', () => {
    render(<TenantCard {...defaultProps} status="inactive" />)
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('displays correct status badge for pending', () => {
    render(<TenantCard {...defaultProps} status="pending" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('uses active as default status', () => {
    render(<TenantCard {...defaultProps} />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  // Actions
  it('renders View button when onView is provided', () => {
    render(<TenantCard {...defaultProps} onView={() => {}} />)
    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument()
  })

  it('renders Edit button when onEdit is provided', () => {
    render(<TenantCard {...defaultProps} onEdit={() => {}} />)
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('does not render View button when onView is not provided', () => {
    render(<TenantCard {...defaultProps} />)
    expect(screen.queryByRole('button', { name: 'View' })).not.toBeInTheDocument()
  })

  it('calls onView when View clicked', async () => {
    const user = userEvent.setup()
    const handleView = vi.fn()
    render(<TenantCard {...defaultProps} onView={handleView} />)

    await user.click(screen.getByRole('button', { name: 'View' }))
    expect(handleView).toHaveBeenCalledTimes(1)
  })

  it('calls onEdit when Edit clicked', async () => {
    const user = userEvent.setup()
    const handleEdit = vi.fn()
    render(<TenantCard {...defaultProps} onEdit={handleEdit} />)

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    expect(handleEdit).toHaveBeenCalledTimes(1)
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<TenantCard {...defaultProps} className="custom-tenant" />)
    expect(container.querySelector('.tenant-card')).toHaveClass('custom-tenant')
  })

  // Ref forwarding
  it('forwards ref to container element', () => {
    const ref = { current: null }
    render(<TenantCard ref={ref} {...defaultProps} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
