import { classNames } from '../../../utils/classNames'
import './ProgressSteps.css'

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
    <div className={classNames('progress-steps', className)}>
      <div className="progress-steps__container">
        <div className="progress-steps__line">
          <div className="progress-steps__line-fill" style={{ width: `${progress}%` }} />
        </div>
        {steps.map((label, index) => {
          const stepNum = index + 1
          const isCompleted = stepNum < currentStep
          const isActive = stepNum === currentStep

          return (
            <div
              key={index}
              className={classNames(
                'progress-steps__step',
                isActive && 'progress-steps__step--active',
                isCompleted && 'progress-steps__step--completed'
              )}
            >
              <div className="progress-steps__circle">{isCompleted ? '✓' : stepNum}</div>
              <div className="progress-steps__label">{label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressSteps
