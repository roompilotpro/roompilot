import { forwardRef, useState, useRef, useEffect, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import './OTPInput.css'

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
    <div ref={ref} className={classNames('otp-wrapper', className)}>
      {label && <span className="otp__label">{label}</span>}
      <div
        className={classNames(
          'otp',
          `otp--${size}`,
          error && 'otp--error',
          disabled && 'otp--disabled'
        )}
      >
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            id={`${inputId}-${index}`}
            className={classNames('otp__input', otp[index] && 'otp__input--filled')}
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
        <span className="otp__error" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && <span className="otp__helper">{helperText}</span>}
    </div>
  )
})

export default OTPInput
