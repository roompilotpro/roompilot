import { forwardRef } from 'react'
import { classNames } from '../../../utils'
import './ReviewsSection.css'

/**
 * ReviewItem - Individual review card
 */
function ReviewItem({ review }) {
  const { author, avatar, date, rating, text } = review
  const initial = author?.charAt(0).toUpperCase() || '?'

  // Generate stars based on rating
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))

  return (
    <div className="review-item">
      <div className="review-item__header">
        <div className="review-item__avatar">
          {avatar ? (
            <img src={avatar} alt={author} className="review-item__avatar-image" />
          ) : (
            initial
          )}
        </div>
        <div className="review-item__author">
          <div className="review-item__author-name">{author}</div>
          <div className="review-item__date">{date}</div>
        </div>
        <div className="review-item__rating">{stars}</div>
      </div>
      <p className="review-item__text">{text}</p>
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
    <section ref={ref} className={classNames('reviews-section', className)} {...props}>
      <div className="reviews-section__header">
        <h2 className="reviews-section__title">{title}</h2>
      </div>

      {/* Summary */}
      {score !== undefined && (
        <div className="reviews-section__summary">
          <span className="reviews-section__score">{score.toFixed(2)}</span>
          <span className="reviews-section__stars">{starsDisplay}</span>
          {totalCount !== undefined && (
            <span className="reviews-section__count">· {totalCount} reviews</span>
          )}
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="reviews-section__categories">
          {categories.map((category, index) => (
            <div key={index} className="reviews-section__category">
              <span className="reviews-section__category-label">{category.label}</span>
              <div className="reviews-section__category-bar">
                <div className="reviews-section__category-track">
                  <div
                    className="reviews-section__category-fill"
                    style={{ width: `${(category.value / 5) * 100}%` }}
                  />
                </div>
                <span className="reviews-section__category-value">{category.value.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews list */}
      {displayedReviews.length > 0 && (
        <div className="reviews-section__list">
          {displayedReviews.map((review, index) => (
            <ReviewItem key={index} review={review} />
          ))}
        </div>
      )}

      {/* Show all button */}
      {showAllButton && (
        <button type="button" className="reviews-section__show-all" onClick={onShowAll}>
          Show all {totalCount} reviews
        </button>
      )}
    </section>
  )
})

export default ReviewsSection
