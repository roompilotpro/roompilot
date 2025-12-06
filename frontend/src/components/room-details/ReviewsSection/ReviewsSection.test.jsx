import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ReviewsSection from './ReviewsSection'

describe('ReviewsSection', () => {
  const categories = [
    { label: 'Cleanliness', value: 4.9 },
    { label: 'Accuracy', value: 5.0 },
    { label: 'Communication', value: 4.8 },
    { label: 'Location', value: 5.0 },
  ]

  const reviews = [
    {
      author: 'James',
      date: 'November 2024',
      rating: 5,
      text: 'Great room and even better host!',
    },
    {
      author: 'Sarah',
      date: 'October 2024',
      rating: 5,
      text: 'Stayed here for 3 months.',
    },
    {
      author: 'David',
      date: 'September 2024',
      rating: 4,
      text: 'Nice room with great natural light.',
    },
  ]

  it('renders title', () => {
    render(<ReviewsSection score={4.92} totalCount={47} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Reviews')
  })

  it('renders score', () => {
    render(<ReviewsSection score={4.92} totalCount={47} />)
    expect(screen.getByText('4.92')).toBeInTheDocument()
  })

  it('renders review count', () => {
    render(<ReviewsSection score={4.92} totalCount={47} />)
    // "47 reviews" appears in summary and may appear in button
    expect(screen.getByText(/· 47 reviews/)).toBeInTheDocument()
  })

  it('renders categories', () => {
    render(<ReviewsSection score={4.92} totalCount={47} categories={categories} />)
    expect(screen.getByText('Cleanliness')).toBeInTheDocument()
    expect(screen.getByText('Accuracy')).toBeInTheDocument()
    expect(screen.getByText('4.9')).toBeInTheDocument()
    // Multiple categories have 5.0, so use getAllByText
    expect(screen.getAllByText('5.0')).toHaveLength(2)
  })

  it('renders reviews', () => {
    render(<ReviewsSection score={4.92} totalCount={47} reviews={reviews} />)
    expect(screen.getByText('James')).toBeInTheDocument()
    expect(screen.getByText('November 2024')).toBeInTheDocument()
    expect(screen.getByText('Great room and even better host!')).toBeInTheDocument()
  })

  it('limits displayed reviews to displayCount', () => {
    render(<ReviewsSection score={4.92} totalCount={47} reviews={reviews} displayCount={2} />)
    expect(screen.getByText('James')).toBeInTheDocument()
    expect(screen.getByText('Sarah')).toBeInTheDocument()
    expect(screen.queryByText('David')).not.toBeInTheDocument()
  })

  it('shows "Show all" button when totalCount exceeds displayCount', () => {
    render(<ReviewsSection score={4.92} totalCount={47} reviews={reviews} displayCount={3} />)
    expect(screen.getByRole('button', { name: /Show all 47 reviews/i })).toBeInTheDocument()
  })

  it('calls onShowAll when button clicked', () => {
    const onShowAll = vi.fn()
    render(
      <ReviewsSection
        score={4.92}
        totalCount={47}
        reviews={reviews}
        displayCount={3}
        onShowAll={onShowAll}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Show all/i }))
    expect(onShowAll).toHaveBeenCalledTimes(1)
  })

  it('renders reviewer initials when no avatar', () => {
    render(<ReviewsSection score={4.92} totalCount={47} reviews={reviews} />)
    expect(screen.getByText('J')).toBeInTheDocument() // James initial
  })

  it('applies custom className', () => {
    render(<ReviewsSection score={4.92} totalCount={47} className="custom-reviews" />)
    expect(document.querySelector('.reviews-section')).toHaveClass('custom-reviews')
  })
})
