import { forwardRef, useState, useRef, useEffect, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import { useClickOutside } from '../../../hooks/useClickOutside'

// Size variant styles
const sizeStyles = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-3.5 text-sm',
  lg: 'h-[52px] px-4 text-base',
}

/**
 * Select component with custom dropdown styling
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string, disabled?: boolean}>} props.options - Available options
 * @param {string} [props.value] - Selected value
 * @param {string} [props.placeholder='Select...'] - Placeholder text
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size variant
 * @param {string} [props.label] - Label text
 * @param {string} [props.helperText] - Helper text below select
 * @param {string} [props.error] - Error message
 * @param {boolean} [props.disabled=false] - Whether select is disabled
 * @param {boolean} [props.required=false] - Whether select is required
 * @param {boolean} [props.fullWidth=false] - Whether select takes full width
 * @param {boolean} [props.searchable=false] - Whether options are searchable
 * @param {Function} [props.onChange] - Change handler
 * @param {string} [props.id] - Select ID
 * @param {string} [props.className] - Additional CSS classes
 */
const Select = forwardRef(function Select(
  {
    options = [],
    value,
    placeholder = 'Select...',
    size = 'md',
    label,
    helperText,
    error,
    disabled = false,
    required = false,
    fullWidth = false,
    searchable = false,
    onChange,
    id,
    className,
    ...props
  },
  ref
) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef(null)
  const searchInputRef = useRef(null)
  const listboxRef = useRef(null)

  const generatedId = useId()
  const selectId = id || generatedId
  const listboxId = `${selectId}-listbox`

  useClickOutside(containerRef, () => setIsOpen(false))

  const selectedOption = options.find((opt) => opt.value === value)

  const filteredOptions =
    searchable && searchQuery
      ? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : options

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  const updateSearchQuery = (query) => {
    setSearchQuery(query)
    setHighlightedIndex(-1)
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      updateSearchQuery('')
    }
  }

  const handleSelect = (option) => {
    if (!option.disabled) {
      onChange?.({ target: { value: option.value, name: props.name } })
      setIsOpen(false)
      updateSearchQuery('')
    }
  }

  const handleKeyDown = (e) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen && highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex])
        } else {
          setIsOpen(!isOpen)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev))
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        }
        break
      case 'Tab':
        setIsOpen(false)
        break
    }
  }

  return (
    <div
      ref={containerRef}
      className={classNames('flex flex-col relative', fullWidth && 'w-full', className)}
    >
      {label && (
        <label
          htmlFor={selectId}
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
        id={selectId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={
          error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
        }
        tabIndex={disabled ? -1 : 0}
        className={classNames(
          'flex items-center justify-between gap-2 bg-white border rounded-sm cursor-pointer transition-all duration-150 ease-out',
          sizeStyles[size],
          isOpen && 'border-primary shadow-focus',
          error
            ? 'border-coral focus:shadow-focus-error'
            : !isOpen && 'border-cloud focus:border-primary focus:shadow-focus',
          disabled && 'bg-snow cursor-not-allowed text-mist',
          'outline-none'
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span
          className={classNames(
            'flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-body',
            selectedOption ? 'text-midnight' : 'text-mist'
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          className={classNames(
            'shrink-0 flex items-center text-slate transition-transform duration-150 ease-out',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-cloud rounded-sm shadow-lg z-dropdown overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-cloud">
              <input
                ref={searchInputRef}
                type="text"
                className="w-full py-2 px-3 border border-cloud rounded-sm font-body text-sm text-midnight outline-none focus:border-primary placeholder:text-mist"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => updateSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            className="list-none m-0 py-1 max-h-60 overflow-y-auto"
            aria-label={label}
          >
            {filteredOptions.length === 0 ? (
              <li className="flex items-center justify-center py-2.5 px-3 font-body text-sm text-mist cursor-default">
                No options found
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                  className={classNames(
                    'flex items-center justify-between py-2.5 px-3 font-body text-sm cursor-pointer transition-colors duration-150 ease-out',
                    option.value === value
                      ? 'text-primary bg-primary-bg hover:bg-primary-bg'
                      : 'text-charcoal hover:bg-snow',
                    option.disabled && 'text-mist cursor-not-allowed hover:bg-transparent',
                    index === highlightedIndex && 'bg-snow'
                  )}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                  {option.value === value && (
                    <span className="shrink-0 text-primary" aria-hidden="true">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {error && (
        <span id={`${selectId}-error`} className="block text-xs text-coral mt-1" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${selectId}-helper`} className="block text-xs text-slate mt-1">
          {helperText}
        </span>
      )}
    </div>
  )
})

export default Select
