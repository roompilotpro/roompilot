import { classNames } from '../../../utils/classNames'
import './ButtonGroup.css'

/**
 * ButtonGroup component for grouping related buttons
 *
 * @param {Object} props
 * @param {'horizontal'|'vertical'} [props.direction='horizontal'] - Layout direction
 * @param {boolean} [props.attached=false] - Whether buttons should be visually connected
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button components
 */
function ButtonGroup({
  direction = 'horizontal',
  attached = false,
  className,
  children,
  ...props
}) {
  return (
    <div
      role="group"
      className={classNames(
        'btn-group',
        `btn-group--${direction}`,
        attached && 'btn-group--attached',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default ButtonGroup
