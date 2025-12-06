import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import './Button.css'

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
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && 'btn--full-width',
        loading && 'btn--loading',
        className
      )}
      {...props}
    >
      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      {!loading && leftIcon && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
      {children && <span className="btn__label">{children}</span>}
      {!loading && rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
    </button>
  )
})

export default Button
