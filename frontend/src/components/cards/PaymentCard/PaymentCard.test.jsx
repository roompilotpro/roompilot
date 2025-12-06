import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PaymentCard from './PaymentCard'

describe('PaymentCard', () => {
  const defaultProps = {
    type: 'visa',
    lastFour: '4242',
  }

  it('renders payment type label', () => {
    render(<PaymentCard {...defaultProps} />)
    expect(screen.getByText('Visa')).toBeInTheDocument()
  })

  it('renders last four digits with dots for card', () => {
    render(<PaymentCard {...defaultProps} />)
    expect(screen.getByText('•••• •••• •••• 4242')).toBeInTheDocument()
  })

  it('renders bank account format for bank type', () => {
    render(<PaymentCard type="bank" lastFour="1234" />)
    expect(screen.getByText('Account ending in 1234')).toBeInTheDocument()
  })

  // Payment types
  it.each([
    ['visa', 'Visa'],
    ['mastercard', 'Mastercard'],
    ['amex', 'American Express'],
    ['discover', 'Discover'],
    ['bank', 'Bank Account'],
  ])('displays correct label for %s', (type, label) => {
    render(<PaymentCard type={type} lastFour="1234" />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  // Expiry date
  it('renders expiry date when provided', () => {
    render(<PaymentCard {...defaultProps} expiryDate="12/2026" />)
    expect(screen.getByText('Expires 12/2026')).toBeInTheDocument()
  })

  it('does not render expiry when not provided', () => {
    render(<PaymentCard {...defaultProps} />)
    expect(screen.queryByText(/Expires/)).not.toBeInTheDocument()
  })

  // Default badge
  it('shows Default badge when isDefault is true', () => {
    render(<PaymentCard {...defaultProps} isDefault />)
    expect(screen.getByText('Default')).toBeInTheDocument()
  })

  it('hides Default badge when isDefault is false', () => {
    render(<PaymentCard {...defaultProps} isDefault={false} />)
    expect(screen.queryByText('Default')).not.toBeInTheDocument()
  })

  // Actions
  it('renders Edit button when onEdit is provided', () => {
    render(<PaymentCard {...defaultProps} onEdit={() => {}} />)
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('renders Remove button when onRemove is provided', () => {
    render(<PaymentCard {...defaultProps} onRemove={() => {}} />)
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
  })

  it('calls onEdit when Edit clicked', async () => {
    const user = userEvent.setup()
    const handleEdit = vi.fn()
    render(<PaymentCard {...defaultProps} onEdit={handleEdit} />)

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    expect(handleEdit).toHaveBeenCalledTimes(1)
  })

  it('calls onRemove when Remove clicked', async () => {
    const user = userEvent.setup()
    const handleRemove = vi.fn()
    render(<PaymentCard {...defaultProps} onRemove={handleRemove} />)

    await user.click(screen.getByRole('button', { name: 'Remove' }))
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })

  // Disabled state
  it('applies disabled class when disabled', () => {
    const { container } = render(<PaymentCard {...defaultProps} disabled />)
    expect(container.querySelector('.payment-card--disabled')).toBeInTheDocument()
  })

  it('disables buttons when disabled', () => {
    render(<PaymentCard {...defaultProps} onEdit={() => {}} onRemove={() => {}} disabled />)
    expect(screen.getByRole('button', { name: 'Edit' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<PaymentCard {...defaultProps} className="custom-payment" />)
    expect(container.querySelector('.payment-card')).toHaveClass('custom-payment')
  })

  // Ref forwarding
  it('forwards ref to container element', () => {
    const ref = { current: null }
    render(<PaymentCard ref={ref} {...defaultProps} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
