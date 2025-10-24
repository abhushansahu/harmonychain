'use client'

import React from 'react'
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AudioControlsProps {
  isPlaying: boolean
  onPlayPause: () => void
  onPrevious: () => void
  onNext: () => void
  onRepeat: () => void
  onShuffle: () => void
  repeatMode: 'none' | 'one' | 'all'
  shuffleMode: boolean
  className?: string
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onRepeat,
  onShuffle,
  repeatMode,
  shuffleMode,
  className
}) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Shuffle Button */}
      <button
        onClick={onShuffle}
        className={cn(
          'p-2 rounded-full transition-colors',
          shuffleMode 
            ? 'text-blue-600 bg-blue-100' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        )}
        title="Shuffle"
      >
        <Shuffle className="w-5 h-5" />
      </button>

      {/* Previous Button */}
      <button
        onClick={onPrevious}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        title="Previous"
      >
        <SkipBack className="w-5 h-5" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={onPlayPause}
        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        title="Next"
      >
        <SkipForward className="w-5 h-5" />
      </button>

      {/* Repeat Button */}
      <button
        onClick={onRepeat}
        className={cn(
          'p-2 rounded-full transition-colors',
          repeatMode !== 'none'
            ? 'text-blue-600 bg-blue-100' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        )}
        title={`Repeat: ${repeatMode}`}
      >
        <Repeat className="w-5 h-5" />
        {repeatMode === 'one' && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
        )}
      </button>
    </div>
  )
}

export default AudioControls
