// Simple types for API responses
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        address: string
        chainId: number
        nonce: string
      }
    }
  }
}

export interface User {
  id: string
  walletAddress: string
  username?: string
  email?: string
  avatar?: string
  isArtist: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Track {
  id: string
  title: string
  artist: string
  artistId: string
  duration: number
  genre: string
  coverArt?: string
  audioFile: string
  ipfsHash: string
  price: number
  createdAt: string
  updatedAt: string
}

export interface NFT {
  id: string
  tokenId: string
  contractAddress: string
  owner: string
  trackId: string
  price: number
  isListed: boolean
  createdAt: string
  updatedAt: string
}

export interface Playlist {
  id: string
  name: string
  description?: string
  ownerId: string
  tracks: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface License {
  id: string
  trackId: string
  licensee: string
  licenseType: 'streaming' | 'commercial' | 'sync'
  price: number
  duration: number
  isActive: boolean
  createdAt: string
  expiresAt: string
}
