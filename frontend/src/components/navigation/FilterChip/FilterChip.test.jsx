import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterChip from './FilterChip'

describe('FilterChip', () => {
  // Basic rendering
  it('renders with label', () => {
    render(<FilterChip label="Price" />)
    expect(screen.getByText('Price')).toBeInTheDocument()
  })

  it('renders as a button', () => {
    render(<FilterChip label="Price" />)
    expect(screen.getByRole('button', { name: /price/i })).toBeInTheDocument()
  })

  it('renders with icon', () => {
    render(<FilterChip icon="💰" label="Price" />)
    expect(screen.getByText('💰')).toBeInTheDocument()
  })

  // Active state
  it('applies active class when active', () => {
    const { container } = render(<FilterChip label="Price" active />)
    expect(container.querySelector('.filter-chip--active')).toBeInTheDocument()
  })

  it('does not apply active class by default', () => {
    const { container } = render(<FilterChip label="Price" />)
    expect(container.querySelector('.filter-chip--active')).not.toBeInTheDocument()
  })

  it('sets aria-pressed when active', () => {
    render(<FilterChip label="Price" active />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('sets aria-pressed to false when not active', () => {
    render(<FilterChip label="Price" />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  // Dropdown indicator
  it('shows dropdown arrow when hasDropdown is true', () => {
    render(<FilterChip label="Price" hasDropdown />)
    expect(screen.getByText('▼')).toBeInTheDocument()
  })

  it('hides dropdown arrow by default', () => {
    render(<FilterChip label="Price" />)
    expect(screen.queryByText('▼')).not.toBeInTheDocument()
  })

  it('hides dropdown arrow when active', () => {
    render(<FilterChip label="Price" hasDropdown active />)
    expect(screen.queryByText('▼')).not.toBeInTheDocument()
  })

  // Removable
  it('shows remove button when removable and active', () => {
    render(<FilterChip label="Price" removable active />)
    expect(screen.getByRole('button', { name: /remove price filter/i })).toBeInTheDocument()
  })

  it('does not show remove button when not active', () => {
    render(<FilterChip label="Price" removable />)
    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
  })

  it('does not show remove button when not removable', () => {
    render(<FilterChip label="Price" active />)
    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
  })

  // Disabled state
  it('applies disabled class when disabled', () => {
    const { container } = render(<FilterChip label="Price" disabled />)
    expect(container.querySelector('.filter-chip--disabled')).toBeInTheDocument()
  })

  it('sets disabled attribute when disabled', () => {
    render(<FilterChip label="Price" disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  // Click handlers
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<FilterChip label="Price" onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<FilterChip label="Price" onClick={handleClick} disabled />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('calls onRemove when remove button is clicked', () => {
    const handleRemove = vi.fn()
    render(<FilterChip label="Price" removable active onRemove={handleRemove} />)
    fireEvent.click(screen.getByRole('button', { name: /remove price filter/i }))
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when remove button is clicked', () => {
    const handleClick = vi.fn()
    const handleRemove = vi.fn()
    render(
      <FilterChip label="Price" removable active onClick={handleClick} onRemove={handleRemove} />
    )
    fireEvent.click(screen.getByRole('button', { name: /remove price filter/i }))
    expect(handleRemove).toHaveBeenCalledTimes(1)
    expect(handleClick).not.toHaveBeenCalled()
  })

  // Keyboard navigation
  it('activates on Enter key', () => {
    const handleClick = vi.fn()
    render(<FilterChip label="Price" onClick={handleClick} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('activates on Space key', () => {
    const handleClick = vi.fn()
    render(<FilterChip label="Price" onClick={handleClick} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<FilterChip label="Price" className="custom-chip" />)
    expect(container.querySelector('.filter-chip')).toHaveClass('custom-chip')
  })

  // Ref forwarding
  it('forwards ref to button element', () => {
    const ref = { current: null }
    render(<FilterChip ref={ref} label="Price" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  // Icon accessibility
  it('marks icon as aria-hidden', () => {
    const { container } = render(<FilterChip icon="💰" label="Price" />)
    const icon = container.querySelector('.filter-chip__icon')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  // Additional props
  it('passes additional props to button', () => {
    render(<FilterChip label="Price" data-testid="filter-chip" />)
    expect(screen.getByTestId('filter-chip')).toBeInTheDocument()
  })
})
