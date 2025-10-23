'use client'

import React, { useState, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { Play, Music, TrendingUp, Clock } from 'lucide-react'
import { apiClient, Track } from '@/lib/api/client'

export default function DiscoverPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getTracks()
        if (response.success && response.data) {
          setTracks(response.data)
        } else {
          setError(response.error || 'Failed to load tracks')
        }
      } catch (err) {
        setError('Failed to connect to API')
        console.error('Error fetching tracks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTracks()
  }, [])

  // Fallback data if API fails
  const fallbackTracks = [
    {
      id: "1",
      title: "Harmony Dreams",
      artist: "CryptoBeats",
      artistId: "1",
      duration: 225,
      genre: "Electronic",
      price: 0.1,
      coverArt: "/api/placeholder/300/300",
      audioFile: "",
      ipfsHash: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2", 
      title: "Blockchain Blues",
      artist: "DeFi Diva",
      artistId: "2",
      duration: 252,
      genre: "Hip Hop",
      price: 0.15,
      coverArt: "/api/placeholder/300/300",
      audioFile: "",
      ipfsHash: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "3",
      title: "NFT Symphony", 
      artist: "Web3 Orchestra",
      artistId: "3",
      duration: 330,
      genre: "Classical",
      price: 0.2,
      coverArt: "/api/placeholder/300/300",
      audioFile: "",
      ipfsHash: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  const displayTracks = tracks.length > 0 ? tracks : fallbackTracks

  const genres = [
    { name: "Electronic", count: "2.5K tracks" },
    { name: "Hip Hop", count: "1.8K tracks" },
    { name: "Rock", count: "3.2K tracks" },
    { name: "Jazz", count: "950 tracks" },
    { name: "Classical", count: "1.1K tracks" },
    { name: "Pop", count: "4.1K tracks" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Discover <span className="gradient-text">Amazing Music</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Explore thousands of tracks from independent artists on the Harmony Network
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto mb-16"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for tracks, artists, or genres..."
                  className="w-full px-6 py-4 bg-black/30 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <button className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Search
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trending Tracks */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">🔥 Trending Now</h2>
              <p className="text-gray-300">The most popular tracks on HarmonyChain</p>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading tracks from blockchain...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">⚠️ {error}</p>
                <p className="text-gray-300">Using fallback data</p>
              </div>
            ) : null}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="music-card group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Music className="w-8 h-8 text-white" />
                      </div>
                      <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{track.title}</h3>
                      <p className="text-gray-400">{track.artist}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                        </span>
                        <span className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {track.genre}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Genres */}
        <section className="py-16 px-4 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">🎵 Browse by Genre</h2>
              <p className="text-gray-300">Find music that matches your mood</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {genres.map((genre, index) => (
                <motion.div
                  key={genre.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{genre.name}</h3>
                  <p className="text-sm text-gray-400">{genre.count}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
