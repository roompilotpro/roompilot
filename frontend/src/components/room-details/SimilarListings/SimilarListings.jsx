import { forwardRef, useState } from 'react'
import { classNames } from '../../../utils'

// Placeholder gradients
const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
  'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
  'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
]

/**
 * SimilarListings - Grid of similar room listings
 *
 * @param {Object} props
 * @param {Array<{id: string, image?: string, location: string, title: string, weeklyPrice: string}>} props.listings
 * @param {Function} props.onListingClick - Callback when a listing is clicked
 * @param {string} props.title - Section title
 * @param {string} props.className - Additional CSS class
 */
const SimilarListings = forwardRef(function SimilarListings(
  { listings = [], onListingClick, title = 'Similar rooms nearby', className, ...props },
  ref
) {
  const [startIndex, setStartIndex] = useState(0)
  const displayCount = 4

  const canGoBack = startIndex > 0
  const canGoForward = startIndex + displayCount < listings.length

  const displayedListings = listings.slice(startIndex, startIndex + displayCount)

  const handlePrev = () => {
    if (canGoBack) {
      setStartIndex(Math.max(0, startIndex - displayCount))
    }
  }

  const handleNext = () => {
    if (canGoForward) {
      setStartIndex(startIndex + displayCount)
    }
  }

  if (listings.length === 0) {
    return null
  }

  return (
    <section
      ref={ref}
      className={classNames(
        'max-w-[1200px] mx-auto py-15 md:py-10 px-10 md:px-5 border-t border-cloud',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-semibold text-midnight">{title}</h2>
        {listings.length > displayCount && (
          <div className="flex gap-2">
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white border border-cloud flex items-center justify-center cursor-pointer transition-all duration-200 text-lg text-charcoal hover:border-charcoal hover:bg-snow disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePrev}
              disabled={!canGoBack}
              aria-label="Previous"
            >
              ←
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white border border-cloud flex items-center justify-center cursor-pointer transition-all duration-200 text-lg text-charcoal hover:border-charcoal hover:bg-snow disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={!canGoForward}
              aria-label="Next"
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-6">
        {displayedListings.map((listing, index) => (
          <div
            key={listing.id}
            className="cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
            onClick={() => onListingClick?.(listing)}
          >
            <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3">
              {listing.image ? (
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-[32px] transition-transform duration-[400ms] group-hover:scale-105"
                  style={{ background: PLACEHOLDER_GRADIENTS[index % 4] }}
                >
                  🏠
                </div>
              )}
            </div>
            <div className="text-[15px] font-semibold text-charcoal mb-0.5">{listing.location}</div>
            <div className="text-sm text-slate mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {listing.title}
            </div>
            <div className="font-display text-base font-bold text-charcoal">
              {listing.weeklyPrice}{' '}
              <span className="font-body font-normal text-sm text-slate">/week</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
})

export default SimilarListings
