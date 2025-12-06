import { classNames } from '../../../utils/classNames'
import './PasswordStrength.css'

/**
 * PasswordStrength component - Visual 4-bar strength indicator
 *
 * @param {Object} props
 * @param {number} props.strength - Strength level (0-4)
 * @param {'none'|'weak'|'fair'|'good'|'strong'} props.strengthLevel - Strength label
 * @param {string} [props.strengthLabel] - Text label to display
 * @param {string} [props.className] - Additional CSS classes
 */
function PasswordStrength({ strength = 0, strengthLevel = 'none', strengthLabel, className }) {
  const bars = [1, 2, 3, 4]

  return (
    <div className={classNames('password-strength', className)}>
      <div className="password-strength__bars">
        {bars.map((bar) => (
          <div
            key={bar}
            className={classNames(
              'password-strength__bar',
              bar <= strength && `password-strength__bar--active`,
              bar <= strength && `password-strength__bar--${strengthLevel}`
            )}
          />
        ))}
      </div>
      {strengthLabel && <p className="password-strength__text">{strengthLabel}</p>}
    </div>
  )
}

export default PasswordStrength
