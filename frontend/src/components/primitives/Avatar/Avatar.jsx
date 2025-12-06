import { classNames } from '../../../utils/classNames'
import './Avatar.css'

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
    <div className={classNames('avatar', `avatar--${size}`, className)} {...props}>
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} className="avatar__image" />
      ) : (
        <span className="avatar__initials" aria-label={name || 'Avatar'}>
          {initials}
        </span>
      )}
    </div>
  )
}

export default Avatar
