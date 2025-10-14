import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from '../Select'

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
]

describe('Select', () => {
  it('renders without crashing', () => {
    render(<Select options={mockOptions} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Select options={mockOptions} label="Test Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('renders with error message', () => {
    render(<Select options={mockOptions} error="Test Error" />)
    expect(screen.getByText('Test Error')).toBeInTheDocument()
  })

  it('applies error styling when error is present', () => {
    const { container } = render(<Select options={mockOptions} error="Test Error" />)
    const select = container.querySelector('select')
    
    expect(select).toHaveClass('border-red-500')
  })

  it('renders all options', () => {
    render(<Select options={mockOptions} />)
    
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('handles value changes', () => {
    const handleChange = jest.fn()
    render(<Select options={mockOptions} onChange={handleChange} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'option2' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('handles focus events', () => {
    const handleFocus = jest.fn()
    render(<Select options={mockOptions} onFocus={handleFocus} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.focus(select)
    
    expect(handleFocus).toHaveBeenCalledTimes(1)
  })

  it('handles blur events', () => {
    const handleBlur = jest.fn()
    render(<Select options={mockOptions} onBlur={handleBlur} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.blur(select)
    
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard events', () => {
    const handleKeyDown = jest.fn()
    render(<Select options={mockOptions} onKeyDown={handleKeyDown} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    const { container } = render(<Select options={mockOptions} className="custom-class" />)
    const select = container.querySelector('select')
    
    expect(select).toHaveClass('custom-class')
  })

  it('applies custom testId', () => {
    render(<Select options={mockOptions} testId="custom-test-id" />)
    
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
  })

  it('handles disabled state', () => {
    render(<Select options={mockOptions} disabled />)
    
    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
  })

  it('handles required attribute', () => {
    render(<Select options={mockOptions} required />)
    
    const select = screen.getByRole('combobox')
    expect(select).toBeRequired()
  })

  it('handles multiple selection', () => {
    render(<Select options={mockOptions} multiple />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('multiple')
  })

  it('handles size attribute', () => {
    render(<Select options={mockOptions} size={5} />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('size', '5')
  })

  it('handles autoComplete attribute', () => {
    render(<Select options={mockOptions} autoComplete="country" />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('autoComplete', 'country')
  })

  it('handles form attribute', () => {
    render(<Select options={mockOptions} form="test-form" />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('form', 'test-form')
  })

  it('handles name attribute', () => {
    render(<Select options={mockOptions} name="test-select" />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('name', 'test-select')
  })

  it('handles id attribute', () => {
    render(<Select options={mockOptions} id="test-id" />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('id', 'test-id')
  })

  it('handles value attribute', () => {
    render(<Select options={mockOptions} value="option2" />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('option2')
  })

  it('handles defaultValue attribute', () => {
    render(<Select options={mockOptions} defaultValue="option1" />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('option1')
  })

  it('handles empty options array', () => {
    render(<Select options={[]} />)
    
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  it('handles options with special characters', () => {
    const specialOptions = [
      { value: 'special1', label: 'Option with Special Chars: !@#$%^&*()' },
      { value: 'special2', label: 'Option with Unicode: 你好世界 🌍' }
    ]
    
    render(<Select options={specialOptions} />)
    
    expect(screen.getByText('Option with Special Chars: !@#$%^&*()')).toBeInTheDocument()
    expect(screen.getByText('Option with Unicode: 你好世界 🌍')).toBeInTheDocument()
  })

  it('handles options with empty values', () => {
    const emptyOptions = [
      { value: '', label: 'Empty Value' },
      { value: 'option1', label: 'Option 1' }
    ]
    
    render(<Select options={emptyOptions} />)
    
    expect(screen.getByText('Empty Value')).toBeInTheDocument()
    expect(screen.getByText('Option 1')).toBeInTheDocument()
  })

  it('handles options with duplicate values', () => {
    const duplicateOptions = [
      { value: 'duplicate', label: 'Option 1' },
      { value: 'duplicate', label: 'Option 2' }
    ]
    
    render(<Select options={duplicateOptions} />)
    
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('handles options with null/undefined values', () => {
    const nullOptions = [
      { value: null, label: 'Null Value' },
      { value: undefined, label: 'Undefined Value' }
    ] as any
    
    render(<Select options={nullOptions} />)
    
    expect(screen.getByText('Null Value')).toBeInTheDocument()
    expect(screen.getByText('Undefined Value')).toBeInTheDocument()
  })

  it('handles rapid value changes', () => {
    const handleChange = jest.fn()
    render(<Select options={mockOptions} onChange={handleChange} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'option1' } })
    fireEvent.change(select, { target: { value: 'option2' } })
    fireEvent.change(select, { target: { value: 'option3' } })
    
    expect(handleChange).toHaveBeenCalledTimes(3)
  })

  it('handles missing onChange gracefully', () => {
    render(<Select options={mockOptions} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'option1' } })
    
    expect(select).toBeInTheDocument()
  })

  it('handles edge case props', () => {
    render(
      <Select 
        options={[]}
        label=""
        error=""
        className=""
        testId=""
        disabled={false}
        required={false}
      />
    )
    
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })
})