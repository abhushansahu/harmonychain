'use client'

import React, { useState, useEffect } from 'react'
import { Track } from '@/lib/types'
import { apiClient } from '@/lib/api/client'
import { useAccount } from 'wagmi'
import { useSignMessage } from 'wagmi'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface NFTMintFormProps {
  onMintSuccess?: (nft: any) => void
  onClose?: () => void
}

const NFTMintForm: React.FC<NFTMintFormProps> = ({ onMintSuccess, onClose }) => {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  
  const [tracks, setTracks] = useState<Track[]>([])
  const [selectedTrack, setSelectedTrack] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingTracks, setLoadingTracks] = useState(true)

  useEffect(() => {
    const loadArtistTracks = async () => {
      if (!isConnected || !address) return
      
      try {
        setLoadingTracks(true)
        const response = await apiClient.getTracks()
        if (response.success && response.data) {
          // Filter tracks by artist wallet address
          const artistTracks = response.data.filter(track => 
            track.owner === address
          )
          setTracks(artistTracks)
        }
      } catch (error) {
        console.error('Error loading tracks:', error)
        toast.error('Failed to load your tracks')
      } finally {
        setLoadingTracks(false)
      }
    }

    loadArtistTracks()
  }, [isConnected, address])

  const handleMint = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet')
      return
    }

    if (!selectedTrack) {
      toast.error('Please select a track to mint as NFT')
      return
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error('Please enter a valid price')
      return
    }

    try {
      setIsLoading(true)
      toast.loading('Minting NFT...', { id: 'mint' })

      // Get authentication signature
      const message = `Sign this message to mint NFT: ${Date.now()}`
      const signature = await signMessageAsync({ message })

      // Call API to mint NFT
      const response = await apiClient.customRequest('/api/nfts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${signature}`,
          'X-Wallet-Address': address
        },
        body: JSON.stringify({
          trackId: selectedTrack,
          price: parseFloat(price),
          description,
          owner: address
        })
      })

      if (response.success) {
        toast.success('NFT minted successfully!', { id: 'mint' })
        onMintSuccess?.(response.data)
        onClose?.()
      } else {
        throw new Error(response.error || 'Minting failed')
      }
    } catch (error) {
      console.error('Minting error:', error)
      toast.error(`Minting failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'mint' })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect Your Wallet</h3>
        <p className="text-gray-600 mb-6">Please connect your wallet to mint NFTs for your tracks.</p>
        <Button onClick={() => window.location.href = '/upload'}>
          Connect Wallet
        </Button>
      </div>
    )
  }

  if (loadingTracks) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your tracks...</p>
      </div>
    )
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">No Tracks Found</h3>
        <p className="text-gray-600 mb-6">You need to upload tracks before you can mint NFTs.</p>
        <Button onClick={() => window.location.href = '/upload'}>
          Upload Track
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mint NFT for Your Track</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Track *
            </label>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a track to mint as NFT</option>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.title} - {track.artist}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NFT Price (ONE) *
            </label>
            <Input
              type="number"
              placeholder="0.1"
              value={price}
              onChange={setPrice}
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your NFT..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleMint}
          disabled={isLoading || !selectedTrack || !price}
        >
          {isLoading ? 'Minting...' : 'Mint NFT'}
        </Button>
      </div>
    </div>
  )
}

export default NFTMintForm
