'use client'

import React, { useState } from 'react'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { DollarSign, TrendingUp, Users, PieChart, Settings } from 'lucide-react'
import Button from '@/components/ui/Button'

interface RevenueSplitProps {
  totalRevenue: number
  onSplitUpdate: (splits: RevenueSplit[]) => void
  className?: string
}

interface RevenueSplit {
  id: string
  name: string
  address: string
  percentage: number
  amount: number
  isEditable: boolean
}

const RevenueSplit: React.FC<RevenueSplitProps> = ({
  totalRevenue,
  onSplitUpdate,
  className
}) => {
  const [splits, setSplits] = useState<RevenueSplit[]>([
    {
      id: 'artist',
      name: 'Artist',
      address: '0x123...456',
      percentage: 70,
      amount: totalRevenue * 0.7,
      isEditable: true
    },
    {
      id: 'platform',
      name: 'Platform',
      address: '0x789...012',
      percentage: 20,
      amount: totalRevenue * 0.2,
      isEditable: false
    },
    {
      id: 'community',
      name: 'Community Pool',
      address: '0x345...678',
      percentage: 10,
      amount: totalRevenue * 0.1,
      isEditable: true
    }
  ])

  const [showAddSplit, setShowAddSplit] = useState(false)
  const [newSplit, setNewSplit] = useState({
    name: '',
    address: '',
    percentage: 0
  })

  const handlePercentageChange = (id: string, newPercentage: number) => {
    const updatedSplits = splits.map(split => {
      if (split.id === id) {
        return { ...split, percentage: newPercentage }
      }
      return split
    })

    // Recalculate amounts
    const recalculatedSplits = updatedSplits.map(split => ({
      ...split,
      amount: totalRevenue * (split.percentage / 100)
    }))

    setSplits(recalculatedSplits)
    onSplitUpdate(recalculatedSplits)
  }

  const handleAddSplit = () => {
    if (newSplit.name && newSplit.address && newSplit.percentage > 0) {
      const totalPercentage = splits.reduce((sum, split) => sum + split.percentage, 0)
      
      if (totalPercentage + newSplit.percentage <= 100) {
        const split: RevenueSplit = {
          id: Date.now().toString(),
          name: newSplit.name,
          address: newSplit.address,
          percentage: newSplit.percentage,
          amount: totalRevenue * (newSplit.percentage / 100),
          isEditable: true
        }

        const updatedSplits = [...splits, split]
        setSplits(updatedSplits)
        onSplitUpdate(updatedSplits)
        
        setNewSplit({ name: '', address: '', percentage: 0 })
        setShowAddSplit(false)
      }
    }
  }

  const handleRemoveSplit = (id: string) => {
    const updatedSplits = splits.filter(split => split.id !== id)
    setSplits(updatedSplits)
    onSplitUpdate(updatedSplits)
  }

  const totalPercentage = splits.reduce((sum, split) => sum + split.percentage, 0)
  const remainingPercentage = 100 - totalPercentage

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Revenue Split</h2>
          <p className="text-gray-600">Configure how revenue is distributed</p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowAddSplit(true)}
        >
          <Users className="w-4 h-4 mr-2" />
          Add Recipient
        </Button>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Split</p>
              <p className="text-2xl font-bold text-gray-900">{totalPercentage}%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <PieChart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">{remainingPercentage}%</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Split Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Split Configuration</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {splits.map((split, index) => (
            <div key={split.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{split.name}</h4>
                    <p className="text-sm text-gray-500 font-mono">{split.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(split.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {split.percentage}% of total
                    </p>
                  </div>

                  {split.isEditable ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={split.percentage}
                        onChange={(e) => handlePercentageChange(split.id, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-500">%</span>
                      <button
                        onClick={() => handleRemoveSplit(split.id)}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Fixed</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Split Modal */}
      {showAddSplit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Revenue Recipient</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newSplit.name}
                  onChange={(e) => setNewSplit(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Producer, Collaborator"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={newSplit.address}
                  onChange={(e) => setNewSplit(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Percentage
                </label>
                <input
                  type="number"
                  min="0"
                  max={remainingPercentage}
                  value={newSplit.percentage}
                  onChange={(e) => setNewSplit(prev => ({ ...prev, percentage: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Remaining: {remainingPercentage}%
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddSplit(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddSplit}>
                Add Recipient
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Messages */}
      {totalPercentage > 100 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            <strong>Warning:</strong> Total percentage exceeds 100%. Please adjust the splits.
          </p>
        </div>
      )}

      {totalPercentage < 100 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> {remainingPercentage}% of revenue is not allocated to any recipient.
          </p>
        </div>
      )}
    </div>
  )
}

export default RevenueSplit
