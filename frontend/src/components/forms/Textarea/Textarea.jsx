import { forwardRef, useState, useEffect, useRef, useId, useCallback } from 'react'
import { classNames } from '../../../utils/classNames'

// Resize variant styles
const resizeStyles = {
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
  none: 'resize-none',
}

/**
 * Textarea component with auto-resize and character count
 *
 * @param {Object} props
 * @param {string} [props.label] - Label text
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.helperText] - Helper text below textarea
 * @param {string} [props.error] - Error message
 * @param {boolean} [props.disabled=false] - Whether textarea is disabled
 * @param {boolean} [props.required=false] - Whether textarea is required
 * @param {boolean} [props.readOnly=false] - Whether textarea is read-only
 * @param {boolean} [props.fullWidth=false] - Whether textarea takes full width
 * @param {boolean} [props.autoResize=false] - Whether textarea auto-resizes
 * @param {boolean} [props.showCharCount=false] - Whether to show character count
 * @param {number} [props.maxLength] - Maximum characters allowed
 * @param {number} [props.minRows=3] - Minimum number of rows
 * @param {number} [props.maxRows] - Maximum number of rows (for auto-resize)
 * @param {'vertical'|'horizontal'|'both'|'none'} [props.resize='vertical'] - Resize behavior
 * @param {string} [props.id] - Textarea ID
 * @param {string} [props.className] - Additional CSS classes
 */
const Textarea = forwardRef(function Textarea(
  {
    label,
    placeholder,
    helperText,
    error,
    disabled = false,
    required = false,
    readOnly = false,
    fullWidth = false,
    autoResize = false,
    showCharCount = false,
    maxLength,
    minRows = 3,
    maxRows,
    resize = 'vertical',
    id,
    className,
    value,
    defaultValue,
    onChange,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const textareaId = id || generatedId
  const internalRef = useRef(null)
  const textareaRef = ref || internalRef

  const [charCount, setCharCount] = useState(() => {
    const initialValue = value ?? defaultValue ?? ''
    return String(initialValue).length
  })

  const adjustHeight = useCallback(() => {
    if (!autoResize || !textareaRef.current) return

    const textarea = textareaRef.current
    textarea.style.height = 'auto'

    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight)
    const minHeight = lineHeight * minRows
    const maxHeight = maxRows ? lineHeight * maxRows : Infinity

    const scrollHeight = textarea.scrollHeight
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)

    textarea.style.height = `${newHeight}px`
  }, [autoResize, textareaRef, minRows, maxRows])

  useEffect(() => {
    if (autoResize) {
      adjustHeight()
    }
  }, [value, autoResize, adjustHeight])

  const handleChange = (e) => {
    setCharCount(e.target.value.length)
    if (autoResize) {
      adjustHeight()
    }
    onChange?.(e)
  }

  return (
    <div className={classNames('flex flex-col', fullWidth && 'w-full', className)}>
      {label && (
        <label
          htmlFor={textareaId}
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
      <textarea
        ref={textareaRef}
        id={textareaId}
        className={classNames(
          'w-full min-h-[100px] py-3 px-3.5 bg-white border rounded-sm font-body text-sm leading-relaxed text-midnight transition-all duration-150 ease-out outline-none placeholder:text-mist',
          error
            ? 'border-coral focus:shadow-focus-error'
            : 'border-cloud focus:border-primary focus:shadow-focus',
          disabled && 'bg-snow text-mist cursor-not-allowed',
          autoResize ? 'resize-none overflow-hidden' : resizeStyles[resize]
        )}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        maxLength={maxLength}
        rows={minRows}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={
          error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
        }
        {...props}
      />
      <div className="flex justify-between items-start gap-2 min-h-5">
        {error && (
          <span id={`${textareaId}-error`} className="block text-xs text-coral mt-1" role="alert">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={`${textareaId}-helper`} className="block text-xs text-slate mt-1">
            {helperText}
          </span>
        )}
        {showCharCount && (
          <span className="ml-auto text-xs text-mist mt-1">
            {charCount}
            {maxLength ? `/${maxLength}` : ''}
          </span>
        )}
      </div>
    </div>
  )
})

export default Textarea
