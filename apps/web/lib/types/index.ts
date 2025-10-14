// Core domain types for HarmonyChain
export interface User {
  id: string
  address: string
  name: string
  email?: string
  avatar?: string
  signature: string
  message: string
  timestamp: number
  isVerified: boolean
  totalTracks: number
  totalFollowers: number
  totalFollowing: number
}

export interface Track {
  id: string
  title: string
  artist: string
  artistAddress: string
  artistId: string
  ipfsHash: string
  genre: string
  playCount: number
  createdAt: number
  updatedAt: number
  duration?: number
  description?: string
  tags: string[]
  isPublished: boolean
  isNftMinted: boolean
  nftPrice?: number
  nftSales?: number
  totalRevenue: number
  royaltyPercentage: number
}

export interface Artist {
  id: string
  walletAddress: string
  name: string
  bio?: string
  avatar?: string
  totalTracks: number
  totalPlays: number
  totalRevenue: number
  isVerified: boolean
  socialLinks: SocialLink[]
  createdAt: number
}

export interface SocialLink {
  platform: string
  url: string
  followers?: number
}

export interface Playlist {
  id: string
  name: string
  description?: string
  trackCount: number
  isPublic: boolean
  createdAt: number
  updatedAt: number
  ownerId: string
  tracks: Track[]
}

export interface NFT {
  id: string
  trackId: string
  title: string
  description: string
  imageUrl: string
  animationUrl?: string
  price: number
  currency: 'ETH' | 'USDC' | 'USDT'
  supply: number
  available: number
  royaltyPercentage: number
  attributes: NFTAttribute[]
  metadata: NFTMetadata
  owner: string
  creator: string
  contractAddress: string
  tokenId: string
  createdAt: number
  isListed: boolean
  isAuction: boolean
  auctionEndTime?: number
  currentBid?: number
  bidCount?: number
}

export interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: 'string' | 'number' | 'date' | 'boost_number' | 'boost_percentage'
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  animation_url?: string
  external_url?: string
  attributes: NFTAttribute[]
  properties?: Record<string, any>
}

export interface License {
  id: string
  trackId: string
  title: string
  description: string
  type: 'standard' | 'commercial' | 'sync' | 'performance' | 'mechanical' | 'custom'
  permissions: LicensePermission[]
  restrictions: LicenseRestriction[]
  pricing: LicensePricing
  terms: LicenseTerms
  isActive: boolean
  createdAt: number
  updatedAt: number
  totalRequests: number
  approvedRequests: number
  totalRevenue: number
}

export interface LicensePermission {
  id: string
  name: string
  description: string
  type: 'streaming' | 'download' | 'sync' | 'performance' | 'mechanical' | 'derivative'
  isIncluded: boolean
  additionalFee?: number
  conditions?: PermissionCondition[]
  isRequired: boolean
  isExclusive: boolean
}

export interface PermissionCondition {
  id: string
  type: 'geographic' | 'time' | 'platform' | 'usage_limit' | 'attribution'
  value: string
  isActive: boolean
}

export interface LicenseRestriction {
  id: string
  name: string
  description: string
  type: 'geographic' | 'time' | 'platform' | 'usage' | 'distribution' | 'commercial'
  value: string
  isActive: boolean
  severity: 'warning' | 'blocking' | 'conditional'
}

export interface LicensePricing {
  basePrice: number
  currency: 'ETH' | 'USDC' | 'USDT'
  pricingModel: 'fixed' | 'percentage' | 'tiered' | 'dynamic'
  tiers?: PricingTier[]
  percentage?: number
  minimumFee?: number
  maximumFee?: number
}

export interface PricingTier {
  id: string
  name: string
  minQuantity: number
  maxQuantity?: number
  price: number
  description: string
}

export interface LicenseTerms {
  duration: number
  territory: string[]
  exclusivity: 'exclusive' | 'non-exclusive' | 'semi-exclusive'
  renewal: 'automatic' | 'manual' | 'none'
  termination: string[]
  attribution: string
  reporting: 'monthly' | 'quarterly' | 'annually' | 'none'
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SearchParams {
  query: string
  genre?: string
  artist?: string
  tags?: string[]
  dateRange?: {
    start: number
    end: number
  }
}

// Analytics types
export interface AnalyticsData {
  totalPlays: number
  totalRevenue: number
  totalFollowers: number
  monthlyPlays: number
  monthlyRevenue: number
  topTracks: TrackAnalytics[]
  demographics: DemographicsData
  deviceTypes: DeviceData[]
  geographicData: GeographicData[]
  peakHours: HourData[]
}

export interface TrackAnalytics {
  trackId: string
  title: string
  plays: number
  revenue: number
  completionRate: number
  skipRate: number
  uniqueListeners: number
  averageListenTime: number
}

export interface DemographicsData {
  ageGroups: AgeGroup[]
  genders: GenderData[]
  countries: CountryData[]
}

export interface AgeGroup {
  range: string
  count: number
  percentage: number
}

export interface GenderData {
  gender: string
  count: number
  percentage: number
}

export interface CountryData {
  country: string
  count: number
  percentage: number
  flag: string
}

export interface DeviceData {
  device: string
  percentage: number
  count: number
  icon: string
}

export interface GeographicData {
  country: string
  city: string
  count: number
  percentage: number
  flag: string
}

export interface HourData {
  hour: number
  count: number
  percentage: number
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  testId?: string
}

export interface LoadingProps extends BaseComponentProps {
  isLoading: boolean
  loadingText?: string
  size?: 'sm' | 'md' | 'lg'
}

export interface ErrorProps extends BaseComponentProps {
  error: string
  onRetry?: () => void
  retryText?: string
}

export interface EmptyStateProps extends BaseComponentProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

// Form types
export interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'textarea'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  value?: string | number
  onChange?: (value: string | number) => void
  className?: string
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[]
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  disabled?: boolean
  error?: string
}

// Event types
export interface TrackEvent {
  type: 'play' | 'pause' | 'skip' | 'complete' | 'seek'
  trackId: string
  timestamp: number
  position?: number
  duration?: number
}

export interface UserEvent {
  type: 'login' | 'logout' | 'upload' | 'purchase' | 'share'
  userId: string
  timestamp: number
  metadata?: Record<string, any>
}

// Utility types
export type Status = 'idle' | 'loading' | 'success' | 'error'
export type SortOrder = 'asc' | 'desc'
export type ViewMode = 'grid' | 'list'
export type TimeRange = '7d' | '30d' | '90d' | '1y'
export type Currency = 'ETH' | 'USDC' | 'USDT'
export type Theme = 'light' | 'dark' | 'system'
