import { forwardRef } from 'react'
import { classNames } from '../../../utils'
import './HostStrip.css'

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
    <div ref={ref} className={classNames('host-strip', className)} {...props}>
      <div className="host-strip__avatar">
        {avatar ? <img src={avatar} alt={name} className="host-strip__avatar-image" /> : initial}
      </div>

      <div className="host-strip__info">
        <div className="host-strip__name">Hosted by {name}</div>
        {statsText && <div className="host-strip__stats">{statsText}</div>}
      </div>

      {isSuperhost && <div className="host-strip__badge">⭐ Superhost</div>}
    </div>
  )
})

export default HostStrip
