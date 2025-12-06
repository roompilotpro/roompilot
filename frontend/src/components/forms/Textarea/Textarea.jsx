import { forwardRef, useState, useEffect, useRef, useId, useCallback } from 'react'
import { classNames } from '../../../utils/classNames'
import './Textarea.css'

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
    <div
      className={classNames(
        'textarea-wrapper',
        fullWidth && 'textarea-wrapper--full-width',
        className
      )}
    >
      {label && (
        <label htmlFor={textareaId} className="textarea__label">
          {label}
          {required && (
            <span className="textarea__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <textarea
        ref={textareaRef}
        id={textareaId}
        className={classNames(
          'textarea',
          error && 'textarea--error',
          disabled && 'textarea--disabled',
          `textarea--resize-${resize}`,
          autoResize && 'textarea--auto-resize'
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
      <div className="textarea__footer">
        {error && (
          <span id={`${textareaId}-error`} className="textarea__error" role="alert">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={`${textareaId}-helper`} className="textarea__helper">
            {helperText}
          </span>
        )}
        {showCharCount && (
          <span className="textarea__char-count">
            {charCount}
            {maxLength ? `/${maxLength}` : ''}
          </span>
        )}
      </div>
    </div>
  )
})

export default Textarea
