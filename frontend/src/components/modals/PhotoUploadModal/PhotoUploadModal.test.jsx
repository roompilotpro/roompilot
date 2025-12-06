import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PhotoUploadModal from './PhotoUploadModal'

describe('PhotoUploadModal', () => {
  // Basic rendering
  it('renders when isOpen is true', () => {
    render(<PhotoUploadModal isOpen={true} onClose={() => {}} onSave={() => {}} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Upload Photos')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<PhotoUploadModal isOpen={false} onClose={() => {}} onSave={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // Title and subtitle
  it('displays subtitle with max photos', () => {
    render(<PhotoUploadModal isOpen={true} onClose={() => {}} onSave={() => {}} maxPhotos={5} />)
    expect(screen.getByText('Add up to 5 photos')).toBeInTheDocument()
  })

  // Dropzone
  it('renders dropzone', () => {
    render(<PhotoUploadModal isOpen={true} onClose={() => {}} onSave={() => {}} />)
    expect(screen.getByLabelText('Upload photos')).toBeInTheDocument()
  })

  it('shows drag over state', () => {
    render(<PhotoUploadModal isOpen={true} onClose={() => {}} onSave={() => {}} />)
    const dropzone = screen.getByLabelText('Upload photos')

    fireEvent.dragEnter(dropzone)
    expect(dropzone).toHaveClass('photo-upload-modal__dropzone--dragover')

    fireEvent.dragLeave(dropzone)
    expect(dropzone).not.toHaveClass('photo-upload-modal__dropzone--dragover')
  })

  // File input
  it('has hidden file input', () => {
    render(<PhotoUploadModal isOpen={true} onClose={() => {}} onSave={() => {}} />)
    const input = document.body.querySelector('.photo-upload-modal__input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'file')
    expect(input).toHaveAttribute('multiple')
  })

  // Initial photos
  it('renders initial photos', () => {
    const initialPhotos = [
      { id: '1', src: '/photo1.jpg', isCover: true },
      { id: '2', src: '/photo2.jpg' },
    ]
    render(
      <PhotoUploadModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        initialPhotos={initialPhotos}
      />
    )
    const photos = document.body.querySelectorAll('.photo-upload-modal__photo')
    expect(photos).toHaveLength(2)
  })

  // Cover badge
  it('displays cover badge on cover photo', () => {
    const initialPhotos = [{ id: '1', src: '/photo1.jpg', isCover: true }]
    render(
      <PhotoUploadModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        initialPhotos={initialPhotos}
      />
    )
    expect(screen.getByText('Cover')).toBeInTheDocument()
  })

  // Delete photo
  it('can delete photos', () => {
    const initialPhotos = [
      { id: '1', src: '/photo1.jpg', isCover: true },
      { id: '2', src: '/photo2.jpg' },
    ]
    render(
      <PhotoUploadModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        initialPhotos={initialPhotos}
      />
    )

    // Hover to show overlay, then click delete
    const photos = document.body.querySelectorAll('.photo-upload-modal__photo')
    expect(photos).toHaveLength(2)

    const deleteButtons = screen.getAllByLabelText('Delete photo')
    fireEvent.click(deleteButtons[0])

    const remainingPhotos = document.body.querySelectorAll('.photo-upload-modal__photo')
    expect(remainingPhotos).toHaveLength(1)
  })

  // Set cover
  it('can set cover photo', () => {
    const initialPhotos = [
      { id: '1', src: '/photo1.jpg', isCover: true },
      { id: '2', src: '/photo2.jpg' },
    ]
    render(
      <PhotoUploadModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        initialPhotos={initialPhotos}
      />
    )

    const setCoverButton = screen.getByLabelText('Set as cover')
    fireEvent.click(setCoverButton)

    // Second photo should now be cover (only one Set as cover button for non-cover photos)
    const coverBadges = screen.getAllByText('Cover')
    expect(coverBadges).toHaveLength(1)
  })

  // Photo count
  it('displays photo count', () => {
    const initialPhotos = [
      { id: '1', src: '/photo1.jpg' },
      { id: '2', src: '/photo2.jpg' },
    ]
    render(
      <PhotoUploadModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        initialPhotos={initialPhotos}
        maxPhotos={10}
      />
    )
    expect(screen.getByText('2 of 10 photos')).toBeInTheDocument()
  })

  // Minimum photos warning
  it('shows minimum photos warning', () => {
    render(
      <PhotoUploadModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        initialPhotos={[]}
        minPhotos={3}
      />
    )
    // No photos, no count shown
    expect(screen.queryByText(/minimum/i)).not.toBeInTheDocument()

    // Add one photo
    const initialPhotos = [{ id: '1', src: '/photo1.jpg' }]
    render(
      <PhotoUploadModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        initialPhotos={initialPhotos}
        minPhotos={3}
      />
    )
    expect(screen.getByText('(minimum 3 required)')).toBeInTheDocument()
  })

  // Save button disabled
  it('disables save button when below minimum photos', () => {
    render(
      <PhotoUploadModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        initialPhotos={[]}
        minPhotos={1}
      />
    )
    expect(screen.getByRole('button', { name: 'Save Photos' })).toBeDisabled()
  })

  it('enables save button when minimum photos met', () => {
    render(
      <PhotoUploadModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        initialPhotos={[{ id: '1', src: '/photo1.jpg' }]}
        minPhotos={1}
      />
    )
    expect(screen.getByRole('button', { name: 'Save Photos' })).not.toBeDisabled()
  })

  // Save callback
  it('calls onSave with photos when save clicked', () => {
    const handleSave = vi.fn()
    const initialPhotos = [{ id: '1', src: '/photo1.jpg', isCover: true }]
    render(
      <PhotoUploadModal
        isOpen={true}
        onClose={() => {}}
        onSave={handleSave}
        initialPhotos={initialPhotos}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Save Photos' }))
    expect(handleSave).toHaveBeenCalledWith(initialPhotos)
  })

  // Cancel button
  it('calls onClose when cancel clicked', () => {
    const handleClose = vi.fn()
    render(<PhotoUploadModal isOpen={true} onClose={handleClose} onSave={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  // Info items
  it('renders info items', () => {
    render(
      <PhotoUploadModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        infoItems={['High quality photos preferred', 'Show the best features']}
      />
    )
    expect(screen.getByText('High quality photos preferred')).toBeInTheDocument()
    expect(screen.getByText('Show the best features')).toBeInTheDocument()
  })

  // Accessibility
  it('has dialog role', () => {
    render(<PhotoUploadModal isOpen={true} onClose={() => {}} onSave={() => {}} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal attribute', () => {
    render(<PhotoUploadModal isOpen={true} onClose={() => {}} onSave={() => {}} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  // Custom className
  it('accepts custom className', () => {
    render(
      <PhotoUploadModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        className="custom-upload"
      />
    )
    expect(document.body.querySelector('.modal')).toHaveClass('custom-upload')
  })

  // Ref forwarding
  it('forwards ref to modal container', () => {
    const ref = { current: null }
    render(<PhotoUploadModal ref={ref} isOpen={true} onClose={() => {}} onSave={() => {}} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('modal')
  })

  // Close on escape
  it('closes on Escape key', () => {
    const handleClose = vi.fn()
    render(<PhotoUploadModal isOpen={true} onClose={handleClose} onSave={() => {}} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
