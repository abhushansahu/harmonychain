const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface Track {
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

export interface Artist {
  id: string
  name: string
  walletAddress: string
  bio: string
  avatar: string
  verified: boolean
  followers: number
  tracks: number
  createdAt: string
}

export interface NFT {
  id: string
  tokenId: string
  owner: string
  price: number
  isListed: boolean
  metadata: string
  createdAt: string
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to fetch data from API'
      }
    }
  }

  // Track endpoints
  async getTracks(): Promise<ApiResponse<Track[]>> {
    return this.request<Track[]>('/api/tracks')
  }

  async getTrack(id: string): Promise<ApiResponse<Track>> {
    return this.request<Track>(`/api/tracks/${id}`)
  }

  async createTrack(track: Omit<Track, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Track>> {
    return this.request<Track>('/api/tracks', {
      method: 'POST',
      body: JSON.stringify(track),
    })
  }

  // Artist endpoints
  async getArtists(): Promise<ApiResponse<Artist[]>> {
    return this.request<Artist[]>('/api/artists')
  }

  async getArtist(id: string): Promise<ApiResponse<Artist>> {
    return this.request<Artist>(`/api/artists/${id}`)
  }

  // NFT endpoints
  async getNFTs(): Promise<ApiResponse<NFT[]>> {
    return this.request<NFT[]>('/api/nfts')
  }

  async getNFT(id: string): Promise<ApiResponse<NFT>> {
    return this.request<NFT>(`/api/nfts/${id}`)
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/api/health')
  }
}

export const apiClient = new ApiClient()
