'use client'

import React from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { Vote, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react'

export default function GovernancePage() {
  const activeProposals = [
    {
      id: 1,
      title: "Increase Artist Royalty Rate to 15%",
      description: "Proposal to increase the default royalty rate for artists from 10% to 15%",
      status: "Active",
      votes: "1,234",
      deadline: "3 days left",
      support: "78%"
    },
    {
      id: 2,
      title: "Add New Music Genre Categories",
      description: "Add support for experimental and ambient music genres",
      status: "Active",
      votes: "856",
      deadline: "7 days left",
      support: "65%"
    },
    {
      id: 3,
      title: "Platform Fee Reduction",
      description: "Reduce platform fees from 2% to 1.5% for verified artists",
      status: "Passed",
      votes: "2,156",
      deadline: "Ended",
      support: "82%"
    }
  ]

  const stats = [
    { label: "Total Proposals", value: "47", icon: Vote },
    { label: "Active Voters", value: "3,200+", icon: Users },
    { label: "Passed Proposals", value: "32", icon: CheckCircle },
    { label: "Participation Rate", value: "68%", icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Community <span className="gradient-text">Governance</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Shape the future of HarmonyChain through decentralized governance. Your voice matters in building the platform.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                    <stat.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Active Proposals */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">🗳️ Active Proposals</h2>
              <p className="text-gray-300">Vote on proposals that will shape the future of HarmonyChain</p>
            </motion.div>

            <div className="space-y-6">
              {activeProposals.map((proposal, index) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="music-card"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{proposal.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          proposal.status === 'Active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {proposal.status}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{proposal.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Vote className="w-4 h-4 mr-1" />
                          {proposal.votes} votes
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {proposal.deadline}
                        </span>
                        <span className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {proposal.support} support
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Vote Yes
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Vote No
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How Governance Works */}
        <section className="py-20 px-4 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                How <span className="gradient-text">Governance Works</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Participate in decentralized decision-making that shapes the HarmonyChain ecosystem
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-6">
                  <Vote className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">1. Propose</h3>
                <p className="text-gray-300">Community members can submit proposals for platform improvements</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">2. Discuss</h3>
                <p className="text-gray-300">Community debates and discusses proposals before voting</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-6">
                  <CheckCircle className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">3. Vote</h3>
                <p className="text-gray-300">Token holders vote on proposals using their governance tokens</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Ready to <span className="gradient-text">Participate?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Connect your wallet and start participating in HarmonyChain governance
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary inline-flex items-center justify-center">
                  <Vote className="w-5 h-5 mr-2" />
                  Connect Wallet
                </button>
                <button className="btn-secondary inline-flex items-center justify-center">
                  View Proposals
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
