import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FormModal from './FormModal'

describe('FormModal', () => {
  // Basic rendering
  it('renders when isOpen is true', () => {
    render(
      <FormModal isOpen={true} onClose={() => {}} title="Form" onSubmit={() => {}}>
        <input type="text" />
      </FormModal>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Form')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <FormModal isOpen={false} onClose={() => {}} title="Form" onSubmit={() => {}}>
        <input type="text" />
      </FormModal>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // Title and subtitle
  it('renders title and subtitle', () => {
    render(
      <FormModal
        isOpen={true}
        onClose={() => {}}
        title="Edit Profile"
        subtitle="Update your information"
        onSubmit={() => {}}
      >
        <input type="text" />
      </FormModal>
    )
    expect(screen.getByText('Edit Profile')).toBeInTheDocument()
    expect(screen.getByText('Update your information')).toBeInTheDocument()
  })

  // Form content
  it('renders children as form content', () => {
    render(
      <FormModal isOpen={true} onClose={() => {}} title="Form" onSubmit={() => {}}>
        <input data-testid="test-input" type="text" />
      </FormModal>
    )
    expect(screen.getByTestId('test-input')).toBeInTheDocument()
  })

  // Button labels
  it('renders default button labels', () => {
    render(
      <FormModal isOpen={true} onClose={() => {}} title="Form" onSubmit={() => {}}>
        <input type="text" />
      </FormModal>
    )
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('renders custom button labels', () => {
    render(
      <FormModal
        isOpen={true}
        onClose={() => {}}
        title="Form"
        submitLabel="Save Changes"
        cancelLabel="Discard"
        onSubmit={() => {}}
      >
        <input type="text" />
      </FormModal>
    )
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument()
  })

  // Submit callback
  it('calls onSubmit when submit button clicked', () => {
    const handleSubmit = vi.fn()
    render(
      <FormModal isOpen={true} onClose={() => {}} title="Form" onSubmit={handleSubmit}>
        <input type="text" />
      </FormModal>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('does not call onSubmit when form is invalid', () => {
    const handleSubmit = vi.fn()
    render(
      <FormModal
        isOpen={true}
        onClose={() => {}}
        title="Form"
        onSubmit={handleSubmit}
        isValid={false}
      >
        <input type="text" />
      </FormModal>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  // Cancel button
  it('calls onClose when cancel button clicked on first step', () => {
    const handleClose = vi.fn()
    render(
      <FormModal isOpen={true} onClose={handleClose} title="Form" onSubmit={() => {}}>
        <input type="text" />
      </FormModal>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  // Multi-step forms
  it('renders step indicators when steps provided', () => {
    render(
      <FormModal
        isOpen={true}
        onClose={() => {}}
        title="Form"
        steps={[
          { id: 'step1', label: 'Step 1' },
          { id: 'step2', label: 'Step 2' },
          { id: 'step3', label: 'Step 3' },
        ]}
        currentStep={0}
        onSubmit={() => {}}
      >
        <input type="text" />
      </FormModal>
    )
    expect(document.body.querySelector('.form-modal__steps')).toBeInTheDocument()
    expect(document.body.querySelectorAll('.form-modal__step')).toHaveLength(3)
  })

  it('marks current step as active', () => {
    render(
      <FormModal
        isOpen={true}
        onClose={() => {}}
        title="Form"
        steps={[
          { id: 'step1', label: 'Step 1' },
          { id: 'step2', label: 'Step 2' },
        ]}
        currentStep={1}
        onSubmit={() => {}}
      >
        <input type="text" />
      </FormModal>
    )
    const steps = document.body.querySelectorAll('.form-modal__step')
    expect(steps[0]).toHaveClass('form-modal__step--completed')
    expect(steps[1]).toHaveClass('form-modal__step--active')
  })

  it('shows Next button when not on last step', () => {
    render(
      <FormModal
        isOpen={true}
        onClose={() => {}}
        title="Form"
        steps={[
          { id: 'step1', label: 'Step 1' },
          { id: 'step2', label: 'Step 2' },
        ]}
        currentStep={0}
        onSubmit={() => {}}
      >
        <input type="text" />
      </FormModal>
    )
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
  })

  it('shows Submit button on last step', () => {
    render(
      <FormModal
        isOpen={true}
        onClose={() => {}}
        title="Form"
        steps={[
          { id: 'step1', label: 'Step 1' },
          { id: 'step2', label: 'Step 2' },
        ]}
        currentStep={1}
        onSubmit={() => {}}
      >
        <input type="text" />
      </FormModal>
    )
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('shows Back button when not on first step', () => {
    const handleBack = vi.fn()
    render(
      <FormModal
        isOpen={true}
        onClose={() => {}}
        title="Form"
        steps={[
          { id: 'step1', label: 'Step 1' },
          { id: 'step2', label: 'Step 2' },
        ]}
        currentStep={1}
        onBack={handleBack}
        onSubmit={() => {}}
      >
        <input type="text" />
      </FormModal>
    )
    const backButton = screen.getByRole('button', { name: 'Back' })
    expect(backButton).toBeInTheDocument()
    fireEvent.click(backButton)
    expect(handleBack).toHaveBeenCalledTimes(1)
  })

  // Loading state
  it('shows loading state on submit button', () => {
    render(
      <FormModal isOpen={true} onClose={() => {}} title="Form" onSubmit={() => {}} loading={true}>
        <input type="text" />
      </FormModal>
    )
    const submitButton = screen.getByRole('button', { name: /submit/i })
    expect(submitButton).toHaveClass('btn--loading')
  })

  it('disables buttons when loading', () => {
    render(
      <FormModal isOpen={true} onClose={() => {}} title="Form" onSubmit={() => {}} loading={true}>
        <input type="text" />
      </FormModal>
    )
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })

  // Validation state
  it('disables submit button when isValid is false', () => {
    render(
      <FormModal isOpen={true} onClose={() => {}} title="Form" onSubmit={() => {}} isValid={false}>
        <input type="text" />
      </FormModal>
    )
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
  })

  // Accessibility
  it('has dialog role', () => {
    render(
      <FormModal isOpen={true} onClose={() => {}} title="Form" onSubmit={() => {}}>
        <input type="text" />
      </FormModal>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal attribute', () => {
    render(
      <FormModal isOpen={true} onClose={() => {}} title="Form" onSubmit={() => {}}>
        <input type="text" />
      </FormModal>
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('has progressbar role on steps container', () => {
    render(
      <FormModal
        isOpen={true}
        onClose={() => {}}
        title="Form"
        steps={[
          { id: 'step1', label: 'Step 1' },
          { id: 'step2', label: 'Step 2' },
        ]}
        currentStep={0}
        onSubmit={() => {}}
      >
        <input type="text" />
      </FormModal>
    )
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    render(
      <FormModal
        isOpen={true}
        onClose={() => {}}
        title="Form"
        onSubmit={() => {}}
        className="custom-form"
      >
        <input type="text" />
      </FormModal>
    )
    expect(document.body.querySelector('.modal')).toHaveClass('custom-form')
  })

  // Ref forwarding
  it('forwards ref to modal container', () => {
    const ref = { current: null }
    render(
      <FormModal ref={ref} isOpen={true} onClose={() => {}} title="Form" onSubmit={() => {}}>
        <input type="text" />
      </FormModal>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('modal')
  })

  // Form submission on Enter
  it('submits form on Enter key in form', () => {
    const handleSubmit = vi.fn()
    render(
      <FormModal isOpen={true} onClose={() => {}} title="Form" onSubmit={handleSubmit}>
        <input data-testid="input" type="text" />
      </FormModal>
    )
    const form = document.body.querySelector('.form-modal__content')
    fireEvent.submit(form)
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})
