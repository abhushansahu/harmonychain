import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../Input'

describe('Input', () => {
  it('renders without crashing', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Input label="Test Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('renders with error message', () => {
    render(<Input error="Test Error" />)
    expect(screen.getByText('Test Error')).toBeInTheDocument()
  })

  it('applies error styling when error is present', () => {
    const { container } = render(<Input error="Test Error" />)
    const input = container.querySelector('input')
    
    expect(input).toHaveClass('border-red-500')
  })

  it('handles value changes', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('handles focus events', () => {
    const handleFocus = jest.fn()
    render(<Input onFocus={handleFocus} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    
    expect(handleFocus).toHaveBeenCalledTimes(1)
  })

  it('handles blur events', () => {
    const handleBlur = jest.fn()
    render(<Input onBlur={handleBlur} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.blur(input)
    
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard events', () => {
    const handleKeyDown = jest.fn()
    render(<Input onKeyDown={handleKeyDown} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter' })
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    const { container } = render(<Input className="custom-class" />)
    const input = container.querySelector('input')
    
    expect(input).toHaveClass('custom-class')
  })

  it('applies custom testId', () => {
    render(<Input testId="custom-test-id" />)
    
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
  })

  it('handles disabled state', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('handles placeholder', () => {
    render(<Input placeholder="Test placeholder" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('placeholder', 'Test placeholder')
  })

  it('handles different input types', () => {
    render(<Input type="password" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('handles required attribute', () => {
    render(<Input required />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('handles autoComplete attribute', () => {
    render(<Input autoComplete="email" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('autoComplete', 'email')
  })

  it('handles maxLength attribute', () => {
    render(<Input maxLength={10} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('maxLength', '10')
  })

  it('handles minLength attribute', () => {
    render(<Input minLength={5} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('minLength', '5')
  })

  it('handles pattern attribute', () => {
    render(<Input pattern="[0-9]+" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('pattern', '[0-9]+')
  })

  it('handles step attribute', () => {
    render(<Input type="number" step="0.1" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('step', '0.1')
  })

  it('handles min and max attributes', () => {
    render(<Input type="number" min="0" max="100" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
  })

  it('handles multiple attributes', () => {
    render(
      <Input 
        type="email"
        placeholder="Enter email"
        required
        autoComplete="email"
        maxLength={50}
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('placeholder', 'Enter email')
    expect(input).toBeRequired()
    expect(input).toHaveAttribute('autoComplete', 'email')
    expect(input).toHaveAttribute('maxLength', '50')
  })

  it('handles edge case props', () => {
    render(
      <Input 
        label=""
        error=""
        className=""
        testId=""
        disabled={false}
        required={false}
      />
    )
    
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})