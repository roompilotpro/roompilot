import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import './TwoColumnLayout.css'

/**
 * TwoColumnLayout - Split view layout for messages, search results, etc.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.left - Left panel content
 * @param {React.ReactNode} props.right - Right panel content
 * @param {string|number} [props.leftWidth='400px'] - Left panel width (CSS value)
 * @param {'default'|'messages'|'search'} [props.variant='default'] - Layout variant
 * @param {boolean} [props.stickyLeft=false] - Make left panel sticky
 * @param {boolean} [props.stickyRight=false] - Make right panel sticky
 * @param {string} [props.className] - Additional CSS classes
 */
const TwoColumnLayout = forwardRef(function TwoColumnLayout(
  {
    left,
    right,
    leftWidth = '400px',
    variant = 'default',
    stickyLeft = false,
    stickyRight = false,
    className,
    ...props
  },
  ref
) {
  const leftStyle = {
    '--two-col-left-width': typeof leftWidth === 'number' ? `${leftWidth}px` : leftWidth,
  }

  return (
    <div
      ref={ref}
      className={classNames('two-column-layout', `two-column-layout--${variant}`, className)}
      style={leftStyle}
      {...props}
    >
      {/* Left panel */}
      <div
        className={classNames(
          'two-column-layout__left',
          stickyLeft && 'two-column-layout__left--sticky'
        )}
      >
        {left}
      </div>

      {/* Right panel */}
      <div
        className={classNames(
          'two-column-layout__right',
          stickyRight && 'two-column-layout__right--sticky'
        )}
      >
        {right}
      </div>
    </div>
  )
})

export default TwoColumnLayout
