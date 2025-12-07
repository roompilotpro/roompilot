import { forwardRef, useState, useRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'

// Custom styles for native range input that can't be done with Tailwind
const rangeInputStyles = `
  .range-slider-input {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    pointer-events: none;
    cursor: pointer;
  }
  .range-slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: white;
    border: 2px solid var(--color-primary);
    border-radius: 9999px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    pointer-events: auto;
    cursor: pointer;
    transition: transform 150ms, box-shadow 150ms;
  }
  .range-slider-input::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }
  .range-slider-input:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .range-slider-input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: white;
    border: 2px solid var(--color-primary);
    border-radius: 9999px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    pointer-events: auto;
    cursor: pointer;
  }
  .range-slider-input::-moz-range-track {
    background: transparent;
  }
  .range-slider-input::-webkit-slider-runnable-track {
    background: transparent;
  }
  .range-slider-input--disabled::-webkit-slider-thumb {
    border-color: var(--color-mist);
    cursor: not-allowed;
  }
  .range-slider-input--disabled::-webkit-slider-thumb:hover {
    transform: none;
  }
  .range-slider-input--disabled::-moz-range-thumb {
    border-color: var(--color-mist);
    cursor: not-allowed;
  }
`

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
      className={classNames(
        'flex flex-col gap-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <style>{rangeInputStyles}</style>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <label htmlFor={sliderId} className="font-body text-sm font-semibold text-midnight">
              {label}
            </label>
          )}
          {showValue && (
            <span className="font-body text-sm font-semibold text-primary">
              {range
                ? `${formatDisplayValue(minValue)} - ${formatDisplayValue(maxValue)}`
                : formatDisplayValue(currentValue)}
            </span>
          )}
        </div>
      )}
      <div className="relative h-6 flex items-center">
        <div ref={trackRef} className="absolute left-0 right-0 h-1.5 bg-cloud rounded-full">
          <div
            className={classNames(
              'absolute h-full rounded-full',
              disabled ? 'bg-mist' : 'bg-primary'
            )}
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
            className={classNames(
              'range-slider-input absolute w-full h-6 z-[1]',
              disabled && 'range-slider-input--disabled cursor-not-allowed'
            )}
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
          className={classNames(
            'range-slider-input absolute w-full h-6',
            range && 'z-[2]',
            disabled && 'range-slider-input--disabled cursor-not-allowed'
          )}
          aria-label={range ? `${label || 'Range'} maximum` : label}
          {...props}
        />
      </div>
      <div className="flex justify-between">
        <span className="font-body text-xs text-mist">{formatDisplayValue(min)}</span>
        <span className="font-body text-xs text-mist">{formatDisplayValue(max)}</span>
      </div>
    </div>
  )
})

export default RangeSlider
