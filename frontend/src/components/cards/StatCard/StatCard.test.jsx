import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from './StatCard'

describe('StatCard', () => {
  it('renders icon, value, and label', () => {
    render(<StatCard icon="$" value="$8,450" label="Revenue this month" />)
    expect(screen.getByText('$')).toBeInTheDocument()
    expect(screen.getByText('$8,450')).toBeInTheDocument()
    expect(screen.getByText('Revenue this month')).toBeInTheDocument()
  })

  // Color variants
  it.each(['blue', 'green', 'amber', 'purple'])('applies %s color class', (color) => {
    const { container } = render(<StatCard icon="$" value="100" label="Label" color={color} />)
    expect(container.querySelector(`.stat-card__icon--${color}`)).toBeInTheDocument()
  })

  it('uses blue as default color', () => {
    const { container } = render(<StatCard icon="$" value="100" label="Label" />)
    expect(container.querySelector('.stat-card__icon--blue')).toBeInTheDocument()
  })

  // Trend indicator
  it('renders TrendIndicator when trendValue is provided', () => {
    render(<StatCard icon="$" value="100" label="Label" trendValue={12.5} />)
    expect(screen.getByText('12.5%')).toBeInTheDocument()
  })

  it('does not render TrendIndicator when trendValue is undefined', () => {
    const { container } = render(<StatCard icon="$" value="100" label="Label" />)
    expect(container.querySelector('.trend')).not.toBeInTheDocument()
  })

  it('passes trendDirection to TrendIndicator', () => {
    const { container } = render(
      <StatCard icon="$" value="100" label="Label" trendValue={5} trendDirection="negative" />
    )
    expect(container.querySelector('.trend--negative')).toBeInTheDocument()
  })

  // Hoverable
  it('applies hoverable class by default', () => {
    const { container } = render(<StatCard icon="$" value="100" label="Label" />)
    expect(container.querySelector('.stat-card--hoverable')).toBeInTheDocument()
  })

  it('does not apply hoverable class when hoverable is false', () => {
    const { container } = render(<StatCard icon="$" value="100" label="Label" hoverable={false} />)
    expect(container.querySelector('.stat-card--hoverable')).not.toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(
      <StatCard icon="$" value="100" label="Label" className="custom-stat" />
    )
    expect(container.querySelector('.stat-card')).toHaveClass('custom-stat')
  })

  // Ref forwarding
  it('forwards ref to article element', () => {
    const ref = { current: null }
    render(<StatCard ref={ref} icon="$" value="100" label="Label" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName).toBe('ARTICLE')
  })

  // Complex values
  it('renders numeric value', () => {
    render(<StatCard icon="#" value={42} label="Count" />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders formatted currency', () => {
    render(<StatCard icon="$" value="$1,234.56" label="Revenue" />)
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
  })

  // Trend with zero value
  it('renders TrendIndicator with zero trendValue', () => {
    render(<StatCard icon="$" value="100" label="Label" trendValue={0} />)
    expect(screen.getByText('0.0%')).toBeInTheDocument()
  })
})
