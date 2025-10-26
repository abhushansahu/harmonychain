import { Router } from 'express'
import { ApiResponse } from '../types'
import { AuthService } from '../services/authService'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Generate nonce for SIWE
router.get('/nonce', async (req, res) => {
  try {
    const nonce = await AuthService.generateNonce()
    
    const response: ApiResponse = {
      success: true,
      data: { nonce },
      message: 'Nonce generated successfully'
    }
    
    res.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to generate nonce',
      message: 'An error occurred while generating nonce'
    }
    res.status(500).json(response)
  }
})

// Verify SIWE signature
router.post('/verify', async (req, res) => {
  try {
    const { message, signature, address } = req.body
    
    if (!message || !signature || !address) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields',
        message: 'Message, signature, and address are required'
      }
      return res.status(400).json(response)
    }
    
    const result = await AuthService.verifySignature(message, signature, address)
    
    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        error: result.error || 'Verification failed',
        message: 'Signature verification failed'
      }
      return res.status(401).json(response)
    }
    
    const response: ApiResponse = {
      success: true,
      data: { 
        token: result.token,
        user: result.user
      },
      message: 'Authentication successful'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Auth verification error:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Authentication failed',
      message: 'An error occurred during authentication'
    }
    res.status(500).json(response)
  }
})

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { BlockchainService } = await import('../services/blockchainService')
    
    // Check if user is registered as artist
    const isArtist = await BlockchainService.isArtistRegistered(req.user?.address || '')
    let artistData = null
    
    if (isArtist) {
      artistData = await BlockchainService.getArtistByAddress(req.user?.address || '')
    }
    
    const response: ApiResponse = {
      success: true,
      data: {
        address: req.user?.address,
        chainId: req.user?.chainId,
        isArtist,
        artistData,
        createdAt: new Date().toISOString()
      },
      message: 'Profile retrieved successfully'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching profile:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch profile',
      message: 'An error occurred while fetching profile'
    }
    res.status(500).json(response)
  }
})

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: 'Logout successful'
  }
  
  res.json(response)
})

export default router