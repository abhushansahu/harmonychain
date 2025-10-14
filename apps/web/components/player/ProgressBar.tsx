import React, { useState, useRef, useCallback } from 'react'
import { cn } from '../../lib/utils'
import { BaseComponentProps } from '../../lib/types'

export interface ProgressBarProps extends BaseComponentProps {
  progress: number // 0-100
  onSeek: (progress: number) => void
  currentTime?: string
  totalTime?: string
  disabled?: boolean
  showTime?: boolean
  showTooltip?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'accent'
}

const sizeClasses = {
  sm: {
    track: 'h-1',
    thumb: 'w-3 h-3',
    time: 'text-xs'
  },
  md: {
    track: 'h-2',
    thumb: 'w-4 h-4',
    time: 'text-sm'
  },
  lg: {
    track: 'h-3',
    thumb: 'w-5 h-5',
    time: 'text-base'
  }
}

const colorClasses = {
  primary: 'bg-primary-600',
  secondary: 'bg-gray-600',
  accent: 'bg-accent-600'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  onSeek,
  currentTime,
  totalTime,
  disabled = false,
  showTime = true,
  showTooltip = true,
  size = 'md',
  color = 'primary',
  className,
  testId
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [hoverProgress, setHoverProgress] = useState<number | null>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  
  const { track, thumb, time } = sizeClasses[size]
  const colorClass = colorClasses[color]

  // Calculate progress percentage
  const progressPercentage = Math.max(0, Math.min(100, progress))
  const displayProgress = hoverProgress !== null ? hoverProgress : progressPercentage

  // Handle mouse down on progress bar
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    
    event.preventDefault()
    setIsDragging(true)
    
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const percentage = (x / rect.width) * 100
    onSeek(Math.max(0, Math.min(100, percentage)))
  }, [disabled, onSeek])

  // Handle mouse move during drag
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !progressBarRef.current || disabled) return
    
    const rect = progressBarRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const percentage = (x / rect.width) * 100
    onSeek(Math.max(0, Math.min(100, percentage)))
  }, [isDragging, disabled, onSeek])

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Handle mouse enter
  const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setHoverProgress(Math.max(0, Math.min(100, percentage)))
  }, [disabled])

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setHoverProgress(null)
  }, [])

  // Handle mouse move for hover
  const handleMouseMoveHover = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isDragging) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setHoverProgress(Math.max(0, Math.min(100, percentage)))
  }, [disabled, isDragging])

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Format time for tooltip
  const formatTimeForTooltip = useCallback((percentage: number) => {
    if (!currentTime || !totalTime) return ''
    
    // This is a simplified calculation - in a real app, you'd want to parse the actual time values
    const currentSeconds = parseTimeToSeconds(currentTime)
    const totalSeconds = parseTimeToSeconds(totalTime)
    const tooltipSeconds = (percentage / 100) * totalSeconds
    
    return formatSecondsToTime(tooltipSeconds)
  }, [currentTime, totalTime])

  // Helper function to parse time string to seconds
  const parseTimeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number)
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1]
    }
    return 0
  }

  // Helper function to format seconds to time string
  const formatSecondsToTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('w-full', className)} data-testid={testId}>
      {/* Time display */}
      {showTime && (currentTime || totalTime) && (
        <div className={cn('flex justify-between text-gray-400 mb-1', time)}>
          <span>{currentTime || '0:00'}</span>
          <span>{totalTime || '0:00'}</span>
        </div>
      )}

      {/* Progress bar container */}
      <div className="relative">
        {/* Background track */}
        <div
          ref={progressBarRef}
          className={cn(
            'w-full bg-gray-600 rounded-full cursor-pointer transition-colors duration-200',
            track,
            disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-500'
          )}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMoveHover}
        >
          {/* Progress fill */}
          <div
            className={cn(
              'h-full rounded-full transition-all duration-200',
              colorClass,
              isDragging && 'transition-none'
            )}
            style={{ width: `${displayProgress}%` }}
          />
          
          {/* Thumb */}
          <div
            className={cn(
              'absolute top-1/2 transform -translate-y-1/2 rounded-full bg-white shadow-lg transition-all duration-200',
              thumb,
              'opacity-0 group-hover:opacity-100',
              (isDragging || hoverProgress !== null) && 'opacity-100'
            )}
            style={{ left: `${displayProgress}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>

        {/* Tooltip */}
        {showTooltip && hoverProgress !== null && !disabled && (
          <div
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded pointer-events-none"
            style={{ left: `${hoverProgress}%` }}
          >
            {formatTimeForTooltip(hoverProgress)}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProgressBar