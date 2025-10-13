import { useState, useEffect } from 'react'
import { useAuth } from '../components/auth/AuthProvider'
import { HarmonyService } from './services'
import { Track, Artist, Playlist, ApiResponse, PaginationParams, SearchParams } from './types'

// Custom hooks for data fetching
export const useTracks = (params: PaginationParams) => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true)
      setError(null)
      
      const response = await HarmonyService.getTracks(params)
      
      if (response.success && response.data) {
        setTracks(response.data)
      } else {
        setError(response.error || 'Failed to fetch tracks')
      }
      
      setLoading(false)
    }

    fetchTracks()
  }, [params.page, params.limit])

  return { tracks, loading, error }
}

export const useTrack = (id: string) => {
  const [track, setTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchTrack = async () => {
      setLoading(true)
      setError(null)
      
      const response = await HarmonyService.getTrack(id)
      
      if (response.success && response.data) {
        setTrack(response.data)
      } else {
        setError(response.error || 'Failed to fetch track')
      }
      
      setLoading(false)
    }

    fetchTrack()
  }, [id])

  return { track, loading, error }
}

export const useSearchTracks = (params: SearchParams) => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params.query) {
      setTracks([])
      return
    }

    const searchTracks = async () => {
      setLoading(true)
      setError(null)
      
      const response = await HarmonyService.searchTracks(params)
      
      if (response.success && response.data) {
        setTracks(response.data)
      } else {
        setError(response.error || 'Search failed')
      }
      
      setLoading(false)
    }

    searchTracks()
  }, [params.query, params.genre, params.artist])

  return { tracks, loading, error }
}

export const useArtists = (params: PaginationParams) => {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true)
      setError(null)
      
      const response = await HarmonyService.getArtists(params)
      
      if (response.success && response.data) {
        setArtists(response.data)
      } else {
        setError(response.error || 'Failed to fetch artists')
      }
      
      setLoading(false)
    }

    fetchArtists()
  }, [params.page, params.limit])

  return { artists, loading, error }
}

export const usePlaylists = (userId: string) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchPlaylists = async () => {
      setLoading(true)
      setError(null)
      
      const response = await HarmonyService.getPlaylists(userId)
      
      if (response.success && response.data) {
        setPlaylists(response.data)
      } else {
        setError(response.error || 'Failed to fetch playlists')
      }
      
      setLoading(false)
    }

    fetchPlaylists()
  }, [userId])

  return { playlists, loading, error }
}

// Hook for authenticated user's data
export const useUserData = () => {
  const { user, isAuthenticated } = useAuth()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setPlaylists([])
      return
    }

    const fetchUserData = async () => {
      setLoading(true)
      const response = await HarmonyService.getPlaylists(user.address)
      
      if (response.success && response.data) {
        setPlaylists(response.data)
      }
      
      setLoading(false)
    }

    fetchUserData()
  }, [isAuthenticated, user?.address])

  return { playlists, loading }
}
