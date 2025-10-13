// Application constants
export const APP_CONFIG = {
  name: 'HarmonyChain',
  version: '1.0.0',
  description: 'Decentralized music platform'
}

export const NETWORKS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'http://localhost:8545'
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com'
  }
}

export const IPFS_CONFIG = {
  gateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
  node: process.env.NEXT_PUBLIC_IPFS_NODE || 'https://ipfs.infura.io:5001'
}

export const ARWEAVE_CONFIG = {
  gateway: 'https://arweave.net',
  node: 'https://arweave.net'
}

export const THEGRAPH_CONFIG = {
  subgraphUrl: process.env.NEXT_PUBLIC_SUBGRAPH_URL || 'https://api.thegraph.com/subgraphs/name/harmonychain/harmonychain'
}

export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100
}

export const GENRES = [
  'Electronic',
  'Hip Hop',
  'Rock',
  'Pop',
  'Jazz',
  'Classical',
  'Country',
  'R&B',
  'Reggae',
  'Blues'
]
