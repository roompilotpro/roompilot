import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'

// Base button styles - using custom radius values to match HTML design
const baseStyles =
  'inline-flex items-center justify-center font-semibold no-underline rounded-[8px] border-none cursor-pointer transition-all duration-200 relative whitespace-nowrap focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-60 disabled:cursor-not-allowed'

// Size variants - lg uses larger radius for CTA buttons
const sizeStyles = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-[15px] gap-2',
  lg: 'px-8 py-4 text-base rounded-[12px] gap-2',
}

// Variant styles
const variantStyles = {
  primary:
    'bg-primary text-white shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:enabled:bg-primary-dark hover:enabled:-translate-y-px hover:enabled:shadow-[0_4px_16px_rgba(37,99,235,0.35)] active:enabled:translate-y-0',
  secondary:
    'bg-charcoal text-white hover:enabled:bg-midnight hover:enabled:-translate-y-px active:enabled:translate-y-0',
  outline:
    'bg-transparent text-charcoal border-2 border-solid border-cloud hover:enabled:border-charcoal hover:enabled:bg-snow',
  ghost: 'bg-transparent text-slate hover:enabled:bg-snow hover:enabled:text-charcoal',
  danger:
    'bg-coral text-white hover:enabled:bg-coral-dark hover:enabled:-translate-y-px active:enabled:translate-y-0 focus-visible:shadow-focus-error',
  success:
    'bg-accent text-white hover:enabled:bg-accent-dark hover:enabled:-translate-y-px active:enabled:translate-y-0 focus-visible:shadow-focus-success',
  white: 'bg-white text-primary shadow-sm hover:enabled:bg-snow hover:enabled:shadow-md',
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
  lg: 'w-5 h-5',
}

/**
 * Button component with multiple variants and sizes
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'|'success'|'white'} [props.variant='primary'] - Visual style
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size variant
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {boolean} [props.loading=false] - Whether button is in loading state
 * @param {boolean} [props.fullWidth=false] - Whether button takes full width
 * @param {React.ReactNode} [props.leftIcon] - Icon before text
 * @param {React.ReactNode} [props.rightIcon] - Icon after text
 * @param {'button'|'submit'|'reset'} [props.type='button'] - HTML button type
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
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
      className={classNames(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        loading && 'opacity-60 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading && (
        <span
          className={classNames(
            'inline-flex items-center justify-center animate-spin',
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
      )}
      {!loading && leftIcon && (
        <span
          className={classNames(
            'inline-flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full',
            iconSizeStyles[size]
          )}
        >
          {leftIcon}
        </span>
      )}
      {children && <span className="inline-flex items-center">{children}</span>}
      {!loading && rightIcon && (
        <span
          className={classNames(
            'inline-flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full',
            iconSizeStyles[size]
          )}
        >
          {rightIcon}
        </span>
      )}
    </button>
  )
})

export default Button
