import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressBar from './ProgressBar'

describe('ProgressBar', () => {
  it('renders with correct role', () => {
    render(<ProgressBar value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria attributes correctly', () => {
    render(<ProgressBar value={75} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '75')
    expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '100')
  })

  it('clamps value to max 100', () => {
    render(<ProgressBar value={150} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('clamps value to min 0', () => {
    render(<ProgressBar value={-10} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('hides label by default', () => {
    render(<ProgressBar value={50} />)
    expect(screen.queryByText('50%')).not.toBeInTheDocument()
  })

  it('shows label when showLabel is true', () => {
    render(<ProgressBar value={50} showLabel />)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('rounds label to whole number', () => {
    render(<ProgressBar value={33.7} showLabel />)
    expect(screen.getByText('34%')).toBeInTheDocument()
  })

  it('applies default variant and size', () => {
    render(<ProgressBar value={50} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveClass('progress-bar--primary', 'progress-bar--md')
  })

  it.each(['primary', 'success', 'warning', 'danger'])('applies %s variant', (variant) => {
    render(<ProgressBar value={50} variant={variant} />)
    expect(screen.getByRole('progressbar')).toHaveClass(`progress-bar--${variant}`)
  })

  it.each(['sm', 'md', 'lg'])('applies %s size', (size) => {
    render(<ProgressBar value={50} size={size} />)
    expect(screen.getByRole('progressbar')).toHaveClass(`progress-bar--${size}`)
  })

  it('accepts additional className', () => {
    render(<ProgressBar value={50} className="custom-class" />)
    expect(screen.getByRole('progressbar')).toHaveClass('custom-class')
  })

  it('sets fill width based on value', () => {
    const { container } = render(<ProgressBar value={75} />)
    const fill = container.querySelector('.progress-bar__fill')
    expect(fill).toHaveStyle({ width: '75%' })
  })
})
