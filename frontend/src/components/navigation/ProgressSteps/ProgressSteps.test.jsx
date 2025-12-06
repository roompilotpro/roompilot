import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProgressSteps from './ProgressSteps'

const mockSteps = [
  { label: 'Account' },
  { label: 'Profile' },
  { label: 'Verify' },
  { label: 'Complete' },
]

describe('ProgressSteps', () => {
  // Basic rendering
  it('renders all steps', () => {
    render(<ProgressSteps steps={mockSteps} currentStep={0} />)
    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Verify')).toBeInTheDocument()
    expect(screen.getByText('Complete')).toBeInTheDocument()
  })

  it('renders with navigation role', () => {
    render(<ProgressSteps steps={mockSteps} currentStep={0} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('has aria-label for navigation', () => {
    render(<ProgressSteps steps={mockSteps} currentStep={0} />)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Progress')
  })

  // Step numbers
  it('shows step numbers by default', () => {
    render(<ProgressSteps steps={mockSteps} currentStep={1} />)
    // Step 2 (index 1) should show number 2, steps 3 and 4 should show their numbers
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('hides step numbers when showNumbers is false', () => {
    render(<ProgressSteps steps={mockSteps} currentStep={1} showNumbers={false} />)
    expect(screen.queryByText('1')).not.toBeInTheDocument()
    expect(screen.queryByText('3')).not.toBeInTheDocument()
  })

  // Step statuses
  it('marks current step as active', () => {
    const { container } = render(<ProgressSteps steps={mockSteps} currentStep={1} />)
    const activeStep = container.querySelector('.progress-steps__step--active')
    expect(activeStep).toHaveTextContent('Profile')
  })

  it('marks previous steps as completed', () => {
    const { container } = render(<ProgressSteps steps={mockSteps} currentStep={2} />)
    const completedSteps = container.querySelectorAll('.progress-steps__step--completed')
    expect(completedSteps).toHaveLength(2)
    expect(completedSteps[0]).toHaveTextContent('Account')
    expect(completedSteps[1]).toHaveTextContent('Profile')
  })

  it('marks future steps as pending', () => {
    const { container } = render(<ProgressSteps steps={mockSteps} currentStep={1} />)
    const pendingSteps = container.querySelectorAll('.progress-steps__step--pending')
    expect(pendingSteps).toHaveLength(2)
    expect(pendingSteps[0]).toHaveTextContent('Verify')
    expect(pendingSteps[1]).toHaveTextContent('Complete')
  })

  it('shows checkmark for completed steps', () => {
    render(<ProgressSteps steps={mockSteps} currentStep={2} />)
    const checkmarks = screen.getAllByText('✓')
    expect(checkmarks).toHaveLength(2)
  })

  // Aria current
  it('sets aria-current on active step', () => {
    const { container } = render(<ProgressSteps steps={mockSteps} currentStep={1} />)
    const activeStep = container.querySelector('.progress-steps__step--active')
    expect(activeStep).toHaveAttribute('aria-current', 'step')
  })

  // Step descriptions
  it('renders step descriptions', () => {
    const stepsWithDescriptions = [
      { label: 'Account', description: 'Create your account' },
      { label: 'Profile', description: 'Add your details' },
    ]
    render(<ProgressSteps steps={stepsWithDescriptions} currentStep={0} />)
    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByText('Add your details')).toBeInTheDocument()
  })

  // Orientation
  it('applies horizontal orientation by default', () => {
    const { container } = render(<ProgressSteps steps={mockSteps} currentStep={0} />)
    expect(container.querySelector('.progress-steps--horizontal')).toBeInTheDocument()
  })

  it('applies vertical orientation', () => {
    const { container } = render(
      <ProgressSteps steps={mockSteps} currentStep={0} orientation="vertical" />
    )
    expect(container.querySelector('.progress-steps--vertical')).toBeInTheDocument()
  })

  // Progress line
  it('renders progress line in horizontal orientation', () => {
    const { container } = render(<ProgressSteps steps={mockSteps} currentStep={0} />)
    expect(container.querySelector('.progress-steps__line')).toBeInTheDocument()
  })

  it('sets progress line fill based on current step', () => {
    const { container } = render(<ProgressSteps steps={mockSteps} currentStep={2} />)
    const lineFill = container.querySelector('.progress-steps__line-fill')
    // Step 2 of 4 (index 2 of 3 max) = 2/3 * 100 ≈ 66.67%
    expect(lineFill).toHaveStyle({ width: '66.66666666666666%' })
  })

  it('does not render progress line in vertical orientation', () => {
    const { container } = render(
      <ProgressSteps steps={mockSteps} currentStep={0} orientation="vertical" />
    )
    expect(container.querySelector('.progress-steps__line')).not.toBeInTheDocument()
  })

  // Sizes
  it('applies md size by default', () => {
    const { container } = render(<ProgressSteps steps={mockSteps} currentStep={0} />)
    expect(container.querySelector('.progress-steps--md')).toBeInTheDocument()
  })

  it('applies sm size', () => {
    const { container } = render(<ProgressSteps steps={mockSteps} currentStep={0} size="sm" />)
    expect(container.querySelector('.progress-steps--sm')).toBeInTheDocument()
  })

  it('applies lg size', () => {
    const { container } = render(<ProgressSteps steps={mockSteps} currentStep={0} size="lg" />)
    expect(container.querySelector('.progress-steps--lg')).toBeInTheDocument()
  })

  // Click handler
  it('makes completed steps clickable when onStepClick is provided', () => {
    const { container } = render(
      <ProgressSteps steps={mockSteps} currentStep={2} onStepClick={() => {}} />
    )
    const clickableSteps = container.querySelectorAll('.progress-steps__step--clickable')
    expect(clickableSteps).toHaveLength(2)
  })

  it('calls onStepClick when completed step is clicked', () => {
    const handleStepClick = vi.fn()
    render(<ProgressSteps steps={mockSteps} currentStep={2} onStepClick={handleStepClick} />)
    fireEvent.click(screen.getByText('Account'))
    expect(handleStepClick).toHaveBeenCalledWith(0)
  })

  it('does not call onStepClick when current step is clicked', () => {
    const handleStepClick = vi.fn()
    render(<ProgressSteps steps={mockSteps} currentStep={2} onStepClick={handleStepClick} />)
    fireEvent.click(screen.getByText('Verify'))
    expect(handleStepClick).not.toHaveBeenCalled()
  })

  it('does not call onStepClick when future step is clicked', () => {
    const handleStepClick = vi.fn()
    render(<ProgressSteps steps={mockSteps} currentStep={1} onStepClick={handleStepClick} />)
    fireEvent.click(screen.getByText('Complete'))
    expect(handleStepClick).not.toHaveBeenCalled()
  })

  // Keyboard navigation
  it('activates completed step on Enter key', () => {
    const handleStepClick = vi.fn()
    const { container } = render(
      <ProgressSteps steps={mockSteps} currentStep={2} onStepClick={handleStepClick} />
    )
    const completedStep = container.querySelector('.progress-steps__step--clickable')
    fireEvent.keyDown(completedStep, { key: 'Enter' })
    expect(handleStepClick).toHaveBeenCalledWith(0)
  })

  it('activates completed step on Space key', () => {
    const handleStepClick = vi.fn()
    const { container } = render(
      <ProgressSteps steps={mockSteps} currentStep={2} onStepClick={handleStepClick} />
    )
    const completedStep = container.querySelector('.progress-steps__step--clickable')
    fireEvent.keyDown(completedStep, { key: ' ' })
    expect(handleStepClick).toHaveBeenCalledWith(0)
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(
      <ProgressSteps steps={mockSteps} currentStep={0} className="custom-steps" />
    )
    expect(container.querySelector('.progress-steps')).toHaveClass('custom-steps')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<ProgressSteps ref={ref} steps={mockSteps} currentStep={0} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('progress-steps')
  })

  // Empty steps
  it('renders empty when no steps provided', () => {
    const { container } = render(<ProgressSteps steps={[]} currentStep={0} />)
    expect(container.querySelector('.progress-steps__step')).not.toBeInTheDocument()
  })

  // Edge cases
  it('handles currentStep at first step', () => {
    const { container } = render(<ProgressSteps steps={mockSteps} currentStep={0} />)
    const lineFill = container.querySelector('.progress-steps__line-fill')
    expect(lineFill).toHaveStyle({ width: '0%' })
  })

  it('handles currentStep at last step', () => {
    const { container } = render(<ProgressSteps steps={mockSteps} currentStep={3} />)
    const lineFill = container.querySelector('.progress-steps__line-fill')
    expect(lineFill).toHaveStyle({ width: '100%' })
  })
})
