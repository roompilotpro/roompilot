import { forwardRef, createContext, useContext, useId } from 'react'
import { classNames } from '../../../utils/classNames'

const RadioGroupContext = createContext(null)

// Size styles for the radio circle
const circleSizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
}

// Size styles for the dot
const dotSizeStyles = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
}

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
        className={classNames('flex flex-col gap-2', className)}
        {...props}
      >
        {label && (
          <span
            id={`${groupId}-label`}
            className="block font-body text-sm font-semibold text-midnight mb-1"
          >
            {label}
            {required && (
              <span className="text-coral ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </span>
        )}
        <div
          className={classNames(
            'flex gap-3',
            orientation === 'vertical' && 'flex-col',
            orientation === 'horizontal' && 'flex-row flex-wrap'
          )}
        >
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
          <span id={`${groupId}-error`} className="block text-xs text-coral mt-1" role="alert">
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
        'inline-flex items-start gap-3 cursor-pointer select-none',
        variant === 'card' &&
          'flex-1 p-4 bg-white border-2 border-cloud rounded-md transition-all duration-150 ease-out hover:border-primary hover:bg-primary-bg',
        variant === 'card' && isChecked && 'border-primary bg-primary-bg',
        variant === 'card' && isDisabled && 'bg-snow hover:border-cloud hover:bg-snow',
        isDisabled && 'cursor-not-allowed',
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
        className="absolute opacity-0 w-0 h-0 peer"
        {...props}
      />
      <span
        className={classNames(
          'shrink-0 flex items-center justify-center bg-white border-2 rounded-full transition-colors duration-150 ease-out',
          circleSizeStyles[size],
          isChecked ? 'border-primary' : 'border-cloud hover:border-primary',
          isDisabled && 'bg-snow border-cloud',
          'peer-focus-visible:border-primary peer-focus-visible:shadow-focus'
        )}
        aria-hidden="true"
      >
        {isChecked && (
          <span
            className={classNames(
              'rounded-full',
              dotSizeStyles[size],
              isDisabled ? 'bg-mist' : 'bg-primary'
            )}
          />
        )}
      </span>
      {(label || description) && (
        <span className="flex flex-col gap-0.5 pt-px">
          {label && (
            <span
              className={classNames(
                'font-body text-sm font-medium leading-snug',
                isDisabled ? 'text-mist' : 'text-charcoal'
              )}
            >
              {label}
            </span>
          )}
          {description && (
            <span
              className={classNames(
                'font-body text-sm leading-snug',
                isDisabled ? 'text-mist' : 'text-slate'
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

RadioGroup.Radio = Radio

export default RadioGroup
export { Radio }
