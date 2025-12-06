import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmationModal from './ConfirmationModal'

describe('ConfirmationModal', () => {
  // Basic rendering
  it('renders when isOpen is true', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Confirm Action"
        onConfirm={() => {}}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Confirm Action')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <ConfirmationModal
        isOpen={false}
        onClose={() => {}}
        title="Confirm Action"
        onConfirm={() => {}}
      />
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // Title and description
  it('renders description when provided', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Confirm Action"
        description="Are you sure you want to proceed?"
        onConfirm={() => {}}
      />
    )
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument()
  })

  // Button labels
  it('renders default button labels', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Confirm Action"
        onConfirm={() => {}}
      />
    )
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('renders custom button labels', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Delete Item"
        confirmLabel="Delete"
        cancelLabel="Keep"
        onConfirm={() => {}}
      />
    )
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument()
  })

  // Callbacks
  it('calls onConfirm when confirm button clicked', () => {
    const handleConfirm = vi.fn()
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Confirm Action"
        onConfirm={handleConfirm}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(handleConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when cancel button clicked', () => {
    const handleCancel = vi.fn()
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Confirm Action"
        onConfirm={() => {}}
        onCancel={handleCancel}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when cancel button clicked and no onCancel provided', () => {
    const handleClose = vi.fn()
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={handleClose}
        title="Confirm Action"
        onConfirm={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  // Variants
  it('applies danger variant icon styling', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Delete Item"
        variant="danger"
        onConfirm={() => {}}
      />
    )
    expect(document.body.querySelector('.confirmation-modal__icon--danger')).toBeInTheDocument()
  })

  it('applies warning variant icon styling', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Warning"
        variant="warning"
        onConfirm={() => {}}
      />
    )
    expect(document.body.querySelector('.confirmation-modal__icon--warning')).toBeInTheDocument()
  })

  it('applies info variant icon styling', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Information"
        variant="info"
        onConfirm={() => {}}
      />
    )
    expect(document.body.querySelector('.confirmation-modal__icon--info')).toBeInTheDocument()
  })

  // Loading state
  it('shows loading state on confirm button', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Confirm Action"
        onConfirm={() => {}}
        loading={true}
      />
    )
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toHaveClass('btn--loading')
  })

  it('disables cancel button when loading', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Confirm Action"
        onConfirm={() => {}}
        loading={true}
      />
    )
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })

  // Custom icon
  it('renders custom icon when provided', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Confirm Action"
        icon={<span data-testid="custom-icon">Custom</span>}
        onConfirm={() => {}}
      />
    )
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  // Accessibility
  it('has dialog role', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Confirm Action"
        onConfirm={() => {}}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal attribute', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Confirm Action"
        onConfirm={() => {}}
      />
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  // Custom className
  it('accepts custom className', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        title="Confirm Action"
        onConfirm={() => {}}
        className="custom-confirmation"
      />
    )
    expect(document.body.querySelector('.modal')).toHaveClass('custom-confirmation')
  })

  // Ref forwarding
  it('forwards ref to modal container', () => {
    const ref = { current: null }
    render(
      <ConfirmationModal
        ref={ref}
        isOpen={true}
        onClose={() => {}}
        title="Confirm Action"
        onConfirm={() => {}}
      />
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('modal')
  })

  // Close on escape
  it('calls onClose when Escape is pressed', () => {
    const handleClose = vi.fn()
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={handleClose}
        title="Confirm Action"
        onConfirm={() => {}}
      />
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
