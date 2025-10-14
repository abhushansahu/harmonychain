'use client'

import React, { useState, useRef, useCallback } from 'react'
import { IPFSUploadService } from './IPFSUploadService'

interface TrackUploadProps {
  onUploadComplete: (ipfsHash: string, fileInfo: FileInfo) => void
  onUploadError: (error: string) => void
  maxFileSize?: number // in MB
  acceptedFormats?: string[]
  multiple?: boolean
}

interface FileInfo {
  name: string
  size: number
  type: string
  duration?: number
  waveform?: number[]
}

interface UploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  ipfsHash?: string
  error?: string
}

export default function TrackUpload({
  onUploadComplete,
  onUploadError,
  maxFileSize = 100, // 100MB default
  acceptedFormats = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/flac'],
  multiple = false
}: TrackUploadProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadService = useRef(new IPFSUploadService())

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit`
    }

    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Unsupported file format. Accepted formats: ${acceptedFormats.join(', ')}`
    }

    return null
  }

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles: File[] = []
    const errors: string[] = []

    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      onUploadError(errors.join('\n'))
    }

    if (validFiles.length > 0) {
      startUploads(validFiles)
    }
  }, [maxFileSize, acceptedFormats, onUploadError])

  const startUploads = async (files: File[]) => {
    setIsUploading(true)
    
    // Initialize upload progress
    const initialUploads: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }))
    setUploads(initialUploads)

    // Upload files sequentially or in parallel based on multiple setting
    if (multiple) {
      await Promise.all(files.map((file, index) => uploadFile(file, index)))
    } else {
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i], i)
      }
    }

    setIsUploading(false)
  }

  const uploadFile = async (file: File, index: number) => {
    try {
      // Update status to processing
      setUploads(prev => prev.map((upload, i) => 
        i === index ? { ...upload, status: 'processing' } : upload
      ))

      // Get file info
      const fileInfo = await getFileInfo(file)
      
      // Upload to IPFS
      const ipfsHash = await uploadService.current.uploadFile(file, (progress) => {
        setUploads(prev => prev.map((upload, i) => 
          i === index ? { ...upload, progress } : upload
        ))
      })

      // Update status to completed
      setUploads(prev => prev.map((upload, i) => 
        i === index ? { 
          ...upload, 
          status: 'completed', 
          ipfsHash,
          progress: 100 
        } : upload
      ))

      onUploadComplete(ipfsHash, fileInfo)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      setUploads(prev => prev.map((upload, i) => 
        i === index ? { 
          ...upload, 
          status: 'error', 
          error: errorMessage 
        } : upload
      ))

      onUploadError(errorMessage)
    }
  }

  const getFileInfo = async (file: File): Promise<FileInfo> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      
      reader.onload = () => {
        const audio = new Audio()
        audio.onloadedmetadata = () => {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            duration: audio.duration,
            waveform: generateMockWaveform(audio.duration)
          })
        }
        audio.src = reader.result as string
      }
      
      reader.readAsDataURL(file)
    })
  }

  const generateMockWaveform = (duration: number): number[] => {
    // Generate mock waveform data - in real app, this would use Web Audio API
    const samples = Math.floor(duration * 10) // 10 samples per second
    return Array.from({ length: samples }, () => Math.random())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'uploading':
        return (
          <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        )
      case 'processing':
        return (
          <svg className="w-4 h-4 text-yellow-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        )
      case 'completed':
        return (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const getStatusColor = (status: UploadProgress['status']) => {
    switch (status) {
      case 'uploading':
        return 'text-primary-600'
      case 'processing':
        return 'text-yellow-600'
      case 'completed':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          {/* Upload Text */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isUploading ? 'Uploading...' : 'Upload your music'}
            </h3>
            <p className="text-gray-500 mb-4">
              Drag and drop your audio files here, or click to browse
            </p>
            <p className="text-sm text-gray-400">
              Max file size: {maxFileSize}MB • Supported formats: {acceptedFormats.map(f => f.split('/')[1]).join(', ')}
            </p>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Choose Files'}
          </button>
        </div>
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-gray-900">Upload Progress</h4>
          {uploads.map((upload, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(upload.status)}
                  <div>
                    <p className="font-medium text-gray-900">{upload.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(upload.file.size)} • {upload.file.type}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${getStatusColor(upload.status)}`}>
                  {upload.status === 'uploading' && `${Math.round(upload.progress)}%`}
                  {upload.status === 'processing' && 'Processing...'}
                  {upload.status === 'completed' && 'Completed'}
                  {upload.status === 'error' && 'Failed'}
                </div>
              </div>

              {/* Progress Bar */}
              {upload.status === 'uploading' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              )}

              {/* Error Message */}
              {upload.status === 'error' && upload.error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {upload.error}
                </div>
              )}

              {/* Success Info */}
              {upload.status === 'completed' && upload.ipfsHash && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                  <p>Upload successful! IPFS Hash: <code className="font-mono">{upload.ipfsHash}</code></p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Upload Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use high-quality audio files for better streaming experience</li>
          <li>• Supported formats: MP3, WAV, OGG, M4A, FLAC</li>
          <li>• Files are stored on IPFS for decentralized access</li>
          <li>• You can upload multiple files at once</li>
        </ul>
      </div>
    </div>
  )
}
