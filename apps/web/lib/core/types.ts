// Core types for HarmonyChain
export interface User {
  address: string
  signature: string
  message: string
  timestamp: number
}

export interface Track {
  id: string
  title: string
  artist: string
  artistAddress: string
  ipfsHash: string
  genre: string
  playCount: number
  createdAt: number
}

export interface Artist {
  id: string
  walletAddress: string
  name: string
  totalTracks: number
  isVerified: boolean
}

export interface Playlist {
  id: string
  name: string
  trackCount: number
  isPublic: boolean
  createdAt: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface SearchParams {
  query: string
  genre?: string
  artist?: string
}
