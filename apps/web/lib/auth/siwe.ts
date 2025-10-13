import { SiweMessage } from 'siwe'
import { useSigner, useAccount } from 'wagmi'
import { useState, useEffect } from 'react'

export interface SIWEUser {
  address: string
  signature: string
  message: string
  timestamp: number
}

export interface SIWEState {
  user: SIWEUser | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: () => Promise<void>
  signOut: () => void
  refreshAuth: () => Promise<void>
}

const AUTH_STORAGE_KEY = 'harmonychain-siwe-auth'

export const useSIWE = (): SIWEState => {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const [user, setUser] = useState<SIWEUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load authentication state from localStorage
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY)
        if (stored) {
          const authData = JSON.parse(stored)
          setUser(authData)
        }
      } catch (error) {
        console.error('Failed to load auth state:', error)
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }

    loadAuthState()
  }, [])

  // Clear auth if wallet changes
  useEffect(() => {
    if (user && address && user.address !== address) {
      signOut()
    }
  }, [address, user])

  const signIn = async (): Promise<void> => {
    if (!signer || !address) {
      throw new Error('No signer or address available')
    }

    setIsLoading(true)

    try {
      const domain = window.location.host
      const origin = window.location.origin
      const statement = 'Sign in with Ethereum to HarmonyChain - Decentralized Music Platform'

      const siwe = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: 1,
        nonce: Math.random().toString(36).substring(2, 15),
        issuedAt: new Date().toISOString()
      })

      const message = siwe.prepareMessage()
      const signature = await signer.signMessage(message)

      // Verify signature
      const result = await siwe.verify({ signature })
      
      if (result.success) {
        const authData: SIWEUser = {
          address: result.data.address,
          signature,
          message,
          timestamp: Date.now()
        }

        setUser(authData)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
      } else {
        throw new Error('Signature verification failed')
      }
    } catch (error) {
      console.error('SIWE authentication failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = (): void => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const refreshAuth = async (): Promise<void> => {
    if (!user) return

    try {
      // Verify existing signature is still valid
      const siwe = new SiweMessage(JSON.parse(user.message))
      const result = await siwe.verify({ signature: user.signature })
      
      if (!result.success) {
        // Signature is invalid, sign out
        signOut()
      }
    } catch (error) {
      console.error('Auth refresh failed:', error)
      signOut()
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    refreshAuth
  }
}

// Utility functions
export const getAuthToken = (): string | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const authData = JSON.parse(stored)
      return authData.signature
    }
  } catch (error) {
    console.error('Failed to get auth token:', error)
  }
  return null
}

export const getAuthUser = (): SIWEUser | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to get auth user:', error)
  }
  return null
}

export const clearAuth = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
