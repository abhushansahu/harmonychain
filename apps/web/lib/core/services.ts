import { harmonyOrbitDB } from '../database/orbitdb'
import { harmonyGraph } from '../graph/thegraph'
import { harmonyArweave } from '../storage/arweave'
import { Track, Artist, Playlist, ApiResponse, PaginationParams, SearchParams } from './types'

// Unified service layer
export class HarmonyService {
  // Track operations
  static async getTracks(params: PaginationParams): Promise<ApiResponse<Track[]>> {
    try {
      const tracks = await harmonyGraph.getTracks(params.limit, (params.page - 1) * params.limit)
      return { success: true, data: tracks }
    } catch (error) {
      return { success: false, error: 'Failed to fetch tracks' }
    }
  }

  static async getTrack(id: string): Promise<ApiResponse<Track>> {
    try {
      const track = await harmonyGraph.getTrack(id)
      return track ? { success: true, data: track } : { success: false, error: 'Track not found' }
    } catch (error) {
      return { success: false, error: 'Failed to fetch track' }
    }
  }

  static async searchTracks(params: SearchParams): Promise<ApiResponse<Track[]>> {
    try {
      const tracks = await harmonyGraph.searchTracks(params.query, 20, 0)
      return { success: true, data: tracks }
    } catch (error) {
      return { success: false, error: 'Search failed' }
    }
  }

  static async addTrack(trackData: Omit<Track, 'id' | 'createdAt'>): Promise<ApiResponse<string>> {
    try {
      const trackId = await harmonyOrbitDB.addTrack({
        ...trackData,
        createdAt: Date.now()
      })
      return { success: true, data: trackId }
    } catch (error) {
      return { success: false, error: 'Failed to add track' }
    }
  }

  // Artist operations
  static async getArtists(params: PaginationParams): Promise<ApiResponse<Artist[]>> {
    try {
      const artists = await harmonyGraph.getArtists(params.limit, (params.page - 1) * params.limit)
      return { success: true, data: artists }
    } catch (error) {
      return { success: false, error: 'Failed to fetch artists' }
    }
  }

  static async getArtist(address: string): Promise<ApiResponse<Artist>> {
    try {
      const artist = await harmonyGraph.getArtist(address)
      return artist ? { success: true, data: artist } : { success: false, error: 'Artist not found' }
    } catch (error) {
      return { success: false, error: 'Failed to fetch artist' }
    }
  }

  // Playlist operations
  static async getPlaylists(userId: string): Promise<ApiResponse<Playlist[]>> {
    try {
      const playlists = await harmonyOrbitDB.getUserPlaylists(userId)
      return { success: true, data: playlists }
    } catch (error) {
      return { success: false, error: 'Failed to fetch playlists' }
    }
  }

  static async addPlaylist(playlistData: Omit<Playlist, 'id' | 'createdAt'>): Promise<ApiResponse<string>> {
    try {
      const playlistId = await harmonyOrbitDB.addPlaylist({
        ...playlistData,
        createdAt: Date.now()
      })
      return { success: true, data: playlistId }
    } catch (error) {
      return { success: false, error: 'Failed to add playlist' }
    }
  }

  // Permanent storage
  static async storePermanently(track: Track): Promise<ApiResponse<string>> {
    try {
      const transactionId = await harmonyArweave.storeTrack(track)
      return { success: true, data: transactionId }
    } catch (error) {
      return { success: false, error: 'Failed to store permanently' }
    }
  }
}
