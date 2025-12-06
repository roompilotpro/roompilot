import { forwardRef, useState } from 'react'
import { classNames } from '../../../utils/classNames'
import { Badge, Rating } from '../../primitives'
import './RoomListingCard.css'

/**
 * RoomListingCard - Search results listing card with gallery
 */
const RoomListingCard = forwardRef(function RoomListingCard(
  {
    images = [],
    badge,
    isFavorite = false,
    onFavoriteToggle,
    location,
    rating,
    title,
    details,
    amenities = [],
    weeklyPrice,
    monthlyPrice,
    onClick,
    className,
    ...props
  },
  ref
) {
  const [activeImage, setActiveImage] = useState(0)

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    onFavoriteToggle?.()
  }

  const badgeColorMap = {
    new: 'accent',
    verified: 'primary',
    available: 'success',
  }

  return (
    <article
      ref={ref}
      className={classNames('room-listing-card', className)}
      onClick={onClick}
      {...props}
    >
      {/* Image Gallery */}
      <div className="room-listing-card__gallery">
        {images.length > 0 ? (
          <img src={images[activeImage]} alt={title} className="room-listing-card__image" />
        ) : (
          <div className="room-listing-card__placeholder">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 21V7L12 2L21 7V21H15V14H9V21H3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <Badge color={badgeColorMap[badge] || 'default'} className="room-listing-card__badge">
            {badge.charAt(0).toUpperCase() + badge.slice(1)}
          </Badge>
        )}

        {/* Favorite Button */}
        {onFavoriteToggle && (
          <button
            type="button"
            className={classNames(
              'room-listing-card__favorite',
              isFavorite && 'room-listing-card__favorite--active'
            )}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        )}

        {/* Gallery Dots */}
        {images.length > 1 && (
          <div className="room-listing-card__dots">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={classNames(
                  'room-listing-card__dot',
                  index === activeImage && 'room-listing-card__dot--active'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveImage(index)
                }}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="room-listing-card__content">
        <div className="room-listing-card__header">
          <span className="room-listing-card__location">{location}</span>
          {rating && <Rating value={rating} size="sm" />}
        </div>

        <h3 className="room-listing-card__title">{title}</h3>

        {details && <p className="room-listing-card__details">{details}</p>}

        {amenities.length > 0 && (
          <div className="room-listing-card__amenities">
            {amenities.slice(0, 4).map((amenity, index) => (
              <span key={index} className="room-listing-card__amenity">
                {amenity}
              </span>
            ))}
          </div>
        )}

        <div className="room-listing-card__price">
          <span className="room-listing-card__price-value">{weeklyPrice}</span>
          <span className="room-listing-card__price-period">/week</span>
          {monthlyPrice && (
            <span className="room-listing-card__price-monthly">{monthlyPrice}/mo</span>
          )}
        </div>
      </div>
    </article>
  )
})

export default RoomListingCard
