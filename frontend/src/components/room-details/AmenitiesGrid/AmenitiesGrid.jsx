import { forwardRef } from 'react'
import { classNames } from '../../../utils'

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
    <section ref={ref} className={classNames('py-8 border-b border-cloud', className)} {...props}>
      <h2 className="font-display text-[22px] font-semibold text-midnight mb-5">{title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
        {displayedAmenities.map((amenity, index) => (
          <div
            key={index}
            className={classNames(
              'flex items-center gap-3 text-[15px] text-charcoal',
              amenity.available === false && 'text-slate line-through'
            )}
          >
            <span className="w-8 h-8 flex items-center justify-center text-xl shrink-0">
              {amenity.icon}
            </span>
            {amenity.label}
          </div>
        ))}
      </div>

      {showAllButton && (
        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-6 font-body text-[15px] font-semibold no-underline rounded-md cursor-pointer transition-all duration-200 bg-transparent text-charcoal border-2 border-cloud hover:border-charcoal hover:bg-snow"
          onClick={onShowAll}
        >
          Show all {total} amenities
        </button>
      )}
    </section>
  )
})

export default AmenitiesGrid
