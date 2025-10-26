'use client'

import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

interface DocViewerProps {
  docId: string
}

const DOCS_CONTENT: Record<string, string> = {
  'index': `# HarmonyChain Documentation

Welcome to HarmonyChain, a decentralized music platform built on Harmony blockchain that empowers artists and connects music lovers through Web3 technology.

## What is HarmonyChain?

HarmonyChain is a comprehensive decentralized music platform that combines:

- **Music Streaming**: Decentralized music streaming powered by IPFS
- **NFT Marketplace**: Trade music NFTs and collectibles
- **Artist Dashboard**: Tools for artists to manage their content and earnings
- **Governance**: Community-driven decision making through DAO
- **Smart Contracts**: Transparent and automated royalty distribution

## Key Features

### 🎵 Music Streaming
- Decentralized storage using IPFS
- High-quality audio streaming
- Cross-platform compatibility
- No single point of failure

### 🎨 NFT Marketplace
- Mint music as NFTs
- Trade and collect music NFTs
- Artist-based filtering
- Transparent pricing

### 👨‍🎤 Artist Tools
- Upload and manage tracks
- Set licensing terms
- Track analytics and earnings
- Direct fan engagement

### 🏛️ Governance
- Create and vote on proposals
- Community-driven development
- Transparent decision making
- Voting power based on participation

## Getting Started

1. **Connect Wallet**: Use MetaMask or other Web3 wallets
2. **Explore Music**: Browse the decentralized music library
3. **Support Artists**: Purchase tracks or NFTs
4. **Join Governance**: Participate in community decisions

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Blockchain**: Harmony Network, Ethereum-compatible
- **Storage**: IPFS (InterPlanetary File System)
- **Smart Contracts**: Solidity, OpenZeppelin
- **Authentication**: Sign-In with Ethereum (SIWE)

## Support

For questions, issues, or contributions, please visit our GitHub repository or contact our community.

---

*Built with ❤️ for the decentralized music ecosystem*`,

  'architecture': `# Architecture Overview

HarmonyChain is built with a modular, decentralized architecture that ensures scalability, security, and user sovereignty.

## System Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Blockchain    │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (Harmony)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IPFS Storage  │    │   Database     │    │   Smart         │
│   (Decentralized)│    │   (SimpleDB)   │    │   Contracts     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

## Core Components

### Frontend (Next.js)
- **Pages**: Music player, marketplace, dashboard, governance
- **Components**: Reusable UI components with TypeScript
- **State Management**: React hooks and context
- **Web3 Integration**: Wagmi, RainbowKit, ethers.js

### Backend API (Express.js)
- **Authentication**: JWT and SIWE (Sign-In with Ethereum)
- **File Upload**: IPFS integration for decentralized storage
- **Database**: SimpleDB for development, scalable to production DB
- **Rate Limiting**: API protection and abuse prevention

### Smart Contracts
- **MusicRegistry**: Track and artist management
- **NFTMarketplace**: NFT trading and ownership
- **GovernanceDAO**: Community governance
- **RoyaltyDistributor**: Automated royalty payments

### Storage Layer
- **IPFS**: Decentralized file storage
- **Database**: Metadata and user data
- **Blockchain**: Immutable ownership records

## Data Flow

### Music Upload Process
1. User uploads audio file through frontend
2. File is uploaded to IPFS
3. Metadata is stored in database
4. Track is registered on blockchain
5. User receives confirmation

### Music Streaming Process
1. User selects track to play
2. Frontend fetches track metadata
3. Audio is streamed from IPFS
4. Play count is updated
5. Royalties are calculated

### NFT Trading Process
1. Artist mints track as NFT
2. NFT is listed on marketplace
3. Buyer purchases with cryptocurrency
4. Ownership is transferred on blockchain
5. Royalties are distributed automatically

## Security Considerations

- **Smart Contract Audits**: All contracts are audited for security
- **Access Control**: Role-based permissions
- **Data Encryption**: Sensitive data is encrypted
- **Rate Limiting**: API abuse prevention
- **Input Validation**: All inputs are validated

## Scalability

- **Horizontal Scaling**: Microservices architecture
- **Caching**: Redis for performance optimization
- **CDN**: IPFS for global content delivery
- **Database**: Sharding for large datasets
- **Load Balancing**: Multiple API instances`,

  'components': `# Component Documentation

This document outlines the key components and their responsibilities in the HarmonyChain application.

## Frontend Components

### Layout Components

#### Navigation
- **File**: \`components/layout/Navigation.tsx\`
- **Purpose**: Main navigation bar with wallet connection
- **Features**: Responsive design, wallet status, user menu

#### Footer
- **File**: \`components/layout/Footer.tsx\`
- **Purpose**: Site footer with links and information
- **Features**: Social links, legal information, contact details

### Music Components

#### MusicPlayer
- **File**: \`components/player/MusicPlayer.tsx\`
- **Purpose**: Audio player with controls
- **Features**: Play/pause, seek, volume, playlist
- **Props**: \`track\`, \`onTrackChange\`, \`className\`

#### TrackUpload
- **File**: \`components/upload/TrackUpload.tsx\`
- **Purpose**: File upload interface
- **Features**: Drag & drop, progress tracking, validation
- **Props**: \`onUpload\`, \`onProgress\`, \`disabled\`

### NFT Components

#### NFTMarketplace
- **File**: \`components/nft/NFTMarketplace.tsx\`
- **Purpose**: NFT marketplace grid
- **Features**: Search, filter, pagination, purchase
- **Props**: \`nfts\`, \`onPurchase\`, \`onLike\`, \`onShare\`

#### NFTMintForm
- **File**: \`components/nft/NFTMintForm.tsx\`
- **Purpose**: NFT minting interface
- **Features**: Form validation, file upload, blockchain interaction
- **Props**: \`onMintSuccess\`, \`onClose\`

### Dashboard Components

#### ArtistDashboard
- **File**: \`components/dashboard/ArtistDashboard.tsx\`
- **Purpose**: Artist management interface
- **Features**: Analytics, track management, earnings
- **Props**: \`artist\`, \`tracks\`, \`analytics\`

#### AnalyticsChart
- **File**: \`components/dashboard/AnalyticsChart.tsx\`
- **Purpose**: Data visualization
- **Features**: Charts, graphs, statistics
- **Props**: \`data\`, \`type\`, \`options\`

### Governance Components

#### ProposalList
- **File**: \`components/governance/ProposalList.tsx\`
- **Purpose**: Display governance proposals
- **Features**: Voting, status, details
- **Props**: \`proposals\`, \`onVote\`, \`userVotingPower\`

#### ProposalForm
- **File**: \`components/governance/ProposalForm.tsx\`
- **Purpose**: Create new proposals
- **Features**: Form validation, submission
- **Props**: \`onSubmit\`, \`onCancel\`

## Backend Components

### Services

#### BlockchainService
- **File**: \`services/blockchainService.ts\`
- **Purpose**: Smart contract interactions
- **Methods**: \`registerArtist\`, \`uploadTrack\`, \`mintNFT\`, \`createProposal\`

#### AuthService
- **File**: \`services/authService.ts\`
- **Purpose**: Authentication and authorization
- **Methods**: \`generateToken\`, \`verifyToken\`, \`authenticateSIWE\`

#### OrbitDBService
- **File**: \`services/orbitdbService.ts\`
- **Purpose**: Decentralized database operations
- **Methods**: \`createDatabase\`, \`addRecord\`, \`queryRecords\`

### Middleware

#### AuthMiddleware
- **File**: \`middleware/auth.ts\`
- **Purpose**: Request authentication
- **Features**: JWT validation, SIWE verification

#### RateLimiter
- **File**: \`middleware/rateLimiter.ts\`
- **Purpose**: API rate limiting
- **Features**: Request throttling, abuse prevention

#### ErrorHandler
- **File**: \`middleware/errorHandler.ts\`
- **Purpose**: Error handling and logging
- **Features**: Error logging, user-friendly messages

## API Routes

### Authentication Routes
- \`POST /api/auth/nonce\` - Generate authentication nonce
- \`POST /api/auth/verify\` - Verify SIWE signature
- \`GET /api/auth/profile\` - Get user profile

### Music Routes
- \`POST /api/tracks\` - Upload new track
- \`GET /api/tracks\` - Get all tracks
- \`GET /api/tracks/:id\` - Get specific track
- \`PUT /api/tracks/:id\` - Update track

### NFT Routes
- \`POST /api/nfts\` - Mint new NFT
- \`GET /api/nfts\` - Get all NFTs
- \`GET /api/nfts/:id\` - Get specific NFT
- \`POST /api/nfts/:id/purchase\` - Purchase NFT

### Governance Routes
- \`GET /api/governance/proposals\` - Get all proposals
- \`POST /api/governance/proposals\` - Create proposal
- \`POST /api/governance/proposals/:id/vote\` - Vote on proposal

## Component Props and Types

### Common Types
\`\`\`typescript
interface Track {
  id: string
  title: string
  artist: string
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

interface NFT {
  id: string
  tokenId: string
  owner: string
  price: number
  metadata: NFTMetadata
  artistId: string
  trackId: string
  createdAt: string
}

interface Proposal {
  id: string
  title: string
  description: string
  proposer: string
  forVotes: number
  againstVotes: number
  startTime: number
  endTime: number
  executed: boolean
  canceled: boolean
}
\`\`\`

## Styling and Theming

### Tailwind CSS Classes
- \`bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900\` - Main background
- \`text-white\` - Primary text color
- \`bg-blue-600 hover:bg-blue-700\` - Primary button
- \`rounded-lg shadow-lg\` - Card styling

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid layouts for different screen sizes`,

  'developer-guide': `# Developer Guide

This guide will help you set up, develop, and contribute to the HarmonyChain project.

## Prerequisites

- Node.js 18+ and npm
- Git
- MetaMask or compatible Web3 wallet
- Basic knowledge of React, TypeScript, and blockchain concepts

## Quick Start

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/your-org/harmony-chain.git
cd harmony-chain
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
\`\`\`bash
cp env.example .env
\`\`\`

Edit \`.env\` with your configuration:
\`\`\`env
# Network Configuration
NETWORK=testnet
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESSES={"musicRegistry":"0x...","nftMarketplace":"0x...","governanceDAO":"0x..."}

# IPFS Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Database Configuration
DATABASE_URL=./orbitdb
\`\`\`

### 4. Start Development Servers
\`\`\`bash
npm run dev
\`\`\`

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

## Development Workflow

### Project Structure
\`\`\`
harmony-chain/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Express.js backend
│   └── contracts/    # Solidity smart contracts
├── packages/
│   └── shared/       # Shared types and utilities
├── docs/             # Documentation
└── scripts/         # Deployment and utility scripts
\`\`\`

### Code Organization

#### Frontend (apps/web)
- \`app/\` - Next.js 13+ app directory
- \`components/\` - Reusable React components
- \`lib/\` - Utilities, hooks, and API clients
- \`public/\` - Static assets

#### Backend (apps/api)
- \`src/routes/\` - API route handlers
- \`src/services/\` - Business logic
- \`src/middleware/\` - Express middleware
- \`src/config/\` - Configuration files

#### Smart Contracts (apps/contracts)
- \`contracts/\` - Solidity contracts
- \`scripts/\` - Deployment scripts
- \`test/\` - Contract tests

## Adding New Features

### 1. Frontend Component
\`\`\`typescript
// components/NewFeature.tsx
import React from 'react'

interface NewFeatureProps {
  // Define props
}

export const NewFeature: React.FC<NewFeatureProps> = ({ ...props }) => {
  return (
    <div>
      {/* Component implementation */}
    </div>
  )
}
\`\`\`

### 2. Backend API Route
\`\`\`typescript
// routes/newFeature.ts
import { Router } from 'express'
import { authenticateToken } from '../middleware/auth'

const router = Router()

router.get('/new-feature', authenticateToken, async (req, res) => {
  try {
    // Implementation
    res.json({ success: true, data: {} })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
\`\`\`

### 3. Smart Contract Function
\`\`\`solidity
// contracts/NewFeature.sol
pragma solidity ^0.8.0;

contract NewFeature {
    function newFunction() public view returns (bool) {
        return true;
    }
}
\`\`\`

## Testing

### Frontend Testing
\`\`\`bash
cd apps/web
npm test
\`\`\`

### Backend Testing
\`\`\`bash
cd apps/api
npm test
\`\`\`

### Smart Contract Testing
\`\`\`bash
cd apps/contracts
npx hardhat test
\`\`\`

## Deployment

### Smart Contracts
\`\`\`bash
cd apps/contracts
npx hardhat run scripts/deploy.js --network harmony-testnet
\`\`\`

### Backend API
\`\`\`bash
cd apps/api
npm run build
npm start
\`\`\`

### Frontend
\`\`\`bash
cd apps/web
npm run build
npm start
\`\`\`

## Contributing

### 1. Fork the Repository
Create a fork of the main repository on GitHub.

### 2. Create a Feature Branch
\`\`\`bash
git checkout -b feature/your-feature-name
\`\`\`

### 3. Make Changes
- Write clean, documented code
- Add tests for new functionality
- Update documentation

### 4. Commit Changes
\`\`\`bash
git add .
git commit -m "feat: add your feature description"
\`\`\`

### 5. Push and Create PR
\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

Then create a pull request on GitHub.

## Code Standards

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Avoid \`any\` type
- Use proper error handling

### React
- Use functional components with hooks
- Implement proper prop types
- Use TypeScript for type safety
- Follow React best practices

### Solidity
- Use OpenZeppelin libraries
- Implement proper access control
- Add comprehensive comments
- Follow Solidity style guide

## Debugging

### Frontend Debugging
- Use React Developer Tools
- Check browser console for errors
- Use \`console.log\` for debugging
- Test with different wallet connections

### Backend Debugging
- Use \`console.log\` for API debugging
- Check server logs
- Use Postman for API testing
- Monitor database queries

### Smart Contract Debugging
- Use Hardhat console.log
- Test with different accounts
- Use Remix IDE for debugging
- Check transaction logs

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement lazy loading
- Optimize bundle size
- Use proper caching strategies

### Backend
- Implement database indexing
- Use connection pooling
- Add caching layers
- Optimize API responses

### Smart Contracts
- Minimize gas usage
- Use events for logging
- Implement proper data structures
- Avoid unnecessary computations

## Security Considerations

- Validate all inputs
- Implement proper authentication
- Use secure random number generation
- Follow smart contract security best practices
- Regular security audits

## Troubleshooting

### Common Issues

#### Wallet Connection Issues
- Check MetaMask installation
- Verify network configuration
- Clear browser cache
- Check console for errors

#### API Connection Issues
- Verify backend server is running
- Check CORS configuration
- Verify environment variables
- Check network connectivity

#### Smart Contract Issues
- Verify contract addresses
- Check network configuration
- Verify gas settings
- Check transaction status

## Getting Help

- Check the GitHub issues
- Join our Discord community
- Read the documentation
- Contact the development team

## Resources

- [Harmony Network Documentation](https://docs.harmony.one/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Solidity Documentation](https://docs.soliditylang.org/)`,

  'user-guide': `# User Guide

Welcome to HarmonyChain! This guide will help you get started with the platform and make the most of its features.

## Getting Started

### 1. Connect Your Wallet
1. Click "Connect Wallet" in the top navigation
2. Select your preferred wallet (MetaMask, WalletConnect, etc.)
3. Approve the connection request
4. Your wallet address will appear in the navigation

### 2. Explore Music
1. Navigate to "Discover" to browse available music
2. Use the search bar to find specific tracks or artists
3. Click on any track to start playing
4. Use the player controls to manage playback

### 3. Support Artists
1. Purchase tracks to support your favorite artists
2. Buy NFTs to own unique music collectibles
3. Participate in governance to shape the platform

## Features Guide

### Music Streaming

#### Playing Music
1. **Browse**: Use the Discover page to find music
2. **Select**: Click on any track to start playing
3. **Control**: Use play/pause, skip, and volume controls
4. **Queue**: Add tracks to your playlist

#### Audio Quality
- High-quality streaming from IPFS
- No buffering issues
- Cross-platform compatibility
- Offline listening (when available)

### Artist Dashboard

#### For Artists
1. **Connect Wallet**: Ensure your wallet is connected
2. **Register**: Register as an artist on the platform
3. **Upload**: Upload your music tracks
4. **Manage**: Track your earnings and analytics
5. **Engage**: Interact with your fans

#### Uploading Music
1. Go to the Upload page
2. Fill in track details (title, genre, price)
3. Upload audio file and cover art
4. Set licensing terms
5. Submit for review and publication

#### Analytics
- Track play counts
- Monitor earnings
- View fan engagement
- Analyze performance metrics

### NFT Marketplace

#### Browsing NFTs
1. Navigate to the Marketplace
2. Browse available NFTs
3. Use filters to find specific items
4. View NFT details and metadata

#### Purchasing NFTs
1. Select an NFT you want to purchase
2. Click "Purchase" button
3. Confirm the transaction in your wallet
4. Wait for confirmation
5. NFT will appear in your collection

#### Minting NFTs (Artists Only)
1. Go to the Marketplace
2. Click "Mint NFT" button
3. Select a track to mint
4. Set price and metadata
5. Upload NFT image
6. Confirm minting transaction

### Governance

#### Viewing Proposals
1. Navigate to the Governance page
2. Browse active proposals
3. Read proposal details
4. Check voting status and results

#### Creating Proposals
1. Click "Create Proposal"
2. Fill in title and description
3. Submit the proposal
4. Wait for community voting

#### Voting
1. Select a proposal to vote on
2. Choose "For" or "Against"
3. Confirm your vote
4. Wait for transaction confirmation

## Account Management

### Profile Settings
1. Click on your wallet address in navigation
2. View your profile information
3. Check your voting power
4. Manage your preferences

### Wallet Management
- **Connect**: Connect multiple wallets
- **Switch**: Switch between different accounts
- **Disconnect**: Disconnect when done
- **Security**: Keep your private keys safe

### Transaction History
1. View all your transactions
2. Check transaction status
3. View gas fees and costs
4. Export transaction data

## Troubleshooting

### Common Issues

#### Wallet Connection Problems
- **Issue**: Wallet won't connect
- **Solution**: Refresh the page, check MetaMask, try different browser

#### Music Won't Play
- **Issue**: Audio not loading
- **Solution**: Check internet connection, try different track, clear cache

#### Transaction Failures
- **Issue**: Transaction not going through
- **Solution**: Check gas fees, increase gas limit, try again later

#### Slow Loading
- **Issue**: Pages loading slowly
- **Solution**: Check internet speed, clear browser cache, try different network

### Getting Help

#### Support Channels
- **Discord**: Join our community Discord
- **GitHub**: Report issues on GitHub
- **Email**: Contact support team
- **Documentation**: Check the docs

#### Community Resources
- **Tutorials**: Video guides and walkthroughs
- **FAQ**: Frequently asked questions
- **Forums**: Community discussions
- **Social Media**: Follow us for updates

## Best Practices

### Security
- **Private Keys**: Never share your private keys
- **Phishing**: Be wary of fake websites
- **Updates**: Keep your wallet updated
- **Backup**: Backup your wallet regularly

### Performance
- **Browser**: Use modern browsers (Chrome, Firefox, Safari)
- **Internet**: Ensure stable internet connection
- **Cache**: Clear browser cache regularly
- **Extensions**: Disable conflicting browser extensions

### Community
- **Participation**: Join governance discussions
- **Feedback**: Provide feedback on features
- **Support**: Help other community members
- **Contribution**: Contribute to the project

## Advanced Features

### API Access
- **Developer**: Access API documentation
- **Integration**: Build custom integrations
- **Automation**: Automate common tasks
- **Analytics**: Advanced analytics tools

### Customization
- **Themes**: Customize the interface
- **Preferences**: Set your preferences
- **Notifications**: Manage notifications
- **Privacy**: Control privacy settings

## Tips and Tricks

### Music Discovery
- Use search filters effectively
- Follow your favorite artists
- Create playlists
- Share music with friends

### NFT Trading
- Research before purchasing
- Check artist reputation
- Monitor market trends
- Diversify your collection

### Governance Participation
- Read proposals carefully
- Consider community impact
- Vote responsibly
- Engage in discussions

## Updates and Changes

### Staying Informed
- **Newsletter**: Subscribe to updates
- **Social Media**: Follow official accounts
- **Discord**: Join community channels
- **GitHub**: Watch the repository

### Version Updates
- **Automatic**: Most updates are automatic
- **Manual**: Some updates require action
- **Migration**: Data migration when needed
- **Compatibility**: Check compatibility requirements

---

*For more detailed information, visit our [Developer Guide](./developer-guide.md) or [API Documentation](http://localhost:3001/api-docs).*`,

  'glossary': `# Glossary

This glossary defines key terms and concepts used throughout the HarmonyChain platform.

## Blockchain Terms

### Blockchain
A distributed ledger technology that maintains a continuously growing list of records (blocks) that are linked and secured using cryptography.

### Smart Contract
Self-executing contracts with the terms of the agreement directly written into code. They automatically execute when predetermined conditions are met.

### Gas
The fee required to conduct a transaction or execute a contract on the blockchain network.

### Wallet
A digital tool that allows users to store, send, and receive cryptocurrencies and interact with blockchain applications.

### Address
A unique identifier for a wallet or smart contract on the blockchain, typically a long string of alphanumeric characters.

### Transaction
A record of an operation on the blockchain, such as transferring tokens or calling a smart contract function.

## HarmonyChain Specific Terms

### Harmony Network
The blockchain network that HarmonyChain is built on, known for its fast transaction speeds and low fees.

### ONE Token
The native cryptocurrency of the Harmony network, used for transactions and governance.

### IPFS (InterPlanetary File System)
A distributed file system used by HarmonyChain to store music files and other content in a decentralized manner.

### Decentralized Storage
A storage system where files are distributed across multiple nodes rather than stored on a single server.

## Music Industry Terms

### Royalty
A payment made to artists or rights holders for the use of their music.

### Licensing
The process of granting permission to use copyrighted material, such as music.

### Metadata
Data that provides information about other data, such as track title, artist name, and duration.

### Streaming
The process of playing audio or video content over the internet without downloading the entire file.

### NFT (Non-Fungible Token)
A unique digital asset that represents ownership of a specific item, such as a music track or artwork.

## Platform Features

### Artist Dashboard
A specialized interface for artists to manage their content, track earnings, and engage with fans.

### Governance
The process of making decisions about the platform through community voting and proposals.

### DAO (Decentralized Autonomous Organization)
An organization governed by smart contracts and community voting rather than traditional management.

### Marketplace
A platform where users can buy, sell, and trade NFTs and other digital assets.

### Player
The audio interface that allows users to play music tracks on the platform.

## Technical Terms

### API (Application Programming Interface)
A set of protocols and tools for building software applications.

### Frontend
The user interface and user experience layer of the application.

### Backend
The server-side logic and database layer of the application.

### Database
A structured collection of data that can be easily accessed, managed, and updated.

### Authentication
The process of verifying the identity of a user or system.

### Authorization
The process of determining what actions a user is allowed to perform.

## Web3 Terms

### Web3
The next generation of the internet, built on blockchain technology and focused on decentralization.

### DeFi (Decentralized Finance)
Financial services built on blockchain technology without traditional intermediaries.

### dApp (Decentralized Application)
An application that runs on a blockchain network and is not controlled by a single entity.

### Wallet Connection
The process of linking a user's wallet to a web application to enable blockchain interactions.

### Sign-In with Ethereum (SIWE)
A method of authentication that uses wallet signatures instead of traditional passwords.

## Platform-Specific Features

### Track Upload
The process of uploading music files to the platform for distribution and streaming.

### NFT Minting
The process of creating a new NFT from an existing music track or artwork.

### Proposal Creation
The process of creating a governance proposal for community voting.

### Voting
The process of casting votes on governance proposals to influence platform decisions.

### Analytics
Data and insights about music performance, user engagement, and platform usage.

### Earnings
Revenue generated by artists through music streaming, NFT sales, and other platform activities.

## Security Terms

### Private Key
A secret key used to sign transactions and prove ownership of blockchain assets.

### Public Key
A key that can be shared publicly and is used to verify signatures and receive transactions.

### Signature
A cryptographic proof that a transaction was authorized by the owner of a private key.

### Encryption
The process of converting data into a secure format that can only be read with the correct key.

### Hash
A fixed-length string generated from data of any size, used for data integrity and security.

## User Interface Terms

### Navigation
The menu system that allows users to move between different sections of the platform.

### Dashboard
A personalized interface that displays relevant information and controls for a user.

### Modal
A popup window that appears on top of the main content to display additional information or forms.

### Component
A reusable piece of user interface that can be used in multiple places.

### Responsive Design
A design approach that ensures the interface works well on different screen sizes and devices.

## Data Terms

### JSON (JavaScript Object Notation)
A lightweight data format used for storing and transmitting data.

### Database Record
A single entry in a database that contains related information.

### Query
A request for specific data from a database.

### Index
A data structure that improves the speed of data retrieval operations.

### Cache
A temporary storage area that stores frequently accessed data for faster retrieval.

## Network Terms

### Node
A computer that participates in the blockchain network by maintaining a copy of the blockchain.

### Consensus
The process by which nodes in a blockchain network agree on the state of the blockchain.

### Fork
A split in the blockchain that creates two separate versions of the blockchain.

### Upgrade
A change to the blockchain protocol that improves functionality or fixes issues.

### Migration
The process of moving data or functionality from one system to another.

---

*This glossary is regularly updated to include new terms and concepts as they are introduced to the platform.*`,

  'roadmap': `# Roadmap

This roadmap outlines the planned development and feature releases for HarmonyChain.

## Phase 1: Foundation (Q1 2024) ✅

### Core Infrastructure
- [x] Smart contract development and deployment
- [x] Basic frontend and backend architecture
- [x] IPFS integration for decentralized storage
- [x] Wallet connection and authentication
- [x] Basic music streaming functionality

### Essential Features
- [x] Music upload and playback
- [x] Artist registration and dashboard
- [x] Basic NFT marketplace
- [x] Simple governance system
- [x] API documentation

## Phase 2: Enhancement (Q2 2024) 🚧

### Advanced Features
- [ ] Enhanced music player with playlist support
- [ ] Advanced analytics for artists
- [ ] Improved NFT marketplace with auctions
- [ ] Mobile application development
- [ ] Advanced search and discovery

### User Experience
- [ ] Improved UI/UX design
- [ ] Better error handling and user feedback
- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Multi-language support

## Phase 3: Expansion (Q3 2024) 📋

### Platform Growth
- [ ] Social features and community building
- [ ] Advanced recommendation algorithms
- [ ] Cross-platform integration
- [ ] API for third-party developers
- [ ] White-label solutions

### Business Features
- [ ] Subscription models
- [ ] Advanced licensing options
- [ ] Revenue sharing mechanisms
- [ ] Partnership integrations
- [ ] Enterprise features

## Phase 4: Innovation (Q4 2024) 🔮

### Cutting-Edge Features
- [ ] AI-powered music generation
- [ ] Virtual reality experiences
- [ ] Advanced NFT utilities
- [ ] Cross-chain compatibility
- [ ] Advanced governance mechanisms

### Ecosystem Development
- [ ] Developer tools and SDKs
- [ ] Community governance tools
- [ ] Advanced analytics platform
- [ ] Integration marketplace
- [ ] Educational resources

## Current Development Status

### Recently Completed ✅
- Smart contract deployment and testing
- Basic music streaming functionality
- Artist dashboard implementation
- NFT marketplace foundation
- Governance system setup
- API documentation

### In Progress 🚧
- Enhanced user interface
- Mobile responsiveness improvements
- Performance optimizations
- Advanced search functionality
- Error handling improvements

### Upcoming 📋
- Mobile application development
- Advanced analytics features
- Social features implementation
- Cross-platform integration
- Performance monitoring

## Feature Priorities

### High Priority 🔴
1. **Mobile Application**: Native mobile apps for iOS and Android
2. **Advanced Analytics**: Detailed insights for artists and users
3. **Social Features**: Community building and social interactions
4. **Performance**: Optimize loading times and user experience
5. **Security**: Enhanced security measures and audits

### Medium Priority 🟡
1. **Cross-Chain**: Support for multiple blockchain networks
2. **AI Integration**: AI-powered features and recommendations
3. **Advanced NFTs**: Utility NFTs and advanced features
4. **Enterprise**: Business-focused features and tools
5. **Education**: Learning resources and tutorials

### Low Priority 🟢
1. **VR/AR**: Virtual and augmented reality experiences
2. **Advanced Governance**: Complex governance mechanisms
3. **White-Label**: Platform licensing for other organizations
4. **Advanced APIs**: Comprehensive developer tools
5. **Research**: Experimental features and research

## Technical Milestones

### Infrastructure
- [ ] Microservices architecture implementation
- [ ] Advanced caching strategies
- [ ] Database optimization
- [ ] CDN integration
- [ ] Load balancing

### Security
- [ ] Security audit completion
- [ ] Penetration testing
- [ ] Bug bounty program
- [ ] Advanced encryption
- [ ] Privacy protection

### Performance
- [ ] Sub-second loading times
- [ ] 99.9% uptime guarantee
- [ ] Global content delivery
- [ ] Advanced monitoring
- [ ] Automated scaling

## Community Goals

### User Growth
- **Target**: 10,000 active users by end of 2024
- **Strategy**: Community building, partnerships, marketing
- **Metrics**: User registration, engagement, retention

### Artist Adoption
- **Target**: 1,000 registered artists by end of 2024
- **Strategy**: Artist outreach, incentives, tools
- **Metrics**: Artist registration, content upload, earnings

### Content Volume
- **Target**: 10,000 tracks by end of 2024
- **Strategy**: Easy upload process, incentives, quality control
- **Metrics**: Track uploads, play counts, user engagement

## Partnership Opportunities

### Music Industry
- Record labels and distributors
- Music streaming platforms
- Artist management companies
- Music education institutions
- Industry associations

### Technology
- Blockchain infrastructure providers
- Cloud storage solutions
- AI and machine learning companies
- Mobile app development
- Security and auditing firms

### Community
- Music communities and forums
- Blockchain and crypto communities
- Developer communities
- Educational institutions
- Non-profit organizations

## Success Metrics

### Technical Metrics
- **Uptime**: 99.9% platform availability
- **Performance**: <2 second page load times
- **Security**: Zero critical security incidents
- **Scalability**: Support for 100,000+ concurrent users

### Business Metrics
- **User Growth**: 10,000+ registered users
- **Artist Adoption**: 1,000+ registered artists
- **Content**: 10,000+ uploaded tracks
- **Revenue**: $100,000+ in platform transactions

### Community Metrics
- **Engagement**: 70%+ monthly active users
- **Retention**: 60%+ user retention rate
- **Governance**: 50%+ participation in voting
- **Feedback**: 4.5+ star average rating

## Risk Mitigation

### Technical Risks
- **Scalability**: Implement microservices and caching
- **Security**: Regular audits and security measures
- **Performance**: Continuous monitoring and optimization
- **Compatibility**: Cross-browser and device testing

### Business Risks
- **Competition**: Focus on unique value proposition
- **Regulation**: Stay compliant with regulations
- **Adoption**: Community building and incentives
- **Funding**: Diversified revenue streams

### Community Risks
- **Governance**: Transparent decision-making process
- **Content**: Quality control and moderation
- **Support**: Comprehensive help and documentation
- **Feedback**: Regular user feedback collection

## Feedback and Suggestions

We welcome feedback and suggestions from our community. Please share your ideas through:

- **GitHub Issues**: Technical feedback and bug reports
- **Discord Community**: General discussion and ideas
- **Governance Proposals**: Formal platform changes
- **Email**: Direct feedback to the development team

## Contributing

We encourage community contributions to the project:

- **Code**: Submit pull requests for bug fixes and features
- **Documentation**: Help improve our documentation
- **Testing**: Report bugs and test new features
- **Community**: Help build and grow our community

---

*This roadmap is a living document that evolves based on community feedback, technical developments, and market conditions. We regularly update it to reflect our current priorities and progress.*`
}

export default function DocViewer({ docId }: DocViewerProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // For now, use static content
        // In production, this would fetch from a CMS or file system
        const docContent = DOCS_CONTENT[docId] || 'Document not found'
        setContent(docContent)
      } catch (err) {
        console.error('Error loading document:', err)
        setError('Failed to load document')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [docId])

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading document...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
