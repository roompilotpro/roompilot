import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ErrorModal from './ErrorModal'

describe('ErrorModal', () => {
  // Basic rendering
  it('renders when isOpen is true', () => {
    render(<ErrorModal isOpen={true} onClose={() => {}} title="Error Occurred" />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Error Occurred')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<ErrorModal isOpen={false} onClose={() => {}} title="Error Occurred" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // Title and description
  it('renders description when provided', () => {
    render(
      <ErrorModal
        isOpen={true}
        onClose={() => {}}
        title="Error"
        description="Something went wrong. Please try again."
      />
    )
    expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
  })

  // Error code
  it('renders error code when provided', () => {
    render(<ErrorModal isOpen={true} onClose={() => {}} title="Error" errorCode="ERR_500" />)
    expect(screen.getByText(/Error code: ERR_500/)).toBeInTheDocument()
  })

  it('does not render error code when not provided', () => {
    render(<ErrorModal isOpen={true} onClose={() => {}} title="Error" />)
    expect(screen.queryByText(/Error code:/)).not.toBeInTheDocument()
  })

  // Default icon
  it('renders default error icon', () => {
    render(<ErrorModal isOpen={true} onClose={() => {}} title="Error" />)
    expect(document.body.querySelector('.error-modal__icon svg')).toBeInTheDocument()
  })

  // Custom icon
  it('renders custom icon when provided', () => {
    render(
      <ErrorModal
        isOpen={true}
        onClose={() => {}}
        title="Error"
        icon={<span data-testid="custom-icon">X</span>}
      />
    )
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  // Retry button
  it('renders retry button when onRetry provided', () => {
    const handleRetry = vi.fn()
    render(<ErrorModal isOpen={true} onClose={() => {}} title="Error" onRetry={handleRetry} />)
    const button = screen.getByRole('button', { name: 'Try Again' })
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  // Support link
  it('renders support link when provided', () => {
    render(
      <ErrorModal
        isOpen={true}
        onClose={() => {}}
        title="Error"
        supportLink="https://support.example.com"
      />
    )
    const link = screen.getByRole('link', { name: 'Get Support' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://support.example.com')
    expect(link).toHaveAttribute('target', '_blank')
  })

  // Close button fallback
  it('renders close button when no retry or support link', () => {
    const handleClose = vi.fn()
    render(<ErrorModal isOpen={true} onClose={handleClose} title="Error" />)
    const button = screen.getByRole('button', { name: 'Close' })
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  // Shake animation class
  it('applies shake class when modal opens', async () => {
    render(<ErrorModal isOpen={true} onClose={() => {}} title="Error" />)
    await waitFor(() => {
      expect(document.body.querySelector('.error-modal--shake')).toBeInTheDocument()
    })
  })

  // Accessibility
  it('has dialog role', () => {
    render(<ErrorModal isOpen={true} onClose={() => {}} title="Error" />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal attribute', () => {
    render(<ErrorModal isOpen={true} onClose={() => {}} title="Error" />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  // Custom className
  it('accepts custom className', () => {
    render(<ErrorModal isOpen={true} onClose={() => {}} title="Error" className="custom-error" />)
    expect(document.body.querySelector('.modal')).toHaveClass('custom-error')
  })

  // Ref forwarding
  it('forwards ref to modal container', () => {
    const ref = { current: null }
    render(<ErrorModal ref={ref} isOpen={true} onClose={() => {}} title="Error" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('modal')
  })

  // Close on escape
  it('calls onClose when Escape is pressed', () => {
    const handleClose = vi.fn()
    render(<ErrorModal isOpen={true} onClose={handleClose} title="Error" />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
