import { forwardRef, useState, useRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'

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
    <div className={classNames('flex flex-col gap-2', className)}>
      {label && <span className="font-body text-sm font-semibold text-midnight">{label}</span>}
      <div
        ref={ref}
        className={classNames(
          'flex flex-col items-center justify-center min-h-[160px] p-8 border-2 border-dashed rounded-md bg-white cursor-pointer transition-all duration-150 ease-out outline-none',
          isDragging && 'border-primary bg-primary-bg',
          !isDragging && !displayError && 'border-cloud hover:border-primary hover:bg-primary-bg',
          displayError && 'border-coral',
          disabled && 'bg-snow cursor-not-allowed opacity-60',
          'focus:border-primary focus:shadow-focus'
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
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
          {...props}
        />
        <div className="flex flex-col items-center text-center gap-2">
          <span
            className="flex items-center justify-center w-12 h-12 text-primary mb-2"
            aria-hidden="true"
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </span>
          <span className="font-body text-sm text-charcoal">
            <strong className="text-primary font-semibold">Click to upload</strong> or drag and drop
          </span>
          {accept && (
            <span className="font-body text-xs text-mist">
              {accept.replace(/\./g, '').toUpperCase().replace(/,/g, ', ')}
              {maxSize && ` (max ${formatFileSize(maxSize)})`}
            </span>
          )}
        </div>
      </div>

      {showPreview && value.length > 0 && (
        <div className="flex flex-col gap-2 mt-3">
          {value.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-snow rounded-sm">
              {isImage(file) ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded-sm"
                />
              ) : (
                <span className="flex items-center justify-center w-12 h-12 bg-cloud rounded-sm text-slate">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </span>
              )}
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="font-body text-sm font-medium text-charcoal truncate">
                  {file.name}
                </span>
                <span className="font-body text-xs text-mist">{formatFileSize(file.size)}</span>
              </div>
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 p-0 border-none bg-transparent text-mist rounded-sm cursor-pointer transition-all duration-150 ease-out hover:bg-coral-bg hover:text-coral"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(index)
                }}
                aria-label={`Remove ${file.name}`}
              >
                <svg
                  className="w-[18px] h-[18px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {displayError && (
        <span className="text-xs text-coral" role="alert">
          {displayError}
        </span>
      )}
      {helperText && !displayError && <span className="text-xs text-slate">{helperText}</span>}
    </div>
  )
})

export default FileUpload
