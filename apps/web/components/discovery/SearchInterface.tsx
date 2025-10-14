'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Track, Artist } from '../../lib/types'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { classNames } from '../../lib/utils'

interface SearchInterfaceProps {
  onSearchResults: (results: SearchResults) => void
  onTrackSelect: (track: Track) => void
  onArtistSelect: (artist: Artist) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
  testId?: string
}

interface SearchResults {
  tracks: Track[]
  artists: Artist[]
  totalTracks: number
  totalArtists: number
  hasMore: boolean
}

interface SearchSuggestion {
  type: 'track' | 'artist' | 'genre'
  value: string
  count?: number
}

export default function SearchInterface({
  onSearchResults,
  onTrackSelect,
  onArtistSelect,
  placeholder = 'Search for tracks, artists, or genres...',
  autoFocus = false,
  className,
  testId = 'search-interface'
}: SearchInterfaceProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const searchRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('harmony-search-history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setSearchHistory(parsed)
        setRecentSearches(parsed.slice(0, 5)) // Show last 5 searches
      } catch (error) {
        console.error('Failed to load search history:', error)
      }
    }
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.trim().length > 0) {
      debounceRef.current = setTimeout(() => {
        performSearch(query)
      }, 300)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true)
    setShowSuggestions(true)

    try {
      // Get search suggestions
      const suggestionResults = await getSearchSuggestions(searchQuery)
      setSuggestions(suggestionResults)

      // Perform full search if query is substantial
      if (searchQuery.length >= 2) {
        const fullResults = await performFullSearch(searchQuery)
        onSearchResults(fullResults)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const getSearchSuggestions = async (searchQuery: string): Promise<SearchSuggestion[]> => {
    // Mock implementation - in real app, this would call your API
    const mockSuggestions: SearchSuggestion[] = [
      { type: 'track', value: `${searchQuery} - Song Title`, count: 15 },
      { type: 'artist', value: `Artist ${searchQuery}`, count: 3 },
      { type: 'genre', value: `${searchQuery} Music`, count: 8 }
    ]
    
    return mockSuggestions.filter(s => 
      s.value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const performFullSearch = async (searchQuery: string): Promise<SearchResults> => {
    // Mock implementation - in real app, this would call your API
    const mockTracks: Track[] = [
      {
        id: '1',
        title: `${searchQuery} Track 1`,
        artist: 'Artist Name',
        artistAddress: '0x123...',
        ipfsHash: 'QmHash1',
        genre: 'Electronic',
        playCount: 1250,
        createdAt: Date.now() - 86400000
      },
      {
        id: '2',
        title: `${searchQuery} Track 2`,
        artist: 'Another Artist',
        artistAddress: '0x456...',
        ipfsHash: 'QmHash2',
        genre: 'Rock',
        playCount: 890,
        createdAt: Date.now() - 172800000
      }
    ]

    const mockArtists: Artist[] = [
      {
        id: '1',
        walletAddress: '0x123...',
        name: `Artist ${searchQuery}`,
        totalTracks: 15,
        isVerified: true
      }
    ]

    return {
      tracks: mockTracks,
      artists: mockArtists,
      totalTracks: mockTracks.length,
      totalArtists: mockArtists.length,
      hasMore: false
    }
  }

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length === 0) return

    // Add to search history
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 20)
    setSearchHistory(newHistory)
    setRecentSearches(newHistory.slice(0, 5))
    localStorage.setItem('harmony-search-history', JSON.stringify(newHistory))

    setQuery(searchQuery)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.value)
  }

  const handleTrackSelect = (track: Track) => {
    onTrackSelect(track)
    setShowSuggestions(false)
  }

  const handleArtistSelect = (artist: Artist) => {
    onArtistSelect(artist)
    setShowSuggestions(false)
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    searchRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div 
      className={classNames("relative w-full max-w-2xl mx-auto", className)}
      data-testid={testId}
    >
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <Input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="pl-10 pr-10 py-3 text-lg"
          testId="search-input"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-harmony-primary border-t-transparent rounded-full animate-spin" />
          ) : query ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          ) : null}
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Searches</h3>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => handleSearch(search)}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    testId={`recent-search-${index}`}
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zM14.293 6.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>{search}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          {query.length > 0 && suggestions.length > 0 && (
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Suggestions</h3>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center justify-between w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    testId={`suggestion-${index}`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        suggestion.type === 'track' ? 'bg-blue-500' :
                        suggestion.type === 'artist' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`} />
                      <span>{suggestion.value}</span>
                    </div>
                    {suggestion.count && (
                      <span className="text-xs text-gray-500">{suggestion.count}</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query.length > 0 && suggestions.length === 0 && !isSearching && (
            <div className="p-6 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}

          {/* Search Tips */}
          {query.length === 0 && recentSearches.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <p>Search for music, artists, or genres</p>
              <div className="mt-4 text-sm text-gray-400">
                <p>• Try artist names like "Deadmau5"</p>
                <p>• Search genres like "Electronic"</p>
                <p>• Look for specific tracks</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
