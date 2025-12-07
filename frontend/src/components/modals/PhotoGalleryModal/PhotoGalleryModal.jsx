import { forwardRef, useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { IconButton } from '../../primitives'
import classNames from '../../../utils/classNames'

// Fade-in animation for gallery
const galleryStyles = `
  @keyframes fadeInGallery { from { opacity: 0; } to { opacity: 1; } }
  .gallery-animate { animation: fadeInGallery 0.2s ease; }
`

/**
 * PhotoGalleryModal - Full-screen image gallery with navigation
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Callback when modal should close
 * @param {Array} images - Array of image objects { id, src, caption?, thumbnail? }
 * @param {number} [initialIndex=0] - Initial image index to display
 * @param {boolean} [showThumbnails=true] - Show thumbnail strip
 * @param {Function} [onNavigate] - Callback when navigating (receives index)
 * @param {Array} [actions] - Array of action buttons { icon, label, onClick }
 * @param {string} [className] - Additional CSS classes
 */
const PhotoGalleryModal = forwardRef(function PhotoGalleryModal(
  {
    isOpen = false,
    onClose,
    images = [],
    initialIndex = 0,
    showThumbnails = true,
    onNavigate,
    actions,
    className,
    ...props
  },
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const prevOpenRef = useRef(false)

  // Reset to initial index when modal opens
  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      // Schedule state update on next tick to avoid synchronous setState in effect
      const timer = setTimeout(() => setCurrentIndex(initialIndex), 0)
      return () => clearTimeout(timer)
    }
    prevOpenRef.current = isOpen
  }, [isOpen, initialIndex])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : images.length - 1
      onNavigate?.(newIndex)
      return newIndex
    })
  }, [images.length, onNavigate])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev < images.length - 1 ? prev + 1 : 0
      onNavigate?.(newIndex)
      return newIndex
    })
  }, [images.length, onNavigate])

  const goToIndex = (index) => {
    setCurrentIndex(index)
    onNavigate?.(index)
  }

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'ArrowLeft') {
        goToPrevious()
      } else if (event.key === 'ArrowRight') {
        goToNext()
      }
    },
    [onClose, goToPrevious, goToNext]
  )

  // Add/remove keydown listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]

  const content = (
    <>
      <style>{galleryStyles}</style>
      <div
        ref={ref}
        className={classNames(
          'gallery-animate fixed inset-0 z-[9999] bg-midnight/95 flex flex-col',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Photo gallery"
        {...props}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 text-white sm:px-4 sm:py-3">
          <span className="text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
          <div className="flex gap-2">
            {actions?.map((action, index) => (
              <IconButton
                key={index}
                variant="ghost"
                onClick={action.onClick}
                label={action.label}
                className="text-white hover:bg-white/10"
              >
                {action.icon}
              </IconButton>
            ))}
            <IconButton
              variant="ghost"
              onClick={onClose}
              label="Close gallery"
              className="text-white hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </IconButton>
          </div>
        </div>

        {/* Main image */}
        <div className="flex-1 flex items-center justify-center relative px-16 min-h-0 sm:px-4">
          {images.length > 1 && (
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 border-none text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-white/20 sm:w-10 sm:h-10 sm:left-2 [&>svg]:w-6 [&>svg]:h-6 sm:[&>svg]:w-5 sm:[&>svg]:h-5"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M15 19l-7-7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          <img
            className="max-w-full max-h-full object-contain select-none"
            src={currentImage.src}
            alt={currentImage.caption || `Image ${currentIndex + 1}`}
          />

          {images.length > 1 && (
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 border-none text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-white/20 sm:w-10 sm:h-10 sm:right-2 [&>svg]:w-6 [&>svg]:h-6 sm:[&>svg]:w-5 sm:[&>svg]:h-5"
              onClick={goToNext}
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Caption */}
        {currentImage.caption && (
          <div className="text-center py-3 px-6 text-white text-sm">{currentImage.caption}</div>
        )}

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="flex gap-2 py-4 px-6 overflow-x-auto justify-center sm:py-3 sm:px-4 sm:justify-start">
            {images.map((image, index) => (
              <button
                key={image.id || index}
                className={classNames(
                  'shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 border-transparent cursor-pointer p-0 bg-transparent opacity-60 transition-all duration-200 hover:opacity-80 sm:w-12 sm:h-12',
                  index === currentIndex && 'opacity-100 border-white'
                )}
                onClick={() => goToIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : undefined}
              >
                <img
                  src={image.thumbnail || image.src}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )

  return createPortal(content, document.body)
})

export default PhotoGalleryModal
