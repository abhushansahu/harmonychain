'use client'

import React, { useState } from 'react'
import { NFT } from '@/lib/types'
import { formatCurrency, formatAddress, formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Copy, ExternalLink, Share, Heart, MoreHorizontal, Download } from 'lucide-react'
import Button from '@/components/ui/Button'

interface OwnershipDisplayProps {
  nfts: NFT[]
  onTransfer: (nft: NFT) => void
  onSell: (nft: NFT) => void
  onShare: (nft: NFT) => void
  className?: string
}

const OwnershipDisplay: React.FC<OwnershipDisplayProps> = ({
  nfts,
  onTransfer,
  onSell,
  onShare,
  className
}) => {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price' | 'name'>('newest')

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    // Could show a toast notification here
  }

  const handleViewOnExplorer = (nft: NFT) => {
    // This would open the NFT on a blockchain explorer
    window.open(`https://explorer.harmony.one/address/${nft.contractAddress}`, '_blank')
  }

  const sortedNFTs = [...nfts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'price':
        return b.price - a.price
      case 'name':
        return a.metadata.name.localeCompare(b.metadata.name)
      default:
        return 0
    }
  })

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My NFTs</h1>
          <p className="text-gray-600">Manage your NFT collection</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price">Highest Value</option>
            <option value="name">Name A-Z</option>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total NFTs</p>
              <p className="text-2xl font-bold text-gray-900">{nfts.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(nfts.reduce((sum, nft) => sum + nft.price, 0))}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Download className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Collections</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(nfts.map(nft => nft.contractAddress)).size}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MoreHorizontal className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* NFT Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedNFTs.map((nft) => (
            <div
              key={nft.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gray-200 overflow-hidden">
                <img
                  src={nft.metadata.image}
                  alt={nft.metadata.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 truncate mb-1">
                  {nft.metadata.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Token ID: #{nft.tokenId}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Contract</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-mono text-xs">
                        {formatAddress(nft.contractAddress)}
                      </span>
                      <button
                        onClick={() => handleCopyAddress(nft.contractAddress)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Value</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(nft.price)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Created</span>
                    <span className="text-gray-900">
                      {new Date(nft.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onTransfer(nft)}
                    className="flex-1"
                  >
                    Transfer
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onSell(nft)}
                    className="flex-1"
                  >
                    Sell
                  </Button>
                </div>
              </div>
            </div>
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
                    Token ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedNFTs.map((nft) => (
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
                      #{nft.tokenId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <span className="font-mono text-xs">
                          {formatAddress(nft.contractAddress)}
                        </span>
                        <button
                          onClick={() => handleCopyAddress(nft.contractAddress)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(nft.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(nft.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onTransfer(nft)}
                        >
                          Transfer
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onSell(nft)}
                        >
                          Sell
                        </Button>
                        <button
                          onClick={() => onShare(nft)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                        >
                          <Share className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewOnExplorer(nft)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
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
      {nfts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No NFTs owned</h3>
          <p className="text-gray-500 mb-4">
            You don't own any NFTs yet. Start collecting!
          </p>
          <Button>
            Browse Marketplace
          </Button>
        </div>
      )}
    </div>
  )
}

export default OwnershipDisplay
