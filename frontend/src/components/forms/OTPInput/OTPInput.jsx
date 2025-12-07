import { forwardRef, useState, useRef, useEffect, useId } from 'react'
import { classNames } from '../../../utils/classNames'

// Size variant styles for individual inputs
const inputSizeStyles = {
  sm: 'w-9 h-11 text-lg',
  md: 'w-11 h-[52px] text-xl',
  lg: 'w-[52px] h-[60px] text-2xl',
}

/**
 * OTPInput component for verification codes
 *
 * @param {Object} props
 * @param {number} [props.length=6] - Number of digits
 * @param {string} [props.value=''] - Current OTP value
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size variant
 * @param {string} [props.label] - Label text
 * @param {string} [props.helperText] - Helper text
 * @param {string} [props.error] - Error message
 * @param {boolean} [props.disabled=false] - Whether input is disabled
 * @param {boolean} [props.autoFocus=false] - Whether to auto focus first input
 * @param {Function} [props.onChange] - Change handler
 * @param {Function} [props.onComplete] - Called when all digits are entered
 * @param {string} [props.id] - Input ID prefix
 * @param {string} [props.className] - Additional CSS classes
 */
const OTPInput = forwardRef(function OTPInput(
  {
    length = 6,
    value = '',
    size = 'md',
    label,
    helperText,
    error,
    disabled = false,
    autoFocus = false,
    onChange,
    onComplete,
    id,
    className,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId
  const inputsRef = useRef([])
  const [otp, setOtp] = useState(() => value.split('').slice(0, length))

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus()
    }
  }, [autoFocus])

  useEffect(() => {
    setOtp(value.split('').slice(0, length))
  }, [value, length])

  const focusInput = (index) => {
    if (index >= 0 && index < length) {
      inputsRef.current[index]?.focus()
    }
  }

  const handleChange = (index, e) => {
    const inputValue = e.target.value
    const digit = inputValue.replace(/\D/g, '').slice(-1)

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    const otpString = newOtp.join('')
    onChange?.({ target: { value: otpString } })

    if (digit && index < length - 1) {
      focusInput(index + 1)
    }

    if (newOtp.filter(Boolean).length === length) {
      onComplete?.(otpString)
    }
  }

  const handleKeyDown = (index, e) => {
    switch (e.key) {
      case 'Backspace':
        if (!otp[index] && index > 0) {
          focusInput(index - 1)
        } else {
          const newOtp = [...otp]
          newOtp[index] = ''
          setOtp(newOtp)
          onChange?.({ target: { value: newOtp.join('') } })
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        focusInput(index - 1)
        break
      case 'ArrowRight':
        e.preventDefault()
        focusInput(index + 1)
        break
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const newOtp = pastedData.split('')

    while (newOtp.length < length) {
      newOtp.push('')
    }

    setOtp(newOtp)
    onChange?.({ target: { value: newOtp.join('') } })

    // Focus last filled input or next empty one
    const lastFilledIndex = pastedData.length - 1
    focusInput(Math.min(lastFilledIndex + 1, length - 1))

    if (pastedData.length === length) {
      onComplete?.(pastedData)
    }
  }

  const handleFocus = (e) => {
    e.target.select()
  }

  return (
    <div ref={ref} className={classNames('flex flex-col items-center gap-3', className)}>
      {label && (
        <span className="font-body text-sm font-semibold text-midnight text-center">{label}</span>
      )}
      <div className={classNames('flex gap-2', disabled && 'opacity-60')}>
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            id={`${inputId}-${index}`}
            className={classNames(
              'text-center font-body font-semibold text-midnight bg-white border-2 rounded-sm transition-all duration-150 ease-out outline-none',
              inputSizeStyles[size],
              otp[index] ? 'border-primary bg-primary-bg' : 'border-cloud',
              !otp[index] && 'focus:border-primary focus:shadow-focus',
              error && 'border-coral',
              error && 'focus:shadow-focus-error',
              disabled && 'bg-snow cursor-not-allowed'
            )}
            value={otp[index] || ''}
            disabled={disabled}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={error ? 'true' : undefined}
            {...props}
          />
        ))}
      </div>
      {error && (
        <span className="text-sm text-coral text-center" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && <span className="text-sm text-slate text-center">{helperText}</span>}
    </div>
  )
})

export default OTPInput
