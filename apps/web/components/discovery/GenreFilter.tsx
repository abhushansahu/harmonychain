'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { classNames } from '../../lib/utils'

interface GenreFilterProps {
  selectedGenres: string[]
  onGenreChange: (genres: string[]) => void
  availableGenres?: string[]
  maxSelections?: number
  showCounts?: boolean
  className?: string
  testId?: string
}

interface GenreWithCount {
  name: string
  count: number
  color: string
}

const DEFAULT_GENRES = [
  'Electronic', 'Rock', 'Pop', 'Hip-Hop', 'Jazz', 'Classical',
  'Country', 'R&B', 'Reggae', 'Blues', 'Folk', 'Metal',
  'Punk', 'Indie', 'Ambient', 'Techno', 'House', 'Trance',
  'Dubstep', 'Drum & Bass', 'Chillout', 'Acoustic'
]

const GENRE_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
  'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500',
  'bg-emerald-500', 'bg-violet-500', 'bg-rose-500', 'bg-sky-500',
  'bg-fuchsia-500', 'bg-lime-500', 'bg-cyan-500', 'bg-emerald-500',
  'bg-violet-500', 'bg-rose-500'
]

export default function GenreFilter({
  selectedGenres,
  onGenreChange,
  availableGenres = DEFAULT_GENRES,
  maxSelections = 5,
  showCounts = true,
  className,
  testId = 'genre-filter'
}: GenreFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [genreCounts, setGenreCounts] = useState<Record<string, number>>({})

  // Mock genre counts - in real app, this would come from API
  useEffect(() => {
    const mockCounts: Record<string, number> = {}
    availableGenres.forEach((genre, index) => {
      mockCounts[genre] = Math.floor(Math.random() * 1000) + 10
    })
    setGenreCounts(mockCounts)
  }, [availableGenres])

  const filteredGenres = availableGenres.filter(genre =>
    genre.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      // Remove genre
      onGenreChange(selectedGenres.filter(g => g !== genre))
    } else if (selectedGenres.length < maxSelections) {
      // Add genre
      onGenreChange([...selectedGenres, genre])
    }
  }

  const clearAllGenres = () => {
    onGenreChange([])
  }

  const getGenreColor = (genre: string): string => {
    const index = availableGenres.indexOf(genre)
    return GENRE_COLORS[index % GENRE_COLORS.length]
  }

  const getGenreCount = (genre: string): number => {
    return genreCounts[genre] || 0
  }

  return (
    <div 
      className={classNames("bg-white rounded-lg border border-gray-200 p-4", className)}
      data-testid={testId}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">Genres</h3>
          {selectedGenres.length > 0 && (
            <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
              {selectedGenres.length}/{maxSelections}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedGenres.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllGenres}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              testId="clear-all-genres"
            >
              Clear All
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            testId="toggle-expand"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Selected Genres */}
      {selectedGenres.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map(genre => (
              <div
                key={genre}
                className="flex items-center space-x-2 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{genre}</span>
                <button
                  onClick={() => handleGenreToggle(genre)}
                  className="text-primary-600 hover:text-primary-800 transition-colors"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      {isExpanded && (
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input
              type="text"
              label="Search genres"
              name="genre-search"
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
              placeholder="Search genres..."
              className="pl-9 pr-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      {/* Genre Grid */}
      {isExpanded && (
        <div className="max-h-64 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredGenres.map(genre => {
              const isSelected = selectedGenres.includes(genre)
              const isDisabled = !isSelected && selectedGenres.length >= maxSelections
              const count = getGenreCount(genre)
              const color = getGenreColor(genre)

              return (
                <Button
                  key={genre}
                  variant="ghost"
                  onClick={() => handleGenreToggle(genre)}
                  disabled={isDisabled}
                  className={classNames(
                    "relative p-3 rounded-lg border-2 transition-all text-left",
                    isSelected
                      ? 'border-harmony-primary bg-harmony-primary-light'
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                  testId={`genre-${genre.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {/* Genre Color Indicator */}
                  <div className={`w-3 h-3 rounded-full ${color} mb-2`} />
                  
                  {/* Genre Name */}
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {genre}
                  </div>
                  
                  {/* Track Count */}
                  {showCounts && (
                    <div className="text-xs text-gray-500 mt-1">
                      {count.toLocaleString()} tracks
                    </div>
                  )}
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-4 h-4 text-harmony-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Collapsed View - Show Selected Genres */}
      {!isExpanded && selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.slice(0, 3).map(genre => (
            <div
              key={genre}
              className="flex items-center space-x-2 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
            >
              <div className={`w-2 h-2 rounded-full ${getGenreColor(genre)}`} />
              <span>{genre}</span>
            </div>
          ))}
          {selectedGenres.length > 3 && (
            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              +{selectedGenres.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* No Genres Selected */}
      {!isExpanded && selectedGenres.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">No genres selected</p>
          <p className="text-xs text-gray-400 mt-1">Click to expand and choose genres</p>
        </div>
      )}

      {/* Max Selection Warning */}
      {selectedGenres.length >= maxSelections && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-yellow-800">
              Maximum {maxSelections} genres selected
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
