import { forwardRef } from 'react'
import { classNames } from '../../../utils'
import './AmenitiesGrid.css'

/**
 * AmenitiesGrid - Grid display of amenities with available/unavailable states
 *
 * @param {Object} props
 * @param {Array<{icon: string, label: string, available?: boolean}>} props.amenities - Amenity items
 * @param {number} props.totalCount - Total number of amenities (for button text)
 * @param {number} props.displayCount - Number of amenities to display (default: 10)
 * @param {Function} props.onShowAll - Callback when "Show all" button is clicked
 * @param {string} props.title - Section title
 * @param {string} props.className - Additional CSS class
 */
const AmenitiesGrid = forwardRef(function AmenitiesGrid(
  {
    amenities = [],
    totalCount,
    displayCount = 10,
    onShowAll,
    title = 'What this place offers',
    className,
    ...props
  },
  ref
) {
  const displayedAmenities = amenities.slice(0, displayCount)
  const total = totalCount || amenities.length
  const showAllButton = total > displayCount

  return (
    <section ref={ref} className={classNames('amenities-grid', className)} {...props}>
      <h2 className="amenities-grid__title">{title}</h2>

      <div className="amenities-grid__list">
        {displayedAmenities.map((amenity, index) => (
          <div
            key={index}
            className={classNames(
              'amenities-grid__item',
              amenity.available === false && 'amenities-grid__item--unavailable'
            )}
          >
            <span className="amenities-grid__icon">{amenity.icon}</span>
            {amenity.label}
          </div>
        ))}
      </div>

      {showAllButton && (
        <button type="button" className="amenities-grid__show-all" onClick={onShowAll}>
          Show all {total} amenities
        </button>
      )}
    </section>
  )
})

export default AmenitiesGrid
