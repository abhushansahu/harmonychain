import { z } from 'zod'

// User Types
export const UserSchema = z.object({
  id: z.string(),
  walletAddress: z.string(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  avatar: z.string().optional(),
  isArtist: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type User = z.infer<typeof UserSchema>

// Track Types
export const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  artistId: z.string(),
  duration: z.number(),
  genre: z.string(),
  coverArt: z.string().optional(),
  audioFile: z.string(),
  ipfsHash: z.string(),
  tokenId: z.string().optional(),
  price: z.number().default(0),
  isStreamable: z.boolean().default(true),
  playCount: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Track = z.infer<typeof TrackSchema>

// NFT Types
export const NFTSchema = z.object({
  id: z.string(),
  tokenId: z.string(),
  contractAddress: z.string(),
  owner: z.string(),
  trackId: z.string(),
  price: z.number(),
  isListed: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type NFT = z.infer<typeof NFTSchema>

// Playlist Types
export const PlaylistSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  ownerId: z.string(),
  tracks: z.array(z.string()),
  isPublic: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Playlist = z.infer<typeof PlaylistSchema>

// License Types
export const LicenseSchema = z.object({
  id: z.string(),
  trackId: z.string(),
  licensee: z.string(),
  licenseType: z.enum(['streaming', 'commercial', 'sync']),
  price: z.number(),
  duration: z.number(), // in days
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  expiresAt: z.date()
})

export type License = z.infer<typeof LicenseSchema>

// API Response Types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional()
})

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Contract Types
export const ContractConfigSchema = z.object({
  network: z.string(),
  rpcUrl: z.string(),
  contractAddress: z.string(),
  privateKey: z.string().optional()
})

export type ContractConfig = z.infer<typeof ContractConfigSchema>