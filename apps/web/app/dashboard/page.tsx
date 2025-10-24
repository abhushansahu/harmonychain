'use client'

import React, { useState, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import ArtistDashboard from '@/components/dashboard/ArtistDashboard'
import { Artist, Track, AnalyticsData } from '@/lib/types'
import { apiClient } from '@/lib/api/client'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [artist, setArtist] = useState<Artist | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch artist data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // For now, we'll use mock data since we need the artist's wallet address
        // In a real app, this would come from authentication context
        const artistId = '1' // This would be from auth context
        
        const [artistResponse, tracksResponse] = await Promise.all([
          apiClient.getArtist(artistId),
          apiClient.getTracks()
        ])
        
        if (artistResponse.success && artistResponse.data) {
          // Map API response to expected Artist type
          const artistData = {
            ...artistResponse.data,
            description: artistResponse.data.bio || '',
            totalTracks: artistResponse.data.tracks || 0,
            totalEarnings: 0, // Will be calculated from blockchain
            isVerified: artistResponse.data.verified || false
          }
          setArtist(artistData)
        }
        
        if (tracksResponse.success && tracksResponse.data) {
          // Filter tracks for this artist and map to expected format
          const artistTracks = tracksResponse.data
            .filter(track => track.artistId === artistId)
            .map(track => ({
              ...track,
              isStreamable: true,
              playCount: 0,
              owner: track.artistId
            }))
          setTracks(artistTracks)
        }
        
        // Mock analytics for now
        setAnalytics({
          totalPlays: 1250,
          totalEarnings: 1250.75,
          topTracks: [],
          monthlyStats: []
        })
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Mock data - fallback for development
  const mockArtist: Artist = {
    id: '1',
    name: 'CryptoBeats',
    description: 'Electronic music producer and blockchain enthusiast',
    avatar: '/api/placeholder/100/100',
    walletAddress: '0x1234567890123456789012345678901234567890',
    totalTracks: 15,
    totalEarnings: 1250.75,
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z'
  }

  const mockTracks: Track[] = [
    {
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
    },
    {
      id: '2',
      title: 'Blockchain Symphony',
      artist: 'CryptoBeats',
      artistId: '1',
      duration: 240,
      genre: 'Electronic',
      price: 1.2,
      coverArt: '/api/placeholder/300/300',
      audioFile: '/api/placeholder/audio.mp3',
      ipfsHash: 'QmExample2',
      isStreamable: true,
      playCount: 890,
      owner: '0x123...',
      createdAt: '2024-01-14T15:30:00Z',
      updatedAt: '2024-01-14T15:30:00Z'
    }
  ]

  const mockAnalytics: AnalyticsData = {
    totalPlays: 15420,
    totalEarnings: 1250.75,
    topTracks: [
      {
        track: mockTracks[0],
        plays: 1250,
        earnings: 625.00
      },
      {
        track: mockTracks[1],
        plays: 890,
        earnings: 1068.00
      }
    ],
    monthlyStats: [
      { month: 'Jan 2024', plays: 1200, earnings: 150.00 },
      { month: 'Feb 2024', plays: 1800, earnings: 225.00 },
      { month: 'Mar 2024', plays: 2100, earnings: 262.50 },
      { month: 'Apr 2024', plays: 1950, earnings: 243.75 },
      { month: 'May 2024', plays: 2300, earnings: 287.50 },
      { month: 'Jun 2024', plays: 2800, earnings: 350.00 }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-300 mt-4">Loading dashboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <ArtistDashboard
              artist={artist || mockArtist}
              tracks={tracks.length > 0 ? tracks : mockTracks}
              analytics={analytics || mockAnalytics}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
