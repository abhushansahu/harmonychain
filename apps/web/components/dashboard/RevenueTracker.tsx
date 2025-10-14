'use client'

import React, { useState, useEffect } from 'react'

interface RevenueTrackerProps {
  artistId: string
  timeRange: '7d' | '30d' | '90d' | '1y'
}

interface RevenueData {
  totalRevenue: number
  monthlyRevenue: number
  revenueOverTime: RevenuePoint[]
  revenueSources: RevenueSource[]
  topEarningTracks: TrackRevenue[]
  nftSales: NFTSale[]
  licensingRevenue: LicensingRevenue[]
  withdrawalHistory: Withdrawal[]
  pendingPayouts: PendingPayout[]
}

interface RevenuePoint {
  date: string
  amount: number
  source: 'streaming' | 'nft' | 'licensing' | 'tips'
}

interface RevenueSource {
  source: string
  amount: number
  percentage: number
  icon: string
  color: string
}

interface TrackRevenue {
  id: string
  title: string
  revenue: number
  plays: number
  revenuePerPlay: number
}

interface NFTSale {
  id: string
  trackId: string
  trackTitle: string
  price: number
  buyer: string
  timestamp: number
  transactionHash: string
}

interface LicensingRevenue {
  id: string
  trackId: string
  trackTitle: string
  licensee: string
  amount: number
  type: 'sync' | 'performance' | 'mechanical'
  timestamp: number
}

interface Withdrawal {
  id: string
  amount: number
  timestamp: number
  transactionHash: string
  status: 'pending' | 'completed' | 'failed'
}

interface PendingPayout {
  source: string
  amount: number
  estimatedPayout: string
  icon: string
}

export default function RevenueTracker({ artistId, timeRange }: RevenueTrackerProps) {
  const [revenue, setRevenue] = useState<RevenueData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSource, setSelectedSource] = useState<string>('all')

  useEffect(() => {
    loadRevenueData()
  }, [artistId, timeRange])

  const loadRevenueData = async () => {
    setIsLoading(true)
    try {
      // Mock implementation - in real app, this would call your API
      const mockRevenue: RevenueData = {
        totalRevenue: 2.5,
        monthlyRevenue: 0.3,
        revenueOverTime: generateRevenueOverTime(),
        revenueSources: [
          { source: 'Streaming', amount: 1.2, percentage: 48, icon: '🎵', color: 'bg-blue-500' },
          { source: 'NFT Sales', amount: 0.8, percentage: 32, icon: '🖼️', color: 'bg-purple-500' },
          { source: 'Licensing', amount: 0.3, percentage: 12, icon: '📄', color: 'bg-green-500' },
          { source: 'Tips', amount: 0.2, percentage: 8, icon: '💰', color: 'bg-yellow-500' }
        ],
        topEarningTracks: [
          {
            id: '1',
            title: 'Hit Song',
            revenue: 0.8,
            plays: 25000,
            revenuePerPlay: 0.000032
          },
          {
            id: '2',
            title: 'Another Track',
            revenue: 0.6,
            plays: 18000,
            revenuePerPlay: 0.000033
          },
          {
            id: '3',
            title: 'Third Song',
            revenue: 0.4,
            plays: 12000,
            revenuePerPlay: 0.000033
          }
        ],
        nftSales: [
          {
            id: '1',
            trackId: '1',
            trackTitle: 'Hit Song',
            price: 0.1,
            buyer: '0x123...',
            timestamp: Date.now() - 86400000,
            transactionHash: '0xabc...'
          },
          {
            id: '2',
            trackId: '2',
            trackTitle: 'Another Track',
            price: 0.05,
            buyer: '0x456...',
            timestamp: Date.now() - 172800000,
            transactionHash: '0xdef...'
          }
        ],
        licensingRevenue: [
          {
            id: '1',
            trackId: '1',
            trackTitle: 'Hit Song',
            licensee: 'Film Studio',
            amount: 0.2,
            type: 'sync',
            timestamp: Date.now() - 259200000
          }
        ],
        withdrawalHistory: [
          {
            id: '1',
            amount: 0.5,
            timestamp: Date.now() - 604800000,
            transactionHash: '0xwithdraw1...',
            status: 'completed'
          }
        ],
        pendingPayouts: [
          { source: 'Streaming Royalties', amount: 0.15, estimatedPayout: '2024-02-01', icon: '🎵' },
          { source: 'NFT Royalties', amount: 0.05, estimatedPayout: '2024-02-01', icon: '🖼️' }
        ]
      }
      setRevenue(mockRevenue)
    } catch (error) {
      console.error('Failed to load revenue data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateRevenueOverTime = (): RevenuePoint[] => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const data: RevenuePoint[] = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        amount: Math.random() * 0.1,
        source: ['streaming', 'nft', 'licensing', 'tips'][Math.floor(Math.random() * 4)] as any
      })
    }
    
    return data
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

  const getSourceColor = (source: string) => {
    const sourceData = revenue?.revenueSources.find(s => s.source === source)
    return sourceData?.color || 'bg-gray-500'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!revenue) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No revenue data</h3>
        <p className="text-gray-500">Revenue will appear here once you start earning</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(revenue.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">This Month</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(revenue.monthlyRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">
                {formatCurrency(revenue.pendingPayouts.reduce((sum, p) => sum + p.amount, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Sources */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {revenue.revenueSources.map((source, index) => (
            <div key={source.source} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{source.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{source.source}</p>
                  <p className="text-sm text-gray-500">{source.percentage}%</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(source.amount)}</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${source.color}`}
                  style={{ width: `${source.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Earning Tracks */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Earning Tracks</h3>
        <div className="space-y-4">
          {revenue.topEarningTracks.map((track, index) => (
            <div key={track.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{track.title}</p>
                  <p className="text-sm text-gray-500">
                    {formatNumber(track.plays)} plays • {formatCurrency(track.revenuePerPlay)} per play
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{formatCurrency(track.revenue)}</p>
                <p className="text-sm text-gray-500">{formatNumber(track.plays)} plays</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NFT Sales */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent NFT Sales</h3>
          <div className="space-y-3">
            {revenue.nftSales.map(sale => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{sale.trackTitle}</p>
                  <p className="text-sm text-gray-500">
                    {sale.buyer} • {formatTimeAgo(sale.timestamp)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatCurrency(sale.price)}</p>
                  <p className="text-xs text-gray-500 font-mono">{sale.transactionHash.slice(0, 8)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Licensing Revenue */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Licensing Revenue</h3>
          <div className="space-y-3">
            {revenue.licensingRevenue.map(license => (
              <div key={license.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{license.trackTitle}</p>
                  <p className="text-sm text-gray-500">
                    {license.licensee} • {license.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{formatCurrency(license.amount)}</p>
                  <p className="text-xs text-gray-500">{formatTimeAgo(license.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Payouts */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Payouts</h3>
        <div className="space-y-3">
          {revenue.pendingPayouts.map((payout, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{payout.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{payout.source}</p>
                  <p className="text-sm text-gray-500">Payout: {payout.estimatedPayout}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-yellow-600">{formatCurrency(payout.amount)}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdrawal History</h3>
        <div className="space-y-3">
          {revenue.withdrawalHistory.map(withdrawal => (
            <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Withdrawal</p>
                <p className="text-sm text-gray-500">
                  {formatTimeAgo(withdrawal.timestamp)} • {withdrawal.transactionHash.slice(0, 8)}...
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatCurrency(withdrawal.amount)}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  withdrawal.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : withdrawal.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {withdrawal.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
