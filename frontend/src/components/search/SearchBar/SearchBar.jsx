import { forwardRef, useState } from 'react'
import { classNames } from '../../../utils/classNames'

/**
 * SearchBar - Pill-shaped search input with location + date + search button
 * Used in the search page navigation
 */
const SearchBar = forwardRef(function SearchBar(
  { location = '', date = '', onLocationChange, onDateChange, onSearch, className, ...props },
  ref
) {
  const [locationValue, setLocationValue] = useState(location)
  const [dateValue, setDateValue] = useState(date)

  const handleLocationChange = (e) => {
    const value = e.target.value
    setLocationValue(value)
    onLocationChange?.(value)
  }

  const handleDateChange = (e) => {
    const value = e.target.value
    setDateValue(value)
    onDateChange?.(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.({ location: locationValue, date: dateValue })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <form
      ref={ref}
      className={classNames(
        'flex items-center bg-snow border border-cloud rounded-full py-1.5 pl-5 pr-1.5 gap-2 transition-all duration-200 min-w-[400px] md:min-w-0 md:w-full',
        'focus-within:bg-white focus-within:border-primary focus-within:shadow-[0_0_0_3px_var(--color-primary-bg)]',
        className
      )}
      onSubmit={handleSubmit}
      {...props}
    >
      <input
        type="text"
        className="flex-[1.5] border-none bg-transparent font-body text-base text-charcoal outline-none min-w-0 placeholder:text-slate"
        placeholder="City, neighborhood..."
        value={locationValue}
        onChange={handleLocationChange}
        onKeyDown={handleKeyDown}
        aria-label="Location"
      />
      <span className="w-px h-6 bg-cloud shrink-0 md:hidden" aria-hidden="true" />
      <input
        type="text"
        className="flex-1 max-w-[120px] border-none bg-transparent font-body text-base text-charcoal outline-none min-w-0 placeholder:text-slate md:hidden"
        placeholder="Move-in date"
        value={dateValue}
        onChange={handleDateChange}
        onKeyDown={handleKeyDown}
        aria-label="Move-in date"
      />
      <button
        type="submit"
        className="w-10 h-10 rounded-full bg-primary border-none text-white flex items-center justify-center cursor-pointer transition-all duration-200 shrink-0 hover:bg-primary-dark hover:scale-105 active:scale-[0.98]"
        aria-label="Search"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  )
})

export default SearchBar
