import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../components/auth/AuthProvider'
import { WagmiProvider } from '../components/providers/WagmiProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HarmonyChain - Decentralized Music Platform',
  description: 'A decentralized music ecosystem enabling free music access while creating sustainable revenue streams for artists',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}