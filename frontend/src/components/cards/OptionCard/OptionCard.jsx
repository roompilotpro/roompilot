import { forwardRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'

/**
 * OptionCard - Selectable card with checkbox/radio behavior
 */
const OptionCard = forwardRef(function OptionCard(
  {
    icon,
    title,
    description,
    value,
    name,
    selected = false,
    disabled = false,
    type = 'checkbox',
    onChange,
    className,
    ...props
  },
  ref
) {
  const id = useId()
  const descId = description ? `${id}-desc` : undefined

  const handleChange = (e) => {
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <label
      ref={ref}
      className={classNames(
        'flex items-start gap-3 p-4 bg-white border-2 border-cloud rounded-md cursor-pointer transition-all duration-150',
        'hover:not-disabled:border-slate hover:not-disabled:bg-snow',
        'focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2',
        selected &&
          'border-primary bg-primary-bg hover:not-disabled:border-primary/80 hover:not-disabled:bg-primary-bg/80',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={handleChange}
        className="absolute opacity-0 w-0 h-0"
        aria-describedby={descId}
      />
      <span
        className={classNames(
          'flex items-center justify-center w-5 h-5 shrink-0 border-2 border-slate bg-white transition-all duration-150',
          type === 'checkbox' ? 'rounded' : 'rounded-full',
          selected && 'border-primary bg-primary text-white'
        )}
        aria-hidden="true"
      >
        {selected &&
          (type === 'checkbox' ? (
            <svg viewBox="0 0 12 10" fill="none" className="w-3 h-2.5">
              <path
                d="M1 5L4.5 8.5L11 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <span className="w-2 h-2 rounded-full bg-white" />
          ))}
      </span>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {icon && (
          <div
            className={classNames(
              'flex items-center justify-center w-10 h-10 shrink-0 bg-cloud rounded-md text-xl',
              selected && 'bg-primary-bg'
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-charcoal">{title}</span>
          {description && (
            <span id={descId} className="text-sm text-slate">
              {description}
            </span>
          )}
        </div>
      </div>
    </label>
  )
})

export default OptionCard
