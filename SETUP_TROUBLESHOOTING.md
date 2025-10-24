# HarmonyChain - Setup Troubleshooting Guide

## 🚨 Common Setup Issues and Solutions

This guide helps you troubleshoot common issues when setting up and running the HarmonyChain platform.

## 🔧 **Environment Setup Issues**

### **Issue: "Cannot find module" errors**
**Symptoms:**
- `Error: Cannot find module '@harmonychain/shared'`
- `Error: Cannot find module 'ethers'`
- `Error: Cannot find module 'express'`

**Solutions:**
```bash
# 1. Install dependencies from root
cd /path/to/HarmonyChain
npm install

# 2. Install dependencies for each app
cd apps/api && npm install
cd apps/web && npm install
cd apps/contracts && npm install

# 3. Build shared package
cd packages/shared && npm run build
```

### **Issue: TypeScript compilation errors**
**Symptoms:**
- `Type error: Cannot find module`
- `Property 'xyz' does not exist on type`
- `Cannot resolve path to module`

**Solutions:**
```bash
# 1. Clean and rebuild
npm run clean
npm run build

# 2. Check TypeScript configuration
npx tsc --noEmit

# 3. Update dependencies
npm update
```

### **Issue: Port already in use**
**Symptoms:**
- `Error: listen EADDRINUSE: address already in use :::3000`
- `Error: listen EADDRINUSE: address already in use :::3001`

**Solutions:**
```bash
# 1. Find and kill processes using ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# 2. Use different ports
PORT=3002 npm run dev

# 3. Check what's using the ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001
```

## 🗄️ **Database Issues**

### **Issue: JSON file permission errors**
**Symptoms:**
- `Error: EACCES: permission denied, open './orbitdb/tracks.json'`
- `Error: ENOENT: no such file or directory`

**Solutions:**
```bash
# 1. Create database directory
mkdir -p apps/api/orbitdb

# 2. Set proper permissions
chmod 755 apps/api/orbitdb
chmod 644 apps/api/orbitdb/*.json

# 3. Initialize empty JSON files
echo '[]' > apps/api/orbitdb/tracks.json
echo '[]' > apps/api/orbitdb/artists.json
echo '[]' > apps/api/orbitdb/nfts.json
echo '[]' > apps/api/orbitdb/playlists.json
echo '[]' > apps/api/orbitdb/licenses.json
echo '[]' > apps/api/orbitdb/proposals.json
echo '[]' > apps/api/orbitdb/votes.json
echo '[]' > apps/api/orbitdb/transactions.json
echo '[]' > apps/api/orbitdb/users.json
echo '[]' > apps/api/orbitdb/analytics.json
```

### **Issue: Database corruption**
**Symptoms:**
- `SyntaxError: Unexpected token in JSON`
- `Error: Invalid JSON format`

**Solutions:**
```bash
# 1. Clear corrupted files
rm apps/api/orbitdb/*.json

# 2. Reinitialize empty files
echo '[]' > apps/api/orbitdb/tracks.json
echo '[]' > apps/api/orbitdb/artists.json
# ... repeat for all files

# 3. Run seed script to populate with sample data
npm run seed
```

## 🌐 **IPFS Issues**

### **Issue: IPFS connection failed**
**Symptoms:**
- `Error: IPFS connection failed`
- `Error: Cannot connect to IPFS node`

**Solutions:**
```bash
# 1. Check IPFS configuration
echo $IPFS_MOCK_MODE
echo $PINATA_API_KEY
echo $PINATA_SECRET_KEY

# 2. Enable mock mode for development
export IPFS_MOCK_MODE=true

# 3. Configure Pinata (for real IPFS)
export PINATA_API_KEY=your-api-key
export PINATA_SECRET_KEY=your-secret-key
export IPFS_MOCK_MODE=false
```

### **Issue: File upload failures**
**Symptoms:**
- `Error: File upload failed`
- `Error: IPFS hash not found`

**Solutions:**
```bash
# 1. Check file size limits
# Default limit is 10MB, check your file size

# 2. Check file format
# Supported: mp3, wav, flac, m4a

# 3. Enable mock mode for testing
export IPFS_MOCK_MODE=true
```

## ⛓️ **Blockchain Issues**

### **Issue: Blockchain connection failed**
**Symptoms:**
- `Error: Cannot connect to blockchain`
- `Error: Invalid network`

**Solutions:**
```bash
# 1. Check network configuration
echo $NETWORK
echo $RPC_URL

# 2. Enable mock mode for development
export BLOCKCHAIN_MOCK_MODE=true

# 3. Configure Harmony network
export NETWORK=harmony-testnet
export RPC_URL=https://api.s0.b.hmny.io
export BLOCKCHAIN_MOCK_MODE=false
```

### **Issue: Contract deployment failed**
**Symptoms:**
- `Error: Contract not deployed`
- `Error: Invalid contract address`

**Solutions:**
```bash
# 1. Deploy contracts
cd apps/contracts
npm run deploy

# 2. Update environment variables
export MUSIC_REGISTRY_ADDRESS=0x...
export NFT_MARKETPLACE_ADDRESS=0x...
export ROYALTY_DISTRIBUTOR_ADDRESS=0x...
export GOVERNANCE_DAO_ADDRESS=0x...

# 3. Enable mock mode for development
export BLOCKCHAIN_MOCK_MODE=true
```

## 🔐 **Authentication Issues**

### **Issue: JWT token errors**
**Symptoms:**
- `Error: Invalid token`
- `Error: Token expired`

**Solutions:**
```bash
# 1. Check JWT secret
echo $JWT_SECRET

# 2. Set JWT secret
export JWT_SECRET=your-secret-key

# 3. Clear browser storage and reconnect wallet
```

### **Issue: SIWE authentication failed**
**Symptoms:**
- `Error: Invalid signature`
- `Error: Nonce verification failed`

**Solutions:**
```bash
# 1. Check wallet connection
# Ensure wallet is connected and unlocked

# 2. Check network
# Ensure you're on the correct network

# 3. Clear nonce store
# Restart the API server to clear nonce store
```

## 🚀 **Development Server Issues**

### **Issue: API server won't start**
**Symptoms:**
- `Error: Cannot start server`
- `Error: Port already in use`

**Solutions:**
```bash
# 1. Check port availability
lsof -ti:3001 | xargs kill -9

# 2. Check environment variables
cp env.example .env
# Edit .env with your configuration

# 3. Start with debug mode
DEBUG=* npm run dev
```

### **Issue: Frontend won't start**
**Symptoms:**
- `Error: Cannot start Next.js`
- `Error: Build failed`

**Solutions:**
```bash
# 1. Clear Next.js cache
rm -rf .next
rm -rf node_modules/.cache

# 2. Reinstall dependencies
npm install

# 3. Start with debug mode
DEBUG=* npm run dev
```

## 📱 **Frontend Issues**

### **Issue: Wallet connection failed**
**Symptoms:**
- `Error: Wallet not found`
- `Error: Connection failed`

**Solutions:**
```bash
# 1. Check wallet installation
# Ensure MetaMask or other wallet is installed

# 2. Check network configuration
# Ensure you're on the correct network

# 3. Clear browser cache
# Clear browser cache and reload
```

### **Issue: Component rendering errors**
**Symptoms:**
- `Error: Cannot read property of undefined`
- `Error: Component not found`

**Solutions:**
```bash
# 1. Check component imports
# Ensure all components are properly imported

# 2. Check TypeScript errors
npx tsc --noEmit

# 3. Clear build cache
rm -rf .next
npm run build
```

## 🔍 **Debugging Tips**

### **Enable Debug Logging**
```bash
# API debugging
DEBUG=* npm run dev

# Frontend debugging
NODE_ENV=development npm run dev

# Blockchain debugging
DEBUG=blockchain npm run dev
```

### **Check Service Health**
```bash
# Check API health
curl http://localhost:3001/health

# Check debug info
curl http://localhost:3001/debug

# Check frontend
curl http://localhost:3000
```

### **Common Environment Variables**
```bash
# Core configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_TYPE=simpledb
DATABASE_PATH=./orbitdb

# IPFS
IPFS_MOCK_MODE=true
PINATA_API_KEY=your-key
PINATA_SECRET_KEY=your-secret

# Blockchain
BLOCKCHAIN_MOCK_MODE=true
NETWORK=harmony-testnet
RPC_URL=https://api.s0.b.hmny.io

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Smart Contracts
MUSIC_REGISTRY_ADDRESS=0x...
NFT_MARKETPLACE_ADDRESS=0x...
ROYALTY_DISTRIBUTOR_ADDRESS=0x...
GOVERNANCE_DAO_ADDRESS=0x...
```

## 📞 **Getting Help**

### **Check Logs**
```bash
# API logs
npm run dev 2>&1 | tee api.log

# Frontend logs
npm run dev 2>&1 | tee frontend.log

# Contract logs
npm run deploy 2>&1 | tee contract.log
```

### **Common Solutions**
1. **Restart everything**: Stop all services and restart
2. **Clear caches**: Remove node_modules, .next, dist folders
3. **Check environment**: Verify all environment variables
4. **Check ports**: Ensure no port conflicts
5. **Check permissions**: Ensure proper file permissions
6. **Check network**: Ensure internet connection and firewall settings

### **Still Having Issues?**
1. Check the error logs for specific error messages
2. Verify your environment configuration
3. Ensure all dependencies are installed
4. Check the GitHub issues for similar problems
5. Create a new issue with detailed error information

## 🎯 **Quick Fixes**

### **Complete Reset**
```bash
# 1. Stop all services
pkill -f "npm run dev"
pkill -f "node"

# 2. Clean everything
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf .next
rm -rf dist
rm -rf apps/*/dist

# 3. Reinstall everything
npm install
cd apps/api && npm install
cd apps/web && npm install
cd apps/contracts && npm install
cd packages/shared && npm install

# 4. Rebuild
npm run build

# 5. Start services
npm run dev
```

### **Database Reset**
```bash
# 1. Clear all data
rm -rf apps/api/orbitdb/*.json

# 2. Reinitialize
echo '[]' > apps/api/orbitdb/tracks.json
echo '[]' > apps/api/orbitdb/artists.json
echo '[]' > apps/api/orbitdb/nfts.json
echo '[]' > apps/api/orbitdb/playlists.json
echo '[]' > apps/api/orbitdb/licenses.json
echo '[]' > apps/api/orbitdb/proposals.json
echo '[]' > apps/api/orbitdb/votes.json
echo '[]' > apps/api/orbitdb/transactions.json
echo '[]' > apps/api/orbitdb/users.json
echo '[]' > apps/api/orbitdb/analytics.json

# 3. Seed with sample data
npm run seed
```

This troubleshooting guide should help you resolve most common setup issues. If you're still having problems, check the error logs and create a detailed issue report.
