'use client'

import React, { useState } from 'react'
import { Track } from '@/lib/types'
import { formatTime, formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Play, Pause, Heart, MoreHorizontal, TrendingUp, Clock } from 'lucide-react'
import Card from '@/components/ui/Card'

interface TrendingTracksProps {
  tracks: Track[]
  onTrackSelect: (track: Track) => void
  onPlayTrack: (track: Track) => void
  className?: string
}

const TrendingTracks: React.FC<TrendingTracksProps> = ({
  tracks,
  onTrackSelect,
  onPlayTrack,
  className
}) => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h')

  const handlePlayClick = (track: Track) => {
    if (playingTrackId === track.id) {
      setPlayingTrackId(null)
    } else {
      setPlayingTrackId(track.id)
      onPlayTrack(track)
    }
  }

  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ]

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Trending Tracks
          </h2>
        </div>

        {/* Time Range Selector */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as any)}
              className={cn(
                'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                timeRange === option.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tracks List */}
      <div className="space-y-3">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group"
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-8 text-center">
              <span className={cn(
                'text-lg font-bold',
                index < 3 ? 'text-orange-500' : 'text-gray-400'
              )}>
                {index + 1}
              </span>
            </div>

            {/* Track Artwork */}
            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
              {track.coverArt ? (
                <img
                  src={track.coverArt}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.808L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.808a1 1 0 011.617.808zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {track.title}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {track.artist}
              </p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(track.duration)}
                </span>
                <span className="text-xs text-gray-500">
                  {track.playCount.toLocaleString()} plays
                </span>
                <span className="text-xs text-gray-500">
                  {track.genre}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex-shrink-0 text-right">
              <div className="text-lg font-semibold text-gray-900">
                {formatPrice(track.price)}
              </div>
              {track.price > 0 && (
                <div className="text-xs text-gray-500">ONE</div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Play Button */}
              <button
                onClick={() => handlePlayClick(track)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title={playingTrackId === track.id ? 'Pause' : 'Play'}
              >
                {playingTrackId === track.id ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              {/* Like Button */}
              <button
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Add to favorites"
              >
                <Heart className="w-5 h-5" />
              </button>

              {/* More Options */}
              <button
                onClick={() => onTrackSelect(track)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
                title="More options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {tracks.length > 0 && (
        <div className="mt-6 text-center">
          <button className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Load More Tracks
          </button>
        </div>
      )}
    </div>
  )
}

export default TrendingTracks
