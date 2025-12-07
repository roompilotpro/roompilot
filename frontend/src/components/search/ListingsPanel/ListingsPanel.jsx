import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { RoomListingCard } from '../../cards'
import { Pagination } from '../../navigation'
import { Select } from '../../forms'

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
]

/**
 * ListingsPanel - Container for search results with header, grid, and pagination
 */
const ListingsPanel = forwardRef(function ListingsPanel(
  {
    listings = [],
    totalCount = 0,
    location = '',
    sortBy = 'recommended',
    onSortChange,
    page = 1,
    totalPages = 1,
    onPageChange,
    onListingClick,
    onListingFavorite,
    hoveredListingId,
    className,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={classNames(
        'flex-1 max-w-[840px] lg:max-w-none overflow-y-auto bg-white',
        className
      )}
      {...props}
    >
      <header className="py-5 px-6 border-b border-cloud sticky top-0 bg-white z-10">
        <div className="text-sm text-slate">
          <strong className="text-charcoal font-semibold">{totalCount} rooms</strong> available
          {location && ` in ${location}`}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-slate">Sort by:</span>
          <select
            className="font-body text-xs font-medium text-charcoal bg-transparent border-none cursor-pointer py-1"
            value={sortBy}
            onChange={(e) => onSortChange?.(e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {listings.length > 0 ? (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-6 md:gap-4 p-6 md:p-4">
            {listings.map((listing) => (
              <RoomListingCard
                key={listing.id}
                images={listing.images}
                badge={listing.badge}
                isFavorite={listing.isFavorite}
                location={listing.location}
                rating={listing.rating}
                title={listing.title}
                details={listing.details}
                amenities={listing.amenities}
                weeklyPrice={listing.weeklyPrice}
                monthlyPrice={listing.monthlyPrice}
                onClick={() => onListingClick?.(listing)}
                onFavoriteClick={() => onListingFavorite?.(listing)}
                className={classNames(
                  hoveredListingId === listing.id && '-translate-y-1 shadow-lg'
                )}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="p-6 flex justify-center border-t border-cloud">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
          )}
        </>
      ) : (
        <div className="py-20 px-10 text-center">
          <div className="text-[64px] mb-6 opacity-40">🔍</div>
          <h3 className="font-display text-2xl font-semibold text-charcoal mb-2">No rooms found</h3>
          <p className="text-base text-slate max-w-[400px] mx-auto">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
})

export default ListingsPanel
