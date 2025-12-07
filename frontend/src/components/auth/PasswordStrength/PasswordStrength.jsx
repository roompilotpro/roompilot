import { classNames } from '../../../utils/classNames'

// Strength level color mapping
const strengthColors = {
  weak: 'bg-coral',
  fair: 'bg-coral',
  good: 'bg-warm',
  strong: 'bg-accent',
}

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
    <div className={classNames('mt-2', className)}>
      <div className="flex gap-1 h-1">
        {bars.map((bar) => (
          <div
            key={bar}
            className={classNames(
              'flex-1 bg-cloud rounded-sm transition-all duration-300',
              bar <= strength && strengthColors[strengthLevel]
            )}
          />
        ))}
      </div>
      {strengthLabel && <p className="text-xs mt-1 text-slate mb-0">{strengthLabel}</p>}
    </div>
  )
}

export default PasswordStrength
