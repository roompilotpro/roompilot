import { forwardRef } from 'react'
import { classNames } from '../../../utils'

// Default placeholder icons for demo
const DEFAULT_PLACEHOLDERS = ['🛏️', '🪟', '🚿', '🍳', '🏠']

// Placeholder gradients
const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
  'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
  'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
  'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
]

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
  const displayImages = images.length > 0 ? images : DEFAULT_PLACEHOLDERS.map((icon) => ({ icon }))

  // Take first 5 images
  const galleryImages = displayImages.slice(0, 5)

  const handleGridClick = () => {
    onShowAll?.()
  }

  return (
    <section
      ref={ref}
      className={classNames('mt-[var(--nav-height)] py-6 px-10 md:py-4 md:px-5', className)}
      {...props}
    >
      <div
        className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-1 grid-rows-[repeat(2,220px)] md:grid-rows-[300px] gap-2 rounded-xl overflow-hidden cursor-pointer group"
        onClick={handleGridClick}
      >
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className={classNames(
              'relative overflow-hidden',
              index === 0 && 'row-span-2 md:row-span-1',
              index > 0 && 'md:hidden'
            )}
          >
            {image.src ? (
              <img
                src={image.src}
                alt={image.alt || `Photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.02] hover:!scale-105"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-[48px] transition-transform duration-[400ms] group-hover:scale-[1.02] hover:!scale-105"
                style={{ background: PLACEHOLDER_GRADIENTS[index] }}
              >
                {image.icon || DEFAULT_PLACEHOLDERS[index]}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />

            {/* Show all button on last image */}
            {index === galleryImages.length - 1 && (
              <button
                type="button"
                className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 py-2.5 px-4 bg-white border-none rounded-md font-body text-sm font-semibold text-charcoal cursor-pointer shadow-md transition-all duration-200 hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation()
                  onShowAll?.()
                }}
              >
                <span className="text-base">⊞</span>
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
