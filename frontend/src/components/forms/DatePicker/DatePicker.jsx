import { forwardRef, useState, useRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import { useClickOutside } from '../../../hooks/useClickOutside'
import './DatePicker.css'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/**
 * DatePicker component with calendar dropdown
 *
 * @param {Object} props
 * @param {Date|string} [props.value] - Selected date
 * @param {string} [props.placeholder='Select date'] - Placeholder text
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size variant
 * @param {string} [props.label] - Label text
 * @param {string} [props.helperText] - Helper text
 * @param {string} [props.error] - Error message
 * @param {boolean} [props.disabled=false] - Whether picker is disabled
 * @param {boolean} [props.required=false] - Whether selection is required
 * @param {boolean} [props.fullWidth=false] - Whether picker takes full width
 * @param {Date} [props.minDate] - Minimum selectable date
 * @param {Date} [props.maxDate] - Maximum selectable date
 * @param {string} [props.dateFormat='MM/DD/YYYY'] - Display format
 * @param {Function} [props.onChange] - Change handler
 * @param {string} [props.id] - Picker ID
 * @param {string} [props.className] - Additional CSS classes
 */
const DatePicker = forwardRef(function DatePicker(
  {
    value,
    placeholder = 'Select date',
    size = 'md',
    label,
    helperText,
    error,
    disabled = false,
    required = false,
    fullWidth = false,
    minDate,
    maxDate,
    dateFormat = 'MM/DD/YYYY',
    onChange,
    id,
    className,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const pickerId = id || generatedId
  const containerRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  const selectedDate = value ? new Date(value) : null
  const [viewDate, setViewDate] = useState(() => selectedDate || new Date())

  useClickOutside(containerRef, () => setIsOpen(false))

  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const year = d.getFullYear()

    return dateFormat
      .replace('MM', month)
      .replace('DD', day)
      .replace('YYYY', year)
      .replace('YY', String(year).slice(-2))
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []

    // Previous month days
    const prevMonth = new Date(year, month, 0)
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    // Next month days
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      })
    }

    return days
  }

  const isDateDisabled = (date) => {
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true
    if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) return true
    return false
  }

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const isToday = (date) => isSameDay(date, new Date())

  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return
    onChange?.({ target: { value: date } })
    setIsOpen(false)
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen && selectedDate) {
        setViewDate(selectedDate)
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
  }

  const days = getDaysInMonth(viewDate)

  return (
    <div
      ref={containerRef}
      className={classNames(
        'datepicker-wrapper',
        fullWidth && 'datepicker-wrapper--full-width',
        className
      )}
    >
      {label && (
        <label htmlFor={pickerId} className="datepicker__label">
          {label}
          {required && (
            <span className="datepicker__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div
        ref={ref}
        id={pickerId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={
          error ? `${pickerId}-error` : helperText ? `${pickerId}-helper` : undefined
        }
        tabIndex={disabled ? -1 : 0}
        className={classNames(
          'datepicker',
          `datepicker--${size}`,
          isOpen && 'datepicker--open',
          error && 'datepicker--error',
          disabled && 'datepicker--disabled'
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span
          className={classNames('datepicker__value', !selectedDate && 'datepicker__placeholder')}
        >
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <span className="datepicker__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className="datepicker__dropdown" role="dialog" aria-label="Choose date">
          <div className="datepicker__header">
            <button
              type="button"
              className="datepicker__nav-btn"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="datepicker__month-year">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              className="datepicker__nav-btn"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
          <div className="datepicker__weekdays">
            {DAYS.map((day) => (
              <span key={day} className="datepicker__weekday">
                {day}
              </span>
            ))}
          </div>
          <div className="datepicker__days">
            {days.map(({ date, isCurrentMonth }, index) => (
              <button
                key={index}
                type="button"
                className={classNames(
                  'datepicker__day',
                  !isCurrentMonth && 'datepicker__day--outside',
                  isToday(date) && 'datepicker__day--today',
                  isSameDay(date, selectedDate) && 'datepicker__day--selected',
                  isDateDisabled(date) && 'datepicker__day--disabled'
                )}
                onClick={() => handleDateSelect(date)}
                disabled={isDateDisabled(date)}
                aria-label={date.toLocaleDateString()}
                aria-selected={isSameDay(date, selectedDate)}
              >
                {date.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <span id={`${pickerId}-error`} className="datepicker__error" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${pickerId}-helper`} className="datepicker__helper">
          {helperText}
        </span>
      )}
    </div>
  )
})

export default DatePicker
