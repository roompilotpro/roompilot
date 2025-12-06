import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import './IconButton.css'

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
        'icon-btn',
        `icon-btn--${variant}`,
        `icon-btn--${size}`,
        loading && 'icon-btn--loading',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="icon-btn__spinner" aria-hidden="true">
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
      ) : (
        <span className="icon-btn__icon">{children}</span>
      )}
    </button>
  )
})

export default IconButton
