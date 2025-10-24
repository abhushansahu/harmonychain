'use client'

import React, { useState, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import SearchInterface from '@/components/discovery/SearchInterface'
import GenreFilter from '@/components/discovery/GenreFilter'
import TrendingTracks from '@/components/discovery/TrendingTracks'
import { Track, Artist, SearchFilters } from '@/lib/types'
import { apiClient } from '@/lib/api/client'
import toast from 'react-hot-toast'

export default function DiscoverPage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'newest'
  })
  const [tracks, setTracks] = useState<Track[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch tracks and artists from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [tracksResponse, artistsResponse] = await Promise.all([
          apiClient.getTracks(),
          apiClient.getArtists()
        ])
        
        if (tracksResponse.success && tracksResponse.data) {
          // Map API response to expected Track format
          const mappedTracks = tracksResponse.data.map(track => ({
            ...track,
            isStreamable: true,
            playCount: 0,
            owner: track.artistId
          }))
          setTracks(mappedTracks)
        } else {
          console.warn('Failed to fetch tracks:', tracksResponse.error)
          setTracks([])
        }
        
        if (artistsResponse.success && artistsResponse.data) {
          // Map API response to expected Artist format
          const mappedArtists = artistsResponse.data.map(artist => ({
            ...artist,
            description: artist.bio || '',
            totalTracks: artist.tracks || 0,
            totalEarnings: 0, // Will be calculated from blockchain
            isVerified: artist.verified || false
          }))
          setArtists(mappedArtists)
        } else {
          console.warn('Failed to fetch artists:', artistsResponse.error)
          setArtists([])
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load tracks and artists')
        toast.error('Failed to load tracks and artists')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = async (filters: SearchFilters) => {
    setSearchFilters(filters)
    try {
      setLoading(true)
      const response = await apiClient.getTracks()
      if (response.success && response.data) {
        // Map API response to expected Track format
        const mappedTracks = response.data.map(track => ({
          ...track,
          isStreamable: true,
          playCount: 0,
          owner: track.artistId
        }))
        setTracks(mappedTracks)
      }
    } catch (err) {
      console.error('Search error:', err)
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleTrackSelect = (track: Track) => {
    // Navigate to track detail or start playing
    console.log('Selected track:', track)
  }

  const handleArtistSelect = (artist: Artist) => {
    // Navigate to artist profile
    console.log('Selected artist:', artist)
  }

  const handlePlayTrack = async (track: Track) => {
    try {
      // Call playTrack API to increment play count
      await apiClient.customRequest(`/api/tracks/${track.id}/play`, { method: 'POST' })
      console.log('Playing track:', track)
    } catch (err) {
      console.error('Play track error:', err)
      toast.error('Failed to play track')
    }
  }

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre)
      } else {
        return [...prev, genre]
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Discover Music</h1>
            <p className="text-xl text-gray-300">
              Explore the decentralized music ecosystem
            </p>
          </div>

          {/* Search Interface */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <SearchInterface
              onSearch={handleSearch}
              onTrackSelect={handleTrackSelect}
              onArtistSelect={handleArtistSelect}
            />
          </div>

          {/* Filters and Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <GenreFilter
                  selectedGenres={selectedGenres}
                  onGenreToggle={handleGenreToggle}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-300 mt-4">Loading tracks...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-400">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <TrendingTracks
                  tracks={tracks}
                  onTrackSelect={handleTrackSelect}
                  onPlayTrack={handlePlayTrack}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}