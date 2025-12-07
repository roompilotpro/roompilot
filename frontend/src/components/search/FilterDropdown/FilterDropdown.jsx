import { useRef, useEffect } from 'react'
import { classNames } from '../../../utils/classNames'
import { Button } from '../../primitives'
import { RangeSlider, Checkbox } from '../../forms'
import { useClickOutside } from '../../../hooks'

// Animation styles
const dropdownStyles = `
  @keyframes filterDropdownFade {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .filter-dropdown-animate { animation: filterDropdownFade 0.2s ease; }
`

/**
 * FilterDropdown - Dropdown panel for search filters
 * Supports different filter types: price, roomType, amenities
 */
function FilterDropdown({
  type,
  value,
  onChange,
  onClose,
  onApply,
  onClear,
  isOpen,
  className,
  ...props
}) {
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
    <>
      <style>{dropdownStyles}</style>
      <div
        ref={dropdownRef}
        className={classNames(
          'absolute top-[calc(100%+8px)] left-0 bg-white rounded-lg shadow-xl border border-cloud p-6 min-w-[320px] z-50 filter-dropdown-animate',
          className
        )}
        {...props}
      >
        <div className="text-base font-semibold text-charcoal mb-4">{getTitle()}</div>
        <div className="mb-5">{renderContent()}</div>
        <div className="flex justify-between items-center pt-5 border-t border-cloud">
          <button
            type="button"
            className="font-body text-sm font-medium text-slate bg-transparent border-none cursor-pointer underline p-0 hover:text-charcoal"
            onClick={onClear}
          >
            Clear
          </button>
          <Button variant="secondary" size="sm" onClick={onApply}>
            Apply
          </Button>
        </div>
      </div>
    </>
  )
}

// Price filter component
function PriceFilter({ value = { min: 0, max: 500 }, onChange }) {
  const handleChange = (newValue) => {
    onChange?.(newValue)
  }

  return (
    <div>
      <div className="flex gap-3 mb-5">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate mb-1.5">Minimum</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate">$</span>
            <input
              type="number"
              value={value.min || ''}
              onChange={(e) => handleChange({ ...value, min: Number(e.target.value) })}
              placeholder="0"
              className="w-full py-3 pl-6 pr-3 border border-cloud rounded-md font-body text-base text-charcoal transition-all duration-200 focus:outline-none focus:border-primary focus:shadow-focus"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate mb-1.5">Maximum</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate">$</span>
            <input
              type="number"
              value={value.max || ''}
              onChange={(e) => handleChange({ ...value, max: Number(e.target.value) })}
              placeholder="500"
              className="w-full py-3 pl-6 pr-3 border border-cloud rounded-md font-body text-base text-charcoal transition-all duration-200 focus:outline-none focus:border-primary focus:shadow-focus"
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
      <div className="flex justify-between text-xs text-slate mt-2">
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
    <div className="flex flex-col gap-3">
      {roomTypes.map((type) => {
        const isSelected = value.includes(type.id)
        return (
          <div
            key={type.id}
            className={classNames(
              'flex items-center gap-3 p-3 bg-snow rounded-md cursor-pointer transition-all duration-200 hover:bg-cloud',
              isSelected && 'bg-primary-bg border border-primary'
            )}
            onClick={() => handleToggle(type.id)}
          >
            <div
              className={classNames(
                'w-5 h-5 border-2 border-cloud rounded flex items-center justify-center transition-all duration-200 text-xs text-white',
                isSelected && 'bg-primary border-primary'
              )}
            >
              {isSelected && '✓'}
            </div>
            <span className="text-sm font-medium text-charcoal">{type.label}</span>
          </div>
        )
      })}
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
    <div className="grid grid-cols-2 gap-3">
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
