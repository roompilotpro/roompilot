import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ListingHeader from './ListingHeader'

describe('ListingHeader', () => {
  const defaultProps = {
    title: 'Sunny Private Room with City Views',
    location: 'Midtown, Atlanta, GA',
    badges: ['verified', 'new'],
    meta: {
      roomType: 'Private room',
      bathType: 'Private bath',
      size: '180 sq ft',
    },
    rating: 4.92,
    reviewCount: 47,
  }

  it('renders title', () => {
    render(<ListingHeader {...defaultProps} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Sunny Private Room with City Views'
    )
  })

  it('renders location', () => {
    render(<ListingHeader {...defaultProps} />)
    expect(screen.getByText('Midtown, Atlanta, GA')).toBeInTheDocument()
  })

  it('renders badges', () => {
    render(<ListingHeader {...defaultProps} />)
    expect(screen.getByText(/Verified Host/)).toBeInTheDocument()
    expect(screen.getByText(/New Listing/)).toBeInTheDocument()
  })

  it('renders meta information', () => {
    render(<ListingHeader {...defaultProps} />)
    expect(screen.getByText('Private room')).toBeInTheDocument()
    expect(screen.getByText('Private bath')).toBeInTheDocument()
    expect(screen.getByText('180 sq ft')).toBeInTheDocument()
  })

  it('renders rating', () => {
    render(<ListingHeader {...defaultProps} />)
    expect(screen.getByText('4.92')).toBeInTheDocument()
  })

  it('renders review count as button', () => {
    render(<ListingHeader {...defaultProps} />)
    expect(screen.getByRole('button', { name: /47 reviews/i })).toBeInTheDocument()
  })

  it('calls onReviewsClick when reviews button is clicked', () => {
    const onReviewsClick = vi.fn()
    render(<ListingHeader {...defaultProps} onReviewsClick={onReviewsClick} />)

    fireEvent.click(screen.getByRole('button', { name: /47 reviews/i }))
    expect(onReviewsClick).toHaveBeenCalledTimes(1)
  })

  it('renders without optional props', () => {
    render(<ListingHeader title="Test Title" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Title')
  })

  it('applies custom className', () => {
    render(<ListingHeader {...defaultProps} className="custom-header" />)
    expect(document.querySelector('.listing-header')).toHaveClass('custom-header')
  })

  it('ignores unknown badge types', () => {
    render(<ListingHeader title="Test" badges={['unknown', 'verified']} />)
    expect(screen.getByText(/Verified Host/)).toBeInTheDocument()
    expect(screen.queryByText('unknown')).not.toBeInTheDocument()
  })
})
