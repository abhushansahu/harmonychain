'use client'

import React, { useState } from 'react'
import { TrackUploadForm, LicensePermissions } from '@/lib/types'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface LicenseSettingsProps {
  form: TrackUploadForm
  onChange: (form: TrackUploadForm) => void
  onSubmit: (form: TrackUploadForm) => void
  className?: string
}

const LicenseSettings: React.FC<LicenseSettingsProps> = ({
  form,
  onChange,
  onSubmit,
  className
}) => {
  const [permissions, setPermissions] = useState<LicensePermissions>({
    canSample: true,
    canRemix: false,
    canCommercialUse: false,
    canSync: false,
    canDistribute: false,
    canPerform: true,
    canBroadcast: false
  })

  const [licenseTemplate, setLicenseTemplate] = useState<string>('basic')

  const licenseTemplates = [
    {
      id: 'basic',
      name: 'Basic License',
      description: 'Free streaming and basic use',
      permissions: {
        canSample: true,
        canRemix: false,
        canCommercialUse: false,
        canSync: false,
        canDistribute: false,
        canPerform: true,
        canBroadcast: false
      }
    },
    {
      id: 'creative',
      name: 'Creative Commons',
      description: 'Allow remixing and sharing with attribution',
      permissions: {
        canSample: true,
        canRemix: true,
        canCommercialUse: false,
        canSync: false,
        canDistribute: true,
        canPerform: true,
        canBroadcast: false
      }
    },
    {
      id: 'commercial',
      name: 'Commercial License',
      description: 'Full commercial use rights',
      permissions: {
        canSample: true,
        canRemix: true,
        canCommercialUse: true,
        canSync: true,
        canDistribute: true,
        canPerform: true,
        canBroadcast: true
      }
    },
    {
      id: 'custom',
      name: 'Custom License',
      description: 'Set your own permissions',
      permissions: permissions
    }
  ]

  const handleTemplateChange = (templateId: string) => {
    setLicenseTemplate(templateId)
    
    if (templateId !== 'custom') {
      const template = licenseTemplates.find(t => t.id === templateId)
      if (template) {
        setPermissions(template.permissions)
      }
    }
  }

  const handlePermissionChange = (permission: keyof LicensePermissions) => {
    const newPermissions = {
      ...permissions,
      [permission]: !permissions[permission]
    }
    setPermissions(newPermissions)
    setLicenseTemplate('custom')
  }

  const handleSubmit = () => {
    // In a real implementation, you would save the license settings
    // and proceed to the next step (IPFS upload, blockchain registration)
    onSubmit(form)
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* License Template Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Choose License Template
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {licenseTemplates.map((template) => (
            <div
              key={template.id}
              className={cn(
                'p-4 border rounded-lg cursor-pointer transition-colors',
                licenseTemplate === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              )}
              onClick={() => handleTemplateChange(template.id)}
            >
              <h4 className="font-medium text-gray-900">{template.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Permissions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          License Permissions
        </h3>
        
        <div className="space-y-4">
          {[
            {
              key: 'canSample' as keyof LicensePermissions,
              label: 'Allow Sampling',
              description: 'Others can use parts of your track in their music'
            },
            {
              key: 'canRemix' as keyof LicensePermissions,
              label: 'Allow Remixing',
              description: 'Others can create remixes of your track'
            },
            {
              key: 'canCommercialUse' as keyof LicensePermissions,
              label: 'Commercial Use',
              description: 'Others can use your track for commercial purposes'
            },
            {
              key: 'canSync' as keyof LicensePermissions,
              label: 'Sync Rights',
              description: 'Others can sync your track with video content'
            },
            {
              key: 'canDistribute' as keyof LicensePermissions,
              label: 'Distribution',
              description: 'Others can distribute your track'
            },
            {
              key: 'canPerform' as keyof LicensePermissions,
              label: 'Performance Rights',
              description: 'Others can perform your track live'
            },
            {
              key: 'canBroadcast' as keyof LicensePermissions,
              label: 'Broadcast Rights',
              description: 'Others can broadcast your track on radio/TV'
            }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-start space-x-3">
              <input
                type="checkbox"
                id={key}
                checked={permissions[key]}
                onChange={() => handlePermissionChange(key)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <label htmlFor={key} className="text-sm font-medium text-gray-900">
                  {label}
                </label>
                <p className="text-xs text-gray-600">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* License Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">License Summary</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• <strong>Streaming:</strong> Always allowed</p>
          <p>• <strong>Sampling:</strong> {permissions.canSample ? 'Allowed' : 'Not allowed'}</p>
          <p>• <strong>Remixing:</strong> {permissions.canRemix ? 'Allowed' : 'Not allowed'}</p>
          <p>• <strong>Commercial Use:</strong> {permissions.canCommercialUse ? 'Allowed' : 'Not allowed'}</p>
          <p>• <strong>Sync Rights:</strong> {permissions.canSync ? 'Allowed' : 'Not allowed'}</p>
        </div>
      </div>

      {/* Revenue Split */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Revenue Sharing
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Artist Share (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              defaultValue="85"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform Share (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              defaultValue="15"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <p className="text-xs text-gray-600 mt-2">
          Revenue from licensing and NFT sales will be split according to these percentages.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Back to Metadata
        </Button>
        <Button onClick={handleSubmit}>
          Upload to Blockchain
        </Button>
      </div>
    </div>
  )
}

export default LicenseSettings
