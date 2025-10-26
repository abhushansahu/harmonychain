#!/usr/bin/env node

/**
 * HarmonyChain Production Seed Data Script
 * This script populates the database with comprehensive sample data for all entities
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Ensure orbitdb directory exists
const orbitdbPath = path.join(__dirname, '../apps/api/orbitdb');
if (!fs.existsSync(orbitdbPath)) {
  fs.mkdirSync(orbitdbPath, { recursive: true });
}

// Helper function to generate realistic data
const generateId = () => crypto.randomUUID();
const generateHash = () => 'Qm' + crypto.randomBytes(32).toString('hex');
const generateAddress = () => '0x' + crypto.randomBytes(20).toString('hex');
const generateDate = (daysAgo = 0) => new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

// Sample data
const genres = ['Electronic', 'Hip-Hop', 'Rock', 'Jazz', 'Classical', 'Pop', 'Blues', 'Folk', 'Reggae', 'Country'];
const artists = [
  { name: 'CryptoBeats', bio: 'Electronic music producer and blockchain enthusiast', verified: true },
  { name: 'DeFi Diva', bio: 'Hip-hop artist exploring Web3 culture', verified: true },
  { name: 'Blockchain Blues', bio: 'Blues musician with a passion for decentralization', verified: false },
  { name: 'Web3 Orchestra', bio: 'Classical ensemble embracing digital innovation', verified: true },
  { name: 'Harmony Hacker', bio: 'Experimental electronic artist', verified: false },
  { name: 'NFT Rocker', bio: 'Rock musician pioneering music NFTs', verified: true },
  { name: 'Decentralized Diva', bio: 'Pop artist with Web3 values', verified: true },
  { name: 'Smart Contract Singer', bio: 'Folk artist exploring blockchain themes', verified: false }
];

const trackTitles = [
  'Digital Dreams', 'Blockchain Symphony', 'Web3 Revolution', 'Crypto Love Song',
  'Decentralized Dance', 'Smart Contract Blues', 'NFT Anthem', 'DAO Dreams',
  'Harmony Hymn', 'Token Tune', 'DeFi Dance', 'Mining Melody',
  'Wallet Waltz', 'Hash Harmony', 'Chain Chorus', 'Protocol Pop'
];

const playlistNames = [
  'Web3 Vibes', 'Crypto Classics', 'Blockchain Beats', 'DeFi Dance Party',
  'NFT Collection', 'Harmony Hits', 'Smart Contract Sounds', 'Decentralized Dreams'
];

// Generate comprehensive seed data
const seedData = {
  users: [
    {
      id: generateId(),
      walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      username: 'admin',
      email: 'admin@harmonychain.com',
      role: 'admin',
      createdAt: generateDate(30),
      updatedAt: generateDate(1)
    },
    {
      id: generateId(),
      walletAddress: generateAddress(),
      username: 'musiclover',
      email: 'music@example.com',
      role: 'user',
      createdAt: generateDate(20),
      updatedAt: generateDate(2)
    },
    {
      id: generateId(),
      walletAddress: generateAddress(),
      username: 'artist1',
      email: 'artist1@example.com',
      role: 'artist',
      createdAt: generateDate(25),
      updatedAt: generateDate(1)
    }
  ],

  artists: artists.map((artist, index) => ({
    id: generateId(),
    name: artist.name,
    walletAddress: generateAddress(),
    bio: artist.bio,
    avatar: `/api/placeholder/200/200?artist=${index}`,
    verified: artist.verified,
    followers: Math.floor(Math.random() * 10000) + 100,
    tracks: Math.floor(Math.random() * 20) + 1,
    totalEarnings: Math.floor(Math.random() * 5000) + 100,
    createdAt: generateDate(30 - index * 3),
    updatedAt: generateDate(1)
  })),

  tracks: trackTitles.map((title, index) => {
    const artist = artists[index % artists.length];
    const genre = genres[index % genres.length];
    return {
      id: generateId(),
      title: title,
      artist: artist.name,
      artistId: generateId(), // Will be linked to actual artist
      duration: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
      genre: genre,
      price: Math.floor(Math.random() * 5) + 0.1, // 0.1-5.0 tokens
      coverArt: `/api/placeholder/400/400?track=${index}`,
      audioFile: `/api/placeholder/audio.mp3?track=${index}`,
      ipfsHash: generateHash(),
      isStreamable: true,
      playCount: Math.floor(Math.random() * 10000) + 100,
      earnings: Math.floor(Math.random() * 1000) + 10,
      owner: generateAddress(),
      createdAt: generateDate(30 - index),
      updatedAt: generateDate(1)
    };
  }),

  nfts: Array.from({ length: 15 }, (_, index) => ({
    id: generateId(),
    trackId: generateId(), // Will be linked to actual track
    artistId: generateId(), // Will be linked to actual artist
    owner: generateAddress(),
    price: Math.floor(Math.random() * 10) + 0.5, // 0.5-10.0 tokens
    tokenId: (index + 1).toString(),
    contractAddress: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
    metadata: {
      name: `Music NFT #${index + 1}`,
      description: `Exclusive NFT version of a unique music track`,
      image: `/api/placeholder/300/300?nft=${index}`,
      attributes: [
        { trait_type: 'Artist', value: artists[index % artists.length].name },
        { trait_type: 'Genre', value: genres[index % genres.length] },
        { trait_type: 'Rarity', value: ['Common', 'Rare', 'Epic', 'Legendary'][index % 4] },
        { trait_type: 'Year', value: '2024' }
      ]
    },
    isListed: Math.random() > 0.3, // 70% listed
    createdAt: generateDate(20 - index),
    updatedAt: generateDate(1)
  })),

  playlists: playlistNames.map((name, index) => ({
    id: generateId(),
    name: name,
    description: `Curated collection of ${name.toLowerCase()}`,
    owner: generateAddress(),
    tracks: [], // Will be populated with track IDs
    isPublic: Math.random() > 0.2, // 80% public
    createdAt: generateDate(15 - index),
    updatedAt: generateDate(1)
  })),

  licenses: [
    {
      id: generateId(),
      trackId: generateId(),
      type: 'commercial',
      price: 1.0,
      description: 'Commercial use license',
      terms: 'Can be used for commercial purposes',
      isActive: true,
      createdAt: generateDate(10),
      updatedAt: generateDate(1)
    },
    {
      id: generateId(),
      trackId: generateId(),
      type: 'personal',
      price: 0.1,
      description: 'Personal use license',
      terms: 'For personal use only',
      isActive: true,
      createdAt: generateDate(8),
      updatedAt: generateDate(1)
    }
  ],

  proposals: [
    {
      id: generateId(),
      title: 'Increase platform fees to 5%',
      description: 'Proposal to increase platform fees from 3% to 5% to fund development',
      proposer: generateAddress(),
      votesFor: 150,
      votesAgainst: 45,
      totalVotes: 195,
      status: 'active',
      startTime: generateDate(5),
      endTime: generateDate(-2),
      createdAt: generateDate(7),
      updatedAt: generateDate(1)
    },
    {
      id: generateId(),
      title: 'Add new music genre categories',
      description: 'Proposal to add experimental and ambient music categories',
      proposer: generateAddress(),
      votesFor: 89,
      votesAgainst: 12,
      totalVotes: 101,
      status: 'passed',
      startTime: generateDate(10),
      endTime: generateDate(3),
      createdAt: generateDate(12),
      updatedAt: generateDate(1)
    }
  ],

  votes: [
    {
      id: generateId(),
      proposalId: generateId(),
      voter: generateAddress(),
      vote: 'for',
      weight: 100,
      createdAt: generateDate(6)
    },
    {
      id: generateId(),
      proposalId: generateId(),
      voter: generateAddress(),
      vote: 'against',
      weight: 50,
      createdAt: generateDate(5)
    }
  ],

  transactions: Array.from({ length: 50 }, (_, index) => ({
    id: generateId(),
    hash: '0x' + crypto.randomBytes(32).toString('hex'),
    from: generateAddress(),
    to: generateAddress(),
    amount: Math.floor(Math.random() * 10) + 0.1,
    type: ['purchase', 'sale', 'royalty', 'mint'][index % 4],
    status: 'confirmed',
    blockNumber: 1000000 + index,
    gasUsed: Math.floor(Math.random() * 100000) + 21000,
    createdAt: generateDate(30 - index)
  }))
};

// Write seed data to JSON files
console.log('🌱 Seeding HarmonyChain database with production data...');

Object.entries(seedData).forEach(([entity, data]) => {
  const filePath = path.join(orbitdbPath, `${entity}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Created ${data.length} ${entity} records`);
});

// Create database statistics
const stats = {
  totalUsers: seedData.users.length,
  totalArtists: seedData.artists.length,
  totalTracks: seedData.tracks.length,
  totalNFTs: seedData.nfts.length,
  totalPlaylists: seedData.playlists.length,
  totalLicenses: seedData.licenses.length,
  totalProposals: seedData.proposals.length,
  totalVotes: seedData.votes.length,
  totalTransactions: seedData.transactions.length,
  createdAt: new Date().toISOString()
};

fs.writeFileSync(path.join(orbitdbPath, 'stats.json'), JSON.stringify(stats, null, 2));

console.log('\n📊 Database Statistics:');
console.log(`Users: ${stats.totalUsers}`);
console.log(`Artists: ${stats.totalArtists}`);
console.log(`Tracks: ${stats.totalTracks}`);
console.log(`NFTs: ${stats.totalNFTs}`);
console.log(`Playlists: ${stats.totalPlaylists}`);
console.log(`Licenses: ${stats.totalLicenses}`);
console.log(`Proposals: ${stats.totalProposals}`);
console.log(`Votes: ${stats.totalVotes}`);
console.log(`Transactions: ${stats.totalTransactions}`);

console.log('\n🎉 Database seeding completed successfully!');
console.log('💡 You can now start the services with: npm run dev');
