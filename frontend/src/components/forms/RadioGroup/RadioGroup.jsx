import { forwardRef, createContext, useContext, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import './RadioGroup.css'

const RadioGroupContext = createContext(null)

/**
 * RadioGroup component with standard and card variants
 *
 * @param {Object} props
 * @param {string} props.name - Name attribute for radio inputs
 * @param {string} [props.value] - Currently selected value
 * @param {Array<{value: string, label: string, description?: string, disabled?: boolean}>} [props.options] - Radio options
 * @param {'vertical'|'horizontal'} [props.orientation='vertical'] - Layout orientation
 * @param {'standard'|'card'} [props.variant='standard'] - Visual variant
 * @param {'sm'|'md'} [props.size='md'] - Size variant
 * @param {string} [props.label] - Group label
 * @param {string} [props.error] - Error message
 * @param {boolean} [props.disabled=false] - Whether all radios are disabled
 * @param {boolean} [props.required=false] - Whether selection is required
 * @param {Function} [props.onChange] - Change handler
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.children] - Custom Radio children (alternative to options)
 */
const RadioGroup = forwardRef(function RadioGroup(
  {
    name,
    value,
    options,
    orientation = 'vertical',
    variant = 'standard',
    size = 'md',
    label,
    error,
    disabled = false,
    required = false,
    onChange,
    className,
    children,
    ...props
  },
  ref
) {
  const groupId = useId()

  const handleChange = (e) => {
    onChange?.({ target: { name, value: e.target.value } })
  }

  return (
    <RadioGroupContext.Provider
      value={{ name, value, size, variant, disabled, onChange: handleChange }}
    >
      <div
        ref={ref}
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${groupId}-error` : undefined}
        className={classNames(
          'radio-group',
          `radio-group--${orientation}`,
          `radio-group--${variant}`,
          className
        )}
        {...props}
      >
        {label && (
          <span id={`${groupId}-label`} className="radio-group__label">
            {label}
            {required && (
              <span className="radio-group__required" aria-hidden="true">
                *
              </span>
            )}
          </span>
        )}
        <div className="radio-group__options">
          {options
            ? options.map((option) => (
                <Radio
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  description={option.description}
                  disabled={option.disabled || disabled}
                />
              ))
            : children}
        </div>
        {error && (
          <span id={`${groupId}-error`} className="radio-group__error" role="alert">
            {error}
          </span>
        )}
      </div>
    </RadioGroupContext.Provider>
  )
})

/**
 * Individual Radio button component
 */
const Radio = forwardRef(function Radio(
  { value, label, description, disabled = false, className, ...props },
  ref
) {
  const context = useContext(RadioGroupContext)
  const isChecked = context ? context.value === value : false
  const isDisabled = disabled || context?.disabled
  const size = context?.size || 'md'
  const variant = context?.variant || 'standard'
  const radioId = useId()

  return (
    <label
      htmlFor={radioId}
      className={classNames(
        'radio',
        `radio--${size}`,
        `radio--${variant}`,
        isChecked && 'radio--checked',
        isDisabled && 'radio--disabled',
        className
      )}
    >
      <input
        ref={ref}
        type="radio"
        id={radioId}
        name={context?.name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={context?.onChange}
        className="radio__input"
        {...props}
      />
      <span
        className={classNames('radio__circle', isChecked && 'radio__circle--checked')}
        aria-hidden="true"
      >
        {isChecked && <span className="radio__dot" />}
      </span>
      {(label || description) && (
        <span className="radio__content">
          {label && <span className="radio__label">{label}</span>}
          {description && <span className="radio__description">{description}</span>}
        </span>
      )}
    </label>
  )
})

RadioGroup.Radio = Radio

export default RadioGroup
export { Radio }
