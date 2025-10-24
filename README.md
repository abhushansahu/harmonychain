# HarmonyChain - Decentralized Music Platform

A decentralized music platform built on Harmony Network, featuring Web3 music streaming, NFT marketplace, and artist empowerment tools.

## 🎵 Current Status: Development Phase

**⚠️ IMPORTANT**: This project is currently in development. While the UI components and basic infrastructure are functional, many backend integrations require proper configuration to work in production.

### ✅ What's Working (Basic Functional)
- **Core Infrastructure**: Monorepo with Turborepo, Next.js frontend, Express.js API
- **Smart Contracts**: Deployed contracts with proper ABIs and interfaces
- **Web3 Integration**: RainbowKit wallet connection with multiple wallet support
- **Database**: SimpleDB with validation, duplicate prevention, and data management
- **IPFS Integration**: File storage with Pinata integration and mock fallback modes
- **Authentication**: JWT tokens and SIWE (Sign-In with Ethereum) support
- **UI Components**: Complete React components for all major features
- **TypeScript**: Full type safety across all packages
- **Error Handling**: Comprehensive error handling with fallback modes

### 🚧 What Needs Configuration
- **IPFS**: Requires `PINATA_API_KEY` and `PINATA_SECRET_KEY` for real file storage
- **Blockchain**: Requires deployed contract addresses and proper network configuration
- **Authentication**: SIWE implementation ready but needs frontend integration
- **Database**: Currently using JSON files, ready for migration to proper database

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup & Installation
```bash
# Clone the repository
git clone https://github.com/harmonychain/harmonychain.git
cd harmonychain

# Run automated setup
./scripts/setup.sh

# Start development environment
./scripts/start-dev.sh
```

### Manual Setup
```bash
# Install dependencies
npm install

# Setup environment
cp env.example .env
# Update .env with your API keys

# Start blockchain node
cd apps/contracts && npm run node

# Deploy contracts
cd apps/contracts && npm run deploy

# Start API server
cd apps/api && npm run start

# Start web application
cd apps/web && npm run dev
```

### Access Points
- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs
- **Blockchain Explorer**: http://localhost:8545

## 🏗️ Architecture

This is a monorepo containing:

- **Frontend** (`apps/web`): Next.js React application
- **Backend** (`apps/api`): Node.js Express API
- **Smart Contracts** (`apps/contracts`): Solidity contracts for Harmony Network
- **Shared** (`packages/shared`): Shared types and utilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- IPFS
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HarmonyChain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```


5. **Start services**
   ```bash
   
   # Start IPFS
   ipfs daemon
   
   # Start all services
   npm run dev
   ```

### Development

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs

## 📦 Services

### Frontend (Next.js)
- Modern React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Wagmi for Web3 integration
- RainbowKit for wallet connection

### Backend (Node.js)
- Express.js API
- IPFS for file storage
- JWT authentication

### Smart Contracts
- **MusicRegistry**: Track registration and management
- **NFTMarketplace**: Music NFT trading
- **RoyaltyDistributor**: Automated royalty payments
- **GovernanceDAO**: Community governance

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd HarmonyChain

# Install dependencies
npm install

# Copy environment template
cp env.example .env

# Edit .env with your configuration (see Configuration section below)
```

### Development

```bash
# Start all services in development mode
npm run dev

# Or start individual services
npm run dev:web      # Frontend only (http://localhost:3000)
npm run dev:api      # Backend only (http://localhost:3001)
npm run dev:contracts # Smart contracts only
```

### Production Build

```bash
# Build all services
npm run build

# Start production servers
npm run start
```

### Testing

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:web
npm run test:api
npm run test:contracts

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:web
npm run test:api
npm run test:contracts
```

## 🚀 Deployment

### Smart Contracts

1. **Deploy to Local Hardhat Network**
   ```bash
   cd apps/contracts
   npm run deploy:localhost
   ```

2. **Deploy to Harmony Testnet**
   ```bash
   cd apps/contracts
   npm run deploy:testnet
   ```

3. **Deploy to Harmony Mainnet**
   ```bash
   cd apps/contracts
   npm run deploy:mainnet
   ```

### Frontend & Backend

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Start production servers**
   ```bash
   npm run start
   ```

### Environment Setup

1. **Set production environment variables**
   ```bash
   NETWORK=harmony-mainnet
   BLOCKCHAIN_MOCK_MODE=false
   IPFS_MOCK_MODE=false
   # ... add all required variables
   ```

2. **Deploy smart contracts and update contract addresses**
3. **Configure IPFS service (Pinata recommended)**
4. **Set up proper database (migrate from JSON files)**

## 🔧 Configuration

### Required Environment Variables

Copy `env.example` to `.env` and configure the following:

#### Core Settings
```bash
# Network configuration
NETWORK=localhost                    # localhost, harmony-testnet, harmony-mainnet
LOCAL_RPC_URL=http://127.0.0.1:8545 # Local blockchain RPC
PRIVATE_KEY=0x...                   # Wallet private key for transactions

# JWT Authentication
JWT_SECRET=your-secret-key          # Secret for JWT token signing
```

#### IPFS Configuration (Optional - will use mock mode if not set)
```bash
# Pinata IPFS service
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key
PINATA_GATEWAY=https://gateway.pinata.cloud

# Local IPFS (optional)
IPFS_API_URL=http://localhost:5001
IPFS_MOCK_MODE=true                 # Use mock mode for development
```

#### Smart Contract Addresses (Required for production)
```bash
# Contract addresses (get these after deployment)
MUSIC_REGISTRY_ADDRESS=0x...
NFT_MARKETPLACE_ADDRESS=0x...
ROYALTY_DISTRIBUTOR_ADDRESS=0x...
GOVERNANCE_DAO_ADDRESS=0x...
```

#### Blockchain Configuration
```bash
# Mock mode for development
BLOCKCHAIN_MOCK_MODE=true          # Use mock contracts for development
```

### Development vs Production

**Development Mode** (default):
- Uses mock IPFS and blockchain services
- No external API keys required
- Perfect for UI development and testing

**Production Mode**:
- Requires all environment variables
- Real IPFS and blockchain connections
- Deployed smart contracts

### Database

Currently using SimpleDB (JSON files) for development. The database includes:

- **Users**: User accounts and wallet addresses
- **Artists**: Artist profiles and verification status
- **Tracks**: Music tracks with metadata and IPFS hashes
- **NFTs**: NFT ownership and marketplace data
- **Playlists**: User playlists and collections
- **Licenses**: Music licensing and permissions
- **Governance**: Proposals, votes, and DAO data
- **Transactions**: Blockchain transaction history

**Migration Ready**: The codebase is structured to easily migrate from JSON files to a proper database (PostgreSQL, MongoDB, etc.) when needed.

## 📚 API Documentation

The API documentation is available at `http://localhost:3001/api-docs` when running the backend service.

### Key Endpoints

#### Tracks
- `GET /api/tracks` - Get all tracks (with pagination)
- `GET /api/tracks/:id` - Get specific track
- `POST /api/tracks` - Upload new track (requires authentication)
- `POST /api/tracks/:id/play` - Increment play count

#### Artists  
- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get specific artist
- `GET /api/artists/:id/tracks` - Get artist's tracks
- `POST /api/artists` - Register new artist (requires authentication)

#### NFTs
- `GET /api/nfts` - Get all NFTs
- `GET /api/nfts/:id` - Get specific NFT
- `POST /api/nfts` - Mint new NFT (requires authentication)

#### Authentication
- `GET /api/auth/siwe-message` - Get SIWE message for signing
- `POST /api/auth/siwe-verify` - Verify SIWE signature
- `POST /api/auth/refresh` - Refresh JWT token

#### Health Checks
- `GET /health` - API health status
- `GET /debug` - Database debug information
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/nfts` - Get all NFTs
- `POST /api/nfts` - Create NFT
- `GET /api/governance/proposals` - Get governance proposals

## 🎨 UI Components

The frontend includes reusable components:

- **Layout**: Navigation, Footer, Hero sections
- **UI**: Buttons, Cards, Forms, Modals
- **Music**: Player, Track cards, Artist profiles
- **Web3**: Wallet connection, Transaction status

## 🔐 Security

- Input validation with Joi
- JWT authentication
- CORS configuration
- Helmet security headers
- SQL injection prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Discord: [HarmonyChain Community](https://discord.gg/harmonychain)

## 🗺️ Roadmap

- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Social features
- [ ] AI recommendations
- [ ] Cross-chain support
- [ ] Layer 2 integration

---

Built with ❤️ on Harmony Network