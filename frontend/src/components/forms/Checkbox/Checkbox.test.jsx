import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Checkbox from './Checkbox'

describe('Checkbox', () => {
  it('renders basic checkbox', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getByText('Accept terms')).toBeInTheDocument()
  })

  it('renders without label', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(<Checkbox label="Newsletter" description="Get weekly updates" />)
    expect(screen.getByText('Newsletter')).toBeInTheDocument()
    expect(screen.getByText('Get weekly updates')).toBeInTheDocument()
  })

  it('handles change event', async () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Test" onChange={handleChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalled()
  })

  it('can be checked', () => {
    render(<Checkbox label="Test" checked onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('shows check icon when checked', () => {
    const { container } = render(<Checkbox label="Test" checked onChange={() => {}} />)
    expect(container.querySelector('.checkbox__box--checked')).toBeInTheDocument()
    expect(container.querySelector('.checkbox__box svg')).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<Checkbox label="Test" error="You must accept the terms" />)
    expect(screen.getByRole('alert')).toHaveTextContent('You must accept the terms')
  })

  it('applies error styling to checkbox box', () => {
    const { container } = render(<Checkbox label="Test" error="Error" />)
    expect(container.querySelector('.checkbox__box--error')).toBeInTheDocument()
  })

  it('sets aria-invalid when error exists', () => {
    render(<Checkbox label="Test" error="Error" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })

  // Size tests
  it.each(['sm', 'md'])('applies %s size class', (size) => {
    const { container } = render(<Checkbox label="Test" size={size} />)
    expect(container.querySelector(`.checkbox--${size}`)).toBeInTheDocument()
  })

  it('applies default md size', () => {
    const { container } = render(<Checkbox label="Test" />)
    expect(container.querySelector('.checkbox--md')).toBeInTheDocument()
  })

  // Disabled state
  it('disables checkbox when disabled prop is true', () => {
    render(<Checkbox label="Test" disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('applies disabled styling', () => {
    const { container } = render(<Checkbox label="Test" disabled />)
    expect(container.querySelector('.checkbox--disabled')).toBeInTheDocument()
  })

  // Indeterminate state
  it('sets indeterminate state', () => {
    render(<Checkbox label="Test" indeterminate />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox.indeterminate).toBe(true)
  })

  it('shows indeterminate icon', () => {
    const { container } = render(<Checkbox label="Test" indeterminate />)
    expect(container.querySelector('.checkbox__box--indeterminate')).toBeInTheDocument()
  })

  // Card variant
  it('applies card styling when card prop is true', () => {
    const { container } = render(<Checkbox label="Test" card />)
    expect(container.querySelector('.checkbox-wrapper--card')).toBeInTheDocument()
  })

  it('applies card-checked styling when checked', () => {
    const { container } = render(<Checkbox label="Test" card checked onChange={() => {}} />)
    expect(container.querySelector('.checkbox-wrapper--card-checked')).toBeInTheDocument()
  })

  it('applies card-disabled styling when disabled', () => {
    const { container } = render(<Checkbox label="Test" card disabled />)
    expect(container.querySelector('.checkbox-wrapper--card-disabled')).toBeInTheDocument()
  })

  // Custom ID
  it('uses provided id', () => {
    render(<Checkbox id="custom-id" label="Test" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'custom-id')
  })

  it('generates id when not provided', () => {
    render(<Checkbox label="Test" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('id')
  })

  // Accessibility
  it('associates label with checkbox', () => {
    render(<Checkbox label="Accept" />)
    const checkbox = screen.getByRole('checkbox')
    const label = screen.getByText('Accept')
    expect(label.closest('label')).toHaveAttribute('for', checkbox.id)
  })

  it('links error message via aria-describedby', () => {
    render(<Checkbox id="test" label="Test" error="Error message" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-describedby', 'test-error')
  })

  // Additional className
  it('accepts additional className', () => {
    const { container } = render(<Checkbox label="Test" className="custom-class" />)
    expect(container.querySelector('.checkbox-wrapper')).toHaveClass('custom-class')
  })

  // Forwarded ref
  it('forwards ref to input element', () => {
    const ref = { current: null }
    render(<Checkbox ref={ref} label="Test" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  // Native props
  it('passes native props to input', () => {
    render(<Checkbox label="Test" name="terms" value="accepted" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('name', 'terms')
    expect(checkbox).toHaveAttribute('value', 'accepted')
  })
})
