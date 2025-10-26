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
  isStreamable: boolean
  playCount: number
  owner: string
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

  async uploadTrack(formData: FormData, authToken: string, walletAddress: string): Promise<ApiResponse<Track>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tracks`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'X-Wallet-Address': walletAddress
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Track upload failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to upload track'
      }
    }
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
    return this.request('/health')
  }

  // Generic request method for custom endpoints
  async customRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, options)
  }

  // Third-party service integrations
  async getTransactionDetails(txHash: string, chainId: number = 1337): Promise<ApiResponse<any>> {
    try {
      // For local Hardhat network, use local explorer
      if (chainId === 1337) {
        const response = await fetch(`http://localhost:8545/api/transaction/${txHash}`)
        if (response.ok) {
          const data = await response.json()
          return { success: true, data }
        }
      }
      
      // For Harmony networks, use Blockscout
      const blockscoutUrl = chainId === 1666600000 
        ? 'https://explorer.harmony.one/api' 
        : 'https://explorer.pops.one/api'
      
      const response = await fetch(`${blockscoutUrl}?module=transaction&action=gettxinfo&txhash=${txHash}`)
      const data = await response.json()
      
      if (data.status === '1') {
        return { success: true, data: data.result }
      } else {
        throw new Error(data.message || 'Transaction not found')
      }
    } catch (error) {
      console.error('Failed to fetch transaction details:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch transaction details'
      }
    }
  }

  async getContractDetails(contractAddress: string, chainId: number = 1337): Promise<ApiResponse<any>> {
    try {
      // For local Hardhat network
      if (chainId === 1337) {
        return { success: true, data: { address: contractAddress, verified: true } }
      }
      
      // For Harmony networks, use Blockscout
      const blockscoutUrl = chainId === 1666600000 
        ? 'https://explorer.harmony.one/api' 
        : 'https://explorer.pops.one/api'
      
      const response = await fetch(`${blockscoutUrl}?module=contract&action=getsourcecode&address=${contractAddress}`)
      const data = await response.json()
      
      if (data.status === '1') {
        return { success: true, data: data.result[0] }
      } else {
        throw new Error(data.message || 'Contract not found')
      }
    } catch (error) {
      console.error('Failed to fetch contract details:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch contract details'
      }
    }
  }

  // Pyth Network price feeds
  async getPriceFeed(symbol: string = 'ONE'): Promise<ApiResponse<any>> {
    try {
      // For now, use mock price data
      // In production, this would integrate with Pyth Network price feeds
      const mockPrices = {
        'ONE': { price: 0.02, symbol: 'ONE', timestamp: Date.now() },
        'ETH': { price: 2000, symbol: 'ETH', timestamp: Date.now() },
        'USDC': { price: 1, symbol: 'USDC', timestamp: Date.now() }
      }
      
      return { 
        success: true, 
        data: mockPrices[symbol as keyof typeof mockPrices] || mockPrices.ONE 
      }
    } catch (error) {
      console.error('Failed to fetch price feed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch price feed'
      }
    }
  }

  // Lighthouse integration for decentralized storage
  async uploadToLighthouse(file: File, apiKey: string): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('https://node.lighthouse.storage/api/v0/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        return { success: true, data }
      } else {
        throw new Error('Lighthouse upload failed')
      }
    } catch (error) {
      console.error('Lighthouse upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lighthouse upload failed'
      }
    }
  }

  // Lit Protocol integration for token-gated content
  async encryptContent(content: string, accessControlConditions: any[]): Promise<ApiResponse<any>> {
    try {
      // Mock implementation - in production would use Lit Protocol SDK
      const encryptedData = {
        encryptedContent: btoa(content), // Base64 encode for demo
        accessControlConditions,
        encryptedSymmetricKey: 'mock-key',
        chain: 'harmony',
        timestamp: Date.now()
      }
      
      return { success: true, data: encryptedData }
    } catch (error) {
      console.error('Lit Protocol encryption error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Encryption failed'
      }
    }
  }

  async decryptContent(encryptedData: any, userAddress: string): Promise<ApiResponse<any>> {
    try {
      // Mock implementation - in production would use Lit Protocol SDK
      const decryptedContent = atob(encryptedData.encryptedContent) // Base64 decode for demo
      
      return { success: true, data: { content: decryptedContent } }
    } catch (error) {
      console.error('Lit Protocol decryption error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Decryption failed'
      }
    }
  }
}

export const apiClient = new ApiClient()
