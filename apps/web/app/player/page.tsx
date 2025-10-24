'use client'

import React from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import MusicPlayer from '@/components/player/MusicPlayer'
import { Track } from '@/lib/types'

export default function PlayerPage() {
  // Mock track data - in a real app, this would come from props or state
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
            track={mockTrack}
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
