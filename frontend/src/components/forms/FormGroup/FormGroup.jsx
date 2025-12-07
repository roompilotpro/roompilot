import { forwardRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'

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
        'flex flex-col gap-2',
        fullWidth && 'w-full',
        disabled && 'opacity-60',
        className
      )}
      {...props}
    >
      {label && (
        <label
          htmlFor={groupId}
          className={classNames(
            'block font-body text-sm font-semibold',
            disabled ? 'text-mist' : 'text-midnight'
          )}
        >
          {label}
          {required && (
            <span className="text-coral ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="flex flex-col">{children}</div>
      {error && (
        <span id={`${groupId}-error`} className="block text-xs text-coral" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${groupId}-helper`} className="block text-xs text-slate">
          {helperText}
        </span>
      )}
    </div>
  )
})

export default FormGroup
