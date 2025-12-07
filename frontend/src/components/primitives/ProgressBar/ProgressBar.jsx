import { classNames } from '../../../utils/classNames'

// Track height by size
const trackHeightStyles = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
}

// Label size by size
const labelSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

// Fill color by variant
const fillColorStyles = {
  primary: 'bg-primary',
  success: 'bg-accent',
  warning: 'bg-warm',
  danger: 'bg-coral',
}

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
      className={classNames('flex items-center gap-2 w-full', className)}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${percentage}% complete`}
      {...props}
    >
      <div
        className={classNames(
          'flex-1 bg-cloud rounded-full overflow-hidden',
          trackHeightStyles[size]
        )}
      >
        <div
          className={classNames(
            'h-full rounded-full transition-all duration-250 ease-out',
            fillColorStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span
          className={classNames(
            'font-medium text-text-secondary min-w-[3em] text-right',
            labelSizeStyles[size]
          )}
        >
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}

export default ProgressBar
