import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagInput from './TagInput'

describe('TagInput', () => {
  it('renders with placeholder', () => {
    render(<TagInput placeholder="Add tag..." />)
    expect(screen.getByPlaceholderText('Add tag...')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<TagInput label="Tags" />)
    expect(screen.getByText('Tags')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(<TagInput label="Tags" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('displays existing tags', () => {
    render(<TagInput value={['React', 'Vue', 'Angular']} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Vue')).toBeInTheDocument()
    expect(screen.getByText('Angular')).toBeInTheDocument()
  })

  it('adds tag on Enter key', async () => {
    const handleChange = vi.fn()
    render(<TagInput value={[]} onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'NewTag{enter}')
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: ['NewTag'] }),
      })
    )
  })

  it('adds tag on comma key', async () => {
    const handleChange = vi.fn()
    render(<TagInput value={[]} onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'NewTag,')
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: ['NewTag'] }),
      })
    )
  })

  it('removes tag on remove button click', async () => {
    const handleChange = vi.fn()
    render(<TagInput value={['React', 'Vue']} onChange={handleChange} />)
    await userEvent.click(screen.getByLabelText('Remove React'))
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: ['Vue'] }),
      })
    )
  })

  it('removes last tag on Backspace when input is empty', async () => {
    const handleChange = vi.fn()
    render(<TagInput value={['React', 'Vue']} onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    input.focus()
    await userEvent.keyboard('{Backspace}')
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: ['React'] }),
      })
    )
  })

  it('does not add duplicate tags', async () => {
    const handleChange = vi.fn()
    render(<TagInput value={['React']} onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'React{enter}')
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('respects maxTags limit', async () => {
    const handleChange = vi.fn()
    render(<TagInput value={['One', 'Two']} maxTags={2} onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Three{enter}')
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('displays error message', () => {
    render(<TagInput error="At least one tag is required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('At least one tag is required')
  })

  it('displays helper text', () => {
    render(<TagInput helperText="Press Enter to add tags" />)
    expect(screen.getByText('Press Enter to add tags')).toBeInTheDocument()
  })

  it('hides helper text when error is shown', () => {
    render(<TagInput helperText="Helper" error="Error" />)
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('applies error styling', () => {
    const { container } = render(<TagInput error="Error" />)
    expect(container.querySelector('.taginput--error')).toBeInTheDocument()
  })

  // Size tests
  it.each(['sm', 'md'])('applies %s size class', (size) => {
    const { container } = render(<TagInput size={size} />)
    expect(container.querySelector(`.taginput--${size}`)).toBeInTheDocument()
  })

  // Disabled state
  it('disables input when disabled', () => {
    render(<TagInput disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('applies disabled styling', () => {
    const { container } = render(<TagInput disabled />)
    expect(container.querySelector('.taginput--disabled')).toBeInTheDocument()
  })

  it('hides remove buttons when disabled', () => {
    render(<TagInput value={['React']} disabled />)
    expect(screen.queryByLabelText('Remove React')).not.toBeInTheDocument()
  })

  // Full width
  it('applies full-width class', () => {
    const { container } = render(<TagInput fullWidth />)
    expect(container.querySelector('.taginput-wrapper--full-width')).toBeInTheDocument()
  })

  // Suggestions
  it('shows suggestions on focus with input', async () => {
    render(<TagInput suggestions={['React', 'Vue', 'Angular']} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Re')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('filters suggestions based on input', async () => {
    render(<TagInput suggestions={['React', 'Vue', 'Angular']} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Vu')
    expect(screen.queryByText('React')).not.toBeInTheDocument()
    expect(screen.getByText('Vue')).toBeInTheDocument()
  })

  it('adds tag on suggestion click', async () => {
    const handleChange = vi.fn()
    render(<TagInput value={[]} suggestions={['React', 'Vue']} onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Re')
    await userEvent.click(screen.getByText('React'))
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: ['React'] }),
      })
    )
  })

  // Accessibility
  it('sets aria-invalid when error exists', () => {
    render(<TagInput error="Error" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  // Additional className
  it('accepts additional className', () => {
    const { container } = render(<TagInput className="custom-class" />)
    expect(container.querySelector('.taginput-wrapper')).toHaveClass('custom-class')
  })
})
