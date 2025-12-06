import { forwardRef, useState, useRef, useEffect, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import { useClickOutside } from '../../../hooks/useClickOutside'
import './Select.css'

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
      className={classNames('select-wrapper', fullWidth && 'select-wrapper--full-width', className)}
    >
      {label && (
        <label htmlFor={selectId} className="select__label">
          {label}
          {required && (
            <span className="select__required" aria-hidden="true">
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
          'select',
          `select--${size}`,
          isOpen && 'select--open',
          error && 'select--error',
          disabled && 'select--disabled'
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span className={classNames('select__value', !selectedOption && 'select__placeholder')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="select__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className="select__dropdown">
          {searchable && (
            <div className="select__search">
              <input
                ref={searchInputRef}
                type="text"
                className="select__search-input"
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
            className="select__options"
            aria-label={label}
          >
            {filteredOptions.length === 0 ? (
              <li className="select__option select__option--empty">No options found</li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                  className={classNames(
                    'select__option',
                    option.value === value && 'select__option--selected',
                    option.disabled && 'select__option--disabled',
                    index === highlightedIndex && 'select__option--highlighted'
                  )}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                  {option.value === value && (
                    <span className="select__check" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <span id={`${selectId}-error`} className="select__error" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${selectId}-helper`} className="select__helper">
          {helperText}
        </span>
      )}
    </div>
  )
})

export default Select
