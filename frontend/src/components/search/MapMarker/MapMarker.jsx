import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import './MapMarker.css'

/**
 * MapMarker - Price bubble marker for the map
 */
const MapMarker = forwardRef(function MapMarker(
  { price, isActive, listing, onClick, onMouseEnter, onMouseLeave, style, className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={classNames('map-marker', isActive && 'map-marker--active', className)}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {/* Preview card on hover */}
      {listing && (
        <div className="map-marker__preview">
          <div className="map-marker__preview-image">
            <div
              className="map-marker__preview-placeholder"
              style={{
                background: listing.images?.[0]
                  ? `url(${listing.images[0]}) center/cover`
                  : 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
              }}
            >
              {!listing.images?.[0] && '🏠'}
            </div>
          </div>
          <div className="map-marker__preview-content">
            <div className="map-marker__preview-title">{listing.title}</div>
            <div className="map-marker__preview-details">
              {listing.location} · {listing.details?.split('·')[1]?.trim() || 'Private bath'}
            </div>
            <div className="map-marker__preview-price">{listing.weeklyPrice}/week</div>
          </div>
        </div>
      )}

      {/* Price bubble */}
      <div className="map-marker__bubble">{price}</div>
      <div className="map-marker__stem" />
    </div>
  )
})

export default MapMarker
