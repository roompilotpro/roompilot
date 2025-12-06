import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TwoColumnLayout from './TwoColumnLayout'

describe('TwoColumnLayout', () => {
  it('renders left and right panels', () => {
    render(<TwoColumnLayout left={<div>Left Content</div>} right={<div>Right Content</div>} />)
    expect(screen.getByText('Left Content')).toBeInTheDocument()
    expect(screen.getByText('Right Content')).toBeInTheDocument()
  })

  it('renders complex content in panels', () => {
    render(
      <TwoColumnLayout
        left={
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        }
        right={
          <article>
            <h2>Title</h2>
            <p>Description</p>
          </article>
        }
      />
    )
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  // Width
  it('sets left panel width via CSS variable', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>Left</div>} right={<div>Right</div>} leftWidth="300px" />
    )
    expect(container.firstChild).toHaveStyle({ '--two-col-left-width': '300px' })
  })

  it('handles numeric width', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>Left</div>} right={<div>Right</div>} leftWidth={350} />
    )
    expect(container.firstChild).toHaveStyle({ '--two-col-left-width': '350px' })
  })

  it('uses default width when not specified', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>Left</div>} right={<div>Right</div>} />
    )
    expect(container.firstChild).toHaveStyle({ '--two-col-left-width': '400px' })
  })

  // Variants
  it('applies default variant class', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>Left</div>} right={<div>Right</div>} />
    )
    expect(container.querySelector('.two-column-layout--default')).toBeInTheDocument()
  })

  it('applies messages variant class', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>Left</div>} right={<div>Right</div>} variant="messages" />
    )
    expect(container.querySelector('.two-column-layout--messages')).toBeInTheDocument()
  })

  it('applies search variant class', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>Left</div>} right={<div>Right</div>} variant="search" />
    )
    expect(container.querySelector('.two-column-layout--search')).toBeInTheDocument()
  })

  // Sticky behavior
  it('applies sticky class to left panel', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>Left</div>} right={<div>Right</div>} stickyLeft />
    )
    expect(container.querySelector('.two-column-layout__left--sticky')).toBeInTheDocument()
  })

  it('applies sticky class to right panel', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>Left</div>} right={<div>Right</div>} stickyRight />
    )
    expect(container.querySelector('.two-column-layout__right--sticky')).toBeInTheDocument()
  })

  it('does not apply sticky by default', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>Left</div>} right={<div>Right</div>} />
    )
    expect(container.querySelector('.two-column-layout__left--sticky')).not.toBeInTheDocument()
    expect(container.querySelector('.two-column-layout__right--sticky')).not.toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>Left</div>} right={<div>Right</div>} className="custom-layout" />
    )
    expect(container.querySelector('.two-column-layout')).toHaveClass('custom-layout')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<TwoColumnLayout ref={ref} left={<div>Left</div>} right={<div>Right</div>} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('two-column-layout')
  })

  // Panel structure
  it('left panel has correct class', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>Left</div>} right={<div>Right</div>} />
    )
    const leftPanel = container.querySelector('.two-column-layout__left')
    expect(leftPanel).toBeInTheDocument()
    expect(leftPanel).toContainElement(screen.getByText('Left'))
  })

  it('right panel has correct class', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>Left</div>} right={<div>Right</div>} />
    )
    const rightPanel = container.querySelector('.two-column-layout__right')
    expect(rightPanel).toBeInTheDocument()
    expect(rightPanel).toContainElement(screen.getByText('Right'))
  })
})
