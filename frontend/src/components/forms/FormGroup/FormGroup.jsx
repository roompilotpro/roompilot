import { forwardRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import './FormGroup.css'

/**
 * FormGroup component - wrapper for label + input + helper text
 *
 * @param {Object} props
 * @param {string} [props.label] - Label text
 * @param {string} [props.htmlFor] - ID of the form element this label is for
 * @param {string} [props.helperText] - Helper text below input
 * @param {string} [props.error] - Error message
 * @param {boolean} [props.required=false] - Whether field is required
 * @param {boolean} [props.disabled=false] - Whether field is disabled
 * @param {boolean} [props.fullWidth=false] - Whether to take full width
 * @param {React.ReactNode} props.children - Form input element(s)
 * @param {string} [props.className] - Additional CSS classes
 */
const FormGroup = forwardRef(function FormGroup(
  {
    label,
    htmlFor,
    helperText,
    error,
    required = false,
    disabled = false,
    fullWidth = false,
    children,
    className,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const groupId = htmlFor || generatedId

  return (
    <div
      ref={ref}
      className={classNames(
        'form-group',
        fullWidth && 'form-group--full-width',
        disabled && 'form-group--disabled',
        error && 'form-group--error',
        className
      )}
      {...props}
    >
      {label && (
        <label htmlFor={groupId} className="form-group__label">
          {label}
          {required && (
            <span className="form-group__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="form-group__content">{children}</div>
      {error && (
        <span id={`${groupId}-error`} className="form-group__error" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${groupId}-helper`} className="form-group__helper">
          {helperText}
        </span>
      )}
    </div>
  )
})

export default FormGroup
