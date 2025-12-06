import { forwardRef, useState } from 'react'
import { classNames } from '../../../utils'
import './BookingCard.css'

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
    <aside ref={ref} className={classNames('booking-card-wrapper', className)} {...props}>
      <div className="booking-card">
        {/* Price */}
        <div className="booking-card__price">
          <span className="booking-card__price-value">{pricing.weeklyPrice || '$0'}</span>
          <span className="booking-card__price-period">/week</span>
        </div>
        {pricing.monthlyPrice && (
          <div className="booking-card__price-monthly">
            {pricing.monthlyPrice}/month
            {pricing.utilitiesIncluded && ' · All utilities included'}
          </div>
        )}

        {/* Availability */}
        <div
          className={classNames(
            'booking-card__availability',
            !availability.isAvailable && 'booking-card__availability--unavailable'
          )}
        >
          <span className="booking-card__availability-dot" />
          <span className="booking-card__availability-text">
            {availability.text || (availability.isAvailable ? 'Available now' : 'Not available')}
          </span>
        </div>

        {/* Form */}
        <div className="booking-card__form">
          <div className="booking-card__input-group">
            <div className="booking-card__input">
              <label className="booking-card__input-label">Move-in date</label>
              <div className="booking-card__input-value">
                <select
                  className="booking-card__select"
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
            <div className="booking-card__input">
              <label className="booking-card__input-label">Planned stay length</label>
              <div className="booking-card__input-value">
                <select
                  className="booking-card__select"
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
        <button type="button" className="booking-card__btn" onClick={handleApply}>
          Apply Now
        </button>

        <p className="booking-card__note">You won't be charged yet</p>

        {/* Breakdown */}
        {breakdown.length > 0 && (
          <div className="booking-card__breakdown">
            {breakdown.map((item, index) => (
              <div key={index} className="booking-card__breakdown-row">
                <span className="booking-card__breakdown-label">{item.label}</span>
                <span className="booking-card__breakdown-value">{item.value}</span>
              </div>
            ))}
            {total && (
              <div className="booking-card__breakdown-total">
                <span>{total.label}</span>
                <span>{total.value}</span>
              </div>
            )}
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="booking-card__features">
            {features.map((feature, index) => (
              <div key={index} className="booking-card__feature">
                <span className="booking-card__feature-icon">{feature.icon}</span>
                <span className="booking-card__feature-text">
                  <strong>{feature.title}</strong>
                  {feature.description && ` — ${feature.description}`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Report link */}
        <button type="button" className="booking-card__report" onClick={onReport}>
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
  )
})

export default BookingCard
