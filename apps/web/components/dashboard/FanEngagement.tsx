'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Users, Heart, MessageCircle, Share, TrendingUp, UserPlus } from 'lucide-react'

interface FanEngagementProps {
  className?: string
}

const FanEngagement: React.FC<FanEngagementProps> = ({ className }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  // Mock fan engagement data
  const fanStats = {
    totalFans: 1250,
    newFans: 45,
    activeFans: 320,
    engagementRate: 12.5
  }

  const engagementMetrics = [
    {
      label: 'Total Fans',
      value: fanStats.totalFans.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%'
    },
    {
      label: 'New Fans (30d)',
      value: fanStats.newFans.toString(),
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%'
    },
    {
      label: 'Active Fans',
      value: fanStats.activeFans.toLocaleString(),
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      change: '+15%'
    },
    {
      label: 'Engagement Rate',
      value: `${fanStats.engagementRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+2.1%'
    }
  ]

  const topFans = [
    {
      id: '1',
      name: 'CryptoMusicLover',
      avatar: '/api/placeholder/40/40',
      totalSpent: 25.50,
      tracksPurchased: 8,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'HarmonyFan2024',
      avatar: '/api/placeholder/40/40',
      totalSpent: 18.75,
      tracksPurchased: 5,
      lastActive: '1 day ago'
    },
    {
      id: '3',
      name: 'DeFiMusicCollector',
      avatar: '/api/placeholder/40/40',
      totalSpent: 42.00,
      tracksPurchased: 12,
      lastActive: '3 days ago'
    }
  ]

  const recentActivity = [
    {
      id: '1',
      type: 'follow',
      user: 'NewMusicFan',
      action: 'started following you',
      time: '2 hours ago',
      icon: UserPlus
    },
    {
      id: '2',
      type: 'purchase',
      user: 'CryptoMusicLover',
      action: 'purchased "Digital Dreams"',
      time: '4 hours ago',
      icon: Heart
    },
    {
      id: '3',
      type: 'share',
      user: 'HarmonyFan2024',
      action: 'shared your track',
      time: '6 hours ago',
      icon: Share
    },
    {
      id: '4',
      type: 'comment',
      user: 'DeFiMusicCollector',
      action: 'left a comment on your track',
      time: '1 day ago',
      icon: MessageCircle
    }
  ]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Time Range Selector */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {['7d', '30d', '90d'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range as any)}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded-md transition-colors',
              timeRange === range
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {range.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {engagementMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-green-600">{metric.change}</p>
              </div>
              <div className={cn('p-3 rounded-full', metric.bgColor)}>
                <metric.icon className={cn('w-6 h-6', metric.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Fans */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Fans</h3>
        <div className="space-y-4">
          {topFans.map((fan, index) => (
            <div key={fan.id} className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src={fan.avatar}
                  alt={fan.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{fan.name}</p>
                <p className="text-xs text-gray-500">
                  {fan.tracksPurchased} tracks • Last active {fan.lastActive}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${fan.totalSpent.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">total spent</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Fan Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-white rounded-full">
                <activity.icon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fan Engagement Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Fan Engagement Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm text-blue-800">
              <strong>Engage with comments:</strong> Respond to fan comments to build stronger relationships
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm text-blue-800">
              <strong>Share behind-the-scenes:</strong> Give fans a glimpse into your creative process
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm text-blue-800">
              <strong>Create exclusive content:</strong> Offer special tracks or early access to top fans
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm text-blue-800">
              <strong>Host live sessions:</strong> Connect with fans through live streaming or Q&A sessions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FanEngagement
