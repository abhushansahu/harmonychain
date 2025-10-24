'use client'

import React, { useState } from 'react'
import { LicensePermissions } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, Info } from 'lucide-react'

interface PermissionMatrixProps {
  permissions: LicensePermissions
  onChange: (permissions: LicensePermissions) => void
  readOnly?: boolean
  className?: string
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  permissions,
  onChange,
  readOnly = false,
  className
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const permissionTemplates = [
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
      id: 'sync',
      name: 'Sync License',
      description: 'For use in video content and media',
      permissions: {
        canSample: true,
        canRemix: false,
        canCommercialUse: true,
        canSync: true,
        canDistribute: false,
        canPerform: true,
        canBroadcast: true
      }
    }
  ]

  const permissionFields = [
    {
      key: 'canSample' as keyof LicensePermissions,
      label: 'Sampling',
      description: 'Allow others to use parts of your track in their music',
      icon: '🎵'
    },
    {
      key: 'canRemix' as keyof LicensePermissions,
      label: 'Remixing',
      description: 'Allow others to create remixes of your track',
      icon: '🔄'
    },
    {
      key: 'canCommercialUse' as keyof LicensePermissions,
      label: 'Commercial Use',
      description: 'Allow others to use your track for commercial purposes',
      icon: '💼'
    },
    {
      key: 'canSync' as keyof LicensePermissions,
      label: 'Sync Rights',
      description: 'Allow others to sync your track with video content',
      icon: '🎬'
    },
    {
      key: 'canDistribute' as keyof LicensePermissions,
      label: 'Distribution',
      description: 'Allow others to distribute your track',
      icon: '📤'
    },
    {
      key: 'canPerform' as keyof LicensePermissions,
      label: 'Performance Rights',
      description: 'Allow others to perform your track live',
      icon: '🎤'
    },
    {
      key: 'canBroadcast' as keyof LicensePermissions,
      label: 'Broadcast Rights',
      description: 'Allow others to broadcast your track on radio/TV',
      icon: '📻'
    }
  ]

  const handlePermissionChange = (key: keyof LicensePermissions) => {
    if (readOnly) return
    
    const newPermissions = {
      ...permissions,
      [key]: !permissions[key]
    }
    onChange(newPermissions)
  }

  const handleTemplateSelect = (templateId: string) => {
    if (readOnly) return
    
    setSelectedTemplate(templateId)
    const template = permissionTemplates.find(t => t.id === templateId)
    if (template) {
      onChange(template.permissions)
    }
  }

  const getPermissionIcon = (value: boolean) => {
    return value ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    )
  }

  const getPermissionColor = (value: boolean) => {
    return value
      ? 'bg-green-50 border-green-200 text-green-800'
      : 'bg-red-50 border-red-200 text-red-800'
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Template Selection */}
      {!readOnly && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {permissionTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={cn(
                  'p-4 border rounded-lg cursor-pointer transition-colors',
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permission Matrix */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Permission Matrix</h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure what others can do with your track
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {permissionFields.map((field) => (
            <div
              key={field.key}
              className={cn(
                'px-6 py-4 flex items-center justify-between',
                !readOnly && 'hover:bg-gray-50 cursor-pointer'
              )}
              onClick={() => handlePermissionChange(field.key)}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{field.icon}</div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{field.label}</h4>
                  <p className="text-sm text-gray-600">{field.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium border',
                  getPermissionColor(permissions[field.key])
                )}>
                  {permissions[field.key] ? 'Allowed' : 'Not Allowed'}
                </div>
                {getPermissionIcon(permissions[field.key])}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">License Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">Allowed Actions:</p>
            <ul className="space-y-1">
              {permissionFields
                .filter(field => permissions[field.key])
                .map(field => (
                  <li key={field.key} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-900">{field.label}</span>
                  </li>
                ))}
            </ul>
          </div>
          
          <div>
            <p className="text-gray-600 mb-1">Restricted Actions:</p>
            <ul className="space-y-1">
              {permissionFields
                .filter(field => !permissions[field.key])
                .map(field => (
                  <li key={field.key} className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-gray-900">{field.label}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Important Notes</h4>
            <ul className="text-sm text-blue-800 mt-1 space-y-1">
              <li>• These permissions are enforced by smart contracts</li>
              <li>• Changes take effect immediately for new licenses</li>
              <li>• Existing licenses maintain their original permissions</li>
              <li>• You can always update permissions for future use</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PermissionMatrix
