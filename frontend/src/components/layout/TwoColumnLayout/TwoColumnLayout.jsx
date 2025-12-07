import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'

// Variant styles
const variantStyles = {
  default: {
    container: '',
    left: '',
    right: '',
  },
  messages: {
    container: 'h-[calc(100vh-72px)]',
    left: 'bg-white border-r border-cloud',
    right: 'bg-snow',
  },
  search: {
    container: 'gap-6 lg:flex-col',
    left: 'lg:w-full lg:order-1 w-80 bg-white rounded-lg border border-cloud h-fit',
    right: 'lg:order-2 lg:w-full overflow-visible',
  },
}

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
 * @param {boolean} [props.showRight=false] - Show right panel on mobile (for messages)
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
    showRight = false,
    className,
    ...props
  },
  ref
) {
  const computedLeftWidth = typeof leftWidth === 'number' ? `${leftWidth}px` : leftWidth
  const vStyles = variantStyles[variant]

  return (
    <div
      ref={ref}
      className={classNames(
        'flex h-full min-h-0 overflow-hidden md:flex-col',
        vStyles.container,
        className
      )}
      {...props}
    >
      {/* Left panel */}
      <div
        className={classNames(
          'shrink-0 flex flex-col overflow-hidden md:w-full md:h-auto md:max-h-[50vh]',
          stickyLeft && 'sticky top-0 h-screen md:relative md:h-auto',
          vStyles.left,
          variant === 'messages' && !showRight && 'md:block md:max-h-none',
          variant === 'messages' && showRight && 'md:hidden'
        )}
        style={{ width: variant === 'search' ? undefined : computedLeftWidth }}
      >
        {left}
      </div>

      {/* Right panel */}
      <div
        className={classNames(
          'flex-1 flex flex-col min-w-0 overflow-hidden md:flex-1 md:h-auto md:min-h-[50vh]',
          stickyRight && 'sticky top-0 h-screen md:relative md:h-auto',
          vStyles.right,
          variant === 'messages' && !showRight && 'md:hidden',
          variant === 'messages' && showRight && 'md:flex'
        )}
      >
        {right}
      </div>
    </div>
  )
})

export default TwoColumnLayout
