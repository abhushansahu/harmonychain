import { CeramicClient } from '@ceramicnetwork/http-client'
import { TileDocument } from '@ceramicnetwork/stream-tile'
import { Composite } from '@composedb/client'

export interface TrackMetadata {
  title: string
  artist: string
  artistAddress: string
  genre: string
  description?: string
  ipfsHash: string
  duration?: number
  fileSize?: number
  tags?: string[]
  license?: string
  createdAt: number
  updatedAt: number
}

export interface ArtistProfile {
  name: string
  bio?: string
  profileImageHash?: string
  socialLinks?: {
    twitter?: string
    instagram?: string
    website?: string
  }
  genres?: string[]
  location?: string
  createdAt: number
  updatedAt: number
}

export interface PlaylistMetadata {
  name: string
  description?: string
  isPublic: boolean
  tags?: string[]
  coverImageHash?: string
  createdAt: number
  updatedAt: number
}

class HarmonyCeramic {
  private ceramic: CeramicClient
  private composeClient: Composite | null = null
  private isInitialized = false

  constructor() {
    this.ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com')
  }

  async init(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Initialize Ceramic client
      await this.ceramic.ready
      
      // Initialize ComposeDB (if available)
      // this.composeClient = new Composite({
      //   ceramic: this.ceramic,
      //   definition: harmonyChainDefinition
      // })

      this.isInitialized = true
      console.log('Ceramic initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Ceramic:', error)
      throw error
    }
  }

  // Track metadata operations
  async createTrackMetadata(metadata: TrackMetadata): Promise<string> {
    if (!this.isInitialized) await this.init()

    try {
      const trackMetadata = await TileDocument.create(this.ceramic, {
        title: metadata.title,
        artist: metadata.artist,
        artistAddress: metadata.artistAddress,
        genre: metadata.genre,
        description: metadata.description,
        ipfsHash: metadata.ipfsHash,
        duration: metadata.duration,
        fileSize: metadata.fileSize,
        tags: metadata.tags || [],
        license: metadata.license || 'CC BY-SA 4.0',
        createdAt: metadata.createdAt,
        updatedAt: metadata.updatedAt
      })

      return trackMetadata.id.toString()
    } catch (error) {
      console.error('Failed to create track metadata:', error)
      throw error
    }
  }

  async getTrackMetadata(streamId: string): Promise<TrackMetadata | null> {
    if (!this.isInitialized) await this.init()

    try {
      const doc = await TileDocument.load(this.ceramic, streamId)
      return doc.content as TrackMetadata
    } catch (error) {
      console.error('Failed to get track metadata:', error)
      return null
    }
  }

  async updateTrackMetadata(streamId: string, updates: Partial<TrackMetadata>): Promise<TrackMetadata> {
    if (!this.isInitialized) await this.init()

    try {
      const doc = await TileDocument.load(this.ceramic, streamId)
      const currentContent = doc.content as TrackMetadata
      
      const updatedContent = {
        ...currentContent,
        ...updates,
        updatedAt: Date.now()
      }

      await doc.update(updatedContent)
      return updatedContent
    } catch (error) {
      console.error('Failed to update track metadata:', error)
      throw error
    }
  }

  // Artist profile operations
  async createArtistProfile(profile: ArtistProfile): Promise<string> {
    if (!this.isInitialized) await this.init()

    try {
      const artistProfile = await TileDocument.create(this.ceramic, {
        name: profile.name,
        bio: profile.bio,
        profileImageHash: profile.profileImageHash,
        socialLinks: profile.socialLinks || {},
        genres: profile.genres || [],
        location: profile.location,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      })

      return artistProfile.id.toString()
    } catch (error) {
      console.error('Failed to create artist profile:', error)
      throw error
    }
  }

  async getArtistProfile(streamId: string): Promise<ArtistProfile | null> {
    if (!this.isInitialized) await this.init()

    try {
      const doc = await TileDocument.load(this.ceramic, streamId)
      return doc.content as ArtistProfile
    } catch (error) {
      console.error('Failed to get artist profile:', error)
      return null
    }
  }

  async updateArtistProfile(streamId: string, updates: Partial<ArtistProfile>): Promise<ArtistProfile> {
    if (!this.isInitialized) await this.init()

    try {
      const doc = await TileDocument.load(this.ceramic, streamId)
      const currentContent = doc.content as ArtistProfile
      
      const updatedContent = {
        ...currentContent,
        ...updates,
        updatedAt: Date.now()
      }

      await doc.update(updatedContent)
      return updatedContent
    } catch (error) {
      console.error('Failed to update artist profile:', error)
      throw error
    }
  }

  // Playlist metadata operations
  async createPlaylistMetadata(metadata: PlaylistMetadata): Promise<string> {
    if (!this.isInitialized) await this.init()

    try {
      const playlistMetadata = await TileDocument.create(this.ceramic, {
        name: metadata.name,
        description: metadata.description,
        isPublic: metadata.isPublic,
        tags: metadata.tags || [],
        coverImageHash: metadata.coverImageHash,
        createdAt: metadata.createdAt,
        updatedAt: metadata.updatedAt
      })

      return playlistMetadata.id.toString()
    } catch (error) {
      console.error('Failed to create playlist metadata:', error)
      throw error
    }
  }

  async getPlaylistMetadata(streamId: string): Promise<PlaylistMetadata | null> {
    if (!this.isInitialized) await this.init()

    try {
      const doc = await TileDocument.load(this.ceramic, streamId)
      return doc.content as PlaylistMetadata
    } catch (error) {
      console.error('Failed to get playlist metadata:', error)
      return null
    }
  }

  async updatePlaylistMetadata(streamId: string, updates: Partial<PlaylistMetadata>): Promise<PlaylistMetadata> {
    if (!this.isInitialized) await this.init()

    try {
      const doc = await TileDocument.load(this.ceramic, streamId)
      const currentContent = doc.content as PlaylistMetadata
      
      const updatedContent = {
        ...currentContent,
        ...updates,
        updatedAt: Date.now()
      }

      await doc.update(updatedContent)
      return updatedContent
    } catch (error) {
      console.error('Failed to update playlist metadata:', error)
      throw error
    }
  }

  // Search functionality
  async searchMetadata(query: string, type: 'track' | 'artist' | 'playlist'): Promise<any[]> {
    if (!this.isInitialized) await this.init()

    try {
      // This would require a search index or external service
      // For now, we'll implement basic search
      console.log(`Searching ${type} metadata for: ${query}`)
      
      // TODO: Implement proper search functionality
      // This could integrate with Ceramic's search capabilities
      // or use external search services
      
      return []
    } catch (error) {
      console.error('Failed to search metadata:', error)
      return []
    }
  }

  // Utility functions
  async getStreamInfo(streamId: string): Promise<any> {
    if (!this.isInitialized) await this.init()

    try {
      const doc = await TileDocument.load(this.ceramic, streamId)
      return {
        id: doc.id.toString(),
        content: doc.content,
        metadata: doc.metadata,
        state: doc.state
      }
    } catch (error) {
      console.error('Failed to get stream info:', error)
      return null
    }
  }

  async pinStream(streamId: string): Promise<void> {
    if (!this.isInitialized) await this.init()

    try {
      // Pin the stream to ensure availability
      await this.ceramic.pin.add(streamId)
    } catch (error) {
      console.error('Failed to pin stream:', error)
      throw error
    }
  }

  async unpinStream(streamId: string): Promise<void> {
    if (!this.isInitialized) await this.init()

    try {
      await this.ceramic.pin.rm(streamId)
    } catch (error) {
      console.error('Failed to unpin stream:', error)
      throw error
    }
  }

  // Cleanup
  async close(): Promise<void> {
    if (this.ceramic) {
      await this.ceramic.close()
    }
    
    this.isInitialized = false
  }
}

// Singleton instance
export const harmonyCeramic = new HarmonyCeramic()
export default harmonyCeramic
