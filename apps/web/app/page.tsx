'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Play, Music, Users, Shield, Zap, TrendingUp } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/layout/HeroSection'
import FeatureCard from '@/components/ui/FeatureCard'
import StatsSection from '@/components/ui/StatsSection'
import CTA from '@/components/ui/CTA'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <HeroSection
        title="Decentralized Music for Everyone"
        subtitle="Live on Harmony Network"
        description="Experience free music streaming while supporting artists through Web3 technology. No subscriptions, no ads, just pure music freedom."
        primaryCTA={{
          text: "Start Listening",
          href: "/discover"
        }}
        secondaryCTA={{
          text: "Watch Demo",
          href: "#features"
        }}
      />

      <StatsSection />

      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Web3 <span className="gradient-text">Features</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built on Harmony Network, our platform combines the best of decentralized technology 
              with an intuitive music experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Music className="w-12 h-12 text-blue-400" />}
              title="Decentralized Streaming"
              description="Stream music directly from IPFS with no central servers. Your music, your control."
              delay={0}
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-green-400" />}
              title="Artist Empowerment"
              description="Artists receive direct payments and maintain full ownership of their creative work."
              delay={0.1}
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-purple-400" />}
              title="Smart Contracts"
              description="Automated royalty distribution and transparent licensing through blockchain technology."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Powered by <span className="gradient-text">Harmony</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built on Harmony Network's fast, secure, and eco-friendly blockchain infrastructure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="glass-effect rounded-xl p-6">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">2-Second Finality</h3>
                <p className="text-gray-300 text-sm">Lightning-fast transactions</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="glass-effect rounded-xl p-6">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Secure</h3>
                <p className="text-gray-300 text-sm">Battle-tested security</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="glass-effect rounded-xl p-6">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Scalable</h3>
                <p className="text-gray-300 text-sm">High throughput</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="glass-effect rounded-xl p-6">
                <Play className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Eco-Friendly</h3>
                <p className="text-gray-300 text-sm">Low energy consumption</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CTA />

      <Footer />
    </div>
  )
}
