#!/bin/bash

# HarmonyChain Production Startup Script
# This script starts all services in the correct order for production deployment

echo "🚀 Starting HarmonyChain Production Environment..."

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

# Check if .env files exist
check_env_files() {
    print_status "Checking environment files..."
    
    if [ ! -f ".env" ]; then
        print_error "Root .env file not found. Run ./setup-environment.sh first."
        exit 1
    fi
    
    if [ ! -f "apps/api/.env" ]; then
        print_error "API .env file not found. Run ./setup-environment.sh first."
        exit 1
    fi
    
    if [ ! -f "apps/web/.env.local" ]; then
        print_error "Web .env.local file not found. Run ./setup-environment.sh first."
        exit 1
    fi
    
    print_success "Environment files found"
}

# Check if database is seeded
check_database() {
    print_status "Checking database..."
    
    if [ ! -d "apps/api/orbitdb" ] || [ ! -f "apps/api/orbitdb/tracks.json" ]; then
        print_warning "Database not seeded. Running seed script..."
        node scripts/seed-production-data.js
        if [ $? -eq 0 ]; then
            print_success "Database seeded successfully"
        else
            print_error "Failed to seed database"
            exit 1
        fi
    else
        print_success "Database already seeded"
    fi
}

# Start Hardhat node in background
start_blockchain() {
    print_status "Starting Hardhat blockchain node..."
    
    # Check if Hardhat node is already running
    if curl -s http://localhost:8545 > /dev/null 2>&1; then
        print_success "Hardhat node already running"
    else
        cd apps/contracts
        npx hardhat node --port 8545 > ../../logs/blockchain.log 2>&1 &
        BLOCKCHAIN_PID=$!
        echo $BLOCKCHAIN_PID > ../../logs/blockchain.pid
        cd ../..
        
        # Wait for blockchain to start
        print_status "Waiting for blockchain to start..."
        sleep 5
        
        # Check if blockchain is running
        if curl -s http://localhost:8545 > /dev/null 2>&1; then
            print_success "Blockchain node started (PID: $BLOCKCHAIN_PID)"
        else
            print_error "Failed to start blockchain node"
            exit 1
        fi
    fi
}

# Deploy contracts
deploy_contracts() {
    print_status "Deploying smart contracts..."
    
    cd apps/contracts
    npx hardhat run scripts/deploy.js --network localhost
    if [ $? -eq 0 ]; then
        print_success "Contracts deployed successfully"
        # Update contract addresses
        cd ../..
        ./update-contract-addresses.sh
    else
        print_error "Failed to deploy contracts"
        exit 1
    fi
}

# Start API server
start_api() {
    print_status "Starting API server..."
    
    cd apps/api
    npm run dev > ../../logs/api.log 2>&1 &
    API_PID=$!
    echo $API_PID > ../../logs/api.pid
    cd ../..
    
    # Wait for API to start
    print_status "Waiting for API server to start..."
    sleep 10
    
    # Check if API is running
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        print_success "API server started (PID: $API_PID)"
    else
        print_error "Failed to start API server"
        exit 1
    fi
}

# Start Web application
start_web() {
    print_status "Starting Web application..."
    
    cd apps/web
    npm run dev > ../../logs/web.log 2>&1 &
    WEB_PID=$!
    echo $WEB_PID > ../../logs/web.pid
    cd ../..
    
    # Wait for Web to start
    print_status "Waiting for Web application to start..."
    sleep 15
    
    # Check if Web is running
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Web application started (PID: $WEB_PID)"
    else
        print_error "Failed to start Web application"
        exit 1
    fi
}

# Create logs directory
mkdir -p logs

# Main execution
main() {
    print_status "HarmonyChain Production Startup"
    print_status "================================="
    
    # Check prerequisites
    check_env_files
    check_database
    
    # Start services
    start_blockchain
    deploy_contracts
    start_api
    start_web
    
    print_success "All services started successfully!"
    print_status ""
    print_status "🌐 Service URLs:"
    print_status "  Frontend: http://localhost:3000"
    print_status "  API: http://localhost:3001"
    print_status "  API Docs: http://localhost:3001/api-docs"
    print_status "  Blockchain: http://localhost:8545"
    print_status ""
    print_status "📋 Next Steps:"
    print_status "  1. Open http://localhost:3000 in your browser"
    print_status "  2. Connect your wallet (MetaMask, etc.)"
    print_status "  3. Switch to Localhost network (Chain ID: 1337)"
    print_status "  4. Start exploring the platform!"
    print_status ""
    print_status "🛑 To stop all services, run: ./stop-production.sh"
    print_status ""
    print_warning "Note: Make sure to set up Pinata API keys in .env files for real IPFS functionality"
}

# Run main function
main
