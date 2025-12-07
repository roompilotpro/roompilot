import { forwardRef, useState, useRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'

// Size variant styles
const containerSizeStyles = {
  sm: 'min-h-9 py-1 px-2',
  md: 'min-h-11 py-2 px-3',
}

const tagSizeStyles = {
  sm: 'text-xs py-px px-1.5',
  md: 'text-sm py-0.5 px-2',
}

const inputSizeStyles = {
  sm: 'text-sm',
  md: 'text-sm',
}

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
    <div className={classNames('flex flex-col relative', fullWidth && 'w-full', className)}>
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
        ref={ref}
        className={classNames(
          'flex flex-wrap items-center gap-2 bg-white border rounded-sm cursor-text transition-all duration-150 ease-out',
          containerSizeStyles[size],
          isFocused && 'border-primary shadow-focus',
          !isFocused && !error && 'border-cloud',
          error && 'border-coral',
          error && isFocused && 'shadow-focus-error',
          disabled && 'bg-snow cursor-not-allowed'
        )}
        onClick={handleContainerClick}
      >
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          {value.map((tag, index) => (
            <span
              key={index}
              className={classNames(
                'inline-flex items-center gap-1 bg-primary-bg text-primary rounded-sm font-body font-medium',
                tagSizeStyles[size]
              )}
            >
              <span className="whitespace-nowrap">{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  className="flex items-center justify-center w-4 h-4 p-0 border-none bg-transparent text-inherit opacity-60 cursor-pointer rounded-sm transition-all duration-150 ease-out hover:opacity-100 hover:bg-primary hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeTag(index)
                  }}
                  aria-label={`Remove ${tag}`}
                >
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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
            className={classNames(
              'flex-1 min-w-[80px] p-0 border-none bg-transparent font-body text-midnight outline-none placeholder:text-mist disabled:cursor-not-allowed',
              inputSizeStyles[size]
            )}
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
        <ul
          className="absolute top-full left-0 right-0 mt-1 py-1 bg-white border border-cloud rounded-sm shadow-lg z-dropdown list-none max-h-[200px] overflow-y-auto"
          role="listbox"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              role="option"
              className="py-2 px-3 font-body text-sm text-charcoal cursor-pointer transition-colors duration-150 ease-out hover:bg-snow"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

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

export default TagInput
