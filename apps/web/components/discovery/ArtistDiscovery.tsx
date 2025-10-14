'use client'

import React, { useState, useEffect } from 'react'
import { Artist, Track } from '../../lib/core/types'

interface ArtistDiscoveryProps {
  onArtistSelect: (artist: Artist) => void
  onTrackSelect: (track: Track) => void
  showVerifiedOnly?: boolean
  sortBy?: 'popularity' | 'newest' | 'alphabetical'
  limit?: number
}

interface ArtistWithStats extends Artist {
  totalPlays: number
  averageRating: number
  followerCount: number
  isFollowing: boolean
  recentTracks: Track[]
  topGenres: string[]
}

export default function ArtistDiscovery({
  onArtistSelect,
  onTrackSelect,
  showVerifiedOnly = false,
  sortBy = 'popularity',
  limit = 20
}: ArtistDiscoveryProps) {
  const [artists, setArtists] = useState<ArtistWithStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [currentSort, setCurrentSort] = useState(sortBy)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadArtists()
  }, [showVerifiedOnly, currentSort, selectedGenres, limit])

  const loadArtists = async () => {
    setIsLoading(true)
    try {
      // Mock implementation - in real app, this would call your API
      const mockArtists: ArtistWithStats[] = Array.from({ length: limit }, (_, index) => ({
        id: `artist-${index + 1}`,
        walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        name: `Artist ${index + 1}`,
        totalTracks: Math.floor(Math.random() * 50) + 5,
        isVerified: Math.random() > 0.3,
        totalPlays: Math.floor(Math.random() * 100000) + 1000,
        averageRating: Math.random() * 2 + 3, // 3-5 stars
        followerCount: Math.floor(Math.random() * 10000) + 100,
        isFollowing: Math.random() > 0.7,
        recentTracks: generateMockTracks(3),
        topGenres: ['Electronic', 'Rock', 'Pop'].slice(0, Math.floor(Math.random() * 3) + 1)
      }))

      // Filter by verification status
      let filteredArtists = showVerifiedOnly 
        ? mockArtists.filter(artist => artist.isVerified)
        : mockArtists

      // Filter by search query
      if (searchQuery.trim()) {
        filteredArtists = filteredArtists.filter(artist =>
          artist.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Filter by genres
      if (selectedGenres.length > 0) {
        filteredArtists = filteredArtists.filter(artist =>
          artist.topGenres.some(genre => selectedGenres.includes(genre))
        )
      }

      // Sort artists
      filteredArtists.sort((a, b) => {
        switch (currentSort) {
          case 'popularity':
            return b.totalPlays - a.totalPlays
          case 'newest':
            return b.followerCount - a.followerCount // Using follower count as proxy for newness
          case 'alphabetical':
            return a.name.localeCompare(b.name)
          default:
            return 0
        }
      })

      setArtists(filteredArtists)
    } catch (error) {
      console.error('Failed to load artists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockTracks = (count: number): Track[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: `track-${index + 1}`,
      title: `Track ${index + 1}`,
      artist: 'Artist Name',
      artistAddress: '0x123...',
      ipfsHash: `QmHash${index + 1}`,
      genre: ['Electronic', 'Rock', 'Pop'][index % 3],
      playCount: Math.floor(Math.random() * 1000) + 100,
      createdAt: Date.now() - Math.random() * 86400000 * 30
    }))
  }

  const handleFollowToggle = (artist: ArtistWithStats) => {
    setArtists(prev => prev.map(a => 
      a.id === artist.id 
        ? { ...a, isFollowing: !a.isFollowing, followerCount: a.isFollowing ? a.followerCount - 1 : a.followerCount + 1 }
        : a
    ))
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const getRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    return stars
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Discover Artists</h2>
          <p className="text-sm text-gray-500">Find new music creators to follow</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artists..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort */}
          <select
            value={currentSort}
            onChange={(e) => setCurrentSort(e.target.value as typeof currentSort)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="popularity">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="alphabetical">A-Z</option>
          </select>

          {/* Genre Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Genres:</span>
            <div className="flex flex-wrap gap-2">
              {['Electronic', 'Rock', 'Pop', 'Jazz'].map(genre => (
                <button
                  key={genre}
                  onClick={() => {
                    setSelectedGenres(prev => 
                      prev.includes(genre) 
                        ? prev.filter(g => g !== genre)
                        : [...prev, genre]
                    )
                  }}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    selectedGenres.includes(genre)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-primary-500'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Artists Grid/List */}
      {artists.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No artists found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {artists.map(artist => (
            <div
              key={artist.id}
              className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'flex items-center space-x-4' : ''
              }`}
            >
              {/* Artist Avatar */}
              <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {artist.name.charAt(0)}
                </div>
              </div>

              {/* Artist Info */}
              <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{artist.name}</h3>
                  {artist.isVerified && (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Tracks</p>
                    <p className="font-semibold">{artist.totalTracks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Plays</p>
                    <p className="font-semibold">{formatNumber(artist.totalPlays)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Followers</p>
                    <p className="font-semibold">{formatNumber(artist.followerCount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <div className="flex items-center space-x-1">
                      {getRatingStars(artist.averageRating)}
                    </div>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {artist.topGenres.map(genre => (
                    <span
                      key={genre}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Recent Tracks */}
                {artist.recentTracks.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-2">Recent tracks:</p>
                    <div className="space-y-1">
                      {artist.recentTracks.slice(0, 2).map(track => (
                        <button
                          key={track.id}
                          onClick={() => onTrackSelect(track)}
                          className="flex items-center justify-between w-full text-left text-sm text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          <span className="truncate">{track.title}</span>
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onArtistSelect(artist)}
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleFollowToggle(artist)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      artist.isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {artist.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
