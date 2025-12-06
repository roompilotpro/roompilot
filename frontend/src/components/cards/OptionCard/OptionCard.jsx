import { forwardRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import './OptionCard.css'

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
        'option-card',
        selected && 'option-card--selected',
        disabled && 'option-card--disabled',
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
        className="option-card__input"
        aria-describedby={descId}
      />
      <span
        className={classNames('option-card__indicator', `option-card__indicator--${type}`)}
        aria-hidden="true"
      >
        {selected &&
          (type === 'checkbox' ? (
            <svg viewBox="0 0 12 10" fill="none" className="option-card__check">
              <path
                d="M1 5L4.5 8.5L11 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <span className="option-card__dot" />
          ))}
      </span>
      <div className="option-card__content">
        {icon && <div className="option-card__icon">{icon}</div>}
        <div className="option-card__text">
          <span className="option-card__title">{title}</span>
          {description && (
            <span id={descId} className="option-card__description">
              {description}
            </span>
          )}
        </div>
      </div>
    </label>
  )
})

export default OptionCard
