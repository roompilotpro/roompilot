import { classNames } from '../../../utils/classNames'

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
    <div className={classNames('bg-snow rounded-lg p-4 mt-4', className)}>
      <div className="text-sm font-semibold text-midnight mb-3">Password must contain:</div>
      <ul className="list-none p-0 m-0">
        {items.map((item) => (
          <li
            key={item.key}
            className={classNames(
              'flex items-center gap-2 text-sm text-slate mb-2 last:mb-0',
              item.met && 'text-accent'
            )}
          >
            <span
              className={classNames(
                'w-4 h-4 rounded-full bg-cloud flex items-center justify-center text-[0.625rem] text-transparent shrink-0',
                item.met && 'bg-accent text-white'
              )}
            >
              ✓
            </span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PasswordRequirements
