import { forwardRef, useMemo } from 'react'
import classNames from '../../../utils/classNames'

// Size variants
const sizeStyles = {
  sm: { btn: 'min-w-7 h-7 text-xs', ellipsis: 'w-7 h-7 text-xs' },
  md: { btn: 'min-w-9 h-9 text-sm sm:min-w-8 sm:h-8', ellipsis: 'w-9 h-9 text-sm' },
  lg: {
    btn: 'min-w-11 h-11 text-base sm:min-w-8 sm:h-8 sm:text-sm',
    ellipsis: 'w-11 h-11 text-base',
  },
}

/**
 * Pagination - Page navigation component
 *
 * @param {number} currentPage - Current active page (1-based)
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Callback when page changes, receives page number
 * @param {number} [siblingCount=1] - Number of page buttons to show on each side of current
 * @param {boolean} [showFirstLast=true] - Show first/last page buttons
 * @param {boolean} [showPrevNext=true] - Show previous/next buttons
 * @param {string} [size='md'] - Size: 'sm' | 'md' | 'lg'
 * @param {string} [className] - Additional CSS classes
 */
const Pagination = forwardRef(function Pagination(
  {
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    siblingCount = 1,
    showFirstLast = true,
    showPrevNext = true,
    size = 'md',
    className,
    ...props
  },
  ref
) {
  const pages = useMemo(() => {
    const range = (start, end) => {
      const result = []
      for (let i = start; i <= end; i++) {
        result.push(i)
      }
      return result
    }

    // Total page buttons to show (sibling pages on each side + current)
    const totalPageNumbers = siblingCount * 2 + 5 // siblings + first + last + current + 2 ellipses

    // Case 1: If total pages is less than page buttons to show
    if (totalPages <= totalPageNumbers - 2) {
      return range(1, totalPages)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const showLeftEllipsis = leftSiblingIndex > 2
    const showRightEllipsis = rightSiblingIndex < totalPages - 1

    // Case 2: No left ellipsis, but right ellipsis
    if (!showLeftEllipsis && showRightEllipsis) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)
      return [...leftRange, 'ellipsis-right', totalPages]
    }

    // Case 3: Left ellipsis, but no right ellipsis
    if (showLeftEllipsis && !showRightEllipsis) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(totalPages - rightItemCount + 1, totalPages)
      return [1, 'ellipsis-left', ...rightRange]
    }

    // Case 4: Both ellipses
    const middleRange = range(leftSiblingIndex, rightSiblingIndex)
    return [1, 'ellipsis-left', ...middleRange, 'ellipsis-right', totalPages]
  }, [currentPage, totalPages, siblingCount])

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange?.(page)
    }
  }

  if (totalPages <= 1) {
    return null
  }

  const styles = sizeStyles[size]
  const btnBase = classNames(
    'inline-flex items-center justify-center bg-white border border-cloud rounded-md font-medium text-charcoal cursor-pointer transition-all duration-150',
    'hover:not-disabled:not-active:bg-snow hover:not-disabled:not-active:border-slate',
    'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    styles.btn
  )

  return (
    <nav
      ref={ref}
      className={classNames('flex items-center gap-1 sm:gap-0.5', className)}
      aria-label="Pagination"
      {...props}
    >
      {/* First page button */}
      {showFirstLast && (
        <button
          type="button"
          className={classNames(btnBase, 'font-bold sm:hidden')}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          «
        </button>
      )}

      {/* Previous button */}
      {showPrevNext && (
        <button
          type="button"
          className={classNames(btnBase, 'font-bold')}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          ‹
        </button>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1 sm:gap-0.5">
        {pages.map((page) => {
          if (typeof page === 'string') {
            return (
              <span
                key={page}
                className={classNames(
                  'inline-flex items-center justify-center text-slate select-none',
                  styles.ellipsis
                )}
                aria-hidden="true"
              >
                …
              </span>
            )
          }

          return (
            <button
              key={page}
              type="button"
              className={classNames(
                btnBase,
                page === currentPage && 'bg-primary border-primary text-white hover:bg-primary/90'
              )}
              onClick={() => handlePageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next button */}
      {showPrevNext && (
        <button
          type="button"
          className={classNames(btnBase, 'font-bold')}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          ›
        </button>
      )}

      {/* Last page button */}
      {showFirstLast && (
        <button
          type="button"
          className={classNames(btnBase, 'font-bold sm:hidden')}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          »
        </button>
      )}
    </nav>
  )
})

export default Pagination
