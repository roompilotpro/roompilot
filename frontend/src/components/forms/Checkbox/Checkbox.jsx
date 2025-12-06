import { forwardRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import './Checkbox.css'

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

  return (
    <div
      className={classNames(
        'checkbox-wrapper',
        card && 'checkbox-wrapper--card',
        card && checked && 'checkbox-wrapper--card-checked',
        card && disabled && 'checkbox-wrapper--card-disabled',
        className
      )}
    >
      <label
        htmlFor={checkboxId}
        className={classNames('checkbox', `checkbox--${size}`, disabled && 'checkbox--disabled')}
      >
        <input
          ref={handleRef}
          type="checkbox"
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="checkbox__input"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
          {...props}
        />
        <span
          className={classNames(
            'checkbox__box',
            checked && 'checkbox__box--checked',
            indeterminate && 'checkbox__box--indeterminate',
            error && 'checkbox__box--error'
          )}
          aria-hidden="true"
        >
          {checked && !indeterminate && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {indeterminate && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
        </span>
        {(label || description) && (
          <span className="checkbox__content">
            {label && <span className="checkbox__label">{label}</span>}
            {description && <span className="checkbox__description">{description}</span>}
          </span>
        )}
      </label>
      {error && (
        <span id={`${checkboxId}-error`} className="checkbox__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
})

export default Checkbox
