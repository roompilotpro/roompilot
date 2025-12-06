import { forwardRef, useState, useCallback } from 'react'
import classNames from '../../../utils/classNames'
import { Checkbox } from '../../forms'
import { Skeleton } from '../../primitives'
import './DataTable.css'

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
        <tr key={`skeleton-${rowIndex}`} className="data-table__row">
          {selectable && (
            <td className="data-table__cell data-table__cell--checkbox">
              <Skeleton variant="circular" width={20} height={20} />
            </td>
          )}
          {columns.map((column) => (
            <td
              key={column.key}
              className={classNames(
                'data-table__cell',
                column.align && `data-table__cell--${column.align}`
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
      <td colSpan={columns.length + (selectable ? 1 : 0)} className="data-table__empty">
        {emptyState || (
          <div className="data-table__empty-default">
            <span className="data-table__empty-icon">📋</span>
            <p className="data-table__empty-text">No data available</p>
          </div>
        )}
      </td>
    </tr>
  )

  return (
    <div ref={ref} className={classNames('data-table', className)} {...props}>
      <table className="data-table__table" role="grid">
        <thead
          className={classNames('data-table__header', stickyHeader && 'data-table__header--sticky')}
        >
          <tr className="data-table__header-row">
            {selectable && (
              <th className="data-table__header-cell data-table__header-cell--checkbox">
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
                    'data-table__header-cell',
                    isSortable && 'data-table__header-cell--sortable',
                    column.align && `data-table__header-cell--${column.align}`
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
                  <span className="data-table__header-content">
                    {column.label}
                    {isSortable && (
                      <span className="data-table__sort-icon">{getSortIcon(column.key)}</span>
                    )}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="data-table__body">
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
                        'data-table__row',
                        isSelected && 'data-table__row--selected',
                        onRowClick && 'data-table__row--clickable'
                      )}
                      onClick={onRowClick ? (e) => handleRowClick(row, rowIndex, e) : undefined}
                      role="row"
                      aria-selected={selectable ? isSelected : undefined}
                    >
                      {selectable && (
                        <td className="data-table__cell data-table__cell--checkbox">
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
                            'data-table__cell',
                            column.align && `data-table__cell--${column.align}`
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
