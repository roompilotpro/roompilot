import { forwardRef } from 'react'
import { classNames } from '../../../utils'

// Badge type configurations
const BADGE_CONFIG = {
  verified: { icon: '✓', label: 'Verified Host', colors: 'bg-primary-bg text-primary' },
  new: { icon: '✨', label: 'New Listing', colors: 'bg-accent-bg text-accent' },
  available: { icon: '✓', label: 'Available Now', colors: 'bg-accent-bg text-accent' },
  featured: { icon: '⭐', label: 'Featured', colors: 'bg-warm-bg text-warm' },
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
    <header
      ref={ref}
      className={classNames('pb-6 border-b border-cloud mb-8', className)}
      {...props}
    >
      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex gap-2 mb-3">
          {badges.map((badgeType) => {
            const config = BADGE_CONFIG[badgeType]
            if (!config) return null
            return (
              <span
                key={badgeType}
                className={classNames(
                  'inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-[13px] font-semibold',
                  config.colors
                )}
              >
                {config.icon} {config.label}
              </span>
            )
          })}
        </div>
      )}

      {/* Title */}
      <h1 className="font-display text-[32px] md:text-[26px] font-semibold text-midnight leading-tight mb-2">
        {title}
      </h1>

      {/* Location */}
      {location && (
        <div className="flex items-center gap-2 text-base text-slate mb-4">
          <svg
            className="shrink-0"
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
      <div className="flex items-center gap-4 md:gap-3 flex-wrap">
        {meta.roomType && (
          <div className="flex items-center gap-1.5 text-[15px] md:text-sm text-charcoal">
            <span className="text-lg">🛏️</span>
            {meta.roomType}
          </div>
        )}

        {meta.bathType && (
          <div className="flex items-center gap-1.5 text-[15px] md:text-sm text-charcoal">
            <span className="text-lg">🚿</span>
            {meta.bathType}
          </div>
        )}

        {meta.size && (
          <div className="flex items-center gap-1.5 text-[15px] md:text-sm text-charcoal">
            <span className="text-lg">📐</span>
            {meta.size}
          </div>
        )}

        {rating !== undefined && (
          <div className="flex items-center gap-1 text-[15px] md:text-sm text-charcoal font-semibold">
            <span className="text-warm">★</span>
            {rating.toFixed(2)}
            {reviewCount !== undefined && (
              <button
                type="button"
                className="text-slate font-normal underline cursor-pointer bg-transparent border-none font-body text-[inherit] p-0 hover:text-charcoal"
                onClick={onReviewsClick}
              >
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
