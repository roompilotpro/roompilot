import { forwardRef, useState } from 'react'
import { classNames } from '../../../utils/classNames'
import { Badge, Rating } from '../../primitives'

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
      className={classNames(
        'bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {/* Image Gallery */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        {images.length > 0 ? (
          <img
            src={images[activeImage]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-cloud flex items-center justify-center text-slate">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="w-12 h-12">
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
          <Badge
            color={badgeColorMap[badge] || 'default'}
            className="absolute top-3 left-3 shadow-md"
          >
            {badge.charAt(0).toUpperCase() + badge.slice(1)}
          </Badge>
        )}

        {/* Favorite Button */}
        {onFavoriteToggle && (
          <button
            type="button"
            className={classNames(
              'absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm border-none rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 text-slate hover:bg-white hover:scale-110',
              isFavorite && 'text-coral'
            )}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isFavorite ? 'currentColor' : 'none'}
              aria-hidden="true"
              className="w-[18px] h-[18px]"
            >
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
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={classNames(
                  'w-1.5 h-1.5 p-0 border-none rounded-full bg-white/50 cursor-pointer transition-all duration-150 hover:bg-white/80',
                  index === activeImage && 'bg-white w-[18px] rounded-sm'
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
      <div className="p-4 px-1">
        <div className="flex justify-between items-start mb-1">
          <span className="text-sm font-semibold text-charcoal">{location}</span>
          {rating && <Rating value={rating} size="sm" />}
        </div>

        <h3 className="m-0 mb-1 text-sm font-normal text-slate whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </h3>

        {details && <p className="m-0 mb-2 text-xs text-slate">{details}</p>}

        {amenities.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-3 sm:hidden">
            {amenities.slice(0, 4).map((amenity, index) => (
              <span
                key={index}
                className="inline-flex items-center py-1 px-2 bg-snow rounded-sm text-xs text-slate"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-baseline gap-1">
          <span className="font-display text-lg font-bold text-charcoal">{weeklyPrice}</span>
          <span className="text-sm text-slate">/week</span>
          {monthlyPrice && <span className="text-xs text-slate ml-auto">{monthlyPrice}/mo</span>}
        </div>
      </div>
    </article>
  )
})

export default RoomListingCard
