'use client'

import React, { useState } from 'react'
import { TrackUploadForm } from '@/lib/types'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface MetadataFormProps {
  form: TrackUploadForm
  onChange: (form: TrackUploadForm) => void
  onSubmit: (form: TrackUploadForm) => void
  className?: string
}

const MetadataForm: React.FC<MetadataFormProps> = ({
  form,
  onChange,
  onSubmit,
  className
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const genres = [
    'Electronic', 'Rock', 'Hip-Hop', 'Jazz', 'Blues', 'Classical',
    'Pop', 'Folk', 'Country', 'Reggae', 'R&B', 'Alternative'
  ]

  const handleInputChange = (field: keyof TrackUploadForm, value: any) => {
    const newForm = { ...form, [field]: value }
    onChange(newForm)
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!form.artist.trim()) {
      newErrors.artist = 'Artist name is required'
    }

    if (!form.genre) {
      newErrors.genre = 'Genre is required'
    }

    if (form.price < 0) {
      newErrors.price = 'Price cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(form)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Track Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Track Title *
            </label>
            <Input
              type="text"
              placeholder="Enter track title"
              value={form.title}
              onChange={(value) => handleInputChange('title', value)}
              error={errors.title}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Artist Name *
            </label>
            <Input
              type="text"
              placeholder="Enter artist name"
              value={form.artist}
              onChange={(value) => handleInputChange('artist', value)}
              error={errors.artist}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre *
          </label>
          <select
            value={form.genre}
            onChange={(e) => handleInputChange('genre', e.target.value)}
            className={cn(
              'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.genre ? 'border-red-500' : 'border-gray-300'
            )}
          >
            <option value="">Select a genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          {errors.genre && (
            <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your track..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Pricing & Licensing</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Type
            </label>
            <select
              value={form.licenseType}
              onChange={(e) => handleInputChange('licenseType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
              <option value="nft">NFT Only</option>
            </select>
          </div>

          {form.licenseType === 'paid' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (ONE)
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={form.price.toString()}
                onChange={(value) => handleInputChange('price', parseFloat(value) || 0)}
                error={errors.price}
              />
            </div>
          )}
        </div>

        {form.licenseType === 'free' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Free License:</strong> Your track will be available for free streaming and basic use.
            </p>
          </div>
        )}

        {form.licenseType === 'paid' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Paid License:</strong> Users will need to purchase your track to listen.
            </p>
          </div>
        )}

        {form.licenseType === 'nft' && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>NFT Only:</strong> Your track will only be available as an NFT purchase.
            </p>
          </div>
        )}
      </div>

      {/* Cover Art Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Cover Art</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">Upload cover art (optional)</p>
          <Button variant="outline">
            Choose Image
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Recommended: 1000x1000px, JPG or PNG
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Save Draft
        </Button>
        <Button>
          Continue to License Settings
        </Button>
      </div>
    </form>
  )
}

export default MetadataForm
