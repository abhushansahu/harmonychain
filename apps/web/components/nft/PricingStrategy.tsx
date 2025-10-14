'use client'

import React, { useState, useEffect } from 'react'

interface PricingStrategyProps {
  trackId: string
  onStrategyUpdate?: (strategy: PricingStrategy) => void
  initialStrategy?: PricingStrategy
}

interface PricingStrategy {
  id: string
  name: string
  type: 'fixed' | 'auction' | 'dutch' | 'dynamic'
  basePrice: number
  currency: 'ETH' | 'USDC' | 'USDT'
  supply: number
  maxSupply?: number
  minPrice?: number
  maxPrice?: number
  priceIncrement?: number
  timeDecay?: number
  demandMultiplier?: number
  rarityMultiplier?: number
  artistReputationMultiplier?: number
  marketTrendMultiplier?: number
  isActive: boolean
  startDate?: number
  endDate?: number
  conditions: PricingCondition[]
}

interface PricingCondition {
  id: string
  type: 'play_count' | 'follower_count' | 'revenue_threshold' | 'time_based' | 'market_cap'
  operator: 'greater_than' | 'less_than' | 'equals' | 'between'
  value: number
  value2?: number
  action: 'increase_price' | 'decrease_price' | 'change_supply' | 'pause_sale'
  multiplier?: number
  isActive: boolean
}

interface MarketData {
  averagePrice: number
  floorPrice: number
  volume24h: number
  sales24h: number
  trend: 'up' | 'down' | 'stable'
  volatility: number
}

interface PricingSimulation {
  scenario: string
  price: number
  sales: number
  revenue: number
  marketShare: number
}

const STRATEGY_TYPES = [
  {
    id: 'fixed',
    name: 'Fixed Price',
    description: 'Set a fixed price for all NFTs',
    icon: '💰',
    color: 'bg-blue-500'
  },
  {
    id: 'auction',
    name: 'Auction',
    description: 'Let buyers bid on your NFTs',
    icon: '🔨',
    color: 'bg-yellow-500'
  },
  {
    id: 'dutch',
    name: 'Dutch Auction',
    description: 'Start high, decrease over time',
    icon: '📉',
    color: 'bg-red-500'
  },
  {
    id: 'dynamic',
    name: 'Dynamic Pricing',
    description: 'Adjust price based on demand',
    icon: '📊',
    color: 'bg-green-500'
  }
]

const CURRENCIES = [
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
  { id: 'USDC', name: 'USD Coin', symbol: 'USDC', icon: '$' },
  { id: 'USDT', name: 'Tether', symbol: 'USDT', icon: '$' }
]

export default function PricingStrategy({
  trackId,
  onStrategyUpdate,
  initialStrategy
}: PricingStrategyProps) {
  const [strategy, setStrategy] = useState<PricingStrategy>({
    id: `strategy-${Date.now()}`,
    name: 'My Pricing Strategy',
    type: 'fixed',
    basePrice: 0.1,
    currency: 'ETH',
    supply: 100,
    isActive: true,
    conditions: []
  })
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [simulations, setSimulations] = useState<PricingSimulation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'strategy' | 'conditions' | 'simulation' | 'analytics'>('strategy')

  useEffect(() => {
    if (initialStrategy) {
      setStrategy(initialStrategy)
    }
    loadMarketData()
  }, [trackId, initialStrategy])

  const loadMarketData = async () => {
    setIsLoading(true)
    try {
      // Mock implementation - in real app, this would call your API
      const mockMarketData: MarketData = {
        averagePrice: 0.15,
        floorPrice: 0.05,
        volume24h: 125.5,
        sales24h: 250,
        trend: 'up',
        volatility: 0.12
      }

      const mockSimulations: PricingSimulation[] = [
        {
          scenario: 'Conservative',
          price: 0.08,
          sales: 75,
          revenue: 6.0,
          marketShare: 15
        },
        {
          scenario: 'Moderate',
          price: 0.12,
          sales: 60,
          revenue: 7.2,
          marketShare: 20
        },
        {
          scenario: 'Aggressive',
          price: 0.20,
          sales: 40,
          revenue: 8.0,
          marketShare: 25
        }
      ]

      setMarketData(mockMarketData)
      setSimulations(mockSimulations)
    } catch (error) {
      console.error('Failed to load market data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStrategyChange = (field: keyof PricingStrategy, value: any) => {
    const newStrategy = { ...strategy, [field]: value }
    setStrategy(newStrategy)
    onStrategyUpdate?.(newStrategy)
  }

  const handleConditionAdd = () => {
    const newCondition: PricingCondition = {
      id: `condition-${Date.now()}`,
      type: 'play_count',
      operator: 'greater_than',
      value: 1000,
      action: 'increase_price',
      multiplier: 1.1,
      isActive: true
    }
    
    setStrategy(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }))
  }

  const handleConditionChange = (conditionId: string, field: keyof PricingCondition, value: any) => {
    setStrategy(prev => ({
      ...prev,
      conditions: prev.conditions.map(condition =>
        condition.id === conditionId ? { ...condition, [field]: value } : condition
      )
    }))
  }

  const handleConditionRemove = (conditionId: string) => {
    setStrategy(prev => ({
      ...prev,
      conditions: prev.conditions.filter(condition => condition.id !== conditionId)
    }))
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

  const getStrategyIcon = (type: string) => {
    return STRATEGY_TYPES.find(s => s.id === type)?.icon || '💰'
  }

  const getStrategyColor = (type: string) => {
    return STRATEGY_TYPES.find(s => s.id === type)?.color || 'bg-gray-500'
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
          <h2 className="text-2xl font-bold text-gray-900">Pricing Strategy</h2>
          <p className="text-gray-600">Optimize your NFT pricing for maximum revenue</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onStrategyUpdate?.(strategy)}
            className="btn-primary"
          >
            Save Strategy
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'strategy', label: 'Strategy', icon: '⚙️' },
            { id: 'conditions', label: 'Conditions', icon: '📋' },
            { id: 'simulation', label: 'Simulation', icon: '🎯' },
            { id: 'analytics', label: 'Analytics', icon: '📊' }
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
        {activeTab === 'strategy' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strategy Type */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategy Type</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STRATEGY_TYPES.map(type => (
                  <div
                    key={type.id}
                    onClick={() => handleStrategyChange('type', type.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      strategy.type === type.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <h4 className="font-medium text-gray-900">{type.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strategy Name
                  </label>
                  <input
                    type="text"
                    value={strategy.name}
                    onChange={(e) => handleStrategyChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="My Pricing Strategy"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Price
                    </label>
                    <input
                      type="number"
                      value={strategy.basePrice}
                      onChange={(e) => handleStrategyChange('basePrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0.1"
                      step="0.001"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={strategy.currency}
                      onChange={(e) => handleStrategyChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {CURRENCIES.map(currency => (
                        <option key={currency.id} value={currency.id}>
                          {currency.symbol} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supply
                  </label>
                  <input
                    type="number"
                    value={strategy.supply}
                    onChange={(e) => handleStrategyChange('supply', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="100"
                    min="1"
                  />
                </div>

                {strategy.type === 'dynamic' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Price
                      </label>
                      <input
                        type="number"
                        value={strategy.minPrice || 0}
                        onChange={(e) => handleStrategyChange('minPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0.01"
                        step="0.001"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Price
                      </label>
                      <input
                        type="number"
                        value={strategy.maxPrice || 0}
                        onChange={(e) => handleStrategyChange('maxPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="1.0"
                        step="0.001"
                        min="0"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conditions' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pricing Conditions</h3>
              <button
                onClick={handleConditionAdd}
                className="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
              >
                Add Condition
              </button>
            </div>

            <div className="space-y-4">
              {strategy.conditions.map((condition, index) => (
                <div key={condition.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condition Type
                      </label>
                      <select
                        value={condition.type}
                        onChange={(e) => handleConditionChange(condition.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      >
                        <option value="play_count">Play Count</option>
                        <option value="follower_count">Follower Count</option>
                        <option value="revenue_threshold">Revenue Threshold</option>
                        <option value="time_based">Time Based</option>
                        <option value="market_cap">Market Cap</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operator
                      </label>
                      <select
                        value={condition.operator}
                        onChange={(e) => handleConditionChange(condition.id, 'operator', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      >
                        <option value="greater_than">Greater Than</option>
                        <option value="less_than">Less Than</option>
                        <option value="equals">Equals</option>
                        <option value="between">Between</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      <input
                        type="number"
                        value={condition.value}
                        onChange={(e) => handleConditionChange(condition.id, 'value', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        placeholder="1000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Action
                      </label>
                      <select
                        value={condition.action}
                        onChange={(e) => handleConditionChange(condition.id, 'action', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      >
                        <option value="increase_price">Increase Price</option>
                        <option value="decrease_price">Decrease Price</option>
                        <option value="change_supply">Change Supply</option>
                        <option value="pause_sale">Pause Sale</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={condition.isActive}
                          onChange={(e) => handleConditionChange(condition.id, 'isActive', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Active</span>
                      </label>
                    </div>
                    
                    <button
                      onClick={() => handleConditionRemove(condition.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {strategy.conditions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>No conditions set</p>
                  <p className="text-sm">Add conditions to automatically adjust pricing</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'simulation' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Simulations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {simulations.map((sim, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{sim.scenario}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-medium">{formatCurrency(sim.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sales:</span>
                        <span className="font-medium">{sim.sales}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Revenue:</span>
                        <span className="font-medium">{formatCurrency(sim.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Market Share:</span>
                        <span className="font-medium">{sim.marketShare}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && marketData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-900">{formatCurrency(marketData.averagePrice)}</div>
                <div className="text-sm text-blue-600">Average Price</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-900">{formatCurrency(marketData.floorPrice)}</div>
                <div className="text-sm text-green-600">Floor Price</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-900">{formatCurrency(marketData.volume24h)}</div>
                <div className="text-sm text-purple-600">24h Volume</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-900">{formatNumber(marketData.sales24h)}</div>
                <div className="text-sm text-yellow-600">24h Sales</div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Trend Analysis</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      marketData.trend === 'up' 
                        ? 'bg-green-100 text-green-800'
                        : marketData.trend === 'down'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {marketData.trend === 'up' ? '↗️' : marketData.trend === 'down' ? '↘️' : '→'} {marketData.trend}
                    </span>
                    <span className="text-sm text-gray-500">Market trend</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Volatility</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${marketData.volatility * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{(marketData.volatility * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
