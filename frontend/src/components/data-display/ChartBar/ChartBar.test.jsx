import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ChartBar from './ChartBar'

const mockData = [
  { label: 'Mon', value: 100 },
  { label: 'Tue', value: 200 },
  { label: 'Wed', value: 150 },
]

describe('ChartBar', () => {
  // Basic rendering
  it('renders all bars', () => {
    const { container } = render(<ChartBar data={mockData} />)
    const bars = container.querySelectorAll('.chart-bar__bar')
    expect(bars).toHaveLength(3)
  })

  it('renders labels by default', () => {
    render(<ChartBar data={mockData} />)
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
  })

  // Bar heights
  it('sets bar heights proportionally to max value', () => {
    const { container } = render(<ChartBar data={mockData} />)
    const bars = container.querySelectorAll('.chart-bar__bar')
    // Max is 200, so Tue (200) should be 100%, Mon (100) should be 50%, Wed (150) should be 75%
    expect(bars[0]).toHaveStyle({ height: '50%' })
    expect(bars[1]).toHaveStyle({ height: '100%' })
    expect(bars[2]).toHaveStyle({ height: '75%' })
  })

  it('handles zero values', () => {
    const dataWithZero = [
      { label: 'A', value: 0 },
      { label: 'B', value: 100 },
    ]
    const { container } = render(<ChartBar data={dataWithZero} />)
    const bars = container.querySelectorAll('.chart-bar__bar')
    expect(bars[0]).toHaveStyle({ height: '0%' })
    expect(bars[1]).toHaveStyle({ height: '100%' })
  })

  it('handles all zero values', () => {
    const allZeros = [
      { label: 'A', value: 0 },
      { label: 'B', value: 0 },
    ]
    const { container } = render(<ChartBar data={allZeros} />)
    const bars = container.querySelectorAll('.chart-bar__bar')
    expect(bars[0]).toHaveStyle({ height: '0%' })
  })

  // Tooltip
  it('shows tooltip on hover', () => {
    const { container } = render(<ChartBar data={mockData} />)
    const barWrapper = container.querySelector('.chart-bar__bar-wrapper')
    fireEvent.mouseEnter(barWrapper)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('hides tooltip on mouse leave', () => {
    const { container } = render(<ChartBar data={mockData} />)
    const barWrapper = container.querySelector('.chart-bar__bar-wrapper')
    fireEvent.mouseEnter(barWrapper)
    expect(screen.getByText('100')).toBeInTheDocument()
    fireEvent.mouseLeave(barWrapper)
    expect(screen.queryByText('100')).not.toBeInTheDocument()
  })

  it('hides tooltip when showTooltip is false', () => {
    const { container } = render(<ChartBar data={mockData} showTooltip={false} />)
    const barWrapper = container.querySelector('.chart-bar__bar-wrapper')
    fireEvent.mouseEnter(barWrapper)
    expect(container.querySelector('.chart-bar__tooltip')).not.toBeInTheDocument()
  })

  // Format value
  it('uses formatValue for tooltip', () => {
    const { container } = render(<ChartBar data={mockData} formatValue={(v) => `$${v}`} />)
    const barWrapper = container.querySelector('.chart-bar__bar-wrapper')
    fireEvent.mouseEnter(barWrapper)
    expect(screen.getByText('$100')).toBeInTheDocument()
  })

  // Labels
  it('hides labels when showLabels is false', () => {
    const { container } = render(<ChartBar data={mockData} showLabels={false} />)
    expect(container.querySelector('.chart-bar__labels')).not.toBeInTheDocument()
  })

  // Custom colors
  it('applies custom bar colors', () => {
    const coloredData = [{ label: 'A', value: 100, color: 'red' }]
    const { container } = render(<ChartBar data={coloredData} />)
    const bar = container.querySelector('.chart-bar__bar')
    // Check inline style attribute directly as toHaveStyle can be strict about color formats
    expect(bar.style.backgroundColor).toBe('red')
  })

  // Height
  it('sets chart height via CSS variable', () => {
    const { container } = render(<ChartBar data={mockData} height={200} />)
    expect(container.querySelector('.chart-bar')).toHaveStyle({ '--chart-height': '200px' })
  })

  it('uses default height of 160px', () => {
    const { container } = render(<ChartBar data={mockData} />)
    expect(container.querySelector('.chart-bar')).toHaveStyle({ '--chart-height': '160px' })
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<ChartBar data={mockData} className="custom-chart" />)
    expect(container.querySelector('.chart-bar')).toHaveClass('custom-chart')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<ChartBar ref={ref} data={mockData} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('chart-bar')
  })

  // Empty data
  it('renders empty chart when no data', () => {
    const { container } = render(<ChartBar data={[]} />)
    expect(container.querySelector('.chart-bar__bar')).not.toBeInTheDocument()
  })

  // Accessibility
  it('sets aria-label on bars', () => {
    const { container } = render(<ChartBar data={mockData} />)
    const bar = container.querySelector('.chart-bar__bar')
    expect(bar).toHaveAttribute('aria-label', 'Mon: 100')
  })

  // Hover state
  it('applies hovered class on hover', () => {
    const { container } = render(<ChartBar data={mockData} />)
    const barWrapper = container.querySelector('.chart-bar__bar-wrapper')
    fireEvent.mouseEnter(barWrapper)
    expect(container.querySelector('.chart-bar__bar--hovered')).toBeInTheDocument()
  })
})
