import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { cn } from '../../lib/utils'
import { Track, BaseComponentProps } from '../../lib/types'
import { useDebounce } from '../../lib/hooks'
import AudioControls from './AudioControls'
import ProgressBar from './ProgressBar'
import VolumeControl from './VolumeControl'
import QueueManager from './QueueManager'
import { StreamingService } from './StreamingService'

export interface MusicPlayerProps extends BaseComponentProps {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number // 0-100
  volume: number // 0-100
  queue: Track[]
  onPlayPause: () => void
  onSkipNext: () => void
  onSkipPrevious: () => void
  onSeek: (progress: number) => void
  onVolumeChange: (volume: number) => void
  onQueueChange: (newQueue: Track[]) => void
  onTrackSelect?: (track: Track) => void
  className?: string
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  progress,
  volume,
  queue,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
  onSeek,
  onVolumeChange,
  onQueueChange,
  onTrackSelect,
  className,
  testId
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Debounced progress to prevent too many updates
  const debouncedProgress = useDebounce(progress, 100)
  
  // Memoized track info to prevent unnecessary re-renders
  const trackInfo = useMemo(() => {
    if (!currentTrack) return null
    
    return {
      title: currentTrack.title,
      artist: currentTrack.artist,
      genre: currentTrack.genre,
      playCount: currentTrack.playCount,
      duration: currentTrack.duration || 0
    }
  }, [currentTrack])

  // Handle track loading
  const handleTrackLoad = useCallback(async (track: Track) => {
    if (!track) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      await StreamingService.loadTrack(track)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load track')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load track when currentTrack changes
  useEffect(() => {
    if (currentTrack) {
      handleTrackLoad(currentTrack)
    }
  }, [currentTrack, handleTrackLoad])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return // Don't interfere with form inputs
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault()
          onPlayPause()
          break
        case 'ArrowRight':
          event.preventDefault()
          onSkipNext()
          break
        case 'ArrowLeft':
          event.preventDefault()
          onSkipPrevious()
          break
        case 'ArrowUp':
          event.preventDefault()
          onVolumeChange(Math.min(volume + 10, 100))
          break
        case 'ArrowDown':
          event.preventDefault()
          onVolumeChange(Math.max(volume - 10, 0))
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onPlayPause, onSkipNext, onSkipPrevious, onVolumeChange, volume])

  // Handle track selection
  const handleTrackClick = useCallback(() => {
    if (currentTrack && onTrackSelect) {
      onTrackSelect(currentTrack)
    }
  }, [currentTrack, onTrackSelect])

  // Format duration
  const formatDuration = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  // Calculate current time from progress
  const currentTime = useMemo(() => {
    if (!trackInfo?.duration) return '0:00'
    const seconds = (debouncedProgress / 100) * trackInfo.duration
    return formatDuration(seconds)
  }, [debouncedProgress, trackInfo?.duration, formatDuration])

  // Calculate total time
  const totalTime = useMemo(() => {
    if (!trackInfo?.duration) return '0:00'
    return formatDuration(trackInfo.duration)
  }, [trackInfo?.duration, formatDuration])

  if (!currentTrack) {
    return (
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50',
          className
        )}
        data-testid={testId}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <p className="text-gray-400">No track playing</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-gray-800 text-white shadow-lg z-50 transition-all duration-300',
        isExpanded ? 'h-32' : 'h-20',
        className
      )}
      data-testid={testId}
    >
      <div className="max-w-7xl mx-auto p-4">
        {/* Main player content */}
        <div className="flex items-center justify-between">
          {/* Track info */}
          <div 
            className="flex items-center space-x-4 w-1/3 cursor-pointer"
            onClick={handleTrackClick}
          >
            <div className="relative">
              <img 
                src="/api/placeholder/50/50" 
                alt="Album Art" 
                className="w-12 h-12 rounded-md object-cover"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold truncate">
                {trackInfo?.title || 'Unknown Track'}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {trackInfo?.artist || 'Unknown Artist'}
              </p>
              {trackInfo?.genre && (
                <p className="text-xs text-gray-500 truncate">
                  {trackInfo.genre}
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center w-1/3">
            <AudioControls
              isPlaying={isPlaying}
              onPlayPause={onPlayPause}
              onSkipNext={onSkipNext}
              onSkipPrevious={onSkipPrevious}
              disabled={isLoading}
            />
            <ProgressBar 
              progress={debouncedProgress} 
              onSeek={onSeek}
              currentTime={currentTime}
              totalTime={totalTime}
              disabled={isLoading}
            />
          </div>

          {/* Right side controls */}
          <div className="flex items-center justify-end space-x-4 w-1/3">
            <VolumeControl 
              volume={volume} 
              onVolumeChange={onVolumeChange}
              disabled={isLoading}
            />
            <QueueManager 
              queue={queue} 
              onQueueChange={onQueueChange}
              currentTrack={currentTrack}
            />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label={isExpanded ? 'Collapse player' : 'Expand player'}
            >
              <svg 
                className={cn('w-5 h-5 transition-transform', isExpanded && 'rotate-180')} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-2 p-2 bg-red-900 bg-opacity-50 rounded text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Expanded view */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Track details */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Track Details</h4>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-400">Genre:</span> {trackInfo?.genre || 'Unknown'}</p>
                  <p><span className="text-gray-400">Plays:</span> {trackInfo?.playCount?.toLocaleString() || '0'}</p>
                  <p><span className="text-gray-400">Duration:</span> {totalTime}</p>
                </div>
              </div>

              {/* Queue preview */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Up Next</h4>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {queue.slice(0, 3).map((track, index) => (
                    <div key={track.id} className="text-sm text-gray-400 truncate">
                      {index + 1}. {track.title} - {track.artist}
                    </div>
                  ))}
                  {queue.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{queue.length - 3} more tracks
                    </div>
                  )}
                </div>
              </div>

              {/* Additional controls */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Controls</h4>
                <div className="flex space-x-2">
                  <button className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
                    Repeat
                  </button>
                  <button className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
                    Shuffle
                  </button>
                  <button className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
                    Like
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MusicPlayer