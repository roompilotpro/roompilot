import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { RoomListingCard } from '../../cards'
import { Pagination } from '../../navigation'
import { Select } from '../../forms'
import './ListingsPanel.css'

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
    <div ref={ref} className={classNames('listings-panel', className)} {...props}>
      <header className="listings-panel__header">
        <div className="listings-panel__count">
          <strong>{totalCount} rooms</strong> available{location && ` in ${location}`}
        </div>
        <div className="listings-panel__sort">
          <span className="listings-panel__sort-label">Sort by:</span>
          <select
            className="listings-panel__sort-select"
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
          <div className="listings-panel__grid">
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
                  hoveredListingId === listing.id && 'listings-panel__card--hovered'
                )}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="listings-panel__pagination">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
          )}
        </>
      ) : (
        <div className="listings-panel__empty">
          <div className="listings-panel__empty-icon">🔍</div>
          <h3 className="listings-panel__empty-title">No rooms found</h3>
          <p className="listings-panel__empty-text">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
})

export default ListingsPanel
