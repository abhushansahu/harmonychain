'use client'

import React, { useState, useEffect } from 'react'

interface RevenueSplitProps {
  trackId: string
  onSplitUpdate?: (split: RevenueSplit) => void
  initialSplit?: RevenueSplit
}

interface RevenueSplit {
  id: string
  trackId: string
  name: string
  description: string
  isActive: boolean
  splits: SplitRule[]
  totalPercentage: number
  createdAt: number
  updatedAt: number
}

interface SplitRule {
  id: string
  recipient: string
  recipientName: string
  recipientType: 'artist' | 'producer' | 'songwriter' | 'publisher' | 'label' | 'other'
  percentage: number
  isActive: boolean
  priority: number
  conditions?: SplitCondition[]
  minimumAmount?: number
  maximumAmount?: number
}

interface SplitCondition {
  id: string
  type: 'revenue_threshold' | 'time_period' | 'territory' | 'platform' | 'usage_type'
  value: string
  operator: 'greater_than' | 'less_than' | 'equals' | 'contains'
  isActive: boolean
}

interface RevenueData {
  totalRevenue: number
  totalSplits: number
  averageSplit: number
  topRecipient: string
  monthlyRevenue: number
  quarterlyRevenue: number
  yearlyRevenue: number
}

interface SplitHistory {
  id: string
  splitId: string
  recipient: string
  amount: number
  percentage: number
  timestamp: number
  transactionHash: string
  status: 'pending' | 'completed' | 'failed'
}

const RECIPIENT_TYPES = [
  {
    id: 'artist',
    name: 'Artist',
    description: 'Primary artist/creator',
    icon: '🎤',
    color: 'bg-blue-500'
  },
  {
    id: 'producer',
    name: 'Producer',
    description: 'Music producer',
    icon: '🎛️',
    color: 'bg-green-500'
  },
  {
    id: 'songwriter',
    name: 'Songwriter',
    description: 'Songwriter/composer',
    icon: '✍️',
    color: 'bg-purple-500'
  },
  {
    id: 'publisher',
    name: 'Publisher',
    description: 'Music publisher',
    icon: '📚',
    color: 'bg-yellow-500'
  },
  {
    id: 'label',
    name: 'Record Label',
    description: 'Record label',
    icon: '🏷️',
    color: 'bg-red-500'
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Other stakeholders',
    icon: '👥',
    color: 'bg-gray-500'
  }
]

export default function RevenueSplit({
  trackId,
  onSplitUpdate,
  initialSplit
}: RevenueSplitProps) {
  const [split, setSplit] = useState<RevenueSplit>({
    id: `split-${Date.now()}`,
    trackId: trackId,
    name: 'Default Revenue Split',
    description: 'Standard revenue distribution',
    isActive: true,
    splits: [],
    totalPercentage: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  })
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [splitHistory, setSplitHistory] = useState<SplitHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddSplit, setShowAddSplit] = useState(false)
  const [editingSplit, setEditingSplit] = useState<string | null>(null)

  useEffect(() => {
    if (initialSplit) {
      setSplit(initialSplit)
    } else {
      loadDefaultSplit()
    }
    loadRevenueData()
    setIsLoading(false)
  }, [trackId, initialSplit])

  const loadDefaultSplit = () => {
    const defaultSplits: SplitRule[] = [
      {
        id: 'split-1',
        recipient: '0x123...',
        recipientName: 'Primary Artist',
        recipientType: 'artist',
        percentage: 60,
        isActive: true,
        priority: 1
      },
      {
        id: 'split-2',
        recipient: '0x456...',
        recipientName: 'Producer',
        recipientType: 'producer',
        percentage: 25,
        isActive: true,
        priority: 2
      },
      {
        id: 'split-3',
        recipient: '0x789...',
        recipientName: 'Songwriter',
        recipientType: 'songwriter',
        percentage: 15,
        isActive: true,
        priority: 3
      }
    ]

    setSplit(prev => ({
      ...prev,
      splits: defaultSplits,
      totalPercentage: defaultSplits.reduce((sum, s) => sum + s.percentage, 0)
    }))
  }

  const loadRevenueData = async () => {
    try {
      // Mock implementation - in real app, this would call your API
      const mockRevenueData: RevenueData = {
        totalRevenue: 5.2,
        totalSplits: 15,
        averageSplit: 0.35,
        topRecipient: 'Primary Artist',
        monthlyRevenue: 0.8,
        quarterlyRevenue: 2.4,
        yearlyRevenue: 5.2
      }

      const mockSplitHistory: SplitHistory[] = [
        {
          id: 'hist-1',
          splitId: 'split-1',
          recipient: '0x123...',
          amount: 0.48,
          percentage: 60,
          timestamp: Date.now() - 86400000,
          transactionHash: '0xabc123...',
          status: 'completed'
        },
        {
          id: 'hist-2',
          splitId: 'split-2',
          recipient: '0x456...',
          amount: 0.20,
          percentage: 25,
          timestamp: Date.now() - 86400000,
          transactionHash: '0xdef456...',
          status: 'completed'
        },
        {
          id: 'hist-3',
          splitId: 'split-3',
          recipient: '0x789...',
          amount: 0.12,
          percentage: 15,
          timestamp: Date.now() - 86400000,
          transactionHash: '0xghi789...',
          status: 'completed'
        }
      ]

      setRevenueData(mockRevenueData)
      setSplitHistory(mockSplitHistory)
    } catch (error) {
      console.error('Failed to load revenue data:', error)
    }
  }

  const handleSplitAdd = (newSplit: Omit<SplitRule, 'id'>) => {
    const split: SplitRule = {
      ...newSplit,
      id: `split-${Date.now()}`
    }

    setSplit(prev => {
      const updatedSplits = [...prev.splits, split]
      const totalPercentage = updatedSplits.reduce((sum, s) => sum + s.percentage, 0)
      
      return {
        ...prev,
        splits: updatedSplits,
        totalPercentage,
        updatedAt: Date.now()
      }
    })
  }

  const handleSplitUpdate = (splitId: string, field: keyof SplitRule, value: any) => {
    setSplit(prev => {
      const updatedSplits = prev.splits.map(s =>
        s.id === splitId ? { ...s, [field]: value } : s
      )
      const totalPercentage = updatedSplits.reduce((sum, s) => sum + s.percentage, 0)
      
      return {
        ...prev,
        splits: updatedSplits,
        totalPercentage,
        updatedAt: Date.now()
      }
    })
  }

  const handleSplitRemove = (splitId: string) => {
    setSplit(prev => {
      const updatedSplits = prev.splits.filter(s => s.id !== splitId)
      const totalPercentage = updatedSplits.reduce((sum, s) => sum + s.percentage, 0)
      
      return {
        ...prev,
        splits: updatedSplits,
        totalPercentage,
        updatedAt: Date.now()
      }
    })
  }

  const handleSplitReorder = (splitId: string, direction: 'up' | 'down') => {
    setSplit(prev => {
      const splits = [...prev.splits]
      const index = splits.findIndex(s => s.id === splitId)
      
      if (index === -1) return prev
      
      const newIndex = direction === 'up' ? index - 1 : index + 1
      
      if (newIndex < 0 || newIndex >= splits.length) return prev
      
      [splits[index], splits[newIndex]] = [splits[newIndex], splits[index]]
      
      return {
        ...prev,
        splits: splits.map((s, i) => ({ ...s, priority: i + 1 })),
        updatedAt: Date.now()
      }
    })
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

  const getRecipientIcon = (type: string) => {
    const recipient = RECIPIENT_TYPES.find(r => r.id === type)
    return recipient?.icon || '👥'
  }

  const getRecipientColor = (type: string) => {
    const recipient = RECIPIENT_TYPES.find(r => r.id === type)
    return recipient?.color || 'bg-gray-500'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Revenue Split</h2>
          <p className="text-gray-600">Configure revenue distribution among stakeholders</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAddSplit(true)}
            className="btn-primary"
          >
            Add Split
          </button>
        </div>
      </div>

      {/* Revenue Overview */}
      {revenueData && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(revenueData.totalRevenue)}</div>
            <div className="text-sm text-blue-600">Total Revenue</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">{revenueData.totalSplits}</div>
            <div className="text-sm text-green-600">Total Splits</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-900">{formatCurrency(revenueData.averageSplit)}</div>
            <div className="text-sm text-purple-600">Average Split</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-900">{formatCurrency(revenueData.monthlyRevenue)}</div>
            <div className="text-sm text-yellow-600">Monthly</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-900">{formatCurrency(revenueData.yearlyRevenue)}</div>
            <div className="text-sm text-red-600">Yearly</div>
          </div>
        </div>
      )}

      {/* Split Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Splits</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Total: {split.totalPercentage}%</span>
            {split.totalPercentage !== 100 && (
              <span className="text-sm text-red-600">
                ({100 - split.totalPercentage}% remaining)
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {split.splits.map((splitRule, index) => (
            <div key={splitRule.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${getRecipientColor(splitRule.recipientType)}`}>
                    {getRecipientIcon(splitRule.recipientType)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{splitRule.recipientName}</h4>
                    <p className="text-sm text-gray-500">{splitRule.recipient}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">{splitRule.percentage}%</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleSplitReorder(splitRule.id, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleSplitReorder(splitRule.id, 'down')}
                      disabled={index === split.splits.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Percentage
                  </label>
                  <input
                    type="number"
                    value={splitRule.percentage}
                    onChange={(e) => handleSplitUpdate(splitRule.id, 'percentage', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Type
                  </label>
                  <select
                    value={splitRule.recipientType}
                    onChange={(e) => handleSplitUpdate(splitRule.id, 'recipientType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  >
                    {RECIPIENT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={splitRule.recipient}
                    onChange={(e) => handleSplitUpdate(splitRule.id, 'recipient', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="0x..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={splitRule.isActive}
                      onChange={(e) => handleSplitUpdate(splitRule.id, 'isActive', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
                
                <button
                  onClick={() => handleSplitRemove(splitRule.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Splits</h3>
        <div className="space-y-3">
          {splitHistory.map(history => (
            <div key={history.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 text-sm">💰</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{history.recipient}</p>
                  <p className="text-sm text-gray-500">{formatTimeAgo(history.timestamp)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatCurrency(history.amount)}</p>
                <p className="text-sm text-gray-500">{history.percentage}%</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(history.status)}`}>
                  {history.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onSplitUpdate?.(split)}
          className="btn-primary"
        >
          Save Revenue Split
        </button>
      </div>
    </div>
  )
}
