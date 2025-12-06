import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Textarea from './Textarea'

describe('Textarea', () => {
  it('renders basic textarea', () => {
    render(<Textarea placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Textarea label="Description" />)
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(<Textarea label="Description" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('handles value change', async () => {
    const handleChange = vi.fn()
    render(<Textarea onChange={handleChange} />)
    const textarea = screen.getByRole('textbox')
    await userEvent.type(textarea, 'hello')
    expect(handleChange).toHaveBeenCalled()
  })

  it('displays error message', () => {
    render(<Textarea error="This field is required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required')
  })

  it('displays helper text', () => {
    render(<Textarea helperText="Maximum 500 characters" />)
    expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument()
  })

  it('hides helper text when error is shown', () => {
    render(<Textarea helperText="Helper" error="Error" />)
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('applies error styling', () => {
    render(<Textarea error="Error" />)
    expect(screen.getByRole('textbox')).toHaveClass('textarea--error')
  })

  it('sets aria-invalid when error exists', () => {
    render(<Textarea error="Error" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  // Disabled state
  it('disables textarea when disabled prop is true', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('applies disabled styling', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toHaveClass('textarea--disabled')
  })

  // Read-only state
  it('makes textarea read-only', () => {
    render(<Textarea readOnly />)
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
  })

  // Full width
  it('applies full-width class', () => {
    const { container } = render(<Textarea fullWidth />)
    expect(container.querySelector('.textarea-wrapper--full-width')).toBeInTheDocument()
  })

  // Character count
  it('shows character count when enabled', () => {
    render(<Textarea showCharCount />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('shows character count with max length', () => {
    render(<Textarea showCharCount maxLength={100} />)
    expect(screen.getByText('0/100')).toBeInTheDocument()
  })

  it('updates character count on input', async () => {
    render(<Textarea showCharCount />)
    const textarea = screen.getByRole('textbox')
    await userEvent.type(textarea, 'hello')
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  // Max length
  it('applies maxLength attribute', () => {
    render(<Textarea maxLength={500} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '500')
  })

  // Rows
  it('sets minimum rows', () => {
    render(<Textarea minRows={5} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5')
  })

  // Resize variants
  it.each(['vertical', 'horizontal', 'both', 'none'])('applies %s resize class', (resize) => {
    render(<Textarea resize={resize} />)
    expect(screen.getByRole('textbox')).toHaveClass(`textarea--resize-${resize}`)
  })

  it('applies default vertical resize', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toHaveClass('textarea--resize-vertical')
  })

  // Auto resize
  it('applies auto-resize class when enabled', () => {
    render(<Textarea autoResize />)
    expect(screen.getByRole('textbox')).toHaveClass('textarea--auto-resize')
  })

  // Custom ID
  it('uses provided id', () => {
    render(<Textarea id="custom-id" label="Custom" />)
    expect(screen.getByLabelText('Custom')).toHaveAttribute('id', 'custom-id')
  })

  it('generates id when not provided', () => {
    render(<Textarea label="Auto ID" />)
    expect(screen.getByLabelText('Auto ID')).toHaveAttribute('id')
  })

  // Accessibility
  it('links error message via aria-describedby', () => {
    render(<Textarea id="test" error="Error message" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('aria-describedby', 'test-error')
  })

  it('links helper text via aria-describedby', () => {
    render(<Textarea id="test" helperText="Helper text" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('aria-describedby', 'test-helper')
  })

  // Additional className
  it('accepts additional className', () => {
    const { container } = render(<Textarea className="custom-class" />)
    expect(container.querySelector('.textarea-wrapper')).toHaveClass('custom-class')
  })

  // Forwarded ref
  it('forwards ref to textarea element', () => {
    const ref = { current: null }
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  // Default value
  it('supports defaultValue', () => {
    render(<Textarea defaultValue="Initial text" />)
    expect(screen.getByRole('textbox')).toHaveValue('Initial text')
  })

  // Controlled value
  it('supports controlled value', () => {
    render(<Textarea value="Controlled" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('Controlled')
  })

  // Character count with default value
  it('shows correct character count with defaultValue', () => {
    render(<Textarea showCharCount defaultValue="hello" />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
