import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { Web3Provider } from '@/components/providers/Web3Provider'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'HarmonyChain - Decentralized Music Platform',
  description: 'Experience free music streaming while supporting artists through Web3 technology on Harmony Network.',
  keywords: ['music', 'blockchain', 'web3', 'decentralized', 'harmony', 'nft', 'crypto'],
  authors: [{ name: 'HarmonyChain Team' }],
  openGraph: {
    title: 'HarmonyChain - Decentralized Music Platform',
    description: 'Experience free music streaming while supporting artists through Web3 technology.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HarmonyChain - Decentralized Music Platform',
    description: 'Experience free music streaming while supporting artists through Web3 technology.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} ${playfair.variable} antialiased`}>
        <Web3Provider>
          <Providers>
            {children}
          </Providers>
        </Web3Provider>
      </body>
    </html>
  )
}
