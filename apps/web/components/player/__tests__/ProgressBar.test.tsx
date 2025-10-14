import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProgressBar } from '../ProgressBar'

const defaultProps = {
  progress: 0,
  onSeek: jest.fn(),
  currentTime: 0,
  totalTime: 180,
  disabled: false
}

describe('ProgressBar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<ProgressBar {...defaultProps} />)
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument()
  })

  it('displays current time and total time correctly', () => {
    render(<ProgressBar {...defaultProps} currentTime={30} totalTime={180} />)
    
    expect(screen.getByText('0:30 / 3:00')).toBeInTheDocument()
  })

  it('displays progress percentage correctly', () => {
    render(<ProgressBar {...defaultProps} progress={50} />)
    
    expect(screen.getByText('Progress: 50%')).toBeInTheDocument()
  })

  it('calls onSeek when progress bar is clicked', () => {
    const onSeek = jest.fn()
    render(<ProgressBar {...defaultProps} onSeek={onSeek} />)
    
    const seekButton = screen.getByText('Seek to 50%')
    fireEvent.click(seekButton)
    
    expect(onSeek).toHaveBeenCalledWith(50)
  })

  it('disables seek functionality when disabled prop is true', () => {
    render(<ProgressBar {...defaultProps} disabled={true} />)
    
    const seekButton = screen.getByText('Seek to 50%')
    expect(seekButton).toBeDisabled()
  })

  it('enables seek functionality when disabled prop is false', () => {
    render(<ProgressBar {...defaultProps} disabled={false} />)
    
    const seekButton = screen.getByText('Seek to 50%')
    expect(seekButton).not.toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ProgressBar {...defaultProps} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('applies custom testId', () => {
    render(<ProgressBar {...defaultProps} testId="custom-test-id" />)
    
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
  })

  it('handles zero total time correctly', () => {
    render(<ProgressBar {...defaultProps} totalTime={0} />)
    
    expect(screen.getByText('0:00 / 0:00')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('handles negative progress correctly', () => {
    render(<ProgressBar {...defaultProps} progress={-10} />)
    
    expect(screen.getByText('Progress: -10%')).toBeInTheDocument()
  })

  it('handles progress greater than 100% correctly', () => {
    render(<ProgressBar {...defaultProps} progress={150} />)
    
    expect(screen.getByText('Progress: 150%')).toBeInTheDocument()
  })

  it('handles negative current time correctly', () => {
    render(<ProgressBar {...defaultProps} currentTime={-30} totalTime={180} />)
    
    expect(screen.getByText('-0:30 / 3:00')).toBeInTheDocument()
  })

  it('handles current time greater than total time correctly', () => {
    render(<ProgressBar {...defaultProps} currentTime={200} totalTime={180} />)
    
    expect(screen.getByText('3:20 / 3:00')).toBeInTheDocument()
  })

  it('updates display when props change', () => {
    const { rerender } = render(<ProgressBar {...defaultProps} />)
    
    expect(screen.getByText('0:00 / 3:00')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
    
    rerender(<ProgressBar {...defaultProps} currentTime={60} progress={33.33} />)
    
    expect(screen.getByText('1:00 / 3:00')).toBeInTheDocument()
    expect(screen.getByText('Progress: 33.33%')).toBeInTheDocument()
  })

  it('handles rapid seek calls correctly', () => {
    const onSeek = jest.fn()
    render(<ProgressBar {...defaultProps} onSeek={onSeek} />)
    
    const seekButton = screen.getByText('Seek to 50%')
    
    // Click multiple times rapidly
    fireEvent.click(seekButton)
    fireEvent.click(seekButton)
    fireEvent.click(seekButton)
    
    expect(onSeek).toHaveBeenCalledTimes(3)
  })

  it('handles missing onSeek callback gracefully', () => {
    render(
      <ProgressBar 
        progress={0}
        onSeek={undefined as any}
        currentTime={0}
        totalTime={180}
        disabled={false}
      />
    )
    
    // Should not crash when onSeek is undefined
    const seekButton = screen.getByText('Seek to 50%')
    fireEvent.click(seekButton)
    
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument()
  })

  it('handles edge case props correctly', () => {
    render(
      <ProgressBar 
        progress={0}
        onSeek={() => {}}
        currentTime={0}
        totalTime={180}
        disabled={false}
        className=""
        testId=""
      />
    )
    
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument()
  })

  it('formats time correctly for different values', () => {
    const testCases = [
      { currentTime: 0, totalTime: 0, expected: '0:00 / 0:00' },
      { currentTime: 30, totalTime: 60, expected: '0:30 / 1:00' },
      { currentTime: 90, totalTime: 120, expected: '1:30 / 2:00' },
      { currentTime: 3661, totalTime: 3661, expected: '61:01 / 61:01' }
    ]

    testCases.forEach(({ currentTime, totalTime, expected }) => {
      const { rerender } = render(
        <ProgressBar 
          {...defaultProps} 
          currentTime={currentTime} 
          totalTime={totalTime} 
        />
      )
      
      expect(screen.getByText(expected)).toBeInTheDocument()
      
      rerender(<div />) // Clean up for next test
    })
  })

  it('handles decimal progress values correctly', () => {
    render(<ProgressBar {...defaultProps} progress={33.333} />)
    
    expect(screen.getByText('Progress: 33.333%')).toBeInTheDocument()
  })

  it('handles very large time values correctly', () => {
    render(<ProgressBar {...defaultProps} currentTime={3600} totalTime={7200} />)
    
    expect(screen.getByText('60:00 / 120:00')).toBeInTheDocument()
  })

  it('maintains accessibility attributes', () => {
    render(<ProgressBar {...defaultProps} />)
    
    const progressBar = screen.getByTestId('progress-bar')
    expect(progressBar).toHaveAttribute('role', 'progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '180')
  })

  it('updates accessibility attributes when progress changes', () => {
    const { rerender } = render(<ProgressBar {...defaultProps} />)
    
    let progressBar = screen.getByTestId('progress-bar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    
    rerender(<ProgressBar {...defaultProps} progress={50} />)
    
    progressBar = screen.getByTestId('progress-bar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '50')
  })
})
