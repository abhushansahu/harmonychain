'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import MusicPlayer from '@/components/player/MusicPlayer'
import { Track } from '@/lib/types'
import { apiClient } from '@/lib/api/client'
import { useSearchParams } from 'next/navigation'

function PlayerContent() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const trackId = searchParams.get('trackId')

  useEffect(() => {
    const loadTrack = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (trackId) {
          // Load specific track by ID
          const response = await apiClient.getTrack(trackId)
          if (response.success && response.data) {
            setCurrentTrack(response.data)
          } else {
            setError('Track not found')
          }
        } else {
          // Load tracks and use the first one as demo
          const response = await apiClient.getTracks()
          if (response.success && response.data && response.data.length > 0) {
            setCurrentTrack(response.data[0])
          } else {
            // Fallback to mock data if no tracks available
            const mockTrack: Track = {
              id: '1',
              title: 'Digital Dreams',
              artist: 'CryptoBeats',
              artistId: '1',
              duration: 180,
              genre: 'Electronic',
              price: 0.5,
              coverArt: '/api/placeholder/300/300',
              audioFile: '/api/placeholder/audio.mp3',
              ipfsHash: 'QmExample1',
              isStreamable: true,
              playCount: 1250,
              owner: '0x123...',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            }
            setCurrentTrack(mockTrack)
          }
        }
      } catch (err) {
        console.error('Error loading track:', err)
        setError('Failed to load track')
      } finally {
        setIsLoading(false)
      }
    }

    loadTrack()
  }, [trackId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading player...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Track</h2>
          <p className="text-gray-300 mb-8">{error}</p>
          <button 
            onClick={() => window.location.href = '/discover'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Music
          </button>
        </div>
      </div>
    )
  }

  if (!currentTrack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Track Selected</h2>
          <p className="text-gray-300 mb-8">Please select a track to play from the discover page or your library.</p>
          <button 
            onClick={() => window.location.href = '/discover'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Music
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Music Player</h1>
            <p className="text-xl text-gray-300">
              Experience decentralized music streaming
            </p>
          </div>

          {/* Music Player */}
          <MusicPlayer
            track={currentTrack}
            className="mb-8"
          />

          {/* Player Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">IPFS Streaming</h3>
              <p className="text-gray-600">
                Music is streamed directly from IPFS, ensuring decentralized access and no single point of failure.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Web3 Integration</h3>
              <p className="text-gray-600">
                Connect your wallet to access premium features, purchase tracks, and support artists directly.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Artist Support</h3>
              <p className="text-gray-600">
                Every play, purchase, and interaction directly supports the artists through smart contracts.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function PlayerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayerContent />
    </Suspense>
  )
}
