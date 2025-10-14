'use client'

import React, { useState, useEffect } from 'react'

interface MetadataFormProps {
  initialData?: TrackMetadata
  onSubmit: (metadata: TrackMetadata) => void
  onCancel: () => void
  isLoading?: boolean
}

export interface TrackMetadata {
  title: string
  artist: string
  album?: string
  genre: string
  year?: number
  description?: string
  tags: string[]
  explicit: boolean
  language?: string
  mood?: string
  tempo?: number
  key?: string
  duration?: number
  coverArt?: string
  lyrics?: string
  credits?: {
    producer?: string
    songwriter?: string
    mixer?: string
    mastering?: string
  }
}

const GENRES = [
  'Electronic', 'Rock', 'Pop', 'Hip-Hop', 'Jazz', 'Classical',
  'Country', 'R&B', 'Reggae', 'Blues', 'Folk', 'Metal',
  'Punk', 'Indie', 'Ambient', 'Techno', 'House', 'Trance',
  'Dubstep', 'Drum & Bass', 'Chillout', 'Acoustic'
]

const MOODS = [
  'Happy', 'Sad', 'Energetic', 'Calm', 'Aggressive', 'Romantic',
  'Melancholic', 'Uplifting', 'Dark', 'Peaceful', 'Nostalgic', 'Futuristic'
]

const KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
]

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Japanese', 'Korean', 'Chinese', 'Hindi', 'Arabic', 'Russian'
]

export default function MetadataForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}: MetadataFormProps) {
  const [formData, setFormData] = useState<TrackMetadata>({
    title: '',
    artist: '',
    album: '',
    genre: '',
    year: new Date().getFullYear(),
    description: '',
    tags: [],
    explicit: false,
    language: 'English',
    mood: '',
    tempo: 120,
    key: '',
    duration: 0,
    coverArt: '',
    lyrics: '',
    credits: {}
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist is required'
    }

    if (!formData.genre) {
      newErrors.genre = 'Genre is required'
    }

    if (formData.year && (formData.year < 1900 || formData.year > new Date().getFullYear() + 1)) {
      newErrors.year = 'Invalid year'
    }

    if (formData.tempo && (formData.tempo < 60 || formData.tempo > 200)) {
      newErrors.tempo = 'Tempo must be between 60 and 200 BPM'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof TrackMetadata, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter track title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Artist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Artist *
            </label>
            <input
              type="text"
              value={formData.artist}
              onChange={(e) => handleInputChange('artist', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.artist ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter artist name"
            />
            {errors.artist && <p className="mt-1 text-sm text-red-600">{errors.artist}</p>}
          </div>

          {/* Album */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Album
            </label>
            <input
              type="text"
              value={formData.album || ''}
              onChange={(e) => handleInputChange('album', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter album name"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre *
            </label>
            <select
              value={formData.genre}
              onChange={(e) => handleInputChange('genre', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.genre ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select genre</option>
              {GENRES.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre}</p>}
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              value={formData.year || ''}
              onChange={(e) => handleInputChange('year', parseInt(e.target.value) || undefined)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.year ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="2024"
              min="1900"
              max={new Date().getFullYear() + 1}
            />
            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe your track..."
          />
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
        
        <div className="space-y-4">
          {/* Add Tag */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Tags List */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tempo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tempo (BPM)
            </label>
            <input
              type="number"
              value={formData.tempo || ''}
              onChange={(e) => handleInputChange('tempo', parseInt(e.target.value) || undefined)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.tempo ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="120"
              min="60"
              max="200"
            />
            {errors.tempo && <p className="mt-1 text-sm text-red-600">{errors.tempo}</p>}
          </div>

          {/* Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key
            </label>
            <select
              value={formData.key || ''}
              onChange={(e) => handleInputChange('key', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select key</option>
              {KEYS.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mood
            </label>
            <select
              value={formData.mood || ''}
              onChange={(e) => handleInputChange('mood', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select mood</option>
              {MOODS.map(mood => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={formData.language || ''}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Explicit */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="explicit"
              checked={formData.explicit}
              onChange={(e) => handleInputChange('explicit', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="explicit" className="text-sm font-medium text-gray-700">
              Explicit content
            </label>
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Credits</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producer
            </label>
            <input
              type="text"
              value={formData.credits?.producer || ''}
              onChange={(e) => handleInputChange('credits', {
                ...formData.credits,
                producer: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Producer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Songwriter
            </label>
            <input
              type="text"
              value={formData.credits?.songwriter || ''}
              onChange={(e) => handleInputChange('credits', {
                ...formData.credits,
                songwriter: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Songwriter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mixer
            </label>
            <input
              type="text"
              value={formData.credits?.mixer || ''}
              onChange={(e) => handleInputChange('credits', {
                ...formData.credits,
                mixer: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Mixer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mastering
            </label>
            <input
              type="text"
              value={formData.credits?.mastering || ''}
              onChange={(e) => handleInputChange('credits', {
                ...formData.credits,
                mastering: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Mastering engineer name"
            />
          </div>
        </div>
      </div>

      {/* Lyrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lyrics</h3>
        
        <textarea
          value={formData.lyrics || ''}
          onChange={(e) => handleInputChange('lyrics', e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter lyrics here..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Metadata'}
        </button>
      </div>
    </form>
  )
}
