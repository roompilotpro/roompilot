import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import './ProgressSteps.css'

/**
 * ProgressSteps - Multi-step progress indicator
 *
 * @param {Array} steps - Array of step objects { label, description? }
 * @param {number} currentStep - Current step index (0-based)
 * @param {string} [orientation='horizontal'] - Layout: 'horizontal' | 'vertical'
 * @param {string} [size='md'] - Circle size: 'sm' | 'md' | 'lg'
 * @param {boolean} [showNumbers=true] - Show step numbers in circles
 * @param {Function} [onStepClick] - Callback when step is clicked (for completed steps)
 * @param {string} [className] - Additional CSS classes
 */
const ProgressSteps = forwardRef(function ProgressSteps(
  {
    steps = [],
    currentStep = 0,
    orientation = 'horizontal',
    size = 'md',
    showNumbers = true,
    onStepClick,
    className,
    ...props
  },
  ref
) {
  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'active'
    return 'pending'
  }

  const handleStepClick = (index) => {
    if (index < currentStep && onStepClick) {
      onStepClick(index)
    }
  }

  const progressPercentage = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0

  return (
    <div
      ref={ref}
      className={classNames(
        'progress-steps',
        `progress-steps--${orientation}`,
        `progress-steps--${size}`,
        className
      )}
      role="navigation"
      aria-label="Progress"
      {...props}
    >
      {/* Progress line (horizontal only) */}
      {orientation === 'horizontal' && (
        <div className="progress-steps__line" aria-hidden="true">
          <div className="progress-steps__line-fill" style={{ width: `${progressPercentage}%` }} />
        </div>
      )}

      {/* Steps */}
      {steps.map((step, index) => {
        const status = getStepStatus(index)
        const isClickable = index < currentStep && onStepClick

        return (
          <div
            key={index}
            className={classNames(
              'progress-steps__step',
              `progress-steps__step--${status}`,
              isClickable && 'progress-steps__step--clickable'
            )}
            onClick={() => handleStepClick(index)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
                e.preventDefault()
                handleStepClick(index)
              }
            }}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            aria-current={status === 'active' ? 'step' : undefined}
          >
            {/* Vertical line (vertical orientation) */}
            {orientation === 'vertical' && index < steps.length - 1 && (
              <div
                className={classNames(
                  'progress-steps__connector',
                  index < currentStep && 'progress-steps__connector--completed'
                )}
                aria-hidden="true"
              />
            )}

            <div className="progress-steps__circle">
              {status === 'completed' ? (
                <span className="progress-steps__check" aria-hidden="true">
                  ✓
                </span>
              ) : showNumbers ? (
                <span>{index + 1}</span>
              ) : null}
            </div>

            <div className="progress-steps__content">
              <span className="progress-steps__label">{step.label}</span>
              {step.description && (
                <span className="progress-steps__description">{step.description}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
})

export default ProgressSteps
