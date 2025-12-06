import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ButtonGroup from './ButtonGroup'
import Button from '../Button'

describe('ButtonGroup', () => {
  it('renders children', () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    )
    expect(screen.getByRole('button', { name: 'One' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Two' })).toBeInTheDocument()
  })

  it('has role="group"', () => {
    render(
      <ButtonGroup>
        <Button>Test</Button>
      </ButtonGroup>
    )
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('applies horizontal direction by default', () => {
    render(
      <ButtonGroup>
        <Button>Test</Button>
      </ButtonGroup>
    )
    expect(screen.getByRole('group')).toHaveClass('btn-group--horizontal')
  })

  it('applies vertical direction', () => {
    render(
      <ButtonGroup direction="vertical">
        <Button>Test</Button>
      </ButtonGroup>
    )
    expect(screen.getByRole('group')).toHaveClass('btn-group--vertical')
  })

  it('applies attached class when attached is true', () => {
    render(
      <ButtonGroup attached>
        <Button>Test</Button>
      </ButtonGroup>
    )
    expect(screen.getByRole('group')).toHaveClass('btn-group--attached')
  })

  it('accepts additional className', () => {
    render(
      <ButtonGroup className="custom-class">
        <Button>Test</Button>
      </ButtonGroup>
    )
    expect(screen.getByRole('group')).toHaveClass('custom-class')
  })
})
