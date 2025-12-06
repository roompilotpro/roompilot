import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ModalBase from './ModalBase'

describe('ModalBase', () => {
  // Basic rendering
  it('renders when isOpen is true', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}}>
        <p>Modal content</p>
      </ModalBase>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <ModalBase isOpen={false} onClose={() => {}}>
        <p>Modal content</p>
      </ModalBase>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // Title and subtitle
  it('renders title when provided', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}} title="Test Title">
        <p>Content</p>
      </ModalBase>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}} title="Title" subtitle="Subtitle text">
        <p>Content</p>
      </ModalBase>
    )
    expect(screen.getByText('Subtitle text')).toBeInTheDocument()
  })

  // Close button
  it('renders close button by default', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}} title="Title">
        <p>Content</p>
      </ModalBase>
    )
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument()
  })

  it('hides close button when showCloseButton is false', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}} title="Title" showCloseButton={false}>
        <p>Content</p>
      </ModalBase>
    )
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    const handleClose = vi.fn()
    render(
      <ModalBase isOpen={true} onClose={handleClose} title="Title">
        <p>Content</p>
      </ModalBase>
    )
    fireEvent.click(screen.getByLabelText('Close modal'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  // Overlay click
  it('calls onClose when overlay clicked', () => {
    const handleClose = vi.fn()
    render(
      <ModalBase isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </ModalBase>
    )
    const overlay = document.body.querySelector('.modal-overlay')
    fireEvent.click(overlay)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when closeOnOverlay is false', () => {
    const handleClose = vi.fn()
    render(
      <ModalBase isOpen={true} onClose={handleClose} closeOnOverlay={false}>
        <p>Content</p>
      </ModalBase>
    )
    const overlay = document.body.querySelector('.modal-overlay')
    fireEvent.click(overlay)
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('does not call onClose when clicking modal content', () => {
    const handleClose = vi.fn()
    render(
      <ModalBase isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </ModalBase>
    )
    fireEvent.click(screen.getByText('Content'))
    expect(handleClose).not.toHaveBeenCalled()
  })

  // Escape key
  it('calls onClose when Escape is pressed', () => {
    const handleClose = vi.fn()
    render(
      <ModalBase isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </ModalBase>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose on Escape when closeOnEscape is false', () => {
    const handleClose = vi.fn()
    render(
      <ModalBase isOpen={true} onClose={handleClose} closeOnEscape={false}>
        <p>Content</p>
      </ModalBase>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).not.toHaveBeenCalled()
  })

  // Size variants
  it('applies sm size class', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}} size="sm">
        <p>Content</p>
      </ModalBase>
    )
    expect(document.body.querySelector('.modal--sm')).toBeInTheDocument()
  })

  it('applies md size class by default', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </ModalBase>
    )
    expect(document.body.querySelector('.modal--md')).toBeInTheDocument()
  })

  it('applies lg size class', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}} size="lg">
        <p>Content</p>
      </ModalBase>
    )
    expect(document.body.querySelector('.modal--lg')).toBeInTheDocument()
  })

  it('applies full size class', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}} size="full">
        <p>Content</p>
      </ModalBase>
    )
    expect(document.body.querySelector('.modal--full')).toBeInTheDocument()
  })

  // Footer
  it('renders footer when provided', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}} footer={<button>Submit</button>}>
        <p>Content</p>
      </ModalBase>
    )
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('does not render footer section when footer not provided', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </ModalBase>
    )
    expect(document.body.querySelector('.modal__footer')).not.toBeInTheDocument()
  })

  // Header visibility
  it('hides header when showHeader is false', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}} showHeader={false} title="Title">
        <p>Content</p>
      </ModalBase>
    )
    expect(document.body.querySelector('.modal__header')).not.toBeInTheDocument()
  })

  // Accessibility
  it('has dialog role', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </ModalBase>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal attribute', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </ModalBase>
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('has aria-labelledby when title provided', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}} title="Modal Title">
        <p>Content</p>
      </ModalBase>
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-title')
  })

  // Custom className
  it('accepts custom className', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}} className="custom-modal">
        <p>Content</p>
      </ModalBase>
    )
    expect(document.body.querySelector('.modal')).toHaveClass('custom-modal')
  })

  // Body scroll lock
  it('locks body scroll when open', () => {
    render(
      <ModalBase isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </ModalBase>
    )
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll when closed', () => {
    const { rerender } = render(
      <ModalBase isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </ModalBase>
    )
    rerender(
      <ModalBase isOpen={false} onClose={() => {}}>
        <p>Content</p>
      </ModalBase>
    )
    expect(document.body.style.overflow).toBe('')
  })

  // Ref forwarding
  it('forwards ref to modal container', () => {
    const ref = { current: null }
    render(
      <ModalBase ref={ref} isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </ModalBase>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('modal')
  })
})
