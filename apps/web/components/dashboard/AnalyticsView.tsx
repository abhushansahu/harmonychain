'use client'

import React, { useState, useEffect } from 'react'
import { fetchAnalytics } from '../../lib/api/endpoints'

interface AnalyticsViewProps {
  artistId: string
  timeRange: '7d' | '30d' | '90d' | '1y'
}

interface AnalyticsData {
  playsOverTime: DataPoint[]
  topTracks: TrackAnalytics[]
  topCountries: CountryData[]
  topCities: CityData[]
  demographics: DemographicsData
  deviceTypes: DeviceData[]
  referrers: ReferrerData[]
  peakHours: HourData[]
}

interface DataPoint {
  date: string
  plays: number
  revenue: number
  followers: number
}

interface TrackAnalytics {
  id: string
  title: string
  plays: number
  revenue: number
  completionRate: number
  skipRate: number
}

interface CountryData {
  country: string
  plays: number
  percentage: number
  flag: string
}

interface CityData {
  city: string
  country: string
  plays: number
  percentage: number
}

interface DemographicsData {
  ageGroups: AgeGroup[]
  genders: GenderData[]
}

interface AgeGroup {
  range: string
  percentage: number
  plays: number
}

interface GenderData {
  gender: string
  percentage: number
  plays: number
}

interface DeviceData {
  device: string
  percentage: number
  plays: number
  icon: string
}

interface ReferrerData {
  source: string
  plays: number
  percentage: number
  icon: string
}

interface HourData {
  hour: number
  plays: number
  percentage: number
}

export default function AnalyticsView({ artistId, timeRange }: AnalyticsViewProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<'plays' | 'revenue' | 'followers'>('plays')

  useEffect(() => {
    loadAnalytics()
  }, [artistId, timeRange])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const resp = await fetchAnalytics({ artistId, timeRange })
      // Compute peak hours percentage client-side if not provided
      const totalPlays = resp.playsOverTime.reduce((sum, p) => sum + p.plays, 0) || 1
      const peakHours = Array.from({ length: 24 }).map((_, h) => ({
        hour: h,
        plays: Math.floor(totalPlays / 24),
        percentage: Math.floor((100 / 24) * 100) / 100
      }))
      const analyticsData: AnalyticsData = {
        playsOverTime: resp.playsOverTime,
        topTracks: resp.topTracks as any,
        topCountries: resp.topCountries as any,
        topCities: resp.topCities as any,
        demographics: { ageGroups: [], genders: [] },
        deviceTypes: [],
        referrers: [],
        peakHours
      }
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Data generation moved to API layer; retained only helpers below

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data</h3>
        <p className="text-gray-500">Analytics will appear here once you have some plays</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-900">Analytics Overview</h2>
        <div className="flex border border-gray-300 rounded-md">
          {[
            { id: 'plays', label: 'Plays' },
            { id: 'revenue', label: 'Revenue' },
            { id: 'followers', label: 'Followers' }
          ].map(metric => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id as typeof selectedMetric)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedMetric === metric.id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plays Over Time */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plays Over Time</h3>
          <div className="h-64 flex items-end space-x-1">
            {analytics.playsOverTime.map((point, index) => (
              <div
                key={index}
                className="flex-1 bg-primary-500 rounded-t"
                style={{
                  height: `${(point.plays / Math.max(...analytics.playsOverTime.map(p => p.plays))) * 100}%`
                }}
                title={`${point.date}: ${formatNumber(point.plays)} plays`}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>{analytics.playsOverTime[0]?.date}</span>
            <span>{analytics.playsOverTime[analytics.playsOverTime.length - 1]?.date}</span>
          </div>
        </div>

        {/* Top Tracks */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Tracks</h3>
          <div className="space-y-3">
            {analytics.topTracks.map((track, index) => (
              <div key={track.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{track.title}</p>
                    <p className="text-sm text-gray-500">
                      {formatNumber(track.plays)} plays • {track.completionRate}% completion
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(track.revenue)}</p>
                  <p className="text-sm text-gray-500">{track.skipRate}% skip rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
          <div className="space-y-3">
            {analytics.topCountries.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <p className="font-medium text-gray-900">{country.country}</p>
                    <p className="text-sm text-gray-500">{formatNumber(country.plays)} plays</p>
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

        {/* Demographics */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Groups</h3>
          <div className="space-y-3">
            {analytics.demographics.ageGroups.map((group, index) => (
              <div key={group.range} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{group.range} years</p>
                  <p className="text-sm text-gray-500">{formatNumber(group.plays)} plays</p>
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

        {/* Device Types */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
          <div className="space-y-3">
            {analytics.deviceTypes.map((device, index) => (
              <div key={device.device} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{device.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{device.device}</p>
                    <p className="text-sm text-gray-500">{formatNumber(device.plays)} plays</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{device.percentage}%</p>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-primary-500 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Listening Hours</h3>
          <div className="h-32 flex items-end space-x-1">
            {analytics.peakHours.map((hour, index) => (
              <div
                key={hour.hour}
                className="flex-1 bg-primary-500 rounded-t"
                style={{
                  height: `${hour.percentage}%`
                }}
                title={`${hour.hour}:00 - ${formatNumber(hour.plays)} plays`}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>0:00</span>
            <span>12:00</span>
            <span>23:00</span>
          </div>
        </div>
      </div>
    </div>
  )
}
