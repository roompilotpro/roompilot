import { classNames } from '../../../utils/classNames'

/**
 * RoleCard component - Clickable card for role selection
 *
 * @param {Object} props
 * @param {string} props.icon - Emoji icon
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {string} props.buttonText - Button text
 * @param {'primary'|'accent'} [props.variant='primary'] - Color variant
 * @param {Function} props.onClick - Click handler
 * @param {string} [props.className] - Additional CSS classes
 */
function RoleCard({
  icon,
  title,
  description,
  buttonText,
  variant = 'primary',
  onClick,
  className,
}) {
  const isAccent = variant === 'accent'

  return (
    <div
      className={classNames(
        'bg-white rounded-2xl py-10 px-8 shadow-[0_4px_6px_rgba(15,20,25,0.1),0_2px_4px_rgba(15,20,25,0.06)] transition-all duration-300 cursor-pointer border-2 border-transparent text-center',
        'hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(37,99,235,0.15),0_8px_16px_rgba(37,99,235,0.1)] hover:border-primary',
        'focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-primary',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <div
        className={classNames(
          'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-[2.5rem]',
          isAccent ? 'bg-accent-bg' : 'bg-primary-bg'
        )}
      >
        {icon}
      </div>
      <h2 className="font-display text-[1.75rem] font-bold text-midnight mb-4">{title}</h2>
      <p className="text-base text-slate leading-relaxed mb-8">{description}</p>
      <button
        type="button"
        className={classNames(
          'inline-block w-full py-4 px-8 text-white border-none rounded-lg font-body text-base font-semibold cursor-pointer transition-all duration-200',
          'hover:-translate-y-0.5',
          isAccent ? 'bg-accent hover:bg-accent-dark' : 'bg-primary hover:bg-primary-dark'
        )}
      >
        {buttonText}
      </button>
    </div>
  )
}

export default RoleCard
