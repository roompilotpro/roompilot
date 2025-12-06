import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import OccupancyBar from './OccupancyBar'

describe('OccupancyBar', () => {
  // Basic rendering
  it('renders label with current/total by default', () => {
    render(<OccupancyBar current={3} total={4} />)
    expect(screen.getByText('3/4')).toBeInTheDocument()
  })

  it('renders progressbar role', () => {
    render(<OccupancyBar current={2} total={4} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria-valuenow to percentage', () => {
    render(<OccupancyBar current={2} total={4} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
  })

  it('sets aria-label with occupancy info', () => {
    render(<OccupancyBar current={3} total={4} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Occupancy: 3 of 4')
  })

  // Fill percentage
  it('sets fill width based on percentage', () => {
    const { container } = render(<OccupancyBar current={3} total={4} />)
    const fill = container.querySelector('.occupancy-bar__fill')
    expect(fill).toHaveStyle({ width: '75%' })
  })

  it('handles 0/0 without error', () => {
    const { container } = render(<OccupancyBar current={0} total={0} />)
    const fill = container.querySelector('.occupancy-bar__fill')
    expect(fill).toHaveStyle({ width: '0%' })
  })

  it('clamps percentage at 100%', () => {
    const { container } = render(<OccupancyBar current={5} total={4} />)
    const fill = container.querySelector('.occupancy-bar__fill')
    expect(fill).toHaveStyle({ width: '100%' })
  })

  // Status colors
  it('applies high status for >= 75%', () => {
    const { container } = render(<OccupancyBar current={3} total={4} />)
    expect(container.querySelector('.occupancy-bar__fill--high')).toBeInTheDocument()
  })

  it('applies medium status for >= 50%', () => {
    const { container } = render(<OccupancyBar current={2} total={4} />)
    expect(container.querySelector('.occupancy-bar__fill--medium')).toBeInTheDocument()
  })

  it('applies low status for < 50%', () => {
    const { container } = render(<OccupancyBar current={1} total={4} />)
    expect(container.querySelector('.occupancy-bar__fill--low')).toBeInTheDocument()
  })

  // Label options
  it('hides label when showLabel is false', () => {
    const { container } = render(<OccupancyBar current={3} total={4} showLabel={false} />)
    expect(container.querySelector('.occupancy-bar__label')).not.toBeInTheDocument()
  })

  it('shows percentage when showPercentage is true', () => {
    render(<OccupancyBar current={3} total={4} showPercentage />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  // Sizes
  it('applies md size by default', () => {
    const { container } = render(<OccupancyBar current={2} total={4} />)
    expect(container.querySelector('.occupancy-bar--md')).toBeInTheDocument()
  })

  it('applies sm size', () => {
    const { container } = render(<OccupancyBar current={2} total={4} size="sm" />)
    expect(container.querySelector('.occupancy-bar--sm')).toBeInTheDocument()
  })

  it('applies lg size', () => {
    const { container } = render(<OccupancyBar current={2} total={4} size="lg" />)
    expect(container.querySelector('.occupancy-bar--lg')).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<OccupancyBar current={2} total={4} className="custom-bar" />)
    expect(container.querySelector('.occupancy-bar')).toHaveClass('custom-bar')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<OccupancyBar ref={ref} current={2} total={4} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('occupancy-bar')
  })

  // Edge cases
  it('rounds percentage', () => {
    render(<OccupancyBar current={1} total={3} showPercentage />)
    expect(screen.getByText('33%')).toBeInTheDocument()
  })

  it('handles full occupancy', () => {
    render(<OccupancyBar current={4} total={4} />)
    expect(screen.getByText('4/4')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('handles empty occupancy', () => {
    render(<OccupancyBar current={0} total={4} />)
    expect(screen.getByText('0/4')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })
})
