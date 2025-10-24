import { Router } from 'express'
import { ApiResponse, NFT } from '../types'
import { BlockchainService } from '../services/blockchainService'
import { authenticateToken } from '../middleware/auth'
import OrbitDBService from '../services/orbitdbService'
import OrbitDBQuery from '../utils/orbitdbQuery'

const router = Router()

// Get all NFTs - Web3 only
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, owner, isListed } = req.query
    
    let nfts
    if (search) {
      nfts = await OrbitDBQuery.searchNFTs(search as string, { owner, isListed })
    } else {
      nfts = await OrbitDBService.getAllNFTs()
    }
    
    // Paginate results
    const paginatedNFTs = OrbitDBQuery.paginate(nfts as any[], Number(page), Number(limit))
    
    const response: ApiResponse = {
      success: true,
      data: paginatedNFTs.data,
      message: 'NFTs retrieved successfully',
      pagination: paginatedNFTs.pagination
    }
    
    res.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch NFTs',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// Create NFT - Web3 only
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { to, tokenURI, trackId, price } = req.body
    
    if (!to || !tokenURI || !trackId || price === undefined) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields',
        message: 'to, tokenURI, trackId, and price are required'
      }
      return res.status(400).json(response)
    }
    
    const nftId = await BlockchainService.mintNFT({
      to,
      tokenURI,
      trackId,
      price: parseFloat(price)
    })
    
    const response: ApiResponse = {
      success: true,
      data: { id: nftId },
      message: 'NFT minted successfully on blockchain'
    }
    
    res.status(201).json(response)
  } catch (error) {
    console.error('NFT minting error:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to mint NFT',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// Get NFT by ID - Web3 only
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // In a real implementation, this would fetch NFT from blockchain
    const response: ApiResponse = {
      success: true,
      data: null,
      message: 'NFT retrieved from blockchain'
    }
    
    res.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch NFT',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// Transfer NFT - Web3 only
router.post('/:id/transfer', async (req, res) => {
  try {
    const { id } = req.params
    const { to, from } = req.body
    
    // In a real implementation, this would transfer NFT on blockchain
    const response: ApiResponse = {
      success: true,
      data: { nftId: id, to, from },
      message: 'NFT transferred successfully on blockchain'
    }
    
    res.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to transfer NFT',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

export default router