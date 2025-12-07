import { classNames } from '../../../utils/classNames'

// Direction styles
const directionStyles = {
  horizontal: 'flex-row gap-2',
  vertical: 'flex-col gap-2',
}

// Attached variant styles (removes gap and rounds corners)
const attachedHorizontalStyles =
  'gap-0 [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:first-child)]:-ml-px'

const attachedVerticalStyles =
  'gap-0 [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:first-child)]:-mt-px'

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
  const attachedStyles = attached
    ? direction === 'horizontal'
      ? attachedHorizontalStyles
      : attachedVerticalStyles
    : ''

  return (
    <div
      role="group"
      className={classNames('inline-flex', directionStyles[direction], attachedStyles, className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default ButtonGroup
