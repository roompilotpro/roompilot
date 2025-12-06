import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AmenitiesGrid from './AmenitiesGrid'

describe('AmenitiesGrid', () => {
  const amenities = [
    { icon: '📶', label: 'High-speed WiFi', available: true },
    { icon: '❄️', label: 'Central air conditioning', available: true },
    { icon: '🧺', label: 'In-unit washer/dryer', available: true },
    { icon: '🅿️', label: 'Parking not included', available: false },
    { icon: '🏋️', label: 'No gym access', available: false },
  ]

  it('renders title', () => {
    render(<AmenitiesGrid amenities={amenities} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('What this place offers')
  })

  it('renders custom title', () => {
    render(<AmenitiesGrid amenities={amenities} title="Amenities" />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Amenities')
  })

  it('renders amenity items', () => {
    render(<AmenitiesGrid amenities={amenities} />)
    expect(screen.getByText('High-speed WiFi')).toBeInTheDocument()
    expect(screen.getByText('Central air conditioning')).toBeInTheDocument()
    expect(screen.getByText('In-unit washer/dryer')).toBeInTheDocument()
  })

  it('renders unavailable items with styling', () => {
    render(<AmenitiesGrid amenities={amenities} />)
    const unavailableItem = screen
      .getByText('Parking not included')
      .closest('.amenities-grid__item')
    expect(unavailableItem).toHaveClass('amenities-grid__item--unavailable')
  })

  it('limits displayed amenities to displayCount', () => {
    const manyAmenities = Array(20)
      .fill(null)
      .map((_, i) => ({ icon: '✓', label: `Amenity ${i + 1}` }))

    render(<AmenitiesGrid amenities={manyAmenities} displayCount={10} />)
    expect(screen.getByText('Amenity 1')).toBeInTheDocument()
    expect(screen.getByText('Amenity 10')).toBeInTheDocument()
    expect(screen.queryByText('Amenity 11')).not.toBeInTheDocument()
  })

  it('shows "Show all" button when totalCount exceeds displayCount', () => {
    render(<AmenitiesGrid amenities={amenities} totalCount={18} displayCount={10} />)
    expect(screen.getByRole('button', { name: /Show all 18 amenities/i })).toBeInTheDocument()
  })

  it('hides "Show all" button when all amenities are displayed', () => {
    render(<AmenitiesGrid amenities={amenities} displayCount={10} />)
    expect(screen.queryByRole('button', { name: /Show all/i })).not.toBeInTheDocument()
  })

  it('calls onShowAll when button is clicked', () => {
    const onShowAll = vi.fn()
    render(<AmenitiesGrid amenities={amenities} totalCount={18} onShowAll={onShowAll} />)

    fireEvent.click(screen.getByRole('button', { name: /Show all/i }))
    expect(onShowAll).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    render(<AmenitiesGrid amenities={amenities} className="custom-amenities" />)
    expect(document.querySelector('.amenities-grid')).toHaveClass('custom-amenities')
  })
})
