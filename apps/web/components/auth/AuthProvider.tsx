'use client'

import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useSIWE, SIWEUser } from '../../lib/auth/siwe'
import { useAccount } from 'wagmi'

interface AuthContextType {
  user: SIWEUser | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: () => Promise<void>
  signOut: () => void
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated, signIn, signOut, refreshAuth } = useSIWE()
  const { address } = useAccount()

  // Auto-refresh auth when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      refreshAuth()
    }
  }, [isAuthenticated, refreshAuth])

  // Clear auth if wallet disconnects
  useEffect(() => {
    if (!address && isAuthenticated) {
      signOut()
    }
  }, [address, isAuthenticated, signOut])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    refreshAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthProvider
