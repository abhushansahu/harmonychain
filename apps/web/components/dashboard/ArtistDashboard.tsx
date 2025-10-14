'use client'

import React, { useState, useEffect } from 'react'
import { Select } from '../ui/Select'
import AnalyticsView from './AnalyticsView'
import RevenueTracker from './RevenueTracker'
import FanEngagement from './FanEngagement'
import ContentManager from './ContentManager'
import { Track, Artist } from '../../lib/core/types'

interface ArtistDashboardProps {
  artistId: string
  onTrackSelect?: (track: Track) => void
  onTrackEdit?: (track: Track) => void
  onTrackDelete?: (trackId: string) => void
}

interface DashboardStats {
  totalTracks: number
  totalPlays: number
  totalRevenue: number
  totalFollowers: number
  monthlyPlays: number
  monthlyRevenue: number
  topTrack: Track | null
  recentActivity: Activity[]
}

interface Activity {
  id: string
  type: 'play' | 'follow' | 'purchase' | 'comment' | 'share'
  description: string
  timestamp: number
  value?: number
  user?: string
}

export default function ArtistDashboard({
  artistId,
  onTrackSelect,
  onTrackEdit,
  onTrackDelete
}: ArtistDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'revenue' | 'fans' | 'content'>('overview')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    loadDashboardData()
  }, [artistId, timeRange])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Mock implementation - in real app, this would call your API
      const mockStats: DashboardStats = {
        totalTracks: 25,
        totalPlays: 125000,
        totalRevenue: 2.5,
        totalFollowers: 1250,
        monthlyPlays: 15000,
        monthlyRevenue: 0.3,
        topTrack: {
          id: 'top-track-1',
          title: 'Hit Song',
          artist: 'Your Name',
          artistAddress: '0x123...',
          ipfsHash: 'QmHash1',
          genre: 'Electronic',
          playCount: 25000,
          createdAt: Date.now() - 86400000 * 7
        },
        recentActivity: [
          {
            id: '1',
            type: 'play',
            description: 'New play from listener',
            timestamp: Date.now() - 300000,
            user: 'user123'
          },
          {
            id: '2',
            type: 'follow',
            description: 'New follower',
            timestamp: Date.now() - 600000,
            user: 'user456'
          },
          {
            id: '3',
            type: 'purchase',
            description: 'NFT purchased',
            timestamp: Date.now() - 900000,
            value: 0.1,
            user: 'user789'
          }
        ]
      }
      setStats(mockStats)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(3)} ETH`
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'play':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )
      case 'follow':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'purchase':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
          </svg>
        )
      case 'comment':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        )
      case 'share':
        return (
          <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3 3 0 000-1.818l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
        )
    }
  }

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) {
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else {
      return `${days}d ago`
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Artist Dashboard</h1>
            <p className="text-gray-600">Manage your music and track your success</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="text-sm"
              options={[
                { value: '7d', label: 'Last 7 days' },
                { value: '30d', label: 'Last 30 days' },
                { value: '90d', label: 'Last 90 days' },
                { value: '1y', label: 'Last year' }
              ]}
              testId="dashboard-time-range-select"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'revenue', label: 'Revenue', icon: '💰' },
            { id: 'fans', label: 'Fans', icon: '👥' },
            { id: 'content', label: 'Content', icon: '🎵' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">Total Tracks</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalTracks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">Total Plays</p>
                    <p className="text-2xl font-bold text-green-900">{formatNumber(stats.totalPlays)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-yellow-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-yellow-900">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600">Followers</p>
                    <p className="text-2xl font-bold text-purple-900">{formatNumber(stats.totalFollowers)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plays</span>
                    <span className="font-semibold text-gray-900">{formatNumber(stats.monthlyPlays)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Track</h3>
                {stats.topTrack ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{stats.topTrack.title}</p>
                      <p className="text-sm text-gray-600">{formatNumber(stats.topTrack.playCount)} plays</p>
                    </div>
                    <button
                      onClick={() => onTrackSelect?.(stats.topTrack!)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">No tracks yet</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {stats.recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                    {activity.value && (
                      <span className="text-sm font-medium text-green-600">
                        +{formatCurrency(activity.value)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView artistId={artistId} timeRange={timeRange} />
        )}

        {activeTab === 'revenue' && (
          <RevenueTracker artistId={artistId} timeRange={timeRange} />
        )}

        {activeTab === 'fans' && (
          <FanEngagement artistId={artistId} timeRange={timeRange} />
        )}

        {activeTab === 'content' && (
          <ContentManager
            artistId={artistId}
            onTrackSelect={onTrackSelect}
            onTrackEdit={onTrackEdit}
            onTrackDelete={onTrackDelete}
          />
        )}
      </div>
    </div>
  )
}
