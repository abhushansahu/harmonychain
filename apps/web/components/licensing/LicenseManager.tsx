'use client'

import React, { useState, useEffect } from 'react'

interface LicenseManagerProps {
  trackId: string
  onLicenseUpdate?: (license: License) => void
  onLicenseRequest?: (request: LicenseRequest) => void
}

interface License {
  id: string
  trackId: string
  title: string
  description: string
  type: 'standard' | 'commercial' | 'sync' | 'performance' | 'mechanical' | 'custom'
  permissions: LicensePermission[]
  restrictions: LicenseRestriction[]
  pricing: LicensePricing
  terms: LicenseTerms
  isActive: boolean
  createdAt: number
  updatedAt: number
  totalRequests: number
  approvedRequests: number
  totalRevenue: number
}

interface LicensePermission {
  id: string
  name: string
  description: string
  type: 'streaming' | 'download' | 'sync' | 'performance' | 'mechanical' | 'derivative'
  isIncluded: boolean
  additionalFee?: number
}

interface LicenseRestriction {
  id: string
  name: string
  description: string
  type: 'geographic' | 'time' | 'platform' | 'usage' | 'distribution'
  value: string
  isActive: boolean
}

interface LicensePricing {
  basePrice: number
  currency: 'ETH' | 'USDC' | 'USDT'
  pricingModel: 'fixed' | 'percentage' | 'tiered' | 'dynamic'
  tiers?: PricingTier[]
  percentage?: number
  minimumFee?: number
  maximumFee?: number
}

interface PricingTier {
  id: string
  name: string
  minQuantity: number
  maxQuantity?: number
  price: number
  description: string
}

interface LicenseTerms {
  duration: number // in days
  territory: string[]
  exclusivity: 'exclusive' | 'non-exclusive' | 'semi-exclusive'
  renewal: 'automatic' | 'manual' | 'none'
  termination: string[]
  attribution: string
  reporting: 'monthly' | 'quarterly' | 'annually' | 'none'
}

interface LicenseRequest {
  id: string
  trackId: string
  requester: string
  requesterName: string
  requesterEmail: string
  purpose: string
  usage: string
  duration: number
  territory: string[]
  budget: number
  currency: 'ETH' | 'USDC' | 'USDT'
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  requestedAt: number
  respondedAt?: number
  expiresAt?: number
  notes?: string
  counterOffer?: CounterOffer
}

interface CounterOffer {
  id: string
  price: number
  terms: string
  expiresAt: number
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
}

const LICENSE_TYPES = [
  {
    id: 'standard',
    name: 'Standard License',
    description: 'Basic usage rights for streaming and downloads',
    icon: '📄',
    color: 'bg-blue-500'
  },
  {
    id: 'commercial',
    name: 'Commercial License',
    description: 'Full commercial usage rights',
    icon: '💼',
    color: 'bg-green-500'
  },
  {
    id: 'sync',
    name: 'Sync License',
    description: 'Synchronization with visual media',
    icon: '🎬',
    color: 'bg-purple-500'
  },
  {
    id: 'performance',
    name: 'Performance License',
    description: 'Live performance and public playing rights',
    icon: '🎤',
    color: 'bg-yellow-500'
  },
  {
    id: 'mechanical',
    name: 'Mechanical License',
    description: 'Reproduction and distribution rights',
    icon: '💿',
    color: 'bg-red-500'
  },
  {
    id: 'custom',
    name: 'Custom License',
    description: 'Customized terms and conditions',
    icon: '⚙️',
    color: 'bg-gray-500'
  }
]

const PERMISSIONS = [
  {
    id: 'streaming',
    name: 'Streaming',
    description: 'Online streaming and playback',
    type: 'streaming'
  },
  {
    id: 'download',
    name: 'Download',
    description: 'Download for personal use',
    type: 'download'
  },
  {
    id: 'sync',
    name: 'Synchronization',
    description: 'Sync with video content',
    type: 'sync'
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Live performance rights',
    type: 'performance'
  },
  {
    id: 'mechanical',
    name: 'Mechanical',
    description: 'Reproduction and distribution',
    type: 'mechanical'
  },
  {
    id: 'derivative',
    name: 'Derivative Works',
    description: 'Create remixes and adaptations',
    type: 'derivative'
  }
]

export default function LicenseManager({
  trackId,
  onLicenseUpdate,
  onLicenseRequest
}: LicenseManagerProps) {
  const [license, setLicense] = useState<License | null>(null)
  const [requests, setRequests] = useState<LicenseRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'settings' | 'analytics'>('overview')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)

  useEffect(() => {
    loadLicenseData()
  }, [trackId])

  const loadLicenseData = async () => {
    setIsLoading(true)
    try {
      // Mock implementation - in real app, this would call your API
      const mockLicense: License = {
        id: 'license-1',
        trackId: trackId,
        title: 'Standard Music License',
        description: 'Basic licensing terms for commercial use',
        type: 'standard',
        permissions: PERMISSIONS.map(perm => ({
          id: perm.id,
          name: perm.name,
          description: perm.description,
          type: perm.type as any,
          isIncluded: ['streaming', 'download'].includes(perm.id),
          additionalFee: perm.id === 'sync' ? 0.1 : undefined
        })),
        restrictions: [
          {
            id: 'geo-1',
            name: 'Geographic Restriction',
            description: 'Limited to North America',
            type: 'geographic',
            value: 'North America',
            isActive: true
          },
          {
            id: 'time-1',
            name: 'Time Restriction',
            description: 'Valid for 1 year',
            type: 'time',
            value: '365 days',
            isActive: true
          }
        ],
        pricing: {
          basePrice: 0.1,
          currency: 'ETH',
          pricingModel: 'fixed',
          minimumFee: 0.05,
          maximumFee: 1.0
        },
        terms: {
          duration: 365,
          territory: ['North America', 'Europe'],
          exclusivity: 'non-exclusive',
          renewal: 'manual',
          termination: ['Breach of terms', 'Non-payment'],
          attribution: 'Artist name must be credited',
          reporting: 'quarterly'
        },
        isActive: true,
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 3600000,
        totalRequests: 25,
        approvedRequests: 18,
        totalRevenue: 2.5
      }

      const mockRequests: LicenseRequest[] = [
        {
          id: 'req-1',
          trackId: trackId,
          requester: '0x123...',
          requesterName: 'Film Studio Inc.',
          requesterEmail: 'licensing@filmstudio.com',
          purpose: 'Film soundtrack',
          usage: 'Synchronization with video content',
          duration: 365,
          territory: ['Worldwide'],
          budget: 0.5,
          currency: 'ETH',
          status: 'pending',
          requestedAt: Date.now() - 3600000,
          notes: 'High-budget feature film'
        },
        {
          id: 'req-2',
          trackId: trackId,
          requester: '0x456...',
          requesterName: 'Radio Station',
          requesterEmail: 'programming@radiostation.com',
          purpose: 'Radio broadcasting',
          usage: 'Public performance',
          duration: 180,
          territory: ['United States'],
          budget: 0.2,
          currency: 'ETH',
          status: 'approved',
          requestedAt: Date.now() - 86400000,
          respondedAt: Date.now() - 82800000,
          expiresAt: Date.now() + 86400000 * 180
        }
      ]

      setLicense(mockLicense)
      setRequests(mockRequests)
    } catch (error) {
      console.error('Failed to load license data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLicenseUpdate = (updatedLicense: License) => {
    setLicense(updatedLicense)
    onLicenseUpdate?.(updatedLicense)
  }

  const handleRequestResponse = (requestId: string, status: 'approved' | 'rejected', notes?: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status, 
            respondedAt: Date.now(),
            notes: notes || req.notes
          }
        : req
    ))
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
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-gray-100 text-gray-800'
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
          <h2 className="text-2xl font-bold text-gray-900">License Manager</h2>
          <p className="text-gray-600">Manage licensing terms and requests</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowRequestModal(true)}
            className="btn-secondary"
          >
            Request License
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create License
          </button>
        </div>
      </div>

      {/* License Overview */}
      {license && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{license.title}</h3>
              <p className="text-gray-600">{license.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(license.pricing.basePrice)}</p>
              <p className="text-sm text-gray-500">Base Price</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-900">{license.totalRequests}</div>
              <div className="text-sm text-blue-600">Total Requests</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-900">{license.approvedRequests}</div>
              <div className="text-sm text-green-600">Approved</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-900">{formatCurrency(license.totalRevenue)}</div>
              <div className="text-sm text-purple-600">Total Revenue</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-900">
                {((license.approvedRequests / license.totalRequests) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-yellow-600">Approval Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'requests', label: 'Requests', icon: '📝' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
            { id: 'analytics', label: 'Analytics', icon: '📈' }
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
        {activeTab === 'overview' && license && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Permissions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
              <div className="space-y-3">
                {license.permissions.map(permission => (
                  <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{permission.name}</p>
                      <p className="text-sm text-gray-500">{permission.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {permission.isIncluded ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">✗</span>
                      )}
                      {permission.additionalFee && (
                        <span className="text-sm text-gray-500">
                          +{formatCurrency(permission.additionalFee)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restrictions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Restrictions</h3>
              <div className="space-y-3">
                {license.restrictions.map(restriction => (
                  <div key={restriction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{restriction.name}</p>
                      <p className="text-sm text-gray-500">{restriction.description}</p>
                      <p className="text-sm text-gray-600">{restriction.value}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {restriction.isActive ? (
                        <span className="text-red-600">⚠️</span>
                      ) : (
                        <span className="text-gray-400">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-4">
            {requests.map(request => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.requesterName}</h3>
                    <p className="text-sm text-gray-500">{request.requesterEmail}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className="text-sm text-gray-500">{formatTimeAgo(request.requestedAt)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Purpose</p>
                    <p className="font-medium text-gray-900">{request.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Usage</p>
                    <p className="font-medium text-gray-900">{request.usage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">{request.duration} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-medium text-gray-900">{formatCurrency(request.budget)}</p>
                  </div>
                </div>

                {request.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-sm text-gray-900">{request.notes}</p>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRequestResponse(request.id, 'approved')}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRequestResponse(request.id, 'rejected')}
                      className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && license && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">License Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Type
                  </label>
                  <select
                    value={license.type}
                    onChange={(e) => handleLicenseUpdate({ ...license, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {LICENSE_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price
                  </label>
                  <input
                    type="number"
                    value={license.pricing.basePrice}
                    onChange={(e) => handleLicenseUpdate({
                      ...license,
                      pricing: { ...license.pricing, basePrice: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    step="0.001"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-500">Detailed licensing analytics will be available here</p>
          </div>
        )}
      </div>
    </div>
  )
}
