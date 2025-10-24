#!/usr/bin/env node

/**
 * HarmonyChain Seed Data Script
 * 
 * This script populates the database with realistic sample data for development and testing.
 * It only runs when explicitly called and respects the SEED_DATA environment variable.
 * 
 * Usage:
 *   npm run seed
 *   SEED_DATA=true npm run seed
 *   node scripts/seed-data.js
 */

const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

// Check if seeding is allowed
const SEED_DATA = process.env.SEED_DATA === 'true'
const NODE_ENV = process.env.NODE_ENV || 'development'

if (NODE_ENV === 'production' && !SEED_DATA) {
  console.log('❌ Seeding is disabled in production mode')
  process.exit(0)
}

if (!SEED_DATA && NODE_ENV !== 'development') {
  console.log('❌ Seeding is disabled. Set SEED_DATA=true to enable seeding')
  process.exit(0)
}

console.log('🌱 Starting HarmonyChain seed data generation...')

// Database directory
const DB_DIR = path.join(__dirname, '../apps/api/orbitdb')

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

// Helper function to create unique data
const createUniqueData = (baseData, count) => {
  return Array.from({ length: count }, (_, index) => ({
    ...baseData,
    id: uuidv4(),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }))
}

// Sample data templates
const sampleArtists = [
  {
    name: 'Luna Eclipse',
    bio: 'Electronic music producer and DJ from Berlin',
    genre: 'Electronic',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=face',
    socialLinks: {
      twitter: 'https://twitter.com/lunaeclipse',
      instagram: 'https://instagram.com/lunaeclipse'
    },
    verified: true,
    totalTracks: 0,
    totalPlays: 0,
    totalRevenue: 0
  },
  {
    name: 'River Stone',
    bio: 'Indie folk singer-songwriter from Portland',
    genre: 'Folk',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    socialLinks: {
      twitter: 'https://twitter.com/riverstone',
      youtube: 'https://youtube.com/riverstone'
    },
    verified: true,
    totalTracks: 0,
    totalPlays: 0,
    totalRevenue: 0
  },
  {
    name: 'Neon Dreams',
    bio: 'Synthwave duo creating retro-futuristic sounds',
    genre: 'Synthwave',
    avatar: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop&crop=face',
    socialLinks: {
      instagram: 'https://instagram.com/neondreams',
      spotify: 'https://open.spotify.com/artist/neondreams'
    },
    verified: false,
    totalTracks: 0,
    totalPlays: 0,
    totalRevenue: 0
  }
]

const sampleTracks = [
  {
    title: 'Midnight City',
    artist: 'Luna Eclipse',
    artistId: '', // Will be set after artists are created
    duration: 245, // 4:05
    genre: 'Electronic',
    price: 0.01,
    coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audioFile: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    ipfsHash: 'QmMockHash1',
    isStreamable: true,
    playCount: 0,
    owner: '', // Will be set after artists are created
    tags: ['electronic', 'ambient', 'chill'],
    description: 'A dreamy electronic track perfect for late-night listening'
  },
  {
    title: 'Forest Whispers',
    artist: 'River Stone',
    artistId: '', // Will be set after artists are created
    duration: 320, // 5:20
    genre: 'Folk',
    price: 0.02,
    coverArt: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    audioFile: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    ipfsHash: 'QmMockHash2',
    isStreamable: true,
    playCount: 0,
    owner: '', // Will be set after artists are created
    tags: ['folk', 'acoustic', 'nature'],
    description: 'An acoustic folk song inspired by nature and tranquility'
  },
  {
    title: 'Cyber Sunset',
    artist: 'Neon Dreams',
    artistId: '', // Will be set after artists are created
    duration: 280, // 4:40
    genre: 'Synthwave',
    price: 0.015,
    coverArt: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop',
    audioFile: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    ipfsHash: 'QmMockHash3',
    isStreamable: true,
    playCount: 0,
    owner: '', // Will be set after artists are created
    tags: ['synthwave', 'retro', 'cyberpunk'],
    description: 'A retro-futuristic synthwave track with neon vibes'
  }
]

const sampleNFTs = [
  {
    tokenId: 1,
    name: 'Midnight City NFT',
    description: 'Exclusive NFT for the track Midnight City',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    creator: '', // Will be set after artists are created
    owner: '', // Will be set after artists are created
    price: 0.1,
    isListed: true,
    trackId: '', // Will be set after tracks are created
    metadata: {
      attributes: [
        { trait_type: 'Genre', value: 'Electronic' },
        { trait_type: 'Rarity', value: 'Common' },
        { trait_type: 'Year', value: '2024' }
      ]
    }
  },
  {
    tokenId: 2,
    name: 'Forest Whispers NFT',
    description: 'Exclusive NFT for the track Forest Whispers',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    creator: '', // Will be set after artists are created
    owner: '', // Will be set after artists are created
    price: 0.15,
    isListed: true,
    trackId: '', // Will be set after tracks are created
    metadata: {
      attributes: [
        { trait_type: 'Genre', value: 'Folk' },
        { trait_type: 'Rarity', value: 'Rare' },
        { trait_type: 'Year', value: '2024' }
      ]
    }
  }
]

const samplePlaylists = [
  {
    name: 'Chill Electronic Vibes',
    description: 'A curated collection of relaxing electronic music',
    owner: '', // Will be set after users are created
    tracks: [], // Will be populated after tracks are created
    isPublic: true,
    coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    tags: ['electronic', 'chill', 'ambient']
  },
  {
    name: 'Acoustic Sessions',
    description: 'Beautiful acoustic and folk music',
    owner: '', // Will be set after users are created
    tracks: [], // Will be populated after tracks are created
    isPublic: true,
    coverArt: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    tags: ['acoustic', 'folk', 'indie']
  }
]

const sampleUsers = [
  {
    address: '0x1234567890123456789012345678901234567890',
    name: 'Music Lover',
    email: 'musiclover@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    isArtist: false,
    preferences: {
      genres: ['Electronic', 'Folk', 'Synthwave'],
      notifications: true
    }
  },
  {
    address: '0x2345678901234567890123456789012345678901',
    name: 'Art Collector',
    email: 'collector@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    isArtist: false,
    preferences: {
      genres: ['Electronic', 'Synthwave'],
      notifications: true
    }
  }
]

// Generate seed data
const generateSeedData = () => {
  console.log('📝 Generating seed data...')

  // Create artists
  const artists = createUniqueData(sampleArtists[0], 1)
    .concat(createUniqueData(sampleArtists[1], 1))
    .concat(createUniqueData(sampleArtists[2], 1))

  // Create users
  const users = createUniqueData(sampleUsers[0], 1)
    .concat(createUniqueData(sampleUsers[1], 1))

  // Create tracks with proper artist references
  const tracks = sampleTracks.map((track, index) => ({
    ...track,
    artistId: artists[index].id,
    owner: artists[index].id
  }))

  // Create NFTs with proper references
  const nfts = sampleNFTs.map((nft, index) => ({
    ...nft,
    creator: artists[index].id,
    owner: users[index].id,
    trackId: tracks[index].id
  }))

  // Create playlists with proper references
  const playlists = samplePlaylists.map((playlist, index) => ({
    ...playlist,
    owner: users[index].id,
    tracks: [tracks[index].id]
  }))

  // Create governance proposals
  const proposals = [
    {
      title: 'Increase Platform Fee to 2.5%',
      description: 'Proposal to increase the platform fee from 2% to 2.5% to fund development',
      proposer: users[0].id,
      status: 'active',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      votesFor: 0,
      votesAgainst: 0,
      totalVotes: 0,
      quorum: 100,
      executionDelay: 24 * 60 * 60 * 1000 // 24 hours
    },
    {
      title: 'Add New Music Genre Categories',
      description: 'Proposal to add experimental and ambient as new genre categories',
      proposer: users[1].id,
      status: 'pending',
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      votesFor: 0,
      votesAgainst: 0,
      totalVotes: 0,
      quorum: 100,
      executionDelay: 24 * 60 * 60 * 1000
    }
  ]

  // Create licenses
  const licenses = [
    {
      trackId: tracks[0].id,
      type: 'commercial',
      price: 0.1,
      terms: 'Commercial use allowed with attribution',
      isActive: true,
      maxUses: 1000,
      usedCount: 0
    },
    {
      trackId: tracks[1].id,
      type: 'personal',
      price: 0.05,
      terms: 'Personal use only',
      isActive: true,
      maxUses: 100,
      usedCount: 0
    }
  ]

  // Create transactions
  const transactions = [
    {
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      type: 'track_upload',
      from: artists[0].id,
      to: '0x0000000000000000000000000000000000000000',
      amount: 0.01,
      status: 'confirmed',
      blockNumber: 12345,
      gasUsed: 21000
    },
    {
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      type: 'nft_purchase',
      from: users[0].id,
      to: artists[0].id,
      amount: 0.1,
      status: 'confirmed',
      blockNumber: 12346,
      gasUsed: 50000
    }
  ]

  // Create analytics data
  const analytics = [
    {
      trackId: tracks[0].id,
      date: new Date().toISOString().split('T')[0],
      plays: 150,
      revenue: 0.15,
      uniqueListeners: 45
    },
    {
      trackId: tracks[1].id,
      date: new Date().toISOString().split('T')[0],
      plays: 89,
      revenue: 0.089,
      uniqueListeners: 32
    }
  ]

  return {
    artists,
    users,
    tracks,
    nfts,
    playlists,
    proposals,
    licenses,
    transactions,
    analytics,
    votes: [],
    // Empty arrays for other entities
    users: users,
    tracks: tracks,
    nfts: nfts,
    playlists: playlists,
    licenses: licenses,
    proposals: proposals,
    votes: [],
    transactions: transactions,
    analytics: analytics
  }
}

// Write data to files
const writeSeedData = (data) => {
  console.log('💾 Writing seed data to database...')

  const files = {
    artists: data.artists,
    users: data.users,
    tracks: data.tracks,
    nfts: data.nfts,
    playlists: data.playlists,
    licenses: data.licenses,
    proposals: data.proposals,
    votes: data.votes,
    transactions: data.transactions,
    analytics: data.analytics
  }

  Object.entries(files).forEach(([filename, content]) => {
    const filePath = path.join(DB_DIR, `${filename}.json`)
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2))
    console.log(`✅ Created ${filename}.json with ${content.length} records`)
  })
}

// Main execution
try {
  const seedData = generateSeedData()
  writeSeedData(seedData)
  
  console.log('🎉 Seed data generation completed successfully!')
  console.log(`📊 Generated:`)
  console.log(`   - ${seedData.artists.length} artists`)
  console.log(`   - ${seedData.users.length} users`)
  console.log(`   - ${seedData.tracks.length} tracks`)
  console.log(`   - ${seedData.nfts.length} NFTs`)
  console.log(`   - ${seedData.playlists.length} playlists`)
  console.log(`   - ${seedData.proposals.length} governance proposals`)
  console.log(`   - ${seedData.licenses.length} licenses`)
  console.log(`   - ${seedData.transactions.length} transactions`)
  console.log(`   - ${seedData.analytics.length} analytics records`)
  
} catch (error) {
  console.error('❌ Error generating seed data:', error)
  process.exit(1)
}
