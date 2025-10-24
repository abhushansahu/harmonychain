// Core data types for HarmonyChain

export interface Track {
  id: string
  title: string
  artist: string
  artistId: string
  duration: number
  genre: string
  price: number
  coverArt: string
  audioFile: string
  ipfsHash: string
  isStreamable: boolean
  playCount: number
  owner: string
  createdAt: string
  updatedAt: string
}

export interface Artist {
  id: string
  name: string
  description: string
  avatar: string
  walletAddress: string
  totalTracks: number
  totalEarnings: number
  isVerified: boolean
  createdAt: string
}

export interface NFT {
  id: string
  trackId: string
  artistId: string
  owner: string
  price: number
  tokenId: string
  contractAddress: string
  metadata: NFTMetadata
  createdAt: string
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
}

export interface License {
  id: string
  trackId: string
  artistId: string
  licensee: string
  licenseType: 'sample' | 'remix' | 'commercial' | 'sync'
  fee: number
  permissions: LicensePermissions
  isActive: boolean
  createdAt: string
  expiresAt?: string
}

export interface LicensePermissions {
  canSample: boolean
  canRemix: boolean
  canCommercialUse: boolean
  canSync: boolean
  canDistribute: boolean
  canPerform: boolean
  canBroadcast: boolean
}

export interface Playlist {
  id: string
  name: string
  description: string
  owner: string
  tracks: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface GovernanceProposal {
  id: string
  title: string
  description: string
  proposer: string
  votesFor: number
  votesAgainst: number
  totalVotes: number
  status: 'active' | 'passed' | 'rejected' | 'executed'
  createdAt: string
  votingEndsAt: string
}

export interface User {
  id: string
  walletAddress: string
  username: string
  email?: string
  avatar?: string
  isArtist: boolean
  createdAt: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Player state types
export interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  queue: Track[]
  currentIndex: number
  repeatMode: 'none' | 'one' | 'all'
  shuffleMode: boolean
}

// Search and filter types
export interface SearchFilters {
  query: string
  genre?: string
  artist?: string
  minPrice?: number
  maxPrice?: number
  sortBy: 'newest' | 'oldest' | 'popular' | 'price_low' | 'price_high'
}

export interface SearchResult {
  tracks: Track[]
  artists: Artist[]
  total: number
  page: number
  limit: number
}

// Web3 types
export interface WalletState {
  isConnected: boolean
  address: string | null
  chainId: number | null
  balance: string | null
}

export interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  gasPrice: string
  status: 'pending' | 'success' | 'failed'
  createdAt: string
}

// Form types
export interface TrackUploadForm {
  title: string
  artist: string
  genre: string
  description: string
  price: number
  coverArt: File | null
  audioFile: File | null
  licenseType: 'free' | 'paid' | 'nft'
}

export interface NFTCreationForm {
  trackId: string
  name: string
  description: string
  price: number
  royaltyPercentage: number
  exclusiveContent?: string
}

export interface LicenseRequestForm {
  trackId: string
  licenseType: 'sample' | 'remix' | 'commercial' | 'sync'
  proposedFee: number
  usageDescription: string
  commercialIntent: boolean
}

// Analytics types
export interface AnalyticsData {
  totalPlays: number
  totalEarnings: number
  topTracks: Array<{
    track: Track
    plays: number
    earnings: number
  }>
  monthlyStats: Array<{
    month: string
    plays: number
    earnings: number
  }>
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onFocus?: () => void
  error?: string
  disabled?: boolean
}

export interface CardProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  image?: string
  onClick?: () => void
}
