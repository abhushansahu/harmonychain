'use client'

import React, { useState, useEffect } from 'react'
import { Track } from '../../lib/types'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { classNames } from '../../lib/utils'
import { fetchTrending } from '../../lib/api/endpoints'

interface TrendingTracksProps {
  onTrackSelect: (track: Track) => void
  timeRange?: '24h' | '7d' | '30d' | 'all'
  limit?: number
  showCharts?: boolean
  className?: string
  testId?: string
}

interface TrendingTrack extends Track {
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
  rank: number
  previousRank?: number
}

export default function TrendingTracks({
  onTrackSelect,
  timeRange = '7d',
  limit = 20,
  showCharts = true,
  className,
  testId = 'trending-tracks'
}: TrendingTracksProps) {
  const [trendingTracks, setTrendingTracks] = useState<TrendingTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange)

  useEffect(() => {
    loadTrendingTracks()
  }, [selectedTimeRange, limit])

  const loadTrendingTracks = async () => {
    setIsLoading(true)
    try {
      const resp = await fetchTrending({ timeRange: selectedTimeRange, limit })
      const mapped: TrendingTrack[] = resp.tracks.map((t, i) => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        artistAddress: t.artistAddress || '',
        artistId: `artist-${i}`,
        ipfsHash: t.ipfsHash,
        genre: t.genre || 'Unknown',
        playCount: t.playCount,
        createdAt: t.createdAt,
        updatedAt: t.createdAt,
        duration: 180,
        description: '',
        tags: [],
        isPublished: true,
        isNftMinted: false,
        totalRevenue: 0,
        royaltyPercentage: 10,
        rank: t.rank ?? i + 1,
        previousRank: t.previousRank,
        trend: t.trend ?? 'stable',
        trendPercentage: t.trendPercentage ?? 0
      }))
      setTrendingTracks(mapped)
    } catch (error) {
      console.error('Failed to load trending tracks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        )
      case 'down':
        return (
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatPlayCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const getRankChange = (currentRank: number, previousRank?: number) => {
    if (!previousRank) return null
    
    const change = previousRank - currentRank
    if (change > 0) {
      return { direction: 'up', change: Math.abs(change) }
    } else if (change < 0) {
      return { direction: 'down', change: Math.abs(change) }
    }
    return { direction: 'stable', change: 0 }
  }

  if (isLoading) {
    return (
      <div 
        className={classNames("bg-white rounded-lg border border-gray-200 p-6", className)}
        data-testid={testId}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={classNames("bg-white rounded-lg border border-gray-200 p-6", className)}
      data-testid={testId}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Trending Tracks</h2>
            <p className="text-sm text-gray-500">Most popular tracks right now</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          <Select
            value={selectedTimeRange}
            onChange={(value) => setSelectedTimeRange(value as typeof selectedTimeRange)}
            className="text-sm"
            options={[
              { value: '24h', label: 'Last 24h' },
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: 'all', label: 'All time' },
            ]}
            testId="time-range-select"
          />
        </div>
      </div>

      {/* Trending Tracks List */}
      <div className="space-y-3">
        {trendingTracks.map((track, index) => {
          const rankChange = getRankChange(track.rank, track.previousRank)
          
          return (
            <div
              key={track.id}
              onClick={() => onTrackSelect(track)}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              {/* Rank */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                  {track.rank}
                </div>
                {rankChange && (
                  <div className={`flex items-center space-x-1 ${
                    rankChange.direction === 'up' ? 'text-green-600' :
                    rankChange.direction === 'down' ? 'text-red-600' :
                    'text-gray-500'
                  }`}>
                    {rankChange.direction === 'up' && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {rankChange.direction === 'down' && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="text-xs font-medium">
                      {rankChange.change}
                    </span>
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                  {track.title}
                </h3>
                <p className="text-sm text-gray-600 truncate">{track.artist}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {track.genre}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatPlayCount(track.playCount)} plays
                  </span>
                </div>
              </div>

              {/* Trend Indicator */}
              <div className="flex items-center space-x-2">
                {getTrendIcon(track.trend)}
                <span className={`text-sm font-medium ${getTrendColor(track.trend)}`}>
                  +{track.trendPercentage}%
                </span>
              </div>

              {/* Play Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onTrackSelect(track)
                }}
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      {/* View More Button */}
      <div className="mt-6 text-center">
        <button className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
          View all trending tracks →
        </button>
      </div>
    </div>
  )
}
