import React from 'react'
import { cn } from '../../lib/utils'
import { BaseComponentProps } from '../../lib/types'

export interface AudioControlsProps extends BaseComponentProps {
  isPlaying: boolean
  onPlayPause: () => void
  onSkipNext: () => void
  onSkipPrevious: () => void
  disabled?: boolean
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: {
    button: 'w-8 h-8',
    icon: 'w-4 h-4',
    playButton: 'w-10 h-10'
  },
  md: {
    button: 'w-10 h-10',
    icon: 'w-5 h-5',
    playButton: 'w-12 h-12'
  },
  lg: {
    button: 'w-12 h-12',
    icon: 'w-6 h-6',
    playButton: 'w-16 h-16'
  }
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
  disabled = false,
  showLabels = false,
  size = 'md',
  className,
  testId
}) => {
  const { button, icon, playButton } = sizeClasses[size]

  const buttonClasses = cn(
    'flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:scale-105 active:scale-95',
    button
  )

  const playButtonClasses = cn(
    'flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:scale-105 active:scale-95',
    playButton,
    'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white'
  )

  const skipButtonClasses = cn(
    buttonClasses,
    'text-gray-400 hover:text-white focus:ring-gray-500'
  )

  return (
    <div 
      className={cn('flex items-center space-x-2', className)}
      data-testid={testId}
    >
      {/* Previous button */}
      <button
        onClick={onSkipPrevious}
        disabled={disabled}
        className={skipButtonClasses}
        aria-label="Previous track"
        title="Previous track"
      >
        <svg 
          className={icon} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
        </svg>
        {showLabels && (
          <span className="ml-1 text-xs">Prev</span>
        )}
      </button>

      {/* Play/Pause button */}
      <button
        onClick={onPlayPause}
        disabled={disabled}
        className={playButtonClasses}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg 
            className={icon} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg 
            className={cn(icon, 'ml-0.5')} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
        {showLabels && (
          <span className="ml-1 text-xs">
            {isPlaying ? 'Pause' : 'Play'}
          </span>
        )}
      </button>

      {/* Next button */}
      <button
        onClick={onSkipNext}
        disabled={disabled}
        className={skipButtonClasses}
        aria-label="Next track"
        title="Next track"
      >
        <svg 
          className={icon} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
        </svg>
        {showLabels && (
          <span className="ml-1 text-xs">Next</span>
        )}
      </button>
    </div>
  )
}

export default AudioControls