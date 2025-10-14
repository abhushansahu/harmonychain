import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { AudioControls } from '../AudioControls'

const defaultProps = {
  isPlaying: false,
  onPlayPause: jest.fn(),
  onSkipNext: jest.fn(),
  onSkipPrevious: jest.fn(),
  disabled: false
}

describe('AudioControls', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<AudioControls {...defaultProps} />)
    expect(screen.getByTestId('audio-controls')).toBeInTheDocument()
  })

  it('displays play button when not playing', () => {
    render(<AudioControls {...defaultProps} />)
    
    expect(screen.getByLabelText('Play')).toBeInTheDocument()
    expect(screen.getByText('Play')).toBeInTheDocument()
  })

  it('displays pause button when playing', () => {
    render(<AudioControls {...defaultProps} isPlaying={true} />)
    
    expect(screen.getByLabelText('Pause')).toBeInTheDocument()
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })

  it('calls onPlayPause when play/pause button is clicked', () => {
    const onPlayPause = jest.fn()
    render(<AudioControls {...defaultProps} onPlayPause={onPlayPause} />)
    
    const playButton = screen.getByLabelText('Play')
    fireEvent.click(playButton)
    
    expect(onPlayPause).toHaveBeenCalledTimes(1)
  })

  it('calls onSkipNext when next button is clicked', () => {
    const onSkipNext = jest.fn()
    render(<AudioControls {...defaultProps} onSkipNext={onSkipNext} />)
    
    const nextButton = screen.getByLabelText('Skip next')
    fireEvent.click(nextButton)
    
    expect(onSkipNext).toHaveBeenCalledTimes(1)
  })

  it('calls onSkipPrevious when previous button is clicked', () => {
    const onSkipPrevious = jest.fn()
    render(<AudioControls {...defaultProps} onSkipPrevious={onSkipPrevious} />)
    
    const prevButton = screen.getByLabelText('Skip previous')
    fireEvent.click(prevButton)
    
    expect(onSkipPrevious).toHaveBeenCalledTimes(1)
  })

  it('disables all buttons when disabled prop is true', () => {
    render(<AudioControls {...defaultProps} disabled={true} />)
    
    const playButton = screen.getByLabelText('Play')
    const nextButton = screen.getByLabelText('Skip next')
    const prevButton = screen.getByLabelText('Skip previous')
    
    expect(playButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
    expect(prevButton).toBeDisabled()
  })

  it('enables all buttons when disabled prop is false', () => {
    render(<AudioControls {...defaultProps} disabled={false} />)
    
    const playButton = screen.getByLabelText('Play')
    const nextButton = screen.getByLabelText('Skip next')
    const prevButton = screen.getByLabelText('Skip previous')
    
    expect(playButton).not.toBeDisabled()
    expect(nextButton).not.toBeDisabled()
    expect(prevButton).not.toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(
      <AudioControls {...defaultProps} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('applies custom testId', () => {
    render(<AudioControls {...defaultProps} testId="custom-test-id" />)
    
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
  })

  it('handles keyboard shortcuts correctly', () => {
    const onPlayPause = jest.fn()
    const onSkipNext = jest.fn()
    const onSkipPrevious = jest.fn()
    
    render(
      <AudioControls 
        {...defaultProps} 
        onPlayPause={onPlayPause}
        onSkipNext={onSkipNext}
        onSkipPrevious={onSkipPrevious}
      />
    )
    
    // Test space key
    fireEvent.keyDown(document, { code: 'Space' })
    expect(onPlayPause).toHaveBeenCalledTimes(1)
    
    // Test arrow right
    fireEvent.keyDown(document, { code: 'ArrowRight' })
    expect(onSkipNext).toHaveBeenCalledTimes(1)
    
    // Test arrow left
    fireEvent.keyDown(document, { code: 'ArrowLeft' })
    expect(onSkipPrevious).toHaveBeenCalledTimes(1)
  })

  it('does not trigger keyboard shortcuts when disabled', () => {
    const onPlayPause = jest.fn()
    const onSkipNext = jest.fn()
    const onSkipPrevious = jest.fn()
    
    render(
      <AudioControls 
        {...defaultProps} 
        disabled={true}
        onPlayPause={onPlayPause}
        onSkipNext={onSkipNext}
        onSkipPrevious={onSkipPrevious}
      />
    )
    
    // Test space key
    fireEvent.keyDown(document, { code: 'Space' })
    expect(onPlayPause).not.toHaveBeenCalled()
    
    // Test arrow right
    fireEvent.keyDown(document, { code: 'ArrowRight' })
    expect(onSkipNext).not.toHaveBeenCalled()
    
    // Test arrow left
    fireEvent.keyDown(document, { code: 'ArrowLeft' })
    expect(onSkipPrevious).not.toHaveBeenCalled()
  })

  it('does not trigger keyboard shortcuts when focused on input elements', () => {
    const onPlayPause = jest.fn()
    
    render(
      <div>
        <input data-testid="test-input" />
        <AudioControls {...defaultProps} onPlayPause={onPlayPause} />
      </div>
    )
    
    const input = screen.getByTestId('test-input')
    input.focus()
    
    fireEvent.keyDown(input, { code: 'Space' })
    expect(onPlayPause).not.toHaveBeenCalled()
  })

  it('handles rapid button clicks correctly', () => {
    const onPlayPause = jest.fn()
    render(<AudioControls {...defaultProps} onPlayPause={onPlayPause} />)
    
    const playButton = screen.getByLabelText('Play')
    
    // Click multiple times rapidly
    fireEvent.click(playButton)
    fireEvent.click(playButton)
    fireEvent.click(playButton)
    
    expect(onPlayPause).toHaveBeenCalledTimes(3)
  })

  it('handles missing callback functions gracefully', () => {
    render(
      <AudioControls 
        isPlaying={false}
        onPlayPause={undefined as any}
        onSkipNext={undefined as any}
        onSkipPrevious={undefined as any}
        disabled={false}
      />
    )
    
    // Should not crash when callbacks are undefined
    const playButton = screen.getByLabelText('Play')
    fireEvent.click(playButton)
    
    expect(screen.getByTestId('audio-controls')).toBeInTheDocument()
  })

  it('updates button state when isPlaying prop changes', () => {
    const { rerender } = render(<AudioControls {...defaultProps} />)
    
    expect(screen.getByLabelText('Play')).toBeInTheDocument()
    
    rerender(<AudioControls {...defaultProps} isPlaying={true} />)
    
    expect(screen.getByLabelText('Pause')).toBeInTheDocument()
  })

  it('maintains button state when other props change', () => {
    const { rerender } = render(<AudioControls {...defaultProps} />)
    
    expect(screen.getByLabelText('Play')).toBeInTheDocument()
    
    rerender(<AudioControls {...defaultProps} disabled={true} />)
    
    expect(screen.getByLabelText('Play')).toBeInTheDocument()
    expect(screen.getByLabelText('Play')).toBeDisabled()
  })

  it('handles edge case props correctly', () => {
    render(
      <AudioControls 
        isPlaying={false}
        onPlayPause={() => {}}
        onSkipNext={() => {}}
        onSkipPrevious={() => {}}
        disabled={false}
        className=""
        testId=""
      />
    )
    
    expect(screen.getByTestId('audio-controls')).toBeInTheDocument()
  })
})
