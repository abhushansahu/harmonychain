import OrbitDB from 'orbit-db'
import IPFS from 'ipfs-core'

export interface Track {
  id: string
  title: string
  artist: string
  artistAddress: string
  ipfsHash: string
  genre: string
  duration?: number
  fileSize?: number
  metadataHash?: string
  isActive: boolean
  playCount: number
  createdAt: number
  updatedAt: number
}

export interface Artist {
  id: string
  walletAddress: string
  name: string
  bio?: string
  profileImageHash?: string
  isVerified: boolean
  totalTracks: number
  totalEarnings: number
  createdAt: number
  updatedAt: number
}

export interface Playlist {
  id: string
  userId: string
  name: string
  description?: string
  isPublic: boolean
  ipfsHash?: string
  trackCount: number
  createdAt: number
  updatedAt: number
}

class HarmonyOrbitDB {
  private ipfs: any = null
  private orbitdb: any = null
  private tracks: any = null
  private artists: any = null
  private playlists: any = null
  private isInitialized = false

  async init(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Initialize IPFS
      this.ipfs = await IPFS.create({
        repo: './ipfs',
        config: {
          Addresses: {
            Swarm: ['/ip4/0.0.0.0/tcp/4002', '/ip4/127.0.0.1/tcp/4003/ws']
          },
          Bootstrap: [
            '/ip4/127.0.0.1/tcp/4001',
            '/ip4/127.0.0.1/tcp/4002/ws'
          ]
        }
      })

      // Initialize OrbitDB
      this.orbitdb = await OrbitDB.createInstance(this.ipfs)

      // Create databases
      this.tracks = await this.orbitdb.docs('harmonychain.tracks', {
        indexBy: 'id'
      })
      
      this.artists = await this.orbitdb.docs('harmonychain.artists', {
        indexBy: 'walletAddress'
      })

      this.playlists = await this.orbitdb.docs('harmonychain.playlists', {
        indexBy: 'id'
      })

      // Load databases
      await this.tracks.load()
      await this.artists.load()
      await this.playlists.load()

      this.isInitialized = true
      console.log('OrbitDB initialized successfully')
    } catch (error) {
      console.error('Failed to initialize OrbitDB:', error)
      throw error
    }
  }

  // Track operations
  async addTrack(trackData: Omit<Track, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.isInitialized) await this.init()

    const track: Track = {
      ...trackData,
      id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    await this.tracks.put(track)
    return track.id
  }

  async getTrack(id: string): Promise<Track | null> {
    if (!this.isInitialized) await this.init()

    const tracks = this.tracks.get(id)
    return tracks.length > 0 ? tracks[0] : null
  }

  async getAllTracks(): Promise<Track[]> {
    if (!this.isInitialized) await this.init()

    return this.tracks.get('')
  }

  async getTracksByArtist(artistAddress: string): Promise<Track[]> {
    if (!this.isInitialized) await this.init()

    const allTracks = this.tracks.get('')
    return allTracks.filter(track => track.artistAddress === artistAddress)
  }

  async updateTrack(id: string, updates: Partial<Track>): Promise<void> {
    if (!this.isInitialized) await this.init()

    const track = await this.getTrack(id)
    if (!track) throw new Error('Track not found')

    const updatedTrack = {
      ...track,
      ...updates,
      updatedAt: Date.now()
    }

    await this.tracks.put(updatedTrack)
  }

  async deleteTrack(id: string): Promise<void> {
    if (!this.isInitialized) await this.init()

    await this.tracks.del(id)
  }

  // Artist operations
  async addArtist(artistData: Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.isInitialized) await this.init()

    const artist: Artist = {
      ...artistData,
      id: `artist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    await this.artists.put(artist)
    return artist.id
  }

  async getArtist(walletAddress: string): Promise<Artist | null> {
    if (!this.isInitialized) await this.init()

    const artists = this.artists.get(walletAddress)
    return artists.length > 0 ? artists[0] : null
  }

  async getAllArtists(): Promise<Artist[]> {
    if (!this.isInitialized) await this.init()

    return this.artists.get('')
  }

  async updateArtist(walletAddress: string, updates: Partial<Artist>): Promise<void> {
    if (!this.isInitialized) await this.init()

    const artist = await this.getArtist(walletAddress)
    if (!artist) throw new Error('Artist not found')

    const updatedArtist = {
      ...artist,
      ...updates,
      updatedAt: Date.now()
    }

    await this.artists.put(updatedArtist)
  }

  // Playlist operations
  async addPlaylist(playlistData: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.isInitialized) await this.init()

    const playlist: Playlist = {
      ...playlistData,
      id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    await this.playlists.put(playlist)
    return playlist.id
  }

  async getPlaylist(id: string): Promise<Playlist | null> {
    if (!this.isInitialized) await this.init()

    const playlists = this.playlists.get(id)
    return playlists.length > 0 ? playlists[0] : null
  }

  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    if (!this.isInitialized) await this.init()

    const allPlaylists = this.playlists.get('')
    return allPlaylists.filter(playlist => playlist.userId === userId)
  }

  async updatePlaylist(id: string, updates: Partial<Playlist>): Promise<void> {
    if (!this.isInitialized) await this.init()

    const playlist = await this.getPlaylist(id)
    if (!playlist) throw new Error('Playlist not found')

    const updatedPlaylist = {
      ...playlist,
      ...updates,
      updatedAt: Date.now()
    }

    await this.playlists.put(updatedPlaylist)
  }

  async deletePlaylist(id: string): Promise<void> {
    if (!this.isInitialized) await this.init()

    await this.playlists.del(id)
  }

  // Search functionality
  async searchTracks(query: string): Promise<Track[]> {
    if (!this.isInitialized) await this.init()

    const allTracks = this.tracks.get('')
    const lowercaseQuery = query.toLowerCase()

    return allTracks.filter(track => 
      track.title.toLowerCase().includes(lowercaseQuery) ||
      track.artist.toLowerCase().includes(lowercaseQuery) ||
      track.genre.toLowerCase().includes(lowercaseQuery)
    )
  }

  async getTracksByGenre(genre: string): Promise<Track[]> {
    if (!this.isInitialized) await this.init()

    const allTracks = this.tracks.get('')
    return allTracks.filter(track => track.genre.toLowerCase() === genre.toLowerCase())
  }

  // Event listeners
  onTracksChange(callback: (tracks: Track[]) => void): void {
    if (!this.isInitialized) return

    this.tracks.events.on('replicated', () => {
      const tracks = this.tracks.get('')
      callback(tracks)
    })
  }

  onArtistsChange(callback: (artists: Artist[]) => void): void {
    if (!this.isInitialized) return

    this.artists.events.on('replicated', () => {
      const artists = this.artists.get('')
      callback(artists)
    })
  }

  onPlaylistsChange(callback: (playlists: Playlist[]) => void): void {
    if (!this.isInitialized) return

    this.playlists.events.on('replicated', () => {
      const playlists = this.playlists.get('')
      callback(playlists)
    })
  }

  // Cleanup
  async close(): Promise<void> {
    if (this.tracks) await this.tracks.close()
    if (this.artists) await this.artists.close()
    if (this.playlists) await this.playlists.close()
    if (this.orbitdb) await this.orbitdb.stop()
    if (this.ipfs) await this.ipfs.stop()
    
    this.isInitialized = false
  }
}

// Singleton instance
export const harmonyOrbitDB = new HarmonyOrbitDB()
export default harmonyOrbitDB
