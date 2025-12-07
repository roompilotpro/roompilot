import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'

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
      className={classNames(
        'absolute -translate-x-1/2 -translate-y-full cursor-pointer z-10 transition-all duration-200 group hover:z-20',
        className
      )}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {/* Preview card on hover */}
      {listing && (
        <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[280px] bg-white rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-[100] animate-[mapPreviewFade_0.2s_ease]">
          <div className="h-[140px] bg-cloud">
            <div
              className="w-full h-full flex items-center justify-center text-[32px] text-slate"
              style={{
                background: listing.images?.[0]
                  ? `url(${listing.images[0]}) center/cover`
                  : 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
              }}
            >
              {!listing.images?.[0] && '🏠'}
            </div>
          </div>
          <div className="p-3">
            <div className="text-sm font-semibold text-charcoal mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
              {listing.title}
            </div>
            <div className="text-xs text-slate mb-2">
              {listing.location} · {listing.details?.split('·')[1]?.trim() || 'Private bath'}
            </div>
            <div className="font-display text-base font-bold text-charcoal">
              {listing.weeklyPrice}/week
            </div>
          </div>
        </div>
      )}

      {/* Price bubble */}
      <div
        className={classNames(
          'py-2 px-3 bg-white rounded-[20px] text-sm font-bold text-charcoal shadow-md whitespace-nowrap transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg',
          isActive && 'bg-charcoal text-white'
        )}
      >
        {price}
      </div>
      <div
        className={classNames('w-0.5 h-2 bg-white mx-auto shadow-sm', isActive && 'bg-charcoal')}
      />
    </div>
  )
})

export default MapMarker
