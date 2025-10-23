'use client'

import React from 'react'
import Link from 'next/link'
import { Music, Twitter, Github } from 'lucide-react'

export default function Footer() {
  const footerLinks = {
    Platform: [
      { name: 'Discover', href: '/discover' },
      { name: 'Artists', href: '/artists' },
      { name: 'Marketplace', href: '/marketplace' },
      { name: 'Governance', href: '/governance' },
    ],
    Resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API', href: '/api-docs' },
      { name: 'Whitepaper', href: '/whitepaper' },
      { name: 'Blog', href: '/blog' },
    ],
    Community: [
      { name: 'Discord', href: 'https://discord.gg/harmonychain' },
      { name: 'Twitter', href: 'https://twitter.com/harmonychain' },
      { name: 'GitHub', href: 'https://github.com/harmonychain' },
      { name: 'Telegram', href: 'https://t.me/harmonychain' },
    ],
  }

  return (
    <footer className="bg-black/50 backdrop-blur-md border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Music className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">HarmonyChain</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Decentralized music platform built on Harmony Network. 
              Experience free music streaming while supporting artists.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/harmonychain"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/harmonychain"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://discord.gg/harmonychain"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Music className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 HarmonyChain. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
