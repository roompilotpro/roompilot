import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BookingCard from './BookingCard'

describe('BookingCard', () => {
  const defaultProps = {
    pricing: {
      weeklyPrice: '$175',
      monthlyPrice: '$700',
      utilitiesIncluded: true,
    },
    availability: {
      isAvailable: true,
      text: 'Available now',
    },
    breakdown: [
      { label: '$175 x 4 weeks', value: '$700' },
      { label: 'Move-in fee', value: '$50' },
      { label: 'Service fee', value: '$0' },
    ],
    total: { label: 'First month total', value: '$750' },
    features: [
      { icon: '⚡', title: 'Weekly payments', description: 'Pay as you go' },
      { icon: '🛡️', title: 'No deposit required', description: 'Just a $50 move-in fee' },
    ],
  }

  it('renders weekly price', () => {
    render(<BookingCard {...defaultProps} />)
    expect(screen.getByText('$175')).toBeInTheDocument()
    expect(screen.getByText('/week')).toBeInTheDocument()
  })

  it('renders monthly price with utilities', () => {
    render(<BookingCard {...defaultProps} />)
    expect(screen.getByText(/\$700\/month/)).toBeInTheDocument()
    expect(screen.getByText(/All utilities included/)).toBeInTheDocument()
  })

  it('renders availability status', () => {
    render(<BookingCard {...defaultProps} />)
    expect(screen.getByText('Available now')).toBeInTheDocument()
    expect(document.querySelector('.booking-card__availability-dot')).toBeInTheDocument()
  })

  it('renders unavailable state', () => {
    render(
      <BookingCard {...defaultProps} availability={{ isAvailable: false, text: 'Not available' }} />
    )
    expect(screen.getByText('Not available')).toBeInTheDocument()
    expect(document.querySelector('.booking-card__availability--unavailable')).toBeInTheDocument()
  })

  it('renders form with selects', () => {
    render(<BookingCard {...defaultProps} />)
    expect(screen.getByText('Move-in date')).toBeInTheDocument()
    expect(screen.getByText('Planned stay length')).toBeInTheDocument()
    expect(screen.getAllByRole('combobox')).toHaveLength(2)
  })

  it('renders Apply Now button', () => {
    render(<BookingCard {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Apply Now' })).toBeInTheDocument()
  })

  it('calls onApply with form values when button clicked', () => {
    const onApply = vi.fn()
    render(<BookingCard {...defaultProps} onApply={onApply} />)

    fireEvent.click(screen.getByRole('button', { name: 'Apply Now' }))
    expect(onApply).toHaveBeenCalledWith({
      moveInDate: 'asap',
      stayLength: '1-3',
    })
  })

  it('renders price breakdown', () => {
    render(<BookingCard {...defaultProps} />)
    expect(screen.getByText('$175 x 4 weeks')).toBeInTheDocument()
    expect(screen.getByText('Move-in fee')).toBeInTheDocument()
    expect(screen.getByText('Service fee')).toBeInTheDocument()
  })

  it('renders total', () => {
    render(<BookingCard {...defaultProps} />)
    expect(screen.getByText('First month total')).toBeInTheDocument()
    expect(screen.getByText('$750')).toBeInTheDocument()
  })

  it('renders features', () => {
    render(<BookingCard {...defaultProps} />)
    expect(screen.getByText('Weekly payments')).toBeInTheDocument()
    expect(screen.getByText(/Pay as you go/)).toBeInTheDocument()
    expect(screen.getByText('No deposit required')).toBeInTheDocument()
  })

  it('renders report link', () => {
    render(<BookingCard {...defaultProps} />)
    expect(screen.getByRole('button', { name: /Report this listing/i })).toBeInTheDocument()
  })

  it('calls onReport when report link clicked', () => {
    const onReport = vi.fn()
    render(<BookingCard {...defaultProps} onReport={onReport} />)

    fireEvent.click(screen.getByRole('button', { name: /Report this listing/i }))
    expect(onReport).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    render(<BookingCard {...defaultProps} className="custom-booking" />)
    expect(document.querySelector('.booking-card-wrapper')).toHaveClass('custom-booking')
  })
})
