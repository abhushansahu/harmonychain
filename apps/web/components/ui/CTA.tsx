'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play, Music } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ready to <span className="gradient-text">Experience</span> the Future?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join thousands of music lovers and artists already using HarmonyChain to discover, 
            stream, and monetize music in the decentralized web.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/discover"
              className="btn-primary inline-flex items-center justify-center group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Start Listening
            </Link>
            <Link
              href="/artists"
              className="btn-secondary inline-flex items-center justify-center"
            >
              <Music className="w-5 h-5 mr-2" />
              Upload Music
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
