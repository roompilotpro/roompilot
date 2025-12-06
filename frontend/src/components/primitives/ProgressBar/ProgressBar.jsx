import { classNames } from '../../../utils/classNames'
import './ProgressBar.css'

/**
 * ProgressBar component for displaying progress
 *
 * @param {Object} props
 * @param {number} props.value - Progress value (0-100)
 * @param {'primary'|'success'|'warning'|'danger'} [props.variant='primary'] - Color variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size variant
 * @param {boolean} [props.showLabel=false] - Whether to show percentage label
 * @param {string} [props.className] - Additional CSS classes
 */
function ProgressBar({
  value,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className,
  ...props
}) {
  const percentage = Math.min(100, Math.max(0, value))

  return (
    <div
      className={classNames(
        'progress-bar',
        `progress-bar--${variant}`,
        `progress-bar--${size}`,
        className
      )}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${percentage}% complete`}
      {...props}
    >
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && <span className="progress-bar__label">{Math.round(percentage)}%</span>}
    </div>
  )
}

export default ProgressBar
