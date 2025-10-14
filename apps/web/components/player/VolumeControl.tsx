import React, { useState, useRef, useCallback } from 'react'
import { cn } from '../../lib/utils'
import { BaseComponentProps } from '../../lib/types'

export interface VolumeControlProps extends BaseComponentProps {
  volume: number // 0-100
  onVolumeChange: (volume: number) => void
  disabled?: boolean
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
}

const sizeClasses = {
  sm: {
    container: 'w-20 h-1',
    thumb: 'w-3 h-3',
    icon: 'w-4 h-4'
  },
  md: {
    container: 'w-24 h-2',
    thumb: 'w-4 h-4',
    icon: 'w-5 h-5'
  },
  lg: {
    container: 'w-32 h-3',
    thumb: 'w-5 h-5',
    icon: 'w-6 h-6'
  }
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  disabled = false,
  showLabel = false,
  size = 'md',
  orientation = 'horizontal',
  className,
  testId
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [previousVolume, setPreviousVolume] = useState(volume)
  const volumeBarRef = useRef<HTMLDivElement>(null)

  const { container, thumb, icon } = sizeClasses[size]

  // Handle mute toggle
  const handleMuteToggle = useCallback(() => {
    if (disabled) return
    
    if (isMuted) {
      // Unmute - restore previous volume
      onVolumeChange(previousVolume)
      setIsMuted(false)
    } else {
      // Mute - save current volume and set to 0
      setPreviousVolume(volume)
      onVolumeChange(0)
      setIsMuted(true)
    }
  }, [disabled, isMuted, volume, previousVolume, onVolumeChange])

  // Handle mouse down on volume bar
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    
    event.preventDefault()
    setIsDragging(true)
    setIsMuted(false)
    
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const percentage = (x / rect.width) * 100
    onVolumeChange(Math.max(0, Math.min(100, percentage)))
  }, [disabled, onVolumeChange])

  // Handle mouse move during drag
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !volumeBarRef.current || disabled) return
    
    const rect = volumeBarRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const percentage = (x / rect.width) * 100
    const newVolume = Math.max(0, Math.min(100, percentage))
    
    onVolumeChange(newVolume)
    
    // Update muted state based on volume
    if (newVolume > 0) {
      setIsMuted(false)
    }
  }, [isDragging, disabled, onVolumeChange])

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Handle wheel events for volume adjustment
  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (disabled) return
    
    event.preventDefault()
    const delta = event.deltaY > 0 ? -5 : 5
    const newVolume = Math.max(0, Math.min(100, volume + delta))
    onVolumeChange(newVolume)
    
    if (newVolume > 0) {
      setIsMuted(false)
    }
  }, [disabled, volume, onVolumeChange])

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

  // Get volume icon based on volume level
  const getVolumeIcon = useCallback(() => {
    if (isMuted || volume === 0) {
      return (
        <svg className={icon} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
      )
    } else if (volume < 30) {
      return (
        <svg className={icon} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
      )
    } else if (volume < 70) {
      return (
        <svg className={icon} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
      )
    } else {
      return (
        <svg className={icon} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
      )
    }
  }, [isMuted, volume, icon])

  return (
    <div 
      className={cn(
        'flex items-center space-x-2 group',
        orientation === 'vertical' && 'flex-col space-x-0 space-y-2',
        className
      )}
      data-testid={testId}
    >
      {/* Volume icon */}
      <button
        onClick={handleMuteToggle}
        disabled={disabled}
        className={cn(
          'text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {getVolumeIcon()}
      </button>

      {/* Volume bar */}
      <div
        ref={volumeBarRef}
        className={cn(
          'relative bg-gray-600 rounded-full cursor-pointer transition-colors duration-200',
          container,
          disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-500',
          orientation === 'vertical' && 'w-1 h-24'
        )}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onWheel={handleWheel}
      >
        {/* Volume fill */}
        <div
          className={cn(
            'h-full bg-primary-600 rounded-full transition-all duration-200',
            isDragging && 'transition-none'
          )}
          style={{ 
            width: orientation === 'horizontal' ? `${volume}%` : '100%',
            height: orientation === 'vertical' ? `${volume}%` : '100%'
          }}
        />
        
        {/* Thumb */}
        <div
          className={cn(
            'absolute top-1/2 transform -translate-y-1/2 rounded-full bg-white shadow-lg transition-all duration-200',
            thumb,
            'opacity-0 group-hover:opacity-100',
            (isDragging || isHovering) && 'opacity-100'
          )}
          style={{ 
            left: orientation === 'horizontal' ? `${volume}%` : '50%',
            top: orientation === 'vertical' ? `${100 - volume}%` : '50%',
            transform: orientation === 'horizontal' 
              ? 'translate(-50%, -50%)' 
              : 'translate(-50%, 50%)'
          }}
        />
      </div>

      {/* Volume percentage */}
      {showLabel && (
        <span className="text-xs text-gray-400 min-w-[3ch]">
          {Math.round(volume)}%
        </span>
      )}
    </div>
  )
}

export default VolumeControl