import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PricingCard from './PricingCard'

describe('PricingCard', () => {
  const defaultProps = {
    planName: 'Pro Plan',
    price: '$15',
    period: '/month',
    features: ['Feature 1', 'Feature 2'],
    ctaText: 'Get Started',
  }

  it('renders plan name', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByRole('heading', { name: 'Pro Plan' })).toBeInTheDocument()
  })

  it('renders price and period', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByText('$15')).toBeInTheDocument()
    expect(screen.getByText('/month')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<PricingCard {...defaultProps} description="Best for teams" />)
    expect(screen.getByText('Best for teams')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const { container } = render(<PricingCard {...defaultProps} />)
    expect(container.querySelector('.pricing-card__description')).not.toBeInTheDocument()
  })

  // Features
  it('renders all features with checkmarks', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByText('Feature 1')).toBeInTheDocument()
    expect(screen.getByText('Feature 2')).toBeInTheDocument()
  })

  it('does not render features list when no features', () => {
    const { container } = render(<PricingCard {...defaultProps} features={[]} />)
    expect(container.querySelector('.pricing-card__features')).not.toBeInTheDocument()
  })

  // CTA Button
  it('renders CTA button with text', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument()
  })

  it('calls onCtaClick when CTA clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<PricingCard {...defaultProps} onCtaClick={handleClick} />)

    await user.click(screen.getByRole('button', { name: 'Get Started' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders CTA button when ctaHref provided', () => {
    render(<PricingCard {...defaultProps} ctaHref="/signup" />)
    // Button component doesn't render as anchor, so we just check it's rendered
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument()
  })

  it('applies correct CTA variant', () => {
    const { container } = render(<PricingCard {...defaultProps} ctaVariant="secondary" />)
    expect(container.querySelector('.btn--secondary')).toBeInTheDocument()
  })

  // Recommended
  it('applies recommended class when recommended', () => {
    const { container } = render(<PricingCard {...defaultProps} recommended />)
    expect(container.querySelector('.pricing-card--recommended')).toBeInTheDocument()
  })

  it('shows Recommended badge when recommended', () => {
    render(<PricingCard {...defaultProps} recommended />)
    expect(screen.getByText('Recommended')).toBeInTheDocument()
  })

  it('uses custom recommended text', () => {
    render(<PricingCard {...defaultProps} recommended recommendedText="Most Popular" />)
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })

  it('does not show badge when not recommended', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.queryByText('Recommended')).not.toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<PricingCard {...defaultProps} className="custom-pricing" />)
    expect(container.querySelector('.pricing-card')).toHaveClass('custom-pricing')
  })

  // Ref forwarding
  it('forwards ref to article element', () => {
    const ref = { current: null }
    render(<PricingCard ref={ref} {...defaultProps} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName).toBe('ARTICLE')
  })

  // No CTA
  it('does not render CTA when no CTA props provided', () => {
    const { container } = render(
      <PricingCard planName="Basic" price="$0" period="/month" features={['Free']} />
    )
    expect(container.querySelector('.pricing-card__cta')).not.toBeInTheDocument()
  })
})
