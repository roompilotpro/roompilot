import { forwardRef, useState } from 'react'
import { classNames } from '../../../utils/classNames'
import { IconButton } from '../../primitives'
import MapMarker from '../MapMarker'
import './MapPanel.css'

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
    <div ref={ref} className={classNames('map-panel', className)} {...props}>
      <div className="map-panel__container">
        {/* Grid background */}
        <div className="map-panel__grid" />

        {/* Simulated roads */}
        <div className="map-panel__roads">
          <div className="map-panel__road map-panel__road--horizontal map-panel__road--major map-panel__road--h2" />
          <div className="map-panel__road map-panel__road--vertical map-panel__road--major map-panel__road--v2" />
          <div className="map-panel__road map-panel__road--horizontal map-panel__road--h1" />
          <div className="map-panel__road map-panel__road--horizontal map-panel__road--h3" />
          <div className="map-panel__road map-panel__road--vertical map-panel__road--v1" />
          <div className="map-panel__road map-panel__road--vertical map-panel__road--v3" />
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
        <div className="map-panel__search-area">
          <button type="button" className="map-panel__search-area-btn" onClick={onSearchArea}>
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
        <div className="map-panel__controls">
          <button type="button" className="map-panel__control-btn" aria-label="Zoom in">
            +
          </button>
          <button type="button" className="map-panel__control-btn" aria-label="Zoom out">
            −
          </button>
          <button type="button" className="map-panel__control-btn" aria-label="Center on location">
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
  )
})

export default MapPanel
