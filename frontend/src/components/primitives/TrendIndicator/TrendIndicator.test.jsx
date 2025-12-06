import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TrendIndicator from './TrendIndicator'

describe('TrendIndicator', () => {
  it('displays positive trend for positive value', () => {
    render(<TrendIndicator value={5.2} />)
    const indicator = screen.getByLabelText(/Up 5.2%/)
    expect(indicator).toHaveClass('trend--positive')
    expect(screen.getByText('5.2%')).toBeInTheDocument()
  })

  it('displays negative trend for negative value', () => {
    render(<TrendIndicator value={-3.5} />)
    const indicator = screen.getByLabelText(/Down 3.5%/)
    expect(indicator).toHaveClass('trend--negative')
    expect(screen.getByText('3.5%')).toBeInTheDocument()
  })

  it('displays neutral trend for zero value', () => {
    render(<TrendIndicator value={0} />)
    const indicator = screen.getByLabelText(/No change 0.0%/)
    expect(indicator).toHaveClass('trend--neutral')
  })

  it('shows absolute value for negative numbers', () => {
    render(<TrendIndicator value={-8.7} />)
    expect(screen.getByText('8.7%')).toBeInTheDocument()
  })

  it('allows trend override', () => {
    render(<TrendIndicator value={5} trend="negative" />)
    expect(screen.getByLabelText(/Down/)).toHaveClass('trend--negative')
  })

  it('applies default size class', () => {
    render(<TrendIndicator value={5} />)
    expect(screen.getByLabelText(/Up/)).toHaveClass('trend--md')
  })

  it.each(['sm', 'md'])('applies %s size class', (size) => {
    render(<TrendIndicator value={5} size={size} />)
    expect(screen.getByLabelText(/Up/)).toHaveClass(`trend--${size}`)
  })

  it('accepts additional className', () => {
    render(<TrendIndicator value={5} className="custom-class" />)
    expect(screen.getByLabelText(/Up/)).toHaveClass('custom-class')
  })

  it('shows arrow for positive trend', () => {
    const { container } = render(<TrendIndicator value={5} />)
    expect(container.querySelector('.trend__arrow')).toBeInTheDocument()
  })

  it('shows arrow for negative trend', () => {
    const { container } = render(<TrendIndicator value={-5} />)
    expect(container.querySelector('.trend__arrow')).toBeInTheDocument()
  })

  it('hides arrow for neutral trend', () => {
    const { container } = render(<TrendIndicator value={0} />)
    expect(container.querySelector('.trend__arrow')).not.toBeInTheDocument()
  })
})
