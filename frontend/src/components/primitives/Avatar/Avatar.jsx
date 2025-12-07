import { classNames } from '../../../utils/classNames'

// Base avatar styles
const baseStyles =
  'inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary text-white font-semibold overflow-hidden shrink-0'

// Size variants (using CSS variables for avatar sizes)
const sizeStyles = {
  xs: 'w-[var(--avatar-xs)] h-[var(--avatar-xs)] text-[10px]',
  sm: 'w-[var(--avatar-sm)] h-[var(--avatar-sm)] text-[13px]',
  md: 'w-[var(--avatar-md)] h-[var(--avatar-md)] text-base',
  lg: 'w-[var(--avatar-lg)] h-[var(--avatar-lg)] text-base',
  xl: 'w-[var(--avatar-xl)] h-[var(--avatar-xl)] text-[22px]',
  '2xl': 'w-[var(--avatar-2xl)] h-[var(--avatar-2xl)] text-[40px]',
}

/**
 * Avatar component for user profile images
 *
 * @param {Object} props
 * @param {string} [props.src] - Image source URL
 * @param {string} [props.alt] - Alt text for image
 * @param {string} [props.name] - User name for generating initials
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'} [props.size='md'] - Size variant
 * @param {string} [props.className] - Additional CSS classes
 */
function Avatar({ src, alt, name, size = 'md', className, ...props }) {
  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const initials = getInitials(name)

  return (
    <div className={classNames(baseStyles, sizeStyles[size], className)} {...props}>
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span
          className="flex items-center justify-center w-full h-full uppercase tracking-wide"
          aria-label={name || 'Avatar'}
        >
          {initials}
        </span>
      )}
    </div>
  )
}

export default Avatar
