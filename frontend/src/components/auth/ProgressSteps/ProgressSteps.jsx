import { classNames } from '../../../utils/classNames'

/**
 * ProgressSteps component - Multi-step progress indicator
 *
 * @param {Object} props
 * @param {Array} props.steps - Array of step labels
 * @param {number} props.currentStep - Current step (1-indexed)
 * @param {number} [props.totalSteps] - Total number of steps (defaults to steps.length)
 * @param {string} [props.className] - Additional CSS classes
 */
function ProgressSteps({ steps, currentStep, totalSteps, className }) {
  const total = totalSteps || steps.length
  const progress = ((currentStep - 1) / (total - 1)) * 100

  return (
    <div className={classNames('max-w-[800px] mx-auto my-8 px-8 sm:px-4', className)}>
      <div className="flex justify-between relative mb-12">
        <div className="absolute top-5 sm:top-4 left-0 right-0 h-1 bg-cloud z-0">
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {steps.map((label, index) => {
          const stepNum = index + 1
          const isCompleted = stepNum < currentStep
          const isActive = stepNum === currentStep

          return (
            <div key={index} className="relative z-[1] text-center flex-1">
              <div
                className={classNames(
                  'w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-cloud border-4 border-white mx-auto mb-2 flex items-center justify-center font-bold text-slate text-sm sm:text-xs transition-all duration-300',
                  isActive && 'bg-primary text-white',
                  isCompleted && 'bg-accent text-white'
                )}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
              <div
                className={classNames(
                  'text-sm sm:text-xs text-slate font-medium',
                  isActive && 'text-primary font-semibold'
                )}
              >
                {label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressSteps
