import { forwardRef, useState } from 'react'
import { classNames } from '../../../utils/classNames'
import './SearchBar.css'

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
      className={classNames('search-bar', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <input
        type="text"
        className="search-bar__input search-bar__input--location"
        placeholder="City, neighborhood..."
        value={locationValue}
        onChange={handleLocationChange}
        onKeyDown={handleKeyDown}
        aria-label="Location"
      />
      <span className="search-bar__divider" aria-hidden="true" />
      <input
        type="text"
        className="search-bar__input search-bar__input--date"
        placeholder="Move-in date"
        value={dateValue}
        onChange={handleDateChange}
        onKeyDown={handleKeyDown}
        aria-label="Move-in date"
      />
      <button type="submit" className="search-bar__btn" aria-label="Search">
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
