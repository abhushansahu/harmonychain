import React, { useState, useCallback, useMemo } from 'react'
import { cn } from '../../lib/utils'
import { Track, BaseComponentProps } from '../../lib/types'

export interface QueueManagerProps extends BaseComponentProps {
  queue: Track[]
  currentTrack: Track | null
  onQueueChange: (newQueue: Track[]) => void
  onTrackSelect?: (track: Track) => void
  onTrackRemove?: (trackId: string) => void
  onTrackMove?: (fromIndex: number, toIndex: number) => void
  maxVisibleItems?: number
  showControls?: boolean
  showTrackInfo?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: {
    container: 'w-64 h-48',
    item: 'p-2',
    text: 'text-xs',
    icon: 'w-3 h-3'
  },
  md: {
    container: 'w-80 h-64',
    item: 'p-3',
    text: 'text-sm',
    icon: 'w-4 h-4'
  },
  lg: {
    container: 'w-96 h-80',
    item: 'p-4',
    text: 'text-base',
    icon: 'w-5 h-5'
  }
}

export const QueueManager: React.FC<QueueManagerProps> = ({
  queue,
  currentTrack,
  onQueueChange,
  onTrackSelect,
  onTrackRemove,
  onTrackMove,
  maxVisibleItems = 5,
  showControls = true,
  showTrackInfo = true,
  size = 'md',
  className,
  testId
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const { container, item, text, icon } = sizeClasses[size]

  // Get visible queue items
  const visibleQueue = useMemo(() => {
    return queue.slice(0, maxVisibleItems)
  }, [queue, maxVisibleItems])

  // Check if there are more items
  const hasMoreItems = queue.length > maxVisibleItems

  // Handle track selection
  const handleTrackClick = useCallback((track: Track) => {
    onTrackSelect?.(track)
  }, [onTrackSelect])

  // Handle track removal
  const handleTrackRemove = useCallback((trackId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    onTrackRemove?.(trackId)
  }, [onTrackRemove])

  // Handle drag start
  const handleDragStart = useCallback((event: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', '')
  }, [])

  // Handle drag over
  const handleDragOver = useCallback((event: React.DragEvent, index: number) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }, [])

  // Handle drag leave
  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  // Handle drop
  const handleDrop = useCallback((event: React.DragEvent, dropIndex: number) => {
    event.preventDefault()
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onTrackMove?.(draggedIndex, dropIndex)
    }
    
    setDraggedIndex(null)
    setDragOverIndex(null)
  }, [draggedIndex, onTrackMove])

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }, [])

  // Clear queue
  const handleClearQueue = useCallback(() => {
    onQueueChange([])
  }, [onQueueChange])

  // Shuffle queue
  const handleShuffleQueue = useCallback(() => {
    const shuffled = [...queue].sort(() => Math.random() - 0.5)
    onQueueChange(shuffled)
  }, [queue, onQueueChange])

  // Remove duplicates
  const handleRemoveDuplicates = useCallback(() => {
    const unique = queue.filter((track, index, self) => 
      index === self.findIndex(t => t.id === track.id)
    )
    onQueueChange(unique)
  }, [queue, onQueueChange])

  // Format duration
  const formatDuration = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  return (
    <div className={cn('relative', className)} data-testid={testId}>
      {/* Queue button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
        aria-label={`Queue (${queue.length} tracks)`}
        title={`Queue (${queue.length} tracks)`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        {queue.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {queue.length}
          </span>
        )}
      </button>

      {/* Queue dropdown */}
      {isOpen && (
        <div className={cn(
          'absolute bottom-full right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50',
          container
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            <h3 className="font-semibold text-white">Queue</h3>
            <div className="flex items-center space-x-2">
              {showControls && (
                <>
                  <button
                    onClick={handleShuffleQueue}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Shuffle queue"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M12 3a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm4 2a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={handleRemoveDuplicates}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Remove duplicates"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={handleClearQueue}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Clear queue"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </button>
                </>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Close queue"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Queue items */}
          <div className="max-h-64 overflow-y-auto">
            {visibleQueue.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <p>Queue is empty</p>
              </div>
            ) : (
              visibleQueue.map((track, index) => (
                <div
                  key={track.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'flex items-center space-x-3 cursor-pointer transition-colors duration-200',
                    item,
                    'hover:bg-gray-700',
                    currentTrack?.id === track.id && 'bg-primary-900 bg-opacity-50',
                    draggedIndex === index && 'opacity-50',
                    dragOverIndex === index && 'bg-gray-700'
                  )}
                  onClick={() => handleTrackClick(track)}
                >
                  {/* Track number */}
                  <div className="flex-shrink-0 w-6 text-center text-gray-400">
                    {index + 1}
                  </div>

                  {/* Track info */}
                  <div className="flex-1 min-w-0">
                    <h4 className={cn('font-medium text-white truncate', text)}>
                      {track.title}
                    </h4>
                    {showTrackInfo && (
                      <p className={cn('text-gray-400 truncate', text)}>
                        {track.artist}
                      </p>
                    )}
                  </div>

                  {/* Track duration */}
                  {track.duration && (
                    <div className="flex-shrink-0 text-gray-400">
                      {formatDuration(track.duration)}
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={(e) => handleTrackRemove(track.id, e)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-400 transition-colors"
                    title="Remove from queue"
                  >
                    <svg className={icon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {hasMoreItems && (
            <div className="p-3 border-t border-gray-700 text-center">
              <p className="text-sm text-gray-400">
                +{queue.length - maxVisibleItems} more tracks
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default QueueManager