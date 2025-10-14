import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders without crashing', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('applies default variant and size', () => {
    const { container } = render(<Button>Test Button</Button>)
    const button = container.firstChild as HTMLElement
    
    expect(button).toHaveClass('bg-harmony-primary')
    expect(button).toHaveClass('px-4 py-2')
  })

  it('applies primary variant', () => {
    const { container } = render(<Button variant="primary">Test Button</Button>)
    const button = container.firstChild as HTMLElement
    
    expect(button).toHaveClass('bg-harmony-primary')
  })

  it('applies secondary variant', () => {
    const { container } = render(<Button variant="secondary">Test Button</Button>)
    const button = container.firstChild as HTMLElement
    
    expect(button).toHaveClass('bg-gray-600')
  })

  it('applies ghost variant', () => {
    const { container } = render(<Button variant="ghost">Test Button</Button>)
    const button = container.firstChild as HTMLElement
    
    expect(button).toHaveClass('bg-transparent')
  })

  it('applies danger variant', () => {
    const { container } = render(<Button variant="danger">Test Button</Button>)
    const button = container.firstChild as HTMLElement
    
    expect(button).toHaveClass('bg-red-600')
  })

  it('applies small size', () => {
    const { container } = render(<Button size="sm">Test Button</Button>)
    const button = container.firstChild as HTMLElement
    
    expect(button).toHaveClass('px-3 py-1.5')
  })

  it('applies medium size', () => {
    const { container } = render(<Button size="md">Test Button</Button>)
    const button = container.firstChild as HTMLElement
    
    expect(button).toHaveClass('px-4 py-2')
  })

  it('applies large size', () => {
    const { container } = render(<Button size="lg">Test Button</Button>)
    const button = container.firstChild as HTMLElement
    
    expect(button).toHaveClass('px-5 py-2.5')
  })

  it('applies icon size', () => {
    const { container } = render(<Button size="icon">Test Button</Button>)
    const button = container.firstChild as HTMLElement
    
    expect(button).toHaveClass('p-2')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Test Button</Button>)
    
    fireEvent.click(screen.getByText('Test Button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('handles disabled state', () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    expect(button).toBeDisabled()
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('handles loading state', () => {
    render(<Button isLoading>Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-70')
  })

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Test Button</Button>)
    const button = container.firstChild as HTMLElement
    
    expect(button).toHaveClass('custom-class')
  })

  it('applies custom testId', () => {
    render(<Button testId="custom-test-id">Test Button</Button>)
    
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
  })

  it('handles keyboard events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('handles focus events', () => {
    render(<Button>Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    fireEvent.focus(button)
    expect(button).toHaveFocus()
  })

  it('handles blur events', () => {
    render(<Button>Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    fireEvent.focus(button)
    fireEvent.blur(button)
    expect(button).not.toHaveFocus()
  })

  it('handles mouse events', () => {
    const handleMouseEnter = jest.fn()
    const handleMouseLeave = jest.fn()
    
    render(
      <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        Test Button
      </Button>
    )
    
    const button = screen.getByText('Test Button')
    fireEvent.mouseEnter(button)
    fireEvent.mouseLeave(button)
    
    expect(handleMouseEnter).toHaveBeenCalledTimes(1)
    expect(handleMouseLeave).toHaveBeenCalledTimes(1)
  })

  it('handles touch events', () => {
    const handleTouchStart = jest.fn()
    const handleTouchEnd = jest.fn()
    
    render(
      <Button onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        Test Button
      </Button>
    )
    
    const button = screen.getByText('Test Button')
    fireEvent.touchStart(button)
    fireEvent.touchEnd(button)
    
    expect(handleTouchStart).toHaveBeenCalledTimes(1)
    expect(handleTouchEnd).toHaveBeenCalledTimes(1)
  })

  it('handles rapid clicks', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(3)
  })

  it('handles missing onClick gracefully', () => {
    render(<Button>Test Button</Button>)
    
    const button = screen.getByText('Test Button')
    fireEvent.click(button)
    
    expect(button).toBeInTheDocument()
  })

  it('handles edge case props', () => {
    render(
      <Button 
        variant="primary" 
        size="md" 
        isLoading={false} 
        disabled={false}
        className=""
        testId=""
      >
        Test Button
      </Button>
    )
    
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })
})