#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🛑 Stopping HarmonyChain services...\n');

// Stop services
const services = [
  { name: 'PostgreSQL', command: process.platform === 'darwin' ? 'brew services stop postgresql@14' : 'sudo systemctl stop postgresql' },
  { name: 'Redis', command: process.platform === 'darwin' ? 'brew services stop redis' : 'sudo systemctl stop redis-server' },
  { name: 'IPFS', command: 'pkill -f "ipfs daemon"' },
  { name: 'Hardhat', command: 'pkill -f "hardhat node"' }
];

services.forEach(service => {
  try {
    console.log(`🛑 Stopping ${service.name}...`);
    execSync(service.command, { stdio: 'inherit' });
    console.log(`✅ ${service.name} stopped`);
  } catch (error) {
    console.log(`⚠️  ${service.name} may not be running`);
  }
});

console.log('\n✅ All services stopped');
