import { forwardRef, useState, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import './Input.css'

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
    <div
      className={classNames('input-wrapper', fullWidth && 'input-wrapper--full-width', className)}
    >
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
          {required && (
            <span className="input__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div
        className={classNames(
          'input-container',
          `input-container--${size}`,
          error && 'input-container--error',
          disabled && 'input-container--disabled',
          prefix && 'input-container--has-prefix',
          (suffix || isPassword) && 'input-container--has-suffix'
        )}
      >
        {prefix && <span className="input__prefix">{prefix}</span>}
        <input
          ref={ref}
          type={inputType}
          id={inputId}
          className="input"
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
            className="input__toggle-password"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
        {suffix && !isPassword && <span className="input__suffix">{suffix}</span>}
      </div>
      {error && (
        <span id={`${inputId}-error`} className="input__error" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${inputId}-helper`} className="input__helper">
          {helperText}
        </span>
      )}
    </div>
  )
})

export default Input
