import { classNames } from '../../../utils/classNames'
import './Skeleton.css'

/**
 * Skeleton component for loading placeholders
 *
 * @param {Object} props
 * @param {'text'|'circle'|'rect'} [props.variant='text'] - Shape variant
 * @param {string|number} [props.width] - Width (default: 100% for text/rect)
 * @param {string|number} [props.height] - Height
 * @param {boolean} [props.animate=true] - Whether to show pulse animation
 * @param {string} [props.className] - Additional CSS classes
 */
function Skeleton({ variant = 'text', width, height, animate = true, className, ...props }) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div
      aria-hidden="true"
      className={classNames(
        'skeleton',
        `skeleton--${variant}`,
        animate && 'skeleton--animate',
        className
      )}
      style={style}
      {...props}
    />
  )
}

export default Skeleton
