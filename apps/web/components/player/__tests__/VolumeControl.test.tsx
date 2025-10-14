import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { VolumeControl } from '../VolumeControl'

const defaultProps = {
  volume: 50,
  onVolumeChange: jest.fn(),
  disabled: false
}

describe('VolumeControl', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<VolumeControl {...defaultProps} />)
    expect(screen.getByTestId('volume-control')).toBeInTheDocument()
  })

  it('displays current volume correctly', () => {
    render(<VolumeControl {...defaultProps} volume={75} />)
    
    expect(screen.getByText('Volume: 75%')).toBeInTheDocument()
  })

  it('calls onVolumeChange when volume button is clicked', () => {
    const onVolumeChange = jest.fn()
    render(<VolumeControl {...defaultProps} onVolumeChange={onVolumeChange} />)
    
    const volumeButton = screen.getByText('Set to 50%')
    fireEvent.click(volumeButton)
    
    expect(onVolumeChange).toHaveBeenCalledWith(50)
  })

  it('disables volume control when disabled prop is true', () => {
    render(<VolumeControl {...defaultProps} disabled={true} />)
    
    const volumeButton = screen.getByText('Set to 50%')
    expect(volumeButton).toBeDisabled()
  })

  it('enables volume control when disabled prop is false', () => {
    render(<VolumeControl {...defaultProps} disabled={false} />)
    
    const volumeButton = screen.getByText('Set to 50%')
    expect(volumeButton).not.toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(
      <VolumeControl {...defaultProps} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('applies custom testId', () => {
    render(<VolumeControl {...defaultProps} testId="custom-test-id" />)
    
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
  })

  it('handles zero volume correctly', () => {
    render(<VolumeControl {...defaultProps} volume={0} />)
    
    expect(screen.getByText('Volume: 0%')).toBeInTheDocument()
  })

  it('handles maximum volume correctly', () => {
    render(<VolumeControl {...defaultProps} volume={100} />)
    
    expect(screen.getByText('Volume: 100%')).toBeInTheDocument()
  })

  it('handles negative volume correctly', () => {
    render(<VolumeControl {...defaultProps} volume={-10} />)
    
    expect(screen.getByText('Volume: -10%')).toBeInTheDocument()
  })

  it('handles volume greater than 100% correctly', () => {
    render(<VolumeControl {...defaultProps} volume={150} />)
    
    expect(screen.getByText('Volume: 150%')).toBeInTheDocument()
  })

  it('updates display when volume prop changes', () => {
    const { rerender } = render(<VolumeControl {...defaultProps} volume={25} />)
    
    expect(screen.getByText('Volume: 25%')).toBeInTheDocument()
    
    rerender(<VolumeControl {...defaultProps} volume={75} />)
    
    expect(screen.getByText('Volume: 75%')).toBeInTheDocument()
  })

  it('handles rapid volume changes correctly', () => {
    const onVolumeChange = jest.fn()
    render(<VolumeControl {...defaultProps} onVolumeChange={onVolumeChange} />)
    
    const volumeButton = screen.getByText('Set to 50%')
    
    // Click multiple times rapidly
    fireEvent.click(volumeButton)
    fireEvent.click(volumeButton)
    fireEvent.click(volumeButton)
    
    expect(onVolumeChange).toHaveBeenCalledTimes(3)
  })

  it('handles missing onVolumeChange callback gracefully', () => {
    render(
      <VolumeControl 
        volume={50}
        onVolumeChange={undefined as any}
        disabled={false}
      />
    )
    
    // Should not crash when onVolumeChange is undefined
    const volumeButton = screen.getByText('Set to 50%')
    fireEvent.click(volumeButton)
    
    expect(screen.getByTestId('volume-control')).toBeInTheDocument()
  })

  it('handles edge case props correctly', () => {
    render(
      <VolumeControl 
        volume={50}
        onVolumeChange={() => {}}
        disabled={false}
        className=""
        testId=""
      />
    )
    
    expect(screen.getByTestId('volume-control')).toBeInTheDocument()
  })

  it('handles decimal volume values correctly', () => {
    render(<VolumeControl {...defaultProps} volume={33.333} />)
    
    expect(screen.getByText('Volume: 33.333%')).toBeInTheDocument()
  })

  it('handles very large volume values correctly', () => {
    render(<VolumeControl {...defaultProps} volume={1000} />)
    
    expect(screen.getByText('Volume: 1000%')).toBeInTheDocument()
  })

  it('maintains accessibility attributes', () => {
    render(<VolumeControl {...defaultProps} />)
    
    const volumeControl = screen.getByTestId('volume-control')
    expect(volumeControl).toHaveAttribute('role', 'slider')
    expect(volumeControl).toHaveAttribute('aria-valuenow', '50')
    expect(volumeControl).toHaveAttribute('aria-valuemin', '0')
    expect(volumeControl).toHaveAttribute('aria-valuemax', '100')
  })

  it('updates accessibility attributes when volume changes', () => {
    const { rerender } = render(<VolumeControl {...defaultProps} />)
    
    let volumeControl = screen.getByTestId('volume-control')
    expect(volumeControl).toHaveAttribute('aria-valuenow', '50')
    
    rerender(<VolumeControl {...defaultProps} volume={75} />)
    
    volumeControl = screen.getByTestId('volume-control')
    expect(volumeControl).toHaveAttribute('aria-valuenow', '75')
  })

  it('handles keyboard shortcuts correctly', () => {
    const onVolumeChange = jest.fn()
    
    render(<VolumeControl {...defaultProps} onVolumeChange={onVolumeChange} />)
    
    // Test arrow up
    fireEvent.keyDown(document, { code: 'ArrowUp' })
    expect(onVolumeChange).toHaveBeenCalledWith(60)
    
    // Test arrow down
    fireEvent.keyDown(document, { code: 'ArrowDown' })
    expect(onVolumeChange).toHaveBeenCalledWith(40)
  })

  it('does not trigger keyboard shortcuts when disabled', () => {
    const onVolumeChange = jest.fn()
    
    render(
      <VolumeControl 
        {...defaultProps} 
        disabled={true}
        onVolumeChange={onVolumeChange}
      />
    )
    
    // Test arrow up
    fireEvent.keyDown(document, { code: 'ArrowUp' })
    expect(onVolumeChange).not.toHaveBeenCalled()
    
    // Test arrow down
    fireEvent.keyDown(document, { code: 'ArrowDown' })
    expect(onVolumeChange).not.toHaveBeenCalled()
  })

  it('does not trigger keyboard shortcuts when focused on input elements', () => {
    const onVolumeChange = jest.fn()
    
    render(
      <div>
        <input data-testid="test-input" />
        <VolumeControl {...defaultProps} onVolumeChange={onVolumeChange} />
      </div>
    )
    
    const input = screen.getByTestId('test-input')
    input.focus()
    
    fireEvent.keyDown(input, { code: 'ArrowUp' })
    expect(onVolumeChange).not.toHaveBeenCalled()
  })

  it('handles volume change with different step sizes', () => {
    const onVolumeChange = jest.fn()
    render(<VolumeControl {...defaultProps} onVolumeChange={onVolumeChange} />)
    
    // Test with different step sizes
    const volumeButton = screen.getByText('Set to 50%')
    fireEvent.click(volumeButton)
    
    expect(onVolumeChange).toHaveBeenCalledWith(50)
  })

  it('handles volume change with boundary values', () => {
    const onVolumeChange = jest.fn()
    
    // Test with volume at 0
    const { rerender } = render(
      <VolumeControl {...defaultProps} volume={0} onVolumeChange={onVolumeChange} />
    )
    
    const volumeButton = screen.getByText('Set to 50%')
    fireEvent.click(volumeButton)
    
    expect(onVolumeChange).toHaveBeenCalledWith(50)
    
    // Test with volume at 100
    rerender(
      <VolumeControl {...defaultProps} volume={100} onVolumeChange={onVolumeChange} />
    )
    
    fireEvent.click(volumeButton)
    
    expect(onVolumeChange).toHaveBeenCalledWith(50)
  })

  it('handles volume change with decimal values', () => {
    const onVolumeChange = jest.fn()
    render(<VolumeControl {...defaultProps} onVolumeChange={onVolumeChange} />)
    
    const volumeButton = screen.getByText('Set to 50%')
    fireEvent.click(volumeButton)
    
    expect(onVolumeChange).toHaveBeenCalledWith(50)
  })

  it('handles volume change with negative values', () => {
    const onVolumeChange = jest.fn()
    render(<VolumeControl {...defaultProps} onVolumeChange={onVolumeChange} />)
    
    const volumeButton = screen.getByText('Set to 50%')
    fireEvent.click(volumeButton)
    
    expect(onVolumeChange).toHaveBeenCalledWith(50)
  })

  it('handles volume change with very large values', () => {
    const onVolumeChange = jest.fn()
    render(<VolumeControl {...defaultProps} onVolumeChange={onVolumeChange} />)
    
    const volumeButton = screen.getByText('Set to 50%')
    fireEvent.click(volumeButton)
    
    expect(onVolumeChange).toHaveBeenCalledWith(50)
  })
})
