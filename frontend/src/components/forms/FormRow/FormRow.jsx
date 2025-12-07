import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'

// Gap variant styles
const gapStyles = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
}

/**
 * FormRow component - side-by-side form inputs
 *
 * @param {Object} props
 * @param {number|string} [props.columns=2] - Number of columns or custom grid template
 * @param {string} [props.gap='md'] - Gap between columns: 'sm' | 'md' | 'lg'
 * @param {boolean} [props.responsive=true] - Whether to stack on mobile
 * @param {React.ReactNode} props.children - Form elements
 * @param {string} [props.className] - Additional CSS classes
 */
const FormRow = forwardRef(function FormRow(
  { columns = 2, gap = 'md', responsive = true, children, className, ...props },
  ref
) {
  const gridColumns = typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns

  // For responsive, stack on mobile (< 640px) and use columns on larger screens
  const gridStyle = responsive
    ? { gridTemplateColumns: '1fr' }
    : { gridTemplateColumns: gridColumns }

  return (
    <div
      ref={ref}
      className={classNames(
        'grid',
        gapStyles[gap],
        // Use sm: breakpoint for the columns when responsive
        responsive && 'sm:[grid-template-columns:var(--form-row-cols)]',
        className
      )}
      style={{
        ...gridStyle,
        '--form-row-cols': gridColumns,
      }}
      {...props}
    >
      {children}
    </div>
  )
})

export default FormRow
