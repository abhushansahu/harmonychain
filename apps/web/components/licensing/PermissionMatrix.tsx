'use client'

import React, { useState, useEffect } from 'react'

interface PermissionMatrixProps {
  trackId: string
  onPermissionsUpdate?: (permissions: PermissionMatrix) => void
  initialPermissions?: PermissionMatrix
}

interface PermissionMatrix {
  id: string
  trackId: string
  permissions: Permission[]
  restrictions: Restriction[]
  pricing: PricingMatrix
  isActive: boolean
  createdAt: number
  updatedAt: number
}

interface Permission {
  id: string
  name: string
  description: string
  category: 'usage' | 'distribution' | 'performance' | 'derivative' | 'commercial'
  type: 'streaming' | 'download' | 'sync' | 'performance' | 'mechanical' | 'derivative' | 'commercial'
  isIncluded: boolean
  additionalFee?: number
  conditions?: PermissionCondition[]
  isRequired: boolean
  isExclusive: boolean
}

interface PermissionCondition {
  id: string
  type: 'geographic' | 'time' | 'platform' | 'usage_limit' | 'attribution'
  value: string
  isActive: boolean
}

interface Restriction {
  id: string
  name: string
  description: string
  type: 'geographic' | 'time' | 'platform' | 'usage' | 'distribution' | 'commercial'
  value: string
  isActive: boolean
  severity: 'warning' | 'blocking' | 'conditional'
}

interface PricingMatrix {
  basePrice: number
  currency: 'ETH' | 'USDC' | 'USDT'
  pricingModel: 'fixed' | 'percentage' | 'tiered' | 'dynamic'
  tiers?: PricingTier[]
  percentage?: number
  minimumFee?: number
  maximumFee?: number
  discounts?: Discount[]
}

interface PricingTier {
  id: string
  name: string
  minQuantity: number
  maxQuantity?: number
  price: number
  description: string
}

interface Discount {
  id: string
  name: string
  type: 'percentage' | 'fixed'
  value: number
  conditions: DiscountCondition[]
  isActive: boolean
}

interface DiscountCondition {
  id: string
  type: 'volume' | 'duration' | 'exclusivity' | 'territory'
  value: string
  operator: 'greater_than' | 'less_than' | 'equals' | 'contains'
}

const PERMISSION_CATEGORIES = [
  {
    id: 'usage',
    name: 'Usage Rights',
    description: 'Basic usage permissions',
    icon: '🎵',
    color: 'bg-blue-500'
  },
  {
    id: 'distribution',
    name: 'Distribution',
    description: 'Distribution and sharing rights',
    icon: '📤',
    color: 'bg-green-500'
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Live performance rights',
    icon: '🎤',
    color: 'bg-purple-500'
  },
  {
    id: 'derivative',
    name: 'Derivative Works',
    description: 'Remix and adaptation rights',
    icon: '🎨',
    color: 'bg-yellow-500'
  },
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'Commercial usage rights',
    icon: '💼',
    color: 'bg-red-500'
  }
]

const PERMISSION_TYPES = [
  {
    id: 'streaming',
    name: 'Streaming',
    description: 'Online streaming and playback',
    category: 'usage',
    icon: '📺'
  },
  {
    id: 'download',
    name: 'Download',
    description: 'Download for personal use',
    category: 'usage',
    icon: '⬇️'
  },
  {
    id: 'sync',
    name: 'Synchronization',
    description: 'Sync with video content',
    category: 'commercial',
    icon: '🎬'
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Live performance rights',
    category: 'performance',
    icon: '🎤'
  },
  {
    id: 'mechanical',
    name: 'Mechanical',
    description: 'Reproduction and distribution',
    category: 'distribution',
    icon: '💿'
  },
  {
    id: 'derivative',
    name: 'Derivative Works',
    description: 'Create remixes and adaptations',
    category: 'derivative',
    icon: '🎨'
  },
  {
    id: 'commercial',
    name: 'Commercial Use',
    description: 'Commercial and business use',
    category: 'commercial',
    icon: '💼'
  }
]

const RESTRICTION_TYPES = [
  {
    id: 'geographic',
    name: 'Geographic',
    description: 'Geographic limitations',
    icon: '🌍'
  },
  {
    id: 'time',
    name: 'Time',
    description: 'Time-based limitations',
    icon: '⏰'
  },
  {
    id: 'platform',
    name: 'Platform',
    description: 'Platform-specific restrictions',
    icon: '💻'
  },
  {
    id: 'usage',
    name: 'Usage',
    description: 'Usage limitations',
    icon: '📊'
  },
  {
    id: 'distribution',
    name: 'Distribution',
    description: 'Distribution restrictions',
    icon: '📤'
  },
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'Commercial use restrictions',
    icon: '💼'
  }
]

export default function PermissionMatrix({
  trackId,
  onPermissionsUpdate,
  initialPermissions
}: PermissionMatrixProps) {
  const [permissions, setPermissions] = useState<PermissionMatrix>({
    id: `matrix-${Date.now()}`,
    trackId: trackId,
    permissions: [],
    restrictions: [],
    pricing: {
      basePrice: 0.1,
      currency: 'ETH',
      pricingModel: 'fixed'
    },
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('usage')
  const [showAddPermission, setShowAddPermission] = useState(false)
  const [showAddRestriction, setShowAddRestriction] = useState(false)

  useEffect(() => {
    if (initialPermissions) {
      setPermissions(initialPermissions)
    } else {
      loadDefaultPermissions()
    }
    setIsLoading(false)
  }, [trackId, initialPermissions])

  const loadDefaultPermissions = () => {
    const defaultPermissions: Permission[] = PERMISSION_TYPES.map(type => ({
      id: type.id,
      name: type.name,
      description: type.description,
      category: type.category as any,
      type: type.id as any,
      isIncluded: ['streaming', 'download'].includes(type.id),
      additionalFee: type.id === 'sync' ? 0.1 : undefined,
      conditions: [],
      isRequired: false,
      isExclusive: false
    }))

    const defaultRestrictions: Restriction[] = [
      {
        id: 'geo-1',
        name: 'Geographic Restriction',
        description: 'Limited to specific regions',
        type: 'geographic',
        value: 'North America',
        isActive: true,
        severity: 'blocking'
      },
      {
        id: 'time-1',
        name: 'Time Restriction',
        description: 'Valid for limited time',
        type: 'time',
        value: '365 days',
        isActive: true,
        severity: 'warning'
      }
    ]

    setPermissions(prev => ({
      ...prev,
      permissions: defaultPermissions,
      restrictions: defaultRestrictions
    }))
  }

  const handlePermissionToggle = (permissionId: string) => {
    setPermissions(prev => ({
      ...prev,
      permissions: prev.permissions.map(perm =>
        perm.id === permissionId ? { ...perm, isIncluded: !perm.isIncluded } : perm
      ),
      updatedAt: Date.now()
    }))
  }

  const handlePermissionUpdate = (permissionId: string, field: keyof Permission, value: any) => {
    setPermissions(prev => ({
      ...prev,
      permissions: prev.permissions.map(perm =>
        perm.id === permissionId ? { ...perm, [field]: value } : perm
      ),
      updatedAt: Date.now()
    }))
  }

  const handleRestrictionToggle = (restrictionId: string) => {
    setPermissions(prev => ({
      ...prev,
      restrictions: prev.restrictions.map(restriction =>
        restriction.id === restrictionId ? { ...restriction, isActive: !restriction.isActive } : restriction
      ),
      updatedAt: Date.now()
    }))
  }

  const handleRestrictionUpdate = (restrictionId: string, field: keyof Restriction, value: any) => {
    setPermissions(prev => ({
      ...prev,
      restrictions: prev.restrictions.map(restriction =>
        restriction.id === restrictionId ? { ...restriction, [field]: value } : restriction
      ),
      updatedAt: Date.now()
    }))
  }

  const handlePricingUpdate = (field: keyof PricingMatrix, value: any) => {
    setPermissions(prev => ({
      ...prev,
      pricing: { ...prev.pricing, [field]: value },
      updatedAt: Date.now()
    }))
  }

  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(3)} ETH`
  }

  const getCategoryColor = (categoryId: string) => {
    const category = PERMISSION_CATEGORIES.find(c => c.id === categoryId)
    return category?.color || 'bg-gray-500'
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = PERMISSION_CATEGORIES.find(c => c.id === categoryId)
    return category?.icon || '📝'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'blocking':
        return 'bg-red-100 text-red-800'
      case 'conditional':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPermissions = permissions.permissions.filter(perm => 
    activeCategory === 'all' || perm.category === activeCategory
  )

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
          <h2 className="text-2xl font-bold text-gray-900">Permission Matrix</h2>
          <p className="text-gray-600">Configure detailed permissions and restrictions</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAddPermission(true)}
            className="btn-secondary"
          >
            Add Permission
          </button>
          <button
            onClick={() => setShowAddRestriction(true)}
            className="btn-primary"
          >
            Add Restriction
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeCategory === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Categories
          </button>
          {PERMISSION_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeCategory === category.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Permissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Permissions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
          <div className="space-y-4">
            {filteredPermissions.map(permission => (
              <div key={permission.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={permission.isIncluded}
                      onChange={() => handlePermissionToggle(permission.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{permission.name}</h4>
                      <p className="text-sm text-gray-500">{permission.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {permission.isRequired && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                    {permission.isExclusive && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Exclusive
                      </span>
                    )}
                  </div>
                </div>

                {permission.isIncluded && (
                  <div className="space-y-3">
                    {permission.additionalFee && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Additional Fee</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(permission.additionalFee)}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={permission.isRequired}
                            onChange={(e) => handlePermissionUpdate(permission.id, 'isRequired', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Required</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={permission.isExclusive}
                            onChange={(e) => handlePermissionUpdate(permission.id, 'isExclusive', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Exclusive</span>
                        </label>
                      </div>
                    </div>

                    {permission.conditions && permission.conditions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Conditions</h5>
                        <div className="space-y-2">
                          {permission.conditions.map(condition => (
                            <div key={condition.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{condition.type}: {condition.value}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                condition.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {condition.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Restrictions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Restrictions</h3>
          <div className="space-y-4">
            {permissions.restrictions.map(restriction => (
              <div key={restriction.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={restriction.isActive}
                      onChange={() => handleRestrictionToggle(restriction.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{restriction.name}</h4>
                      <p className="text-sm text-gray-500">{restriction.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(restriction.severity)}`}>
                      {restriction.severity}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Value</span>
                    <span className="text-sm font-medium text-gray-900">{restriction.value}</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Severity
                    </label>
                    <select
                      value={restriction.severity}
                      onChange={(e) => handleRestrictionUpdate(restriction.id, 'severity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    >
                      <option value="warning">Warning</option>
                      <option value="blocking">Blocking</option>
                      <option value="conditional">Conditional</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Price
            </label>
            <input
              type="number"
              value={permissions.pricing.basePrice}
              onChange={(e) => handlePricingUpdate('basePrice', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              step="0.001"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              value={permissions.pricing.currency}
              onChange={(e) => handlePricingUpdate('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pricing Model
            </label>
            <select
              value={permissions.pricing.pricingModel}
              onChange={(e) => handlePricingUpdate('pricingModel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="fixed">Fixed</option>
              <option value="percentage">Percentage</option>
              <option value="tiered">Tiered</option>
              <option value="dynamic">Dynamic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onPermissionsUpdate?.(permissions)}
          className="btn-primary"
        >
          Save Permission Matrix
        </button>
      </div>
    </div>
  )
}
