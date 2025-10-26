# HarmonyChain Development Setup Guide

## 🎯 Overview

This guide will help you set up HarmonyChain for development and testing. The platform currently uses sample data and mock services, with options to configure real blockchain and IPFS integration.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- A wallet with testnet tokens (MetaMask recommended)
- Pinata account (for IPFS storage)

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Clone and setup environment
git clone <your-repo-url>
cd HarmonyChain

# Setup environment files
./setup-environment.sh

# Update contract addresses (after deployment)
./update-contract-addresses.sh
```

### 2. Start All Services

```bash
# Start everything at once
./start-production.sh
```

### 3. Access the Platform

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs
- **Blockchain**: http://localhost:8545

## 🔧 External Services Setup

### Pinata IPFS Setup

1. **Create Pinata Account**
   - Go to https://pinata.cloud
   - Sign up for a free account
   - Verify your email

2. **Get API Keys**
   - Go to API Keys section in dashboard
   - Create a new API key
   - Copy the API Key and Secret Key

3. **Update Environment Files**
   ```bash
   # Edit .env file
   PINATA_API_KEY=your-api-key-here
   PINATA_SECRET_KEY=your-secret-key-here
   
   # Edit apps/api/.env file
   PINATA_API_KEY=your-api-key-here
   PINATA_SECRET_KEY=your-secret-key-here
   ```

### Harmony Wallet Setup

1. **Install MetaMask**
   - Install MetaMask browser extension
   - Create a new wallet or import existing

2. **Add Harmony Network**
   - Open MetaMask
   - Go to Settings > Networks > Add Network
   - Add Harmony Testnet:
     - Network Name: Harmony Testnet
     - RPC URL: https://api.s0.b.hmny.io
     - Chain ID: 1666700000
     - Currency Symbol: ONE
     - Block Explorer: https://explorer.pops.one

3. **Get Testnet Tokens**
   - Visit Harmony Testnet Faucet: https://faucet.pops.one
   - Enter your wallet address
   - Request testnet ONE tokens

4. **Switch to Localhost Network**
   - In MetaMask, switch to "Localhost 8545"
   - This connects to your local Hardhat node

## 🏗️ Smart Contract Deployment

### Local Deployment (Automatic)

The startup script automatically deploys contracts to local Hardhat network:

```bash
./start-production.sh
```

### Harmony Testnet Deployment (Manual)

1. **Update Environment for Testnet**
   ```bash
   # Edit .env file
   NETWORK=harmony-testnet
   BLOCKCHAIN_MOCK_MODE=false
   ```

2. **Deploy to Testnet**
   ```bash
   cd apps/contracts
   npx hardhat run scripts/deploy.js --network harmonyTestnet
   ```

3. **Update Contract Addresses**
   - Copy the deployed addresses from the output
   - Update all .env files with the new addresses

## 🎵 Features Overview

### ✅ Working Features (with Sample Data)

1. **Music Discovery**
   - Browse tracks with sample data
   - Search and filter functionality
   - Genre-based filtering
   - Play count tracking

2. **NFT Marketplace**
   - View music NFTs (sample data)
   - NFT creation interface
   - Ownership display
   - Price tracking

3. **Artist Dashboard**
   - Analytics from sample database
   - Track performance metrics
   - Revenue tracking display
   - Earnings display

4. **Upload System**
   - File upload interface
   - Metadata forms
   - License settings
   - Success confirmation

5. **Governance**
   - Create proposals interface
   - Vote on proposals interface
   - Proposal execution interface
   - DAO analytics display

6. **Music Player**
   - Audio player interface
   - Queue management
   - Play count tracking
   - User listening history

## 🔍 Troubleshooting

### Common Issues

1. **"Contract not found" errors**
   - Ensure contracts are deployed
   - Check contract addresses in .env files
   - Verify network connection

2. **"IPFS upload failed" errors**
   - Check Pinata API keys
   - Verify internet connection
   - Check file size limits

3. **"Wallet not connected" errors**
   - Connect MetaMask wallet
   - Switch to correct network
   - Refresh the page

4. **"API not responding" errors**
   - Check if API server is running
   - Verify port 3001 is available
   - Check API logs in logs/api.log

### Service Status Check

```bash
# Check if services are running
curl http://localhost:3001/health  # API health
curl http://localhost:8545         # Blockchain
curl http://localhost:3000         # Frontend
```

### Logs

Check service logs for debugging:

```bash
# View logs
tail -f logs/api.log      # API server logs
tail -f logs/web.log      # Web application logs
tail -f logs/blockchain.log # Blockchain logs
```

## 📊 Database Management

### View Database

```bash
# Check database files
ls -la apps/api/orbitdb/

# View specific data
cat apps/api/orbitdb/tracks.json
cat apps/api/orbitdb/artists.json
cat apps/api/orbitdb/nfts.json
```

### Reset Database

```bash
# Clear database
rm -rf apps/api/orbitdb/*

# Reseed database
node scripts/seed-production-data.js
```

## 🚀 Production Deployment

### Environment Variables for Production

```bash
# Production .env
NODE_ENV=production
NETWORK=harmony-mainnet
BLOCKCHAIN_MOCK_MODE=false
IPFS_MOCK_MODE=false
PINATA_API_KEY=your-production-key
PINATA_SECRET_KEY=your-production-secret
```

### Security Considerations

1. **Change JWT Secret**
   - Generate a strong secret key
   - Update JWT_SECRET in all .env files

2. **Use Production Database**
   - Migrate from JSON files to PostgreSQL
   - Set up proper database credentials

3. **Enable HTTPS**
   - Use SSL certificates
   - Update CORS origins

4. **Rate Limiting**
   - Configure proper rate limits
   - Monitor API usage

## 📞 Support

If you encounter issues:

1. Check the logs for error messages
2. Verify all environment variables are set
3. Ensure all services are running
4. Check network connectivity
5. Review this troubleshooting guide

## 🎉 Success!

Once everything is set up, you should see:

- ✅ Frontend loading with real data
- ✅ Wallet connection working
- ✅ Music tracks playing from IPFS
- ✅ NFT marketplace functional
- ✅ Artist dashboard showing analytics
- ✅ Governance proposals working
- ✅ All features integrated with real blockchain

Enjoy your fully functional HarmonyChain platform! 🎵
