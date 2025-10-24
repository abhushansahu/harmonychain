'use client'

import React from 'react'
import { Track } from '@/lib/types'
import { useAudioPlayer } from '@/lib/hooks'
import AudioControls from './AudioControls'
import ProgressBar from './ProgressBar'
import VolumeControl from './VolumeControl'
import QueueManager from './QueueManager'
import { cn } from '@/lib/utils'
import { getIPFSUrl } from '@/lib/utils'

interface MusicPlayerProps {
  track?: Track
  className?: string
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ track, className }) => {
  const {
    playerState,
    playTrack,
    togglePlayPause,
    seekTo,
    setVolume,
    toggleMute,
    addToQueue,
    removeFromQueue,
    handleNext,
    handlePrevious,
    setRepeatMode,
    toggleShuffle
  } = useAudioPlayer()

  // Auto-play track when provided
  React.useEffect(() => {
    if (track && track !== playerState.currentTrack) {
      playTrack(track)
    }
  }, [track, playTrack, playerState.currentTrack])

  return (
    <div className={cn('bg-white rounded-lg shadow-lg p-4', className)}>
      {/* Track Info */}
      {playerState.currentTrack && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
            {playerState.currentTrack.coverArt ? (
              <img
                src={playerState.currentTrack.coverArt}
                alt={playerState.currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.808L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.808a1 1 0 011.617.808zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {playerState.currentTrack.title}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {playerState.currentTrack.artist}
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <ProgressBar
        currentTime={playerState.currentTime}
        duration={playerState.duration}
        onSeek={seekTo}
        className="mb-4"
      />

      {/* Controls */}
      <div className="flex items-center justify-between">
        <AudioControls
          isPlaying={playerState.isPlaying}
          onPlayPause={togglePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onRepeat={() => setRepeatMode(
            playerState.repeatMode === 'none' ? 'all' : 
            playerState.repeatMode === 'all' ? 'one' : 'none'
          )}
          onShuffle={toggleShuffle}
          repeatMode={playerState.repeatMode}
          shuffleMode={playerState.shuffleMode}
        />

        <VolumeControl
          volume={playerState.volume}
          isMuted={playerState.isMuted}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
        />
      </div>

      {/* Queue Manager */}
      {playerState.queue.length > 0 && (
        <QueueManager
          queue={playerState.queue}
          currentIndex={playerState.currentIndex}
          onRemoveTrack={removeFromQueue}
          onPlayTrack={(index) => {
            const track = playerState.queue[index]
            if (track) playTrack(track)
          }}
          className="mt-4"
        />
      )}
    </div>
  )
}

export default MusicPlayer
