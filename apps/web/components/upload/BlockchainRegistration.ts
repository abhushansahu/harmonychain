/**
 * BlockchainRegistration handles smart contract interactions
 * Registers tracks on the blockchain with metadata and licensing
 */

import { TrackMetadata, LicenseSettings } from './LicenseSettings'

export interface BlockchainRegistrationResult {
  transactionHash: string
  trackId: string
  blockNumber: number
  gasUsed: string
  contractAddress: string
}

export interface RegistrationProgress {
  step: 'preparing' | 'uploading' | 'registering' | 'confirming' | 'completed' | 'error'
  progress: number
  message: string
  transactionHash?: string
  error?: string
}

export class BlockchainRegistration {
  private contractAddress: string
  private web3Provider: any
  private account: string

  constructor(contractAddress: string, web3Provider: any, account: string) {
    this.contractAddress = contractAddress
    this.web3Provider = web3Provider
    this.account = account
  }

  /**
   * Register a track on the blockchain
   */
  async registerTrack(
    ipfsHash: string,
    metadata: TrackMetadata,
    license: LicenseSettings,
    onProgress?: (progress: RegistrationProgress) => void
  ): Promise<BlockchainRegistrationResult> {
    try {
      // Step 1: Prepare registration
      onProgress?.({
        step: 'preparing',
        progress: 10,
        message: 'Preparing track registration...'
      })

      // Step 2: Upload metadata to IPFS
      onProgress?.({
        step: 'uploading',
        progress: 30,
        message: 'Uploading metadata to IPFS...'
      })

      const metadataHash = await this.uploadMetadata(metadata, license)

      // Step 3: Register on blockchain
      onProgress?.({
        step: 'registering',
        progress: 50,
        message: 'Registering track on blockchain...'
      })

      const transactionHash = await this.registerOnBlockchain(ipfsHash, metadataHash, license)

      // Step 4: Wait for confirmation
      onProgress?.({
        step: 'confirming',
        progress: 80,
        message: 'Waiting for transaction confirmation...'
      })

      const receipt = await this.waitForConfirmation(transactionHash)

      // Step 5: Complete
      onProgress?.({
        step: 'completed',
        progress: 100,
        message: 'Track registration completed!'
      })

      return {
        transactionHash,
        trackId: this.generateTrackId(ipfsHash),
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        contractAddress: this.contractAddress
      }
    } catch (error) {
      onProgress?.({
        step: 'error',
        progress: 0,
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  /**
   * Upload metadata to IPFS
   */
  private async uploadMetadata(
    metadata: TrackMetadata,
    license: LicenseSettings
  ): Promise<string> {
    const metadataObject = {
      track: {
        title: metadata.title,
        artist: metadata.artist,
        album: metadata.album,
        genre: metadata.genre,
        year: metadata.year,
        description: metadata.description,
        tags: metadata.tags,
        explicit: metadata.explicit,
        language: metadata.language,
        mood: metadata.mood,
        tempo: metadata.tempo,
        key: metadata.key,
        duration: metadata.duration,
        coverArt: metadata.coverArt,
        lyrics: metadata.lyrics,
        credits: metadata.credits
      },
      license: {
        type: license.type,
        price: license.price,
        currency: license.currency,
        royaltyPercentage: license.royaltyPercentage,
        commercialUse: license.commercialUse,
        derivativeWorks: license.derivativeWorks,
        distribution: license.distribution,
        performance: license.performance,
        synchronization: license.synchronization,
        attribution: license.attribution,
        shareAlike: license.shareAlike,
        nonCommercial: license.nonCommercial,
        noDerivatives: license.noDerivatives,
        customTerms: license.customTerms,
        expirationDate: license.expirationDate,
        territories: license.territories,
        platforms: license.platforms
      },
      timestamp: Date.now(),
      version: '1.0'
    }

    // Mock IPFS upload - in real app, this would use IPFS service
    const metadataJson = JSON.stringify(metadataObject, null, 2)
    const metadataHash = `QmMetadata${Date.now()}`
    
    console.log('Metadata uploaded to IPFS:', metadataHash)
    console.log('Metadata content:', metadataJson)
    
    return metadataHash
  }

  /**
   * Register track on blockchain
   */
  private async registerOnBlockchain(
    ipfsHash: string,
    metadataHash: string,
    license: LicenseSettings
  ): Promise<string> {
    // Mock blockchain interaction - in real app, this would use Web3
    const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`
    
    console.log('Registering track on blockchain:', {
      ipfsHash,
      metadataHash,
      license: license.type,
      price: license.price,
      currency: license.currency
    })
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return mockTransactionHash
  }

  /**
   * Wait for transaction confirmation
   */
  private async waitForConfirmation(transactionHash: string): Promise<any> {
    // Mock confirmation - in real app, this would poll the blockchain
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    return {
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
      gasUsed: Math.floor(Math.random() * 100000) + 50000
    }
  }

  /**
   * Generate unique track ID
   */
  private generateTrackId(ipfsHash: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 9)
    return `track_${timestamp}_${random}`
  }

  /**
   * Estimate gas cost for registration
   */
  async estimateGasCost(): Promise<{
    gasLimit: number
    gasPrice: string
    estimatedCost: string
  }> {
    // Mock gas estimation
    return {
      gasLimit: 200000,
      gasPrice: '20000000000', // 20 gwei
      estimatedCost: '0.004' // ETH
    }
  }

  /**
   * Check if track is already registered
   */
  async isTrackRegistered(ipfsHash: string): Promise<boolean> {
    // Mock check - in real app, this would query the smart contract
    return false
  }

  /**
   * Get track registration info
   */
  async getTrackInfo(trackId: string): Promise<{
    ipfsHash: string
    metadataHash: string
    owner: string
    registeredAt: number
    license: LicenseSettings
  } | null> {
    // Mock implementation
    return null
  }

  /**
   * Update track metadata
   */
  async updateTrackMetadata(
    trackId: string,
    newMetadata: TrackMetadata
  ): Promise<string> {
    // Mock implementation
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`
    return transactionHash
  }

  /**
   * Update track license
   */
  async updateTrackLicense(
    trackId: string,
    newLicense: LicenseSettings
  ): Promise<string> {
    // Mock implementation
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`
    return transactionHash
  }

  /**
   * Transfer track ownership
   */
  async transferOwnership(
    trackId: string,
    newOwner: string
  ): Promise<string> {
    // Mock implementation
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`
    return transactionHash
  }

  /**
   * Get registration history
   */
  async getRegistrationHistory(account: string): Promise<{
    trackId: string
    ipfsHash: string
    registeredAt: number
    transactionHash: string
  }[]> {
    // Mock implementation
    return []
  }

  /**
   * Validate registration data
   */
  validateRegistrationData(
    ipfsHash: string,
    metadata: TrackMetadata,
    license: LicenseSettings
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!ipfsHash || ipfsHash.length === 0) {
      errors.push('IPFS hash is required')
    }

    if (!metadata.title || metadata.title.trim().length === 0) {
      errors.push('Track title is required')
    }

    if (!metadata.artist || metadata.artist.trim().length === 0) {
      errors.push('Artist name is required')
    }

    if (!metadata.genre || metadata.genre.trim().length === 0) {
      errors.push('Genre is required')
    }

    if (license.type === 'commercial' && license.price <= 0) {
      errors.push('Price must be greater than 0 for commercial licenses')
    }

    if (license.royaltyPercentage < 0 || license.royaltyPercentage > 100) {
      errors.push('Royalty percentage must be between 0 and 100')
    }

    if (license.territories.length === 0) {
      errors.push('At least one territory must be selected')
    }

    if (license.platforms.length === 0) {
      errors.push('At least one platform must be selected')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Get contract ABI
   */
  getContractABI(): any[] {
    // Mock ABI - in real app, this would be the actual contract ABI
    return [
      {
        "inputs": [
          {"name": "ipfsHash", "type": "string"},
          {"name": "metadataHash", "type": "string"},
          {"name": "license", "type": "tuple"}
        ],
        "name": "registerTrack",
        "outputs": [{"name": "trackId", "type": "string"}],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  }

  /**
   * Get contract address
   */
  getContractAddress(): string {
    return this.contractAddress
  }

  /**
   * Get current account
   */
  getCurrentAccount(): string {
    return this.account
  }
}
