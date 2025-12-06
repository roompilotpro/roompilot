import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SimilarListings from './SimilarListings'

describe('SimilarListings', () => {
  const listings = [
    { id: '1', location: 'East Atlanta', title: 'Cozy room in bungalow', weeklyPrice: '$145' },
    { id: '2', location: 'West End', title: 'Spacious master suite', weeklyPrice: '$195' },
    {
      id: '3',
      location: 'Old Fourth Ward',
      title: 'Modern room near BeltLine',
      weeklyPrice: '$185',
    },
    { id: '4', location: 'Grant Park', title: 'Charming room in Victorian', weeklyPrice: '$160' },
  ]

  it('renders title', () => {
    render(<SimilarListings listings={listings} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Similar rooms nearby')
  })

  it('renders custom title', () => {
    render(<SimilarListings listings={listings} title="More rooms" />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('More rooms')
  })

  it('renders listing cards', () => {
    render(<SimilarListings listings={listings} />)
    expect(screen.getByText('East Atlanta')).toBeInTheDocument()
    expect(screen.getByText('Cozy room in bungalow')).toBeInTheDocument()
    expect(screen.getByText('$145')).toBeInTheDocument()
  })

  it('renders all 4 listings', () => {
    render(<SimilarListings listings={listings} />)
    expect(document.querySelectorAll('.similar-listings__card')).toHaveLength(4)
  })

  it('calls onListingClick when card is clicked', () => {
    const onListingClick = vi.fn()
    render(<SimilarListings listings={listings} onListingClick={onListingClick} />)

    fireEvent.click(screen.getByText('East Atlanta').closest('.similar-listings__card'))
    expect(onListingClick).toHaveBeenCalledWith(listings[0])
  })

  it('shows navigation buttons when more than 4 listings', () => {
    const manyListings = [
      ...listings,
      { id: '5', location: 'Decatur', title: 'Quiet room', weeklyPrice: '$125' },
    ]
    render(<SimilarListings listings={manyListings} />)
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
  })

  it('hides navigation when 4 or fewer listings', () => {
    render(<SimilarListings listings={listings} />)
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
  })

  it('renders nothing when no listings provided', () => {
    const { container } = render(<SimilarListings listings={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('applies custom className', () => {
    render(<SimilarListings listings={listings} className="custom-similar" />)
    expect(document.querySelector('.similar-listings')).toHaveClass('custom-similar')
  })

  it('navigates to next page', () => {
    const manyListings = [
      ...listings,
      { id: '5', location: 'Decatur', title: 'Quiet room', weeklyPrice: '$125' },
      { id: '6', location: 'Buckhead', title: 'Luxury room', weeklyPrice: '$250' },
    ]
    render(<SimilarListings listings={manyListings} />)

    // Initially first 4 should be visible
    expect(screen.getByText('East Atlanta')).toBeInTheDocument()

    // Click next
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    // Now should show listings 5 and 6
    expect(screen.getByText('Decatur')).toBeInTheDocument()
  })
})
