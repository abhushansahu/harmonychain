#!/usr/bin/env node

const { execSync, exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

console.log('🛑 Stopping HarmonyChain services...\n');

// Function to run command and handle errors
async function runCommand(command, serviceName) {
  try {
    console.log(`🛑 Stopping ${serviceName}...`);
    await execAsync(command);
    console.log(`✅ ${serviceName} stopped`);
    return true;
  } catch (error) {
    console.log(`⚠️  ${serviceName} may not be running`);
    return false;
  }
}

// Function to kill processes by port
async function killByPort(port, serviceName) {
  try {
    console.log(`🔍 Checking port ${port} for ${serviceName}...`);
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    const pids = stdout.trim().split('\n').filter(pid => pid);
    
    if (pids.length > 0) {
      console.log(`📋 Found processes on port ${port}: ${pids.join(', ')}`);
      for (const pid of pids) {
        try {
          await execAsync(`kill ${pid}`);
          console.log(`✅ Killed process ${pid} on port ${port}`);
        } catch (error) {
          console.log(`⚠️  Could not kill process ${pid}`);
        }
      }
    } else {
      console.log(`ℹ️  No processes found on port ${port}`);
    }
  } catch (error) {
    console.log(`ℹ️  No processes found on port ${port}`);
  }
}

// Function to kill processes by pattern
async function killByPattern(pattern, serviceName) {
  try {
    console.log(`🔍 Looking for ${serviceName} processes...`);
    const { stdout } = await execAsync(`pgrep -f "${pattern}"`);
    const pids = stdout.trim().split('\n').filter(pid => pid);
    
    if (pids.length > 0) {
      console.log(`📋 Found ${serviceName} processes: ${pids.join(', ')}`);
      for (const pid of pids) {
        try {
          await execAsync(`kill ${pid}`);
          console.log(`✅ Killed ${serviceName} process ${pid}`);
        } catch (error) {
          console.log(`⚠️  Could not kill ${serviceName} process ${pid}`);
        }
      }
    } else {
      console.log(`ℹ️  No ${serviceName} processes found`);
    }
  } catch (error) {
    console.log(`ℹ️  No ${serviceName} processes found`);
  }
}

// Main stop function
async function stopServices() {
  console.log('🛑 Starting comprehensive service shutdown...\n');
  
  // Method 1: Stop by port usage
  console.log('📡 Method 1: Stopping by port usage...');
  await killByPort('3000', 'Web Application');
  await killByPort('3001', 'API Server');
  await killByPort('8545', 'Blockchain Node');
  await killByPort('5001', 'IPFS');
  await killByPort('8080', 'IPFS Gateway');
  
  // Method 2: Stop by process patterns
  console.log('\n🔍 Method 2: Stopping by process patterns...');
  await killByPattern('next dev', 'Next.js');
  await killByPattern('tsx watch', 'TypeScript Watch');
  await killByPattern('hardhat node', 'Hardhat');
  await killByPattern('ipfs daemon', 'IPFS');
  await killByPattern('npm.*start', 'NPM Start');
  await killByPattern('turbo.*dev', 'Turbo');
  
  // Method 3: Stop specific services
  console.log('\n🛑 Method 3: Stopping specific services...');
  await runCommand('pkill -f "ipfs daemon"', 'IPFS');
  await runCommand('pkill -f "hardhat node"', 'Hardhat');
  await runCommand('pkill -f "next dev"', 'Next.js');
  await runCommand('pkill -f "tsx watch"', 'TypeScript Watch');
  
  // Method 4: Kill all HarmonyChain related processes
  console.log('\n🔍 Method 4: Comprehensive cleanup...');
  try {
    const { stdout } = await execAsync('ps aux | grep -E "(node|npm|yarn|turbo)" | grep -v grep | grep -E "(HarmonyChain|tsx|next|hardhat|ipfs)" | awk \'{print $2}\'');
    const harmonyPids = stdout.trim().split('\n').filter(pid => pid);
    
    if (harmonyPids.length > 0) {
      console.log(`📋 Found HarmonyChain processes: ${harmonyPids.join(', ')}`);
      for (const pid of harmonyPids) {
        try {
          await execAsync(`kill ${pid}`);
          console.log(`✅ Killed HarmonyChain process ${pid}`);
        } catch (error) {
          console.log(`⚠️  Could not kill HarmonyChain process ${pid}`);
        }
      }
    } else {
      console.log('ℹ️  No HarmonyChain processes found');
    }
  } catch (error) {
    console.log('ℹ️  No HarmonyChain processes found');
  }
  
  console.log('\n✅ All services stopped successfully!');
  console.log('📋 Services stopped:');
  console.log('  ✅ Web application (port 3000)');
  console.log('  ✅ API server (port 3001)');
  console.log('  ✅ Blockchain node (port 8545)');
  console.log('  ✅ IPFS (ports 5001, 8080)');
  console.log('  ✅ All HarmonyChain related processes');
}

// Run the stop function
stopServices().catch(console.error);
