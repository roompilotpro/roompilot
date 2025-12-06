import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with role="status"', () => {
    render(<LoadingSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has accessible label', () => {
    render(<LoadingSpinner />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('has screen reader text', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('applies default size and color', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('spinner--md', 'spinner--primary')
  })

  it.each(['sm', 'md', 'lg'])('applies %s size class', (size) => {
    render(<LoadingSpinner size={size} />)
    expect(screen.getByRole('status')).toHaveClass(`spinner--${size}`)
  })

  it.each(['primary', 'white', 'current'])('applies %s color class', (color) => {
    render(<LoadingSpinner color={color} />)
    expect(screen.getByRole('status')).toHaveClass(`spinner--${color}`)
  })

  it('accepts additional className', () => {
    render(<LoadingSpinner className="custom-class" />)
    expect(screen.getByRole('status')).toHaveClass('custom-class')
  })
})
