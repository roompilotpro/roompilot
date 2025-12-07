import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'

// Base icon button styles
const baseStyles =
  'inline-flex items-center justify-center rounded-full border-none cursor-pointer transition-all duration-150 ease-out shrink-0 focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-60 disabled:cursor-not-allowed'

// Size variants
const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

// Icon sizes by button size
const iconSizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

// Spinner sizes by button size
const spinnerSizeStyles = {
  sm: 'w-3.5 h-3.5',
  md: 'w-[18px] h-[18px]',
  lg: 'w-[22px] h-[22px]',
}

// Variant styles
const variantStyles = {
  primary: 'bg-primary text-white hover:enabled:bg-primary-dark',
  secondary:
    'bg-white text-text-primary shadow-sm border border-solid border-border hover:enabled:bg-snow hover:enabled:shadow-md',
  ghost:
    'bg-transparent text-text-secondary hover:enabled:bg-bg-secondary hover:enabled:text-text-primary',
  danger: 'bg-transparent text-coral hover:enabled:bg-coral-bg focus-visible:shadow-focus-error',
}

/**
 * Icon-only button component for actions
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant='ghost'] - Visual style
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size variant
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {boolean} [props.loading=false] - Whether button is in loading state
 * @param {string} props.label - Accessible label for the button
 * @param {'button'|'submit'|'reset'} [props.type='button'] - HTML button type
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Icon content
 */
const IconButton = forwardRef(function IconButton(
  {
    variant = 'ghost',
    size = 'md',
    disabled = false,
    loading = false,
    label,
    type = 'button',
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-label={label}
      className={classNames(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        loading && 'opacity-60 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <span
          className={classNames(
            'flex items-center justify-center animate-spin',
            spinnerSizeStyles[size]
          )}
          aria-hidden="true"
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
        </span>
      ) : (
        <span
          className={classNames(
            'flex items-center justify-center [&>svg]:w-full [&>svg]:h-full',
            iconSizeStyles[size]
          )}
        >
          {children}
        </span>
      )}
    </button>
  )
})

export default IconButton
