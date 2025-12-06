import { forwardRef, useState } from 'react'
import { classNames } from '../../../utils'
import './SimilarListings.css'

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
    <section ref={ref} className={classNames('similar-listings', className)} {...props}>
      <div className="similar-listings__header">
        <h2 className="similar-listings__title">{title}</h2>
        {listings.length > displayCount && (
          <div className="similar-listings__nav">
            <button
              type="button"
              className="similar-listings__nav-btn"
              onClick={handlePrev}
              disabled={!canGoBack}
              aria-label="Previous"
            >
              ←
            </button>
            <button
              type="button"
              className="similar-listings__nav-btn"
              onClick={handleNext}
              disabled={!canGoForward}
              aria-label="Next"
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className="similar-listings__grid">
        {displayedListings.map((listing, index) => (
          <div
            key={listing.id}
            className="similar-listings__card"
            onClick={() => onListingClick?.(listing)}
          >
            <div className="similar-listings__card-image">
              {listing.image ? (
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="similar-listings__card-img"
                />
              ) : (
                <div
                  className={classNames(
                    'similar-listings__placeholder',
                    `similar-listings__placeholder--${(index % 4) + 1}`
                  )}
                >
                  🏠
                </div>
              )}
            </div>
            <div className="similar-listings__card-location">{listing.location}</div>
            <div className="similar-listings__card-title">{listing.title}</div>
            <div className="similar-listings__card-price">
              {listing.weeklyPrice} <span>/week</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
})

export default SimilarListings
