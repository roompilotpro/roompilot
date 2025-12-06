import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import IconButton from './IconButton'

const TestIcon = () => <svg data-testid="test-icon" />

describe('IconButton', () => {
  it('renders with icon', () => {
    render(
      <IconButton label="Test button">
        <TestIcon />
      </IconButton>
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('has accessible label', () => {
    render(
      <IconButton label="Close modal">
        <TestIcon />
      </IconButton>
    )
    expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument()
  })

  it('applies default variant and size', () => {
    render(
      <IconButton label="Test">
        <TestIcon />
      </IconButton>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('icon-btn', 'icon-btn--ghost', 'icon-btn--md')
  })

  it.each(['primary', 'secondary', 'ghost', 'danger'])('applies %s variant class', (variant) => {
    render(
      <IconButton variant={variant} label="Test">
        <TestIcon />
      </IconButton>
    )
    expect(screen.getByRole('button')).toHaveClass(`icon-btn--${variant}`)
  })

  it.each(['sm', 'md', 'lg'])('applies %s size class', (size) => {
    render(
      <IconButton size={size} label="Test">
        <TestIcon />
      </IconButton>
    )
    expect(screen.getByRole('button')).toHaveClass(`icon-btn--${size}`)
  })

  it('is disabled when disabled prop is true', () => {
    render(
      <IconButton disabled label="Test">
        <TestIcon />
      </IconButton>
    )
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading spinner when loading', () => {
    render(
      <IconButton loading label="Test">
        <TestIcon />
      </IconButton>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('icon-btn--loading')
    expect(button).toBeDisabled()
    expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <IconButton label="Test" onClick={handleClick}>
        <TestIcon />
      </IconButton>
    )

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <IconButton disabled label="Test" onClick={handleClick}>
        <TestIcon />
      </IconButton>
    )

    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('forwards ref to button element', () => {
    const ref = { current: null }
    render(
      <IconButton ref={ref} label="Test">
        <TestIcon />
      </IconButton>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
