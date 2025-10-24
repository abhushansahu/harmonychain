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

export default config
