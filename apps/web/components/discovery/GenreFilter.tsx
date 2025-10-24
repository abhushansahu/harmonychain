'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface GenreFilterProps {
  selectedGenres: string[]
  onGenreToggle: (genre: string) => void
  maxSelections?: number
  className?: string
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  selectedGenres,
  onGenreToggle,
  maxSelections = 3,
  className
}) => {
  const genres = [
    { name: 'Electronic', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { name: 'Rock', color: 'bg-red-100 text-red-800 border-red-200' },
    { name: 'Hip-Hop', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { name: 'Jazz', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { name: 'Blues', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { name: 'Classical', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { name: 'Pop', color: 'bg-pink-100 text-pink-800 border-pink-200' },
    { name: 'Folk', color: 'bg-green-100 text-green-800 border-green-200' },
    { name: 'Country', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { name: 'Reggae', color: 'bg-lime-100 text-lime-800 border-lime-200' }
  ]

  const handleGenreClick = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenreToggle(genre)
    } else if (selectedGenres.length < maxSelections) {
      onGenreToggle(genre)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">
          Filter by Genre
        </h3>
        <span className="text-xs text-gray-500">
          {selectedGenres.length}/{maxSelections} selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre.name)
          const isDisabled = !isSelected && selectedGenres.length >= maxSelections

          return (
            <button
              key={genre.name}
              onClick={() => handleGenreClick(genre.name)}
              disabled={isDisabled}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
                isSelected
                  ? `${genre.color} border-current`
                  : isDisabled
                  ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              )}
            >
              {genre.name}
            </button>
          )
        })}
      </div>

      {selectedGenres.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Selected: {selectedGenres.join(', ')}
            </span>
            <button
              onClick={() => selectedGenres.forEach(onGenreToggle)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GenreFilter
