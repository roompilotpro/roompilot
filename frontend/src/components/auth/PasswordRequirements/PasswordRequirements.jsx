import { classNames } from '../../../utils/classNames'
import './PasswordRequirements.css'

/**
 * PasswordRequirements component - Checklist with met/unmet states
 *
 * @param {Object} props
 * @param {Object} props.requirements - Object with requirement states
 * @param {boolean} props.requirements.length - At least 8 characters
 * @param {boolean} props.requirements.uppercase - At least one uppercase letter
 * @param {boolean} props.requirements.lowercase - At least one lowercase letter
 * @param {boolean} props.requirements.number - At least one number
 * @param {boolean} [props.requirements.match] - Passwords match (optional)
 * @param {boolean} [props.showMatch=false] - Whether to show the match requirement
 * @param {string} [props.className] - Additional CSS classes
 */
function PasswordRequirements({ requirements, showMatch = false, className }) {
  const items = [
    { key: 'length', label: 'At least 8 characters', met: requirements.length },
    { key: 'uppercase', label: 'At least one uppercase letter', met: requirements.uppercase },
    { key: 'lowercase', label: 'At least one lowercase letter', met: requirements.lowercase },
    { key: 'number', label: 'At least one number', met: requirements.number },
  ]

  if (showMatch) {
    items.push({ key: 'match', label: 'Passwords match', met: requirements.match })
  }

  return (
    <div className={classNames('password-requirements', className)}>
      <div className="password-requirements__title">Password must contain:</div>
      <ul className="password-requirements__list">
        {items.map((item) => (
          <li
            key={item.key}
            className={classNames(
              'password-requirements__item',
              item.met && 'password-requirements__item--met'
            )}
          >
            <span className="password-requirements__icon">✓</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PasswordRequirements
