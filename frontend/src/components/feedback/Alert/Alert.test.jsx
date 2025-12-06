import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Alert from './Alert'

describe('Alert', () => {
  // Basic rendering
  it('renders children content', () => {
    render(<Alert>This is an alert message</Alert>)
    expect(screen.getByText('This is an alert message')).toBeInTheDocument()
  })

  it('renders with alert role', () => {
    render(<Alert>Message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  // Title
  it('renders title when provided', () => {
    render(<Alert title="Alert Title">Message</Alert>)
    expect(screen.getByText('Alert Title')).toBeInTheDocument()
  })

  it('does not render title when not provided', () => {
    const { container } = render(<Alert>Message</Alert>)
    expect(container.querySelector('.alert__title')).not.toBeInTheDocument()
  })

  // Variants
  it('applies info variant by default', () => {
    const { container } = render(<Alert>Message</Alert>)
    expect(container.querySelector('.alert--info')).toBeInTheDocument()
  })

  it('applies success variant', () => {
    const { container } = render(<Alert variant="success">Message</Alert>)
    expect(container.querySelector('.alert--success')).toBeInTheDocument()
  })

  it('applies warning variant', () => {
    const { container } = render(<Alert variant="warning">Message</Alert>)
    expect(container.querySelector('.alert--warning')).toBeInTheDocument()
  })

  it('applies error variant', () => {
    const { container } = render(<Alert variant="error">Message</Alert>)
    expect(container.querySelector('.alert--error')).toBeInTheDocument()
  })

  // Icons
  it('renders default icon based on variant', () => {
    const { container } = render(<Alert variant="info">Message</Alert>)
    const icon = container.querySelector('.alert__icon')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveTextContent('ℹ️')
  })

  it('renders custom icon when provided', () => {
    render(<Alert icon="🔔">Message</Alert>)
    expect(screen.getByText('🔔')).toBeInTheDocument()
  })

  it('hides icon when icon is null', () => {
    const { container } = render(<Alert icon={null}>Message</Alert>)
    expect(container.querySelector('.alert__icon')).not.toBeInTheDocument()
  })

  it('hides icon when icon is empty string', () => {
    const { container } = render(<Alert icon="">Message</Alert>)
    expect(container.querySelector('.alert__icon')).not.toBeInTheDocument()
  })

  it('marks icon as aria-hidden', () => {
    const { container } = render(<Alert>Message</Alert>)
    const icon = container.querySelector('.alert__icon')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  // Dismissible
  it('does not show dismiss button by default', () => {
    render(<Alert>Message</Alert>)
    expect(screen.queryByRole('button', { name: 'Dismiss alert' })).not.toBeInTheDocument()
  })

  it('shows dismiss button when dismissible', () => {
    render(<Alert dismissible>Message</Alert>)
    expect(screen.getByRole('button', { name: 'Dismiss alert' })).toBeInTheDocument()
  })

  it('hides alert when dismiss button is clicked', () => {
    render(<Alert dismissible>Message</Alert>)
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss alert' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', () => {
    const handleDismiss = vi.fn()
    render(
      <Alert dismissible onDismiss={handleDismiss}>
        Message
      </Alert>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss alert' }))
    expect(handleDismiss).toHaveBeenCalledTimes(1)
  })

  // Action
  it('renders action when provided', () => {
    render(<Alert action={<button>Learn more</button>}>Message</Alert>)
    expect(screen.getByRole('button', { name: 'Learn more' })).toBeInTheDocument()
  })

  it('does not render action section when not provided', () => {
    const { container } = render(<Alert>Message</Alert>)
    expect(container.querySelector('.alert__action')).not.toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<Alert className="custom-alert">Message</Alert>)
    expect(container.querySelector('.alert')).toHaveClass('custom-alert')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<Alert ref={ref}>Message</Alert>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('alert')
  })

  // Complex content
  it('renders complex content in message', () => {
    render(
      <Alert>
        <p>First paragraph</p>
        <p>Second paragraph</p>
      </Alert>
    )
    expect(screen.getByText('First paragraph')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph')).toBeInTheDocument()
  })

  // Additional props
  it('passes additional props to container', () => {
    render(<Alert data-testid="my-alert">Message</Alert>)
    expect(screen.getByTestId('my-alert')).toBeInTheDocument()
  })
})
