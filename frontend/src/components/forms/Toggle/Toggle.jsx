import { forwardRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import './Toggle.css'

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
        'toggle-wrapper',
        `toggle-wrapper--label-${labelPosition}`,
        disabled && 'toggle-wrapper--disabled',
        className
      )}
    >
      <div className="toggle-container">
        <input
          ref={ref}
          type="checkbox"
          id={toggleId}
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="toggle__input"
          aria-checked={checked}
          {...props}
        />
        <span
          className={classNames(
            'toggle',
            `toggle--${size}`,
            checked && 'toggle--checked',
            disabled && 'toggle--disabled'
          )}
          aria-hidden="true"
        >
          <span className="toggle__thumb" />
        </span>
      </div>
      {(label || description) && (
        <span className="toggle__content">
          {label && <span className="toggle__label">{label}</span>}
          {description && <span className="toggle__description">{description}</span>}
        </span>
      )}
    </label>
  )
})

export default Toggle
