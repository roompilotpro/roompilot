import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from './StatusBadge'

describe('StatusBadge', () => {
  it('renders children', () => {
    render(<StatusBadge>Active</StatusBadge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies default status class', () => {
    render(<StatusBadge>Test</StatusBadge>)
    expect(screen.getByText('Test').closest('.status-badge')).toHaveClass('status-badge--active')
  })

  it.each(['active', 'inactive', 'pending', 'success', 'warning', 'error'])(
    'applies %s status class',
    (status) => {
      render(<StatusBadge status={status}>Test</StatusBadge>)
      expect(screen.getByText('Test').closest('.status-badge')).toHaveClass(
        `status-badge--${status}`
      )
    }
  )

  it('shows dot indicator', () => {
    render(<StatusBadge>Active</StatusBadge>)
    const badge = screen.getByText('Active').closest('.status-badge')
    expect(badge.querySelector('.status-badge__dot')).toBeInTheDocument()
  })

  it('accepts additional className', () => {
    render(<StatusBadge className="custom-class">Test</StatusBadge>)
    expect(screen.getByText('Test').closest('.status-badge')).toHaveClass('custom-class')
  })
})
