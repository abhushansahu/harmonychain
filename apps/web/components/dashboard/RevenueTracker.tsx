'use client'

import React, { useState } from 'react'
import { AnalyticsData } from '@/lib/types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react'

interface RevenueTrackerProps {
  analytics: AnalyticsData
  className?: string
}

const RevenueTracker: React.FC<RevenueTrackerProps> = ({ analytics, className }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [revenueSource, setRevenueSource] = useState<'all' | 'streaming' | 'nft' | 'licensing'>('all')

  // Mock revenue breakdown data
  const revenueBreakdown = {
    streaming: 1250.50,
    nft: 3200.75,
    licensing: 850.25,
    tips: 150.00
  }

  const totalRevenue = Object.values(revenueBreakdown).reduce((sum, amount) => sum + amount, 0)

  const revenueSources = [
    {
      id: 'streaming',
      name: 'Streaming Revenue',
      amount: revenueBreakdown.streaming,
      percentage: (revenueBreakdown.streaming / totalRevenue) * 100,
      color: 'bg-blue-500',
      icon: TrendingUp
    },
    {
      id: 'nft',
      name: 'NFT Sales',
      amount: revenueBreakdown.nft,
      percentage: (revenueBreakdown.nft / totalRevenue) * 100,
      color: 'bg-purple-500',
      icon: Wallet
    },
    {
      id: 'licensing',
      name: 'Licensing Fees',
      amount: revenueBreakdown.licensing,
      percentage: (revenueBreakdown.licensing / totalRevenue) * 100,
      color: 'bg-green-500',
      icon: CreditCard
    },
    {
      id: 'tips',
      name: 'Fan Tips',
      amount: revenueBreakdown.tips,
      percentage: (revenueBreakdown.tips / totalRevenue) * 100,
      color: 'bg-orange-500',
      icon: DollarSign
    }
  ]

  const recentTransactions = [
    {
      id: '1',
      type: 'nft_sale',
      description: 'NFT Sale - "Digital Dreams"',
      amount: 1.5,
      date: '2024-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      type: 'streaming',
      description: 'Streaming Revenue',
      amount: 25.75,
      date: '2024-01-14T15:45:00Z',
      status: 'completed'
    },
    {
      id: '3',
      type: 'licensing',
      description: 'Sync License - Commercial Use',
      amount: 500.00,
      date: '2024-01-13T09:20:00Z',
      status: 'completed'
    },
    {
      id: '4',
      type: 'tip',
      description: 'Fan Tip from @cryptobeats_fan',
      amount: 5.00,
      date: '2024-01-12T18:15:00Z',
      status: 'completed'
    }
  ]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.5% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(1250.50)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +8.2% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(125.75)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Wallet className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Processing payments
          </div>
        </div>
      </div>

      {/* Revenue Sources */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Sources</h3>
        <div className="space-y-4">
          {revenueSources.map((source) => (
            <div key={source.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn('p-2 rounded-lg', source.color.replace('bg-', 'bg-').replace('-500', '-100'))}>
                  <source.icon className={cn('w-5 h-5', source.color.replace('bg-', 'text-'))} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{source.name}</p>
                  <p className="text-xs text-gray-500">{source.percentage.toFixed(1)}% of total</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formatCurrency(source.amount)}</p>
                <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={cn('h-2 rounded-full', source.color)}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  transaction.type === 'nft_sale' ? 'bg-purple-500' :
                  transaction.type === 'streaming' ? 'bg-blue-500' :
                  transaction.type === 'licensing' ? 'bg-green-500' :
                  'bg-orange-500'
                )} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  +{formatCurrency(transaction.amount)}
                </p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Withdraw Funds</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
              Withdraw to Wallet
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors">
              Set Up Auto-Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueTracker
