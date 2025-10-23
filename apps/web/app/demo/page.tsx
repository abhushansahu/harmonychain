'use client'

import React, { useState } from 'react'
import MusicPlayer from '../../components/player/MusicPlayer'
import SearchInterface from '../../components/discovery/SearchInterface'
import GenreFilter from '../../components/discovery/GenreFilter'
import TrendingTracks from '../../components/discovery/TrendingTracks'
import ArtistDiscovery from '../../components/discovery/ArtistDiscovery'
import TrackUpload from '../../components/upload/TrackUpload'
import MetadataForm from '../../components/upload/MetadataForm'
import LicenseSettings from '../../components/upload/LicenseSettings'
import { Track, Artist } from '../../lib/types'
import { TrackMetadata } from '../../components/upload/MetadataForm'
import { LicenseSettings as LicenseSettingsType } from '../../components/upload/LicenseSettings'

export default function DemoPage() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<any>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<TrackMetadata | null>(null)
  const [license, setLicense] = useState<LicenseSettingsType | null>(null)

  // Mock track for demo
  const mockTrack: Track = {
    id: 'demo-track-1',
    title: 'Demo Track',
    artist: 'Demo Artist',
    artistAddress: '0x123...',
    artistId: 'artist-1',
    ipfsHash: 'QmDemoHash',
    genre: 'Electronic',
    playCount: 1250,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    duration: 180,
    description: 'A demo track for testing',
    tags: ['electronic', 'demo', 'test'],
    isPublished: true,
    isNftMinted: false,
    totalRevenue: 0,
    royaltyPercentage: 10
  }

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track)
  }

  const handleArtistSelect = (artist: Artist) => {
    console.log('Artist selected:', artist)
  }

  const handleSearchResults = (results: any) => {
    setSearchResults(results)
  }

  const handleGenreChange = (genres: string[]) => {
    setSelectedGenres(genres)
  }

  const handleUploadComplete = (ipfsHash: string, fileInfo: any) => {
    setUploadedFile(ipfsHash)
    console.log('Upload completed:', { ipfsHash, fileInfo })
  }

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error)
  }

  const handleMetadataSubmit = (metadata: TrackMetadata) => {
    setMetadata(metadata)
    console.log('Metadata submitted:', metadata)
  }

  const handleLicenseChange = (license: LicenseSettingsType) => {
    setLicense(license)
    console.log('License changed:', license)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HarmonyChain Demo</h1>
          <p className="text-gray-600">Explore the implemented components and features</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Music Player */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Music Player</h2>
            <MusicPlayer
              currentTrack={mockTrack}
              isPlaying={false}
              progress={0}
              volume={50}
              queue={[mockTrack]}
              onPlayPause={() => console.log('Play/Pause')}
              onSkipNext={() => console.log('Skip Next')}
              onSkipPrevious={() => console.log('Skip Previous')}
              onSeek={(progress) => console.log('Seek:', progress)}
              onVolumeChange={(volume) => console.log('Volume:', volume)}
              onQueueChange={(queue) => console.log('Queue:', queue)}
              onTrackSelect={handleTrackSelect}
            />
          </div>

          {/* Search Interface */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Search & Discovery</h2>
            <SearchInterface
              onSearchResults={handleSearchResults}
              onTrackSelect={handleTrackSelect}
              onArtistSelect={handleArtistSelect}
            />
          </div>

          {/* Genre Filter */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Genre Filter</h2>
            <GenreFilter
              selectedGenres={selectedGenres}
              onGenreChange={handleGenreChange}
            />
          </div>

          {/* Trending Tracks */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Trending Tracks</h2>
            <TrendingTracks
              onTrackSelect={handleTrackSelect}
            />
          </div>

          {/* Artist Discovery */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Artist Discovery</h2>
            <ArtistDiscovery
              onArtistSelect={handleArtistSelect}
              onTrackSelect={handleTrackSelect}
            />
          </div>

          {/* Track Upload */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Track Upload</h2>
            <TrackUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
          </div>

          {/* Metadata Form */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Metadata Form</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <MetadataForm
                onSubmit={handleMetadataSubmit}
                onCancel={() => console.log('Metadata form cancelled')}
              />
            </div>
          </div>

          {/* License Settings */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">License Settings</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <LicenseSettings
                onLicenseChange={handleLicenseChange}
              />
            </div>
          </div>
        </div>

        {/* Status Panel */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Music Player Interface</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Track Discovery</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Upload Flow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Artist Dashboard</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">NFT Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Licensing System</span>
            </div>
          </div>
        </div>

        {/* Implementation Summary */}
        <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Implementation Summary</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Phase 1 - Core User Experience:</strong> ✅ Completed</p>
            <ul className="ml-4 space-y-1">
              <li>• Music Player Interface (6 components)</li>
              <li>• Track Discovery (5 components)</li>
              <li>• Basic Upload Flow (5 components)</li>
            </ul>
            <p><strong>Phase 2 - Artist Tools:</strong> 🚧 Pending</p>
            <ul className="ml-4 space-y-1">
              <li>• Artist Dashboard (5 components)</li>
              <li>• NFT Creation & Management (5 components)</li>
              <li>• Licensing System (5 components)</li>
            </ul>
            <p><strong>Total Components Implemented:</strong> 16/31 (52%)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
