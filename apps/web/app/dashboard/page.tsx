'use client'

import React, { useState, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import ArtistDashboard from '@/components/dashboard/ArtistDashboard'
import { Artist, Track, AnalyticsData } from '@/lib/types'
import { apiClient } from '@/lib/api/client'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Set client-side flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch artist data from API
  useEffect(() => {
    if (!isClient) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (!isConnected || !address) {
          setError('Please connect your wallet to access the dashboard')
          setLoading(false)
          return
        }
        
        // Check if user is registered as artist, if not, auto-register them
        let artistResponse = await apiClient.customRequest<any>(`/api/artists/wallet/${address}`)
        
        if (!artistResponse.success || !artistResponse.data) {
          // User is not registered as artist, auto-register them
          console.log('User not registered as artist, auto-registering...')
          
          // Generate a default artist name from wallet address
          const defaultName = `Artist ${address.slice(0, 6)}...${address.slice(-4)}`
          const defaultDescription = `Artist profile for ${address}`
          
          const registerResponse = await apiClient.registerArtist({
            name: defaultName,
            description: defaultDescription,
            avatar: ''
          }, address)
          
          if (registerResponse.success && registerResponse.data) {
            // Convert API response to our Artist type
            const artistData: Artist = {
              id: registerResponse.data.id,
              name: registerResponse.data.name,
              description: registerResponse.data.description,
              avatar: registerResponse.data.avatar,
              walletAddress: registerResponse.data.walletAddress,
              totalTracks: registerResponse.data.totalTracks || 0,
              totalEarnings: registerResponse.data.totalEarnings || 0,
              isVerified: registerResponse.data.isVerified || false,
              createdAt: registerResponse.data.createdAt
            }
            setArtist(artistData)
            console.log('Artist auto-registered successfully')
          } else {
            // If auto-registration fails, try to get the artist data again
            artistResponse = await apiClient.customRequest<any>(`/api/artists/wallet/${address}`)
            if (artistResponse.success && artistResponse.data) {
              const artistData: Artist = {
                id: artistResponse.data.id,
                name: artistResponse.data.name,
                description: artistResponse.data.description,
                avatar: artistResponse.data.avatar,
                walletAddress: artistResponse.data.walletAddress,
                totalTracks: artistResponse.data.totalTracks || 0,
                totalEarnings: artistResponse.data.totalEarnings || 0,
                isVerified: artistResponse.data.isVerified || false,
                createdAt: artistResponse.data.createdAt
              }
              setArtist(artistData)
            } else {
              setError('Failed to register as artist. Please try again.')
              setLoading(false)
              return
            }
          }
        } else {
          const artistData: Artist = {
            id: artistResponse.data.id,
            name: artistResponse.data.name,
            description: artistResponse.data.description,
            avatar: artistResponse.data.avatar,
            walletAddress: artistResponse.data.walletAddress,
            totalTracks: artistResponse.data.totalTracks || 0,
            totalEarnings: artistResponse.data.totalEarnings || 0,
            isVerified: artistResponse.data.isVerified || false,
            createdAt: artistResponse.data.createdAt
          }
          setArtist(artistData)
        }
        
        // Fetch artist's tracks
        const tracksResponse = await apiClient.getTracks()
        if (tracksResponse.success && tracksResponse.data) {
          // Filter tracks by artist wallet address
          const artistTracks = tracksResponse.data.filter(track => 
            track.owner === address || track.artistId === (artistResponse.data as Artist).id
          )
          setTracks(artistTracks)
        }
        
        // Calculate real analytics from track data
        const totalPlays = tracks.reduce((sum, track) => sum + (track.playCount || 0), 0)
        const totalEarnings = 0 // Earnings would come from blockchain transactions
        
        setAnalytics({
          totalPlays,
          totalEarnings,
          topTracks: tracks.slice(0, 3).map(track => ({
            track,
            plays: track.playCount || 0,
            earnings: 0 // Earnings would come from blockchain transactions
          })),
          monthlyStats: [] // Could be calculated from historical data
        })
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    if (isConnected && address) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [isClient, isConnected, address, tracks.length])

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

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-300 mt-4">Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isConnected ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-8">Please connect your wallet to access the artist dashboard.</p>
              <button 
                onClick={() => window.location.href = '/upload'}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          ) : loading ? (
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
