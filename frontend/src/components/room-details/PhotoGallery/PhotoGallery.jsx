import { forwardRef } from 'react'
import { classNames } from '../../../utils'
import './PhotoGallery.css'

// Default placeholder icons for demo
const DEFAULT_PLACEHOLDERS = ['🛏️', '🪟', '🚿', '🍳', '🏠']

/**
 * PhotoGallery - 5-image grid gallery for room details
 *
 * @param {Object} props
 * @param {Array<{src?: string, alt?: string, icon?: string}>} props.images - Array of image objects
 * @param {Function} props.onShowAll - Callback when "Show all photos" is clicked
 * @param {number} props.totalCount - Total number of photos (for button text)
 * @param {string} props.className - Additional CSS class
 */
const PhotoGallery = forwardRef(function PhotoGallery(
  { images = [], onShowAll, totalCount, className, ...props },
  ref
) {
  // Fill with placeholders if not enough images
  const displayImages =
    images.length > 0 ? images : DEFAULT_PLACEHOLDERS.map((icon) => ({ icon }))

  // Take first 5 images
  const galleryImages = displayImages.slice(0, 5)

  const handleGridClick = () => {
    onShowAll?.()
  }

  return (
    <section ref={ref} className={classNames('photo-gallery', className)} {...props}>
      <div className="photo-gallery__grid" onClick={handleGridClick}>
        {galleryImages.map((image, index) => (
          <div key={index} className="photo-gallery__item">
            {image.src ? (
              <img
                src={image.src}
                alt={image.alt || `Photo ${index + 1}`}
                className="photo-gallery__image"
              />
            ) : (
              <div
                className={classNames(
                  'photo-gallery__placeholder',
                  `photo-gallery__placeholder--${index + 1}`
                )}
              >
                {image.icon || DEFAULT_PLACEHOLDERS[index]}
              </div>
            )}
            <div className="photo-gallery__overlay" />

            {/* Show all button on last image */}
            {index === galleryImages.length - 1 && (
              <button
                type="button"
                className="photo-gallery__show-all"
                onClick={(e) => {
                  e.stopPropagation()
                  onShowAll?.()
                }}
              >
                <span className="photo-gallery__show-all-icon">⊞</span>
                Show all photos{totalCount ? ` (${totalCount})` : ''}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  )
})

export default PhotoGallery
