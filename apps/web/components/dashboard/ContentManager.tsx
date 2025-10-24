'use client'

import React, { useState } from 'react'
import { Track } from '@/lib/types'
import { formatTime, formatPrice, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Play, Pause, Edit, Trash2, MoreHorizontal, Eye, Download, Share } from 'lucide-react'
import Button from '@/components/ui/Button'

interface ContentManagerProps {
  tracks: Track[]
  onEditTrack: (track: Track) => void
  onDeleteTrack: (trackId: string) => void
  onPlayTrack: (track: Track) => void
  className?: string
}

const ContentManager: React.FC<ContentManagerProps> = ({
  tracks,
  onEditTrack,
  onDeleteTrack,
  onPlayTrack,
  className
}) => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'title'>('newest')
  const [filterBy, setFilterBy] = useState<'all' | 'published' | 'draft' | 'archived'>('all')

  const handlePlayClick = (track: Track) => {
    if (playingTrackId === track.id) {
      setPlayingTrackId(null)
    } else {
      setPlayingTrackId(track.id)
      onPlayTrack(track)
    }
  }

  const sortedTracks = [...tracks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'popular':
        return b.playCount - a.playCount
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const filteredTracks = sortedTracks.filter(track => {
    switch (filterBy) {
      case 'published':
        return track.isStreamable
      case 'draft':
        return !track.isStreamable
      case 'archived':
        return false // Would need archived field in Track type
      default:
        return true
    }
  })

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-gray-900">Your Tracks</h3>
          <span className="text-sm text-gray-500">({filteredTracks.length} tracks)</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Grid
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="title">Title A-Z</option>
          </select>

          {/* Filter Dropdown */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tracks</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Tracks List/Grid */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Track
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plays
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTracks.map((track) => (
                  <tr key={track.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handlePlayClick(track)}
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          {playingTrackId === track.id ? (
                            <Pause className="w-4 h-4 text-gray-600" />
                          ) : (
                            <Play className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          {track.coverArt ? (
                            <img
                              src={track.coverArt}
                              alt={track.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Play className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{track.title}</p>
                          <p className="text-sm text-gray-500">{track.genre}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        track.isStreamable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      )}>
                        {track.isStreamable ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(track.playCount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(track.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(track.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEditTrack(track)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTrack(track.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track) => (
            <div key={track.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square bg-gray-200 relative">
                {track.coverArt ? (
                  <img
                    src={track.coverArt}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Play className="w-12 h-12" />
                  </div>
                )}
                <button
                  onClick={() => handlePlayClick(track)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all"
                >
                  {playingTrackId === track.id ? (
                    <Pause className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  ) : (
                    <Play className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  )}
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">{track.title}</h3>
                <p className="text-sm text-gray-500">{track.genre}</p>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="text-sm text-gray-600">
                    {formatNumber(track.playCount)} plays
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(track.price)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditTrack(track)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onDeleteTrack(track.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredTracks.length === 0 && (
        <div className="text-center py-12">
          <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks found</h3>
          <p className="text-gray-500 mb-4">
            {filterBy === 'all' 
              ? "You haven't uploaded any tracks yet."
              : `No ${filterBy} tracks found.`
            }
          </p>
          <Button>
            Upload Your First Track
          </Button>
        </div>
      )}
    </div>
  )
}

export default ContentManager
