'use client'

import React, { useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VolumeControlProps {
  volume: number
  isMuted: boolean
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  className?: string
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  className
}) => {
  const [isHovering, setIsHovering] = useState(false)

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    onVolumeChange(newVolume)
  }

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX
    if (volume < 0.5) return Volume2
    return Volume2
  }

  const VolumeIcon = getVolumeIcon()

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Mute Button */}
      <button
        onClick={onToggleMute}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        <VolumeIcon className="w-5 h-5" />
      </button>

      {/* Volume Slider */}
      <div
        className="flex items-center space-x-2"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className={cn(
            'w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer transition-opacity',
            isHovering ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(isMuted ? 0 : volume) * 100}%, #e5e7eb ${(isMuted ? 0 : volume) * 100}%, #e5e7eb 100%)`
          }}
        />
        
        {/* Volume Percentage */}
        {isHovering && (
          <span className="text-xs text-gray-600 w-8">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        )}
      </div>
    </div>
  )
}

export default VolumeControl
