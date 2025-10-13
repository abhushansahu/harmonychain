import Link from 'next/link'
import SIWEButton from '../components/auth/SIWEButton'
import { useAuth } from '../components/auth/AuthProvider'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">HarmonyChain</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/discover" className="text-gray-600 hover:text-primary-600">Discover</Link>
              <Link href="/artists" className="text-gray-600 hover:text-primary-600">Artists</Link>
              <Link href="/marketplace" className="text-gray-600 hover:text-primary-600">Marketplace</Link>
              <Link href="/governance" className="text-gray-600 hover:text-primary-600">Governance</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <SIWEButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Decentralized Music
            <span className="text-primary-600"> for Everyone</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience free music streaming while supporting artists through Web3 technology. 
            No subscriptions, no ads, just pure music freedom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/discover" className="btn-primary text-lg px-8 py-3">
              Start Listening
            </Link>
            <Link href="/learn" className="btn-secondary text-lg px-8 py-3">
              Learn More
            </Link>
          </div>
        </div>

        {/* Web3 Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Free Music Access</h3>
            <p className="text-gray-600">
              Stream unlimited music without subscriptions or ads. 
              Access millions of tracks completely free.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Artist Revenue</h3>
            <p className="text-gray-600">
              Artists earn through NFT sales, licensing, and direct fan support. 
              Fair compensation for creators.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Web3 Native</h3>
            <p className="text-gray-600">
              Built on blockchain with IPFS storage. 
              No central authority controlling your music.
            </p>
          </div>
        </div>

        {/* Web3 Technology Stack */}
        <div className="mt-20 bg-white rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Powered by Web3 Technology
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">IPFS</span>
              </div>
              <h3 className="font-semibold mb-2">Decentralized Storage</h3>
              <p className="text-sm text-gray-600">Content-addressed storage</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">ETH</span>
              </div>
              <h3 className="font-semibold mb-2">Blockchain</h3>
              <p className="text-sm text-gray-600">Ethereum & Polygon</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">DAO</span>
              </div>
              <h3 className="font-semibold mb-2">Governance</h3>
              <p className="text-sm text-gray-600">Community-driven</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">NFT</span>
              </div>
              <h3 className="font-semibold mb-2">Ownership</h3>
              <p className="text-sm text-gray-600">Digital ownership</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-primary-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience the Future of Music?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of artists and listeners in the decentralized music revolution.
          </p>
          <Link href="/discover" className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Get Started Now
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">HarmonyChain</h3>
              <p className="text-gray-400">
                Decentralized music platform for artists and listeners.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/discover">Discover Music</Link></li>
                <li><Link href="/artists">For Artists</Link></li>
                <li><Link href="/marketplace">NFT Marketplace</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/governance">Governance</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/support">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="https://discord.gg/harmonychain">Discord</Link></li>
                <li><Link href="https://twitter.com/harmonychain">Twitter</Link></li>
                <li><Link href="https://github.com/harmonychain">GitHub</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HarmonyChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}