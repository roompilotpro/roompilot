import { classNames } from '../../../utils/classNames'

// Size variants
const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
}

// Color variants
const colorStyles = {
  primary: 'text-primary',
  white: 'text-white',
  current: 'text-current',
}

/**
 * LoadingSpinner component for loading states
 *
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size variant
 * @param {'primary'|'white'|'current'} [props.color='primary'] - Color variant
 * @param {string} [props.className] - Additional CSS classes
 */
function LoadingSpinner({ size = 'md', color = 'primary', className, ...props }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={classNames(
        'inline-flex items-center justify-center animate-spin',
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default LoadingSpinner
