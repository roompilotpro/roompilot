import { forwardRef, useState } from 'react'
import { classNames } from '../../../utils'

// Styles for pulse animation
const bookingStyles = `
  @keyframes booking-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.2); }
  }
`

// Default move-in date options
const MOVE_IN_OPTIONS = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '2weeks', label: 'In 2 weeks' },
  { value: '1month', label: 'In 1 month' },
  { value: 'flexible', label: 'Flexible' },
]

// Default stay length options
const STAY_LENGTH_OPTIONS = [
  { value: '1-3', label: '1-3 months' },
  { value: '3-6', label: '3-6 months' },
  { value: '6-12', label: '6-12 months' },
  { value: '12+', label: '12+ months' },
]

/**
 * BookingCard - Sticky sidebar booking card with price, form, and breakdown
 *
 * @param {Object} props
 * @param {Object} props.pricing - Pricing information
 * @param {string} props.pricing.weeklyPrice - Weekly price string (e.g., "$175")
 * @param {string} props.pricing.monthlyPrice - Monthly price string (e.g., "$700")
 * @param {string} props.pricing.utilitiesIncluded - Whether utilities are included
 * @param {Object} props.availability - Availability information
 * @param {boolean} props.availability.isAvailable - Whether room is available
 * @param {string} props.availability.text - Availability text
 * @param {Array} props.breakdown - Price breakdown items [{label, value}]
 * @param {Object} props.total - Total row {label, value}
 * @param {Array} props.features - Feature list [{icon, title, description}]
 * @param {Array} props.moveInOptions - Move-in date options
 * @param {Array} props.stayLengthOptions - Stay length options
 * @param {Function} props.onApply - Callback when Apply button is clicked
 * @param {Function} props.onReport - Callback when Report link is clicked
 * @param {string} props.className - Additional CSS class
 */
const BookingCard = forwardRef(function BookingCard(
  {
    pricing = {},
    availability = { isAvailable: true, text: 'Available now' },
    breakdown = [],
    total,
    features = [],
    moveInOptions = MOVE_IN_OPTIONS,
    stayLengthOptions = STAY_LENGTH_OPTIONS,
    onApply,
    onReport,
    className,
    ...props
  },
  ref
) {
  const [moveInDate, setMoveInDate] = useState(moveInOptions[0]?.value || '')
  const [stayLength, setStayLength] = useState(stayLengthOptions[0]?.value || '')

  const handleApply = () => {
    onApply?.({ moveInDate, stayLength })
  }

  return (
    <>
      <style>{bookingStyles}</style>
      <aside ref={ref} className={classNames('relative', className)} {...props}>
        <div className="sticky top-[calc(var(--nav-height)+24px)] lg:relative lg:top-0 bg-white border border-cloud rounded-xl p-7 shadow-lg">
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-[32px] font-bold text-midnight">
              {pricing.weeklyPrice || '$0'}
            </span>
            <span className="text-base text-slate">/week</span>
          </div>
          {pricing.monthlyPrice && (
            <div className="text-sm text-slate mb-5">
              {pricing.monthlyPrice}/month
              {pricing.utilitiesIncluded && ' · All utilities included'}
            </div>
          )}

          {/* Availability */}
          <div
            className={classNames(
              'flex items-center gap-2 py-3 px-4 rounded-md mb-5',
              availability.isAvailable ? 'bg-accent-bg' : 'bg-coral-bg'
            )}
          >
            <span
              className={classNames(
                'w-2 h-2 rounded-full',
                availability.isAvailable
                  ? 'bg-accent animate-[booking-pulse_2s_ease-in-out_infinite]'
                  : 'bg-coral'
              )}
            />
            <span
              className={classNames(
                'text-sm font-semibold',
                availability.isAvailable ? 'text-accent' : 'text-coral'
              )}
            >
              {availability.text || (availability.isAvailable ? 'Available now' : 'Not available')}
            </span>
          </div>

          {/* Form */}
          <div className="mb-5">
            <div className="border border-cloud rounded-lg overflow-hidden">
              <div className="p-4 border-b border-cloud">
                <label className="block text-[11px] font-bold uppercase tracking-wide text-charcoal mb-1">
                  Move-in date
                </label>
                <div className="text-[15px] text-slate">
                  <select
                    className="font-body text-[15px] text-charcoal bg-transparent border-none cursor-pointer w-full p-0 focus:outline-none"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                  >
                    {moveInOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-4">
                <label className="block text-[11px] font-bold uppercase tracking-wide text-charcoal mb-1">
                  Planned stay length
                </label>
                <div className="text-[15px] text-slate">
                  <select
                    className="font-body text-[15px] text-charcoal bg-transparent border-none cursor-pointer w-full p-0 focus:outline-none"
                    value={stayLength}
                    onChange={(e) => setStayLength(e.target.value)}
                  >
                    {stayLengthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Apply button */}
          <button
            type="button"
            className="w-full py-[18px] font-body text-[17px] font-semibold bg-primary text-white border-none rounded-lg cursor-pointer shadow-[0_2px_8px_rgba(37,99,235,0.25)] transition-all duration-200 mb-4 hover:bg-primary-dark hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)] active:translate-y-0"
            onClick={handleApply}
          >
            Apply Now
          </button>

          <p className="text-center text-sm text-slate mb-6">You won't be charged yet</p>

          {/* Breakdown */}
          {breakdown.length > 0 && (
            <div className="pt-5 border-t border-cloud">
              {breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-3 text-[15px]">
                  <span className="text-slate underline cursor-help">{item.label}</span>
                  <span className="text-charcoal">{item.value}</span>
                </div>
              ))}
              {total && (
                <div className="flex justify-between items-center pt-4 border-t border-cloud mt-4 text-base font-bold text-charcoal">
                  <span>{total.label}</span>
                  <span>{total.value}</span>
                </div>
              )}
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="mt-6 pt-6 border-t border-cloud">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={classNames(
                    'flex items-start gap-3',
                    index < features.length - 1 && 'mb-4'
                  )}
                >
                  <span className="w-6 h-6 flex items-center justify-center text-base shrink-0">
                    {feature.icon}
                  </span>
                  <span className="text-sm text-slate leading-relaxed">
                    <strong className="text-charcoal">{feature.title}</strong>
                    {feature.description && ` — ${feature.description}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Report link */}
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 mt-6 text-[13px] text-slate underline cursor-pointer bg-transparent border-none font-body w-full hover:text-charcoal"
            onClick={onReport}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
            Report this listing
          </button>
        </div>
      </aside>
    </>
  )
})

export default BookingCard
