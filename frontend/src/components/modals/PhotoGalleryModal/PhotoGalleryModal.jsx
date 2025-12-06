import { forwardRef, useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { IconButton } from '../../primitives'
import classNames from '../../../utils/classNames'
import './PhotoGalleryModal.css'

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
    <div
      ref={ref}
      className={classNames('photo-gallery-modal', className)}
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      {...props}
    >
      {/* Header */}
      <div className="photo-gallery-modal__header">
        <span className="photo-gallery-modal__counter">
          {currentIndex + 1} / {images.length}
        </span>
        <div className="photo-gallery-modal__actions">
          {actions?.map((action, index) => (
            <IconButton
              key={index}
              variant="ghost"
              onClick={action.onClick}
              label={action.label}
              className="photo-gallery-modal__action"
            >
              {action.icon}
            </IconButton>
          ))}
          <IconButton
            variant="ghost"
            onClick={onClose}
            label="Close gallery"
            className="photo-gallery-modal__close"
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
      <div className="photo-gallery-modal__main">
        {images.length > 1 && (
          <button
            className="photo-gallery-modal__nav photo-gallery-modal__nav--prev"
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
          className="photo-gallery-modal__image"
          src={currentImage.src}
          alt={currentImage.caption || `Image ${currentIndex + 1}`}
        />

        {images.length > 1 && (
          <button
            className="photo-gallery-modal__nav photo-gallery-modal__nav--next"
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
        <div className="photo-gallery-modal__caption">{currentImage.caption}</div>
      )}

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="photo-gallery-modal__thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              className={classNames(
                'photo-gallery-modal__thumb',
                index === currentIndex && 'photo-gallery-modal__thumb--active'
              )}
              onClick={() => goToIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : undefined}
            >
              <img src={image.thumbnail || image.src} alt="" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return createPortal(content, document.body)
})

export default PhotoGalleryModal
