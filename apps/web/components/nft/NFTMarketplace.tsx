'use client'

import React, { useState, useEffect } from 'react'

interface NFTMarketplaceProps {
  onNFTPurchase?: (nft: NFT) => void
  onNFTSell?: (nft: NFT) => void
  onNFTBid?: (nft: NFT, bidAmount: number) => void
}

interface NFT {
  id: string
  trackId: string
  title: string
  description: string
  imageUrl: string
  animationUrl?: string
  price: number
  currency: 'ETH' | 'USDC' | 'USDT'
  supply: number
  available: number
  royaltyPercentage: number
  attributes: NFTAttribute[]
  owner: string
  creator: string
  contractAddress: string
  tokenId: string
  createdAt: number
  lastSalePrice?: number
  lastSaleDate?: number
  isListed: boolean
  isAuction: boolean
  auctionEndTime?: number
  currentBid?: number
  bidCount?: number
}

interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: 'string' | 'number' | 'date' | 'boost_number' | 'boost_percentage'
}

interface MarketplaceStats {
  totalVolume: number
  totalSales: number
  averagePrice: number
  floorPrice: number
  totalListings: number
}

interface FilterOptions {
  priceRange: [number, number]
  currency: 'all' | 'ETH' | 'USDC' | 'USDT'
  sortBy: 'price' | 'date' | 'popularity' | 'rarity'
  order: 'asc' | 'desc'
  category: 'all' | 'music' | 'art' | 'collectible'
  status: 'all' | 'listed' | 'auction' | 'sold'
}

export default function NFTMarketplace({
  onNFTPurchase,
  onNFTSell,
  onNFTBid
}: NFTMarketplaceProps) {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [stats, setStats] = useState<MarketplaceStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10],
    currency: 'all',
    sortBy: 'date',
    order: 'desc',
    category: 'all',
    status: 'all'
  })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadMarketplaceData()
  }, [])

  const loadMarketplaceData = async () => {
    setIsLoading(true)
    try {
      // Mock implementation - in real app, this would call your API
      const mockNFTs: NFT[] = [
        {
          id: '1',
          trackId: 'track1',
          title: 'Hit Song NFT',
          description: 'Exclusive NFT for the hit song',
          imageUrl: 'https://via.placeholder.com/400x400?text=Hit+Song',
          price: 0.1,
          currency: 'ETH',
          supply: 100,
          available: 45,
          royaltyPercentage: 10,
          attributes: [
            { trait_type: 'Genre', value: 'Electronic' },
            { trait_type: 'Rarity', value: 'Rare' },
            { trait_type: 'Year', value: 2024 }
          ],
          owner: '0x123...',
          creator: '0x456...',
          contractAddress: '0x789...',
          tokenId: '1',
          createdAt: Date.now() - 86400000,
          lastSalePrice: 0.08,
          lastSaleDate: Date.now() - 172800000,
          isListed: true,
          isAuction: false
        },
        {
          id: '2',
          trackId: 'track2',
          title: 'Rare Track NFT',
          description: 'Ultra rare NFT with special artwork',
          imageUrl: 'https://via.placeholder.com/400x400?text=Rare+Track',
          price: 0.5,
          currency: 'ETH',
          supply: 10,
          available: 3,
          royaltyPercentage: 15,
          attributes: [
            { trait_type: 'Genre', value: 'Rock' },
            { trait_type: 'Rarity', value: 'Legendary' },
            { trait_type: 'Year', value: 2024 }
          ],
          owner: '0x789...',
          creator: '0x456...',
          contractAddress: '0x789...',
          tokenId: '2',
          createdAt: Date.now() - 172800000,
          isListed: true,
          isAuction: true,
          auctionEndTime: Date.now() + 86400000,
          currentBid: 0.3,
          bidCount: 5
        }
      ]

      const mockStats: MarketplaceStats = {
        totalVolume: 125.5,
        totalSales: 1250,
        averagePrice: 0.1,
        floorPrice: 0.01,
        totalListings: 500
      }

      setNfts(mockNFTs)
      setStats(mockStats)
    } catch (error) {
      console.error('Failed to load marketplace data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNFTs = nfts
    .filter(nft => {
      if (filters.currency !== 'all' && nft.currency !== filters.currency) return false
      if (filters.status === 'listed' && !nft.isListed) return false
      if (filters.status === 'auction' && !nft.isAuction) return false
      if (filters.status === 'sold' && nft.isListed) return false
      if (nft.price < filters.priceRange[0] || nft.price > filters.priceRange[1]) return false
      if (searchQuery && !nft.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return filters.order === 'asc' ? a.price - b.price : b.price - a.price
        case 'date':
          return filters.order === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
        case 'popularity':
          return filters.order === 'asc' ? a.available - b.available : b.available - a.available
        case 'rarity':
          return filters.order === 'asc' ? a.supply - b.supply : b.supply - a.supply
        default:
          return 0
      }
    })

  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(3)} ETH`
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor(diff / 3600000)
    
    if (days > 0) {
      return `${days}d ago`
    } else if (hours > 0) {
      return `${hours}h ago`
    } else {
      return 'Just now'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'bg-gray-100 text-gray-800'
      case 'rare':
        return 'bg-blue-100 text-blue-800'
      case 'epic':
        return 'bg-purple-100 text-purple-800'
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handlePurchase = (nft: NFT) => {
    onNFTPurchase?.(nft)
  }

  const handleBid = (nft: NFT) => {
    const bidAmount = prompt('Enter your bid amount (ETH):')
    if (bidAmount && !isNaN(parseFloat(bidAmount))) {
      onNFTBid?.(nft, parseFloat(bidAmount))
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">NFT Marketplace</h2>
          <p className="text-gray-600">Discover and trade music NFTs</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(stats.totalVolume)}</div>
            <div className="text-sm text-blue-600">Total Volume</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">{formatNumber(stats.totalSales)}</div>
            <div className="text-sm text-green-600">Total Sales</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-900">{formatCurrency(stats.averagePrice)}</div>
            <div className="text-sm text-purple-600">Average Price</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-900">{formatCurrency(stats.floorPrice)}</div>
            <div className="text-sm text-yellow-600">Floor Price</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalListings)}</div>
            <div className="text-sm text-gray-600">Active Listings</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NFTs..."
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>

          {/* Currency */}
          <select
            value={filters.currency}
            onChange={(e) => setFilters(prev => ({ ...prev, currency: e.target.value as any }))}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Currencies</option>
            <option value="ETH">ETH</option>
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
          </select>

          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="date">Date</option>
            <option value="price">Price</option>
            <option value="popularity">Popularity</option>
            <option value="rarity">Rarity</option>
          </select>

          {/* Order */}
          <select
            value={filters.order}
            onChange={(e) => setFilters(prev => ({ ...prev, order: e.target.value as any }))}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* NFTs Grid/List */}
      {filteredNFTs.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No NFTs found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }>
          {filteredNFTs.map(nft => (
            <div
              key={nft.id}
              className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                viewMode === 'list' ? 'flex items-center space-x-4' : ''
              }`}
            >
              {/* NFT Image */}
              <div className={`${viewMode === 'list' ? 'w-24 h-24' : 'aspect-square'} bg-gray-100 flex items-center justify-center`}>
                <img
                  src={nft.imageUrl}
                  alt={nft.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* NFT Info */}
              <div className={`${viewMode === 'list' ? 'flex-1' : ''} p-4`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{nft.title}</h3>
                  {nft.isAuction && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Auction
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{nft.description}</p>

                {/* Attributes */}
                {nft.attributes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {nft.attributes.slice(0, 2).map((attr, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-1 rounded ${
                          attr.trait_type === 'Rarity' 
                            ? getRarityColor(attr.value as string)
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {attr.trait_type}: {attr.value}
                      </span>
                    ))}
                    {nft.attributes.length > 2 && (
                      <span className="text-xs text-gray-500">+{nft.attributes.length - 2} more</span>
                    )}
                  </div>
                )}

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(nft.price)}</p>
                    <p className="text-xs text-gray-500">{nft.available}/{nft.supply} available</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {nft.isAuction ? (
                      <button
                        onClick={() => handleBid(nft)}
                        className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                      >
                        Bid
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(nft)}
                        className="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
                      >
                        Buy
                      </button>
                    )}
                  </div>
                </div>

                {/* Auction Info */}
                {nft.isAuction && nft.auctionEndTime && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Ends: {formatTimeAgo(nft.auctionEndTime)}</span>
                      <span>Bids: {nft.bidCount || 0}</span>
                    </div>
                    {nft.currentBid && (
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        Current bid: {formatCurrency(nft.currentBid)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
