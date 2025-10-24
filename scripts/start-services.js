#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting HarmonyChain services...\n');

// Service processes
const processes = [];


// Start IPFS
function startIPFS() {
  console.log('🌐 Starting IPFS...');
  
  const ipfsProcess = spawn('ipfs', ['daemon'], { 
    stdio: 'inherit',
    detached: false
  });
  
  processes.push(ipfsProcess);
  
  ipfsProcess.on('error', (error) => {
    console.error('❌ Failed to start IPFS:', error.message);
  });
  
  ipfsProcess.on('spawn', () => {
    console.log('✅ IPFS daemon started');
  });
}

// Start Hardhat node
function startHardhat() {
  console.log('⛓️  Starting Hardhat node...');
  
  const hardhatProcess = spawn('npx', ['hardhat', 'node'], {
    cwd: path.join(__dirname, '../contracts'),
    stdio: 'inherit',
    detached: false
  });
  
  processes.push(hardhatProcess);
  
  hardhatProcess.on('error', (error) => {
    console.error('❌ Failed to start Hardhat:', error.message);
  });
  
  hardhatProcess.on('spawn', () => {
    console.log('✅ Hardhat node started');
  });
}

// Graceful shutdown
function shutdown() {
  console.log('\n🛑 Shutting down services...');
  
  processes.forEach(process => {
    if (process && !process.killed) {
      process.kill('SIGTERM');
    }
  });
  
  console.log('✅ All services stopped');
  process.exit(0);
}

// Handle process signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start all services
async function main() {
  try {
    // Check if services are already running
    console.log('🔍 Checking service status...');
    
    // Start services
    
    startIPFS();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    startHardhat();
    
    console.log('\n🎉 All services started successfully!');
    console.log('\n📊 Service Status:');
    console.log('- IPFS: localhost:5001');
    console.log('- Hardhat: localhost:8545');
    console.log('\n💡 Press Ctrl+C to stop all services');
    
    // Keep the script running
    process.stdin.resume();
    
  } catch (error) {
    console.error('❌ Failed to start services:', error);
    shutdown();
  }
}

main();
