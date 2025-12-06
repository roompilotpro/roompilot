import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FeatureCard from './FeatureCard'

describe('FeatureCard', () => {
  const defaultProps = {
    icon: '🏠',
    heading: 'Feature Title',
    description: 'Feature description text',
  }

  it('renders icon', () => {
    render(<FeatureCard {...defaultProps} />)
    expect(screen.getByText('🏠')).toBeInTheDocument()
  })

  it('renders heading', () => {
    render(<FeatureCard {...defaultProps} />)
    expect(screen.getByRole('heading', { name: 'Feature Title' })).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<FeatureCard {...defaultProps} />)
    expect(screen.getByText('Feature description text')).toBeInTheDocument()
  })

  // Metrics
  it('renders metrics when provided', () => {
    const metrics = [
      { value: '47', label: 'Rooms listed' },
      { value: '92%', label: 'Occupancy' },
    ]
    render(<FeatureCard {...defaultProps} metrics={metrics} />)
    expect(screen.getByText('47')).toBeInTheDocument()
    expect(screen.getByText('Rooms listed')).toBeInTheDocument()
    expect(screen.getByText('92%')).toBeInTheDocument()
    expect(screen.getByText('Occupancy')).toBeInTheDocument()
  })

  it('does not render metrics container when no metrics', () => {
    const { container } = render(<FeatureCard {...defaultProps} />)
    expect(container.querySelector('.feature-card__metrics')).not.toBeInTheDocument()
  })

  it('does not render metrics container when metrics is empty array', () => {
    const { container } = render(<FeatureCard {...defaultProps} metrics={[]} />)
    expect(container.querySelector('.feature-card__metrics')).not.toBeInTheDocument()
  })

  // Highlight
  it('applies highlight class when highlight is true', () => {
    const { container } = render(<FeatureCard {...defaultProps} highlight />)
    expect(container.querySelector('.feature-card--highlight')).toBeInTheDocument()
  })

  it('does not apply highlight class by default', () => {
    const { container } = render(<FeatureCard {...defaultProps} />)
    expect(container.querySelector('.feature-card--highlight')).not.toBeInTheDocument()
  })

  // Hoverable
  it('applies hoverable class by default', () => {
    const { container } = render(<FeatureCard {...defaultProps} />)
    expect(container.querySelector('.feature-card--hoverable')).toBeInTheDocument()
  })

  it('does not apply hoverable class when hoverable is false', () => {
    const { container } = render(<FeatureCard {...defaultProps} hoverable={false} />)
    expect(container.querySelector('.feature-card--hoverable')).not.toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<FeatureCard {...defaultProps} className="custom-feature" />)
    expect(container.querySelector('.feature-card')).toHaveClass('custom-feature')
  })

  // Ref forwarding
  it('forwards ref to article element', () => {
    const ref = { current: null }
    render(<FeatureCard ref={ref} {...defaultProps} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName).toBe('ARTICLE')
  })

  // Multiple metrics
  it('renders multiple metrics correctly', () => {
    const metrics = [
      { value: '10', label: 'Label 1' },
      { value: '20', label: 'Label 2' },
      { value: '30', label: 'Label 3' },
    ]
    render(<FeatureCard {...defaultProps} metrics={metrics} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })
})
