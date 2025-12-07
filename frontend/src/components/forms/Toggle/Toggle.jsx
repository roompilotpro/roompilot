import { forwardRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'

// Size styles for the track
const trackSizeStyles = {
  sm: 'w-9 h-5',
  md: 'w-11 h-6',
}

// Size styles for the thumb
const thumbSizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
}

// Thumb translation when checked
const thumbCheckedStyles = {
  sm: 'translate-x-4',
  md: 'translate-x-5',
}

/**
 * Toggle/Switch component
 *
 * @param {Object} props
 * @param {string} [props.label] - Toggle label text
 * @param {string} [props.description] - Additional description
 * @param {'sm'|'md'} [props.size='md'] - Size variant
 * @param {boolean} [props.checked=false] - Whether toggle is on
 * @param {boolean} [props.disabled=false] - Whether toggle is disabled
 * @param {'left'|'right'} [props.labelPosition='right'] - Label position relative to toggle
 * @param {string} [props.id] - Toggle ID
 * @param {string} [props.className] - Additional CSS classes
 */
const Toggle = forwardRef(function Toggle(
  {
    label,
    description,
    size = 'md',
    checked = false,
    disabled = false,
    labelPosition = 'right',
    id,
    className,
    onChange,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const toggleId = id || generatedId

  return (
    <label
      htmlFor={toggleId}
      className={classNames(
        'inline-flex items-start gap-3 cursor-pointer select-none',
        labelPosition === 'left' && 'flex-row-reverse',
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      <div className="shrink-0 flex items-center">
        <input
          ref={ref}
          type="checkbox"
          id={toggleId}
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="absolute opacity-0 w-0 h-0 peer"
          aria-checked={checked}
          {...props}
        />
        <span
          className={classNames(
            'relative inline-flex items-center rounded-full transition-colors duration-150 ease-out',
            trackSizeStyles[size],
            checked ? 'bg-primary' : 'bg-cloud',
            disabled && !checked && 'bg-snow',
            disabled && checked && 'bg-mist',
            'peer-focus-visible:shadow-focus'
          )}
          aria-hidden="true"
        >
          <span
            className={classNames(
              'absolute left-0.5 bg-white rounded-full shadow-sm transition-transform duration-150 ease-out',
              thumbSizeStyles[size],
              checked && thumbCheckedStyles[size],
              disabled && 'bg-cloud'
            )}
          />
        </span>
      </div>
      {(label || description) && (
        <span className="flex flex-col gap-0.5">
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
  )
})

export default Toggle
