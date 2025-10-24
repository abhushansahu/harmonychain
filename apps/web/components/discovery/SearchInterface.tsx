'use client'

import React, { useState, useEffect } from 'react'
import { Track, Artist, SearchFilters, SearchResult } from '@/lib/types'
import { useDebounce } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import { Search, X, Music, User } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface SearchInterfaceProps {
  onSearch: (filters: SearchFilters) => void
  onTrackSelect: (track: Track) => void
  onArtistSelect: (artist: Artist) => void
  className?: string
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onSearch,
  onTrackSelect,
  onArtistSelect,
  className
}) => {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'price_low' | 'price_high'>('newest')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  
  const debouncedQuery = useDebounce(query, 300)

  // Mock search results for demonstration
  const mockTracks: Track[] = [
    {
      id: '1',
      title: 'Digital Dreams',
      artist: 'CryptoBeats',
      artistId: '1',
      duration: 180,
      genre: 'Electronic',
      price: 0.5,
      coverArt: '/api/placeholder/300/300',
      audioFile: '/api/placeholder/audio.mp3',
      ipfsHash: 'QmExample1',
      isStreamable: true,
      playCount: 1250,
      owner: '0x123...',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Blockchain Blues',
      artist: 'DeFi Diva',
      artistId: '2',
      duration: 240,
      genre: 'Blues',
      price: 1.2,
      coverArt: '/api/placeholder/300/300',
      audioFile: '/api/placeholder/audio.mp3',
      ipfsHash: 'QmExample2',
      isStreamable: true,
      playCount: 890,
      owner: '0x456...',
      createdAt: '2024-01-14T15:30:00Z',
      updatedAt: '2024-01-14T15:30:00Z'
    }
  ]

  const mockArtists: Artist[] = [
    {
      id: '1',
      name: 'CryptoBeats',
      description: 'Electronic music producer',
      avatar: '/api/placeholder/100/100',
      walletAddress: '0x123...',
      totalTracks: 15,
      totalEarnings: 25.5,
      isVerified: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'DeFi Diva',
      description: 'Blues and jazz artist',
      avatar: '/api/placeholder/100/100',
      walletAddress: '0x456...',
      totalTracks: 8,
      totalEarnings: 18.2,
      isVerified: false,
      createdAt: '2024-01-05T00:00:00Z'
    }
  ]

  const genres = ['All', 'Electronic', 'Rock', 'Hip-Hop', 'Jazz', 'Blues', 'Classical', 'Pop']

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Save search to history
  const saveToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  // Handle search
  const handleSearch = () => {
    const filters: SearchFilters = {
      query: debouncedQuery,
      genre: genre === 'All' ? undefined : genre,
      sortBy
    }
    
    saveToHistory(debouncedQuery)
    onSearch(filters)
    setShowSuggestions(false)
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
  }

  // Clear search
  const clearSearch = () => {
    setQuery('')
    setShowSuggestions(false)
  }

  // Filter suggestions based on query
  const filteredTracks = mockTracks.filter(track => 
    track.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(debouncedQuery.toLowerCase())
  )

  const filteredArtists = mockArtists.filter(artist =>
    artist.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  )

  return (
    <div className={cn('w-full', className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search tracks, artists, or genres..."
              value={query}
              onChange={setQuery}
              onFocus={() => setShowSuggestions(true)}
              className="pl-10 pr-10"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <Button onClick={handleSearch}>
            Search
          </Button>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (query || searchHistory.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
            {/* Search History */}
            {!query && searchHistory.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h4>
                <div className="space-y-1">
                  {searchHistory.slice(0, 5).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Search Results */}
            {query && (
              <div className="p-3">
                {/* Tracks */}
                {filteredTracks.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Music className="w-4 h-4 mr-1" />
                      Tracks
                    </h4>
                    <div className="space-y-1">
                      {filteredTracks.slice(0, 3).map((track) => (
                        <button
                          key={track.id}
                          onClick={() => {
                            onTrackSelect(track)
                            setShowSuggestions(false)
                          }}
                          className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded flex items-center space-x-3"
                        >
                          <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {track.title}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {track.artist}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Artists */}
                {filteredArtists.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Artists
                    </h4>
                    <div className="space-y-1">
                      {filteredArtists.slice(0, 3).map((artist) => (
                        <button
                          key={artist.id}
                          onClick={() => {
                            onArtistSelect(artist)
                            setShowSuggestions(false)
                          }}
                          className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded flex items-center space-x-3"
                        >
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {artist.name}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {artist.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {filteredTracks.length === 0 && filteredArtists.length === 0 && (
                  <p className="text-sm text-gray-500 py-2">No results found</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mt-4">
        {/* Genre Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Popular</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchInterface
