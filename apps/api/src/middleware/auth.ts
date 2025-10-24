import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/authService'
import { ethers } from 'ethers'

/**
 * Authentication middleware with SIWE (Sign-In with Ethereum) support
 * Provides JWT token validation and wallet signature verification
 */

// Define ApiResponse interface locally
interface ApiResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

interface AuthRequest extends Request {
  user?: {
    address: string
    chainId: number
    nonce: string
    message?: string
    signature?: string
  }
}

// Nonce storage (in production, use Redis or database)
const nonceStore = new Map<string, { nonce: string; expires: number }>()

/**
 * Generate a random nonce for SIWE
 */
export const generateNonce = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Store nonce with expiration (5 minutes)
 */
export const storeNonce = (address: string, nonce: string): void => {
  const expires = Date.now() + 5 * 60 * 1000 // 5 minutes
  nonceStore.set(address, { nonce, expires })
}

/**
 * Verify and consume nonce
 */
export const verifyNonce = (address: string, nonce: string): boolean => {
  const stored = nonceStore.get(address)
  if (!stored) return false
  
  if (Date.now() > stored.expires) {
    nonceStore.delete(address)
    return false
  }
  
  if (stored.nonce !== nonce) return false
  
  // Consume nonce (one-time use)
  nonceStore.delete(address)
  return true
}

/**
 * Clean expired nonces
 */
export const cleanExpiredNonces = (): void => {
  const now = Date.now()
  for (const [address, data] of nonceStore.entries()) {
    if (now > data.expires) {
      nonceStore.delete(address)
    }
  }
}

// Clean expired nonces every 5 minutes
setInterval(cleanExpiredNonces, 5 * 60 * 1000)

/**
 * Authenticate JWT token
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization']
  const token = AuthService.extractTokenFromHeader(authHeader)

  if (!token) {
    const response: ApiResponse = {
      success: false,
      error: 'Access token required',
      message: 'Authentication required'
    }
    return res.status(401).json(response)
  }

  const result = AuthService.verifyToken(token)
  
  if (!result.success) {
    const response: ApiResponse = {
      success: false,
      error: result.error || 'Invalid token',
      message: 'Token is invalid or expired'
    }
    return res.status(403).json(response)
  }

  req.user = result.user
  next()
}

/**
 * Authenticate SIWE signature
 */
export const authenticateSIWE = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { address, message, signature } = req.body

  if (!address || !message || !signature) {
    const response: ApiResponse = {
      success: false,
      error: 'Missing SIWE parameters',
      message: 'Address, message, and signature are required'
    }
    return res.status(400).json(response)
  }

  try {
    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature)
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid signature',
        message: 'Signature does not match address'
      }
      return res.status(403).json(response)
    }

    // Parse SIWE message to extract nonce
    const nonceMatch = message.match(/nonce: (.+)/)
    if (!nonceMatch) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid SIWE message',
        message: 'Nonce not found in message'
      }
      return res.status(400).json(response)
    }

    const nonce = nonceMatch[1]
    
    // Verify nonce
    if (!verifyNonce(address, nonce)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid or expired nonce',
        message: 'Nonce is invalid or has expired'
      }
      return res.status(403).json(response)
    }

    // Set user data
    req.user = {
      address,
      chainId: 1, // Default to Ethereum mainnet
      nonce,
      message,
      signature
    }

    next()
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Signature verification failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    return res.status(403).json(response)
  }
}

/**
 * Require artist role (placeholder for future implementation)
 */
export const requireArtist = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // TODO: Implement artist role checking
  // This would check if the user is a registered artist
  // For now, we'll just pass through
  next()
}

/**
 * Generate SIWE message for client
 */
export const generateSIWEMessage = (req: Request, res: Response) => {
  const { address } = req.query

  if (!address || typeof address !== 'string') {
    const response: ApiResponse = {
      success: false,
      error: 'Address required',
      message: 'Wallet address is required'
    }
    return res.status(400).json(response)
  }

  const nonce = generateNonce()
  storeNonce(address, nonce)

  const message = `Welcome to HarmonyChain!

Please sign this message to authenticate with HarmonyChain.

Address: ${address}
Nonce: ${nonce}
Timestamp: ${Date.now()}`

  const response: ApiResponse = {
    success: true,
    data: { message, nonce },
    message: 'SIWE message generated'
  }

  res.json(response)
}

/**
 * Session management utilities
 */
export const createSession = (user: any) => {
  // Create JWT token with user data
  return AuthService.generateToken(user)
}

export const refreshSession = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    const response: ApiResponse = {
      success: false,
      error: 'No active session',
      message: 'User not authenticated'
    }
    return res.status(401).json(response)
  }

  // Generate new token
  const newToken = AuthService.generateToken(req.user)
  
  const response: ApiResponse = {
    success: true,
    data: { token: newToken },
    message: 'Session refreshed'
  }

  res.json(response)
}
