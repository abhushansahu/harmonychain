'use client'

import React from 'react'
import { AnalyticsData } from '@/lib/types'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { TrendingUp, Play, DollarSign, Users } from 'lucide-react'

interface AnalyticsViewProps {
  analytics: AnalyticsData
  className?: string
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, className }) => {
  const timeRanges = ['7d', '30d', '90d', '1y']
  const [selectedRange, setSelectedRange] = React.useState('30d')

  const metrics = [
    {
      label: 'Total Plays',
      value: formatNumber(analytics.totalPlays),
      icon: Play,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Total Earnings',
      value: formatCurrency(analytics.totalEarnings),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Avg. Plays/Day',
      value: formatNumber(Math.round(analytics.totalPlays / 30)),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Top Track Plays',
      value: formatNumber(analytics.topTracks[0]?.plays || 0),
      icon: Play,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Time Range Selector */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded-md transition-colors',
              selectedRange === range
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {range.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <div className={cn('p-2 rounded-full', metric.bgColor)}>
                <metric.icon className={cn('w-5 h-5', metric.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plays Over Time */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Plays Over Time</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
              <p className="text-sm text-gray-400">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        {/* Revenue Over Time */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Over Time</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
              <p className="text-sm text-gray-400">Integration with charting library needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Tracks */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Tracks</h3>
        <div className="space-y-4">
          {analytics.topTracks.map((trackData, index) => (
            <div key={trackData.track.id} className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                {trackData.track.coverArt ? (
                  <img
                    src={trackData.track.coverArt}
                    alt={trackData.track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Play className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {trackData.track.title}
                </p>
                <p className="text-xs text-gray-500">
                  {formatNumber(trackData.plays)} plays • {formatCurrency(trackData.earnings)} earned
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(trackData.earnings)}
                </p>
                <p className="text-xs text-gray-500">earned</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Stats Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plays
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.monthlyStats.map((stat, index) => (
                <tr key={stat.month}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stat.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatNumber(stat.plays)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(stat.earnings)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index > 0 ? (
                      <span className="text-green-600">
                        +{Math.round(((stat.plays - analytics.monthlyStats[index - 1].plays) / analytics.monthlyStats[index - 1].plays) * 100)}%
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsView
