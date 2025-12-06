import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Rating from './Rating'

describe('Rating', () => {
  it('displays rating value', () => {
    render(<Rating value={4.5} />)
    expect(screen.getByText('4.5')).toBeInTheDocument()
  })

  it('formats value to one decimal place', () => {
    render(<Rating value={4.567} />)
    expect(screen.getByText('4.6')).toBeInTheDocument()
  })

  it('clamps value to max 5', () => {
    render(<Rating value={10} />)
    expect(screen.getByText('5.0')).toBeInTheDocument()
  })

  it('clamps value to min 0', () => {
    render(<Rating value={-1} />)
    expect(screen.getByText('0.0')).toBeInTheDocument()
  })

  it('hides value when showValue is false', () => {
    render(<Rating value={4.5} showValue={false} />)
    expect(screen.queryByText('4.5')).not.toBeInTheDocument()
  })

  it('has accessible label', () => {
    render(<Rating value={4.5} />)
    expect(screen.getByLabelText('Rating: 4.5 out of 5 stars')).toBeInTheDocument()
  })

  it('applies default size class', () => {
    render(<Rating value={4.5} />)
    expect(screen.getByLabelText(/Rating/)).toHaveClass('rating--md')
  })

  it.each(['sm', 'md', 'lg'])('applies %s size class', (size) => {
    render(<Rating value={4.5} size={size} />)
    expect(screen.getByLabelText(/Rating/)).toHaveClass(`rating--${size}`)
  })

  it('accepts additional className', () => {
    render(<Rating value={4.5} className="custom-class" />)
    expect(screen.getByLabelText(/Rating/)).toHaveClass('custom-class')
  })
})
