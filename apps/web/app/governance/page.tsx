'use client'

import React, { useState, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { Vote, Users, TrendingUp, Clock, CheckCircle, Plus } from 'lucide-react'
import { useAccount, useSignMessage } from 'wagmi'
import { apiClient } from '@/lib/api/client'
import toast from 'react-hot-toast'

interface Proposal {
  id: string
  title: string
  description: string
  status: 'active' | 'passed' | 'failed' | 'executed'
  votes: number
  deadline: string
  support: number
  proposer: string
  createdAt: string
}

export default function GovernancePage() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: ''
  })

  // Fetch proposals from API
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await apiClient.customRequest<Proposal[]>('/api/governance/proposals')
        if (response.success && response.data) {
          setProposals(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch proposals:', error)
        toast.error('Failed to load proposals')
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [])

  const handleVote = async (proposalId: string, support: boolean) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet to vote')
      return
    }

    try {
      const message = `Vote on proposal ${proposalId}: ${support ? 'SUPPORT' : 'OPPOSE'}`
      const signature = await signMessageAsync({ message })
      
      const response = await apiClient.customRequest(`/api/governance/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${signature}`,
          'X-Wallet-Address': address
        },
        body: JSON.stringify({
          proposalId,
          support
        })
      })

      if (response.success) {
        toast.success('Vote submitted successfully!')
        // Refresh proposals
        window.location.reload()
      } else {
        throw new Error(response.error || 'Vote failed')
      }
    } catch (error) {
      console.error('Vote error:', error)
      toast.error('Failed to submit vote')
    }
  }

  const handleCreateProposal = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet to create proposals')
      return
    }

    if (!newProposal.title || !newProposal.description) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const message = `Create proposal: ${newProposal.title}`
      const signature = await signMessageAsync({ message })
      
      const response = await apiClient.customRequest('/api/governance/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${signature}`,
          'X-Wallet-Address': address
        },
        body: JSON.stringify(newProposal)
      })

      if (response.success) {
        toast.success('Proposal created successfully!')
        setNewProposal({ title: '', description: '' })
        setShowCreateForm(false)
        // Refresh proposals
        window.location.reload()
      } else {
        throw new Error(response.error || 'Proposal creation failed')
      }
    } catch (error) {
      console.error('Create proposal error:', error)
      toast.error('Failed to create proposal')
    }
  }

  const stats = [
    { label: "Total Proposals", value: proposals.length.toString(), icon: Vote },
    { label: "Active Voters", value: "3,200+", icon: Users },
    { label: "Passed Proposals", value: proposals.filter(p => p.status === 'passed').length.toString(), icon: CheckCircle },
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
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading proposals...</p>
                </div>
              ) : proposals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No proposals found</p>
                </div>
              ) : (
                proposals.map((proposal, index) => (
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
                            proposal.status === 'active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : proposal.status === 'passed'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {proposal.status.toUpperCase()}
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
                            {proposal.support}% support
                          </span>
                        </div>
                      </div>
                      {proposal.status === 'active' && isConnected && (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button 
                            onClick={() => handleVote(proposal.id, true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                          >
                            Vote Yes
                          </button>
                          <button 
                            onClick={() => handleVote(proposal.id, false)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                          >
                            Vote No
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Create Proposal */}
        {isConnected && (
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-4xl font-bold text-white">Create New Proposal</h2>
                  <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="btn-primary inline-flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    {showCreateForm ? 'Cancel' : 'New Proposal'}
                  </button>
                </div>

                {showCreateForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="music-card"
                  >
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white font-medium mb-2">Proposal Title</label>
                        <input
                          type="text"
                          value={newProposal.title}
                          onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter proposal title..."
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Description</label>
                        <textarea
                          value={newProposal.description}
                          onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                          placeholder="Describe your proposal in detail..."
                        />
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setShowCreateForm(false)}
                          className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateProposal}
                          className="btn-primary"
                        >
                          Create Proposal
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </section>
        )}

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
