'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { ReactNode } from 'react'

// Configure chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, polygonMumbai],
  [publicProvider()]
)

// Configure connectors
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

interface WagmiProviderProps {
  children: ReactNode
}

export const WagmiProvider: React.FC<WagmiProviderProps> = ({ children }) => {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  )
}
