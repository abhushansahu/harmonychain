import { StreamingService } from '../StreamingService'
import { Track } from '../../../lib/types'

// Mock the IPFS client
jest.mock('ipfs-http-client', () => ({
  create: jest.fn(() => ({
    add: jest.fn(),
    cat: jest.fn()
  }))
}))

// Mock the Audio constructor
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  load: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  currentTime: 0,
  duration: 180,
  volume: 1,
  src: ''
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

describe('StreamingService', () => {
  let streamingService: StreamingService

  beforeEach(() => {
    streamingService = StreamingService.getInstance()
    jest.clearAllMocks()
  })

  describe('getInstance', () => {
    it('returns a singleton instance', () => {
      const instance1 = StreamingService.getInstance()
      const instance2 = StreamingService.getInstance()
      
      expect(instance1).toBe(instance2)
    })
  })

  describe('loadTrack', () => {
    it('loads a track successfully', async () => {
      const result = await streamingService.loadTrack(mockTrack)
      
      expect(result).toBeUndefined()
    })

    it('handles track without IPFS hash', async () => {
      const trackWithoutHash = { ...mockTrack, ipfsHash: '' }
      
      await expect(streamingService.loadTrack(trackWithoutHash)).rejects.toThrow('Track does not have an IPFS hash')
    })

    it('handles track with invalid IPFS hash', async () => {
      const trackWithInvalidHash = { ...mockTrack, ipfsHash: 'invalid-hash' }
      
      await expect(streamingService.loadTrack(trackWithInvalidHash)).rejects.toThrow('Invalid IPFS hash format')
    })

    it('handles IPFS gateway errors', async () => {
      // Mock IPFS gateway to throw an error
      const originalFetch = global.fetch
      global.fetch = jest.fn().mockRejectedValue(new Error('IPFS gateway error'))
      
      await expect(streamingService.loadTrack(mockTrack)).rejects.toThrow('IPFS gateway error')
      
      global.fetch = originalFetch
    })

    it('handles network errors', async () => {
      // Mock network error
      const originalFetch = global.fetch
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))
      
      await expect(streamingService.loadTrack(mockTrack)).rejects.toThrow('Network error')
      
      global.fetch = originalFetch
    })

    it('handles timeout errors', async () => {
      // Mock timeout error
      const originalFetch = global.fetch
      global.fetch = jest.fn().mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      )
      
      await expect(streamingService.loadTrack(mockTrack)).rejects.toThrow('Timeout')
      
      global.fetch = originalFetch
    })
  })

  describe('play', () => {
    it('plays audio successfully', async () => {
      await streamingService.loadTrack(mockTrack)
      const result = await streamingService.play()
      
      expect(result).toBeUndefined()
    })

    it('handles play errors', async () => {
      // Mock Audio to throw an error on play
      const mockAudio = {
        play: jest.fn().mockRejectedValue(new Error('Play failed')),
        pause: jest.fn(),
        load: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        currentTime: 0,
        duration: 180,
        volume: 1,
        src: ''
      }
      
      ;(global.Audio as jest.Mock).mockImplementation(() => mockAudio)
      
      await streamingService.loadTrack(mockTrack)
      await expect(streamingService.play()).rejects.toThrow('Play failed')
    })

    it('handles play when no track is loaded', async () => {
      await expect(streamingService.play()).rejects.toThrow('No track loaded')
    })
  })

  describe('pause', () => {
    it('pauses audio successfully', () => {
      streamingService.pause()
      // Should not throw an error
    })

    it('handles pause when no track is loaded', () => {
      streamingService.pause()
      // Should not throw an error
    })
  })

  describe('stop', () => {
    it('stops audio successfully', () => {
      streamingService.stop()
      // Should not throw an error
    })

    it('handles stop when no track is loaded', () => {
      streamingService.stop()
      // Should not throw an error
    })
  })

  describe('seek', () => {
    it('seeks to a specific time successfully', () => {
      streamingService.seek(30)
      // Should not throw an error
    })

    it('handles seek when no track is loaded', () => {
      streamingService.seek(30)
      // Should not throw an error
    })

    it('handles seek with negative time', () => {
      streamingService.seek(-10)
      // Should not throw an error
    })

    it('handles seek with time greater than duration', () => {
      streamingService.seek(200)
      // Should not throw an error
    })
  })

  describe('setVolume', () => {
    it('sets volume successfully', () => {
      streamingService.setVolume(0.5)
      // Should not throw an error
    })

    it('handles volume when no track is loaded', () => {
      streamingService.setVolume(0.5)
      // Should not throw an error
    })

    it('handles volume with negative value', () => {
      streamingService.setVolume(-0.1)
      // Should not throw an error
    })

    it('handles volume with value greater than 1', () => {
      streamingService.setVolume(1.5)
      // Should not throw an error
    })
  })

  describe('getCurrentTime', () => {
    it('returns current time', () => {
      const currentTime = streamingService.getCurrentTime()
      expect(currentTime).toBe(0)
    })

    it('handles getCurrentTime when no track is loaded', () => {
      const currentTime = streamingService.getCurrentTime()
      expect(currentTime).toBe(0)
    })
  })

  describe('getDuration', () => {
    it('returns duration', () => {
      const duration = streamingService.getDuration()
      expect(duration).toBe(180)
    })

    it('handles getDuration when no track is loaded', () => {
      const duration = streamingService.getDuration()
      expect(duration).toBe(180)
    })
  })

  describe('getProgress', () => {
    it('returns progress percentage', () => {
      const progress = streamingService.getProgress()
      expect(progress).toBe(0)
    })

    it('handles getProgress when no track is loaded', () => {
      const progress = streamingService.getProgress()
      expect(progress).toBe(0)
    })
  })

  describe('isPlaying', () => {
    it('returns playing state', () => {
      const isPlaying = streamingService.isPlaying()
      expect(isPlaying).toBe(false)
    })

    it('handles isPlaying when no track is loaded', () => {
      const isPlaying = streamingService.isPlaying()
      expect(isPlaying).toBe(false)
    })
  })

  describe('isPaused', () => {
    it('returns paused state', () => {
      const isPaused = streamingService.isPaused()
      expect(isPaused).toBe(true)
    })

    it('handles isPaused when no track is loaded', () => {
      const isPaused = streamingService.isPaused()
      expect(isPaused).toBe(true)
    })
  })

  describe('isEnded', () => {
    it('returns ended state', () => {
      const isEnded = streamingService.isEnded()
      expect(isEnded).toBe(false)
    })

    it('handles isEnded when no track is loaded', () => {
      const isEnded = streamingService.isEnded()
      expect(isEnded).toBe(false)
    })
  })

  describe('error handling', () => {
    it('handles Audio constructor errors', () => {
      ;(global.Audio as jest.Mock).mockImplementation(() => {
        throw new Error('Audio constructor failed')
      })
      
      expect(() => new StreamingService()).toThrow('Audio constructor failed')
    })

    it('handles missing IPFS configuration', () => {
      const originalEnv = process.env
      process.env = { ...originalEnv, NEXT_PUBLIC_IPFS_GATEWAY: undefined }
      
      expect(() => new StreamingService()).toThrow('IPFS gateway URL is not configured')
      
      process.env = originalEnv
    })

    it('handles invalid IPFS configuration', () => {
      const originalEnv = process.env
      process.env = { ...originalEnv, NEXT_PUBLIC_IPFS_GATEWAY: 'invalid-url' }
      
      expect(() => new StreamingService()).toThrow('Invalid IPFS gateway URL')
      
      process.env = originalEnv
    })
  })

  describe('edge cases', () => {
    it('handles track with null values', async () => {
      const trackWithNulls = {
        ...mockTrack,
        title: null,
        artist: null,
        ipfsHash: null
      } as any
      
      await expect(streamingService.loadTrack(trackWithNulls)).rejects.toThrow('Track does not have an IPFS hash')
    })

    it('handles track with undefined values', async () => {
      const trackWithUndefined = {
        ...mockTrack,
        title: undefined,
        artist: undefined,
        ipfsHash: undefined
      } as any
      
      await expect(streamingService.loadTrack(trackWithUndefined)).rejects.toThrow('Track does not have an IPFS hash')
    })

    it('handles track with empty string values', async () => {
      const trackWithEmptyStrings = {
        ...mockTrack,
        title: '',
        artist: '',
        ipfsHash: ''
      }
      
      await expect(streamingService.loadTrack(trackWithEmptyStrings)).rejects.toThrow('Track does not have an IPFS hash')
    })

    it('handles track with very long IPFS hash', async () => {
      const trackWithLongHash = {
        ...mockTrack,
        ipfsHash: 'Qm' + 'a'.repeat(1000)
      }
      
      await expect(streamingService.loadTrack(trackWithLongHash)).rejects.toThrow('Invalid IPFS hash format')
    })

    it('handles track with special characters in IPFS hash', async () => {
      const trackWithSpecialChars = {
        ...mockTrack,
        ipfsHash: 'Qm!@#$%^&*()_+-=[]{}|;:,.<>?'
      }
      
      await expect(streamingService.loadTrack(trackWithSpecialChars)).rejects.toThrow('Invalid IPFS hash format')
    })

    it('handles track with unicode characters in IPFS hash', async () => {
      const trackWithUnicode = {
        ...mockTrack,
        ipfsHash: 'Qm你好世界🌍🎵'
      }
      
      await expect(streamingService.loadTrack(trackWithUnicode)).rejects.toThrow('Invalid IPFS hash format')
    })
  })

  describe('performance', () => {
    it('handles rapid loadTrack calls', async () => {
      const promises = Array.from({ length: 10 }, () => streamingService.loadTrack(mockTrack))
      
      await expect(Promise.all(promises)).resolves.toBeDefined()
    })

    it('handles rapid play/pause calls', async () => {
      await streamingService.loadTrack(mockTrack)
      
      const playPromises = Array.from({ length: 10 }, () => streamingService.play())
      const pauseCalls = Array.from({ length: 10 }, () => streamingService.pause())
      
      await expect(Promise.all(playPromises)).resolves.toBeDefined()
      pauseCalls.forEach(call => expect(call).toBeUndefined())
    })

    it('handles rapid seek calls', () => {
      const seekCalls = Array.from({ length: 100 }, (_, i) => streamingService.seek(i))
      
      seekCalls.forEach(call => expect(call).toBeUndefined())
    })

    it('handles rapid volume changes', () => {
      const volumeCalls = Array.from({ length: 100 }, (_, i) => streamingService.setVolume(i / 100))
      
      volumeCalls.forEach(call => expect(call).toBeUndefined())
    })
  })

  describe('cleanup', () => {
    it('cleans up event listeners on destroy', () => {
      const mockAudio = {
        play: jest.fn(),
        pause: jest.fn(),
        load: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        currentTime: 0,
        duration: 180,
        volume: 1,
        src: ''
      }
      
      ;(global.Audio as jest.Mock).mockImplementation(() => mockAudio)
      
      const service = new StreamingService()
      service.destroy()
      
      expect(mockAudio.removeEventListener).toHaveBeenCalled()
    })

    it('handles destroy when no audio is loaded', () => {
      const service = new StreamingService()
      service.destroy()
      
      // Should not throw an error
    })
  })
})
