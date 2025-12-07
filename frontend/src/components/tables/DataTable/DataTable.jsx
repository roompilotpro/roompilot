import { forwardRef, useState, useCallback } from 'react'
import classNames from '../../../utils/classNames'
import { Checkbox } from '../../forms'
import { Skeleton } from '../../primitives'

// Alignment styles
const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

/**
 * DataTable - Reusable data table with sorting, selection, and pagination
 *
 * @param {Array} columns - Column definitions { key, label, sortable?, render?, width?, align? }
 * @param {Array} data - Array of row objects
 * @param {boolean} [sortable=false] - Enable column sorting
 * @param {Object} [sortConfig] - Current sort state { key, direction }
 * @param {Function} [onSort] - Sort change handler (key, direction)
 * @param {boolean} [selectable=false] - Enable row selection with checkboxes
 * @param {Array} [selectedIds=[]] - Currently selected row IDs
 * @param {Function} [onSelect] - Selection change handler (selectedIds)
 * @param {string} [rowKey='id'] - Property to use as row identifier
 * @param {Function} [onRowClick] - Row click handler (row, index)
 * @param {ReactNode} [emptyState] - Content to show when no data
 * @param {boolean} [loading=false] - Show loading skeleton
 * @param {number} [loadingRows=5] - Number of skeleton rows to show
 * @param {boolean} [stickyHeader=false] - Make header sticky
 * @param {string} [className] - Additional CSS classes
 */
const DataTable = forwardRef(function DataTable(
  {
    columns = [],
    data = [],
    sortable = false,
    sortConfig,
    onSort,
    selectable = false,
    selectedIds = [],
    onSelect,
    rowKey = 'id',
    onRowClick,
    emptyState,
    loading = false,
    loadingRows = 5,
    stickyHeader = false,
    className,
    ...props
  },
  ref
) {
  const [internalSort, setInternalSort] = useState({ key: null, direction: 'asc' })

  const currentSort = sortConfig || internalSort

  const handleSort = useCallback(
    (key) => {
      if (!sortable) return

      const column = columns.find((col) => col.key === key)
      if (!column?.sortable) return

      const newDirection =
        currentSort.key === key && currentSort.direction === 'asc' ? 'desc' : 'asc'

      if (onSort) {
        onSort(key, newDirection)
      } else {
        setInternalSort({ key, direction: newDirection })
      }
    },
    [sortable, columns, currentSort, onSort]
  )

  const handleSelectAll = useCallback(() => {
    if (!onSelect) return

    const allIds = data.map((row) => row[rowKey])
    const allSelected = allIds.every((id) => selectedIds.includes(id))

    if (allSelected) {
      onSelect([])
    } else {
      onSelect(allIds)
    }
  }, [data, rowKey, selectedIds, onSelect])

  const handleSelectRow = useCallback(
    (row) => {
      if (!onSelect) return

      const id = row[rowKey]
      const isSelected = selectedIds.includes(id)

      if (isSelected) {
        onSelect(selectedIds.filter((selectedId) => selectedId !== id))
      } else {
        onSelect([...selectedIds, id])
      }
    },
    [rowKey, selectedIds, onSelect]
  )

  const handleRowClick = useCallback(
    (row, index, event) => {
      // Don't trigger row click if clicking on checkbox or interactive element
      if (event.target.closest('input, button, a')) return
      onRowClick?.(row, index)
    },
    [onRowClick]
  )

  const isAllSelected = data.length > 0 && data.every((row) => selectedIds.includes(row[rowKey]))
  const isSomeSelected = data.some((row) => selectedIds.includes(row[rowKey])) && !isAllSelected

  const getSortIcon = (key) => {
    if (currentSort.key !== key) return '↕'
    return currentSort.direction === 'asc' ? '↑' : '↓'
  }

  // Sort data internally if no external sort handler
  const sortedData =
    !onSort && currentSort.key
      ? [...data].sort((a, b) => {
          const aVal = a[currentSort.key]
          const bVal = b[currentSort.key]

          if (aVal === bVal) return 0
          if (aVal == null) return 1
          if (bVal == null) return -1

          const comparison = aVal < bVal ? -1 : 1
          return currentSort.direction === 'asc' ? comparison : -comparison
        })
      : data

  const renderCell = (row, column, rowIndex) => {
    if (column.render) {
      return column.render(row[column.key], row, rowIndex)
    }
    return row[column.key]
  }

  const renderLoadingSkeleton = () => (
    <>
      {Array.from({ length: loadingRows }).map((_, rowIndex) => (
        <tr key={`skeleton-${rowIndex}`} className="border-b border-cloud">
          {selectable && (
            <td className="w-12 px-4 py-3">
              <Skeleton variant="circular" width={20} height={20} />
            </td>
          )}
          {columns.map((column) => (
            <td
              key={column.key}
              className={classNames(
                'px-4 py-3 font-body text-sm text-charcoal',
                column.align && alignStyles[column.align]
              )}
            >
              <Skeleton variant="text" width="80%" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )

  const renderEmptyState = () => (
    <tr>
      <td colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-12">
        {emptyState || (
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">📋</span>
            <p className="text-sm text-slate">No data available</p>
          </div>
        )}
      </td>
    </tr>
  )

  return (
    <div ref={ref} className={classNames('overflow-x-auto', className)} {...props}>
      <table className="w-full border-collapse" role="grid">
        <thead
          className={classNames(
            'bg-snow border-b border-cloud',
            stickyHeader && 'sticky top-0 z-10'
          )}
        >
          <tr>
            {selectable && (
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isSomeSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((column) => {
              const isSortable = sortable && column.sortable !== false
              return (
                <th
                  key={column.key}
                  className={classNames(
                    'px-4 py-3 font-body text-xs font-semibold text-slate uppercase tracking-wider',
                    isSortable && 'cursor-pointer hover:bg-cloud/50 select-none',
                    column.align ? alignStyles[column.align] : 'text-left'
                  )}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={isSortable ? () => handleSort(column.key) : undefined}
                  aria-sort={
                    currentSort.key === column.key
                      ? currentSort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    {column.label}
                    {isSortable && <span className="text-mist">{getSortIcon(column.key)}</span>}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {loading
            ? renderLoadingSkeleton()
            : sortedData.length === 0
              ? renderEmptyState()
              : sortedData.map((row, rowIndex) => {
                  const rowId = row[rowKey]
                  const isSelected = selectedIds.includes(rowId)

                  return (
                    <tr
                      key={rowId ?? rowIndex}
                      className={classNames(
                        'border-b border-cloud hover:bg-snow transition-colors',
                        isSelected && 'bg-primary-bg',
                        onRowClick && 'cursor-pointer'
                      )}
                      onClick={onRowClick ? (e) => handleRowClick(row, rowIndex, e) : undefined}
                      role="row"
                      aria-selected={selectable ? isSelected : undefined}
                    >
                      {selectable && (
                        <td className="w-12 px-4 py-3">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelectRow(row)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Select row ${rowIndex + 1}`}
                          />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={classNames(
                            'px-4 py-3 font-body text-sm text-charcoal',
                            column.align && alignStyles[column.align]
                          )}
                        >
                          {renderCell(row, column, rowIndex)}
                        </td>
                      ))}
                    </tr>
                  )
                })}
        </tbody>
      </table>
    </div>
  )
})

export default DataTable
