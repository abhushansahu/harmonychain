'use client'

import React, { useState } from 'react'
import { apiClient } from '@/lib/api/client'
import { ExternalLink, Copy, Check } from 'lucide-react'
import { useChainId } from 'wagmi'

interface TransactionViewerProps {
  txHash: string
  className?: string
}

export default function TransactionViewer({ txHash, className = '' }: TransactionViewerProps) {
  const [transaction, setTransaction] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const chainId = useChainId()

  const fetchTransaction = async () => {
    if (!txHash) return
    
    setLoading(true)
    try {
      const response = await apiClient.getTransactionDetails(txHash, chainId)
      if (response.success) {
        setTransaction(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const getExplorerUrl = () => {
    if (chainId === 1337) {
      return `http://localhost:8545/tx/${txHash}`
    } else if (chainId === 1666600000) {
      return `https://explorer.harmony.one/tx/${txHash}`
    } else if (chainId === 1666700000) {
      return `https://explorer.pops.one/tx/${txHash}`
    }
    return `https://explorer.harmony.one/tx/${txHash}`
  }

  React.useEffect(() => {
    fetchTransaction()
  }, [txHash, chainId])

  if (loading) {
    return (
      <div className={`p-4 bg-white/5 rounded-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className={`p-4 bg-red-500/10 border border-red-500/20 rounded-lg ${className}`}>
        <p className="text-red-400 text-sm">Transaction not found</p>
      </div>
    )
  }

  return (
    <div className={`p-4 bg-white/5 rounded-lg border border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium">Transaction Details</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => copyToClipboard(txHash)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
          <a
            href={getExplorerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-blue-400" />
          </a>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Hash:</span>
          <span className="text-white font-mono text-xs">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
        </div>
        
        {transaction.from && (
          <div className="flex justify-between">
            <span className="text-gray-400">From:</span>
            <span className="text-white font-mono text-xs">{transaction.from.slice(0, 6)}...{transaction.from.slice(-4)}</span>
          </div>
        )}
        
        {transaction.to && (
          <div className="flex justify-between">
            <span className="text-gray-400">To:</span>
            <span className="text-white font-mono text-xs">{transaction.to.slice(0, 6)}...{transaction.to.slice(-4)}</span>
          </div>
        )}
        
        {transaction.value && (
          <div className="flex justify-between">
            <span className="text-gray-400">Value:</span>
            <span className="text-white">{transaction.value} ONE</span>
          </div>
        )}
        
        {transaction.gasUsed && (
          <div className="flex justify-between">
            <span className="text-gray-400">Gas Used:</span>
            <span className="text-white">{transaction.gasUsed}</span>
          </div>
        )}
      </div>
    </div>
  )
}
