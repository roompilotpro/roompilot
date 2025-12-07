import { forwardRef } from 'react'
import { classNames } from '../../../utils'

/**
 * ReviewItem - Individual review card
 */
function ReviewItem({ review, isLast }) {
  const { author, avatar, date, rating, text } = review
  const initial = author?.charAt(0).toUpperCase() || '?'

  // Generate stars based on rating
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))

  return (
    <div className={classNames('pb-6', !isLast && 'border-b border-cloud')}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full bg-cloud flex items-center justify-center font-semibold text-slate shrink-0 overflow-hidden">
          {avatar ? (
            <img src={avatar} alt={author} className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-semibold text-charcoal">{author}</div>
          <div className="text-[13px] text-slate">{date}</div>
        </div>
        <div className="text-warm text-sm tracking-wide">{stars}</div>
      </div>
      <p className="text-[15px] leading-relaxed text-slate">{text}</p>
    </div>
  )
}

/**
 * ReviewsSection - Reviews summary, category bars, and review list
 *
 * @param {Object} props
 * @param {number} props.score - Overall review score
 * @param {number} props.totalCount - Total number of reviews
 * @param {Array<{label: string, value: number}>} props.categories - Category ratings (value 0-5)
 * @param {Array<{author: string, avatar?: string, date: string, rating: number, text: string}>} props.reviews - Review items
 * @param {number} props.displayCount - Number of reviews to display
 * @param {Function} props.onShowAll - Callback when "Show all" button is clicked
 * @param {string} props.title - Section title
 * @param {string} props.className - Additional CSS class
 */
const ReviewsSection = forwardRef(function ReviewsSection(
  {
    score,
    totalCount,
    categories = [],
    reviews = [],
    displayCount = 3,
    onShowAll,
    title = 'Reviews',
    className,
    ...props
  },
  ref
) {
  const displayedReviews = reviews.slice(0, displayCount)
  const showAllButton = totalCount > displayCount

  // Generate stars based on score
  const fullStars = Math.floor(score || 0)
  const starsDisplay = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars)

  return (
    <section
      ref={ref}
      className={classNames('py-8 border-b border-cloud last:border-b-0', className)}
      {...props}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-[22px] font-semibold text-midnight">{title}</h2>
      </div>

      {/* Summary */}
      {score !== undefined && (
        <div className="flex items-center gap-2 mb-6">
          <span className="font-display text-[28px] font-bold text-midnight">
            {score.toFixed(2)}
          </span>
          <span className="text-warm text-lg tracking-widest">{starsDisplay}</span>
          {totalCount !== undefined && (
            <span className="text-[15px] text-slate">· {totalCount} reviews</span>
          )}
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 mb-8">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-slate">{category.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-[100px] md:w-20 h-1 bg-cloud rounded overflow-hidden">
                  <div
                    className="h-full bg-charcoal rounded transition-[width] duration-300"
                    style={{ width: `${(category.value / 5) * 100}%` }}
                  />
                </div>
                <span className="text-[13px] font-semibold text-charcoal min-w-6">
                  {category.value.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews list */}
      {displayedReviews.length > 0 && (
        <div className="grid gap-6">
          {displayedReviews.map((review, index) => (
            <ReviewItem
              key={index}
              review={review}
              isLast={index === displayedReviews.length - 1}
            />
          ))}
        </div>
      )}

      {/* Show all button */}
      {showAllButton && (
        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-6 font-body text-[15px] font-semibold no-underline rounded-md cursor-pointer transition-all duration-200 bg-transparent text-charcoal border-2 border-cloud hover:border-charcoal hover:bg-snow"
          onClick={onShowAll}
        >
          Show all {totalCount} reviews
        </button>
      )}
    </section>
  )
})

export default ReviewsSection
