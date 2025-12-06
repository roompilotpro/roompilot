import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PhotoGallery from './PhotoGallery'

describe('PhotoGallery', () => {
  it('renders with default placeholders', () => {
    render(<PhotoGallery />)
    expect(document.querySelector('.photo-gallery__grid')).toBeInTheDocument()
    expect(document.querySelectorAll('.photo-gallery__item')).toHaveLength(5)
  })

  it('renders with custom images', () => {
    const images = [
      { src: '/img1.jpg', alt: 'Room 1' },
      { src: '/img2.jpg', alt: 'Room 2' },
      { src: '/img3.jpg', alt: 'Room 3' },
      { src: '/img4.jpg', alt: 'Room 4' },
      { src: '/img5.jpg', alt: 'Room 5' },
    ]

    render(<PhotoGallery images={images} />)

    const imgs = document.querySelectorAll('.photo-gallery__image')
    expect(imgs).toHaveLength(5)
    expect(imgs[0]).toHaveAttribute('src', '/img1.jpg')
    expect(imgs[0]).toHaveAttribute('alt', 'Room 1')
  })

  it('renders show all button', () => {
    render(<PhotoGallery />)
    expect(screen.getByRole('button', { name: /show all photos/i })).toBeInTheDocument()
  })

  it('shows total count in button', () => {
    render(<PhotoGallery totalCount={24} />)
    expect(screen.getByRole('button', { name: /show all photos \(24\)/i })).toBeInTheDocument()
  })

  it('calls onShowAll when grid is clicked', () => {
    const onShowAll = vi.fn()
    render(<PhotoGallery onShowAll={onShowAll} />)

    fireEvent.click(document.querySelector('.photo-gallery__grid'))
    expect(onShowAll).toHaveBeenCalledTimes(1)
  })

  it('calls onShowAll when button is clicked', () => {
    const onShowAll = vi.fn()
    render(<PhotoGallery onShowAll={onShowAll} />)

    fireEvent.click(screen.getByRole('button', { name: /show all photos/i }))
    expect(onShowAll).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    render(<PhotoGallery className="custom-gallery" />)
    expect(document.querySelector('.photo-gallery')).toHaveClass('custom-gallery')
  })

  it('limits to 5 images even if more provided', () => {
    const images = Array(10)
      .fill(null)
      .map((_, i) => ({ src: `/img${i}.jpg` }))

    render(<PhotoGallery images={images} />)
    expect(document.querySelectorAll('.photo-gallery__item')).toHaveLength(5)
  })
})
