import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PriceDisplay from './PriceDisplay'

describe('PriceDisplay', () => {
  // Basic rendering
  it('renders amount', () => {
    render(<PriceDisplay amount={500} />)
    expect(screen.getByText('$500')).toBeInTheDocument()
  })

  it('formats large numbers with commas', () => {
    render(<PriceDisplay amount={1500} />)
    expect(screen.getByText('$1,500')).toBeInTheDocument()
  })

  // Period
  it('renders with /week period', () => {
    render(<PriceDisplay amount={200} period="/week" />)
    expect(screen.getByText('/week')).toBeInTheDocument()
  })

  it('renders with /month period as /mo', () => {
    render(<PriceDisplay amount={800} period="/month" />)
    expect(screen.getByText('/mo')).toBeInTheDocument()
  })

  it('renders with /year period', () => {
    render(<PriceDisplay amount={9600} period="/year" />)
    expect(screen.getByText('/year')).toBeInTheDocument()
  })

  it('does not render period for total', () => {
    const { container } = render(<PriceDisplay amount={500} period="total" />)
    expect(container.querySelector('.price-display__period')).not.toBeInTheDocument()
  })

  it('renders custom period string', () => {
    render(<PriceDisplay amount={100} period="/night" />)
    expect(screen.getByText('/night')).toBeInTheDocument()
  })

  // Decimals
  it('hides decimals by default', () => {
    render(<PriceDisplay amount={99.99} />)
    expect(screen.getByText('$100')).toBeInTheDocument()
  })

  it('shows decimals when showDecimals is true', () => {
    render(<PriceDisplay amount={99.99} showDecimals />)
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  // Original amount (discount)
  it('renders original amount with strikethrough', () => {
    const { container } = render(<PriceDisplay amount={400} originalAmount={500} />)
    expect(screen.getByText('$500')).toBeInTheDocument()
    expect(container.querySelector('.price-display__original')).toHaveTextContent('$500')
  })

  it('applies discount class when originalAmount is provided', () => {
    const { container } = render(<PriceDisplay amount={400} originalAmount={500} />)
    expect(container.querySelector('.price-display--has-discount')).toBeInTheDocument()
  })

  // Currency
  it('uses USD by default', () => {
    render(<PriceDisplay amount={100} />)
    expect(screen.getByText('$100')).toBeInTheDocument()
  })

  it('supports EUR currency', () => {
    render(<PriceDisplay amount={100} currency="EUR" locale="de-DE" />)
    // EUR format varies by locale, just check it renders
    expect(screen.getByText(/100/)).toBeInTheDocument()
  })

  it('supports GBP currency', () => {
    render(<PriceDisplay amount={100} currency="GBP" locale="en-GB" />)
    expect(screen.getByText('£100')).toBeInTheDocument()
  })

  // Sizes
  it('applies md size by default', () => {
    const { container } = render(<PriceDisplay amount={100} />)
    expect(container.querySelector('.price-display--md')).toBeInTheDocument()
  })

  it('applies sm size', () => {
    const { container } = render(<PriceDisplay amount={100} size="sm" />)
    expect(container.querySelector('.price-display--sm')).toBeInTheDocument()
  })

  it('applies lg size', () => {
    const { container } = render(<PriceDisplay amount={100} size="lg" />)
    expect(container.querySelector('.price-display--lg')).toBeInTheDocument()
  })

  it('applies xl size', () => {
    const { container } = render(<PriceDisplay amount={100} size="xl" />)
    expect(container.querySelector('.price-display--xl')).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<PriceDisplay amount={100} className="custom-price" />)
    expect(container.querySelector('.price-display')).toHaveClass('custom-price')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<PriceDisplay ref={ref} amount={100} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('price-display')
  })

  // Edge cases
  it('handles zero amount', () => {
    render(<PriceDisplay amount={0} />)
    expect(screen.getByText('$0')).toBeInTheDocument()
  })

  it('handles string amount', () => {
    render(<PriceDisplay amount="250" />)
    expect(screen.getByText('$250')).toBeInTheDocument()
  })
})
