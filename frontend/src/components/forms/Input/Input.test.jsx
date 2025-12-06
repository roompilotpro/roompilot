import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from './Input'

describe('Input', () => {
  it('renders basic input', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(<Input label="Email" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('handles value change', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'hello')
    expect(handleChange).toHaveBeenCalled()
  })

  it('displays error message', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required')
  })

  it('displays helper text', () => {
    render(<Input label="Email" helperText="We'll never share your email" />)
    expect(screen.getByText("We'll never share your email")).toBeInTheDocument()
  })

  it('hides helper text when error is shown', () => {
    render(<Input helperText="Helper" error="Error" />)
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('applies error styling', () => {
    const { container } = render(<Input error="Error" />)
    expect(container.querySelector('.input-container--error')).toBeInTheDocument()
  })

  it('sets aria-invalid when error exists', () => {
    render(<Input error="Error" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  // Type tests
  it.each(['text', 'email', 'tel', 'number', 'search', 'url'])('renders %s type input', (type) => {
    const { container } = render(<Input type={type} />)
    expect(container.querySelector(`input[type="${type}"]`)).toBeInTheDocument()
  })

  // Size tests
  it.each(['sm', 'md', 'lg'])('applies %s size class', (size) => {
    const { container } = render(<Input size={size} />)
    expect(container.querySelector(`.input-container--${size}`)).toBeInTheDocument()
  })

  it('applies default md size', () => {
    const { container } = render(<Input />)
    expect(container.querySelector('.input-container--md')).toBeInTheDocument()
  })

  // Disabled state
  it('disables input when disabled prop is true', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('applies disabled styling', () => {
    const { container } = render(<Input disabled />)
    expect(container.querySelector('.input-container--disabled')).toBeInTheDocument()
  })

  // Read-only state
  it('makes input read-only', () => {
    render(<Input readOnly />)
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
  })

  // Full width
  it('applies full-width class', () => {
    const { container } = render(<Input fullWidth />)
    expect(container.querySelector('.input-wrapper--full-width')).toBeInTheDocument()
  })

  // Prefix & Suffix
  it('renders prefix', () => {
    render(<Input prefix="$" />)
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('renders suffix', () => {
    render(<Input suffix="USD" />)
    expect(screen.getByText('USD')).toBeInTheDocument()
  })

  it('applies prefix styling', () => {
    const { container } = render(<Input prefix="$" />)
    expect(container.querySelector('.input-container--has-prefix')).toBeInTheDocument()
  })

  it('applies suffix styling', () => {
    const { container } = render(<Input suffix="USD" />)
    expect(container.querySelector('.input-container--has-suffix')).toBeInTheDocument()
  })

  // Password visibility toggle
  it('renders password input with toggle button', () => {
    render(<Input type="password" />)
    expect(screen.getByLabelText('Show password')).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    const { container } = render(<Input type="password" />)
    const input = container.querySelector('input')
    const toggleButton = screen.getByLabelText('Show password')

    expect(input).toHaveAttribute('type', 'password')
    await userEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument()
  })

  // Custom ID
  it('uses provided id', () => {
    render(<Input id="custom-id" label="Custom" />)
    expect(screen.getByLabelText('Custom')).toHaveAttribute('id', 'custom-id')
  })

  it('generates id when not provided', () => {
    render(<Input label="Auto ID" />)
    expect(screen.getByLabelText('Auto ID')).toHaveAttribute('id')
  })

  // Accessibility
  it('links error message via aria-describedby', () => {
    render(<Input id="test" error="Error message" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-describedby', 'test-error')
  })

  it('links helper text via aria-describedby', () => {
    render(<Input id="test" helperText="Helper text" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-describedby', 'test-helper')
  })

  // Additional className
  it('accepts additional className', () => {
    const { container } = render(<Input className="custom-class" />)
    expect(container.querySelector('.input-wrapper')).toHaveClass('custom-class')
  })

  // Forwarded ref
  it('forwards ref to input element', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  // Native props
  it('passes native props to input', () => {
    render(<Input maxLength={10} autoComplete="off" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('maxLength', '10')
    expect(input).toHaveAttribute('autoComplete', 'off')
  })
})
