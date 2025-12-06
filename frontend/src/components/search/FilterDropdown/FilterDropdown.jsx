import { useRef, useEffect } from 'react'
import { classNames } from '../../../utils/classNames'
import { Button } from '../../primitives'
import { RangeSlider, Checkbox } from '../../forms'
import { useClickOutside } from '../../../hooks'
import './FilterDropdown.css'

/**
 * FilterDropdown - Dropdown panel for search filters
 * Supports different filter types: price, roomType, amenities
 */
function FilterDropdown({ type, value, onChange, onClose, onApply, onClear, isOpen, className, ...props }) {
  const dropdownRef = useRef(null)

  useClickOutside(dropdownRef, () => {
    if (isOpen) {
      onClose?.()
    }
  })

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const renderContent = () => {
    switch (type) {
      case 'price':
        return <PriceFilter value={value} onChange={onChange} />
      case 'roomType':
        return <RoomTypeFilter value={value} onChange={onChange} />
      case 'amenities':
        return <AmenitiesFilter value={value} onChange={onChange} />
      default:
        return null
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'price':
        return 'Price range'
      case 'roomType':
        return 'Room type'
      case 'amenities':
        return 'Amenities'
      default:
        return 'Filter'
    }
  }

  return (
    <div
      ref={dropdownRef}
      className={classNames('filter-dropdown', isOpen && 'filter-dropdown--open', className)}
      {...props}
    >
      <div className="filter-dropdown__title">{getTitle()}</div>
      <div className="filter-dropdown__content">{renderContent()}</div>
      <div className="filter-dropdown__actions">
        <button type="button" className="filter-dropdown__clear" onClick={onClear}>
          Clear
        </button>
        <Button variant="secondary" size="sm" onClick={onApply}>
          Apply
        </Button>
      </div>
    </div>
  )
}

// Price filter component
function PriceFilter({ value = { min: 0, max: 500 }, onChange }) {
  const handleChange = (newValue) => {
    onChange?.(newValue)
  }

  return (
    <div className="filter-dropdown__price">
      <div className="filter-dropdown__price-inputs">
        <div className="filter-dropdown__price-input">
          <label>Minimum</label>
          <div className="filter-dropdown__price-field">
            <span className="filter-dropdown__price-currency">$</span>
            <input
              type="number"
              value={value.min || ''}
              onChange={(e) => handleChange({ ...value, min: Number(e.target.value) })}
              placeholder="0"
            />
          </div>
        </div>
        <div className="filter-dropdown__price-input">
          <label>Maximum</label>
          <div className="filter-dropdown__price-field">
            <span className="filter-dropdown__price-currency">$</span>
            <input
              type="number"
              value={value.max || ''}
              onChange={(e) => handleChange({ ...value, max: Number(e.target.value) })}
              placeholder="500"
            />
          </div>
        </div>
      </div>
      <RangeSlider
        min={0}
        max={500}
        value={[value.min || 0, value.max || 500]}
        onChange={([min, max]) => handleChange({ min, max })}
        showValue={false}
      />
      <div className="filter-dropdown__price-labels">
        <span>$0/week</span>
        <span>$500+/week</span>
      </div>
    </div>
  )
}

// Room type filter component
function RoomTypeFilter({ value = [], onChange }) {
  const roomTypes = [
    { id: 'private', label: 'Private room' },
    { id: 'shared', label: 'Shared room' },
    { id: 'entire', label: 'Entire place' },
  ]

  const handleToggle = (id) => {
    const newValue = value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    onChange?.(newValue)
  }

  return (
    <div className="filter-dropdown__options">
      {roomTypes.map((type) => (
        <div
          key={type.id}
          className={classNames(
            'filter-dropdown__option',
            value.includes(type.id) && 'filter-dropdown__option--selected'
          )}
          onClick={() => handleToggle(type.id)}
        >
          <div className="filter-dropdown__option-checkbox">{value.includes(type.id) && '✓'}</div>
          <span className="filter-dropdown__option-label">{type.label}</span>
        </div>
      ))}
    </div>
  )
}

// Amenities filter component
function AmenitiesFilter({ value = [], onChange }) {
  const amenities = [
    { id: 'wifi', label: 'WiFi', icon: '📶' },
    { id: 'ac', label: 'Air conditioning', icon: '❄️' },
    { id: 'laundry', label: 'Washer/Dryer', icon: '🧺' },
    { id: 'parking', label: 'Parking', icon: '🅿️' },
    { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
    { id: 'privateBath', label: 'Private bathroom', icon: '🚿' },
  ]

  const handleToggle = (id) => {
    const newValue = value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    onChange?.(newValue)
  }

  return (
    <div className="filter-dropdown__amenities">
      {amenities.map((amenity) => (
        <Checkbox
          key={amenity.id}
          checked={value.includes(amenity.id)}
          onChange={() => handleToggle(amenity.id)}
          label={`${amenity.icon} ${amenity.label}`}
        />
      ))}
    </div>
  )
}

export default FilterDropdown
