import { Router } from 'express'
import { BlockchainService } from '../services/blockchainService'
import { ApiResponse } from '../types'
import { uploadFiles, handleUploadError } from '../middleware/upload'
import { uploadToIPFS, getIPFSUrl } from '../config/ipfs'
import { authenticateToken } from '../middleware/auth'
import OrbitDBService from '../services/orbitdbService'
import OrbitDBQuery from '../utils/orbitdbQuery'

interface Track {
  id: string
  title: string
  artist: string
  artistId: string
  duration: number
  genre: string
  price: number
  coverArt: string
  audioFile: string
  ipfsHash: string
  createdAt: string
  updatedAt: string
}

const router = Router()

// Get all tracks - Web3 only
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, genre, artistId } = req.query
    
    let tracks
    if (search) {
      tracks = await OrbitDBQuery.searchTracks(search as string, { genre, artistId })
    } else {
      tracks = await OrbitDBService.getAllTracks()
    }
    
    // Paginate results
    const paginatedTracks = OrbitDBQuery.paginate(tracks as any[], Number(page), Number(limit))
    
    const response: ApiResponse = {
      success: true,
      data: paginatedTracks.data,
      message: 'Tracks retrieved successfully',
      pagination: paginatedTracks.pagination
    }
    
    res.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch tracks',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// Get track by ID - Web3 only
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const track = await BlockchainService.getTrack(id)
    
    if (!track) {
      const response: ApiResponse = {
        success: false,
        error: 'Track not found',
        message: 'The requested track was not found on blockchain'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse = {
      success: true,
      data: track,
      message: 'Track retrieved successfully from blockchain'
    }
    
    res.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch track from blockchain',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// Create track - Web3 with IPFS
router.post('/', authenticateToken, uploadFiles, handleUploadError, async (req: any, res: any) => {
  try {
    const { title, duration, genre, price } = req.body
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    
    if (!title || !duration || !genre) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields',
        message: 'Title, duration, and genre are required'
      }
      return res.status(400).json(response)
    }
    
    if (!files.audioFile || files.audioFile.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Audio file required',
        message: 'Audio file is required'
      }
      return res.status(400).json(response)
    }
    
    const audioFile = files.audioFile[0]
    const coverArtFile = files.coverArt?.[0]
    
    // Upload audio file to IPFS
    const audioResult = await uploadToIPFS(audioFile.buffer, audioFile.originalname, {
      name: `${title} - Audio`,
      keyvalues: {
        type: 'audio',
        title: title,
        artist: req.user?.address || 'Unknown'
      }
    })
    const audioUrl = getIPFSUrl(audioResult.path)
    
    // Upload cover art to IPFS if provided
    let coverArtUrl = ''
    if (coverArtFile) {
      const coverArtResult = await uploadToIPFS(coverArtFile.buffer, coverArtFile.originalname, {
        name: `${title} - Cover Art`,
        keyvalues: {
          type: 'image',
          title: title,
          artist: req.user?.address || 'Unknown'
        }
      })
      coverArtUrl = getIPFSUrl(coverArtResult.path)
    }
    
    // Register track on blockchain with IPFS hashes
    const trackId = await BlockchainService.registerTrack({
      title,
      duration: parseInt(duration),
      genre,
      coverArt: coverArtUrl,
      audioFile: audioUrl,
      ipfsHash: audioResult.path,
      price: parseFloat(price) || 0
    })
    
    // Also save to SimpleDB for fast queries
    const trackData = {
      title,
      artist: req.user?.address || 'Unknown',
      artistId: req.user?.address || 'Unknown',
      duration: parseInt(duration),
      genre,
      price: parseFloat(price) || 0,
      coverArt: coverArtUrl,
      audioFile: audioUrl,
      ipfsHash: audioResult.path,
      isStreamable: true,
      playCount: 0
    }
    
    const savedTrack = await OrbitDBService.createTrack(trackData)
    
    const response: ApiResponse = {
      success: true,
      data: { 
        id: trackId,
        audioUrl,
        coverArtUrl,
        ipfsHash: audioResult.path,
        dbId: savedTrack.id
      },
      message: 'Track registered successfully on blockchain and database with IPFS storage'
    }
    
    res.status(201).json(response)
  } catch (error) {
    console.error('Track creation error:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create track',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// Update track - Web3 only
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    
    // Update track metadata on blockchain
    const updatedTrack = await BlockchainService.updateTrack(id, updateData)
    
    const response: ApiResponse = {
      success: true,
      data: updatedTrack,
      message: 'Track updated successfully on blockchain'
    }
    
    res.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update track on blockchain',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// Play track - increment play count
router.post('/:id/play', async (req, res) => {
  try {
    const { id } = req.params
    
    // Increment play count on blockchain
    await BlockchainService.playTrack(id)
    
    const response: ApiResponse = {
      success: true,
      message: 'Track play count incremented'
    }
    
    res.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to play track',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// Delete track - Web3 only
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // Remove track from blockchain
    await BlockchainService.deleteTrack(id)
    
    const response: ApiResponse = {
      success: true,
      message: 'Track deleted successfully from blockchain'
    }
    
    res.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete track from blockchain',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

export default router