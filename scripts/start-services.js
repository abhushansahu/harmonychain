#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting HarmonyChain services...\n');

// Service processes
const processes = [];

// Start PostgreSQL
function startPostgreSQL() {
  console.log('🗄️  Starting PostgreSQL...');
  
  const isMacOS = process.platform === 'darwin';
  const command = isMacOS ? 'brew' : 'sudo systemctl';
  const args = isMacOS ? ['services', 'start', 'postgresql@14'] : ['start', 'postgresql'];
  
  const pgProcess = spawn(command, args, { stdio: 'inherit' });
  processes.push(pgProcess);
  
  pgProcess.on('error', (error) => {
    console.error('❌ Failed to start PostgreSQL:', error.message);
  });
  
  console.log('✅ PostgreSQL started');
}

// Start Redis
function startRedis() {
  console.log('🔴 Starting Redis...');
  
  const isMacOS = process.platform === 'darwin';
  const command = isMacOS ? 'brew' : 'sudo systemctl';
  const args = isMacOS ? ['services', 'start', 'redis'] : ['start', 'redis-server'];
  
  const redisProcess = spawn(command, args, { stdio: 'inherit' });
  processes.push(redisProcess);
  
  redisProcess.on('error', (error) => {
    console.error('❌ Failed to start Redis:', error.message);
  });
  
  console.log('✅ Redis started');
}

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
    startPostgreSQL();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    startRedis();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    startIPFS();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    startHardhat();
    
    console.log('\n🎉 All services started successfully!');
    console.log('\n📊 Service Status:');
    console.log('- PostgreSQL: localhost:5432');
    console.log('- Redis: localhost:6379');
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
