import { forwardRef } from 'react'
import { classNames } from '../../../utils'
import './ListingHeader.css'

// Badge type configurations
const BADGE_CONFIG = {
  verified: { icon: '✓', label: 'Verified Host', className: 'listing-header__badge--verified' },
  new: { icon: '✨', label: 'New Listing', className: 'listing-header__badge--new' },
  available: { icon: '✓', label: 'Available Now', className: 'listing-header__badge--available' },
  featured: { icon: '⭐', label: 'Featured', className: 'listing-header__badge--featured' },
}

/**
 * ListingHeader - Room listing header with badges, title, location, and meta info
 *
 * @param {Object} props
 * @param {Array<string>} props.badges - Array of badge types ('verified', 'new', 'available', 'featured')
 * @param {string} props.title - Listing title
 * @param {string} props.location - Location string
 * @param {Object} props.meta - Meta information object
 * @param {string} props.meta.roomType - Room type (e.g., "Private room")
 * @param {string} props.meta.bathType - Bath type (e.g., "Private bath")
 * @param {string} props.meta.size - Room size (e.g., "180 sq ft")
 * @param {number} props.rating - Rating value
 * @param {number} props.reviewCount - Number of reviews
 * @param {Function} props.onReviewsClick - Callback when reviews link is clicked
 * @param {string} props.className - Additional CSS class
 */
const ListingHeader = forwardRef(function ListingHeader(
  {
    badges = [],
    title,
    location,
    meta = {},
    rating,
    reviewCount,
    onReviewsClick,
    className,
    ...props
  },
  ref
) {
  return (
    <header ref={ref} className={classNames('listing-header', className)} {...props}>
      {/* Badges */}
      {badges.length > 0 && (
        <div className="listing-header__badges">
          {badges.map((badgeType) => {
            const config = BADGE_CONFIG[badgeType]
            if (!config) return null
            return (
              <span
                key={badgeType}
                className={classNames('listing-header__badge', config.className)}
              >
                {config.icon} {config.label}
              </span>
            )
          })}
        </div>
      )}

      {/* Title */}
      <h1 className="listing-header__title">{title}</h1>

      {/* Location */}
      {location && (
        <div className="listing-header__location">
          <svg
            className="listing-header__location-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {location}
        </div>
      )}

      {/* Meta row */}
      <div className="listing-header__meta">
        {meta.roomType && (
          <div className="listing-header__meta-item">
            <span className="listing-header__meta-icon">🛏️</span>
            {meta.roomType}
          </div>
        )}

        {meta.bathType && (
          <div className="listing-header__meta-item">
            <span className="listing-header__meta-icon">🚿</span>
            {meta.bathType}
          </div>
        )}

        {meta.size && (
          <div className="listing-header__meta-item">
            <span className="listing-header__meta-icon">📐</span>
            {meta.size}
          </div>
        )}

        {rating !== undefined && (
          <div className="listing-header__meta-item listing-header__rating">
            <span className="listing-header__rating-star">★</span>
            {rating.toFixed(2)}
            {reviewCount !== undefined && (
              <button type="button" className="listing-header__reviews" onClick={onReviewsClick}>
                ({reviewCount} reviews)
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
})

export default ListingHeader
