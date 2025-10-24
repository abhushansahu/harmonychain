// Network Configuration
export const HARMONY_NETWORK = {
  mainnet: {
    chainId: 1666600000,
    name: 'Harmony Mainnet',
    rpcUrl: 'https://api.harmony.one',
    blockExplorer: 'https://explorer.harmony.one'
  },
  testnet: {
    chainId: 1666700000,
    name: 'Harmony Testnet',
    rpcUrl: 'https://api.s0.b.hmny.io',
    blockExplorer: 'https://explorer.pops.one'
  }
}

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  musicRegistry: '0x...', // Will be set after deployment
  nftMarketplace: '0x...', // Will be set after deployment
  royaltyDistributor: '0x...', // Will be set after deployment
  governanceDAO: '0x...' // Will be set after deployment
}

// API Endpoints
export const API_ENDPOINTS = {
  tracks: '/api/tracks',
  artists: '/api/artists',
  nfts: '/api/nfts',
  playlists: '/api/playlists',
  auth: '/api/auth',
  governance: '/api/governance',
  licenses: '/api/licenses'
}

// File Upload Limits
export const UPLOAD_LIMITS = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedAudioFormats: ['mp3', 'wav', 'flac', 'aac'],
  allowedImageFormats: ['jpg', 'jpeg', 'png', 'webp']
}

// Streaming Configuration
export const STREAMING_CONFIG = {
  chunkSize: 1024 * 1024, // 1MB chunks
  bufferSize: 5 * 1024 * 1024, // 5MB buffer
  maxConcurrentStreams: 100
}

// Royalty Configuration
export const ROYALTY_CONFIG = {
  artistPercentage: 70,
  platformPercentage: 20,
  governancePercentage: 10
}

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  NETWORK_ERROR: 'Network error',
  INSUFFICIENT_FUNDS: 'Insufficient funds',
  CONTRACT_ERROR: 'Smart contract error'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  TRACK_UPLOADED: 'Track uploaded successfully',
  NFT_MINTED: 'NFT minted successfully',
  PAYMENT_PROCESSED: 'Payment processed successfully',
  LICENSE_CREATED: 'License created successfully',
  VOTE_CAST: 'Vote cast successfully'
}