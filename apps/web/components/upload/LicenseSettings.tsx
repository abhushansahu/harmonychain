'use client'

import React, { useState } from 'react'

interface LicenseSettingsProps {
  onLicenseChange: (license: LicenseSettings) => void
  initialLicense?: LicenseSettings
  isLoading?: boolean
}

export interface LicenseSettings {
  type: 'free' | 'commercial' | 'custom'
  price: number
  currency: 'ETH' | 'USDC' | 'USDT'
  royaltyPercentage: number
  commercialUse: boolean
  derivativeWorks: boolean
  distribution: boolean
  performance: boolean
  synchronization: boolean
  attribution: boolean
  shareAlike: boolean
  nonCommercial: boolean
  noDerivatives: boolean
  customTerms?: string
  expirationDate?: string
  territories: string[]
  platforms: string[]
}

export interface TrackMetadata {
  title: string
  artist: string
  album?: string
  genre: string
  year: number
  duration: number
  description?: string
  tags: string[]
  artwork?: string
  audioFile: string
  license: LicenseSettings
}

const LICENSE_TYPES = [
  {
    id: 'free',
    name: 'Free License',
    description: 'Allow free use with attribution',
    icon: '🎵'
  },
  {
    id: 'commercial',
    name: 'Commercial License',
    description: 'Charge for commercial use',
    icon: '💰'
  },
  {
    id: 'custom',
    name: 'Custom License',
    description: 'Define your own terms',
    icon: '⚖️'
  }
]

const CURRENCIES = [
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH' },
  { id: 'USDC', name: 'USD Coin', symbol: 'USDC' },
  { id: 'USDT', name: 'Tether', symbol: 'USDT' }
]

const TERRITORIES = [
  'Worldwide', 'North America', 'Europe', 'Asia', 'South America',
  'Africa', 'Oceania', 'United States', 'Canada', 'United Kingdom',
  'Germany', 'France', 'Japan', 'China', 'India', 'Brazil'
]

const PLATFORMS = [
  'Streaming Services', 'Radio', 'TV', 'Film', 'Commercials',
  'Video Games', 'Podcasts', 'Social Media', 'Live Performance',
  'Background Music', 'Sync Licensing'
]

export default function LicenseSettings({
  onLicenseChange,
  initialLicense,
  isLoading = false
}: LicenseSettingsProps) {
  const [license, setLicense] = useState<LicenseSettings>({
    type: 'free',
    price: 0,
    currency: 'ETH',
    royaltyPercentage: 10,
    commercialUse: true,
    derivativeWorks: true,
    distribution: true,
    performance: true,
    synchronization: true,
    attribution: true,
    shareAlike: false,
    nonCommercial: false,
    noDerivatives: false,
    territories: ['Worldwide'],
    platforms: ['Streaming Services']
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  React.useEffect(() => {
    if (initialLicense) {
      setLicense(initialLicense)
    }
  }, [initialLicense])

  const handleLicenseChange = (field: keyof LicenseSettings, value: any) => {
    const newLicense = { ...license, [field]: value }
    setLicense(newLicense)
    onLicenseChange(newLicense)
    
    // Clear error when user makes changes
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleTerritoryToggle = (territory: string) => {
    const newTerritories = license.territories.includes(territory)
      ? license.territories.filter(t => t !== territory)
      : [...license.territories, territory]
    
    handleLicenseChange('territories', newTerritories)
  }

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = license.platforms.includes(platform)
      ? license.platforms.filter(p => p !== platform)
      : [...license.platforms, platform]
    
    handleLicenseChange('platforms', newPlatforms)
  }

  const validateLicense = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (license.type === 'commercial' && license.price <= 0) {
      newErrors.price = 'Price must be greater than 0 for commercial licenses'
    }

    if (license.royaltyPercentage < 0 || license.royaltyPercentage > 100) {
      newErrors.royaltyPercentage = 'Royalty percentage must be between 0 and 100'
    }

    if (license.territories.length === 0) {
      newErrors.territories = 'At least one territory must be selected'
    }

    if (license.platforms.length === 0) {
      newErrors.platforms = 'At least one platform must be selected'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getLicenseTypeInfo = (type: string) => {
    return LICENSE_TYPES.find(lt => lt.id === type) || LICENSE_TYPES[0]
  }

  return (
    <div className="space-y-6">
      {/* License Type Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">License Type</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LICENSE_TYPES.map(type => (
            <div
              key={type.id}
              onClick={() => handleLicenseChange('type', type.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                license.type === type.id
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

      {/* Commercial License Settings */}
      {license.type === 'commercial' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={license.price}
                  onChange={(e) => handleLicenseChange('price', parseFloat(e.target.value) || 0)}
                  className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.1"
                  step="0.01"
                  min="0"
                />
                <select
                  value={license.currency}
                  onChange={(e) => handleLicenseChange('currency', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {CURRENCIES.map(currency => (
                    <option key={currency.id} value={currency.id}>
                      {currency.symbol}
                    </option>
                  ))}
                </select>
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Royalty Percentage
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={license.royaltyPercentage}
                  onChange={(e) => handleLicenseChange('royaltyPercentage', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.royaltyPercentage ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="10"
                  min="0"
                  max="100"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
              {errors.royaltyPercentage && <p className="mt-1 text-sm text-red-600">{errors.royaltyPercentage}</p>}
            </div>
          </div>
        </div>
      )}

      {/* License Permissions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Allowed Uses</h4>
            
            {[
              { key: 'commercialUse', label: 'Commercial Use', description: 'Allow commercial use of the track' },
              { key: 'derivativeWorks', label: 'Derivative Works', description: 'Allow creation of derivative works' },
              { key: 'distribution', label: 'Distribution', description: 'Allow distribution of the track' },
              { key: 'performance', label: 'Performance', description: 'Allow public performance' },
              { key: 'synchronization', label: 'Synchronization', description: 'Allow sync with visual media' }
            ].map(permission => (
              <div key={permission.key} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={permission.key}
                  checked={license[permission.key as keyof LicenseSettings] as boolean}
                  onChange={(e) => handleLicenseChange(permission.key as keyof LicenseSettings, e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                />
                <div>
                  <label htmlFor={permission.key} className="text-sm font-medium text-gray-900">
                    {permission.label}
                  </label>
                  <p className="text-xs text-gray-500">{permission.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Requirements</h4>
            
            {[
              { key: 'attribution', label: 'Attribution Required', description: 'Require attribution to the original artist' },
              { key: 'shareAlike', label: 'Share Alike', description: 'Require derivative works to use the same license' },
              { key: 'nonCommercial', label: 'Non-Commercial Only', description: 'Restrict to non-commercial use only' },
              { key: 'noDerivatives', label: 'No Derivatives', description: 'Prohibit creation of derivative works' }
            ].map(requirement => (
              <div key={requirement.key} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={requirement.key}
                  checked={license[requirement.key as keyof LicenseSettings] as boolean}
                  onChange={(e) => handleLicenseChange(requirement.key as keyof LicenseSettings, e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                />
                <div>
                  <label htmlFor={requirement.key} className="text-sm font-medium text-gray-900">
                    {requirement.label}
                  </label>
                  <p className="text-xs text-gray-500">{requirement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Territories */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Territories</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {TERRITORIES.map(territory => (
            <button
              key={territory}
              onClick={() => handleTerritoryToggle(territory)}
              className={`text-sm px-3 py-2 rounded-md border transition-colors ${
                license.territories.includes(territory)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
              }`}
            >
              {territory}
            </button>
          ))}
        </div>
        {errors.territories && <p className="mt-2 text-sm text-red-600">{errors.territories}</p>}
      </div>

      {/* Platforms */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platforms</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {PLATFORMS.map(platform => (
            <button
              key={platform}
              onClick={() => handlePlatformToggle(platform)}
              className={`text-sm px-3 py-2 rounded-md border transition-colors ${
                license.platforms.includes(platform)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
        {errors.platforms && <p className="mt-2 text-sm text-red-600">{errors.platforms}</p>}
      </div>

      {/* Custom Terms */}
      {license.type === 'custom' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Terms</h3>
          
          <textarea
            value={license.customTerms || ''}
            onChange={(e) => handleLicenseChange('customTerms', e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Define your custom licensing terms here..."
          />
        </div>
      )}

      {/* Expiration Date */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expiration</h3>
        
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            id="hasExpiration"
            checked={!!license.expirationDate}
            onChange={(e) => {
              if (e.target.checked) {
                const nextYear = new Date()
                nextYear.setFullYear(nextYear.getFullYear() + 1)
                handleLicenseChange('expirationDate', nextYear.toISOString().split('T')[0])
              } else {
                handleLicenseChange('expirationDate', undefined)
              }
            }}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="hasExpiration" className="text-sm font-medium text-gray-900">
            License expires
          </label>
          
          {license.expirationDate && (
            <input
              type="date"
              value={license.expirationDate}
              onChange={(e) => handleLicenseChange('expirationDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          )}
        </div>
      </div>

      {/* License Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">License Summary</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium">{getLicenseTypeInfo(license.type).name}</span>
          </div>
          
          {license.type === 'commercial' && (
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">{license.price} {license.currency}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600">Royalty:</span>
            <span className="font-medium">{license.royaltyPercentage}%</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Territories:</span>
            <span className="font-medium">{license.territories.length} selected</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Platforms:</span>
            <span className="font-medium">{license.platforms.length} selected</span>
          </div>
          
          {license.expirationDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Expires:</span>
              <span className="font-medium">{new Date(license.expirationDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
