import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../components/auth/AuthProvider'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HarmonyChain - Decentralized Music Platform',
  description: 'A decentralized music ecosystem enabling free music access while creating sustainable revenue streams for artists',
}

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={config}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}