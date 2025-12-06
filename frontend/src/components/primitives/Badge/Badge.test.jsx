import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies default variant and size', () => {
    render(<Badge>Test</Badge>)
    const badge = screen.getByText('Test')
    expect(badge).toHaveClass('badge', 'badge--default', 'badge--md')
  })

  it.each(['default', 'primary', 'success', 'warning', 'danger', 'info'])(
    'applies %s variant class',
    (variant) => {
      render(<Badge variant={variant}>Test</Badge>)
      expect(screen.getByText('Test')).toHaveClass(`badge--${variant}`)
    }
  )

  it.each(['sm', 'md'])('applies %s size class', (size) => {
    render(<Badge size={size}>Test</Badge>)
    expect(screen.getByText('Test')).toHaveClass(`badge--${size}`)
  })

  it('shows dot when dot prop is true', () => {
    render(<Badge dot>Active</Badge>)
    const badge = screen.getByText('Active').closest('.badge')
    expect(badge).toHaveClass('badge--with-dot')
    expect(badge.querySelector('.badge__dot')).toBeInTheDocument()
  })

  it('does not show dot by default', () => {
    render(<Badge>Active</Badge>)
    const badge = screen.getByText('Active').closest('.badge')
    expect(badge.querySelector('.badge__dot')).not.toBeInTheDocument()
  })

  it('accepts additional className', () => {
    render(<Badge className="custom-class">Test</Badge>)
    expect(screen.getByText('Test')).toHaveClass('custom-class')
  })
})
