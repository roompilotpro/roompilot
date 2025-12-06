import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuickActionCard from './QuickActionCard'

describe('QuickActionCard', () => {
  it('renders icon and label', () => {
    render(<QuickActionCard icon="+" label="Add Room" />)
    expect(screen.getByText('+')).toBeInTheDocument()
    expect(screen.getByText('Add Room')).toBeInTheDocument()
  })

  // Button mode
  it('renders as button when onClick is provided', () => {
    render(<QuickActionCard icon="+" label="Add" onClick={() => {}} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('has correct button type', () => {
    render(<QuickActionCard icon="+" label="Add" onClick={() => {}} />)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('calls onClick when clicked (button mode)', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<QuickActionCard icon="+" label="Add" onClick={handleClick} />)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<QuickActionCard icon="+" label="Add" onClick={handleClick} disabled />)

    // Button is disabled, so we verify the button is disabled rather than clicking
    expect(screen.getByRole('button')).toBeDisabled()
    expect(handleClick).not.toHaveBeenCalled()
  })

  // Link mode
  it('renders as anchor when href is provided', () => {
    render(<QuickActionCard icon="+" label="Add" href="/add" />)
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('has correct href attribute', () => {
    render(<QuickActionCard icon="+" label="Add" href="/add" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/add')
  })

  // Disabled state
  it('applies disabled class when disabled', () => {
    const { container } = render(
      <QuickActionCard icon="+" label="Add" onClick={() => {}} disabled />
    )
    expect(container.querySelector('.quick-action-card--disabled')).toBeInTheDocument()
  })

  it('button is disabled when disabled prop is true', () => {
    render(<QuickActionCard icon="+" label="Add" onClick={() => {}} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies aria-disabled to link when disabled', () => {
    render(<QuickActionCard icon="+" label="Add" href="/add" disabled />)
    expect(screen.getByRole('link')).toHaveAttribute('aria-disabled', 'true')
  })

  // Keyboard navigation
  it('is focusable via keyboard', async () => {
    const user = userEvent.setup()
    render(<QuickActionCard icon="+" label="Add" onClick={() => {}} />)

    await user.tab()
    expect(screen.getByRole('button')).toHaveFocus()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(
      <QuickActionCard icon="+" label="Add" onClick={() => {}} className="custom-class" />
    )
    expect(container.querySelector('.quick-action-card')).toHaveClass('custom-class')
  })

  // Ref forwarding
  it('forwards ref to element', () => {
    const ref = { current: null }
    render(<QuickActionCard ref={ref} icon="+" label="Add" onClick={() => {}} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('forwards ref to anchor element', () => {
    const ref = { current: null }
    render(<QuickActionCard ref={ref} icon="+" label="Add" href="/add" />)
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  // Icon is decorative
  it('hides icon from screen readers', () => {
    const { container } = render(<QuickActionCard icon="+" label="Add" onClick={() => {}} />)
    expect(container.querySelector('.quick-action-card__icon')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
  })
})
