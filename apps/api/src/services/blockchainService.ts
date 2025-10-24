import { getMusicRegistryContract, getNFTMarketplaceContract } from '../config/blockchain'
import { ethers } from 'ethers'

// Define interfaces locally since shared package has issues
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

interface NFT {
  id: string
  tokenId: string
  owner: string
  price: number
  isListed: boolean
  metadata: string
  createdAt: string
}

export class BlockchainService {
  // Track operations
  static async getTracks(): Promise<Track[]> {
    try {
      const contract = getMusicRegistryContract()
      const totalTracks = await contract.getTotalTracks()
      
      const tracks: Track[] = []
      for (let i = 1; i <= totalTracks; i++) {
        try {
          const trackData = await contract.getTrack(i)
          tracks.push({
            id: trackData.id.toString(),
            title: trackData.title,
            artist: trackData.artist,
            artistId: trackData.artistId.toString(),
            duration: Number(trackData.duration),
            genre: trackData.genre,
            coverArt: trackData.coverArt,
            audioFile: trackData.audioFile,
            ipfsHash: trackData.ipfsHash,
            price: Number(trackData.price),
            createdAt: new Date(Number(trackData.createdAt) * 1000).toISOString(),
            updatedAt: new Date(Number(trackData.createdAt) * 1000).toISOString()
          })
        } catch (error) {
          console.warn(`Failed to fetch track ${i}:`, error)
        }
      }
      
      return tracks
    } catch (error) {
      console.error('Error fetching tracks from blockchain:', error)
      return []
    }
  }

  static async getTrack(trackId: string): Promise<Track | null> {
    try {
      const contract = getMusicRegistryContract()
      const trackData = await contract.getTrack(trackId)
      
      return {
        id: trackData.id.toString(),
        title: trackData.title,
        artist: trackData.artist,
        artistId: trackData.artistId.toString(),
        duration: Number(trackData.duration),
        genre: trackData.genre,
        coverArt: trackData.coverArt,
        audioFile: trackData.audioFile,
        ipfsHash: trackData.ipfsHash,
        price: Number(trackData.price),
        createdAt: new Date(Number(trackData.createdAt) * 1000).toISOString(),
        updatedAt: new Date(Number(trackData.createdAt) * 1000).toISOString()
      }
    } catch (error) {
      console.error('Error fetching track from blockchain:', error)
      return null
    }
  }

  static async registerTrack(trackData: {
    title: string
    duration: number
    genre: string
    coverArt: string
    audioFile: string
    ipfsHash: string
    price: number
  }): Promise<string> {
    try {
      const contract = getMusicRegistryContract()
      const tx = await contract.registerTrack(
        trackData.title,
        trackData.duration,
        trackData.genre,
        trackData.coverArt,
        trackData.audioFile,
        trackData.ipfsHash,
        trackData.price
      )
      
      const receipt = await tx.wait()
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed && parsed.name === 'TrackRegistered'
        } catch {
          return false
        }
      })
      
      if (event) {
        const parsed = contract.interface.parseLog(event)
        if (parsed && parsed.args && parsed.args.trackId) {
          return parsed.args.trackId.toString()
        }
      }
      
      throw new Error('Track registration event not found')
    } catch (error) {
      console.error('Error registering track on blockchain:', error)
      throw error
    }
  }

  static async playTrack(trackId: string): Promise<void> {
    try {
      const contract = getMusicRegistryContract()
      const tx = await contract.playTrack(trackId)
      await tx.wait()
    } catch (error) {
      console.error('Error playing track on blockchain:', error)
      throw error
    }
  }

  // NFT operations
  static async getNFTs(): Promise<NFT[]> {
    // This would require implementing a way to track NFTs
    // For now, return empty array
    return []
  }

  static async mintNFT(nftData: {
    to: string
    tokenURI: string
    trackId: string
    price: number
  }): Promise<string> {
    try {
      const contract = getNFTMarketplaceContract()
      const tx = await contract.mintNFT(
        nftData.to,
        nftData.tokenURI,
        nftData.trackId,
        nftData.price,
        { value: ethers.parseEther('0.001') } // Listing fee
      )
      
      const receipt = await tx.wait()
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed && parsed.name === 'NFTMinted'
        } catch {
          return false
        }
      })
      
      if (event) {
        const parsed = contract.interface.parseLog(event)
        if (parsed && parsed.args && parsed.args.tokenId) {
          return parsed.args.tokenId.toString()
        }
      }
      
      throw new Error('NFT minting event not found')
    } catch (error) {
      console.error('Error minting NFT on blockchain:', error)
      throw error
    }
  }

  // Artist operations
  static async registerArtist(artistData: {
    name: string
    description: string
    avatar: string
  }): Promise<string> {
    try {
      const contract = getMusicRegistryContract()
      const tx = await contract.registerArtist(
        artistData.name,
        artistData.description,
        artistData.avatar
      )
      
      const receipt = await tx.wait()
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed && parsed.name === 'ArtistRegistered'
        } catch {
          return false
        }
      })
      
      if (event) {
        const parsed = contract.interface.parseLog(event)
        if (parsed && parsed.args && parsed.args.artistId) {
          return parsed.args.artistId.toString()
        }
      }
      
      throw new Error('Artist registration event not found')
    } catch (error) {
      console.error('Error registering artist on blockchain:', error)
      throw error
    }
  }

  static async getArtist(artistId: string): Promise<any> {
    try {
      const contract = getMusicRegistryContract()
      const artistData = await contract.getArtist(artistId)
      
      return {
        id: artistData.id.toString(),
        name: artistData.name,
        description: artistData.description,
        avatar: artistData.avatar,
        walletAddress: artistData.walletAddress,
        totalTracks: Number(artistData.totalTracks),
        totalEarnings: Number(artistData.totalEarnings),
        isVerified: artistData.isVerified,
        createdAt: new Date(Number(artistData.createdAt) * 1000).toISOString()
      }
    } catch (error) {
      console.error('Error fetching artist from blockchain:', error)
      return null
    }
  }

  static async getArtistTracks(artistAddress: string): Promise<string[]> {
    try {
      const contract = getMusicRegistryContract()
      const trackIds = await contract.getArtistTracks(artistAddress)
      return trackIds.map((id: any) => id.toString())
    } catch (error) {
      console.error('Error fetching artist tracks from blockchain:', error)
      return []
    }
  }

  // Note: Blockchain is immutable, so we can't actually update or delete tracks
  // These methods are kept for API compatibility but will return appropriate responses
  static async updateTrack(trackId: string, updateData: any): Promise<Track | null> {
    try {
      // Blockchain is immutable - we can't update tracks
      // In a real implementation, you might:
      // 1. Create a new track with updated metadata
      // 2. Use off-chain metadata storage
      // 3. Use a proxy pattern
      console.log('Blockchain is immutable - cannot update track:', trackId)
      return null
    } catch (error) {
      console.error('Error updating track on blockchain:', error)
      return null
    }
  }

  static async deleteTrack(trackId: string): Promise<boolean> {
    try {
      // Blockchain is immutable - we can't delete tracks
      // In a real implementation, you might:
      // 1. Mark track as inactive in off-chain storage
      // 2. Transfer ownership to a burn address
      // 3. Use a proxy pattern
      console.log('Blockchain is immutable - cannot delete track:', trackId)
      return false
    } catch (error) {
      console.error('Error deleting track from blockchain:', error)
      return false
    }
  }
}
