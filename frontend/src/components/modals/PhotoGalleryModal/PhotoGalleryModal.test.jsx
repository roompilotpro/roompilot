import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PhotoGalleryModal from './PhotoGalleryModal'

const mockImages = [
  { id: '1', src: '/photo1.jpg', caption: 'Photo 1', thumbnail: '/thumb1.jpg' },
  { id: '2', src: '/photo2.jpg', caption: 'Photo 2', thumbnail: '/thumb2.jpg' },
  { id: '3', src: '/photo3.jpg' },
]

describe('PhotoGalleryModal', () => {
  // Basic rendering
  it('renders when isOpen is true', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<PhotoGalleryModal isOpen={false} onClose={() => {}} images={mockImages} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('does not render when images array is empty', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={[]} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // Image display
  it('displays the first image by default', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} />)
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument()
  })

  it('displays image at initialIndex', () => {
    render(
      <PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} initialIndex={1} />
    )
    expect(screen.getByAltText('Photo 2')).toBeInTheDocument()
  })

  // Counter
  it('displays image counter', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} />)
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  // Caption
  it('displays caption when available', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} />)
    expect(screen.getByText('Photo 1')).toBeInTheDocument()
  })

  // Navigation buttons
  it('renders navigation buttons when multiple images', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} />)
    expect(screen.getByLabelText('Previous image')).toBeInTheDocument()
    expect(screen.getByLabelText('Next image')).toBeInTheDocument()
  })

  it('does not render navigation buttons for single image', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={[mockImages[0]]} />)
    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument()
  })

  // Navigation actions
  it('navigates to next image', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} />)
    fireEvent.click(screen.getByLabelText('Next image'))
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByAltText('Photo 2')).toBeInTheDocument()
  })

  it('navigates to previous image', () => {
    render(
      <PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} initialIndex={1} />
    )
    fireEvent.click(screen.getByLabelText('Previous image'))
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('wraps around to last image when pressing previous on first', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} />)
    fireEvent.click(screen.getByLabelText('Previous image'))
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })

  it('wraps around to first image when pressing next on last', () => {
    render(
      <PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} initialIndex={2} />
    )
    fireEvent.click(screen.getByLabelText('Next image'))
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  // onNavigate callback
  it('calls onNavigate when navigating', () => {
    const handleNavigate = vi.fn()
    render(
      <PhotoGalleryModal
        isOpen={true}
        onClose={() => {}}
        images={mockImages}
        onNavigate={handleNavigate}
      />
    )
    fireEvent.click(screen.getByLabelText('Next image'))
    expect(handleNavigate).toHaveBeenCalledWith(1)
  })

  // Thumbnails
  it('renders thumbnails by default', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} />)
    const thumbs = document.body.querySelectorAll('.photo-gallery-modal__thumb')
    expect(thumbs).toHaveLength(3)
  })

  it('hides thumbnails when showThumbnails is false', () => {
    render(
      <PhotoGalleryModal
        isOpen={true}
        onClose={() => {}}
        images={mockImages}
        showThumbnails={false}
      />
    )
    expect(document.body.querySelector('.photo-gallery-modal__thumbnails')).not.toBeInTheDocument()
  })

  it('navigates when clicking thumbnail', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} />)
    const thumbs = document.body.querySelectorAll('.photo-gallery-modal__thumb')
    fireEvent.click(thumbs[2])
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })

  it('marks current thumbnail as active', () => {
    render(
      <PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} initialIndex={1} />
    )
    const thumbs = document.body.querySelectorAll('.photo-gallery-modal__thumb')
    expect(thumbs[1]).toHaveClass('photo-gallery-modal__thumb--active')
  })

  // Keyboard navigation
  it('closes on Escape key', () => {
    const handleClose = vi.fn()
    render(<PhotoGalleryModal isOpen={true} onClose={handleClose} images={mockImages} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('navigates with arrow keys', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} />)
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(screen.getByText('2 / 3')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  // Close button
  it('closes when close button clicked', () => {
    const handleClose = vi.fn()
    render(<PhotoGalleryModal isOpen={true} onClose={handleClose} images={mockImages} />)
    fireEvent.click(screen.getByLabelText('Close gallery'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  // Custom actions
  it('renders custom action buttons', () => {
    const handleAction = vi.fn()
    render(
      <PhotoGalleryModal
        isOpen={true}
        onClose={() => {}}
        images={mockImages}
        actions={[
          {
            icon: <span>Icon</span>,
            label: 'Download',
            onClick: handleAction,
          },
        ]}
      />
    )
    const actionBtn = screen.getByLabelText('Download')
    expect(actionBtn).toBeInTheDocument()
    fireEvent.click(actionBtn)
    expect(handleAction).toHaveBeenCalledTimes(1)
  })

  // Accessibility
  it('has dialog role', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal attribute', () => {
    render(<PhotoGalleryModal isOpen={true} onClose={() => {}} images={mockImages} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  // Custom className
  it('accepts custom className', () => {
    render(
      <PhotoGalleryModal
        isOpen={true}
        onClose={() => {}}
        images={mockImages}
        className="custom-gallery"
      />
    )
    expect(document.body.querySelector('.photo-gallery-modal')).toHaveClass('custom-gallery')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<PhotoGalleryModal ref={ref} isOpen={true} onClose={() => {}} images={mockImages} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('photo-gallery-modal')
  })
})
