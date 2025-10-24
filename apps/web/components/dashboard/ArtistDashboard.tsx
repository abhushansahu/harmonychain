'use client'

import React, { useState } from 'react'
import { Artist, Track, AnalyticsData } from '@/lib/types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Music, TrendingUp, Users, DollarSign, Plus, Settings } from 'lucide-react'
import AnalyticsView from './AnalyticsView'
import RevenueTracker from './RevenueTracker'
import FanEngagement from './FanEngagement'
import ContentManager from './ContentManager'
import Button from '@/components/ui/Button'

interface ArtistDashboardProps {
  artist: Artist
  tracks: Track[]
  analytics: AnalyticsData
  className?: string
}

const ArtistDashboard: React.FC<ArtistDashboardProps> = ({
  artist,
  tracks,
  analytics,
  className
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'revenue' | 'fans' | 'content'>('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Music },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'fans', label: 'Fans', icon: Users },
    { id: 'content', label: 'Content', icon: Music }
  ]

  const stats = [
    {
      label: 'Total Tracks',
      value: artist.totalTracks.toString(),
      icon: Music,
      color: 'text-blue-600'
    },
    {
      label: 'Total Earnings',
      value: formatCurrency(artist.totalEarnings),
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      label: 'Total Plays',
      value: formatNumber(analytics.totalPlays),
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      label: 'Monthly Revenue',
      value: formatCurrency(analytics.monthlyStats[analytics.monthlyStats.length - 1]?.earnings || 0),
      icon: DollarSign,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
              {artist.avatar ? (
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <Music className="w-8 h-8" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{artist.name}</h1>
              <p className="text-gray-600">{artist.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={cn(
                  'px-2 py-1 text-xs font-medium rounded-full',
                  artist.isVerified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                )}>
                  {artist.isVerified ? 'Verified Artist' : 'Unverified'}
                </span>
                <span className="text-sm text-gray-500">
                  {artist.totalTracks} tracks
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Upload Track
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={cn('p-3 rounded-full', stat.color.replace('text-', 'bg-').replace('-600', '-100'))}>
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New track uploaded</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Track purchased</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New fan followed</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Top Tracks</h3>
                  <div className="space-y-3">
                    {tracks.slice(0, 3).map((track, index) => (
                      <div key={track.id} className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{track.title}</p>
                          <p className="text-xs text-gray-500">{track.playCount} plays</p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(track.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && <AnalyticsView analytics={analytics} />}
          {activeTab === 'revenue' && <RevenueTracker analytics={analytics} />}
          {activeTab === 'fans' && <FanEngagement />}
          {activeTab === 'content' && <ContentManager 
            tracks={tracks} 
            onEditTrack={(track) => console.log('Edit track:', track)}
            onDeleteTrack={(trackId) => console.log('Delete track:', trackId)}
            onPlayTrack={(track) => console.log('Play track:', track)}
          />}
        </div>
      </div>
    </div>
  )
}

export default ArtistDashboard
