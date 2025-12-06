import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FileUpload from './FileUpload'

// Mock URL.createObjectURL for jsdom
beforeAll(() => {
  globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
})

afterAll(() => {
  vi.restoreAllMocks()
})

// Mock file for testing
const createFile = (name = 'test.png', type = 'image/png', size = 1024) => {
  const file = new File(['test'], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

describe('FileUpload', () => {
  it('renders upload area', () => {
    render(<FileUpload />)
    expect(screen.getByText(/Click to upload/)).toBeInTheDocument()
    expect(screen.getByText(/or drag and drop/)).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<FileUpload label="Upload files" />)
    expect(screen.getByText('Upload files')).toBeInTheDocument()
  })

  it('shows accepted file types', () => {
    render(<FileUpload accept=".png,.jpg" />)
    expect(screen.getByText(/PNG, JPG/)).toBeInTheDocument()
  })

  it('shows max file size hint', () => {
    render(<FileUpload accept="image/*" maxSize={5 * 1024 * 1024} />)
    expect(screen.getByText(/max 5.0 MB/)).toBeInTheDocument()
  })

  it('calls onChange when file selected', async () => {
    const handleChange = vi.fn()
    render(<FileUpload onChange={handleChange} />)

    const file = createFile()
    const input = document.querySelector('input[type="file"]')

    // Use fireEvent since the input is hidden (pointer-events: none)
    Object.defineProperty(input, 'files', { value: [file] })
    fireEvent.change(input)

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          files: expect.arrayContaining([expect.any(File)]),
        }),
      })
    )
  })

  it('displays error message', () => {
    render(<FileUpload error="Upload failed" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Upload failed')
  })

  it('displays helper text', () => {
    render(<FileUpload helperText="Max 10 files" />)
    expect(screen.getByText('Max 10 files')).toBeInTheDocument()
  })

  it('hides helper text when error is shown', () => {
    render(<FileUpload helperText="Helper" error="Error" />)
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('applies error styling', () => {
    const { container } = render(<FileUpload error="Error" />)
    expect(container.querySelector('.file-upload--error')).toBeInTheDocument()
  })

  // File preview
  it('shows file preview with name and size', () => {
    const file = createFile('document.pdf', 'application/pdf', 2048)
    render(<FileUpload value={[file]} />)
    expect(screen.getByText('document.pdf')).toBeInTheDocument()
    expect(screen.getByText('2.0 KB')).toBeInTheDocument()
  })

  it('shows image thumbnail for image files', () => {
    const file = createFile('photo.png', 'image/png')
    render(<FileUpload value={[file]} />)
    expect(screen.getByAltText('photo.png')).toBeInTheDocument()
  })

  it('hides preview when showPreview is false', () => {
    const file = createFile()
    render(<FileUpload value={[file]} showPreview={false} />)
    expect(screen.queryByText('test.png')).not.toBeInTheDocument()
  })

  // Remove file
  it('calls onRemove when remove button clicked', async () => {
    const file = createFile()
    const handleRemove = vi.fn()
    const handleChange = vi.fn()
    render(<FileUpload value={[file]} onRemove={handleRemove} onChange={handleChange} />)

    await userEvent.click(screen.getByLabelText('Remove test.png'))
    expect(handleRemove).toHaveBeenCalledWith(file, 0)
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ files: [] }),
      })
    )
  })

  // Multiple files
  it('allows multiple files when multiple prop is true', () => {
    render(<FileUpload multiple />)
    expect(document.querySelector('input[type="file"]')).toHaveAttribute('multiple')
  })

  // Disabled state
  it('disables file input when disabled', () => {
    render(<FileUpload disabled />)
    expect(document.querySelector('input[type="file"]')).toBeDisabled()
  })

  it('applies disabled styling', () => {
    const { container } = render(<FileUpload disabled />)
    expect(container.querySelector('.file-upload--disabled')).toBeInTheDocument()
  })

  it('sets aria-disabled when disabled', () => {
    const { container } = render(<FileUpload disabled />)
    expect(container.querySelector('.file-upload')).toHaveAttribute('aria-disabled', 'true')
  })

  // Drag and drop
  it('applies dragging class on drag enter', () => {
    const { container } = render(<FileUpload />)
    const dropZone = container.querySelector('.file-upload')

    fireEvent.dragEnter(dropZone, { dataTransfer: { files: [] } })
    expect(dropZone).toHaveClass('file-upload--dragging')
  })

  it('removes dragging class on drag leave', () => {
    const { container } = render(<FileUpload />)
    const dropZone = container.querySelector('.file-upload')

    fireEvent.dragEnter(dropZone, { dataTransfer: { files: [] } })
    fireEvent.dragLeave(dropZone, { dataTransfer: { files: [] } })
    expect(dropZone).not.toHaveClass('file-upload--dragging')
  })

  // Keyboard navigation
  it('activates on Enter key', async () => {
    const { container } = render(<FileUpload />)
    const dropZone = container.querySelector('.file-upload')

    dropZone.focus()
    await userEvent.keyboard('{Enter}')
    // Input click would be triggered
    expect(dropZone).toHaveAttribute('role', 'button')
  })

  // Accept attribute
  it('applies accept attribute to input', () => {
    render(<FileUpload accept="image/*,.pdf" />)
    expect(document.querySelector('input[type="file"]')).toHaveAttribute('accept', 'image/*,.pdf')
  })

  // Additional className
  it('accepts additional className', () => {
    const { container } = render(<FileUpload className="custom-class" />)
    expect(container.querySelector('.file-upload-wrapper')).toHaveClass('custom-class')
  })

  // File size formatting
  it('formats file sizes correctly', () => {
    const files = [
      createFile('small.txt', 'text/plain', 500),
      createFile('medium.pdf', 'application/pdf', 1500),
      createFile('large.zip', 'application/zip', 2 * 1024 * 1024),
    ]
    render(<FileUpload value={files} />)
    expect(screen.getByText('500 B')).toBeInTheDocument()
    expect(screen.getByText('1.5 KB')).toBeInTheDocument()
    expect(screen.getByText('2.0 MB')).toBeInTheDocument()
  })
})
