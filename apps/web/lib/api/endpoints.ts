import { apiClient } from './client'

export interface TrendingResponse {
  tracks: Array<{
    id: string
    title: string
    artist: string
    artistAddress?: string
    ipfsHash: string
    genre?: string
    playCount: number
    createdAt: number
    rank?: number
    previousRank?: number
    trend?: 'up' | 'down' | 'stable'
    trendPercentage?: number
  }>
}

export function fetchTrending(params: { timeRange: '24h' | '7d' | '30d' | 'all'; limit: number }) {
  return apiClient.get<TrendingResponse>('/trending', params)
}

export interface AnalyticsResponse {
  playsOverTime: Array<{ date: string; plays: number; revenue: number; followers: number }>
  topTracks: Array<{ id: string; title: string; plays: number; revenue: number; completionRate: number; skipRate: number }>
  topCountries: Array<{ country: string; plays: number; percentage: number; flag?: string }>
  topCities: Array<{ city: string; country: string; plays: number; percentage: number }>
}

export function fetchAnalytics(params: { artistId: string; timeRange: '7d' | '30d' | '90d' | '1y' }) {
  return apiClient.get<AnalyticsResponse>('/analytics', params)
}


