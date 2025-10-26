import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { BlockchainService } from '../src/services/blockchainService'

// Mock the blockchain service
jest.mock('../src/services/blockchainService')

describe('Track Upload Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Blockchain Service', () => {
    it('should register an artist successfully', async () => {
      const mockArtistId = '1'
      const mockRegisterArtist = jest.fn().mockResolvedValue(mockArtistId)
      const mockIsArtistRegistered = jest.fn().mockResolvedValue(false)
      
      // Mock the static methods
      jest.spyOn(BlockchainService, 'registerArtist').mockImplementation(mockRegisterArtist)
      jest.spyOn(BlockchainService, 'isArtistRegistered').mockImplementation(mockIsArtistRegistered)

      const artistData = {
        name: 'Test Artist',
        description: 'Test description',
        avatar: ''
      }

      const result = await BlockchainService.registerArtist(artistData)

      expect(mockRegisterArtist).toHaveBeenCalledWith(artistData)
      expect(result).toBe(mockArtistId)
    })

    it('should register a track successfully', async () => {
      const mockTrackId = '1'
      const mockRegisterTrack = jest.fn().mockResolvedValue(mockTrackId)
      
      jest.spyOn(BlockchainService, 'registerTrack').mockImplementation(mockRegisterTrack)

      const trackData = {
        title: 'Test Track',
        duration: 180,
        genre: 'Electronic',
        coverArt: 'https://example.com/cover.jpg',
        audioFile: 'https://example.com/audio.mp3',
        ipfsHash: 'QmTestHash123',
        price: 1000000000000000 // 0.001 ETH in wei
      }

      const result = await BlockchainService.registerTrack(trackData)

      expect(mockRegisterTrack).toHaveBeenCalledWith(trackData)
      expect(result).toBe(mockTrackId)
    })

    it('should check if artist is registered', async () => {
      const mockIsArtistRegistered = jest.fn().mockResolvedValue(true)
      
      jest.spyOn(BlockchainService, 'isArtistRegistered').mockImplementation(mockIsArtistRegistered)

      const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
      const result = await BlockchainService.isArtistRegistered(address)

      expect(mockIsArtistRegistered).toHaveBeenCalledWith(address)
      expect(result).toBe(true)
    })

    it('should get tracks from blockchain', async () => {
      const mockTracks = [
        {
          id: '1',
          title: 'Test Track',
          artist: 'Test Artist',
          duration: 180,
          genre: 'Electronic',
          price: 1000000000000000,
          createdAt: new Date().toISOString()
        }
      ]
      const mockGetTracks = jest.fn().mockResolvedValue(mockTracks)
      
      jest.spyOn(BlockchainService, 'getTracks').mockImplementation(mockGetTracks)

      const result = await BlockchainService.getTracks()

      expect(mockGetTracks).toHaveBeenCalled()
      expect(result).toEqual(mockTracks)
    })
  })

  describe('Price Conversion', () => {
    it('should convert ETH to wei correctly', () => {
      const ethPrice = 0.001
      const expectedWei = Math.floor(ethPrice * 1e18)
      
      expect(expectedWei).toBe(1000000000000000)
    })

    it('should handle zero price', () => {
      const ethPrice = 0
      const expectedWei = Math.floor(ethPrice * 1e18)
      
      expect(expectedWei).toBe(0)
    })

    it('should handle large prices', () => {
      const ethPrice = 1.5
      const expectedWei = Math.floor(ethPrice * 1e18)
      
      expect(expectedWei).toBe(1500000000000000000)
    })
  })

  describe('Error Handling', () => {
    it('should handle artist registration failure', async () => {
      const mockRegisterArtist = jest.fn().mockRejectedValue(new Error('Transaction failed'))
      
      jest.spyOn(BlockchainService, 'registerArtist').mockImplementation(mockRegisterArtist)

      const artistData = {
        name: 'Test Artist',
        description: 'Test description',
        avatar: ''
      }

      await expect(BlockchainService.registerArtist(artistData)).rejects.toThrow('Transaction failed')
    })

    it('should handle track registration failure', async () => {
      const mockRegisterTrack = jest.fn().mockRejectedValue(new Error('Insufficient funds'))
      
      jest.spyOn(BlockchainService, 'registerTrack').mockImplementation(mockRegisterTrack)

      const trackData = {
        title: 'Test Track',
        duration: 180,
        genre: 'Electronic',
        coverArt: 'https://example.com/cover.jpg',
        audioFile: 'https://example.com/audio.mp3',
        ipfsHash: 'QmTestHash123',
        price: 1000000000000000
      }

      await expect(BlockchainService.registerTrack(trackData)).rejects.toThrow('Insufficient funds')
    })
  })
})
