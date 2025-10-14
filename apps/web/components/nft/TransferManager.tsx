'use client'

import React, { useState, useEffect } from 'react'

interface TransferManagerProps {
  onTransferComplete?: (transfer: Transfer) => void
  onTransferFailed?: (transfer: Transfer, error: string) => void
}

interface Transfer {
  id: string
  nftId: string
  nftTitle: string
  nftImageUrl: string
  from: string
  to: string
  price?: number
  currency?: 'ETH' | 'USDC' | 'USDT'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  transactionHash?: string
  createdAt: number
  completedAt?: number
  gasUsed?: number
  gasPrice?: number
  blockNumber?: number
  error?: string
}

interface TransferStats {
  totalTransfers: number
  successfulTransfers: number
  failedTransfers: number
  totalVolume: number
  averageGasUsed: number
  successRate: number
}

interface TransferFilter {
  status: 'all' | 'pending' | 'processing' | 'completed' | 'failed'
  dateRange: 'all' | '7d' | '30d' | '90d'
  type: 'all' | 'transfer' | 'sale' | 'auction'
}

export default function TransferManager({
  onTransferComplete,
  onTransferFailed
}: TransferManagerProps) {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [stats, setStats] = useState<TransferStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<TransferFilter>({
    status: 'all',
    dateRange: 'all',
    type: 'all'
  })
  const [selectedTransfers, setSelectedTransfers] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    loadTransferData()
  }, [])

  const loadTransferData = async () => {
    setIsLoading(true)
    try {
      // Mock implementation - in real app, this would call your API
      const mockTransfers: Transfer[] = [
        {
          id: '1',
          nftId: 'nft1',
          nftTitle: 'Hit Song NFT',
          nftImageUrl: 'https://via.placeholder.com/100x100?text=Hit+Song',
          from: '0x123...',
          to: '0x456...',
          price: 0.1,
          currency: 'ETH',
          status: 'completed',
          transactionHash: '0xabc123...',
          createdAt: Date.now() - 86400000,
          completedAt: Date.now() - 86300000,
          gasUsed: 150000,
          gasPrice: 20,
          blockNumber: 12345678
        },
        {
          id: '2',
          nftId: 'nft2',
          nftTitle: 'Rare Track NFT',
          nftImageUrl: 'https://via.placeholder.com/100x100?text=Rare+Track',
          from: '0x789...',
          to: '0xabc...',
          price: 0.5,
          currency: 'ETH',
          status: 'processing',
          transactionHash: '0xdef456...',
          createdAt: Date.now() - 3600000,
          gasUsed: 180000,
          gasPrice: 25
        },
        {
          id: '3',
          nftId: 'nft3',
          nftTitle: 'Electronic Beat NFT',
          nftImageUrl: 'https://via.placeholder.com/100x100?text=Electronic',
          from: '0xdef...',
          to: '0xghi...',
          status: 'failed',
          createdAt: Date.now() - 7200000,
          error: 'Insufficient gas'
        }
      ]

      const mockStats: TransferStats = {
        totalTransfers: 150,
        successfulTransfers: 142,
        failedTransfers: 8,
        totalVolume: 25.5,
        averageGasUsed: 165000,
        successRate: 94.7
      }

      setTransfers(mockTransfers)
      setStats(mockStats)
    } catch (error) {
      console.error('Failed to load transfer data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTransfers = transfers.filter(transfer => {
    if (filters.status !== 'all' && transfer.status !== filters.status) return false
    if (filters.type !== 'all') {
      if (filters.type === 'transfer' && transfer.price) return false
      if (filters.type === 'sale' && !transfer.price) return false
    }
    return true
  })

  const handleTransferSelect = (transferId: string) => {
    setSelectedTransfers(prev => 
      prev.includes(transferId) 
        ? prev.filter(id => id !== transferId)
        : [...prev, transferId]
    )
  }

  const handleSelectAll = () => {
    if (selectedTransfers.length === filteredTransfers.length) {
      setSelectedTransfers([])
    } else {
      setSelectedTransfers(filteredTransfers.map(t => t.id))
    }
  }

  const handleBulkAction = (action: 'retry' | 'cancel' | 'delete') => {
    if (selectedTransfers.length === 0) return

    switch (action) {
      case 'retry':
        // Retry failed transfers
        setTransfers(prev => prev.map(transfer => 
          selectedTransfers.includes(transfer.id) && transfer.status === 'failed'
            ? { ...transfer, status: 'processing' as const }
            : transfer
        ))
        break
      case 'cancel':
        // Cancel pending/processing transfers
        setTransfers(prev => prev.map(transfer => 
          selectedTransfers.includes(transfer.id) && (transfer.status === 'pending' || transfer.status === 'processing')
            ? { ...transfer, status: 'failed' as const, error: 'Cancelled by user' }
            : transfer
        ))
        break
      case 'delete':
        // Delete completed/failed transfers
        setTransfers(prev => prev.filter(transfer => 
          !selectedTransfers.includes(transfer.id) || 
          (transfer.status !== 'completed' && transfer.status !== 'failed')
        ))
        break
    }
    
    setSelectedTransfers([])
    setShowBulkActions(false)
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
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 60) {
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else {
      return `${days}d ago`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅'
      case 'processing':
        return '⏳'
      case 'pending':
        return '⏸️'
      case 'failed':
        return '❌'
      default:
        return '📝'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
          <h2 className="text-2xl font-bold text-gray-900">Transfer Manager</h2>
          <p className="text-gray-600">Monitor and manage your NFT transfers</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {selectedTransfers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{selectedTransfers.length} selected</span>
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
              >
                Bulk Actions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{stats.totalTransfers}</div>
            <div className="text-sm text-blue-600">Total Transfers</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">{stats.successfulTransfers}</div>
            <div className="text-sm text-green-600">Successful</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-900">{stats.failedTransfers}</div>
            <div className="text-sm text-red-600">Failed</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-900">{formatCurrency(stats.totalVolume)}</div>
            <div className="text-sm text-purple-600">Total Volume</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-900">{stats.successRate}%</div>
            <div className="text-sm text-yellow-600">Success Rate</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value="all">All Types</option>
              <option value="transfer">Transfer</option>
              <option value="sale">Sale</option>
              <option value="auction">Auction</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-yellow-900">Bulk Actions</h3>
              <p className="text-sm text-yellow-700">{selectedTransfers.length} transfers selected</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('retry')}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Retry Failed
              </button>
              <button
                onClick={() => handleBulkAction('cancel')}
                className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfers List */}
      {filteredTransfers.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transfers found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransfers.map(transfer => (
            <div
              key={transfer.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedTransfers.includes(transfer.id)}
                  onChange={() => handleTransferSelect(transfer.id)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />

                {/* NFT Image */}
                <img
                  src={transfer.nftImageUrl}
                  alt={transfer.nftTitle}
                  className="w-16 h-16 rounded-lg object-cover"
                />

                {/* Transfer Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{transfer.nftTitle}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
                        {getStatusIcon(transfer.status)} {transfer.status}
                      </span>
                      <span className="text-sm text-gray-500">{formatTimeAgo(transfer.createdAt)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">From</p>
                      <p className="font-medium text-gray-900 font-mono">{transfer.from}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">To</p>
                      <p className="font-medium text-gray-900 font-mono">{transfer.to}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium text-gray-900">
                        {transfer.price ? formatCurrency(transfer.price) : 'Free Transfer'}
                      </p>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  {transfer.transactionHash && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-500">
                            TX: <span className="font-mono">{transfer.transactionHash}</span>
                          </span>
                          {transfer.blockNumber && (
                            <span className="text-gray-500">
                              Block: {transfer.blockNumber}
                            </span>
                          )}
                        </div>
                        {transfer.gasUsed && (
                          <span className="text-gray-500">
                            Gas: {formatNumber(transfer.gasUsed)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {transfer.error && (
                    <div className="mt-2 pt-2 border-t border-red-200">
                      <p className="text-sm text-red-600">
                        Error: {transfer.error}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Select All */}
      {filteredTransfers.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handleSelectAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {selectedTransfers.length === filteredTransfers.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-sm text-gray-500">
            {filteredTransfers.length} transfer{filteredTransfers.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}
