import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DataTable from './DataTable'

const mockColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status', sortable: true },
]

const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
]

describe('DataTable', () => {
  // Basic rendering
  it('renders the table', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders data rows', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(4) // 1 header + 3 data rows
  })

  // Empty state
  it('renders default empty state when no data', () => {
    render(<DataTable columns={mockColumns} data={[]} />)
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('renders custom empty state', () => {
    render(
      <DataTable columns={mockColumns} data={[]} emptyState={<div>Custom empty message</div>} />
    )
    expect(screen.getByText('Custom empty message')).toBeInTheDocument()
  })

  // Loading state
  it('renders loading skeleton', () => {
    const { container } = render(
      <DataTable columns={mockColumns} data={[]} loading loadingRows={3} />
    )
    const skeletons = container.querySelectorAll('.skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  // Sorting
  it('renders sort icons on sortable columns', () => {
    render(<DataTable columns={mockColumns} data={mockData} sortable />)
    const nameHeader = screen.getByText('Name').closest('th')
    expect(nameHeader.querySelector('.data-table__sort-icon')).toBeInTheDocument()
  })

  it('calls onSort when sortable header is clicked', () => {
    const handleSort = vi.fn()
    render(<DataTable columns={mockColumns} data={mockData} sortable onSort={handleSort} />)
    fireEvent.click(screen.getByText('Name'))
    expect(handleSort).toHaveBeenCalledWith('name', 'asc')
  })

  it('toggles sort direction on repeated clicks', () => {
    const handleSort = vi.fn()
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        sortable
        sortConfig={{ key: 'name', direction: 'asc' }}
        onSort={handleSort}
      />
    )
    fireEvent.click(screen.getByText('Name'))
    expect(handleSort).toHaveBeenCalledWith('name', 'desc')
  })

  it('sets aria-sort attribute on sorted column', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        sortable
        sortConfig={{ key: 'name', direction: 'asc' }}
      />
    )
    const nameHeader = screen.getByText('Name').closest('th')
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
  })

  it('sorts data internally when no onSort provided', () => {
    render(<DataTable columns={mockColumns} data={mockData} sortable />)
    fireEvent.click(screen.getByText('Name'))

    const rows = screen.getAllByRole('row')
    // First row is header, second should be Bob (alphabetically first)
    expect(rows[1]).toHaveTextContent('Bob Johnson')
  })

  // Selection
  it('renders checkboxes when selectable', () => {
    render(<DataTable columns={mockColumns} data={mockData} selectable />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(4) // 1 select all + 3 rows
  })

  it('calls onSelect when row checkbox is clicked', () => {
    const handleSelect = vi.fn()
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        selectable
        selectedIds={[]}
        onSelect={handleSelect}
      />
    )
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1]) // First row checkbox
    expect(handleSelect).toHaveBeenCalledWith([1])
  })

  it('calls onSelect with empty array when deselecting row', () => {
    const handleSelect = vi.fn()
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        selectable
        selectedIds={[1]}
        onSelect={handleSelect}
      />
    )
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1]) // First row checkbox
    expect(handleSelect).toHaveBeenCalledWith([])
  })

  it('selects all rows when header checkbox is clicked', () => {
    const handleSelect = vi.fn()
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        selectable
        selectedIds={[]}
        onSelect={handleSelect}
      />
    )
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0]) // Header checkbox
    expect(handleSelect).toHaveBeenCalledWith([1, 2, 3])
  })

  it('deselects all when header checkbox clicked and all selected', () => {
    const handleSelect = vi.fn()
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        selectable
        selectedIds={[1, 2, 3]}
        onSelect={handleSelect}
      />
    )
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0]) // Header checkbox
    expect(handleSelect).toHaveBeenCalledWith([])
  })

  it('applies selected class to selected rows', () => {
    const { container } = render(
      <DataTable columns={mockColumns} data={mockData} selectable selectedIds={[1]} />
    )
    expect(container.querySelector('.data-table__row--selected')).toBeInTheDocument()
  })

  // Row click
  it('calls onRowClick when row is clicked', () => {
    const handleRowClick = vi.fn()
    render(<DataTable columns={mockColumns} data={mockData} onRowClick={handleRowClick} />)
    fireEvent.click(screen.getByText('John Doe').closest('tr'))
    expect(handleRowClick).toHaveBeenCalledWith(mockData[0], 0)
  })

  it('applies clickable class when onRowClick provided', () => {
    const { container } = render(
      <DataTable columns={mockColumns} data={mockData} onRowClick={() => {}} />
    )
    expect(container.querySelector('.data-table__row--clickable')).toBeInTheDocument()
  })

  it('does not trigger row click when clicking checkbox', () => {
    const handleRowClick = vi.fn()
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        selectable
        selectedIds={[]}
        onSelect={() => {}}
        onRowClick={handleRowClick}
      />
    )
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1])
    expect(handleRowClick).not.toHaveBeenCalled()
  })

  // Custom cell render
  it('uses custom render function for cells', () => {
    const columnsWithRender = [
      ...mockColumns,
      {
        key: 'actions',
        label: 'Actions',
        render: () => <button>Edit</button>,
      },
    ]
    render(<DataTable columns={columnsWithRender} data={mockData} />)
    expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(3)
  })

  // Column alignment
  it('applies alignment classes to cells', () => {
    const columnsWithAlign = [
      { key: 'name', label: 'Name' },
      { key: 'amount', label: 'Amount', align: 'right' },
    ]
    const dataWithAmount = [{ id: 1, name: 'Test', amount: '$100' }]
    const { container } = render(<DataTable columns={columnsWithAlign} data={dataWithAmount} />)
    expect(container.querySelector('.data-table__cell--right')).toBeInTheDocument()
  })

  // Column width
  it('applies custom column width', () => {
    const columnsWithWidth = [{ key: 'name', label: 'Name', width: '200px' }]
    render(<DataTable columns={columnsWithWidth} data={mockData} />)
    const header = screen.getByText('Name').closest('th')
    expect(header).toHaveStyle({ width: '200px' })
  })

  // Sticky header
  it('applies sticky class when stickyHeader is true', () => {
    const { container } = render(<DataTable columns={mockColumns} data={mockData} stickyHeader />)
    expect(container.querySelector('.data-table__header--sticky')).toBeInTheDocument()
  })

  // Custom row key
  it('uses custom rowKey for identification', () => {
    const dataWithCustomKey = [
      { uniqueId: 'a', name: 'Test' },
      { uniqueId: 'b', name: 'Test 2' },
    ]
    const handleSelect = vi.fn()
    render(
      <DataTable
        columns={[{ key: 'name', label: 'Name' }]}
        data={dataWithCustomKey}
        rowKey="uniqueId"
        selectable
        selectedIds={['a']}
        onSelect={handleSelect}
      />
    )
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[1]).toBeChecked()
  })

  // Accessibility
  it('has accessible checkbox labels', () => {
    render(<DataTable columns={mockColumns} data={mockData} selectable />)
    expect(screen.getByLabelText('Select all rows')).toBeInTheDocument()
    expect(screen.getByLabelText('Select row 1')).toBeInTheDocument()
  })

  it('sets aria-selected on selectable rows', () => {
    render(<DataTable columns={mockColumns} data={mockData} selectable selectedIds={[1]} />)
    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveAttribute('aria-selected', 'true')
    expect(rows[2]).toHaveAttribute('aria-selected', 'false')
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(
      <DataTable columns={mockColumns} data={mockData} className="custom-table" />
    )
    expect(container.querySelector('.data-table')).toHaveClass('custom-table')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<DataTable ref={ref} columns={mockColumns} data={mockData} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('data-table')
  })
})
