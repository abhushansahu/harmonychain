'use client'

import React, { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import TrackUpload from '@/components/upload/TrackUpload'
import MetadataForm from '@/components/upload/MetadataForm'
import LicenseSettings from '@/components/upload/LicenseSettings'
import { TrackUploadForm } from '@/lib/types'
import { apiClient } from '@/lib/api/client'
import toast from 'react-hot-toast'
import { useAccount, useSignMessage } from 'wagmi'

export default function UploadPage() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [step, setStep] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [uploadForm, setUploadForm] = useState<TrackUploadForm>({
    title: '',
    artist: '',
    genre: '',
    description: '',
    price: 0,
    coverArt: null,
    audioFile: null,
    licenseType: 'free'
  })

  const handleUpload = (form: TrackUploadForm) => {
    setUploadForm(form)
    setStep(2)
  }

  const handleMetadataChange = (form: TrackUploadForm) => {
    setUploadForm(form)
  }

  const handleMetadataSubmit = (form: TrackUploadForm) => {
    setUploadForm(form)
    setStep(3)
  }

  const handleLicenseSubmit = async (form: TrackUploadForm) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet to upload music')
      return
    }

    try {
      setUploading(true)
      
      // Step 1: Get authentication token
      const message = `Sign this message to authenticate with HarmonyChain: ${Date.now()}`
      const signature = await signMessageAsync({ message })
      
      // Step 2: Create FormData for file upload
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('duration', '180') // Default duration, could be calculated from audio file
      formData.append('genre', form.genre)
      formData.append('price', form.price.toString())
      
      if (form.audioFile) {
        formData.append('audioFile', form.audioFile)
      }
      
      if (form.coverArt) {
        formData.append('coverArt', form.coverArt)
      }
      
      // Step 3: Submit to API with authentication
      const result = await apiClient.uploadTrack(formData, signature, address)
      
      if (result.success) {
        toast.success('Track uploaded successfully to IPFS and registered on blockchain!')
        console.log('Upload result:', result.data)
        
        // Reset form and go back to step 1
        setUploadForm({
          title: '',
          artist: '',
          genre: '',
          description: '',
          price: 0,
          coverArt: null,
          audioFile: null,
          licenseType: 'free'
        })
        setStep(1)
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const steps = [
    { id: 1, name: 'Upload Track', description: 'Select and upload your audio file' },
    { id: 2, name: 'Track Details', description: 'Add metadata and information' },
    { id: 3, name: 'License Settings', description: 'Configure licensing and permissions' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Upload Your Track</h1>
            <p className="text-xl text-gray-300">
              Share your music with the world on HarmonyChain
            </p>
            {!isConnected && (
              <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-200">
                  Please connect your wallet to upload music
                </p>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => (
                <div key={stepItem.id} className="flex items-center">
                  <div className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                    step >= stepItem.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-transparent border-gray-400 text-gray-400'
                  )}>
                    {stepItem.id}
                  </div>
                  <div className="ml-3">
                    <p className={cn(
                      'text-sm font-medium',
                      step >= stepItem.id ? 'text-white' : 'text-gray-400'
                    )}>
                      {stepItem.name}
                    </p>
                    <p className={cn(
                      'text-xs',
                      step >= stepItem.id ? 'text-gray-300' : 'text-gray-500'
                    )}>
                      {stepItem.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      'w-16 h-0.5 mx-4',
                      step > stepItem.id ? 'bg-blue-600' : 'bg-gray-600'
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-xl">
            {step === 1 && (
              <TrackUpload
                onUpload={handleUpload}
                className="p-6"
              />
            )}

            {step === 2 && (
              <MetadataForm
                form={uploadForm}
                onChange={handleMetadataChange}
                onSubmit={handleMetadataSubmit}
                className="p-6"
              />
            )}

            {step === 3 && (
              <LicenseSettings
                form={uploadForm}
                onChange={handleMetadataChange}
                onSubmit={handleLicenseSubmit}
                className="p-6"
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
