'use client'

import React, { useState, useRef } from 'react'
import { formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragTime, setDragTime] = useState(currentTime)
  const progressRef = useRef<HTMLDivElement>(null)

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const displayTime = isDragging ? dragTime : currentTime

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!progressRef.current) return
    
    setIsDragging(true)
    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration
    setDragTime(newTime)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !progressRef.current) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = percentage * duration
    setDragTime(newTime)
  }

  const handleMouseUp = () => {
    if (isDragging) {
      onSeek(dragTime)
      setIsDragging(false)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!progressRef.current) return
    
    setIsDragging(true)
    const rect = progressRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const clickX = touch.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration
    setDragTime(newTime)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !progressRef.current) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const clickX = touch.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = percentage * duration
    setDragTime(newTime)
  }

  const handleTouchEnd = () => {
    if (isDragging) {
      onSeek(dragTime)
      setIsDragging(false)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Time Display */}
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{formatTime(displayTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Progress Bar */}
      <div
        ref={progressRef}
        className="relative w-full h-2 bg-gray-200 rounded-full cursor-pointer group"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress Fill */}
        <div
          className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
        
        {/* Progress Handle */}
        <div
          className="absolute top-1/2 w-4 h-4 bg-blue-600 rounded-full transform -translate-y-1/2 transition-all duration-150 opacity-0 group-hover:opacity-100"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
