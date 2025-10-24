'use client'

import React, { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api/client'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface PriceFeedProps {
  symbol?: string
  showChange?: boolean
  className?: string
}

export default function PriceFeed({ symbol = 'ONE', showChange = true, className = '' }: PriceFeedProps) {
  const [price, setPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getPriceFeed(symbol)
        
        if (response.success && response.data) {
          setPrice(response.data.price)
        } else {
          setError(response.error || 'Failed to fetch price')
        }
      } catch (err) {
        setError('Failed to fetch price')
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()
    
    // Refresh price every 30 seconds
    const interval = setInterval(fetchPrice, 30000)
    return () => clearInterval(interval)
  }, [symbol])

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-pulse bg-gray-300 rounded h-4 w-16"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 text-red-400 ${className}`}>
        <span className="text-sm">Price unavailable</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-white">
        ${price?.toFixed(4)}
      </span>
      {showChange && (
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-400">+2.5%</span>
        </div>
      )}
    </div>
  )
}
