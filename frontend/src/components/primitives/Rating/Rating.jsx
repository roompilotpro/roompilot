import { classNames } from '../../../utils/classNames'

// Size styles
const sizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

// Star sizes by component size
const starSizeStyles = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

/**
 * Rating component for displaying star ratings
 *
 * @param {Object} props
 * @param {number} props.value - Rating value (0-5)
 * @param {boolean} [props.showValue=true] - Whether to show numeric value
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size variant
 * @param {string} [props.className] - Additional CSS classes
 */
function Rating({ value, showValue = true, size = 'md', className, ...props }) {
  const displayValue = Math.min(5, Math.max(0, value)).toFixed(1)

  return (
    <div
      className={classNames(
        'inline-flex items-center gap-1 font-semibold text-text-primary',
        sizeStyles[size],
        className
      )}
      aria-label={`Rating: ${displayValue} out of 5 stars`}
      {...props}
    >
      <svg
        className={classNames('text-amber-400 shrink-0', starSizeStyles[size])}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {showValue && <span className="text-text-primary">{displayValue}</span>}
    </div>
  )
}

export default Rating
