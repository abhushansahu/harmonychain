'use client'

import React, { useState } from 'react'
import { Track, NFTCreationForm } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Upload, Image, Music, DollarSign, Percent, Crown } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface NFTCreatorProps {
  tracks: Track[]
  onCreateNFT: (form: NFTCreationForm) => void
  className?: string
}

const NFTCreator: React.FC<NFTCreatorProps> = ({ tracks, onCreateNFT, className }) => {
  const [form, setForm] = useState<NFTCreationForm>({
    trackId: '',
    name: '',
    description: '',
    price: 0,
    royaltyPercentage: 10,
    exclusiveContent: ''
  })

  const [step, setStep] = useState(1)
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleTrackSelect = (track: Track) => {
    setSelectedTrack(track)
    setForm(prev => ({
      ...prev,
      trackId: track.id,
      name: `${track.title} - NFT Edition`,
      description: `Exclusive NFT version of "${track.title}" by ${track.artist}`
    }))
  }

  const handleInputChange = (field: keyof NFTCreationForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsCreating(true)
    try {
      await onCreateNFT(form)
      // Reset form after successful creation
      setForm({
        trackId: '',
        name: '',
        description: '',
        price: 0,
        royaltyPercentage: 10,
        exclusiveContent: ''
      })
      setStep(1)
      setSelectedTrack(null)
    } catch (error) {
      console.error('Error creating NFT:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const steps = [
    { id: 1, name: 'Select Track', icon: Music },
    { id: 2, name: 'NFT Details', icon: Image },
    { id: 3, name: 'Pricing', icon: DollarSign },
    { id: 4, name: 'Review', icon: Crown }
  ]

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((stepItem, index) => (
            <div key={stepItem.id} className="flex items-center">
              <div className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                step >= stepItem.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              )}>
                <stepItem.icon className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <p className={cn(
                  'text-sm font-medium',
                  step >= stepItem.id ? 'text-blue-600' : 'text-gray-400'
                )}>
                  {stepItem.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'w-16 h-0.5 mx-4',
                  step > stepItem.id ? 'bg-blue-600' : 'bg-gray-300'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {step === 1 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Track to Mint as NFT</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
                  className={cn(
                    'p-4 border rounded-lg cursor-pointer transition-colors',
                    selectedTrack?.id === track.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                >
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
                    {track.coverArt ? (
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Music className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-gray-900 truncate">{track.title}</h4>
                  <p className="text-sm text-gray-600 truncate">{track.artist}</p>
                  <p className="text-xs text-gray-500 mt-1">{track.genre}</p>
                </div>
              ))}
            </div>
            
            {selectedTrack && (
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">NFT Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NFT Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter NFT name"
                  value={form.name}
                  onChange={(value) => handleInputChange('name', value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your NFT..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload cover image (optional)</p>
                  <p className="text-xs text-gray-500">Recommended: 1000x1000px</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exclusive Content (Optional)
                </label>
                <textarea
                  value={form.exclusiveContent}
                  onChange={(e) => handleInputChange('exclusiveContent', e.target.value)}
                  placeholder="Describe any exclusive content for NFT holders..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Royalties</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NFT Price (ONE)
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.price.toString()}
                  onChange={(value) => handleInputChange('price', parseFloat(value) || 0)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set the price for your NFT. Leave as 0 for auction-style listing.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Royalty Percentage (%)
                </label>
                <Input
                  type="number"
                  placeholder="10"
                  value={form.royaltyPercentage.toString()}
                  onChange={(value) => handleInputChange('royaltyPercentage', parseFloat(value) || 0)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Percentage you'll earn from future sales (max 10%)
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Pricing Strategy</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="fixed" name="pricing" className="text-blue-600" />
                    <label htmlFor="fixed" className="text-sm text-blue-800">
                      Fixed Price: {formatCurrency(form.price)} ONE
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="auction" name="pricing" className="text-blue-600" />
                    <label htmlFor="auction" className="text-sm text-blue-800">
                      Auction: Let the market decide
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => setStep(4)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review & Create NFT</h3>
            
            {selectedTrack && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Track Details</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                    {selectedTrack.coverArt ? (
                      <img
                        src={selectedTrack.coverArt}
                        alt={selectedTrack.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Music className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedTrack.title}</p>
                    <p className="text-sm text-gray-600">{selectedTrack.artist}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">NFT Details</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-medium text-gray-900">{form.name}</p>
                  
                  <p className="text-sm text-gray-600 mb-1 mt-3">Description</p>
                  <p className="text-gray-900">{form.description}</p>
                  
                  <p className="text-sm text-gray-600 mb-1 mt-3">Price</p>
                  <p className="font-medium text-gray-900">
                    {form.price > 0 ? formatCurrency(form.price) : 'Auction'}
                  </p>
                  
                  <p className="text-sm text-gray-600 mb-1 mt-3">Royalty</p>
                  <p className="font-medium text-gray-900">{form.royaltyPercentage}%</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-900 mb-2">Important Notes</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Creating an NFT is permanent and cannot be undone</li>
                  <li>• You'll pay gas fees for the transaction</li>
                  <li>• The NFT will be stored on the blockchain</li>
                  <li>• You'll retain ownership of the original track</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button onClick={handleSubmit} loading={isCreating}>
                {isCreating ? 'Creating NFT...' : 'Create NFT'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NFTCreator
