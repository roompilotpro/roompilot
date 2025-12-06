import { forwardRef } from 'react'
import { classNames } from '../../../utils'
import './LocationSection.css'

/**
 * LocationSection - Location map and nearby details section
 *
 * @param {Object} props
 * @param {Array<{icon: string, title: string, description: string}>} props.nearby - Nearby points of interest
 * @param {string} props.title - Section title
 * @param {string} props.className - Additional CSS class
 */
const LocationSection = forwardRef(function LocationSection(
  { nearby = [], title = 'Location', className, ...props },
  ref
) {
  return (
    <section ref={ref} className={classNames('location-section', className)} {...props}>
      <h2 className="location-section__title">{title}</h2>

      {/* Map placeholder */}
      <div className="location-section__map">
        <div className="location-section__map-grid" />
        <div className="location-section__map-circle" />
        <div className="location-section__map-marker">
          <div className="location-section__map-marker-dot">
            <span className="location-section__map-marker-icon">🏠</span>
          </div>
        </div>
      </div>

      {/* Nearby details */}
      {nearby.length > 0 && (
        <div className="location-section__details">
          {nearby.map((item, index) => (
            <div key={index} className="location-section__detail">
              <span className="location-section__detail-icon">{item.icon}</span>
              <div className="location-section__detail-text">
                <strong className="location-section__detail-title">{item.title}</strong>
                {item.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
})

export default LocationSection
