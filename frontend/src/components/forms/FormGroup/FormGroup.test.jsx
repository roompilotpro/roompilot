import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FormGroup from './FormGroup'

describe('FormGroup', () => {
  it('renders children', () => {
    render(
      <FormGroup>
        <input type="text" placeholder="Test input" />
      </FormGroup>
    )
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(
      <FormGroup label="Email" htmlFor="email">
        <input type="email" id="email" />
      </FormGroup>
    )
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(
      <FormGroup label="Email" required>
        <input type="email" />
      </FormGroup>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(
      <FormGroup error="This field is required">
        <input type="text" />
      </FormGroup>
    )
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required')
  })

  it('displays helper text', () => {
    render(
      <FormGroup helperText="Enter your email address">
        <input type="email" />
      </FormGroup>
    )
    expect(screen.getByText('Enter your email address')).toBeInTheDocument()
  })

  it('hides helper text when error is shown', () => {
    render(
      <FormGroup helperText="Helper" error="Error">
        <input type="text" />
      </FormGroup>
    )
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('applies error styling', () => {
    const { container } = render(
      <FormGroup error="Error">
        <input type="text" />
      </FormGroup>
    )
    expect(container.querySelector('.form-group--error')).toBeInTheDocument()
  })

  // Full width
  it('applies full-width class', () => {
    const { container } = render(
      <FormGroup fullWidth>
        <input type="text" />
      </FormGroup>
    )
    expect(container.querySelector('.form-group--full-width')).toBeInTheDocument()
  })

  // Disabled state
  it('applies disabled styling', () => {
    const { container } = render(
      <FormGroup disabled>
        <input type="text" />
      </FormGroup>
    )
    expect(container.querySelector('.form-group--disabled')).toBeInTheDocument()
  })

  // Label association
  it('associates label with input via htmlFor', () => {
    render(
      <FormGroup label="Username" htmlFor="username">
        <input type="text" id="username" />
      </FormGroup>
    )
    const label = screen.getByText('Username')
    expect(label).toHaveAttribute('for', 'username')
  })

  // Additional className
  it('accepts additional className', () => {
    const { container } = render(
      <FormGroup className="custom-class">
        <input type="text" />
      </FormGroup>
    )
    expect(container.querySelector('.form-group')).toHaveClass('custom-class')
  })

  // Forwarded ref
  it('forwards ref to container element', () => {
    const ref = { current: null }
    render(
      <FormGroup ref={ref}>
        <input type="text" />
      </FormGroup>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
