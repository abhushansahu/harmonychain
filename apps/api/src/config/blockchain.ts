import { ethers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Blockchain configuration with network detection and fallback modes
 * Supports local Hardhat, Harmony testnet, and Harmony mainnet
 */
const LOCAL_RPC_URL = process.env.LOCAL_RPC_URL || 'http://127.0.0.1:8545'
const PRIVATE_KEY = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

// Network detection
const NETWORK = process.env.NETWORK || 'localhost'
const MOCK_MODE = process.env.BLOCKCHAIN_MOCK_MODE === 'true'

/**
 * Create provider and wallet with network detection
 */
let provider: ethers.JsonRpcProvider
let wallet: ethers.Wallet | null = null

try {
  // Determine RPC URL based on network
  let rpcUrl = LOCAL_RPC_URL
  if (NETWORK === 'harmony-testnet') {
    rpcUrl = 'https://api.s0.b.hmny.io'
  } else if (NETWORK === 'harmony-mainnet') {
    rpcUrl = 'https://api.harmony.one'
  }

  provider = new ethers.JsonRpcProvider(rpcUrl)
  wallet = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : null
} catch (error) {
  console.error('Failed to initialize blockchain provider:', error)
  // Create a mock provider for fallback
  provider = new ethers.JsonRpcProvider('http://localhost:8545')
  wallet = null
}

export { provider, wallet }

/**
 * Contract addresses with network-specific defaults
 */
export const CONTRACT_ADDRESSES = {
  musicRegistry: process.env.MUSIC_REGISTRY_ADDRESS || (NETWORK === 'localhost' ? '0x5FbDB2315678afecb367f032d93F642f64180aa3' : ''),
  nftMarketplace: process.env.NFT_MARKETPLACE_ADDRESS || (NETWORK === 'localhost' ? '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' : ''),
  royaltyDistributor: process.env.ROYALTY_DISTRIBUTOR_ADDRESS || (NETWORK === 'localhost' ? '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' : ''),
  governanceDAO: process.env.GOVERNANCE_DAO_ADDRESS || (NETWORK === 'localhost' ? '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9' : '')
}

/**
 * Validate contract addresses
 */
const validateContractAddresses = () => {
  const missing = Object.entries(CONTRACT_ADDRESSES)
    .filter(([_, address]) => !address || address === '')
    .map(([name, _]) => name)

  if (missing.length > 0) {
    console.warn(`⚠️ Missing contract addresses: ${missing.join(', ')}`)
    console.warn(`Set environment variables: ${missing.map(name => name.toUpperCase()).join(', ')}`)
  }

  return missing.length === 0
}

// Contract ABIs (simplified for now)
export const MUSIC_REGISTRY_ABI = [
  "function registerTrack(string memory _title, uint256 _duration, string memory _genre, string memory _coverArt, string memory _audioFile, string memory _ipfsHash, uint256 _price) external",
  "function getTrack(uint256 _trackId) external view returns (tuple(uint256 id, string title, string artist, uint256 artistId, uint256 duration, string genre, string coverArt, string audioFile, string ipfsHash, uint256 price, bool isStreamable, uint256 playCount, address owner, uint256 createdAt))",
  "function getTotalTracks() external view returns (uint256)",
  "function playTrack(uint256 _trackId) external",
  "event TrackRegistered(uint256 indexed trackId, string title, string artist, address indexed owner, string ipfsHash)"
]

export const NFT_MARKETPLACE_ABI = [
  "function mintNFT(address _to, string memory _tokenURI, uint256 _trackId, uint256 _price) external payable returns (uint256)",
  "function purchaseNFT(uint256 _tokenId) external payable",
  "function getNFT(uint256 _tokenId) external view returns (tuple(uint256 tokenId, address creator, address owner, uint256 price, bool isListed, uint256 trackId, uint256 createdAt))",
  "event NFTMinted(uint256 indexed tokenId, address indexed creator, uint256 indexed trackId, string tokenURI)"
]

/**
 * Contract instances with validation and fallback
 */
export const getMusicRegistryContract = () => {
  if (!CONTRACT_ADDRESSES.musicRegistry) {
    if (MOCK_MODE) {
      console.log('🔧 Using mock Music Registry contract')
      return createMockContract('MusicRegistry')
    }
    throw new Error('Music Registry contract address not set. Set MUSIC_REGISTRY_ADDRESS environment variable.')
  }
  return new ethers.Contract(CONTRACT_ADDRESSES.musicRegistry, MUSIC_REGISTRY_ABI, wallet || provider)
}

export const getNFTMarketplaceContract = () => {
  if (!CONTRACT_ADDRESSES.nftMarketplace) {
    if (MOCK_MODE) {
      console.log('🔧 Using mock NFT Marketplace contract')
      return createMockContract('NFTMarketplace')
    }
    throw new Error('NFT Marketplace contract address not set. Set NFT_MARKETPLACE_ADDRESS environment variable.')
  }
  return new ethers.Contract(CONTRACT_ADDRESSES.nftMarketplace, NFT_MARKETPLACE_ABI, wallet || provider)
}

/**
 * Create mock contract for development/testing
 */
const createMockContract = (name: string) => {
  return {
    getAddress: () => `0xMock${name}${Math.random().toString(36).substring(2, 15)}`,
    interface: {
      parseLog: () => null
    },
    // Mock methods that return promises
    getTotalTracks: () => Promise.resolve(0),
    getTrack: () => Promise.resolve(null),
    registerTrack: () => Promise.resolve({ wait: () => Promise.resolve({ logs: [] }) }),
    playTrack: () => Promise.resolve({ wait: () => Promise.resolve({ logs: [] }) }),
    getArtist: () => Promise.resolve(null),
    registerArtist: () => Promise.resolve({ wait: () => Promise.resolve({ logs: [] }) }),
    getArtistTracks: () => Promise.resolve([]),
    mintNFT: () => Promise.resolve({ wait: () => Promise.resolve({ logs: [] }) })
  }
}

/**
 * Initialize blockchain connection with health checks
 */
export const initBlockchain = async () => {
  try {
    // Test provider connection
    const network = await provider.getNetwork()
    console.log(`✅ Connected to ${network.name} (Chain ID: ${network.chainId})`)
    
    // Validate contract addresses
    const contractsValid = validateContractAddresses()
    if (!contractsValid && !MOCK_MODE) {
      console.warn('⚠️ Some contracts are not deployed. Using mock mode.')
    }

    // Check wallet connection
    if (wallet) {
      try {
        const balance = await provider.getBalance(wallet.address)
        console.log(`✅ Wallet connected: ${wallet.address}`)
        console.log(`💰 Balance: ${ethers.formatEther(balance)} ${network.name === 'localhost' ? 'ETH' : 'ONE'}`)
      } catch (error) {
        console.warn('⚠️ Wallet balance check failed:', error.message)
      }
    } else {
      console.warn('⚠️ No wallet connected (PRIVATE_KEY not set)')
    }

    // Test contract connections
    if (contractsValid) {
      await testContractConnections()
    }

    return {
      network: network.name,
      chainId: network.chainId,
      contractsValid,
      mockMode: MOCK_MODE
    }
  } catch (error) {
    console.error('❌ Blockchain connection failed:', error)
    if (MOCK_MODE) {
      console.log('🔧 Continuing in mock mode')
      return {
        network: 'mock',
        chainId: 0,
        contractsValid: false,
        mockMode: true
      }
    }
    throw error
  }
}

/**
 * Test contract connections
 */
const testContractConnections = async () => {
  try {
    if (CONTRACT_ADDRESSES.musicRegistry) {
      const musicRegistry = getMusicRegistryContract()
      await musicRegistry.getTotalTracks()
      console.log('✅ Music Registry contract connected')
    }
  } catch (error) {
    console.warn('⚠️ Music Registry contract test failed:', error.message)
  }

  try {
    if (CONTRACT_ADDRESSES.nftMarketplace) {
      const nftMarketplace = getNFTMarketplaceContract()
      // Test with a non-existent token ID
      await nftMarketplace.getNFT(999999)
      console.log('✅ NFT Marketplace contract connected')
    }
  } catch (error) {
    console.warn('⚠️ NFT Marketplace contract test failed:', error.message)
  }
}

/**
 * Get blockchain health status
 */
export const getBlockchainHealth = async () => {
  const health = {
    connected: false,
    network: '',
    chainId: 0,
    wallet: false,
    contracts: {
      musicRegistry: false,
      nftMarketplace: false,
      royaltyDistributor: false,
      governanceDAO: false
    },
    mockMode: MOCK_MODE
  }

  try {
    const network = await provider.getNetwork()
    health.connected = true
    health.network = network.name
    health.chainId = Number(network.chainId)

    if (wallet) {
      health.wallet = true
    }

    // Test contract connections
    if (CONTRACT_ADDRESSES.musicRegistry) {
      try {
        const contract = getMusicRegistryContract()
        await contract.getTotalTracks()
        health.contracts.musicRegistry = true
      } catch (error) {
        console.warn('Music Registry contract not accessible:', error.message)
      }
    }

    if (CONTRACT_ADDRESSES.nftMarketplace) {
      try {
        const contract = getNFTMarketplaceContract()
        await contract.getTotalNFTs()
        health.contracts.nftMarketplace = true
      } catch (error) {
        console.warn('NFT Marketplace contract not accessible:', error.message)
      }
    }

  } catch (error) {
    console.warn('Blockchain health check failed:', error.message)
  }

  return health
}
