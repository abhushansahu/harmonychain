'use client'

import React, { useState, useEffect } from 'react'
import { Track } from '../../lib/core/types'

interface ContentManagerProps {
  artistId: string
  onTrackSelect?: (track: Track) => void
  onTrackEdit?: (track: Track) => void
  onTrackDelete?: (trackId: string) => void
}

interface TrackWithStats extends Track {
  uploadDate: number
  lastPlayed?: number
  totalRevenue: number
  isPublished: boolean
  isNftMinted: boolean
  nftPrice?: number
  nftSales?: number
  tags: string[]
  description?: string
}

export default function ContentManager({
  artistId,
  onTrackSelect,
  onTrackEdit,
  onTrackDelete
}: ContentManagerProps) {
  const [tracks, setTracks] = useState<TrackWithStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'date' | 'plays' | 'revenue' | 'title'>('date')
  const [filterBy, setFilterBy] = useState<'all' | 'published' | 'unpublished' | 'nft'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])

  useEffect(() => {
    loadTracks()
  }, [artistId])

  const loadTracks = async () => {
    setIsLoading(true)
    try {
      // Mock implementation - in real app, this would call your API
      const mockTracks: TrackWithStats[] = [
        {
          id: '1',
          title: 'Hit Song',
          artist: 'Your Name',
          artistAddress: '0x123...',
          ipfsHash: 'QmHash1',
          genre: 'Electronic',
          playCount: 25000,
          createdAt: Date.now() - 86400000 * 7,
          uploadDate: Date.now() - 86400000 * 7,
          lastPlayed: Date.now() - 3600000,
          totalRevenue: 0.8,
          isPublished: true,
          isNftMinted: true,
          nftPrice: 0.1,
          nftSales: 5,
          tags: ['electronic', 'dance', 'hit'],
          description: 'My biggest hit so far'
        },
        {
          id: '2',
          title: 'Another Track',
          artist: 'Your Name',
          artistAddress: '0x123...',
          ipfsHash: 'QmHash2',
          genre: 'Rock',
          playCount: 18000,
          createdAt: Date.now() - 86400000 * 14,
          uploadDate: Date.now() - 86400000 * 14,
          lastPlayed: Date.now() - 7200000,
          totalRevenue: 0.6,
          isPublished: true,
          isNftMinted: false,
          tags: ['rock', 'alternative'],
          description: 'Alternative rock track'
        },
        {
          id: '3',
          title: 'Draft Song',
          artist: 'Your Name',
          artistAddress: '0x123...',
          ipfsHash: 'QmHash3',
          genre: 'Pop',
          playCount: 0,
          createdAt: Date.now() - 86400000 * 3,
          uploadDate: Date.now() - 86400000 * 3,
          totalRevenue: 0,
          isPublished: false,
          isNftMinted: false,
          tags: ['pop', 'draft'],
          description: 'Work in progress'
        }
      ]
      setTracks(mockTracks)
    } catch (error) {
      console.error('Failed to load tracks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTracks = tracks
    .filter(track => {
      if (filterBy === 'published') return track.isPublished
      if (filterBy === 'unpublished') return !track.isPublished
      if (filterBy === 'nft') return track.isNftMinted
      return true
    })
    .filter(track => 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.uploadDate - a.uploadDate
        case 'plays':
          return b.playCount - a.playCount
        case 'revenue':
          return b.totalRevenue - a.totalRevenue
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const handleTrackSelect = (track: TrackWithStats) => {
    onTrackSelect?.(track)
  }

  const handleTrackEdit = (track: TrackWithStats) => {
    onTrackEdit?.(track)
  }

  const handleTrackDelete = (trackId: string) => {
    if (confirm('Are you sure you want to delete this track?')) {
      onTrackDelete?.(trackId)
      setTracks(prev => prev.filter(t => t.id !== trackId))
    }
  }

  const handleBulkAction = (action: 'publish' | 'unpublish' | 'delete') => {
    if (selectedTracks.length === 0) return

    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedTracks.length} tracks?`)) {
        setTracks(prev => prev.filter(t => !selectedTracks.includes(t.id)))
        setSelectedTracks([])
      }
    } else {
      setTracks(prev => prev.map(track => 
        selectedTracks.includes(track.id) 
          ? { ...track, isPublished: action === 'publish' }
          : track
      ))
      setSelectedTracks([])
    }
  }

  const handleSelectAll = () => {
    if (selectedTracks.length === filteredTracks.length) {
      setSelectedTracks([])
    } else {
      setSelectedTracks(filteredTracks.map(t => t.id))
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(3)} ETH`
  }

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor(diff / 3600000)
    
    if (days > 0) {
      return `${days}d ago`
    } else if (hours > 0) {
      return `${hours}h ago`
    } else {
      return 'Just now'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Content Manager</h2>
          <p className="text-sm text-gray-500">Manage your tracks and content</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracks..."
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>

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

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          {/* Filter */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Tracks</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
            <option value="nft">NFT Minted</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="date">Upload Date</option>
            <option value="plays">Play Count</option>
            <option value="revenue">Revenue</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedTracks.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{selectedTracks.length} selected</span>
            <button
              onClick={() => handleBulkAction('publish')}
              className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkAction('unpublish')}
              className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
            >
              Unpublish
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Tracks Grid/List */}
      {filteredTracks.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks found</h3>
          <p className="text-gray-500">Upload your first track to get started</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredTracks.map(track => (
            <div
              key={track.id}
              className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'flex items-center space-x-4' : ''
              }`}
            >
              {/* Selection Checkbox */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedTracks.includes(track.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTracks(prev => [...prev, track.id])
                    } else {
                      setSelectedTracks(prev => prev.filter(id => id !== track.id))
                    }
                  }}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                
                {/* Track Info */}
                <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{track.title}</h3>
                      <p className="text-sm text-gray-500">{track.genre}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{formatNumber(track.playCount)} plays</span>
                        <span className="text-sm text-gray-500">{formatCurrency(track.totalRevenue)} earned</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center space-x-2 mt-2">
                    {track.isPublished && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    )}
                    {track.isNftMinted && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        NFT
                      </span>
                    )}
                    {!track.isPublished && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {track.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {track.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {track.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{track.tags.length - 3} more</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => handleTrackSelect(track)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Play
                    </button>
                    <button
                      onClick={() => handleTrackEdit(track)}
                      className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleTrackDelete(track.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Select All */}
      {filteredTracks.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handleSelectAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {selectedTracks.length === filteredTracks.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-sm text-gray-500">
            {filteredTracks.length} track{filteredTracks.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}
