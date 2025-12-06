import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LoadingModal from './LoadingModal'

describe('LoadingModal', () => {
  // Basic rendering
  it('renders when isOpen is true', () => {
    render(<LoadingModal isOpen={true} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<LoadingModal isOpen={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // Default title
  it('renders default title', () => {
    render(<LoadingModal isOpen={true} />)
    expect(document.body.querySelector('.loading-modal__title')).toHaveTextContent('Loading...')
  })

  // Custom title
  it('renders custom title', () => {
    render(<LoadingModal isOpen={true} title="Processing..." />)
    expect(document.body.querySelector('.loading-modal__title')).toHaveTextContent('Processing...')
  })

  // Description
  it('renders description when provided', () => {
    render(<LoadingModal isOpen={true} description="Please wait while we process your request." />)
    expect(screen.getByText('Please wait while we process your request.')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    render(<LoadingModal isOpen={true} title="Loading..." />)
    expect(document.body.querySelector('.loading-modal__description')).not.toBeInTheDocument()
  })

  // Spinner
  it('renders loading spinner', () => {
    render(<LoadingModal isOpen={true} />)
    expect(document.body.querySelector('.spinner')).toBeInTheDocument()
  })

  // Progress bar
  it('renders progress bar when progress provided', () => {
    render(<LoadingModal isOpen={true} progress={50} />)
    expect(document.body.querySelector('.loading-modal__progress')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('does not render progress bar when progress not provided', () => {
    render(<LoadingModal isOpen={true} />)
    expect(document.body.querySelector('.loading-modal__progress')).not.toBeInTheDocument()
  })

  it('clamps progress between 0 and 100', () => {
    const { rerender } = render(<LoadingModal isOpen={true} progress={150} />)
    const progressFill = document.body.querySelector('.loading-modal__progress-fill')
    expect(progressFill).toHaveStyle('width: 100%')

    rerender(<LoadingModal isOpen={true} progress={-10} />)
    expect(progressFill).toHaveStyle('width: 0%')
  })

  // Cancel button
  it('shows cancel button when showCancel is true and onCancel provided', () => {
    const handleCancel = vi.fn()
    render(<LoadingModal isOpen={true} showCancel={true} onCancel={handleCancel} />)
    const button = screen.getByRole('button', { name: 'Cancel' })
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  it('does not show cancel button when showCancel is false', () => {
    render(<LoadingModal isOpen={true} onCancel={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
  })

  it('does not show cancel button when onCancel not provided', () => {
    render(<LoadingModal isOpen={true} showCancel={true} />)
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
  })

  // No close button
  it('does not show close button', () => {
    render(<LoadingModal isOpen={true} />)
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument()
  })

  // Overlay click disabled
  it('does not close on overlay click', () => {
    const handleCancel = vi.fn()
    render(<LoadingModal isOpen={true} onCancel={handleCancel} />)
    const overlay = document.body.querySelector('.modal-overlay')
    fireEvent.click(overlay)
    expect(handleCancel).not.toHaveBeenCalled()
  })

  // Escape key with showCancel
  it('closes on Escape when showCancel is true', () => {
    const handleCancel = vi.fn()
    render(<LoadingModal isOpen={true} showCancel={true} onCancel={handleCancel} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  // Accessibility
  it('has dialog role', () => {
    render(<LoadingModal isOpen={true} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal attribute', () => {
    render(<LoadingModal isOpen={true} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  // Custom className
  it('accepts custom className', () => {
    render(<LoadingModal isOpen={true} className="custom-loading" />)
    expect(document.body.querySelector('.modal')).toHaveClass('custom-loading')
  })

  // Ref forwarding
  it('forwards ref to modal container', () => {
    const ref = { current: null }
    render(<LoadingModal ref={ref} isOpen={true} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('modal')
  })
})
