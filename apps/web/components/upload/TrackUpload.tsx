'use client'

import React, { useState, useRef } from 'react'
import { TrackUploadForm } from '@/lib/types'
import { formatFileSize, isAudioFile } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Upload, X, Music, FileAudio } from 'lucide-react'
import Button from '@/components/ui/Button'

interface TrackUploadProps {
  onUpload: (form: TrackUploadForm) => void
  className?: string
}

const TrackUpload: React.FC<TrackUploadProps> = ({ onUpload, className }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!isAudioFile(file.name)) {
      alert('Please upload a valid audio file (MP3, WAV, FLAC, etc.)')
      return
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      alert('File size must be less than 100MB')
      return
    }

    setUploadedFile(file)
    simulateUpload()
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + Math.random() * 15 + 5 // More realistic progress
      })
    }, 300)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = () => {
    if (!uploadedFile) return

    const form: TrackUploadForm = {
      title: '',
      artist: '',
      genre: '',
      description: '',
      price: 0,
      coverArt: null,
      audioFile: uploadedFile,
      licenseType: 'free'
    }

    onUpload(form)
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!uploadedFile ? (
          <div>
            <div className="flex justify-center mb-4">
              <Upload className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Your Track
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your audio file here, or click to browse
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Choose File
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Supports MP3, WAV, FLAC, AAC, OGG (Max 100MB)
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center mb-4">
              <FileAudio className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {uploadedFile.name}
            </h3>
            <p className="text-gray-600 mb-4">
              {formatFileSize(uploadedFile.size)}
            </p>

            {/* Upload Progress */}
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                onClick={removeFile}
                variant="outline"
                disabled={isUploading}
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isUploading || uploadProgress < 100}
              >
                {isUploading ? 'Uploading...' : 'Continue'}
              </Button>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Upload Tips */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Upload Tips
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use high-quality audio files for best results</li>
          <li>• Supported formats: MP3, WAV, FLAC, AAC, OGG</li>
          <li>• Maximum file size: 100MB</li>
          <li>• Your file will be stored securely on IPFS</li>
        </ul>
      </div>
    </div>
  )
}

export default TrackUpload
