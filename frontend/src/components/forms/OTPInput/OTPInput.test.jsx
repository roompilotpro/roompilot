import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OTPInput from './OTPInput'

describe('OTPInput', () => {
  it('renders 6 inputs by default', () => {
    render(<OTPInput />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(6)
  })

  it('renders custom number of inputs', () => {
    render(<OTPInput length={4} />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(4)
  })

  it('renders with label', () => {
    render(<OTPInput label="Enter verification code" />)
    expect(screen.getByText('Enter verification code')).toBeInTheDocument()
  })

  it('displays initial value', () => {
    render(<OTPInput value="123456" />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveValue('1')
    expect(inputs[1]).toHaveValue('2')
    expect(inputs[2]).toHaveValue('3')
    expect(inputs[3]).toHaveValue('4')
    expect(inputs[4]).toHaveValue('5')
    expect(inputs[5]).toHaveValue('6')
  })

  it('moves focus to next input on digit entry', async () => {
    render(<OTPInput />)
    const inputs = screen.getAllByRole('textbox')
    await userEvent.click(inputs[0])
    await userEvent.type(inputs[0], '1')
    expect(inputs[1]).toHaveFocus()
  })

  it('calls onChange with complete OTP string', async () => {
    const handleChange = vi.fn()
    render(<OTPInput onChange={handleChange} />)
    const inputs = screen.getAllByRole('textbox')
    await userEvent.click(inputs[0])
    await userEvent.type(inputs[0], '1')
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: '1' }),
      })
    )
  })

  it('calls onComplete when all digits entered', async () => {
    const handleComplete = vi.fn()
    render(<OTPInput length={4} onComplete={handleComplete} />)
    const inputs = screen.getAllByRole('textbox')
    await userEvent.click(inputs[0])
    await userEvent.type(inputs[0], '1')
    await userEvent.type(inputs[1], '2')
    await userEvent.type(inputs[2], '3')
    await userEvent.type(inputs[3], '4')
    expect(handleComplete).toHaveBeenCalledWith('1234')
  })

  it('handles backspace navigation', async () => {
    render(<OTPInput value="12" />)
    const inputs = screen.getAllByRole('textbox')
    await userEvent.click(inputs[2])
    await userEvent.keyboard('{Backspace}')
    expect(inputs[1]).toHaveFocus()
  })

  it('handles arrow key navigation', async () => {
    render(<OTPInput />)
    const inputs = screen.getAllByRole('textbox')
    await userEvent.click(inputs[2])
    await userEvent.keyboard('{ArrowLeft}')
    expect(inputs[1]).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    expect(inputs[2]).toHaveFocus()
  })

  it('handles paste event', async () => {
    const handleChange = vi.fn()
    render(<OTPInput length={4} onChange={handleChange} />)
    const inputs = screen.getAllByRole('textbox')
    await userEvent.click(inputs[0])
    // Simulate paste
    const pasteEvent = new Event('paste', { bubbles: true })
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: { getData: () => '1234' },
    })
    inputs[0].dispatchEvent(pasteEvent)
    expect(handleChange).toHaveBeenCalled()
  })

  it('only accepts digits', async () => {
    const handleChange = vi.fn()
    render(<OTPInput onChange={handleChange} />)
    const inputs = screen.getAllByRole('textbox')
    await userEvent.click(inputs[0])
    await userEvent.type(inputs[0], 'a')
    // Should not call onChange with non-digit
    const calls = handleChange.mock.calls
    if (calls.length > 0) {
      expect(calls[calls.length - 1][0].target.value).not.toContain('a')
    }
  })

  it('displays error message', () => {
    render(<OTPInput error="Invalid code" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid code')
  })

  it('displays helper text', () => {
    render(<OTPInput helperText="Enter the code sent to your phone" />)
    expect(screen.getByText('Enter the code sent to your phone')).toBeInTheDocument()
  })

  it('hides helper text when error is shown', () => {
    render(<OTPInput helperText="Helper" error="Error" />)
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('applies error styling', () => {
    const { container } = render(<OTPInput error="Error" />)
    expect(container.querySelector('.otp--error')).toBeInTheDocument()
  })

  // Size tests
  it.each(['sm', 'md', 'lg'])('applies %s size class', (size) => {
    const { container } = render(<OTPInput size={size} />)
    expect(container.querySelector(`.otp--${size}`)).toBeInTheDocument()
  })

  // Disabled state
  it('disables all inputs when disabled', () => {
    render(<OTPInput disabled />)
    const inputs = screen.getAllByRole('textbox')
    inputs.forEach((input) => expect(input).toBeDisabled())
  })

  it('applies disabled styling', () => {
    const { container } = render(<OTPInput disabled />)
    expect(container.querySelector('.otp--disabled')).toBeInTheDocument()
  })

  // Auto focus
  it('auto focuses first input when autoFocus is true', () => {
    render(<OTPInput autoFocus />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveFocus()
  })

  // Accessibility
  it('has aria-label on each input', () => {
    render(<OTPInput length={4} />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveAttribute('aria-label', 'Digit 1 of 4')
    expect(inputs[3]).toHaveAttribute('aria-label', 'Digit 4 of 4')
  })

  it('sets aria-invalid when error exists', () => {
    render(<OTPInput error="Error" />)
    const inputs = screen.getAllByRole('textbox')
    inputs.forEach((input) => expect(input).toHaveAttribute('aria-invalid', 'true'))
  })

  // Additional className
  it('accepts additional className', () => {
    const { container } = render(<OTPInput className="custom-class" />)
    expect(container.querySelector('.otp-wrapper')).toHaveClass('custom-class')
  })
})
