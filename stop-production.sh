#!/bin/bash

# HarmonyChain Production Stop Script
# This script stops all running services comprehensively

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

# Function to kill processes by port
kill_by_port() {
    local port=$1
    local service_name=$2
    
    print_status "Checking port $port for $service_name..."
    
    # Find processes using the port
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -n "$pids" ]; then
        print_status "Found processes on port $port: $pids"
        for pid in $pids; do
            if ps -p $pid > /dev/null 2>&1; then
                print_status "Stopping process $pid on port $port..."
                kill $pid 2>/dev/null
                sleep 1
                if ps -p $pid > /dev/null 2>&1; then
                    print_warning "Force killing process $pid..."
                    kill -9 $pid 2>/dev/null
                fi
            fi
        done
        print_success "$service_name stopped on port $port"
    else
        print_warning "No processes found on port $port"
    fi
}

# Function to kill processes by pattern
kill_by_pattern() {
    local pattern=$1
    local service_name=$2
    
    print_status "Looking for $service_name processes matching: $pattern"
    
    # Find PIDs matching the pattern
    local pids=$(pgrep -f "$pattern" 2>/dev/null)
    
    if [ -n "$pids" ]; then
        print_status "Found $service_name processes: $pids"
        for pid in $pids; do
            if ps -p $pid > /dev/null 2>&1; then
                print_status "Stopping $service_name process $pid..."
                kill $pid 2>/dev/null
                sleep 1
                if ps -p $pid > /dev/null 2>&1; then
                    print_warning "Force killing $service_name process $pid..."
                    kill -9 $pid 2>/dev/null
                fi
            fi
        done
        print_success "$service_name processes stopped"
    else
        print_warning "No $service_name processes found"
    fi
}

# Function to stop service by PID file
stop_service_by_pid_file() {
    local service_name=$1
    local pid_file="logs/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            print_status "Stopping $service_name (PID: $pid)..."
            kill $pid 2>/dev/null
            sleep 2
            if ps -p $pid > /dev/null 2>&1; then
                print_warning "Force killing $service_name..."
                kill -9 $pid 2>/dev/null
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

# Function to kill all HarmonyChain related processes
kill_harmony_processes() {
    print_status "Looking for all HarmonyChain related processes..."
    
    # Get current directory to identify our processes
    local project_dir=$(pwd)
    
    # Find all node processes that might be related to our project
    local harmony_pids=$(ps aux | grep -E "(node|npm|yarn|turbo)" | grep -v grep | grep -E "(HarmonyChain|tsx|next|hardhat|ipfs)" | awk '{print $2}')
    
    if [ -n "$harmony_pids" ]; then
        print_status "Found HarmonyChain related processes: $harmony_pids"
        for pid in $harmony_pids; do
            if ps -p $pid > /dev/null 2>&1; then
                print_status "Stopping HarmonyChain process $pid..."
                kill $pid 2>/dev/null
                sleep 1
                if ps -p $pid > /dev/null 2>&1; then
                    print_warning "Force killing HarmonyChain process $pid..."
                    kill -9 $pid 2>/dev/null
                fi
            fi
        done
        print_success "HarmonyChain processes stopped"
    else
        print_warning "No HarmonyChain processes found"
    fi
}

# Stop all services
main() {
    print_status "Stopping all HarmonyChain services..."
    
    # Method 1: Stop by PID files (if they exist)
    print_status "Method 1: Stopping services by PID files..."
    stop_service_by_pid_file "web"
    stop_service_by_pid_file "api"
    stop_service_by_pid_file "blockchain"
    
    # Method 2: Stop by port usage
    print_status "Method 2: Stopping services by port usage..."
    kill_by_port "3000" "Web Application"
    kill_by_port "3001" "API Server"
    kill_by_port "8545" "Blockchain Node"
    kill_by_port "5001" "IPFS"
    kill_by_port "8080" "IPFS Gateway"
    
    # Method 3: Stop by process patterns
    print_status "Method 3: Stopping services by process patterns..."
    kill_by_pattern "next dev" "Next.js"
    kill_by_pattern "tsx watch" "TypeScript Watch"
    kill_by_pattern "hardhat node" "Hardhat"
    kill_by_pattern "ipfs daemon" "IPFS"
    kill_by_pattern "npm.*start" "NPM Start"
    kill_by_pattern "turbo.*dev" "Turbo"
    
    # Method 4: Comprehensive HarmonyChain process cleanup
    print_status "Method 4: Comprehensive HarmonyChain process cleanup..."
    kill_harmony_processes
    
    # Final cleanup - kill any remaining processes in our project directory
    print_status "Final cleanup..."
    pkill -f "$(pwd)" 2>/dev/null || true
    
    print_success "All services stopped successfully!"
    print_status ""
    print_status "📋 Services stopped:"
    print_status "  ✅ Web application (port 3000)"
    print_status "  ✅ API server (port 3001)"
    print_status "  ✅ Blockchain node (port 8545)"
    print_status "  ✅ IPFS (ports 5001, 8080)"
    print_status "  ✅ All HarmonyChain related processes"
    print_status ""
    print_status "💡 To start services again, run: ./start-production.sh"
}

# Run main function
main
