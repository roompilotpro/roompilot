import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OptionCard from './OptionCard'

describe('OptionCard', () => {
  const defaultProps = {
    title: 'Option Title',
    value: 'option1',
  }

  it('renders title', () => {
    render(<OptionCard {...defaultProps} />)
    expect(screen.getByText('Option Title')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<OptionCard {...defaultProps} description="Option description" />)
    expect(screen.getByText('Option description')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<OptionCard {...defaultProps} icon="🏠" />)
    expect(screen.getByText('🏠')).toBeInTheDocument()
  })

  it('does not render icon container when no icon', () => {
    const { container } = render(<OptionCard {...defaultProps} />)
    expect(container.querySelector('.option-card__icon')).not.toBeInTheDocument()
  })

  // Input type
  it('renders as checkbox by default', () => {
    render(<OptionCard {...defaultProps} />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders as radio when type="radio"', () => {
    render(<OptionCard {...defaultProps} type="radio" />)
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  // Selection
  it('applies selected class when selected', () => {
    const { container } = render(<OptionCard {...defaultProps} selected />)
    expect(container.querySelector('.option-card--selected')).toBeInTheDocument()
  })

  it('checkbox is checked when selected', () => {
    render(<OptionCard {...defaultProps} selected />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<OptionCard {...defaultProps} onChange={handleChange} />)

    await user.click(screen.getByText('Option Title'))
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  // Disabled state
  it('applies disabled class when disabled', () => {
    const { container } = render(<OptionCard {...defaultProps} disabled />)
    expect(container.querySelector('.option-card--disabled')).toBeInTheDocument()
  })

  it('input is disabled when disabled prop is true', () => {
    render(<OptionCard {...defaultProps} disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<OptionCard {...defaultProps} onChange={handleChange} disabled />)

    await user.click(screen.getByText('Option Title'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  // Name and value
  it('has correct name attribute', () => {
    render(<OptionCard {...defaultProps} name="myGroup" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'myGroup')
  })

  it('has correct value attribute', () => {
    render(<OptionCard {...defaultProps} />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'option1')
  })

  // Accessibility
  it('input has aria-describedby when description exists', () => {
    render(<OptionCard {...defaultProps} description="Description" />)
    const input = screen.getByRole('checkbox')
    expect(input).toHaveAttribute('aria-describedby')
  })

  it('is focusable via keyboard', async () => {
    const user = userEvent.setup()
    render(<OptionCard {...defaultProps} />)

    await user.tab()
    expect(screen.getByRole('checkbox')).toHaveFocus()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<OptionCard {...defaultProps} className="custom-option" />)
    expect(container.querySelector('.option-card')).toHaveClass('custom-option')
  })

  // Ref forwarding
  it('forwards ref to label element', () => {
    const ref = { current: null }
    render(<OptionCard ref={ref} {...defaultProps} />)
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
  })

  // Indicator type
  it('shows checkbox indicator by default', () => {
    const { container } = render(<OptionCard {...defaultProps} />)
    expect(container.querySelector('.option-card__indicator--checkbox')).toBeInTheDocument()
  })

  it('shows radio indicator when type="radio"', () => {
    const { container } = render(<OptionCard {...defaultProps} type="radio" />)
    expect(container.querySelector('.option-card__indicator--radio')).toBeInTheDocument()
  })
})
