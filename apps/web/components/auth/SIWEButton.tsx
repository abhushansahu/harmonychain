import React from 'react'
import { useSIWE } from '../../lib/auth/siwe'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

interface SIWEButtonProps {
  className?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const SIWEButton: React.FC<SIWEButtonProps> = ({ 
  className = '', 
  onSuccess, 
  onError 
}) => {
  const { user, isLoading, isAuthenticated, signIn, signOut } = useSIWE()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector()
  })
  const { disconnect } = useDisconnect()

  const handleAuth = async () => {
    try {
      if (!isConnected) {
        await connect()
        return
      }

      if (isAuthenticated) {
        signOut()
        disconnect()
      } else {
        await signIn()
        onSuccess?.()
      }
    } catch (error) {
      console.error('Authentication error:', error)
      onError?.(error as Error)
    }
  }

  const getButtonText = () => {
    if (isLoading) return 'Signing...'
    if (!isConnected) return 'Connect Wallet'
    if (isAuthenticated) return 'Sign Out'
    return 'Sign In with Ethereum'
  }

  const getButtonStyle = () => {
    const baseStyle = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2'
    
    if (isLoading) {
      return `${baseStyle} bg-gray-400 text-white cursor-not-allowed`
    }
    
    if (isAuthenticated) {
      return `${baseStyle} bg-red-600 hover:bg-red-700 text-white`
    }
    
    return `${baseStyle} bg-primary-600 hover:bg-primary-700 text-white`
  }

  return (
    <button
      onClick={handleAuth}
      disabled={isLoading}
      className={`${getButtonStyle()} ${className}`}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && isConnected && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )}
      
      {!isLoading && !isConnected && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )}
      
      <span>{getButtonText()}</span>
    </button>
  )
}

export default SIWEButton
