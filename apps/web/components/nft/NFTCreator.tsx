'use client'

import React, { useState, useEffect } from 'react'
import { Track } from '../../lib/core/types'

interface NFTCreatorProps {
  track: Track
  onNFTCreated?: (nft: NFT) => void
  onCancel?: () => void
}

interface NFT {
  id: string
  trackId: string
  title: string
  description: string
  imageUrl: string
  animationUrl?: string
  price: number
  currency: 'ETH' | 'USDC' | 'USDT'
  supply: number
  royaltyPercentage: number
  attributes: NFTAttribute[]
  metadata: NFTMetadata
  contractAddress: string
  tokenId: string
  transactionHash: string
  createdAt: number
}

interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: 'string' | 'number' | 'date' | 'boost_number' | 'boost_percentage'
}

interface NFTMetadata {
  name: string
  description: string
  image: string
  animation_url?: string
  external_url?: string
  attributes: NFTAttribute[]
  properties?: Record<string, any>
}

interface PricingTier {
  id: string
  name: string
  price: number
  supply: number
  description: string
  benefits: string[]
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'common',
    name: 'Common',
    price: 0.01,
    supply: 1000,
    description: 'Standard edition',
    benefits: ['Basic ownership', 'Streaming rights']
  },
  {
    id: 'rare',
    name: 'Rare',
    price: 0.05,
    supply: 100,
    description: 'Limited edition',
    benefits: ['Exclusive artwork', 'Early access', 'Special badge']
  },
  {
    id: 'epic',
    name: 'Epic',
    price: 0.1,
    supply: 50,
    description: 'Premium edition',
    benefits: ['Unique artwork', 'Artist signature', 'VIP access', 'Merchandise']
  },
  {
    id: 'legendary',
    name: 'Legendary',
    price: 0.5,
    supply: 10,
    description: 'Ultra rare edition',
    benefits: ['One-of-a-kind artwork', 'Personal message', 'Exclusive content', 'Meet & greet']
  }
]

export default function NFTCreator({ track, onNFTCreated, onCancel }: NFTCreatorProps) {
  const [selectedTier, setSelectedTier] = useState<PricingTier>(PRICING_TIERS[0])
  const [customPrice, setCustomPrice] = useState<number>(0)
  const [customSupply, setCustomSupply] = useState<number>(1)
  const [useCustomPricing, setUseCustomPricing] = useState(false)
  const [nftData, setNftData] = useState({
    title: track.title,
    description: `NFT for "${track.title}" by ${track.artist}`,
    imageUrl: '',
    animationUrl: '',
    royaltyPercentage: 10,
    attributes: [] as NFTAttribute[]
  })
  const [isCreating, setIsCreating] = useState(false)
  const [step, setStep] = useState<'pricing' | 'metadata' | 'preview' | 'minting'>('pricing')

  const handleAttributeAdd = () => {
    setNftData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }]
    }))
  }

  const handleAttributeChange = (index: number, field: keyof NFTAttribute, value: string | number) => {
    setNftData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }))
  }

  const handleAttributeRemove = (index: number) => {
    setNftData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }))
  }

  const handleCreateNFT = async () => {
    setIsCreating(true)
    setStep('minting')
    
    try {
      // Mock NFT creation - in real app, this would interact with smart contracts
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const nft: NFT = {
        id: `nft-${Date.now()}`,
        trackId: track.id,
        title: nftData.title,
        description: nftData.description,
        imageUrl: nftData.imageUrl || `https://via.placeholder.com/400x400?text=${encodeURIComponent(track.title)}`,
        animationUrl: nftData.animationUrl,
        price: useCustomPricing ? customPrice : selectedTier.price,
        currency: 'ETH',
        supply: useCustomPricing ? customSupply : selectedTier.supply,
        royaltyPercentage: nftData.royaltyPercentage,
        attributes: nftData.attributes,
        metadata: {
          name: nftData.title,
          description: nftData.description,
          image: nftData.imageUrl || `https://via.placeholder.com/400x400?text=${encodeURIComponent(track.title)}`,
          animation_url: nftData.animationUrl,
          external_url: `${window.location.origin}/track/${track.id}`,
          attributes: nftData.attributes,
          properties: {
            track_id: track.id,
            artist: track.artist,
            genre: track.genre,
            created_at: Date.now()
          }
        },
        contractAddress: '0x1234567890123456789012345678901234567890',
        tokenId: Math.floor(Math.random() * 1000000).toString(),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        createdAt: Date.now()
      }
      
      onNFTCreated?.(nft)
    } catch (error) {
      console.error('Failed to create NFT:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(3)} ETH`
  }

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case 'common':
        return 'border-gray-300 bg-gray-50'
      case 'rare':
        return 'border-blue-300 bg-blue-50'
      case 'epic':
        return 'border-purple-300 bg-purple-50'
      case 'legendary':
        return 'border-yellow-300 bg-yellow-50'
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'common':
        return '🥉'
      case 'rare':
        return '🥈'
      case 'epic':
        return '🥇'
      case 'legendary':
        return '💎'
      default:
        return '🎵'
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create NFT</h2>
            <p className="text-sm text-gray-500">Turn your track into a collectible NFT</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          {[
            { id: 'pricing', label: 'Pricing', icon: '💰' },
            { id: 'metadata', label: 'Metadata', icon: '📝' },
            { id: 'preview', label: 'Preview', icon: '👁️' },
            { id: 'minting', label: 'Minting', icon: '⚡' }
          ].map((stepItem, index) => (
            <div key={stepItem.id} className="flex items-center">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                step === stepItem.id
                  ? 'bg-primary-100 text-primary-700'
                  : index < ['pricing', 'metadata', 'preview', 'minting'].indexOf(step)
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <span>{stepItem.icon}</span>
                <span>{stepItem.label}</span>
              </div>
              {index < 3 && (
                <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {step === 'pricing' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Pricing Tier</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PRICING_TIERS.map(tier => (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTier.id === tier.id
                        ? 'border-primary-500 bg-primary-50'
                        : getTierColor(tier.id)
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{getTierIcon(tier.id)}</div>
                      <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(tier.price)}</p>
                      <p className="text-sm text-gray-500 mt-1">{tier.supply} supply</p>
                      <p className="text-xs text-gray-600 mt-2">{tier.description}</p>
                      <ul className="text-xs text-gray-500 mt-3 space-y-1">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Pricing */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="customPricing"
                  checked={useCustomPricing}
                  onChange={(e) => setUseCustomPricing(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="customPricing" className="text-sm font-medium text-gray-900">
                  Use custom pricing
                </label>
              </div>

              {useCustomPricing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (ETH)
                    </label>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0.01"
                      step="0.001"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supply
                    </label>
                    <input
                      type="number"
                      value={customSupply}
                      onChange={(e) => setCustomSupply(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="1"
                      min="1"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep('metadata')}
                className="btn-primary"
              >
                Next: Metadata
              </button>
            </div>
          </div>
        )}

        {step === 'metadata' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">NFT Metadata</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={nftData.title}
                    onChange={(e) => setNftData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="NFT Title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Royalty Percentage
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={nftData.royaltyPercentage}
                      onChange={(e) => setNftData(prev => ({ ...prev, royaltyPercentage: parseInt(e.target.value) || 0 }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="10"
                      min="0"
                      max="50"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={nftData.description}
                  onChange={(e) => setNftData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe your NFT..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={nftData.imageUrl}
                    onChange={(e) => setNftData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Animation URL
                  </label>
                  <input
                    type="url"
                    value={nftData.animationUrl}
                    onChange={(e) => setNftData(prev => ({ ...prev, animationUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/animation.mp4"
                  />
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">Attributes</h4>
                <button
                  onClick={handleAttributeAdd}
                  className="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
                >
                  Add Attribute
                </button>
              </div>

              <div className="space-y-3">
                {nftData.attributes.map((attr, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={attr.trait_type}
                      onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                      placeholder="Trait Type"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      onClick={() => handleAttributeRemove(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('pricing')}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                onClick={() => setStep('preview')}
                className="btn-primary"
              >
                Next: Preview
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview NFT</h3>
              
              <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* NFT Image */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {nftData.imageUrl ? (
                    <img
                      src={nftData.imageUrl}
                      alt={nftData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p>No image</p>
                    </div>
                  )}
                </div>

                {/* NFT Info */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{nftData.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{nftData.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(useCustomPricing ? customPrice : selectedTier.price)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {useCustomPricing ? customSupply : selectedTier.supply} supply
                    </span>
                  </div>

                  {nftData.attributes.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">Attributes</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {nftData.attributes.map((attr, index) => (
                          <div key={index} className="bg-gray-50 rounded p-2">
                            <p className="text-xs text-gray-500">{attr.trait_type}</p>
                            <p className="text-sm font-medium text-gray-900">{attr.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('metadata')}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                onClick={handleCreateNFT}
                className="btn-primary"
              >
                Create NFT
              </button>
            </div>
          </div>
        )}

        {step === 'minting' && (
          <div className="text-center py-12">
            {isCreating ? (
              <div>
                <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating NFT...</h3>
                <p className="text-gray-500">This may take a few minutes</p>
              </div>
            ) : (
              <div>
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">NFT Created Successfully!</h3>
                <p className="text-gray-500">Your NFT is now live on the blockchain</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
