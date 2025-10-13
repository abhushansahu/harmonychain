#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up native services for HarmonyChain...\n');

// Check if running on macOS
const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

if (!isMacOS && !isLinux) {
  console.error('❌ This setup script only supports macOS and Linux');
  process.exit(1);
}

// Service configuration
const services = {
  postgres: {
    name: 'PostgreSQL',
    install: isMacOS ? 'brew install postgresql@14' : 'sudo apt-get install postgresql-14',
    start: isMacOS ? 'brew services start postgresql@14' : 'sudo systemctl start postgresql',
    check: 'psql --version'
  },
  redis: {
    name: 'Redis',
    install: isMacOS ? 'brew install redis' : 'sudo apt-get install redis-server',
    start: isMacOS ? 'brew services start redis' : 'sudo systemctl start redis-server',
    check: 'redis-cli --version'
  },
  ipfs: {
    name: 'IPFS',
    install: isMacOS ? 'brew install ipfs' : 'curl -O https://dist.ipfs.io/go-ipfs/v0.20.0/go-ipfs_v0.20.0_linux-amd64.tar.gz && tar -xzf go-ipfs_v0.20.0_linux-amd64.tar.gz && sudo mv go-ipfs/ipfs /usr/local/bin/',
    start: 'ipfs daemon',
    check: 'ipfs --version'
  }
};

// Check if service is installed
function checkService(service) {
  try {
    execSync(service.check, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Install service
function installService(service) {
  console.log(`📦 Installing ${service.name}...`);
  try {
    execSync(service.install, { stdio: 'inherit' });
    console.log(`✅ ${service.name} installed successfully`);
  } catch (error) {
    console.error(`❌ Failed to install ${service.name}:`, error.message);
    return false;
  }
  return true;
}

// Setup database
function setupDatabase() {
  console.log('\n🗄️  Setting up database...');
  
  try {
    // Create database and user
    execSync('createdb harmonychain', { stdio: 'inherit' });
    console.log('✅ Database "harmonychain" created');
    
    // Run schema initialization
    const schemaPath = path.join(__dirname, '../api/src/schema/init.sql');
    if (fs.existsSync(schemaPath)) {
      execSync(`psql -d harmonychain -f ${schemaPath}`, { stdio: 'inherit' });
      console.log('✅ Database schema initialized');
    }
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('Please run manually: createdb harmonychain');
  }
}

// Setup IPFS
function setupIPFS() {
  console.log('\n🌐 Setting up IPFS...');
  
  try {
    // Initialize IPFS if not already done
    execSync('ipfs init', { stdio: 'inherit' });
    console.log('✅ IPFS initialized');
    
    // Configure IPFS for server use
    execSync('ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"', { stdio: 'inherit' });
    execSync('ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"', { stdio: 'inherit' });
    console.log('✅ IPFS configured for server use');
  } catch (error) {
    console.log('ℹ️  IPFS may already be initialized');
  }
}

// Main setup function
async function main() {
  console.log('🚀 HarmonyChain Native Services Setup\n');
  
  // Check and install services
  for (const [key, service] of Object.entries(services)) {
    console.log(`\n🔍 Checking ${service.name}...`);
    
    if (checkService(service)) {
      console.log(`✅ ${service.name} is already installed`);
    } else {
      console.log(`❌ ${service.name} not found`);
      const install = await new Promise((resolve) => {
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        readline.question(`Install ${service.name}? (y/n): `, (answer) => {
          readline.close();
          resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
      });
      
      if (install) {
        if (!installService(service)) {
          console.log(`⚠️  Please install ${service.name} manually and run this script again`);
        }
      } else {
        console.log(`⚠️  Skipping ${service.name} installation`);
      }
    }
  }
  
  // Setup database
  setupDatabase();
  
  // Setup IPFS
  setupIPFS();
  
  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Start services: npm run start:services');
  console.log('2. Start development: npm run dev');
  console.log('\n🌐 Service URLs:');
  console.log('- PostgreSQL: localhost:5432');
  console.log('- Redis: localhost:6379');
  console.log('- IPFS: localhost:5001');
  console.log('- Hardhat: localhost:8545');
}

main().catch(console.error);
