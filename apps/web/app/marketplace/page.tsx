'use client'

import React from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { Music, DollarSign, TrendingUp, Clock, Users } from 'lucide-react'

export default function MarketplacePage() {
  const nftCollections = [
    {
      id: 1,
      title: "Harmony Dreams Collection",
      artist: "CryptoBeats",
      price: "0.5 ONE",
      image: "/api/placeholder/300/300",
      rarity: "Rare",
      sales: "12"
    },
    {
      id: 2,
      title: "Blockchain Blues #1",
      artist: "DeFi Diva",
      price: "1.2 ONE",
      image: "/api/placeholder/300/300",
      rarity: "Epic",
      sales: "8"
    },
    {
      id: 3,
      title: "Web3 Symphony",
      artist: "Web3 Orchestra",
      price: "0.8 ONE",
      image: "/api/placeholder/300/300",
      rarity: "Legendary",
      sales: "5"
    }
  ]

  const stats = [
    { label: "Total NFTs", value: "15,000+", icon: Music },
    { label: "Artists", value: "2,500+", icon: Users },
    { label: "Volume", value: "50K ONE", icon: DollarSign },
    { label: "Avg Price", value: "1.2 ONE", icon: TrendingUp }
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
                NFT <span className="gradient-text">Marketplace</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Buy, sell, and trade music NFTs. Own unique pieces of digital music history on Harmony Network
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
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

        {/* Featured NFTs */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">🔥 Featured NFTs</h2>
              <p className="text-gray-300">Rare and exclusive music NFTs from top artists</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nftCollections.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="music-card group"
                >
                  <div className="relative mb-4">
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Music className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                      {nft.rarity}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{nft.title}</h3>
                    <p className="text-gray-400 mb-4">by {nft.artist}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-white">{nft.price}</span>
                      <span className="text-sm text-gray-500">{nft.sales} sales</span>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                      Buy Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                How <span className="gradient-text">NFTs Work</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Music NFTs represent ownership of unique digital music pieces on the blockchain
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-6">
                  <Music className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">1. Create</h3>
                <p className="text-gray-300">Artists mint their music as unique NFTs on Harmony Network</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">2. Trade</h3>
                <p className="text-gray-300">Buy and sell music NFTs in our decentralized marketplace</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-6">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">3. Own</h3>
                <p className="text-gray-300">Own unique pieces of music history and support your favorite artists</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
