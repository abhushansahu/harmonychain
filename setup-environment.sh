#!/bin/bash

# HarmonyChain Environment Setup Script
# This script sets up the production environment files

echo "🚀 Setting up HarmonyChain Production Environment..."

# Create root .env file
echo "📝 Creating root .env file..."
cp env.production .env

# Create API .env file
echo "📝 Creating API .env file..."
cat > apps/api/.env << 'EOF'
# HarmonyChain API Environment Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost:3000

# JWT Authentication
JWT_SECRET=harmony-chain-super-secret-jwt-key-change-this-in-production-2024

# Blockchain Configuration
NETWORK=harmony-testnet
LOCAL_RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Smart Contract Addresses (will be updated after deployment)
MUSIC_REGISTRY_ADDRESS=0x0000000000000000000000000000000000000000
NFT_MARKETPLACE_ADDRESS=0x0000000000000000000000000000000000000000
ROYALTY_DISTRIBUTOR_ADDRESS=0x0000000000000000000000000000000000000000
GOVERNANCE_DAO_ADDRESS=0x0000000000000000000000000000000000000000

# Blockchain Configuration
BLOCKCHAIN_MOCK_MODE=false
HARMONY_RPC_URL=https://api.s0.b.hmny.io

# IPFS Configuration
PINATA_API_KEY=YOUR_PINATA_API_KEY_HERE
PINATA_SECRET_KEY=YOUR_PINATA_SECRET_KEY_HERE
PINATA_GATEWAY=https://gateway.pinata.cloud
IPFS_API_URL=http://localhost:5001
IPFS_MOCK_MODE=false

# Database Configuration
DB_TYPE=simpledb
DB_PATH=./orbitdb

# Production Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000
HELMET_ENABLED=true
LOG_LEVEL=info
SEED_DATA=true
EOF

# Create Web .env.local file
echo "📝 Creating Web .env.local file..."
cat > apps/web/.env.local << 'EOF'
# HarmonyChain Frontend Environment Configuration
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Blockchain Configuration
NEXT_PUBLIC_NETWORK=harmony-testnet
NEXT_PUBLIC_CHAIN_ID=1666700000
NEXT_PUBLIC_RPC_URL=https://api.s0.b.hmny.io

# Smart Contract Addresses (will be updated after deployment)
NEXT_PUBLIC_MUSIC_REGISTRY_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_ROYALTY_DISTRIBUTOR_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_GOVERNANCE_DAO_ADDRESS=0x0000000000000000000000000000000000000000

# IPFS Configuration
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud

# Feature Flags
NEXT_PUBLIC_ENABLE_NFT_MARKETPLACE=true
NEXT_PUBLIC_ENABLE_GOVERNANCE=true
NEXT_PUBLIC_ENABLE_ARTIST_DASHBOARD=true
NEXT_PUBLIC_ENABLE_UPLOAD=true

# Development Configuration
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_MOCK_MODE=false
EOF

echo "✅ Environment files created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up Pinata account at https://pinata.cloud"
echo "2. Update API keys in .env files"
echo "3. Deploy smart contracts to Harmony Testnet"
echo "4. Update contract addresses in .env files"
echo "5. Run: npm run seed to populate database"
echo "6. Start services: npm run dev"
