'use client'

import React, { useState } from 'react'
import { Track } from '@/lib/types'
import { formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Play, X, Music } from 'lucide-react'

interface QueueManagerProps {
  queue: Track[]
  currentIndex: number
  onRemoveTrack: (index: number) => void
  onPlayTrack: (index: number) => void
  className?: string
}

const QueueManager: React.FC<QueueManagerProps> = ({
  queue,
  currentIndex,
  onRemoveTrack,
  onPlayTrack,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (queue.length === 0) return null

  return (
    <div className={cn('border-t border-gray-200 pt-4', className)}>
      {/* Queue Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">
          Queue ({queue.length} tracks)
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Queue List */}
      {isExpanded && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {queue.map((track, index) => (
            <div
              key={`${track.id}-${index}`}
              className={cn(
                'flex items-center space-x-3 p-2 rounded-lg transition-colors',
                index === currentIndex
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50'
              )}
            >
              {/* Track Number or Play Button */}
              <div className="w-6 h-6 flex items-center justify-center">
                {index === currentIndex ? (
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                ) : (
                  <button
                    onClick={() => onPlayTrack(index)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Track Artwork */}
              <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                {track.coverArt ? (
                  <img
                    src={track.coverArt}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Music className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {track.title}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {track.artist}
                </p>
              </div>

              {/* Duration */}
              <div className="text-xs text-gray-500">
                {formatTime(track.duration)}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => onRemoveTrack(index)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QueueManager
