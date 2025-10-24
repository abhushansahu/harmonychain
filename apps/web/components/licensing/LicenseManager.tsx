'use client'

import React, { useState } from 'react'
import { License, Track } from '@/lib/types'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Plus, Search, Filter, MoreHorizontal, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface LicenseManagerProps {
  licenses: License[]
  tracks: Track[]
  onCreateLicense: (license: Omit<License, 'id' | 'createdAt'>) => void
  onUpdateLicense: (licenseId: string, updates: Partial<License>) => void
  onDeleteLicense: (licenseId: string) => void
  className?: string
}

const LicenseManager: React.FC<LicenseManagerProps> = ({
  licenses,
  tracks,
  onCreateLicense,
  onUpdateLicense,
  onDeleteLicense,
  className
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'expired' | 'pending'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'fee' | 'track'>('newest')

  const filteredLicenses = licenses
    .filter(license => {
      if (filterBy === 'active') return license.isActive
      if (filterBy === 'expired') return !license.isActive
      if (filterBy === 'pending') return !license.isActive && new Date(license.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      return true
    })
    .filter(license => {
      if (!searchQuery) return true
      const track = tracks.find(t => t.id === license.trackId)
      return track?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             license.licensee.toLowerCase().includes(searchQuery.toLowerCase())
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'fee':
          return b.fee - a.fee
        case 'track':
          const trackA = tracks.find(t => t.id === a.trackId)
          const trackB = tracks.find(t => t.id === b.trackId)
          return (trackA?.title || '').localeCompare(trackB?.title || '')
        default:
          return 0
      }
    })

  const getStatusIcon = (license: License) => {
    if (license.isActive) {
      return <CheckCircle className="w-4 h-4 text-green-600" />
    } else if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      return <XCircle className="w-4 h-4 text-red-600" />
    } else {
      return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusText = (license: License) => {
    if (license.isActive) return 'Active'
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) return 'Expired'
    return 'Pending'
  }

  const getStatusColor = (license: License) => {
    if (license.isActive) return 'bg-green-100 text-green-800'
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) return 'bg-red-100 text-red-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">License Manager</h1>
          <p className="text-gray-600">Manage track licensing and permissions</p>
        </div>
        
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create License
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search licenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Licenses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="fee">Highest Fee</option>
              <option value="track">Track Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Licenses List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Track
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Licensee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLicenses.map((license) => {
                const track = tracks.find(t => t.id === license.trackId)
                return (
                  <tr key={license.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                          {track?.coverArt ? (
                            <img
                              src={track.coverArt}
                              alt={track.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <DollarSign className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {track?.title || 'Unknown Track'}
                          </p>
                          <p className="text-sm text-gray-500">{track?.artist}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {license.licensee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {license.licenseType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(license.fee)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(license)}
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(license)
                        )}>
                          {getStatusText(license)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(license.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateLicense(license.id, { isActive: !license.isActive })}
                        >
                          {license.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <button
                          onClick={() => onDeleteLicense(license.id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredLicenses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No licenses found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterBy !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : "You haven't created any licenses yet."
            }
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Your First License
          </Button>
        </div>
      )}

      {/* Create License Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New License"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Track
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Choose a track...</option>
              {tracks.map(track => (
                <option key={track.id} value={track.id}>
                  {track.title} by {track.artist}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Licensee Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="sample">Sample</option>
                <option value="remix">Remix</option>
                <option value="commercial">Commercial</option>
                <option value="sync">Sync</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee (ONE)
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowCreateModal(false)}>
              Create License
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LicenseManager
