'use client'

import React, { useState, useEffect } from 'react'

interface FanEngagementProps {
  artistId: string
  timeRange: '7d' | '30d' | '90d' | '1y'
}

interface FanData {
  totalFollowers: number
  newFollowers: number
  followerGrowth: FollowerGrowth[]
  topFans: TopFan[]
  fanActivity: FanActivity[]
  demographics: FanDemographics
  engagementMetrics: EngagementMetrics
  fanLocations: FanLocation[]
  socialConnections: SocialConnection[]
}

interface FollowerGrowth {
  date: string
  followers: number
  newFollowers: number
}

interface TopFan {
  id: string
  name: string
  avatar?: string
  totalPlays: number
  totalSpent: number
  joinDate: number
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  badges: string[]
}

interface FanActivity {
  id: string
  fanId: string
  fanName: string
  action: 'play' | 'follow' | 'share' | 'comment' | 'purchase' | 'tip'
  trackId?: string
  trackTitle?: string
  timestamp: number
  value?: number
}

interface FanDemographics {
  ageGroups: AgeGroup[]
  genders: GenderData[]
  countries: CountryData[]
}

interface AgeGroup {
  range: string
  count: number
  percentage: number
}

interface GenderData {
  gender: string
  count: number
  percentage: number
}

interface CountryData {
  country: string
  count: number
  percentage: number
  flag: string
}

interface EngagementMetrics {
  averagePlaysPerFan: number
  retentionRate: number
  engagementRate: number
  shareRate: number
  commentRate: number
}

interface FanLocation {
  city: string
  country: string
  count: number
  percentage: number
}

interface SocialConnection {
  platform: string
  followers: number
  engagement: number
  icon: string
  color: string
}

export default function FanEngagement({ artistId, timeRange }: FanEngagementProps) {
  const [fanData, setFanData] = useState<FanData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<'followers' | 'engagement' | 'activity'>('followers')

  useEffect(() => {
    loadFanData()
  }, [artistId, timeRange])

  const loadFanData = async () => {
    setIsLoading(true)
    try {
      // Mock implementation - in real app, this would call your API
      const mockFanData: FanData = {
        totalFollowers: 1250,
        newFollowers: 45,
        followerGrowth: generateFollowerGrowth(),
        topFans: [
          {
            id: '1',
            name: 'MusicLover123',
            totalPlays: 2500,
            totalSpent: 0.5,
            joinDate: Date.now() - 86400000 * 30,
            level: 'platinum',
            badges: ['Early Supporter', 'Super Fan', 'NFT Collector']
          },
          {
            id: '2',
            name: 'BeatMaster',
            totalPlays: 1800,
            totalSpent: 0.3,
            joinDate: Date.now() - 86400000 * 15,
            level: 'gold',
            badges: ['Super Fan', 'Playlist Creator']
          },
          {
            id: '3',
            name: 'SoundExplorer',
            totalPlays: 1200,
            totalSpent: 0.2,
            joinDate: Date.now() - 86400000 * 7,
            level: 'silver',
            badges: ['New Fan']
          }
        ],
        fanActivity: [
          {
            id: '1',
            fanId: '1',
            fanName: 'MusicLover123',
            action: 'play',
            trackId: 'track1',
            trackTitle: 'Hit Song',
            timestamp: Date.now() - 300000
          },
          {
            id: '2',
            fanId: '2',
            fanName: 'BeatMaster',
            action: 'share',
            trackId: 'track2',
            trackTitle: 'Another Track',
            timestamp: Date.now() - 600000
          },
          {
            id: '3',
            fanId: '3',
            fanName: 'SoundExplorer',
            action: 'purchase',
            trackId: 'track1',
            trackTitle: 'Hit Song',
            timestamp: Date.now() - 900000,
            value: 0.1
          }
        ],
        demographics: {
          ageGroups: [
            { range: '18-24', count: 450, percentage: 36 },
            { range: '25-34', count: 375, percentage: 30 },
            { range: '35-44', count: 250, percentage: 20 },
            { range: '45-54', count: 125, percentage: 10 },
            { range: '55+', count: 50, percentage: 4 }
          ],
          genders: [
            { gender: 'Male', count: 625, percentage: 50 },
            { gender: 'Female', count: 500, percentage: 40 },
            { gender: 'Other', count: 125, percentage: 10 }
          ],
          countries: [
            { country: 'United States', count: 500, percentage: 40, flag: '🇺🇸' },
            { country: 'United Kingdom', count: 250, percentage: 20, flag: '🇬🇧' },
            { country: 'Canada', count: 125, percentage: 10, flag: '🇨🇦' },
            { country: 'Germany', count: 100, percentage: 8, flag: '🇩🇪' },
            { country: 'France', count: 75, percentage: 6, flag: '🇫🇷' }
          ]
        },
        engagementMetrics: {
          averagePlaysPerFan: 12.5,
          retentionRate: 78,
          engagementRate: 45,
          shareRate: 15,
          commentRate: 8
        },
        fanLocations: [
          { city: 'New York', country: 'United States', count: 150, percentage: 12 },
          { city: 'London', country: 'United Kingdom', count: 100, percentage: 8 },
          { city: 'Toronto', country: 'Canada', count: 75, percentage: 6 },
          { city: 'Berlin', country: 'Germany', count: 50, percentage: 4 },
          { city: 'Los Angeles', country: 'United States', count: 45, percentage: 4 }
        ],
        socialConnections: [
          { platform: 'Twitter', followers: 5000, engagement: 3.2, icon: '🐦', color: 'bg-blue-500' },
          { platform: 'Instagram', followers: 3500, engagement: 4.1, icon: '📷', color: 'bg-pink-500' },
          { platform: 'TikTok', followers: 2800, engagement: 5.8, icon: '🎵', color: 'bg-black' },
          { platform: 'YouTube', followers: 1200, engagement: 2.5, icon: '📺', color: 'bg-red-500' }
        ]
      }
      setFanData(mockFanData)
    } catch (error) {
      console.error('Failed to load fan data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateFollowerGrowth = (): FollowerGrowth[] => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const data: FollowerGrowth[] = []
    let currentFollowers = 1000
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const newFollowers = Math.floor(Math.random() * 10) + 1
      currentFollowers += newFollowers
      
      data.push({
        date: date.toISOString().split('T')[0],
        followers: currentFollowers,
        newFollowers
      })
    }
    
    return data
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'platinum':
        return 'bg-gradient-to-r from-gray-400 to-gray-600'
      case 'gold':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 'silver':
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 'bronze':
        return 'bg-gradient-to-r from-orange-400 to-orange-600'
      default:
        return 'bg-gray-400'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'play':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )
      case 'follow':
        return (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'share':
        return (
          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3 3 0 000-1.818l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
        )
      case 'comment':
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        )
      case 'purchase':
        return (
          <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
          </svg>
        )
      case 'tip':
        return (
          <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
          </svg>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!fanData) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No fan data</h3>
        <p className="text-gray-500">Fan engagement data will appear here once you have followers</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Fan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Followers</p>
              <p className="text-2xl font-bold text-blue-900">{formatNumber(fanData.totalFollowers)}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">New This Period</p>
              <p className="text-2xl font-bold text-green-900">+{fanData.newFollowers}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-purple-900">{fanData.engagementMetrics.engagementRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Retention Rate</p>
              <p className="text-2xl font-bold text-yellow-900">{fanData.engagementMetrics.retentionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Fans */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Fans</h3>
        <div className="space-y-4">
          {fanData.topFans.map((fan, index) => (
            <div key={fan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                  {fan.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">{fan.name}</p>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getLevelColor(fan.level)}`}>
                      {fan.level}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-sm text-gray-500">{formatNumber(fan.totalPlays)} plays</p>
                    <p className="text-sm text-gray-500">{formatCurrency(fan.totalSpent)} spent</p>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    {fan.badges.map((badge, badgeIndex) => (
                      <span key={badgeIndex} className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">#{index + 1}</p>
                <p className="text-sm text-gray-500">Top Fan</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fan Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Fan Activity</h3>
        <div className="space-y-3">
          {fanData.fanActivity.map(activity => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {getActionIcon(activity.action)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-semibold">{activity.fanName}</span> {activity.action}ed
                  {activity.trackTitle && (
                    <span className="text-gray-600"> "{activity.trackTitle}"</span>
                  )}
                </p>
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

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Groups</h3>
          <div className="space-y-3">
            {fanData.demographics.ageGroups.map((group, index) => (
              <div key={group.range} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{group.range} years</p>
                  <p className="text-sm text-gray-500">{formatNumber(group.count)} fans</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{group.percentage}%</p>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-primary-500 rounded-full"
                      style={{ width: `${group.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
          <div className="space-y-3">
            {fanData.demographics.countries.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{country.flag}</span>
                  <div>
                    <p className="font-medium text-gray-900">{country.country}</p>
                    <p className="text-sm text-gray-500">{formatNumber(country.count)} fans</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{country.percentage}%</p>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-primary-500 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Connections</h3>
          <div className="space-y-3">
            {fanData.socialConnections.map((connection, index) => (
              <div key={connection.platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{connection.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{connection.platform}</p>
                    <p className="text-sm text-gray-500">{formatNumber(connection.followers)} followers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{connection.engagement}%</p>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${connection.color}`}
                      style={{ width: `${connection.engagement * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
