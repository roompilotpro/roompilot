import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PropertyCard from './PropertyCard'

describe('PropertyCard', () => {
  const defaultProps = {
    name: 'Sunset Apartments',
    address: '123 Main St, San Francisco, CA',
    occupiedRooms: 8,
    totalRooms: 10,
    revenue: '$4,200/mo',
  }

  it('renders property name', () => {
    render(<PropertyCard {...defaultProps} />)
    expect(screen.getByRole('heading', { name: 'Sunset Apartments' })).toBeInTheDocument()
  })

  it('renders property address', () => {
    render(<PropertyCard {...defaultProps} />)
    expect(screen.getByText('123 Main St, San Francisco, CA')).toBeInTheDocument()
  })

  it('renders occupancy text', () => {
    render(<PropertyCard {...defaultProps} />)
    expect(screen.getByText('8/10')).toBeInTheDocument()
  })

  it('renders revenue', () => {
    render(<PropertyCard {...defaultProps} />)
    expect(screen.getByText('$4,200/mo')).toBeInTheDocument()
  })

  // Image
  it('renders image when imageUrl provided', () => {
    render(<PropertyCard {...defaultProps} imageUrl="/property.jpg" />)
    expect(screen.getByRole('img', { name: 'Sunset Apartments' })).toHaveAttribute(
      'src',
      '/property.jpg'
    )
  })

  it('renders placeholder icon when no imageUrl', () => {
    const { container } = render(<PropertyCard {...defaultProps} />)
    expect(container.querySelector('.property-card__image svg')).toBeInTheDocument()
  })

  // Status
  it('renders active status by default', () => {
    render(<PropertyCard {...defaultProps} />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders pending status', () => {
    render(<PropertyCard {...defaultProps} status="pending" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('renders issue status', () => {
    render(<PropertyCard {...defaultProps} status="issue" />)
    expect(screen.getByText('Issue')).toBeInTheDocument()
  })

  // Actions
  it('renders view button when onView provided', () => {
    render(<PropertyCard {...defaultProps} onView={() => {}} />)
    expect(screen.getByRole('button', { name: 'View property' })).toBeInTheDocument()
  })

  it('does not render view button when onView not provided', () => {
    render(<PropertyCard {...defaultProps} />)
    expect(screen.queryByRole('button', { name: 'View property' })).not.toBeInTheDocument()
  })

  it('calls onView when view button clicked', async () => {
    const user = userEvent.setup()
    const handleView = vi.fn()
    render(<PropertyCard {...defaultProps} onView={handleView} />)

    await user.click(screen.getByRole('button', { name: 'View property' }))
    expect(handleView).toHaveBeenCalledTimes(1)
  })

  it('renders menu button when onMenuClick provided', () => {
    render(<PropertyCard {...defaultProps} onMenuClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'More options' })).toBeInTheDocument()
  })

  it('calls onMenuClick when menu button clicked', async () => {
    const user = userEvent.setup()
    const handleMenuClick = vi.fn()
    render(<PropertyCard {...defaultProps} onMenuClick={handleMenuClick} />)

    await user.click(screen.getByRole('button', { name: 'More options' }))
    expect(handleMenuClick).toHaveBeenCalledTimes(1)
  })

  // Occupancy edge cases
  it('handles zero rooms', () => {
    render(<PropertyCard {...defaultProps} occupiedRooms={0} totalRooms={0} />)
    expect(screen.getByText('0/0')).toBeInTheDocument()
  })

  it('handles full occupancy', () => {
    render(<PropertyCard {...defaultProps} occupiedRooms={10} totalRooms={10} />)
    expect(screen.getByText('10/10')).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<PropertyCard {...defaultProps} className="custom-property" />)
    expect(container.querySelector('.property-card')).toHaveClass('custom-property')
  })

  // Ref forwarding
  it('forwards ref to article element', () => {
    const ref = { current: null }
    render(<PropertyCard ref={ref} {...defaultProps} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName).toBe('ARTICLE')
  })

  // Progress bar
  it('renders progress bar for occupancy', () => {
    const { container } = render(<PropertyCard {...defaultProps} />)
    expect(container.querySelector('.progress-bar')).toBeInTheDocument()
  })
})
