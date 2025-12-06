import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toggle from './Toggle'

describe('Toggle', () => {
  it('renders basic toggle', () => {
    render(<Toggle label="Enable notifications" />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
    expect(screen.getByText('Enable notifications')).toBeInTheDocument()
  })

  it('renders without label', () => {
    render(<Toggle />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(<Toggle label="Notifications" description="Get email alerts" />)
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('Get email alerts')).toBeInTheDocument()
  })

  it('handles change event', async () => {
    const handleChange = vi.fn()
    render(<Toggle label="Test" onChange={handleChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(handleChange).toHaveBeenCalled()
  })

  it('can be checked', () => {
    render(<Toggle label="Test" checked onChange={() => {}} />)
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('applies checked styling', () => {
    const { container } = render(<Toggle label="Test" checked onChange={() => {}} />)
    expect(container.querySelector('.toggle--checked')).toBeInTheDocument()
  })

  it('sets aria-checked correctly', () => {
    const { rerender } = render(<Toggle label="Test" checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    rerender(<Toggle label="Test" checked={true} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  // Size tests
  it.each(['sm', 'md'])('applies %s size class', (size) => {
    const { container } = render(<Toggle label="Test" size={size} />)
    expect(container.querySelector(`.toggle--${size}`)).toBeInTheDocument()
  })

  it('applies default md size', () => {
    const { container } = render(<Toggle label="Test" />)
    expect(container.querySelector('.toggle--md')).toBeInTheDocument()
  })

  // Disabled state
  it('disables toggle when disabled prop is true', () => {
    render(<Toggle label="Test" disabled />)
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('applies disabled styling', () => {
    const { container } = render(<Toggle label="Test" disabled />)
    expect(container.querySelector('.toggle--disabled')).toBeInTheDocument()
  })

  it('applies disabled wrapper styling', () => {
    const { container } = render(<Toggle label="Test" disabled />)
    expect(container.querySelector('.toggle-wrapper--disabled')).toBeInTheDocument()
  })

  // Label position
  it('positions label on right by default', () => {
    const { container } = render(<Toggle label="Test" />)
    expect(container.querySelector('.toggle-wrapper--label-right')).toBeInTheDocument()
  })

  it('positions label on left', () => {
    const { container } = render(<Toggle label="Test" labelPosition="left" />)
    expect(container.querySelector('.toggle-wrapper--label-left')).toBeInTheDocument()
  })

  // Custom ID
  it('uses provided id', () => {
    render(<Toggle id="custom-id" label="Test" />)
    expect(screen.getByRole('switch')).toHaveAttribute('id', 'custom-id')
  })

  it('generates id when not provided', () => {
    render(<Toggle label="Test" />)
    expect(screen.getByRole('switch')).toHaveAttribute('id')
  })

  // Accessibility
  it('has switch role', () => {
    render(<Toggle label="Test" />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('associates label with toggle', () => {
    render(<Toggle label="Test Label" />)
    const toggle = screen.getByRole('switch')
    expect(screen.getByText('Test Label').closest('label')).toHaveAttribute('for', toggle.id)
  })

  // Additional className
  it('accepts additional className', () => {
    const { container } = render(<Toggle label="Test" className="custom-class" />)
    expect(container.querySelector('.toggle-wrapper')).toHaveClass('custom-class')
  })

  // Forwarded ref
  it('forwards ref to input element', () => {
    const ref = { current: null }
    render(<Toggle ref={ref} label="Test" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  // Native props
  it('passes native props to input', () => {
    render(<Toggle label="Test" name="notifications" />)
    expect(screen.getByRole('switch')).toHaveAttribute('name', 'notifications')
  })
})
