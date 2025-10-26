import { createConfig, configureChains } from 'wagmi'
import { mainnet, sepolia, localhost } from 'wagmi/chains'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

// Harmony chain configuration
const harmonyMainnet = {
  id: 1666600000,
  name: 'Harmony Mainnet',
  network: 'harmony',
  nativeCurrency: { name: 'Harmony', symbol: 'ONE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.harmony.one'] },
    public: { http: ['https://api.harmony.one'] },
  },
  blockExplorers: {
    default: { name: 'Harmony Explorer', url: 'https://explorer.harmony.one' },
  },
  testnet: false,
} as const

const harmonyTestnet = {
  id: 1666700000,
  name: 'Harmony Testnet',
  network: 'harmony-testnet',
  nativeCurrency: { name: 'Harmony', symbol: 'ONE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.s0.b.hmny.io'] },
    public: { http: ['https://api.s0.b.hmny.io'] },
  },
  blockExplorers: {
    default: { name: 'Harmony Testnet Explorer', url: 'https://explorer.pops.one' },
  },
  testnet: true,
} as const

// Local Hardhat network
const localHardhat = {
  id: 1337,
  name: 'Local Hardhat',
  network: 'localhost',
  nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
    public: { http: ['http://localhost:8545'] },
  },
  blockExplorers: {
    default: { name: 'Local Explorer', url: 'http://localhost:8545' },
  },
  testnet: true,
} as const

export const chains = [localHardhat, harmonyTestnet, harmonyMainnet, mainnet]

const { connectors } = getDefaultWallets({
  appName: 'HarmonyChain',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains,
})

const { publicClient } = configureChains(chains, [
  jsonRpcProvider({
    rpc: (chain) => ({
      http: chain.rpcUrls.default.http[0],
    }),
  }),
])

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

// Contract addresses from environment
export const CONTRACT_ADDRESSES = {
  musicRegistry: process.env.NEXT_PUBLIC_MUSIC_REGISTRY_ADDRESS || '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  nftMarketplace: process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS || '0x0165878A594ca255338adfa4d48449f69242Eb8F',
  royaltyDistributor: process.env.NEXT_PUBLIC_ROYALTY_DISTRIBUTOR_ADDRESS || '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
  governanceDAO: process.env.NEXT_PUBLIC_GOVERNANCE_DAO_ADDRESS || '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'
}

// Contract ABIs
export const MUSIC_REGISTRY_ABI = [
  "function registerTrack(string memory _title, uint256 _duration, string memory _genre, string memory _coverArt, string memory _audioFile, string memory _ipfsHash, uint256 _price) external",
  "function getTrack(uint256 _trackId) external view returns (tuple(uint256 id, string title, string artist, uint256 artistId, uint256 duration, string genre, string coverArt, string audioFile, string ipfsHash, uint256 price, bool isStreamable, uint256 playCount, address owner, uint256 createdAt))",
  "function getTotalTracks() external view returns (uint256)",
  "function playTrack(uint256 _trackId) external",
  "event TrackRegistered(uint256 indexed trackId, string title, string artist, address indexed owner, string ipfsHash)"
] as const

export const NFT_MARKETPLACE_ABI = [
  "function mintNFT(address _to, string memory _tokenURI, uint256 _trackId, uint256 _price) external payable returns (uint256)",
  "function purchaseNFT(uint256 _tokenId) external payable",
  "function getNFT(uint256 _tokenId) external view returns (tuple(uint256 tokenId, address creator, address owner, uint256 price, bool isListed, uint256 trackId, uint256 createdAt))",
  "function getTotalNFTs() external view returns (uint256)",
  "event NFTMinted(uint256 indexed tokenId, address indexed creator, uint256 indexed trackId, string tokenURI)"
] as const

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
] as const

export default config
