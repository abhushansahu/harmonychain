import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import TrendingTracks from '../TrendingTracks'
import { Track } from '../../../lib/types'

// Mock the shared components
jest.mock('../../ui/Button', () => {
  return function MockButton({ children, onClick, testId, ...props }: any) {
    return (
      <button onClick={onClick} data-testid={testId} {...props}>
        {children}
      </button>
    )
  }
})

jest.mock('../../ui/Select', () => {
  return function MockSelect({ value, onChange, options, testId, ...props }: any) {
    return (
      <select value={value} onChange={onChange} data-testid={testId} {...props}>
        {options?.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }
})

// Mock the shared utilities
jest.mock('../../../lib/utils', () => ({
  classNames: (...classes: any[]) => classes.filter(Boolean).join(' ')
}))

// Mock tracks data
const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Trending Track 1',
    artist: { id: '1', name: 'Artist 1', avatar: '/avatar1.jpg' },
    duration: 180,
    genre: 'Electronic',
    ipfsHash: 'QmHash1',
    coverArt: '/cover1.jpg',
    releaseDate: new Date('2024-01-01'),
    isExplicit: false,
    playCount: 1000,
    likeCount: 50,
    shareCount: 10,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Trending Track 2',
    artist: { id: '2', name: 'Artist 2', avatar: '/avatar2.jpg' },
    duration: 240,
    genre: 'Hip-Hop',
    ipfsHash: 'QmHash2',
    coverArt: '/cover2.jpg',
    releaseDate: new Date('2024-01-02'),
    isExplicit: true,
    playCount: 2000,
    likeCount: 100,
    shareCount: 25,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
]

describe('TrendingTracks', () => {
  const defaultProps = {
    onTrackSelect: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with default props', () => {
    render(<TrendingTracks {...defaultProps} />)
    
    expect(screen.getByTestId('trending-tracks')).toBeInTheDocument()
    expect(screen.getByText('Trending Tracks')).toBeInTheDocument()
    expect(screen.getByText('Most popular tracks right now')).toBeInTheDocument()
  })

  it('renders with custom className and testId', () => {
    render(
      <TrendingTracks 
        {...defaultProps} 
        className="custom-class"
        testId="custom-test-id"
      />
    )
    
    const container = screen.getByTestId('custom-test-id')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('custom-class')
  })

  it('shows loading state initially', () => {
    render(<TrendingTracks {...defaultProps} />)
    
    expect(screen.getByText('Loading trending tracks...')).toBeInTheDocument()
  })

  it('displays trending tracks after loading', async () => {
    // Mock the fetch function to return mock data
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Trending Track 1')).toBeInTheDocument()
      expect(screen.getByText('Artist 1')).toBeInTheDocument()
    })
  })

  it('handles track selection', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Trending Track 1')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Trending Track 1'))
    expect(defaultProps.onTrackSelect).toHaveBeenCalledWith(mockTracks[0])
  })

  it('displays track information correctly', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Trending Track 1')).toBeInTheDocument()
      expect(screen.getByText('Artist 1')).toBeInTheDocument()
      expect(screen.getByText('3:00')).toBeInTheDocument() // 180 seconds
      expect(screen.getByText('Electronic')).toBeInTheDocument()
    })
  })

  it('shows trend indicators', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} showCharts={true} />)
    
    await waitFor(() => {
      expect(screen.getByText('Trending Track 1')).toBeInTheDocument()
    })

    // Check for trend indicators (up/down arrows)
    const trendIndicators = screen.getAllByTestId(/trend-indicator/)
    expect(trendIndicators.length).toBeGreaterThan(0)
  })

  it('handles time range selection', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Trending Track 1')).toBeInTheDocument()
    })

    const timeRangeSelect = screen.getByTestId('time-range-select')
    fireEvent.change(timeRangeSelect, { target: { value: '30d' } })
    
    expect(timeRangeSelect).toHaveValue('30d')
  })

  it('displays play counts and engagement metrics', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('1.0K')).toBeInTheDocument() // playCount
      expect(screen.getByText('50')).toBeInTheDocument() // likeCount
    })
  })

  it('handles empty trending tracks', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: [] })
    })

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('No trending tracks found')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('API Error'))

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load trending tracks')).toBeInTheDocument()
    })
  })

  it('respects the limit prop', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} limit={1} />)
    
    await waitFor(() => {
      expect(screen.getByText('Trending Track 1')).toBeInTheDocument()
      expect(screen.queryByText('Trending Track 2')).not.toBeInTheDocument()
    })
  })

  it('shows view more button when there are more tracks', async () => {
    const moreTracks = Array.from({ length: 25 }, (_, i) => ({
      ...mockTracks[0],
      id: `${i + 1}`,
      title: `Track ${i + 1}`
    }))

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: moreTracks })
    })

    render(<TrendingTracks {...defaultProps} limit={20} />)
    
    await waitFor(() => {
      expect(screen.getByText('View More')).toBeInTheDocument()
    })
  })

  it('handles view more button click', async () => {
    const moreTracks = Array.from({ length: 25 }, (_, i) => ({
      ...mockTracks[0],
      id: `${i + 1}`,
      title: `Track ${i + 1}`
    }))

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: moreTracks })
    })

    render(<TrendingTracks {...defaultProps} limit={20} />)
    
    await waitFor(() => {
      expect(screen.getByText('View More')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('View More'))
    // Additional tracks should be loaded
    await waitFor(() => {
      expect(screen.getByText('Track 21')).toBeInTheDocument()
    })
  })

  it('displays explicit content warning', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Trending Track 2')).toBeInTheDocument()
      expect(screen.getByText('E')).toBeInTheDocument() // Explicit indicator
    })
  })

  it('handles different time ranges correctly', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} timeRange="24h" />)
    
    await waitFor(() => {
      expect(screen.getByText('Trending Track 1')).toBeInTheDocument()
    })

    // Verify the correct time range was used in the API call
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('timeRange=24h')
    )
  })

  it('updates tracks when time range changes', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tracks: mockTracks })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tracks: [mockTracks[0]] })
      })

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Trending Track 1')).toBeInTheDocument()
    })

    const timeRangeSelect = screen.getByTestId('time-range-select')
    fireEvent.change(timeRangeSelect, { target: { value: '7d' } })
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })

  it('displays track ranking correctly', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument() // First track rank
      expect(screen.getByText('2')).toBeInTheDocument() // Second track rank
    })
  })

  it('handles track hover states', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Trending Track 1')).toBeInTheDocument()
    })

    const trackItem = screen.getByText('Trending Track 1').closest('div')
    fireEvent.mouseEnter(trackItem!)
    
    // Track should have hover styles applied
    expect(trackItem).toHaveClass('hover:bg-gray-50')
  })

  it('displays track duration in correct format', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('3:00')).toBeInTheDocument() // 180 seconds
      expect(screen.getByText('4:00')).toBeInTheDocument() // 240 seconds
    })
  })

  it('shows loading skeleton during initial load', () => {
    render(<TrendingTracks {...defaultProps} />)
    
    expect(screen.getByText('Loading trending tracks...')).toBeInTheDocument()
    // Check for skeleton elements
    const skeletonElements = screen.getAllByTestId(/skeleton/)
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('handles network timeout gracefully', async () => {
    global.fetch = jest.fn().mockImplementationOnce(
      () => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 100)
      )
    )

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load trending tracks')).toBeInTheDocument()
    })
  })

  it('displays track metadata correctly', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Trending Track 1')).toBeInTheDocument()
      expect(screen.getByText('Artist 1')).toBeInTheDocument()
      expect(screen.getByText('Electronic')).toBeInTheDocument()
      expect(screen.getByText('3:00')).toBeInTheDocument()
    })
  })

  it('handles rapid time range changes', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ tracks: mockTracks })
    })

    render(<TrendingTracks {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Trending Track 1')).toBeInTheDocument()
    })

    const timeRangeSelect = screen.getByTestId('time-range-select')
    
    // Rapidly change time range
    fireEvent.change(timeRangeSelect, { target: { value: '7d' } })
    fireEvent.change(timeRangeSelect, { target: { value: '30d' } })
    fireEvent.change(timeRangeSelect, { target: { value: 'all' } })
    
    // Should handle rapid changes gracefully
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })
})
