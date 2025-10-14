import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SearchInterface from '../SearchInterface'
import { Track, Artist } from '../../../lib/types'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

const mockTrack: Track = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  artistAddress: '0x123...',
  artistId: 'artist-1',
  ipfsHash: 'QmTestHash',
  genre: 'Electronic',
  playCount: 1000,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  duration: 180,
  description: 'A test track',
  tags: ['test', 'electronic'],
  isPublished: true,
  isNftMinted: false,
  totalRevenue: 0.1,
  royaltyPercentage: 10
}

const mockArtist: Artist = {
  id: 'artist-1',
  name: 'Test Artist',
  profilePicture: 'https://example.com/profile.jpg',
  bio: 'A test artist',
  walletAddress: '0x123...',
  totalTracks: 10,
  totalRevenue: 1.5,
  isVerified: true,
  socialLinks: {
    twitter: 'https://twitter.com/testartist',
    instagram: 'https://instagram.com/testartist'
  },
  createdAt: Date.now(),
  updatedAt: Date.now()
}

const defaultProps = {
  onSearchResults: jest.fn(),
  onTrackSelect: jest.fn(),
  onArtistSelect: jest.fn(),
  placeholder: 'Search for tracks, artists, or genres...',
  autoFocus: false
}

describe('SearchInterface', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('renders without crashing', () => {
    render(<SearchInterface {...defaultProps} />)
    expect(screen.getByTestId('search-interface')).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(<SearchInterface {...defaultProps} placeholder="Custom placeholder" />)
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument()
  })

  it('renders with auto focus when enabled', () => {
    render(<SearchInterface {...defaultProps} autoFocus={true} />)
    const input = screen.getByTestId('search-input')
    expect(input).toHaveFocus()
  })

  it('handles input changes', () => {
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: 'test query' } })
    expect(input).toHaveValue('test query')
  })

  it('shows suggestions when typing', async () => {
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.focus(input)
    
    await waitFor(() => {
      expect(screen.getByText('Suggestions')).toBeInTheDocument()
    })
  })

  it('shows recent searches when focused with empty input', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(['recent search 1', 'recent search 2']))
    
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.focus(input)
    
    expect(screen.getByText('Recent Searches')).toBeInTheDocument()
    expect(screen.getByText('recent search 1')).toBeInTheDocument()
    expect(screen.getByText('recent search 2')).toBeInTheDocument()
  })

  it('handles recent search selection', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(['recent search 1']))
    
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.focus(input)
    fireEvent.click(screen.getByTestId('recent-search-0'))
    
    expect(input).toHaveValue('recent search 1')
  })

  it('handles suggestion selection', async () => {
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.focus(input)
    
    await waitFor(() => {
      expect(screen.getByText('Suggestions')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByTestId('suggestion-0'))
    expect(input).toHaveValue('test - Song Title')
  })

  it('clears search when clear button is clicked', () => {
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: 'test query' } })
    fireEvent.click(screen.getByLabelText('Clear search'))
    
    expect(input).toHaveValue('')
  })

  it('handles keyboard navigation', () => {
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'Escape' })
    
    expect(screen.queryByText('Suggestions')).not.toBeInTheDocument()
  })

  it('calls onSearchResults when performing search', async () => {
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: 'test' } })
    
    await waitFor(() => {
      expect(defaultProps.onSearchResults).toHaveBeenCalled()
    })
  })

  it('handles empty search gracefully', () => {
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.focus(input)
    
    expect(screen.queryByText('Suggestions')).not.toBeInTheDocument()
  })

  it('shows no results message when no suggestions found', async () => {
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: 'nonexistent' } })
    fireEvent.focus(input)
    
    await waitFor(() => {
      expect(screen.getByText('No results found for "nonexistent"')).toBeInTheDocument()
    })
  })

  it('shows search tips when no recent searches', () => {
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.focus(input)
    
    expect(screen.getByText('Search for music, artists, or genres')).toBeInTheDocument()
    expect(screen.getByText('• Try artist names like "Deadmau5"')).toBeInTheDocument()
  })

  it('saves search history to localStorage', () => {
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: 'new search' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'harmony-search-history',
      JSON.stringify(['new search'])
    )
  })

  it('limits search history to 20 items', () => {
    const longHistory = Array.from({ length: 25 }, (_, i) => `search ${i}`)
    localStorageMock.getItem.mockReturnValue(JSON.stringify(longHistory))
    
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: 'new search' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'harmony-search-history',
      JSON.stringify(['new search', ...longHistory.slice(0, 19)])
    )
  })

  it('handles localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })
    
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.focus(input)
    
    expect(screen.getByText('Search for music, artists, or genres')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <SearchInterface {...defaultProps} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('applies custom testId', () => {
    render(<SearchInterface {...defaultProps} testId="custom-test-id" />)
    
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
  })

  it('handles rapid input changes', async () => {
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: 't' } })
    fireEvent.change(input, { target: { value: 'te' } })
    fireEvent.change(input, { target: { value: 'tes' } })
    fireEvent.change(input, { target: { value: 'test' } })
    
    await waitFor(() => {
      expect(defaultProps.onSearchResults).toHaveBeenCalled()
    })
  })

  it('handles focus and blur events', () => {
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.focus(input)
    expect(screen.getByText('Search for music, artists, or genres')).toBeInTheDocument()
    
    fireEvent.blur(input)
    // Suggestions should still be visible after blur
    expect(screen.getByText('Search for music, artists, or genres')).toBeInTheDocument()
  })

  it('handles missing callbacks gracefully', () => {
    render(
      <SearchInterface 
        onSearchResults={undefined as any}
        onTrackSelect={undefined as any}
        onArtistSelect={undefined as any}
      />
    )
    
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'test' } })
    
    expect(screen.getByTestId('search-interface')).toBeInTheDocument()
  })

  it('handles edge case props', () => {
    render(
      <SearchInterface 
        {...defaultProps}
        placeholder=""
        autoFocus={false}
        className=""
        testId=""
      />
    )
    
    expect(screen.getByTestId('search-interface')).toBeInTheDocument()
  })

  it('handles very long search queries', () => {
    const longQuery = 'a'.repeat(1000)
    
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: longQuery } })
    expect(input).toHaveValue(longQuery)
  })

  it('handles special characters in search queries', () => {
    const specialQuery = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: specialQuery } })
    expect(input).toHaveValue(specialQuery)
  })

  it('handles unicode characters in search queries', () => {
    const unicodeQuery = '你好世界 🌍 🎵'
    
    render(<SearchInterface {...defaultProps} />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: unicodeQuery } })
    expect(input).toHaveValue(unicodeQuery)
  })
})
