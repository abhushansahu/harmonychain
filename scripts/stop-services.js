#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🛑 Stopping HarmonyChain services...\n');

// Stop services
const services = [
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
