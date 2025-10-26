'use client'

import React, { useState } from 'react'
import { NFT } from '@/lib/types'
import { formatCurrency, formatAddress } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Heart, Share, MoreHorizontal, Filter, Search, SortAsc } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface NFTMarketplaceProps {
  nfts: NFT[]
  onPurchase: (nft: NFT) => void
  onLike: (nftId: string) => void
  onShare: (nft: NFT) => void
  className?: string
}

const NFTMarketplace: React.FC<NFTMarketplaceProps> = ({
  nfts,
  onPurchase,
  onLike,
  onShare,
  className
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_low' | 'price_high' | 'popular'>('newest')
  const [filterBy, setFilterBy] = useState<'all' | 'music' | 'art' | 'collectible'>('all')
  const [artistFilter, setArtistFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [likedNFTs, setLikedNFTs] = useState<Set<string>>(new Set())

  const handleLike = (nftId: string) => {
    setLikedNFTs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nftId)) {
        newSet.delete(nftId)
      } else {
        newSet.add(nftId)
      }
      return newSet
    })
    onLike(nftId)
  }

  const filteredNFTs = nfts
    .filter(nft => {
      if (filterBy !== 'all' && nft.metadata.attributes.some(attr => attr.trait_type === 'category' && attr.value === filterBy)) {
        return false
      }
      if (searchQuery && !nft.metadata.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (artistFilter && nft.artistId !== artistFilter) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'price_low':
          return a.price - b.price
        case 'price_high':
          return b.price - a.price
        case 'popular':
          return Math.random() - 0.5 // Mock popularity
        default:
          return 0
      }
    })

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">NFT Marketplace</h1>
        <p className="text-gray-600">Discover and collect unique music NFTs</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            {/* Category Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="music">Music</option>
              <option value="art">Art</option>
              <option value="collectible">Collectible</option>
            </select>

            {/* Artist Filter */}
            <select
              value={artistFilter}
              onChange={(e) => setArtistFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Artists</option>
              {Array.from(new Set(nfts.map(nft => nft.artistId))).map(artistId => {
                const nft = nfts.find(n => n.artistId === artistId)
                return (
                  <option key={artistId} value={artistId}>
                    {`Artist ${artistId}`}
                  </option>
                )
              })}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          {filteredNFTs.length} NFT{filteredNFTs.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* NFT Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNFTs.map((nft) => (
            <Card
              key={nft.id}
              title={nft.metadata.name}
              subtitle={`by ${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}`}
              image={nft.metadata.image}
              onClick={() => onPurchase(nft)}
              className="group cursor-pointer"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(nft.price)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(nft.id)
                      }}
                      className={cn(
                        'p-2 rounded-full transition-colors',
                        likedNFTs.has(nft.id)
                          ? 'text-red-600 bg-red-100'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      )}
                    >
                      <Heart className={cn('w-4 h-4', likedNFTs.has(nft.id) && 'fill-current')} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onShare(nft)
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                    >
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Token ID</span>
                    <span className="font-medium text-gray-900">#{nft.tokenId}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Royalty</span>
                    <span className="font-medium text-gray-900">10%</span>
                  </div>
                </div>

                <Button
                  onClick={(e) => {
                    e?.stopPropagation()
                    onPurchase(nft)
                  }}
                  className="w-full mt-4"
                >
                  Purchase
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NFT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNFTs.map((nft) => (
                  <tr key={nft.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={nft.metadata.image}
                            alt={nft.metadata.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{nft.metadata.name}</p>
                          <p className="text-sm text-gray-500">{nft.metadata.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAddress(nft.owner)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(nft.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{nft.tokenId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => onPurchase(nft)}
                        >
                          Buy
                        </Button>
                        <button
                          onClick={() => handleLike(nft.id)}
                          className={cn(
                            'p-2 rounded-full transition-colors',
                            likedNFTs.has(nft.id)
                              ? 'text-red-600 bg-red-100'
                              : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          )}
                        >
                          <Heart className={cn('w-4 h-4', likedNFTs.has(nft.id) && 'fill-current')} />
                        </button>
                        <button
                          onClick={() => onShare(nft)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                        >
                          <Share className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredNFTs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No NFTs found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button
            onClick={() => {
              setSearchQuery('')
              setFilterBy('all')
              setSortBy('newest')
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default NFTMarketplace
