import { forwardRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'

// Size styles for the checkbox box
const boxSizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
}

// Size styles for the checkmark SVG
const svgSizeStyles = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
}

/**
 * Checkbox component with indeterminate state support
 *
 * @param {Object} props
 * @param {string} [props.label] - Checkbox label text
 * @param {string} [props.description] - Additional description below label
 * @param {'sm'|'md'} [props.size='md'] - Size variant
 * @param {boolean} [props.checked=false] - Whether checkbox is checked
 * @param {boolean} [props.indeterminate=false] - Whether checkbox is in indeterminate state
 * @param {boolean} [props.disabled=false] - Whether checkbox is disabled
 * @param {string} [props.error] - Error message
 * @param {boolean} [props.card=false] - Whether to display as a card style checkbox
 * @param {string} [props.id] - Checkbox ID
 * @param {string} [props.className] - Additional CSS classes
 */
const Checkbox = forwardRef(function Checkbox(
  {
    label,
    description,
    size = 'md',
    checked = false,
    indeterminate = false,
    disabled = false,
    error,
    card = false,
    id,
    className,
    onChange,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const checkboxId = id || generatedId

  const handleRef = (element) => {
    if (element) {
      element.indeterminate = indeterminate
    }
    if (typeof ref === 'function') {
      ref(element)
    } else if (ref) {
      ref.current = element
    }
  }

  const handleCardClick = (e) => {
    // Don't trigger if clicking directly on the input (would double-toggle)
    if (e.target.type === 'checkbox') return
    if (disabled) return
    // Trigger the onChange handler
    onChange?.({ target: { checked: !checked } })
  }

  return (
    <div
      className={classNames(
        'flex flex-col',
        card &&
          'p-4 bg-white border-2 border-cloud rounded-md cursor-pointer transition-all duration-150 ease-out hover:border-primary hover:bg-primary-bg',
        card && checked && 'border-primary bg-primary-bg',
        card && disabled && 'bg-snow cursor-not-allowed hover:border-cloud hover:bg-snow',
        className
      )}
      onClick={card ? handleCardClick : undefined}
    >
      <label
        htmlFor={checkboxId}
        className={classNames(
          'inline-flex items-start gap-3 cursor-pointer select-none',
          disabled && 'cursor-not-allowed'
        )}
      >
        <input
          ref={handleRef}
          type="checkbox"
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="absolute opacity-0 w-0 h-0 peer"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
          {...props}
        />
        <span
          className={classNames(
            'shrink-0 flex items-center justify-center bg-white border-2 rounded transition-all duration-150 ease-out',
            boxSizeStyles[size],
            checked || indeterminate
              ? 'bg-primary border-primary text-white'
              : 'border-cloud hover:border-primary',
            error && !checked && !indeterminate && 'border-coral',
            disabled && !checked && !indeterminate && 'bg-snow border-cloud',
            disabled && (checked || indeterminate) && 'bg-mist border-mist',
            'peer-focus-visible:border-primary peer-focus-visible:shadow-focus',
            error && 'peer-focus-visible:shadow-focus-error'
          )}
          aria-hidden="true"
        >
          {checked && !indeterminate && (
            <svg
              className={svgSizeStyles[size]}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {indeterminate && (
            <svg
              className={svgSizeStyles[size]}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
        </span>
        {(label || description) && (
          <span className="flex flex-col gap-0.5 pt-px">
            {label && (
              <span
                className={classNames(
                  'font-body text-sm font-medium leading-snug',
                  disabled ? 'text-mist' : 'text-charcoal'
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                className={classNames(
                  'font-body text-sm leading-snug',
                  disabled ? 'text-mist' : 'text-slate'
                )}
              >
                {description}
              </span>
            )}
          </span>
        )}
      </label>
      {error && (
        <span
          id={`${checkboxId}-error`}
          className={classNames('block text-xs text-coral mt-1', size === 'sm' ? 'ml-7' : 'ml-8')}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  )
})

export default Checkbox
