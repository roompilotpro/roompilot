import { forwardRef } from 'react'
import { classNames } from '../../../utils'

/**
 * HostStrip - Host information strip with avatar, name, stats, and badge
 *
 * @param {Object} props
 * @param {Object} props.host - Host information object
 * @param {string} props.host.name - Host name
 * @param {string} props.host.avatar - Avatar URL (optional, shows initial if not provided)
 * @param {number} props.host.yearsHosting - Years of hosting experience
 * @param {number} props.host.totalRooms - Total rooms listed
 * @param {boolean} props.host.isSuperhost - Whether host is a Superhost
 * @param {string} props.className - Additional CSS class
 */
const HostStrip = forwardRef(function HostStrip({ host = {}, className, ...props }, ref) {
  const { name = 'Host', avatar, yearsHosting, totalRooms, isSuperhost } = host

  // Get initial from name
  const initial = name.charAt(0).toUpperCase()

  // Build stats string
  const statsParts = []
  if (isSuperhost) statsParts.push('Superhost')
  if (yearsHosting) statsParts.push(`${yearsHosting} year${yearsHosting === 1 ? '' : 's'} hosting`)
  if (totalRooms) statsParts.push(`${totalRooms} room${totalRooms === 1 ? '' : 's'}`)
  const statsText = statsParts.join(' · ')

  return (
    <div
      ref={ref}
      className={classNames(
        'flex items-center gap-4 py-6 border-b border-cloud mb-8 sm:flex-wrap',
        className
      )}
      {...props}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-display text-[22px] font-semibold shrink-0 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}
      >
        {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : initial}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[17px] font-semibold text-charcoal mb-0.5">Hosted by {name}</div>
        {statsText && <div className="text-sm text-slate">{statsText}</div>}
      </div>

      {isSuperhost && (
        <div className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-warm-bg rounded-md text-xs font-semibold text-warm shrink-0 sm:ml-[72px] sm:-mt-2">
          ⭐ Superhost
        </div>
      )}
    </div>
  )
})

export default HostStrip
