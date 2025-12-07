import { forwardRef } from 'react'
import { classNames } from '../../../utils'

// Styles for grid pattern
const locationStyles = `
  .location-map-grid {
    background-image:
      linear-gradient(rgba(200, 210, 205, 0.4) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200, 210, 205, 0.4) 1px, transparent 1px);
    background-size: 40px 40px;
  }
`

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
    <>
      <style>{locationStyles}</style>
      <section ref={ref} className={classNames('py-8 border-b border-cloud', className)} {...props}>
        <h2 className="font-display text-[22px] font-semibold text-midnight mb-5">{title}</h2>

        {/* Map placeholder */}
        <div
          className="h-[280px] rounded-lg relative overflow-hidden mb-4"
          style={{ background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e8e4 50%, #e0ece0 100%)' }}
        >
          <div className="absolute inset-0 location-map-grid" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full"
            style={{
              background: 'rgba(37, 99, 235, 0.1)',
              border: '2px solid rgba(37, 99, 235, 0.2)',
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
            <div className="w-12 h-12 bg-primary rounded-[50%_50%_50%_0] -rotate-45 flex items-center justify-center shadow-lg">
              <span className="rotate-45 text-white text-xl">🏠</span>
            </div>
          </div>
        </div>

        {/* Nearby details */}
        {nearby.length > 0 && (
          <div className="flex gap-6 md:flex-col md:gap-4">
            {nearby.map((item, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <span className="text-xl mt-0.5 shrink-0">{item.icon}</span>
                <div className="text-[15px] text-slate leading-relaxed">
                  <strong className="block text-charcoal font-semibold mb-0.5">{item.title}</strong>
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
})

export default LocationSection
