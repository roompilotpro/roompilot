import { forwardRef, useState, useRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import './RangeSlider.css'

/**
 * RangeSlider component with single or dual handle
 *
 * @param {Object} props
 * @param {number} [props.min=0] - Minimum value
 * @param {number} [props.max=100] - Maximum value
 * @param {number} [props.step=1] - Step increment
 * @param {number|[number, number]} [props.value] - Current value (number for single, [min, max] for range)
 * @param {number|[number, number]} [props.defaultValue] - Default value
 * @param {boolean} [props.range=false] - Whether to show dual handles for range selection
 * @param {string} [props.label] - Label text
 * @param {boolean} [props.showValue=true] - Whether to show current value(s)
 * @param {Function} [props.formatValue] - Function to format displayed value
 * @param {boolean} [props.disabled=false] - Whether slider is disabled
 * @param {string} [props.id] - Slider ID
 * @param {string} [props.className] - Additional CSS classes
 */
const RangeSlider = forwardRef(function RangeSlider(
  {
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue,
    range = false,
    label,
    showValue = true,
    formatValue,
    disabled = false,
    id,
    className,
    onChange,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const sliderId = id || generatedId
  const trackRef = useRef(null)

  // Initialize internal value state
  const getInitialValue = () => {
    if (value !== undefined) return value
    if (defaultValue !== undefined) return defaultValue
    return range ? [min, max] : min
  }

  const [internalValue, setInternalValue] = useState(getInitialValue)

  // Use controlled value if provided, otherwise use internal state
  const currentValue = value !== undefined ? value : internalValue
  const [minValue, maxValue] = range ? [currentValue[0], currentValue[1]] : [min, currentValue]

  const getPercent = (val) => ((val - min) / (max - min)) * 100

  const formatDisplayValue = (val) => {
    if (formatValue) return formatValue(val)
    return val
  }

  const handleChange = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onChange?.({ target: { value: newValue } })
  }

  const handleInputChange = (e, isMax = false) => {
    const newVal = Number(e.target.value)
    if (range) {
      const [currentMin, currentMax] = currentValue
      if (isMax) {
        handleChange([Math.min(currentMin, newVal), newVal])
      } else {
        handleChange([newVal, Math.max(currentMax, newVal)])
      }
    } else {
      handleChange(newVal)
    }
  }

  return (
    <div
      ref={ref}
      className={classNames('range-slider', disabled && 'range-slider--disabled', className)}
    >
      {(label || showValue) && (
        <div className="range-slider__header">
          {label && (
            <label htmlFor={sliderId} className="range-slider__label">
              {label}
            </label>
          )}
          {showValue && (
            <span className="range-slider__value">
              {range
                ? `${formatDisplayValue(minValue)} - ${formatDisplayValue(maxValue)}`
                : formatDisplayValue(currentValue)}
            </span>
          )}
        </div>
      )}
      <div className="range-slider__container">
        <div ref={trackRef} className="range-slider__track">
          <div
            className="range-slider__fill"
            style={{
              left: range ? `${getPercent(minValue)}%` : '0%',
              width: range
                ? `${getPercent(maxValue) - getPercent(minValue)}%`
                : `${getPercent(currentValue)}%`,
            }}
          />
        </div>
        {range && (
          <input
            type="range"
            id={`${sliderId}-min`}
            min={min}
            max={max}
            step={step}
            value={minValue}
            disabled={disabled}
            onChange={(e) => handleInputChange(e, false)}
            className="range-slider__input range-slider__input--min"
            aria-label={`${label || 'Range'} minimum`}
            {...props}
          />
        )}
        <input
          type="range"
          id={sliderId}
          min={min}
          max={max}
          step={step}
          value={range ? maxValue : currentValue}
          disabled={disabled}
          onChange={(e) => handleInputChange(e, range)}
          className={classNames('range-slider__input', range && 'range-slider__input--max')}
          aria-label={range ? `${label || 'Range'} maximum` : label}
          {...props}
        />
      </div>
      <div className="range-slider__limits">
        <span className="range-slider__min">{formatDisplayValue(min)}</span>
        <span className="range-slider__max">{formatDisplayValue(max)}</span>
      </div>
    </div>
  )
})

export default RangeSlider
