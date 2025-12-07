import { classNames } from '../../../utils/classNames'

/**
 * SocialProof component - Stats section
 *
 * @param {Object} props
 * @param {Array} [props.stats] - Array of stat objects
 * @param {string} props.stats[].number - Stat number
 * @param {string} props.stats[].label - Stat label
 * @param {string} [props.className] - Additional CSS classes
 */
function SocialProof({
  stats = [
    { number: '12,487', label: 'Active Listings' },
    { number: '8,392', label: 'Trusted Hosts' },
    { number: '24,156', label: 'Happy Renters' },
  ],
  className,
}) {
  return (
    <div
      className={classNames(
        'bg-white p-8 rounded-lg mt-12 flex gap-12 justify-center shadow-sm md:flex-col md:gap-6',
        className
      )}
    >
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <span className="font-display text-3xl font-bold text-primary block mb-1">
            {stat.number}
          </span>
          <span className="text-sm text-slate uppercase tracking-wide">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

export default SocialProof
