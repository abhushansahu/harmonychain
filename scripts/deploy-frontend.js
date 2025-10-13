#!/usr/bin/env node

const { create } = require('ipfs-http-client')
const { ethers } = require('ethers')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Configuration
const IPFS_NODE_URL = process.env.IPFS_NODE_URL || 'https://ipfs.infura.io:5001'
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'http://localhost:8545'
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ENS_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' // ENS Registry

// ENS ABI (simplified)
const ENS_ABI = [
  'function setText(bytes32 node, string calldata key, string calldata value) external',
  'function resolver(bytes32 node) external view returns (address)'
]

const RESOLVER_ABI = [
  'function setText(bytes32 node, string calldata key, string calldata value) external'
]

class FrontendDeployer {
  constructor() {
    this.ipfs = create({ url: IPFS_NODE_URL })
    this.provider = new ethers.providers.JsonRpcProvider(ETHEREUM_RPC_URL)
    this.wallet = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, this.provider) : null
  }

  async buildFrontend() {
    console.log('🔨 Building frontend...')
    
    try {
      // Build the Next.js application
      execSync('npm run build', { 
        cwd: path.join(__dirname, '../frontend'),
        stdio: 'inherit'
      })
      
      console.log('✅ Frontend built successfully')
    } catch (error) {
      console.error('❌ Failed to build frontend:', error.message)
      throw error
    }
  }

  async deployToIPFS() {
    console.log('🌐 Deploying to IPFS...')
    
    try {
      const buildDir = path.join(__dirname, '../frontend/out')
      
      if (!fs.existsSync(buildDir)) {
        throw new Error('Build directory not found. Run build first.')
      }

      // Add entire build directory to IPFS
      const result = await this.ipfs.add(buildDir, { 
        recursive: true,
        pin: true
      })

      const frontendHash = result.cid.toString()
      console.log(`✅ Frontend deployed to IPFS: ${frontendHash}`)
      console.log(`🌐 Access at: https://ipfs.io/ipfs/${frontendHash}`)
      
      return frontendHash
    } catch (error) {
      console.error('❌ Failed to deploy to IPFS:', error.message)
      throw error
    }
  }

  async setENSRecord(domain, hash) {
    if (!this.wallet) {
      console.log('⚠️  No private key provided, skipping ENS setup')
      return
    }

    console.log(`📝 Setting ENS record for ${domain}...`)
    
    try {
      // Get ENS registry contract
      const ens = new ethers.Contract(ENS_ADDRESS, ENS_ABI, this.wallet)
      
      // Get resolver for the domain
      const node = ethers.utils.namehash(domain)
      const resolverAddress = await ens.resolver(node)
      
      if (resolverAddress === ethers.constants.AddressZero) {
        throw new Error(`No resolver found for ${domain}`)
      }

      // Get resolver contract
      const resolver = new ethers.Contract(resolverAddress, RESOLVER_ABI, this.wallet)
      
      // Set IPFS record
      const tx = await resolver.setText(node, 'ipfs', hash)
      console.log(`⏳ Transaction submitted: ${tx.hash}`)
      
      await tx.wait()
      console.log(`✅ ENS record set successfully`)
      console.log(`🌐 Access at: https://${domain}`)
      
    } catch (error) {
      console.error('❌ Failed to set ENS record:', error.message)
      throw error
    }
  }

  async pinContent(hash) {
    console.log(`📌 Pinning content: ${hash}`)
    
    try {
      await this.ipfs.pin.add(hash)
      console.log('✅ Content pinned successfully')
    } catch (error) {
      console.error('❌ Failed to pin content:', error.message)
    }
  }

  async deploy(domain = 'harmonychain.eth') {
    console.log('🚀 Starting frontend deployment...')
    
    try {
      // Step 1: Build frontend
      await this.buildFrontend()
      
      // Step 2: Deploy to IPFS
      const hash = await this.deployToIPFS()
      
      // Step 3: Pin content
      await this.pinContent(hash)
      
      // Step 4: Set ENS record
      await this.setENSRecord(domain, hash)
      
      console.log('\n🎉 Frontend deployment completed!')
      console.log(`📊 Deployment Summary:`)
      console.log(`   IPFS Hash: ${hash}`)
      console.log(`   IPFS URL: https://ipfs.io/ipfs/${hash}`)
      console.log(`   ENS Domain: ${domain}`)
      console.log(`   ENS URL: https://${domain}`)
      
      return hash
    } catch (error) {
      console.error('❌ Deployment failed:', error.message)
      process.exit(1)
    }
  }
}

// Main execution
async function main() {
  const deployer = new FrontendDeployer()
  const domain = process.argv[2] || 'harmonychain.eth'
  
  await deployer.deploy(domain)
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

module.exports = FrontendDeployer
