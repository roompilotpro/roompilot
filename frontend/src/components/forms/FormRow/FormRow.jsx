import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import './FormRow.css'

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

  return (
    <div
      ref={ref}
      className={classNames(
        'form-row',
        `form-row--gap-${gap}`,
        responsive && 'form-row--responsive',
        className
      )}
      style={{ '--form-row-columns': gridColumns }}
      {...props}
    >
      {children}
    </div>
  )
})

export default FormRow
