import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import SuccessModal from './SuccessModal'

describe('SuccessModal', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // Basic rendering
  it('renders when isOpen is true', () => {
    render(<SuccessModal isOpen={true} onClose={() => {}} title="Success!" />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Success!')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<SuccessModal isOpen={false} onClose={() => {}} title="Success!" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // Title and description
  it('renders description when provided', () => {
    render(
      <SuccessModal
        isOpen={true}
        onClose={() => {}}
        title="Success!"
        description="Your action was completed successfully."
      />
    )
    expect(screen.getByText('Your action was completed successfully.')).toBeInTheDocument()
  })

  // Animated checkmark icon
  it('renders default animated checkmark', () => {
    render(<SuccessModal isOpen={true} onClose={() => {}} title="Success!" />)
    expect(document.body.querySelector('.success-modal__checkmark')).toBeInTheDocument()
  })

  it('renders custom icon when provided', () => {
    render(
      <SuccessModal
        isOpen={true}
        onClose={() => {}}
        title="Success!"
        icon={<span data-testid="custom-icon">Custom</span>}
      />
    )
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    expect(document.body.querySelector('.success-modal__checkmark')).not.toBeInTheDocument()
  })

  // Action buttons
  it('renders primary action button', () => {
    const handleClick = vi.fn()
    render(
      <SuccessModal
        isOpen={true}
        onClose={() => {}}
        title="Success!"
        primaryAction={{ label: 'Continue', onClick: handleClick }}
      />
    )
    const button = screen.getByRole('button', { name: 'Continue' })
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders secondary action button', () => {
    const handleClick = vi.fn()
    render(
      <SuccessModal
        isOpen={true}
        onClose={() => {}}
        title="Success!"
        secondaryAction={{ label: 'Go Back', onClick: handleClick }}
      />
    )
    const button = screen.getByRole('button', { name: 'Go Back' })
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders both action buttons', () => {
    render(
      <SuccessModal
        isOpen={true}
        onClose={() => {}}
        title="Success!"
        primaryAction={{ label: 'Continue', onClick: () => {} }}
        secondaryAction={{ label: 'Go Back', onClick: () => {} }}
      />
    )
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument()
  })

  it('does not render footer when no actions provided', () => {
    render(<SuccessModal isOpen={true} onClose={() => {}} title="Success!" />)
    expect(document.body.querySelector('.modal__footer')).not.toBeInTheDocument()
  })

  // Auto-close
  it('shows countdown when autoCloseSeconds is set', () => {
    render(<SuccessModal isOpen={true} onClose={() => {}} title="Success!" autoCloseSeconds={5} />)
    expect(screen.getByText('Closing in 5 seconds...')).toBeInTheDocument()
  })

  it('updates countdown every second', () => {
    render(<SuccessModal isOpen={true} onClose={() => {}} title="Success!" autoCloseSeconds={3} />)
    expect(screen.getByText('Closing in 3 seconds...')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('Closing in 2 seconds...')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('Closing in 1 second...')).toBeInTheDocument()
  })

  it('calls onClose when countdown reaches zero', () => {
    const handleClose = vi.fn()
    render(
      <SuccessModal isOpen={true} onClose={handleClose} title="Success!" autoCloseSeconds={2} />
    )

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  // Accessibility
  it('has dialog role', () => {
    render(<SuccessModal isOpen={true} onClose={() => {}} title="Success!" />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal attribute', () => {
    render(<SuccessModal isOpen={true} onClose={() => {}} title="Success!" />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  // Custom className
  it('accepts custom className', () => {
    render(
      <SuccessModal isOpen={true} onClose={() => {}} title="Success!" className="custom-success" />
    )
    expect(document.body.querySelector('.modal')).toHaveClass('custom-success')
  })

  // Ref forwarding
  it('forwards ref to modal container', () => {
    const ref = { current: null }
    render(<SuccessModal ref={ref} isOpen={true} onClose={() => {}} title="Success!" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('modal')
  })

  // Close on escape
  it('calls onClose when Escape is pressed', () => {
    const handleClose = vi.fn()
    render(<SuccessModal isOpen={true} onClose={handleClose} title="Success!" />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  // Icon container exists
  it('renders icon container', () => {
    render(<SuccessModal isOpen={true} onClose={() => {}} title="Success!" />)
    expect(document.body.querySelector('.success-modal__icon')).toBeInTheDocument()
  })
})
