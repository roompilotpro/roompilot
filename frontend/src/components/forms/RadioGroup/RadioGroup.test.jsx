import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RadioGroup, { Radio } from './RadioGroup'

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

describe('RadioGroup', () => {
  it('renders with options', () => {
    render(<RadioGroup name="test" options={options} />)
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<RadioGroup name="test" options={options} label="Choose one" />)
    expect(screen.getByText('Choose one')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(<RadioGroup name="test" options={options} label="Choose" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('calls onChange when option selected', async () => {
    const handleChange = vi.fn()
    render(<RadioGroup name="test" options={options} onChange={handleChange} />)
    await userEvent.click(screen.getByText('Option 2'))
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'option2' }),
      })
    )
  })

  it('shows selected option as checked', () => {
    render(<RadioGroup name="test" options={options} value="option2" />)
    const radio = screen.getByRole('radio', { name: 'Option 2' })
    expect(radio).toBeChecked()
  })

  it('displays error message', () => {
    render(<RadioGroup name="test" options={options} error="Please select an option" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Please select an option')
  })

  // Orientation tests
  it('applies vertical orientation by default', () => {
    const { container } = render(<RadioGroup name="test" options={options} />)
    expect(container.querySelector('.radio-group--vertical')).toBeInTheDocument()
  })

  it('applies horizontal orientation', () => {
    const { container } = render(
      <RadioGroup name="test" options={options} orientation="horizontal" />
    )
    expect(container.querySelector('.radio-group--horizontal')).toBeInTheDocument()
  })

  // Variant tests
  it('applies standard variant by default', () => {
    const { container } = render(<RadioGroup name="test" options={options} />)
    expect(container.querySelector('.radio-group--standard')).toBeInTheDocument()
  })

  it('applies card variant', () => {
    const { container } = render(<RadioGroup name="test" options={options} variant="card" />)
    expect(container.querySelector('.radio-group--card')).toBeInTheDocument()
    expect(container.querySelector('.radio--card')).toBeInTheDocument()
  })

  // Size tests
  it.each(['sm', 'md'])('applies %s size class to radios', (size) => {
    const { container } = render(<RadioGroup name="test" options={options} size={size} />)
    expect(container.querySelector(`.radio--${size}`)).toBeInTheDocument()
  })

  // Disabled state
  it('disables all radios when disabled prop is true', () => {
    render(<RadioGroup name="test" options={options} disabled />)
    const radios = screen.getAllByRole('radio')
    radios.forEach((radio) => expect(radio).toBeDisabled())
  })

  it('disables individual option', () => {
    const optionsWithDisabled = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2', disabled: true },
    ]
    render(<RadioGroup name="test" options={optionsWithDisabled} />)
    expect(screen.getByRole('radio', { name: 'Option 1' })).not.toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Option 2' })).toBeDisabled()
  })

  // Description
  it('renders option with description', () => {
    const optionsWithDesc = [
      { value: 'opt1', label: 'Option 1', description: 'Description for option 1' },
    ]
    render(<RadioGroup name="test" options={optionsWithDesc} />)
    expect(screen.getByText('Description for option 1')).toBeInTheDocument()
  })

  // Custom children
  it('renders custom Radio children', () => {
    render(
      <RadioGroup name="test" value="a">
        <Radio value="a" label="Custom A" />
        <Radio value="b" label="Custom B" />
      </RadioGroup>
    )
    expect(screen.getByText('Custom A')).toBeInTheDocument()
    expect(screen.getByText('Custom B')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Custom A' })).toBeChecked()
  })

  // Accessibility
  it('has radiogroup role', () => {
    render(<RadioGroup name="test" options={options} />)
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
  })

  it('sets aria-invalid when error exists', () => {
    render(<RadioGroup name="test" options={options} error="Error" />)
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true')
  })

  it('links label with aria-labelledby', () => {
    render(<RadioGroup name="test" options={options} label="Group label" />)
    const label = screen.getByText('Group label')
    const group = screen.getByRole('radiogroup')
    expect(group).toHaveAttribute('aria-labelledby', label.id)
  })

  // Additional className
  it('accepts additional className', () => {
    const { container } = render(
      <RadioGroup name="test" options={options} className="custom-class" />
    )
    expect(container.querySelector('.radio-group')).toHaveClass('custom-class')
  })
})

describe('Radio', () => {
  it('renders standalone radio', () => {
    render(<Radio value="test" label="Standalone" />)
    expect(screen.getByText('Standalone')).toBeInTheDocument()
  })

  it('shows dot when checked', () => {
    const { container } = render(
      <RadioGroup name="test" value="opt1">
        <Radio value="opt1" label="Option 1" />
      </RadioGroup>
    )
    expect(container.querySelector('.radio__dot')).toBeInTheDocument()
  })

  it('applies checked class', () => {
    const { container } = render(
      <RadioGroup name="test" value="opt1">
        <Radio value="opt1" label="Option 1" />
      </RadioGroup>
    )
    expect(container.querySelector('.radio--checked')).toBeInTheDocument()
  })

  it('accepts additional className', () => {
    const { container } = render(
      <RadioGroup name="test">
        <Radio value="opt1" label="Option 1" className="custom-radio" />
      </RadioGroup>
    )
    expect(container.querySelector('.custom-radio')).toBeInTheDocument()
  })
})
