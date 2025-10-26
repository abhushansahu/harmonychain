import { Router } from 'express'
import { ApiResponse } from '../types'

const router = Router()

// Get all proposals - Web3 only
router.get('/proposals', async (req, res) => {
  try {
    const { BlockchainService } = await import('../services/blockchainService')
    
    // Fetch proposals from blockchain
    const proposals = await BlockchainService.getProposals()
    
    const response: ApiResponse = {
      success: true,
      data: proposals,
      message: 'Proposals retrieved from blockchain'
    }
    
    res.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch proposals',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// Create proposal - Web3 only
router.post('/proposals', async (req, res) => {
  try {
    const { title, description, proposer } = req.body
    
    if (!title || !description || !proposer) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields',
        message: 'Title, description, and proposer are required'
      }
      return res.status(400).json(response)
    }
    
    const { BlockchainService } = await import('../services/blockchainService')
    
    // Create proposal on blockchain
    const proposalId = await BlockchainService.createProposal(title, description, proposer)
    
    const response: ApiResponse = {
      success: true,
      data: { id: proposalId },
      message: 'Proposal created successfully on blockchain'
    }
    
    res.status(201).json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create proposal',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// Vote on proposal - Web3 only
router.post('/proposals/:id/vote', async (req, res) => {
  try {
    const { id } = req.params
    const { support, voter } = req.body
    
    if (typeof support !== 'boolean' || !voter) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields',
        message: 'Support (boolean) and voter address are required'
      }
      return res.status(400).json(response)
    }
    
    const { BlockchainService } = await import('../services/blockchainService')
    
    // Cast vote on blockchain
    await BlockchainService.castVote(id, support, voter)
    
    const response: ApiResponse = {
      success: true,
      data: { proposalId: id, support, voter },
      message: 'Vote recorded successfully on blockchain'
    }
    
    res.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to cast vote',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

// Get voting power - Web3 only
router.get('/voting-power/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    
    const { BlockchainService } = await import('../services/blockchainService')
    
    // Get voting power from blockchain
    const votingPower = await BlockchainService.getVotingPower(walletAddress)
    
    const response: ApiResponse = {
      success: true,
      data: { votingPower },
      message: 'Voting power retrieved from blockchain'
    }
    
    res.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to get voting power',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

export default router