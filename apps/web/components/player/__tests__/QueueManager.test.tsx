import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueueManager } from '../QueueManager'
import { Track } from '../../../lib/types'

const mockTrack: Track = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  artistAddress: '0x123...',
  artistId: 'artist-1',
  ipfsHash: 'QmTestHash',
  genre: 'Electronic',
  playCount: 1000,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  duration: 180,
  description: 'A test track',
  tags: ['test', 'electronic'],
  isPublished: true,
  isNftMinted: false,
  totalRevenue: 0.1,
  royaltyPercentage: 10
}

const mockQueue: Track[] = [
  mockTrack,
  { ...mockTrack, id: '2', title: 'Second Track' },
  { ...mockTrack, id: '3', title: 'Third Track' }
]

const defaultProps = {
  queue: mockQueue,
  currentTrackId: '1',
  onQueueChange: jest.fn(),
  onTrackSelect: jest.fn(),
  disabled: false
}

describe('QueueManager', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<QueueManager {...defaultProps} />)
    expect(screen.getByTestId('queue-manager')).toBeInTheDocument()
  })

  it('displays queue information correctly', () => {
    render(<QueueManager {...defaultProps} />)
    
    expect(screen.getByText('Queue: 3 tracks')).toBeInTheDocument()
  })

  it('calls onQueueChange when clear queue button is clicked', () => {
    const onQueueChange = jest.fn()
    render(<QueueManager {...defaultProps} onQueueChange={onQueueChange} />)
    
    const clearButton = screen.getByText('Clear Queue')
    fireEvent.click(clearButton)
    
    expect(onQueueChange).toHaveBeenCalledWith([])
  })

  it('disables queue manager when disabled prop is true', () => {
    render(<QueueManager {...defaultProps} disabled={true} />)
    
    const clearButton = screen.getByText('Clear Queue')
    expect(clearButton).toBeDisabled()
  })

  it('enables queue manager when disabled prop is false', () => {
    render(<QueueManager {...defaultProps} disabled={false} />)
    
    const clearButton = screen.getByText('Clear Queue')
    expect(clearButton).not.toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(
      <QueueManager {...defaultProps} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('applies custom testId', () => {
    render(<QueueManager {...defaultProps} testId="custom-test-id" />)
    
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
  })

  it('handles empty queue correctly', () => {
    render(<QueueManager {...defaultProps} queue={[]} />)
    
    expect(screen.getByText('Queue: 0 tracks')).toBeInTheDocument()
  })

  it('handles single track queue correctly', () => {
    render(<QueueManager {...defaultProps} queue={[mockTrack]} />)
    
    expect(screen.getByText('Queue: 1 tracks')).toBeInTheDocument()
  })

  it('handles large queue correctly', () => {
    const largeQueue = Array.from({ length: 100 }, (_, i) => ({
      ...mockTrack,
      id: `${i + 1}`,
      title: `Track ${i + 1}`
    }))
    
    render(<QueueManager {...defaultProps} queue={largeQueue} />)
    
    expect(screen.getByText('Queue: 100 tracks')).toBeInTheDocument()
  })

  it('updates display when queue prop changes', () => {
    const { rerender } = render(<QueueManager {...defaultProps} />)
    
    expect(screen.getByText('Queue: 3 tracks')).toBeInTheDocument()
    
    rerender(<QueueManager {...defaultProps} queue={[mockTrack]} />)
    
    expect(screen.getByText('Queue: 1 tracks')).toBeInTheDocument()
  })

  it('handles rapid queue changes correctly', () => {
    const onQueueChange = jest.fn()
    render(<QueueManager {...defaultProps} onQueueChange={onQueueChange} />)
    
    const clearButton = screen.getByText('Clear Queue')
    
    // Click multiple times rapidly
    fireEvent.click(clearButton)
    fireEvent.click(clearButton)
    fireEvent.click(clearButton)
    
    expect(onQueueChange).toHaveBeenCalledTimes(3)
  })

  it('handles missing onQueueChange callback gracefully', () => {
    render(
      <QueueManager 
        queue={mockQueue}
        currentTrackId="1"
        onQueueChange={undefined as any}
        onTrackSelect={jest.fn()}
        disabled={false}
      />
    )
    
    // Should not crash when onQueueChange is undefined
    const clearButton = screen.getByText('Clear Queue')
    fireEvent.click(clearButton)
    
    expect(screen.getByTestId('queue-manager')).toBeInTheDocument()
  })

  it('handles edge case props correctly', () => {
    render(
      <QueueManager 
        queue={[]}
        currentTrackId=""
        onQueueChange={() => {}}
        onTrackSelect={() => {}}
        disabled={false}
        className=""
        testId=""
      />
    )
    
    expect(screen.getByTestId('queue-manager')).toBeInTheDocument()
  })

  it('handles null queue correctly', () => {
    render(<QueueManager {...defaultProps} queue={null as any} />)
    
    expect(screen.getByText('Queue: 0 tracks')).toBeInTheDocument()
  })

  it('handles undefined queue correctly', () => {
    render(<QueueManager {...defaultProps} queue={undefined as any} />)
    
    expect(screen.getByText('Queue: 0 tracks')).toBeInTheDocument()
  })

  it('handles queue with null tracks correctly', () => {
    const queueWithNulls = [mockTrack, null, { ...mockTrack, id: '2' }] as any
    
    render(<QueueManager {...defaultProps} queue={queueWithNulls} />)
    
    expect(screen.getByText('Queue: 3 tracks')).toBeInTheDocument()
  })

  it('handles queue with undefined tracks correctly', () => {
    const queueWithUndefined = [mockTrack, undefined, { ...mockTrack, id: '2' }] as any
    
    render(<QueueManager {...defaultProps} queue={queueWithUndefined} />)
    
    expect(screen.getByText('Queue: 3 tracks')).toBeInTheDocument()
  })

  it('handles queue with duplicate tracks correctly', () => {
    const queueWithDuplicates = [mockTrack, mockTrack, mockTrack]
    
    render(<QueueManager {...defaultProps} queue={queueWithDuplicates} />)
    
    expect(screen.getByText('Queue: 3 tracks')).toBeInTheDocument()
  })

  it('handles queue with tracks missing required fields correctly', () => {
    const queueWithIncompleteTracks = [
      { ...mockTrack, title: undefined },
      { ...mockTrack, artist: undefined },
      { ...mockTrack, id: undefined }
    ] as any
    
    render(<QueueManager {...defaultProps} queue={queueWithIncompleteTracks} />)
    
    expect(screen.getByText('Queue: 3 tracks')).toBeInTheDocument()
  })

  it('handles very long track titles correctly', () => {
    const longTitleTrack = {
      ...mockTrack,
      title: 'This is a very long track title that might cause layout issues and should be handled gracefully by the component'
    }
    
    render(<QueueManager {...defaultProps} queue={[longTitleTrack]} />)
    
    expect(screen.getByText('Queue: 1 tracks')).toBeInTheDocument()
  })

  it('handles very long artist names correctly', () => {
    const longArtistTrack = {
      ...mockTrack,
      artist: 'This is a very long artist name that might cause layout issues and should be handled gracefully by the component'
    }
    
    render(<QueueManager {...defaultProps} queue={[longArtistTrack]} />)
    
    expect(screen.getByText('Queue: 1 tracks')).toBeInTheDocument()
  })

  it('handles special characters in track titles correctly', () => {
    const specialCharTrack = {
      ...mockTrack,
      title: 'Track with Special Chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
    }
    
    render(<QueueManager {...defaultProps} queue={[specialCharTrack]} />)
    
    expect(screen.getByText('Queue: 1 tracks')).toBeInTheDocument()
  })

  it('handles special characters in artist names correctly', () => {
    const specialCharTrack = {
      ...mockTrack,
      artist: 'Artist with Special Chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
    }
    
    render(<QueueManager {...defaultProps} queue={[specialCharTrack]} />)
    
    expect(screen.getByText('Queue: 1 tracks')).toBeInTheDocument()
  })

  it('handles unicode characters in track titles correctly', () => {
    const unicodeTrack = {
      ...mockTrack,
      title: 'Track with Unicode: 你好世界 🌍 🎵'
    }
    
    render(<QueueManager {...defaultProps} queue={[unicodeTrack]} />)
    
    expect(screen.getByText('Queue: 1 tracks')).toBeInTheDocument()
  })

  it('handles unicode characters in artist names correctly', () => {
    const unicodeTrack = {
      ...mockTrack,
      artist: 'Artist with Unicode: 你好世界 🌍 🎵'
    }
    
    render(<QueueManager {...defaultProps} queue={[unicodeTrack]} />)
    
    expect(screen.getByText('Queue: 1 tracks')).toBeInTheDocument()
  })

  it('maintains accessibility attributes', () => {
    render(<QueueManager {...defaultProps} />)
    
    const queueManager = screen.getByTestId('queue-manager')
    expect(queueManager).toHaveAttribute('role', 'listbox')
    expect(queueManager).toHaveAttribute('aria-label', 'Queue manager')
  })

  it('updates accessibility attributes when queue changes', () => {
    const { rerender } = render(<QueueManager {...defaultProps} />)
    
    let queueManager = screen.getByTestId('queue-manager')
    expect(queueManager).toHaveAttribute('aria-label', 'Queue manager')
    
    rerender(<QueueManager {...defaultProps} queue={[]} />)
    
    queueManager = screen.getByTestId('queue-manager')
    expect(queueManager).toHaveAttribute('aria-label', 'Queue manager')
  })

  it('handles keyboard shortcuts correctly', () => {
    const onQueueChange = jest.fn()
    
    render(<QueueManager {...defaultProps} onQueueChange={onQueueChange} />)
    
    // Test escape key
    fireEvent.keyDown(document, { code: 'Escape' })
    expect(onQueueChange).toHaveBeenCalledWith([])
  })

  it('does not trigger keyboard shortcuts when disabled', () => {
    const onQueueChange = jest.fn()
    
    render(
      <QueueManager 
        {...defaultProps} 
        disabled={true}
        onQueueChange={onQueueChange}
      />
    )
    
    // Test escape key
    fireEvent.keyDown(document, { code: 'Escape' })
    expect(onQueueChange).not.toHaveBeenCalled()
  })

  it('does not trigger keyboard shortcuts when focused on input elements', () => {
    const onQueueChange = jest.fn()
    
    render(
      <div>
        <input data-testid="test-input" />
        <QueueManager {...defaultProps} onQueueChange={onQueueChange} />
      </div>
    )
    
    const input = screen.getByTestId('test-input')
    input.focus()
    
    fireEvent.keyDown(input, { code: 'Escape' })
    expect(onQueueChange).not.toHaveBeenCalled()
  })
})
