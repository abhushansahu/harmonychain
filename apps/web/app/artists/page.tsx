'use client'

import React from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { Music, Users, TrendingUp, Play } from 'lucide-react'

export default function ArtistsPage() {
  const featuredArtists = [
    {
      id: 1,
      name: "CryptoBeats",
      genre: "Electronic",
      followers: "125K",
      tracks: "45",
      cover: "/api/placeholder/300/300",
      verified: true
    },
    {
      id: 2,
      name: "DeFi Diva",
      genre: "Hip Hop",
      followers: "89K",
      tracks: "32",
      cover: "/api/placeholder/300/300",
      verified: true
    },
    {
      id: 3,
      name: "Web3 Orchestra",
      genre: "Classical",
      followers: "67K",
      tracks: "28",
      cover: "/api/placeholder/300/300",
      verified: false
    },
    {
      id: 4,
      name: "Blockchain Blues",
      genre: "Blues",
      followers: "43K",
      tracks: "19",
      cover: "/api/placeholder/300/300",
      verified: true
    }
  ]

  const stats = [
    { label: "Total Artists", value: "2,500+", icon: Users },
    { label: "New This Month", value: "150+", icon: TrendingUp },
    { label: "Verified Artists", value: "1,200+", icon: Music }
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
                Discover <span className="gradient-text">Amazing Artists</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Connect with talented musicians who are building the future of music on Harmony Network
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                    <stat.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Artists */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">⭐ Featured Artists</h2>
              <p className="text-gray-300">Top performers on HarmonyChain</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="music-card group"
                >
                  <div className="text-center">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                        <Music className="w-12 h-12 text-white" />
                      </div>
                      {artist.verified && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{artist.name}</h3>
                    <p className="text-gray-400 mb-4">{artist.genre}</p>
                    <div className="flex justify-center space-x-4 text-sm text-gray-500 mb-4">
                      <span>{artist.followers} followers</span>
                      <span>{artist.tracks} tracks</span>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                      View Profile
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 bg-black/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Are You an <span className="gradient-text">Artist?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of artists who are already earning from their music on HarmonyChain
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary inline-flex items-center justify-center">
                  <Music className="w-5 h-5 mr-2" />
                  Upload Your Music
                </button>
                <button className="btn-secondary inline-flex items-center justify-center">
                  Learn More
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
