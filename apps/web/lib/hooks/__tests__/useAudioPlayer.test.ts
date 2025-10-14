import { renderHook, act } from '@testing-library/react'
import { useAudioPlayer } from '../useAudioPlayer'
import { Track } from '../../types'

// Mock the StreamingService
jest.mock('../../../components/player/StreamingService', () => ({
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

const mockTracks: Track[] = [
  mockTrack,
  { ...mockTrack, id: '2', title: 'Second Track' },
  { ...mockTrack, id: '3', title: 'Third Track' }
]

describe('useAudioPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with default values', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    expect(result.current.currentTrack).toBe(mockTracks[0])
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.volume).toBe(0.7)
    expect(result.current.progress).toBe(0)
    expect(result.current.duration).toBe(180)
    expect(result.current.queue).toEqual(mockTracks)
  })

  it('initializes with empty tracks array', () => {
    const { result } = renderHook(() => useAudioPlayer([]))
    
    expect(result.current.currentTrack).toBeNull()
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.volume).toBe(0.7)
    expect(result.current.progress).toBe(0)
    expect(result.current.duration).toBe(0)
    expect(result.current.queue).toEqual([])
  })

  it('plays audio successfully', async () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    await act(async () => {
      await result.current.play()
    })
    
    expect(result.current.isPlaying).toBe(true)
  })

  it('pauses audio successfully', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.pause()
    })
    
    expect(result.current.isPlaying).toBe(false)
  })

  it('skips to next track', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.skipToNext()
    })
    
    expect(result.current.currentTrack).toBe(mockTracks[1])
  })

  it('skips to previous track', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.skipToNext()
      result.current.skipToPrevious()
    })
    
    expect(result.current.currentTrack).toBe(mockTracks[0])
  })

  it('sets volume correctly', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.setVolume(0.5)
    })
    
    expect(result.current.volume).toBe(0.5)
  })

  it('seeks to specific time', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.seek(30)
    })
    
    expect(result.current.progress).toBe(30)
  })

  it('sets queue correctly', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    const newQueue = [mockTracks[2], mockTracks[0]]
    
    act(() => {
      result.current.setQueue(newQueue)
    })
    
    expect(result.current.queue).toEqual(newQueue)
    expect(result.current.currentTrack).toBe(newQueue[0])
  })

  it('adds track to queue', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    const newTrack = { ...mockTrack, id: '4', title: 'Fourth Track' }
    
    act(() => {
      result.current.addToQueue(newTrack)
    })
    
    expect(result.current.queue).toContain(newTrack)
  })

  it('removes track from queue', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.removeFromQueue('2')
    })
    
    expect(result.current.queue).not.toContain(mockTracks[1])
  })

  it('clears queue', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.clearQueue()
    })
    
    expect(result.current.queue).toEqual([])
    expect(result.current.currentTrack).toBeNull()
  })

  it('plays track at specific index', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.playTrackAtIndex(2)
    })
    
    expect(result.current.currentTrack).toBe(mockTracks[2])
  })

  it('handles volume boundary values', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.setVolume(0)
    })
    expect(result.current.volume).toBe(0)
    
    act(() => {
      result.current.setVolume(1)
    })
    expect(result.current.volume).toBe(1)
    
    act(() => {
      result.current.setVolume(-0.1)
    })
    expect(result.current.volume).toBe(0)
    
    act(() => {
      result.current.setVolume(1.1)
    })
    expect(result.current.volume).toBe(1)
  })

  it('handles seek boundary values', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.seek(-10)
    })
    expect(result.current.progress).toBe(0)
    
    act(() => {
      result.current.seek(200)
    })
    expect(result.current.progress).toBe(180)
  })

  it('handles rapid state changes', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.play()
      result.current.pause()
      result.current.play()
      result.current.pause()
    })
    
    expect(result.current.isPlaying).toBe(false)
  })

  it('handles rapid queue changes', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.addToQueue({ ...mockTrack, id: '4' })
      result.current.addToQueue({ ...mockTrack, id: '5' })
      result.current.removeFromQueue('4')
      result.current.clearQueue()
    })
    
    expect(result.current.queue).toEqual([])
  })

  it('handles rapid track changes', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.skipToNext()
      result.current.skipToNext()
      result.current.skipToPrevious()
      result.current.skipToNext()
    })
    
    expect(result.current.currentTrack).toBe(mockTracks[1])
  })

  it('handles rapid volume changes', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.setVolume(0.1)
      result.current.setVolume(0.5)
      result.current.setVolume(0.9)
      result.current.setVolume(0.3)
    })
    
    expect(result.current.volume).toBe(0.3)
  })

  it('handles rapid seek changes', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.seek(10)
      result.current.seek(30)
      result.current.seek(60)
      result.current.seek(90)
    })
    
    expect(result.current.progress).toBe(90)
  })

  it('handles concurrent operations', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.play()
      result.current.setVolume(0.5)
      result.current.seek(30)
      result.current.skipToNext()
    })
    
    expect(result.current.isPlaying).toBe(true)
    expect(result.current.volume).toBe(0.5)
    expect(result.current.progress).toBe(30)
    expect(result.current.currentTrack).toBe(mockTracks[1])
  })

  it('handles error states gracefully', () => {
    const { result } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.play()
      result.current.pause()
      result.current.seek(30)
      result.current.setVolume(0.5)
    })
    
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.progress).toBe(30)
    expect(result.current.volume).toBe(0.5)
  })

  it('handles null track operations', () => {
    const { result } = renderHook(() => useAudioPlayer([]))
    
    act(() => {
      result.current.play()
      result.current.pause()
      result.current.seek(30)
      result.current.setVolume(0.5)
    })
    
    expect(result.current.currentTrack).toBeNull()
  })

  it('handles undefined track operations', () => {
    const { result } = renderHook(() => useAudioPlayer(undefined as any))
    
    act(() => {
      result.current.play()
      result.current.pause()
      result.current.seek(30)
      result.current.setVolume(0.5)
    })
    
    expect(result.current.currentTrack).toBeNull()
  })

  it('handles track with missing required fields', () => {
    const incompleteTrack = {
      ...mockTrack,
      title: undefined,
      artist: undefined,
      ipfsHash: undefined
    } as any
    
    const { result } = renderHook(() => useAudioPlayer([incompleteTrack]))
    
    expect(result.current.currentTrack).toBe(incompleteTrack)
  })

  it('handles track with null values', () => {
    const trackWithNulls = {
      ...mockTrack,
      title: null,
      artist: null,
      ipfsHash: null
    } as any
    
    const { result } = renderHook(() => useAudioPlayer([trackWithNulls]))
    
    expect(result.current.currentTrack).toBe(trackWithNulls)
  })

  it('handles track with empty string values', () => {
    const trackWithEmptyStrings = {
      ...mockTrack,
      title: '',
      artist: '',
      ipfsHash: ''
    }
    
    const { result } = renderHook(() => useAudioPlayer([trackWithEmptyStrings]))
    
    expect(result.current.currentTrack).toBe(trackWithEmptyStrings)
  })

  it('handles very large queue', () => {
    const largeQueue = Array.from({ length: 1000 }, (_, i) => ({
      ...mockTrack,
      id: `${i + 1}`,
      title: `Track ${i + 1}`
    }))
    
    const { result } = renderHook(() => useAudioPlayer(largeQueue))
    
    expect(result.current.queue).toHaveLength(1000)
    expect(result.current.currentTrack).toBe(largeQueue[0])
  })

  it('handles very long track titles', () => {
    const longTitleTrack = {
      ...mockTrack,
      title: 'This is a very long track title that might cause layout issues and should be handled gracefully by the component'
    }
    
    const { result } = renderHook(() => useAudioPlayer([longTitleTrack]))
    
    expect(result.current.currentTrack).toBe(longTitleTrack)
  })

  it('handles special characters in track data', () => {
    const specialCharTrack = {
      ...mockTrack,
      title: 'Track with Special Chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
      artist: 'Artist with Special Chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
    }
    
    const { result } = renderHook(() => useAudioPlayer([specialCharTrack]))
    
    expect(result.current.currentTrack).toBe(specialCharTrack)
  })

  it('handles unicode characters in track data', () => {
    const unicodeTrack = {
      ...mockTrack,
      title: 'Track with Unicode: 你好世界 🌍 🎵',
      artist: 'Artist with Unicode: 你好世界 🌍 🎵'
    }
    
    const { result } = renderHook(() => useAudioPlayer([unicodeTrack]))
    
    expect(result.current.currentTrack).toBe(unicodeTrack)
  })

  it('handles rapid re-renders', () => {
    const { result, rerender } = renderHook(() => useAudioPlayer(mockTracks))
    
    for (let i = 0; i < 100; i++) {
      rerender()
    }
    
    expect(result.current.currentTrack).toBe(mockTracks[0])
  })

  it('handles memory leaks', () => {
    const { result, unmount } = renderHook(() => useAudioPlayer(mockTracks))
    
    act(() => {
      result.current.play()
      result.current.setVolume(0.5)
      result.current.seek(30)
    })
    
    unmount()
    
    // Should not throw an error
  })
})