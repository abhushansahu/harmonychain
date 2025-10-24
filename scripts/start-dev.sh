#!/bin/bash

# HarmonyChain Development Environment Startup Script
# This script starts all services for development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Function to cleanup background processes
cleanup() {
    print_status "Shutting down services..."
    pkill -f "hardhat node" || true
    pkill -f "node dist/index.js" || true
    pkill -f "next start" || true
    print_success "All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "🚀 Starting HarmonyChain Development Environment"
echo "==============================================="

# Check if .env files exist
if [ ! -f .env ]; then
    print_error ".env file not found. Please run ./scripts/setup.sh first"
    exit 1
fi

# Start Hardhat blockchain node
print_status "Starting Hardhat blockchain node..."
cd apps/contracts
npm run node &
HARDHAT_PID=$!
cd ../..

# Wait for blockchain to be ready
print_status "Waiting for blockchain to be ready..."
sleep 5

# Deploy contracts
print_status "Deploying smart contracts..."
cd apps/contracts
npm run deploy
cd ../..

# Start API server
print_status "Starting API server..."
cd apps/api
npm run start &
API_PID=$!
cd ../..

# Wait for API to be ready
print_status "Waiting for API to be ready..."
sleep 3

# Start Web application
print_status "Starting Web application..."
cd apps/web
npm run start &
WEB_PID=$!
cd ../..

# Wait for services to be ready
print_status "Waiting for all services to be ready..."
sleep 5

# Check if services are running
print_status "Checking service status..."

# Check blockchain
if curl -s http://localhost:8545 > /dev/null; then
    print_success "✅ Blockchain node running on http://localhost:8545"
else
    print_error "❌ Blockchain node not responding"
fi

# Check API
if curl -s http://localhost:3001/health > /dev/null; then
    print_success "✅ API server running on http://localhost:3001"
else
    print_error "❌ API server not responding"
fi

# Check Web app
if curl -s http://localhost:3000 > /dev/null; then
    print_success "✅ Web application running on http://localhost:3000"
else
    print_error "❌ Web application not responding"
fi

echo ""
echo "🎉 All services are running!"
echo "============================"
echo ""
echo "Access your applications:"
echo "• Web App: http://localhost:3000"
echo "• API: http://localhost:3001"
echo "• API Docs: http://localhost:3001/api-docs"
echo "• Blockchain Explorer: http://localhost:8545"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Keep script running and wait for interrupt
wait
