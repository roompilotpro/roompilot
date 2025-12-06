import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RoomListingCard from './RoomListingCard'

describe('RoomListingCard', () => {
  const defaultProps = {
    location: 'San Francisco, CA',
    title: 'Cozy room in shared apartment',
    weeklyPrice: '$250',
  }

  it('renders location', () => {
    render(<RoomListingCard {...defaultProps} />)
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(<RoomListingCard {...defaultProps} />)
    expect(
      screen.getByRole('heading', { name: 'Cozy room in shared apartment' })
    ).toBeInTheDocument()
  })

  it('renders weekly price', () => {
    render(<RoomListingCard {...defaultProps} />)
    expect(screen.getByText('$250')).toBeInTheDocument()
    expect(screen.getByText('/week')).toBeInTheDocument()
  })

  // Images
  it('renders image when images provided', () => {
    render(<RoomListingCard {...defaultProps} images={['/room1.jpg', '/room2.jpg']} />)
    expect(screen.getByRole('img', { name: 'Cozy room in shared apartment' })).toHaveAttribute(
      'src',
      '/room1.jpg'
    )
  })

  it('renders placeholder when no images', () => {
    const { container } = render(<RoomListingCard {...defaultProps} />)
    expect(container.querySelector('.room-listing-card__placeholder')).toBeInTheDocument()
  })

  it('renders gallery dots for multiple images', () => {
    render(
      <RoomListingCard {...defaultProps} images={['/room1.jpg', '/room2.jpg', '/room3.jpg']} />
    )
    expect(screen.getAllByRole('button', { name: /View image/ })).toHaveLength(3)
  })

  it('does not render gallery dots for single image', () => {
    render(<RoomListingCard {...defaultProps} images={['/room1.jpg']} />)
    expect(screen.queryByRole('button', { name: /View image/ })).not.toBeInTheDocument()
  })

  it('changes active image when dot clicked', async () => {
    const user = userEvent.setup()
    render(<RoomListingCard {...defaultProps} images={['/room1.jpg', '/room2.jpg']} />)

    await user.click(screen.getByRole('button', { name: 'View image 2' }))
    expect(screen.getByRole('img')).toHaveAttribute('src', '/room2.jpg')
  })

  // Badge
  it('renders badge when provided', () => {
    render(<RoomListingCard {...defaultProps} badge="new" />)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders verified badge', () => {
    render(<RoomListingCard {...defaultProps} badge="verified" />)
    expect(screen.getByText('Verified')).toBeInTheDocument()
  })

  // Favorite
  it('renders favorite button when onFavoriteToggle provided', () => {
    render(<RoomListingCard {...defaultProps} onFavoriteToggle={() => {}} />)
    expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeInTheDocument()
  })

  it('shows active state when isFavorite is true', () => {
    render(<RoomListingCard {...defaultProps} isFavorite onFavoriteToggle={() => {}} />)
    expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeInTheDocument()
  })

  it('calls onFavoriteToggle when clicked', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()
    render(<RoomListingCard {...defaultProps} onFavoriteToggle={handleToggle} />)

    await user.click(screen.getByRole('button', { name: 'Add to favorites' }))
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })

  // Rating
  it('renders rating when provided', () => {
    const { container } = render(<RoomListingCard {...defaultProps} rating={4.5} />)
    expect(container.querySelector('.rating')).toBeInTheDocument()
  })

  it('does not render rating when not provided', () => {
    const { container } = render(<RoomListingCard {...defaultProps} />)
    expect(container.querySelector('.rating')).not.toBeInTheDocument()
  })

  // Details
  it('renders details when provided', () => {
    render(<RoomListingCard {...defaultProps} details="2 bed, 1 bath" />)
    expect(screen.getByText('2 bed, 1 bath')).toBeInTheDocument()
  })

  // Amenities
  it('renders amenities when provided', () => {
    render(<RoomListingCard {...defaultProps} amenities={['WiFi', 'Parking', 'Laundry']} />)
    expect(screen.getByText('WiFi')).toBeInTheDocument()
    expect(screen.getByText('Parking')).toBeInTheDocument()
    expect(screen.getByText('Laundry')).toBeInTheDocument()
  })

  it('limits amenities to 4', () => {
    render(<RoomListingCard {...defaultProps} amenities={['A', 'B', 'C', 'D', 'E', 'F']} />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
    expect(screen.queryByText('E')).not.toBeInTheDocument()
  })

  // Monthly price
  it('renders monthly price when provided', () => {
    render(<RoomListingCard {...defaultProps} monthlyPrice="$950" />)
    expect(screen.getByText('$950/mo')).toBeInTheDocument()
  })

  // Click
  it('calls onClick when card clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<RoomListingCard {...defaultProps} onClick={handleClick} />)

    await user.click(screen.getByRole('article'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not propagate click from favorite button', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    const handleToggle = vi.fn()
    render(
      <RoomListingCard {...defaultProps} onClick={handleClick} onFavoriteToggle={handleToggle} />
    )

    await user.click(screen.getByRole('button', { name: 'Add to favorites' }))
    expect(handleToggle).toHaveBeenCalledTimes(1)
    expect(handleClick).not.toHaveBeenCalled()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<RoomListingCard {...defaultProps} className="custom-listing" />)
    expect(container.querySelector('.room-listing-card')).toHaveClass('custom-listing')
  })

  // Ref forwarding
  it('forwards ref to article element', () => {
    const ref = { current: null }
    render(<RoomListingCard ref={ref} {...defaultProps} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName).toBe('ARTICLE')
  })
})
