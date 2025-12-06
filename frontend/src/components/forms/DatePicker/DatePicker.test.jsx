import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DatePicker from './DatePicker'

describe('DatePicker', () => {
  it('renders with placeholder', () => {
    render(<DatePicker placeholder="Choose date" />)
    expect(screen.getByText('Choose date')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<DatePicker label="Start Date" />)
    expect(screen.getByText('Start Date')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(<DatePicker label="Start Date" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('opens calendar on click', async () => {
    render(<DatePicker />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('displays formatted selected date', () => {
    render(<DatePicker value={new Date(2024, 0, 15)} />)
    expect(screen.getByText('01/15/2024')).toBeInTheDocument()
  })

  it('uses custom date format', () => {
    render(<DatePicker value={new Date(2024, 0, 15)} dateFormat="DD/MM/YYYY" />)
    expect(screen.getByText('15/01/2024')).toBeInTheDocument()
  })

  it('calls onChange when date selected', async () => {
    const handleChange = vi.fn()
    render(<DatePicker onChange={handleChange} />)
    await userEvent.click(screen.getByRole('combobox'))
    // Click on day 15 (should be visible in current month)
    const day15 = screen.getByRole('button', { name: /15/ })
    await userEvent.click(day15)
    expect(handleChange).toHaveBeenCalled()
  })

  it('closes calendar after selection', async () => {
    render(<DatePicker />)
    await userEvent.click(screen.getByRole('combobox'))
    const day15 = screen.getByRole('button', { name: /15/ })
    await userEvent.click(day15)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<DatePicker error="Please select a date" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Please select a date')
  })

  it('displays helper text', () => {
    render(<DatePicker helperText="Select your move-in date" />)
    expect(screen.getByText('Select your move-in date')).toBeInTheDocument()
  })

  it('hides helper text when error is shown', () => {
    render(<DatePicker helperText="Helper" error="Error" />)
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('applies error styling', () => {
    const { container } = render(<DatePicker error="Error" />)
    expect(container.querySelector('.datepicker--error')).toBeInTheDocument()
  })

  // Size tests
  it.each(['sm', 'md', 'lg'])('applies %s size class', (size) => {
    const { container } = render(<DatePicker size={size} />)
    expect(container.querySelector(`.datepicker--${size}`)).toBeInTheDocument()
  })

  // Disabled state
  it('does not open when disabled', async () => {
    render(<DatePicker disabled />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('applies disabled styling', () => {
    const { container } = render(<DatePicker disabled />)
    expect(container.querySelector('.datepicker--disabled')).toBeInTheDocument()
  })

  // Full width
  it('applies full-width class', () => {
    const { container } = render(<DatePicker fullWidth />)
    expect(container.querySelector('.datepicker-wrapper--full-width')).toBeInTheDocument()
  })

  // Navigation
  it('navigates to previous month', async () => {
    render(<DatePicker value={new Date(2024, 5, 15)} />) // June 2024
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByText('June 2024')).toBeInTheDocument()
    await userEvent.click(screen.getByLabelText('Previous month'))
    expect(screen.getByText('May 2024')).toBeInTheDocument()
  })

  it('navigates to next month', async () => {
    render(<DatePicker value={new Date(2024, 5, 15)} />) // June 2024
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByText('June 2024')).toBeInTheDocument()
    await userEvent.click(screen.getByLabelText('Next month'))
    expect(screen.getByText('July 2024')).toBeInTheDocument()
  })

  // Weekday headers
  it('displays weekday headers', async () => {
    render(<DatePicker />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByText('Su')).toBeInTheDocument()
    expect(screen.getByText('Mo')).toBeInTheDocument()
    expect(screen.getByText('Fr')).toBeInTheDocument()
  })

  // Keyboard navigation
  it('opens on Enter key', async () => {
    render(<DatePicker />)
    const picker = screen.getByRole('combobox')
    picker.focus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes on Escape key', async () => {
    render(<DatePicker />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // Accessibility
  it('sets aria-expanded correctly', async () => {
    render(<DatePicker />)
    const picker = screen.getByRole('combobox')
    expect(picker).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(picker)
    expect(picker).toHaveAttribute('aria-expanded', 'true')
  })

  it('sets aria-invalid when error exists', () => {
    render(<DatePicker error="Error" />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  // Additional className
  it('accepts additional className', () => {
    const { container } = render(<DatePicker className="custom-class" />)
    expect(container.querySelector('.datepicker-wrapper')).toHaveClass('custom-class')
  })
})
