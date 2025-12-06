import { classNames } from '../../../utils/classNames'
import './RoleCard.css'

/**
 * RoleCard component - Clickable card for role selection
 *
 * @param {Object} props
 * @param {string} props.icon - Emoji icon
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {string} props.buttonText - Button text
 * @param {'primary'|'accent'} [props.variant='primary'] - Color variant
 * @param {Function} props.onClick - Click handler
 * @param {string} [props.className] - Additional CSS classes
 */
function RoleCard({
  icon,
  title,
  description,
  buttonText,
  variant = 'primary',
  onClick,
  className,
}) {
  return (
    <div
      className={classNames('role-card', `role-card--${variant}`, className)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <div className="role-card__icon">{icon}</div>
      <h2 className="role-card__title">{title}</h2>
      <p className="role-card__description">{description}</p>
      <button type="button" className="role-card__btn">
        {buttonText}
      </button>
    </div>
  )
}

export default RoleCard
