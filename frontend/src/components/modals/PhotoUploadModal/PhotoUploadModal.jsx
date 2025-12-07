import { forwardRef, useState, useRef } from 'react'
import ModalBase from '../ModalBase'
import { Button, IconButton } from '../../primitives'
import classNames from '../../../utils/classNames'

/**
 * PhotoUploadModal - Drag and drop photo upload modal
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Callback when modal should close
 * @param {Function} onSave - Callback with photos array when saved
 * @param {Array} [initialPhotos=[]] - Initial photos array { id, src, isCover? }
 * @param {number} [minPhotos=1] - Minimum number of photos required
 * @param {number} [maxPhotos=10] - Maximum number of photos allowed
 * @param {number} [maxFileSize=5242880] - Maximum file size in bytes (default 5MB)
 * @param {Array} [acceptedFormats=['image/jpeg', 'image/png', 'image/webp']] - Accepted file formats
 * @param {Array} [infoItems] - Info items to display below dropzone
 * @param {string} [className] - Additional CSS classes
 */
const PhotoUploadModal = forwardRef(function PhotoUploadModal(
  {
    isOpen = false,
    onClose,
    onSave,
    initialPhotos = [],
    minPhotos = 1,
    maxPhotos = 10,
    maxFileSize = 5242880,
    acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
    infoItems,
    className,
    ...props
  },
  ref
) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  // Validate file
  const validateFile = (file) => {
    if (!acceptedFormats.includes(file.type)) {
      return 'Invalid file format. Please use JPG, PNG, or WebP.'
    }
    if (file.size > maxFileSize) {
      return `File too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB.`
    }
    return null
  }

  // Handle file selection
  const handleFiles = (files) => {
    const newPhotos = []
    let validationError = null

    for (const file of files) {
      if (photos.length + newPhotos.length >= maxPhotos) {
        validationError = `Maximum ${maxPhotos} photos allowed.`
        break
      }

      const fileError = validateFile(file)
      if (fileError) {
        validationError = fileError
        continue
      }

      const id = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      newPhotos.push({
        id,
        src: URL.createObjectURL(file),
        file,
        isCover: photos.length === 0 && newPhotos.length === 0,
      })
    }

    setError(validationError)
    if (newPhotos.length > 0) {
      setPhotos((prev) => [...prev, ...newPhotos])
    }
  }

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  // File input change
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
    e.target.value = '' // Reset input
  }

  // Delete photo
  const handleDelete = (id) => {
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id)
      // If deleted photo was cover, make first one cover
      if (filtered.length > 0 && !filtered.some((p) => p.isCover)) {
        filtered[0].isCover = true
      }
      return filtered
    })
  }

  // Set cover photo
  const handleSetCover = (id) => {
    setPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        isCover: p.id === id,
      }))
    )
  }

  // Save photos
  const handleSave = () => {
    if (photos.length >= minPhotos && onSave) {
      onSave(photos)
    }
  }

  const isValid = photos.length >= minPhotos

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSave} disabled={!isValid}>
        Save Photos
      </Button>
    </>
  )

  return (
    <ModalBase
      ref={ref}
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Photos"
      subtitle={`Add up to ${maxPhotos} photos`}
      footer={footer}
      size="lg"
      className={className}
      {...props}
    >
      {/* Dropzone */}
      <div
        className={classNames(
          'border-2 border-dashed border-cloud rounded-lg py-10 px-6 text-center cursor-pointer transition-all duration-200 bg-snow hover:border-primary/50 hover:bg-primary-bg/50 sm:py-6',
          isDragging && 'border-primary bg-primary-bg'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload photos"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          aria-hidden="true"
        />
        <div className="w-12 h-12 mx-auto mb-4 text-slate [&>svg]:w-full [&>svg]:h-full">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 16l4-4 4 4m8-4l-3-3-3 3M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-base text-charcoal m-0 mb-1">
          <strong className="text-primary">Click to upload</strong> or drag and drop
        </p>
        <p className="text-sm text-slate m-0">
          JPG, PNG or WebP (max {Math.round(maxFileSize / 1024 / 1024)}MB)
        </p>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-coral mt-3 py-2 px-3 bg-coral-bg rounded-md m-0">{error}</p>
      )}

      {/* Info items */}
      {infoItems && infoItems.length > 0 && (
        <ul className="mt-4 p-0 list-none">
          {infoItems.map((item, index) => (
            <li
              key={index}
              className="text-sm text-slate py-1 pl-5 relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-slate/50"
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-5 sm:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square rounded-md overflow-hidden group">
              <img src={photo.src} alt="" className="w-full h-full object-cover" />
              {photo.isCover && (
                <span className="absolute top-2 left-2 bg-primary text-white py-1 px-2 rounded-sm text-xs font-semibold">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 flex items-center justify-center gap-2 transition-opacity duration-200 group-hover:opacity-100">
                {!photo.isCover && (
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetCover(photo.id)}
                    label="Set as cover"
                    className="text-white bg-white/20 hover:bg-white/30"
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </IconButton>
                )}
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(photo.id)}
                  label="Delete photo"
                  className="text-white bg-white/20 hover:bg-white/30"
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo count */}
      {photos.length > 0 && (
        <p className="text-sm text-slate mt-3 text-center m-0">
          {photos.length} of {maxPhotos} photos
          {photos.length < minPhotos && (
            <span className="text-warm"> (minimum {minPhotos} required)</span>
          )}
        </p>
      )}
    </ModalBase>
  )
})

export default PhotoUploadModal
