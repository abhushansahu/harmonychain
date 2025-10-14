'use client'

import React, { useState, useEffect } from 'react'

interface OwnershipDisplayProps {
  nftId: string
  onTransfer?: (nftId: string, to: string) => void
  onSell?: (nftId: string, price: number) => void
  onBurn?: (nftId: string) => void
}

interface NFT {
  id: string
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

interface OwnershipHistory {
  id: string
  from: string
  to: string
  price?: number
  timestamp: number
  transactionHash: string
  type: 'mint' | 'transfer' | 'sale' | 'auction'
}

interface OwnershipStats {
  totalOwned: number
  totalValue: number
  totalSpent: number
  totalEarned: number
  averageHoldingTime: number
  topCollection: string
  rarityScore: number
}

interface Collection {
  id: string
  name: string
  description: string
  imageUrl: string
  itemCount: number
  totalValue: number
  floorPrice: number
  volume24h: number
  owners: number
}

export default function OwnershipDisplay({
  nftId,
  onTransfer,
  onSell,
  onBurn
}: OwnershipDisplayProps) {
  const [nft, setNft] = useState<NFT | null>(null)
  const [ownershipHistory, setOwnershipHistory] = useState<OwnershipHistory[]>([])
  const [stats, setStats] = useState<OwnershipStats | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'collections' | 'actions'>('overview')
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showSellModal, setShowSellModal] = useState(false)
  const [transferTo, setTransferTo] = useState('')
  const [sellPrice, setSellPrice] = useState(0)

  useEffect(() => {
    loadOwnershipData()
  }, [nftId])

  const loadOwnershipData = async () => {
    setIsLoading(true)
    try {
      // Mock implementation - in real app, this would call your API
      const mockNFT: NFT = {
        id: nftId,
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
      }

      const mockHistory: OwnershipHistory[] = [
        {
          id: '1',
          from: '0x000...',
          to: '0x456...',
          price: 0.05,
          timestamp: Date.now() - 86400000,
          transactionHash: '0xabc...',
          type: 'mint'
        },
        {
          id: '2',
          from: '0x456...',
          to: '0x789...',
          price: 0.08,
          timestamp: Date.now() - 172800000,
          transactionHash: '0xdef...',
          type: 'sale'
        },
        {
          id: '3',
          from: '0x789...',
          to: '0x123...',
          price: 0.1,
          timestamp: Date.now() - 259200000,
          transactionHash: '0xghi...',
          type: 'sale'
        }
      ]

      const mockStats: OwnershipStats = {
        totalOwned: 25,
        totalValue: 2.5,
        totalSpent: 1.8,
        totalEarned: 0.7,
        averageHoldingTime: 30,
        topCollection: 'Electronic Music',
        rarityScore: 85
      }

      const mockCollections: Collection[] = [
        {
          id: '1',
          name: 'Electronic Music',
          description: 'Collection of electronic music NFTs',
          imageUrl: 'https://via.placeholder.com/200x200?text=Electronic',
          itemCount: 15,
          totalValue: 1.5,
          floorPrice: 0.05,
          volume24h: 0.3,
          owners: 120
        },
        {
          id: '2',
          name: 'Rock Classics',
          description: 'Classic rock music NFTs',
          imageUrl: 'https://via.placeholder.com/200x200?text=Rock',
          itemCount: 8,
          totalValue: 0.8,
          floorPrice: 0.08,
          volume24h: 0.2,
          owners: 80
        }
      ]

      setNft(mockNFT)
      setOwnershipHistory(mockHistory)
      setStats(mockStats)
      setCollections(mockCollections)
    } catch (error) {
      console.error('Failed to load ownership data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransfer = () => {
    if (transferTo && onTransfer) {
      onTransfer(nftId, transferTo)
      setShowTransferModal(false)
      setTransferTo('')
    }
  }

  const handleSell = () => {
    if (sellPrice > 0 && onSell) {
      onSell(nftId, sellPrice)
      setShowSellModal(false)
      setSellPrice(0)
    }
  }

  const handleBurn = () => {
    if (confirm('Are you sure you want to burn this NFT? This action cannot be undone.')) {
      onBurn?.(nftId)
    }
  }

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

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'mint':
        return '🆕'
      case 'transfer':
        return '↔️'
      case 'sale':
        return '💰'
      case 'auction':
        return '🔨'
      default:
        return '📝'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
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

  if (!nft) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">NFT not found</h3>
        <p className="text-gray-500">The NFT you're looking for doesn't exist</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">NFT Ownership</h2>
          <p className="text-gray-600">Manage your NFT ownership and history</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowTransferModal(true)}
            className="btn-secondary"
          >
            Transfer
          </button>
          <button
            onClick={() => setShowSellModal(true)}
            className="btn-primary"
          >
            Sell
          </button>
        </div>
      </div>

      {/* NFT Card */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* NFT Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={nft.imageUrl}
              alt={nft.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* NFT Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{nft.title}</h3>
              <p className="text-gray-600 mb-4">{nft.description}</p>
            </div>

            {/* Price and Status */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(nft.price)}</p>
                <p className="text-sm text-gray-500">{nft.available}/{nft.supply} available</p>
              </div>
              <div className="text-right">
                {nft.isListed && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Listed
                  </span>
                )}
                {nft.isAuction && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Auction
                  </span>
                )}
              </div>
            </div>

            {/* Attributes */}
            {nft.attributes.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Attributes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {nft.attributes.map((attr, index) => (
                    <div key={index} className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-500">{attr.trait_type}</p>
                      <p className="text-sm font-medium text-gray-900">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ownership Info */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Owner</p>
                  <p className="font-medium text-gray-900">{nft.owner}</p>
                </div>
                <div>
                  <p className="text-gray-500">Creator</p>
                  <p className="font-medium text-gray-900">{nft.creator}</p>
                </div>
                <div>
                  <p className="text-gray-500">Contract</p>
                  <p className="font-medium text-gray-900 font-mono text-xs">{nft.contractAddress}</p>
                </div>
                <div>
                  <p className="text-gray-500">Token ID</p>
                  <p className="font-medium text-gray-900">{nft.tokenId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'history', label: 'History', icon: '📜' },
            { id: 'collections', label: 'Collections', icon: '🗂️' },
            { id: 'actions', label: 'Actions', icon: '⚡' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-900">{stats.totalOwned}</div>
              <div className="text-sm text-blue-600">Total Owned</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalValue)}</div>
              <div className="text-sm text-green-600">Total Value</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-900">{formatCurrency(stats.totalSpent)}</div>
              <div className="text-sm text-purple-600">Total Spent</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-900">{formatCurrency(stats.totalEarned)}</div>
              <div className="text-sm text-yellow-600">Total Earned</div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ownership History</h3>
            <div className="space-y-4">
              {ownershipHistory.map((event, index) => (
                <div key={event.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{getHistoryIcon(event.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        {event.type === 'mint' ? 'Minted' : 
                         event.type === 'transfer' ? 'Transferred' :
                         event.type === 'sale' ? 'Sold' : 'Auctioned'}
                      </p>
                      <span className="text-sm text-gray-500">{formatTimeAgo(event.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      From: {event.from} → To: {event.to}
                    </p>
                    {event.price && (
                      <p className="text-sm font-medium text-green-600">
                        Price: {formatCurrency(event.price)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 font-mono">
                      TX: {event.transactionHash}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'collections' && (
          <div className="space-y-4">
            {collections.map(collection => (
              <div key={collection.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={collection.imageUrl}
                    alt={collection.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{collection.name}</h4>
                    <p className="text-sm text-gray-600">{collection.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{collection.itemCount} items</span>
                      <span>{formatCurrency(collection.totalValue)} value</span>
                      <span>{collection.owners} owners</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(collection.floorPrice)}</p>
                    <p className="text-sm text-gray-500">Floor price</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">NFT Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => setShowTransferModal(true)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-2xl mb-2">↔️</div>
                <h4 className="font-medium text-gray-900">Transfer</h4>
                <p className="text-sm text-gray-500">Transfer to another wallet</p>
              </button>

              <button
                onClick={() => setShowSellModal(true)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-2xl mb-2">💰</div>
                <h4 className="font-medium text-gray-900">Sell</h4>
                <p className="text-sm text-gray-500">List for sale on marketplace</p>
              </button>

              <button
                onClick={handleBurn}
                className="p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <div className="text-2xl mb-2">🔥</div>
                <h4 className="font-medium text-red-900">Burn</h4>
                <p className="text-sm text-red-500">Permanently destroy this NFT</p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer NFT</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0x..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  className="btn-primary"
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sell NFT</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (ETH)
                </label>
                <input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.1"
                  step="0.001"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSellModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSell}
                  className="btn-primary"
                >
                  List for Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
