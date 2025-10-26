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
  musicRegistry: process.env.MUSIC_REGISTRY_ADDRESS || '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
  nftMarketplace: process.env.NFT_MARKETPLACE_ADDRESS || '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
  royaltyDistributor: process.env.ROYALTY_DISTRIBUTOR_ADDRESS || '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
  governanceDAO: process.env.GOVERNANCE_DAO_ADDRESS || '0x9A676e781A523b5d0C0e43731313A708CB607508'
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
  "function registerArtist(string memory _name, string memory _description, string memory _avatar) external",
  "function registerTrack(string memory _title, uint256 _duration, string memory _genre, string memory _coverArt, string memory _audioFile, string memory _ipfsHash, uint256 _price) external",
  "function getTrack(uint256 _trackId) external view returns (tuple(uint256 id, string title, string artist, uint256 artistId, uint256 duration, string genre, string coverArt, string audioFile, string ipfsHash, uint256 price, bool isStreamable, uint256 playCount, address owner, uint256 createdAt))",
  "function getArtist(uint256 _artistId) external view returns (tuple(uint256 id, string name, string description, string avatar, address walletAddress, uint256 totalTracks, uint256 totalEarnings, bool isVerified, uint256 createdAt))",
  "function getTotalTracks() external view returns (uint256)",
  "function getTotalArtists() external view returns (uint256)",
  "function playTrack(uint256 _trackId) external",
  "function artistByAddress(address _address) external view returns (uint256)",
  "function getArtistTracks(address _artistAddress) external view returns (uint256[])",
  "event TrackRegistered(uint256 indexed trackId, string title, string artist, address indexed owner, string ipfsHash)",
  "event ArtistRegistered(uint256 indexed artistId, string name, address indexed walletAddress)"
]

export const NFT_MARKETPLACE_ABI = [
  "function mintNFT(address _to, string memory _tokenURI, uint256 _trackId, uint256 _price) external payable returns (uint256)",
  "function purchaseNFT(uint256 _tokenId) external payable",
  "function getNFT(uint256 _tokenId) external view returns (tuple(uint256 tokenId, address creator, address owner, uint256 price, bool isListed, uint256 trackId, uint256 createdAt))",
  "function getTotalNFTs() external view returns (uint256)",
  "function getOwnerNFTs(address _owner) external view returns (uint256[])",
  "event NFTMinted(uint256 indexed tokenId, address indexed creator, uint256 indexed trackId, string tokenURI)"
]

export const GOVERNANCE_DAO_ABI = [
  "function getTotalProposals() external view returns (uint256)",
  "function getProposal(uint256 _proposalId) external view returns (tuple(uint256 id, string title, string description, address proposer, uint256 forVotes, uint256 againstVotes, uint256 startTime, uint256 endTime, bool executed, bool canceled))",
  "function createProposal(string memory _title, string memory _description) external returns (uint256)",
  "function castVote(uint256 _proposalId, bool _support) external",
  "function votingPower(address _voter) external view returns (uint256)",
  "function isMember(address _member) external view returns (bool)",
  "function addMember(address _member, uint256 _votingPower) external",
  "function removeMember(address _member) external",
  "function executeProposal(uint256 _proposalId) external",
  "function cancelProposal(uint256 _proposalId) external",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)",
  "event ProposalExecuted(uint256 indexed proposalId)",
  "event ProposalCanceled(uint256 indexed proposalId)"
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

export const getGovernanceDAOContract = () => {
  if (!CONTRACT_ADDRESSES.governanceDAO) {
    if (MOCK_MODE) {
      console.log('🔧 Using mock Governance DAO contract')
      return createMockContract('GovernanceDAO')
    }
    throw new Error('Governance DAO contract address not set. Set GOVERNANCE_DAO_ADDRESS environment variable.')
  }
  return new ethers.Contract(CONTRACT_ADDRESSES.governanceDAO, GOVERNANCE_DAO_ABI, wallet || provider)
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
        console.warn('⚠️ Wallet balance check failed:', (error as Error).message)
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
    console.warn('⚠️ Music Registry contract test failed:', (error as Error).message)
  }

  try {
    if (CONTRACT_ADDRESSES.nftMarketplace) {
      const nftMarketplace = getNFTMarketplaceContract()
      // Test contract connection by calling a view function that doesn't require parameters
      await (nftMarketplace as any).getTotalNFTs()
      console.log('✅ NFT Marketplace contract connected')
    }
  } catch (error) {
    console.warn('⚠️ NFT Marketplace contract test failed:', (error as Error).message)
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
        console.warn('Music Registry contract not accessible:', (error as Error).message)
      }
    }

    if (CONTRACT_ADDRESSES.nftMarketplace) {
      try {
        const contract = getNFTMarketplaceContract()
        await (contract as any).getTotalNFTs()
        health.contracts.nftMarketplace = true
      } catch (error) {
        console.warn('NFT Marketplace contract not accessible:', (error as Error).message)
      }
    }

  } catch (error) {
    console.warn('Blockchain health check failed:', (error as Error).message)
  }

  return health
}
