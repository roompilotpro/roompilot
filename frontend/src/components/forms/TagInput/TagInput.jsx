import { forwardRef, useState, useRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import './TagInput.css'

/**
 * TagInput component for adding/removing tags
 *
 * @param {Object} props
 * @param {Array<string>} [props.value=[]] - Current tags
 * @param {string} [props.placeholder='Add tag...'] - Placeholder text
 * @param {'sm'|'md'} [props.size='md'] - Size variant
 * @param {string} [props.label] - Label text
 * @param {string} [props.helperText] - Helper text
 * @param {string} [props.error] - Error message
 * @param {boolean} [props.disabled=false] - Whether input is disabled
 * @param {boolean} [props.required=false] - Whether at least one tag is required
 * @param {boolean} [props.fullWidth=false] - Whether input takes full width
 * @param {number} [props.maxTags] - Maximum number of tags
 * @param {Array<string>} [props.suggestions] - Autocomplete suggestions
 * @param {Function} [props.onChange] - Change handler (receives array of tags)
 * @param {string} [props.id] - Input ID
 * @param {string} [props.className] - Additional CSS classes
 */
const TagInput = forwardRef(function TagInput(
  {
    value = [],
    placeholder = 'Add tag...',
    size = 'md',
    label,
    helperText,
    error,
    disabled = false,
    required = false,
    fullWidth = false,
    maxTags,
    suggestions = [],
    onChange,
    id,
    className,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId
  const inputRef = useRef(null)
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
  )

  const showSuggestions = isFocused && inputValue && filteredSuggestions.length > 0

  const addTag = (tag) => {
    const trimmedTag = tag.trim()
    if (!trimmedTag) return
    if (value.includes(trimmedTag)) return
    if (maxTags && value.length >= maxTags) return

    onChange?.({ target: { value: [...value, trimmedTag] } })
    setInputValue('')
  }

  const removeTag = (index) => {
    const newTags = value.filter((_, i) => i !== index)
    onChange?.({ target: { value: newTags } })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleSuggestionClick = (suggestion) => {
    addTag(suggestion)
    inputRef.current?.focus()
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div
      className={classNames(
        'taginput-wrapper',
        fullWidth && 'taginput-wrapper--full-width',
        className
      )}
    >
      {label && (
        <label htmlFor={inputId} className="taginput__label">
          {label}
          {required && (
            <span className="taginput__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div
        ref={ref}
        className={classNames(
          'taginput',
          `taginput--${size}`,
          isFocused && 'taginput--focused',
          error && 'taginput--error',
          disabled && 'taginput--disabled'
        )}
        onClick={handleContainerClick}
      >
        <div className="taginput__tags">
          {value.map((tag, index) => (
            <span key={index} className="taginput__tag">
              <span className="taginput__tag-text">{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  className="taginput__tag-remove"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeTag(index)
                  }}
                  aria-label={`Remove ${tag}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            id={inputId}
            className="taginput__input"
            placeholder={value.length === 0 ? placeholder : ''}
            value={inputValue}
            disabled={disabled || (maxTags && value.length >= maxTags)}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
        </div>
      </div>

      {showSuggestions && (
        <ul className="taginput__suggestions" role="listbox">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              role="option"
              className="taginput__suggestion"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <span id={`${inputId}-error`} className="taginput__error" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${inputId}-helper`} className="taginput__helper">
          {helperText}
        </span>
      )}
    </div>
  )
})

export default TagInput
