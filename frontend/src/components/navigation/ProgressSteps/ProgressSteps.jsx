import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'

// Size configurations
const sizeConfig = {
  sm: {
    circle: 'w-7 h-7 text-xs border-[3px]',
    lineTop: 'top-3.5',
    lineH: 'h-[3px]',
    label: 'text-xs',
  },
  md: { circle: 'w-10 h-10 text-sm', lineTop: 'top-5', lineH: 'h-1', label: 'text-sm' },
  lg: { circle: 'w-12 h-12 text-base', lineTop: 'top-6', lineH: 'h-[5px]', label: 'text-base' },
}

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
  const sizes = sizeConfig[size]

  return (
    <div
      ref={ref}
      className={classNames(
        'relative',
        orientation === 'horizontal' ? 'flex justify-between' : 'flex flex-col gap-6',
        className
      )}
      role="navigation"
      aria-label="Progress"
      {...props}
    >
      {/* Progress line (horizontal only) */}
      {orientation === 'horizontal' && (
        <div
          className={classNames('absolute left-0 right-0 bg-cloud z-0', sizes.lineTop, sizes.lineH)}
          aria-hidden="true"
        >
          <div
            className={classNames('h-full bg-accent transition-[width] duration-200')}
            style={{ width: `${progressPercentage}%` }}
          />
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
              orientation === 'horizontal'
                ? 'relative z-[1] text-center flex-1'
                : 'relative flex items-start gap-4',
              isClickable &&
                'cursor-pointer [&:hover_.step-circle]:scale-105 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 focus-visible:rounded-md'
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
                  'absolute top-10 left-[19px] w-0.5 h-[calc(100%+24px-40px)]',
                  index < currentStep ? 'bg-accent' : 'bg-cloud'
                )}
                aria-hidden="true"
              />
            )}

            <div
              className={classNames(
                'step-circle flex items-center justify-center rounded-full border-4 border-white font-bold transition-all duration-150 shrink-0',
                sizes.circle,
                orientation === 'horizontal' && 'mx-auto mb-2',
                status === 'pending' && 'bg-cloud text-slate',
                status === 'active' &&
                  'bg-primary text-white shadow-[0_0_0_4px_rgba(37,99,235,0.2)]',
                status === 'completed' && 'bg-accent text-white'
              )}
            >
              {status === 'completed' ? (
                <span className="text-[0.8em] leading-none" aria-hidden="true">
                  ✓
                </span>
              ) : showNumbers ? (
                <span>{index + 1}</span>
              ) : null}
            </div>

            <div
              className={classNames(
                'flex flex-col gap-1',
                orientation === 'vertical' && 'text-left'
              )}
            >
              <span
                className={classNames(
                  'font-medium transition-colors duration-150',
                  sizes.label,
                  'sm:text-xs',
                  status === 'pending' && 'text-slate',
                  status === 'active' && 'text-primary font-semibold',
                  status === 'completed' && 'text-charcoal/80'
                )}
              >
                {step.label}
              </span>
              {step.description && (
                <span
                  className={classNames('text-xs text-slate sm:hidden', size === 'lg' && 'text-sm')}
                >
                  {step.description}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
})

export default ProgressSteps
