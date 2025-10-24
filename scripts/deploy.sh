#!/bin/bash

# HarmonyChain Deployment Script
echo "🚀 Deploying HarmonyChain..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the HarmonyChain root directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create one from env.example"
    exit 1
fi

# Build all services
echo "🔨 Building all services..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy smart contracts
echo "📝 Deploying smart contracts..."
cd apps/contracts

# Check if we should deploy to testnet or mainnet
if [ "$1" = "mainnet" ]; then
    echo "🌐 Deploying to Harmony Mainnet..."
    npm run deploy
else
    echo "🧪 Deploying to Harmony Testnet..."
    npm run deploy:testnet
fi

if [ $? -ne 0 ]; then
    echo "❌ Contract deployment failed"
    exit 1
fi

echo "✅ Smart contracts deployed successfully"

# Go back to root
cd ../..

# Start services
echo "🎵 Starting HarmonyChain services..."

# Start API
echo "🔧 Starting API server..."
cd apps/api
npm run start &
API_PID=$!

# Start Frontend
echo "🎨 Starting Frontend server..."
cd ../web
npm run start &
WEB_PID=$!

# Go back to root
cd ../..

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "Services are running:"
echo "- Frontend: http://localhost:3000"
echo "- API: http://localhost:3001"
echo "- API Docs: http://localhost:3001/api-docs"
echo ""
echo "To stop services, run:"
echo "kill $API_PID $WEB_PID"
echo ""
echo "Or use Ctrl+C to stop this script"
