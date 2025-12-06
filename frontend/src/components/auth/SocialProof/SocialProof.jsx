import { classNames } from '../../../utils/classNames'
import './SocialProof.css'

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
    <div className={classNames('social-proof', className)}>
      {stats.map((stat, index) => (
        <div key={index} className="social-proof__stat">
          <span className="social-proof__number">{stat.number}</span>
          <span className="social-proof__label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

export default SocialProof
