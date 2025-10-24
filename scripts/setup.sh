#!/bin/bash

# HarmonyChain Setup Script
# This script sets up the complete HarmonyChain development environment

set -e

echo "🚀 Setting up HarmonyChain Development Environment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm $(npm -v) detected"

# Install dependencies
print_status "Installing dependencies..."
npm install

# Create environment files
print_status "Setting up environment configuration..."

# Copy example environment file
if [ ! -f .env ]; then
    cp env.example .env
    print_success "Created .env file from env.example"
    print_warning "Please update .env with your actual API keys and configuration"
else
    print_warning ".env file already exists, skipping creation"
fi

# Create API environment file
if [ ! -f apps/api/.env ]; then
    cp env.example apps/api/.env
    print_success "Created apps/api/.env file"
fi

# Create Web environment file
if [ ! -f apps/web/.env.local ]; then
    cat > apps/web/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_HARMONY_RPC=https://api.s0.b.hmny.io
NEXT_PUBLIC_HARMONY_MAINNET_RPC=https://api.harmony.one
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-wallet-connect-project-id
NEXT_PUBLIC_MUSIC_REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_ROYALTY_DISTRIBUTOR_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
NEXT_PUBLIC_GOVERNANCE_DAO_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
EOF
    print_success "Created apps/web/.env.local file"
fi

# Create contracts environment file
if [ ! -f apps/contracts/.env ]; then
    cat > apps/contracts/.env << EOF
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
LOCAL_RPC_URL=http://localhost:8545
LOCAL_CHAIN_ID=1337
EOF
    print_success "Created apps/contracts/.env file"
fi

# Build all applications
print_status "Building applications..."

# Build API
print_status "Building API..."
cd apps/api
npm run build
cd ../..

# Build Web App
print_status "Building Web App..."
cd apps/web
npm run build
cd ../..

# Build Contracts
print_status "Building Contracts..."
cd apps/contracts
npm run build
cd ../..

print_success "All applications built successfully"

# Create SimpleDB directory
print_status "Setting up SimpleDB..."
mkdir -p .simpledb
print_success "SimpleDB directory created"

# Display next steps
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Update your .env files with actual API keys:"
echo "   - Pinata API keys for IPFS storage"
echo "   - WalletConnect Project ID for wallet connection"
echo "   - Lighthouse API key for decentralized storage"
echo ""
echo "2. Start the development environment:"
echo "   ./scripts/start-dev.sh"
echo ""
echo "3. Or start individual services:"
echo "   - Blockchain: cd apps/contracts && npm run node"
echo "   - API: cd apps/api && npm run start"
echo "   - Web: cd apps/web && npm run dev"
echo ""
echo "4. Access the application:"
echo "   - Web App: http://localhost:3000"
echo "   - API: http://localhost:3001"
echo "   - API Docs: http://localhost:3001/api-docs"
echo "   - Blockchain Explorer: http://localhost:8545"
echo ""
echo "Happy coding! 🚀"