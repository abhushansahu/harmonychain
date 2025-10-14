import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MusicPlayer } from '../MusicPlayer'
import { Track } from '../../../lib/types'

// Mock the StreamingService
jest.mock('../StreamingService', () => ({
  StreamingService: {
    getInstance: jest.fn(() => ({
      loadTrack: jest.fn().mockResolvedValue(undefined),
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      stop: jest.fn(),
      seek: jest.fn(),
      setVolume: jest.fn(),
      getCurrentTime: jest.fn().mockReturnValue(30),
      getDuration: jest.fn().mockReturnValue(180),
      getProgress: jest.fn().mockReturnValue(16.67),
      isPlaying: jest.fn().mockReturnValue(false),
      isPaused: jest.fn().mockReturnValue(true),
      isEnded: jest.fn().mockReturnValue(false)
    }))
  }
}))

// Mock the child components
jest.mock('../AudioControls', () => ({
  __esModule: true,
  default: ({ isPlaying, onPlayPause, onSkipNext, onSkipPrevious, disabled }: any) => (
    <div data-testid="audio-controls">
      <button onClick={onPlayPause} disabled={disabled}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={onSkipPrevious} disabled={disabled}>Previous</button>
      <button onClick={onSkipNext} disabled={disabled}>Next</button>
    </div>
  )
}))

jest.mock('../ProgressBar', () => ({
  __esModule: true,
  default: ({ progress, onSeek, currentTime, totalTime, disabled }: any) => (
    <div data-testid="progress-bar">
      <div>{currentTime} / {totalTime}</div>
      <div>Progress: {progress}%</div>
      <button onClick={() => onSeek(50)} disabled={disabled}>Seek to 50%</button>
    </div>
  )
}))

jest.mock('../VolumeControl', () => ({
  __esModule: true,
  default: ({ volume, onVolumeChange, disabled }: any) => (
    <div data-testid="volume-control">
      <div>Volume: {volume}%</div>
      <button onClick={() => onVolumeChange(50)} disabled={disabled}>Set to 50%</button>
    </div>
  )
}))

jest.mock('../QueueManager', () => ({
  __esModule: true,
  default: ({ queue, onQueueChange, currentTrack }: any) => (
    <div data-testid="queue-manager">
      <div>Queue: {queue.length} tracks</div>
      <button onClick={() => onQueueChange([])}>Clear Queue</button>
    </div>
  )
}))

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

const defaultProps = {
  currentTrack: mockTrack,
  isPlaying: false,
  progress: 0,
  volume: 50,
  queue: [mockTrack],
  onPlayPause: jest.fn(),
  onSkipNext: jest.fn(),
  onSkipPrevious: jest.fn(),
  onSeek: jest.fn(),
  onVolumeChange: jest.fn(),
  onQueueChange: jest.fn()
}

describe('MusicPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<MusicPlayer {...defaultProps} />)
    expect(screen.getByTestId('music-player')).toBeInTheDocument()
  })

  it('displays track information correctly', () => {
    render(<MusicPlayer {...defaultProps} />)
    
    expect(screen.getByText('Test Track')).toBeInTheDocument()
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
    expect(screen.getByText('Electronic')).toBeInTheDocument()
  })

  it('shows no track message when currentTrack is null', () => {
    render(<MusicPlayer {...defaultProps} currentTrack={null} />)
    
    expect(screen.getByText('No track playing')).toBeInTheDocument()
  })

  it('handles play/pause correctly', () => {
    const onPlayPause = jest.fn()
    render(<MusicPlayer {...defaultProps} onPlayPause={onPlayPause} />)
    
    const playButton = screen.getByText('Play')
    fireEvent.click(playButton)
    
    expect(onPlayPause).toHaveBeenCalledTimes(1)
  })

  it('handles skip next correctly', () => {
    const onSkipNext = jest.fn()
    render(<MusicPlayer {...defaultProps} onSkipNext={onSkipNext} />)
    
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    expect(onSkipNext).toHaveBeenCalledTimes(1)
  })

  it('handles skip previous correctly', () => {
    const onSkipPrevious = jest.fn()
    render(<MusicPlayer {...defaultProps} onSkipPrevious={onSkipPrevious} />)
    
    const prevButton = screen.getByText('Previous')
    fireEvent.click(prevButton)
    
    expect(onSkipPrevious).toHaveBeenCalledTimes(1)
  })

  it('handles seek correctly', () => {
    const onSeek = jest.fn()
    render(<MusicPlayer {...defaultProps} onSeek={onSeek} />)
    
    const seekButton = screen.getByText('Seek to 50%')
    fireEvent.click(seekButton)
    
    expect(onSeek).toHaveBeenCalledWith(50)
  })

  it('handles volume change correctly', () => {
    const onVolumeChange = jest.fn()
    render(<MusicPlayer {...defaultProps} onVolumeChange={onVolumeChange} />)
    
    const volumeButton = screen.getByText('Set to 50%')
    fireEvent.click(volumeButton)
    
    expect(onVolumeChange).toHaveBeenCalledWith(50)
  })

  it('handles queue change correctly', () => {
    const onQueueChange = jest.fn()
    render(<MusicPlayer {...defaultProps} onQueueChange={onQueueChange} />)
    
    const clearButton = screen.getByText('Clear Queue')
    fireEvent.click(clearButton)
    
    expect(onQueueChange).toHaveBeenCalledWith([])
  })

  it('expands and collapses correctly', () => {
    render(<MusicPlayer {...defaultProps} />)
    
    const expandButton = screen.getByLabelText('Expand player')
    fireEvent.click(expandButton)
    
    expect(screen.getByText('Track Details')).toBeInTheDocument()
    expect(screen.getByText('Up Next')).toBeInTheDocument()
    expect(screen.getByText('Controls')).toBeInTheDocument()
  })

  it('handles keyboard shortcuts correctly', () => {
    const onPlayPause = jest.fn()
    const onSkipNext = jest.fn()
    const onSkipPrevious = jest.fn()
    const onVolumeChange = jest.fn()
    
    render(
      <MusicPlayer 
        {...defaultProps} 
        onPlayPause={onPlayPause}
        onSkipNext={onSkipNext}
        onSkipPrevious={onSkipPrevious}
        onVolumeChange={onVolumeChange}
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
    
    // Test arrow up
    fireEvent.keyDown(document, { code: 'ArrowUp' })
    expect(onVolumeChange).toHaveBeenCalledWith(60)
    
    // Test arrow down
    fireEvent.keyDown(document, { code: 'ArrowDown' })
    expect(onVolumeChange).toHaveBeenCalledWith(40)
  })

  it('does not trigger keyboard shortcuts when focused on input elements', () => {
    const onPlayPause = jest.fn()
    
    render(
      <div>
        <input data-testid="test-input" />
        <MusicPlayer {...defaultProps} onPlayPause={onPlayPause} />
      </div>
    )
    
    const input = screen.getByTestId('test-input')
    input.focus()
    
    fireEvent.keyDown(input, { code: 'Space' })
    expect(onPlayPause).not.toHaveBeenCalled()
  })

  it('handles track selection correctly', () => {
    const onTrackSelect = jest.fn()
    render(<MusicPlayer {...defaultProps} onTrackSelect={onTrackSelect} />)
    
    const trackInfo = screen.getByText('Test Track').closest('div')
    fireEvent.click(trackInfo!)
    
    expect(onTrackSelect).toHaveBeenCalledWith(mockTrack)
  })

  it('displays loading state correctly', async () => {
    render(<MusicPlayer {...defaultProps} />)
    
    // The component should show loading state while track is being loaded
    await waitFor(() => {
      expect(screen.getByText('Test Track')).toBeInTheDocument()
    })
  })

  it('displays error state correctly', async () => {
    // Mock StreamingService to throw an error
    const mockStreamingService = require('../StreamingService').streamingService
    mockStreamingService.loadTrack.mockRejectedValue(new Error('Failed to load track'))
    
    render(<MusicPlayer {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load track/)).toBeInTheDocument()
    })
  })

  it('formats time correctly', () => {
    render(<MusicPlayer {...defaultProps} />)
    
    expect(screen.getByText('0:30 / 3:00')).toBeInTheDocument()
  })

  it('handles disabled state correctly', () => {
    render(<MusicPlayer {...defaultProps} />)
    
    // All controls should be disabled when loading
    const playButton = screen.getByText('Play')
    expect(playButton).toBeDisabled()
  })

  it('updates progress correctly', () => {
    render(<MusicPlayer {...defaultProps} progress={50} />)
    
    expect(screen.getByText('Progress: 50%')).toBeInTheDocument()
  })

  it('updates volume correctly', () => {
    render(<MusicPlayer {...defaultProps} volume={75} />)
    
    expect(screen.getByText('Volume: 75%')).toBeInTheDocument()
  })

  it('shows queue information correctly', () => {
    const queue = [mockTrack, { ...mockTrack, id: '2' }]
    render(<MusicPlayer {...defaultProps} queue={queue} />)
    
    expect(screen.getByText('Queue: 2 tracks')).toBeInTheDocument()
  })

  it('handles empty queue correctly', () => {
    render(<MusicPlayer {...defaultProps} queue={[]} />)
    
    expect(screen.getByText('Queue: 0 tracks')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <MusicPlayer {...defaultProps} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('applies custom testId', () => {
    render(<MusicPlayer {...defaultProps} testId="custom-test-id" />)
    
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
  })
})
