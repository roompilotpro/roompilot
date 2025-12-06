import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Select from './Select'

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

describe('Select', () => {
  it('renders with placeholder', () => {
    render(<Select options={options} placeholder="Choose option" />)
    expect(screen.getByText('Choose option')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Select options={options} label="Country" />)
    expect(screen.getByText('Country')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(<Select options={options} label="Country" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('opens dropdown on click', async () => {
    render(<Select options={options} />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('displays selected value', () => {
    render(<Select options={options} value="option2" />)
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('calls onChange when option selected', async () => {
    const handleChange = vi.fn()
    render(<Select options={options} onChange={handleChange} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByText('Option 2'))
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'option2' }),
      })
    )
  })

  it('closes dropdown after selection', async () => {
    render(<Select options={options} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByText('Option 2'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<Select options={options} error="Please select an option" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Please select an option')
  })

  it('displays helper text', () => {
    render(<Select options={options} helperText="Choose your country" />)
    expect(screen.getByText('Choose your country')).toBeInTheDocument()
  })

  it('hides helper text when error is shown', () => {
    render(<Select options={options} helperText="Helper" error="Error" />)
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('applies error styling', () => {
    const { container } = render(<Select options={options} error="Error" />)
    expect(container.querySelector('.select--error')).toBeInTheDocument()
  })

  // Size tests
  it.each(['sm', 'md', 'lg'])('applies %s size class', (size) => {
    const { container } = render(<Select options={options} size={size} />)
    expect(container.querySelector(`.select--${size}`)).toBeInTheDocument()
  })

  // Disabled state
  it('does not open when disabled', async () => {
    render(<Select options={options} disabled />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('applies disabled styling', () => {
    const { container } = render(<Select options={options} disabled />)
    expect(container.querySelector('.select--disabled')).toBeInTheDocument()
  })

  // Searchable
  it('shows search input when searchable', async () => {
    render(<Select options={options} searchable />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('filters options based on search', async () => {
    render(<Select options={options} searchable />)
    await userEvent.click(screen.getByRole('combobox'))
    // Use text without space to avoid space key triggering toggle
    await userEvent.type(screen.getByPlaceholderText('Search...'), '1')
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Option 3')).not.toBeInTheDocument()
  })

  it('shows "No options found" when search has no results', async () => {
    render(<Select options={options} searchable />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.type(screen.getByPlaceholderText('Search...'), 'xyz')
    expect(screen.getByText('No options found')).toBeInTheDocument()
  })

  // Keyboard navigation
  it('opens on Enter key', async () => {
    render(<Select options={options} />)
    const select = screen.getByRole('combobox')
    select.focus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('closes on Escape key', async () => {
    render(<Select options={options} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('navigates options with arrow keys', async () => {
    render(<Select options={options} />)
    const select = screen.getByRole('combobox')
    select.focus()
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    // Check first option is highlighted
    const firstOption = screen.getAllByRole('option')[0]
    expect(firstOption).toHaveClass('select__option--highlighted')
  })

  // Full width
  it('applies full-width class', () => {
    const { container } = render(<Select options={options} fullWidth />)
    expect(container.querySelector('.select-wrapper--full-width')).toBeInTheDocument()
  })

  // Disabled options
  it('does not select disabled option', async () => {
    const disabledOptions = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2', disabled: true },
    ]
    const handleChange = vi.fn()
    render(<Select options={disabledOptions} onChange={handleChange} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByText('Option 2'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  // Accessibility
  it('sets aria-expanded correctly', async () => {
    render(<Select options={options} />)
    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(select)
    expect(select).toHaveAttribute('aria-expanded', 'true')
  })

  it('sets aria-invalid when error exists', () => {
    render(<Select options={options} error="Error" />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('marks selected option with aria-selected', async () => {
    render(<Select options={options} value="option2" />)
    await userEvent.click(screen.getByRole('combobox'))
    const selectedOption = screen.getByRole('option', { name: 'Option 2' })
    expect(selectedOption).toHaveAttribute('aria-selected', 'true')
  })

  // Additional className
  it('accepts additional className', () => {
    const { container } = render(<Select options={options} className="custom-class" />)
    expect(container.querySelector('.select-wrapper')).toHaveClass('custom-class')
  })
})
