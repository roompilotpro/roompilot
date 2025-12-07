import { forwardRef, useState } from 'react'
import { classNames } from '../../../utils/classNames'
import MapMarker from '../MapMarker'

// Styles for grid and roads (complex CSS patterns)
const mapStyles = `
  .map-grid {
    background-image:
      linear-gradient(rgba(200, 210, 205, 0.5) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200, 210, 205, 0.5) 1px, transparent 1px);
    background-size: 60px 60px;
  }
`

/**
 * MapPanel - Placeholder map with markers for search page
 * Uses CSS-only styling for the map background
 */
const MapPanel = forwardRef(function MapPanel(
  { markers = [], activeMarkerId, onMarkerClick, onMarkerHover, onSearchArea, className, ...props },
  ref
) {
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null)

  const handleMarkerMouseEnter = (marker) => {
    setHoveredMarkerId(marker.id)
    onMarkerHover?.(marker.id)
  }

  const handleMarkerMouseLeave = () => {
    setHoveredMarkerId(null)
    onMarkerHover?.(null)
  }

  return (
    <>
      <style>{mapStyles}</style>
      <div
        ref={ref}
        className={classNames('flex-1 relative bg-snow lg:hidden', className)}
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e8e4 50%, #e0ece0 100%)' }}
        >
          {/* Grid background */}
          <div className="absolute inset-0 map-grid" />

          {/* Simulated roads */}
          <div className="absolute inset-0">
            {/* Major roads */}
            <div className="absolute h-3 left-0 right-0 top-[45%] bg-white/95" />
            <div className="absolute w-3 top-0 bottom-0 left-1/2 bg-white/95" />
            {/* Minor roads */}
            <div className="absolute h-2 left-0 right-0 top-[20%] bg-white/80" />
            <div className="absolute h-2 left-0 right-0 top-[70%] bg-white/80" />
            <div className="absolute w-2 top-0 bottom-0 left-1/4 bg-white/80" />
            <div className="absolute w-2 top-0 bottom-0 left-3/4 bg-white/80" />
          </div>

          {/* Map markers */}
          {markers.map((marker, index) => (
            <MapMarker
              key={marker.id}
              price={marker.price}
              listing={marker.listing}
              isActive={activeMarkerId === marker.id || hoveredMarkerId === marker.id}
              style={{
                top: marker.top || `${20 + ((index * 15) % 60)}%`,
                left: marker.left || `${25 + ((index * 20) % 55)}%`,
              }}
              onClick={() => onMarkerClick?.(marker)}
              onMouseEnter={() => handleMarkerMouseEnter(marker)}
              onMouseLeave={handleMarkerMouseLeave}
            />
          ))}

          {/* Search this area button */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2">
            <button
              type="button"
              className="inline-flex items-center gap-2 py-3 px-5 bg-white border-none rounded-full shadow-lg font-body text-sm font-semibold text-charcoal cursor-pointer transition-all duration-200 hover:bg-snow"
              onClick={onSearchArea}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search this area
            </button>
          </div>

          {/* Map controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button
              type="button"
              className="w-11 h-11 bg-white border-none rounded-md shadow-md flex items-center justify-center cursor-pointer text-xl text-charcoal transition-all duration-200 hover:bg-snow"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              className="w-11 h-11 bg-white border-none rounded-md shadow-md flex items-center justify-center cursor-pointer text-xl text-charcoal transition-all duration-200 hover:bg-snow"
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              className="w-11 h-11 bg-white border-none rounded-md shadow-md flex items-center justify-center cursor-pointer text-xl text-charcoal transition-all duration-200 hover:bg-snow"
              aria-label="Center on location"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
})

export default MapPanel
