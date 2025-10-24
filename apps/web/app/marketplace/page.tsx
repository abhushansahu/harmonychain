'use client'

import React, { useState, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import NFTMarketplace from '@/components/nft/NFTMarketplace'
import OwnershipDisplay from '@/components/nft/OwnershipDisplay'
import PriceFeed from '@/components/ui/PriceFeed'
import { NFT } from '@/lib/types'
import { apiClient } from '@/lib/api/client'
import toast from 'react-hot-toast'

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'my-nfts'>('marketplace')
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch NFTs from API
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiClient.getNFTs()
        
        if (response.success && response.data) {
          // Map API response to expected NFT format
          const mappedNFTs = response.data.map(nft => ({
            ...nft,
            trackId: '', // Will be populated from metadata
            artistId: '', // Will be populated from metadata
            contractAddress: '', // Will be populated from blockchain
            metadata: {
              name: `NFT #${nft.tokenId}`,
              description: 'Music NFT',
              image: '',
              attributes: []
            }
          }))
          setNfts(mappedNFTs)
        } else {
          console.warn('Failed to fetch NFTs:', response.error)
          setNfts([])
        }
      } catch (err) {
        console.error('Error fetching NFTs:', err)
        setError('Failed to load NFTs')
        toast.error('Failed to load NFTs')
      } finally {
        setLoading(false)
      }
    }

    fetchNFTs()
  }, [])

  // Mock NFT data - fallback for development
  const mockNFTs: NFT[] = [
    {
      id: '1',
      trackId: '1',
      artistId: '1',
      owner: '0x1234567890123456789012345678901234567890',
      price: 0.5,
      tokenId: '1',
      contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      metadata: {
        name: 'Digital Dreams #1',
        description: 'Exclusive NFT version of Digital Dreams by CryptoBeats',
        image: '/api/placeholder/300/300',
        attributes: [
          { trait_type: 'Artist', value: 'CryptoBeats' },
          { trait_type: 'Genre', value: 'Electronic' },
          { trait_type: 'Rarity', value: 'Rare' },
          { trait_type: 'Year', value: '2024' }
        ]
      },
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      trackId: '2',
      artistId: '2',
      owner: '0x2345678901234567890123456789012345678901',
      price: 1.2,
      tokenId: '2',
      contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      metadata: {
        name: 'Blockchain Blues #1',
        description: 'First NFT in the Blockchain Blues collection',
        image: '/api/placeholder/300/300',
        attributes: [
          { trait_type: 'Artist', value: 'DeFi Diva' },
          { trait_type: 'Genre', value: 'Blues' },
          { trait_type: 'Rarity', value: 'Epic' },
          { trait_type: 'Year', value: '2024' }
        ]
      },
      createdAt: '2024-01-14T15:30:00Z'
    },
    {
      id: '3',
      trackId: '3',
      artistId: '3',
      owner: '0x3456789012345678901234567890123456789012',
      price: 0.8,
      tokenId: '3',
      contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      metadata: {
        name: 'Web3 Symphony',
        description: 'Classical composition for the Web3 era',
        image: '/api/placeholder/300/300',
        attributes: [
          { trait_type: 'Artist', value: 'Web3 Orchestra' },
          { trait_type: 'Genre', value: 'Classical' },
          { trait_type: 'Rarity', value: 'Legendary' },
          { trait_type: 'Year', value: '2024' }
        ]
      },
      createdAt: '2024-01-13T09:15:00Z'
    }
  ]

  const handlePurchase = (nft: NFT) => {
    console.log('Purchasing NFT:', nft)
    // In a real app, this would trigger a blockchain transaction
  }

  const handleLike = (nftId: string) => {
    console.log('Liking NFT:', nftId)
    // In a real app, this would update the like status
  }

  const handleShare = (nft: NFT) => {
    console.log('Sharing NFT:', nft)
    // In a real app, this would open share dialog
  }

  const handleTransfer = (nft: NFT) => {
    console.log('Transferring NFT:', nft)
    // In a real app, this would open transfer dialog
  }

  const handleSell = (nft: NFT) => {
    console.log('Selling NFT:', nft)
    // In a real app, this would open sell dialog
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">NFT Marketplace</h1>
            <p className="text-xl text-gray-300 mb-4">
              Discover and collect unique music NFTs
            </p>
            <div className="flex justify-center items-center space-x-6">
              <PriceFeed symbol="ONE" />
              <PriceFeed symbol="ETH" />
              <PriceFeed symbol="USDC" />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'marketplace'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Browse Marketplace
              </button>
              <button
                onClick={() => setActiveTab('my-nfts')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'my-nfts'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My NFTs
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'marketplace' && (
            <NFTMarketplace
              nfts={nfts.length > 0 ? nfts : mockNFTs}
              onPurchase={handlePurchase}
              onLike={handleLike}
              onShare={handleShare}
            />
          )}

          {activeTab === 'my-nfts' && (
            <OwnershipDisplay
              nfts={nfts.length > 0 ? nfts.filter(nft => nft.owner === '0x1234567890123456789012345678901234567890') : mockNFTs.filter(nft => nft.owner === '0x1234567890123456789012345678901234567890')}
              onTransfer={handleTransfer}
              onSell={handleSell}
              onShare={handleShare}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}