import { forwardRef, useState, useId } from 'react'
import { classNames } from '../../../utils/classNames'

// Size variant styles for the container
const containerSizeStyles = {
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-[52px]',
}

// Size variant styles for the input
const inputSizeStyles = {
  sm: 'text-sm px-3',
  md: 'text-sm px-3.5',
  lg: 'text-base px-4',
}

// Size variant styles for prefix/suffix
const affixSizeStyles = {
  sm: 'text-sm px-2',
  md: 'text-sm px-3',
  lg: 'text-base px-3',
}

/**
 * Input component with label, error state, and multiple types
 *
 * @param {Object} props
 * @param {'text'|'email'|'password'|'tel'|'number'|'search'|'url'} [props.type='text'] - Input type
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size variant
 * @param {string} [props.label] - Label text
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.helperText] - Helper text below input
 * @param {string} [props.error] - Error message (shows error state when truthy)
 * @param {boolean} [props.disabled=false] - Whether input is disabled
 * @param {boolean} [props.required=false] - Whether input is required
 * @param {boolean} [props.readOnly=false] - Whether input is read-only
 * @param {boolean} [props.fullWidth=false] - Whether input takes full width
 * @param {React.ReactNode} [props.prefix] - Prefix element (e.g., "$")
 * @param {React.ReactNode} [props.suffix] - Suffix element (e.g., icon)
 * @param {string} [props.id] - Input ID (auto-generated if not provided)
 * @param {string} [props.className] - Additional CSS classes
 */
const Input = forwardRef(function Input(
  {
    type = 'text',
    size = 'md',
    label,
    placeholder,
    helperText,
    error,
    disabled = false,
    required = false,
    readOnly = false,
    fullWidth = false,
    prefix,
    suffix,
    id,
    className,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const generatedId = useId()
  const inputId = id || generatedId
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={classNames('flex flex-col', fullWidth && 'w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block font-body text-sm font-semibold text-midnight mb-2"
        >
          {label}
          {required && (
            <span className="text-coral ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div
        className={classNames(
          'group flex items-center bg-white border rounded-sm transition-all duration-150 ease-out',
          containerSizeStyles[size],
          error
            ? 'border-coral focus-within:shadow-focus-error'
            : 'border-cloud focus-within:border-primary focus-within:shadow-focus',
          disabled && 'bg-snow cursor-not-allowed'
        )}
      >
        {prefix && (
          <span
            className={classNames(
              'shrink-0 flex items-center text-slate font-semibold',
              affixSizeStyles[size]
            )}
          >
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          type={inputType}
          id={inputId}
          className={classNames(
            'flex-1 min-w-0 h-full border-none bg-transparent font-body text-midnight outline-none placeholder:text-mist disabled:text-mist disabled:cursor-not-allowed',
            '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&[type=number]]:[-moz-appearance:textfield] [&[type=search]::-webkit-search-cancel-button]:appearance-none',
            inputSizeStyles[size],
            prefix && '!pl-0',
            (suffix || isPassword) && '!pr-0'
          )}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 mr-1 p-0 border-none bg-transparent text-mist cursor-pointer rounded-sm transition-all duration-150 ease-out hover:text-slate hover:bg-snow"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg
                className="w-[18px] h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                className="w-[18px] h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
        {suffix && !isPassword && (
          <span
            className={classNames(
              'shrink-0 flex items-center text-slate font-semibold',
              affixSizeStyles[size]
            )}
          >
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} className="block text-xs text-coral mt-1" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${inputId}-helper`} className="block text-xs text-slate mt-1">
          {helperText}
        </span>
      )}
    </div>
  )
})

export default Input
