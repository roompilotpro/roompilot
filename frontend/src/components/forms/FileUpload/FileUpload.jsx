import { forwardRef, useState, useRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import './FileUpload.css'

/**
 * FileUpload component with drag and drop support
 *
 * @param {Object} props
 * @param {Array<File>} [props.value=[]] - Selected files
 * @param {boolean} [props.multiple=false] - Allow multiple files
 * @param {string} [props.accept] - Accepted file types (e.g., "image/*,.pdf")
 * @param {number} [props.maxSize] - Maximum file size in bytes
 * @param {number} [props.maxFiles] - Maximum number of files
 * @param {string} [props.label] - Label text
 * @param {string} [props.helperText] - Helper text
 * @param {string} [props.error] - Error message
 * @param {boolean} [props.disabled=false] - Whether upload is disabled
 * @param {boolean} [props.showPreview=true] - Whether to show file previews
 * @param {Function} [props.onChange] - Change handler
 * @param {Function} [props.onRemove] - Remove file handler
 * @param {string} [props.id] - Upload ID
 * @param {string} [props.className] - Additional CSS classes
 */
const FileUpload = forwardRef(function FileUpload(
  {
    value = [],
    multiple = false,
    accept,
    maxSize,
    maxFiles,
    label,
    helperText,
    error,
    disabled = false,
    showPreview = true,
    onChange,
    onRemove,
    id,
    className,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const uploadId = id || generatedId
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [internalError, setInternalError] = useState(null)

  const displayError = error || internalError

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const validateFiles = (files) => {
    setInternalError(null)
    const validFiles = []

    for (const file of files) {
      if (maxSize && file.size > maxSize) {
        setInternalError(`File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}`)
        continue
      }
      validFiles.push(file)
    }

    if (maxFiles && value.length + validFiles.length > maxFiles) {
      setInternalError(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`)
      return validFiles.slice(0, maxFiles - value.length)
    }

    return validFiles
  }

  const handleFiles = (fileList) => {
    const files = Array.from(fileList)
    const validFiles = validateFiles(files)

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...value, ...validFiles] : validFiles
      onChange?.({ target: { files: newFiles } })
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
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

    if (disabled) return

    const files = e.dataTransfer?.files
    if (files?.length > 0) {
      handleFiles(files)
    }
  }

  const handleInputChange = (e) => {
    const files = e.target.files
    if (files?.length > 0) {
      handleFiles(files)
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  const handleRemove = (index) => {
    const newFiles = value.filter((_, i) => i !== index)
    onRemove?.(value[index], index)
    onChange?.({ target: { files: newFiles } })
  }

  const isImage = (file) => file.type.startsWith('image/')

  return (
    <div className={classNames('file-upload-wrapper', className)}>
      {label && <span className="file-upload__label">{label}</span>}
      <div
        ref={ref}
        className={classNames(
          'file-upload',
          isDragging && 'file-upload--dragging',
          disabled && 'file-upload--disabled',
          displayError && 'file-upload--error'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          id={uploadId}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className="file-upload__input"
          {...props}
        />
        <div className="file-upload__content">
          <span className="file-upload__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </span>
          <span className="file-upload__text">
            <strong>Click to upload</strong> or drag and drop
          </span>
          {accept && (
            <span className="file-upload__hint">
              {accept.replace(/\./g, '').toUpperCase().replace(/,/g, ', ')}
              {maxSize && ` (max ${formatFileSize(maxSize)})`}
            </span>
          )}
        </div>
      </div>

      {showPreview && value.length > 0 && (
        <div className="file-upload__preview">
          {value.map((file, index) => (
            <div key={index} className="file-upload__file">
              {isImage(file) ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="file-upload__thumbnail"
                />
              ) : (
                <span className="file-upload__file-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </span>
              )}
              <div className="file-upload__file-info">
                <span className="file-upload__file-name">{file.name}</span>
                <span className="file-upload__file-size">{formatFileSize(file.size)}</span>
              </div>
              <button
                type="button"
                className="file-upload__remove"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(index)
                }}
                aria-label={`Remove ${file.name}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {displayError && (
        <span className="file-upload__error" role="alert">
          {displayError}
        </span>
      )}
      {helperText && !displayError && <span className="file-upload__helper">{helperText}</span>}
    </div>
  )
})

export default FileUpload
