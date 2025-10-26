#!/bin/bash

# HarmonyChain Production Stop Script
# This script stops all running services

echo "🛑 Stopping HarmonyChain Production Environment..."

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

# Stop service by PID file
stop_service() {
    local service_name=$1
    local pid_file="logs/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            print_status "Stopping $service_name (PID: $pid)..."
            kill $pid
            sleep 2
            if ps -p $pid > /dev/null 2>&1; then
                print_warning "Force killing $service_name..."
                kill -9 $pid
            fi
            print_success "$service_name stopped"
        else
            print_warning "$service_name was not running"
        fi
        rm -f "$pid_file"
    else
        print_warning "No PID file found for $service_name"
    fi
}

# Stop all services
main() {
    print_status "Stopping all HarmonyChain services..."
    
    # Stop services in reverse order
    stop_service "web"
    stop_service "api"
    stop_service "blockchain"
    
    # Clean up any remaining processes
    print_status "Cleaning up remaining processes..."
    
    # Kill any remaining node processes on our ports
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "tsx watch" 2>/dev/null || true
    pkill -f "hardhat node" 2>/dev/null || true
    
    print_success "All services stopped successfully!"
    print_status ""
    print_status "📋 Services stopped:"
    print_status "  ✅ Web application (port 3000)"
    print_status "  ✅ API server (port 3001)"
    print_status "  ✅ Blockchain node (port 8545)"
    print_status ""
    print_status "💡 To start services again, run: ./start-production.sh"
}

# Run main function
main
