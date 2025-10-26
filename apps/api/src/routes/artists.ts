import { Router } from 'express'
import { ApiResponse } from '../types'
import { BlockchainService } from '../services/blockchainService'
import { authenticateToken } from '../middleware/auth'
import OrbitDBService from '../services/orbitdbService'
import OrbitDBQuery from '../utils/orbitdbQuery'

const router = Router()

// Get all artists
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query
    
    let artists
    if (search) {
      artists = await OrbitDBQuery.searchArtists(search as string)
    } else {
      artists = await OrbitDBService.getAllArtists()
    }
    
    // Paginate results
    const paginatedArtists = OrbitDBQuery.paginate(artists as any[], Number(page), Number(limit))
    
    const response: ApiResponse = {
      success: true,
      data: paginatedArtists.data,
      message: 'Artists retrieved successfully',
      pagination: paginatedArtists.pagination
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching artists:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch artists',
      message: 'An error occurred while fetching artists'
    }
    res.status(500).json(response)
  }
})

// Get artist by wallet address
router.get('/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params
    
    // Check if artist is registered on blockchain
    const isRegistered = await BlockchainService.isArtistRegistered(address)
    
    if (!isRegistered) {
      const response: ApiResponse = {
        success: false,
        error: 'Artist not registered',
        message: 'This wallet address is not registered as an artist'
      }
      return res.status(404).json(response)
    }
    
    // Get artist data from blockchain
    const artist = await BlockchainService.getArtistByAddress(address)
    
    if (!artist) {
      const response: ApiResponse = {
        success: false,
        error: 'Artist data not found',
        message: 'Artist is registered but data could not be retrieved'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse = {
      success: true,
      data: artist,
      message: 'Artist retrieved successfully from blockchain'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching artist by wallet:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch artist',
      message: 'An error occurred while fetching the artist'
    }
    res.status(500).json(response)
  }
})

// Get artist by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const artist = await OrbitDBService.getArtist(id)
    
    if (!artist) {
      const response: ApiResponse = {
        success: false,
        error: 'Artist not found',
        message: 'The requested artist was not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse = {
      success: true,
      data: artist,
      message: 'Artist retrieved successfully'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching artist:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch artist',
      message: 'An error occurred while fetching the artist'
    }
    res.status(500).json(response)
  }
})

// Get artist's tracks
router.get('/:id/tracks', async (req, res) => {
  try {
    const { id } = req.params
    const artist = await BlockchainService.getArtist(id)
    
    if (!artist) {
      const response: ApiResponse = {
        success: false,
        error: 'Artist not found',
        message: 'The requested artist was not found'
      }
      return res.status(404).json(response)
    }
    
    const trackIds = await BlockchainService.getArtistTracks(artist.walletAddress)
    const tracks = []
    
    for (const trackId of trackIds) {
      try {
        const track = await BlockchainService.getTrack(trackId)
        if (track) {
          tracks.push(track)
        }
      } catch (error) {
        console.warn(`Failed to fetch track ${trackId}:`, error)
      }
    }
    
    const response: ApiResponse = {
      success: true,
      data: tracks,
      message: 'Artist tracks retrieved successfully from blockchain'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching artist tracks:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch artist tracks',
      message: 'An error occurred while fetching artist tracks'
    }
    res.status(500).json(response)
  }
})

// Register new artist
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, avatar } = req.body
    
    if (!name || !description) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields',
        message: 'Name and description are required'
      }
      return res.status(400).json(response)
    }
    
    const artistId = await BlockchainService.registerArtist({
      name,
      description,
      avatar: avatar || ''
    })
    
    const response: ApiResponse = {
      success: true,
      data: { id: artistId },
      message: 'Artist registered successfully on blockchain'
    }
    
    res.status(201).json(response)
  } catch (error) {
    console.error('Error registering artist:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to register artist',
      message: 'An error occurred while registering the artist'
    }
    res.status(500).json(response)
  }
})

export default router