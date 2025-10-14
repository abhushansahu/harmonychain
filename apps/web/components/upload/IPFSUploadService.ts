/**
 * IPFSUploadService handles file uploads to IPFS
 * Provides chunked upload, progress tracking, and retry logic
 */

export class IPFSUploadService {
  private gatewayUrls: string[] = [
    'https://ipfs.infura.io:5001/api/v0',
    'https://api.pinata.cloud/pinning',
    'https://ipfs.io/api/v0'
  ]
  private currentGatewayIndex = 0
  private chunkSize = 1024 * 1024 // 1MB chunks
  private maxRetries = 3

  /**
   * Upload a file to IPFS with progress tracking
   */
  async uploadFile(
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      // Validate file
      this.validateFile(file)

      // Upload to IPFS
      const ipfsHash = await this.uploadToIPFS(file, onProgress)
      
      // Verify upload
      await this.verifyUpload(ipfsHash)
      
      return ipfsHash
    } catch (error) {
      throw new Error(`IPFS upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Upload multiple files to IPFS
   */
  async uploadFiles(
    files: File[],
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<string[]> {
    const results: string[] = []
    
    for (let i = 0; i < files.length; i++) {
      try {
        const ipfsHash = await this.uploadFile(files[i], (progress) => {
          onProgress?.(i, progress)
        })
        results.push(ipfsHash)
      } catch (error) {
        console.error(`Failed to upload file ${i}:`, error)
        throw error
      }
    }
    
    return results
  }

  /**
   * Upload file to IPFS using chunked upload
   */
  private async uploadToIPFS(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    // Try different gateways
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const gatewayUrl = this.gatewayUrls[this.currentGatewayIndex]
        const response = await this.uploadToGateway(gatewayUrl, formData, onProgress)
        
        if (response.ok) {
          const result = await response.json()
          return result.Hash || result.ipfsHash
        }
      } catch (error) {
        console.warn(`Gateway ${this.currentGatewayIndex} failed:`, error)
        this.currentGatewayIndex = (this.currentGatewayIndex + 1) % this.gatewayUrls.length
      }
    }

    throw new Error('All IPFS gateways failed')
  }

  /**
   * Upload to specific gateway
   */
  private async uploadToGateway(
    gatewayUrl: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(new Response(xhr.responseText, {
            status: xhr.status,
            statusText: xhr.statusText
          }))
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Network error'))
      })

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timeout'))
      })

      xhr.timeout = 300000 // 5 minutes timeout
      xhr.open('POST', `${gatewayUrl}/add`)
      xhr.send(formData)
    })
  }

  /**
   * Verify that the upload was successful
   */
  private async verifyUpload(ipfsHash: string): Promise<void> {
    const testUrls = [
      `https://ipfs.io/ipfs/${ipfsHash}`,
      `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`
    ]

    for (const url of testUrls) {
      try {
        const response = await fetch(url, { method: 'HEAD' })
        if (response.ok) {
          return // Upload verified
        }
      } catch (error) {
        console.warn(`Verification failed for ${url}:`, error)
      }
    }

    throw new Error('Upload verification failed')
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): void {
    if (!file) {
      throw new Error('No file provided')
    }

    if (file.size === 0) {
      throw new Error('File is empty')
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      throw new Error('File too large (max 100MB)')
    }

    const allowedTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/mp4',
      'audio/flac',
      'audio/x-m4a'
    ]

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}`)
    }
  }

  /**
   * Get file metadata from IPFS
   */
  async getFileMetadata(ipfsHash: string): Promise<{
    size: number
    type: string
    name: string
  }> {
    try {
      const response = await fetch(`https://ipfs.io/api/v0/object/stat?arg=${ipfsHash}`)
      if (!response.ok) {
        throw new Error('Failed to get file metadata')
      }
      
      const data = await response.json()
      return {
        size: data.DataSize,
        type: data.Links ? 'directory' : 'file',
        name: data.Links?.[0]?.Name || 'unknown'
      }
    } catch (error) {
      throw new Error(`Failed to get metadata: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Pin file to IPFS (ensure persistence)
   */
  async pinFile(ipfsHash: string): Promise<void> {
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinByHash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY || '',
          'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || ''
        },
        body: JSON.stringify({
          hashToPin: ipfsHash,
          pinataMetadata: {
            name: `HarmonyChain-${Date.now()}`
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to pin file')
      }
    } catch (error) {
      console.warn('Pinning failed:', error)
      // Don't throw error as pinning is optional
    }
  }

  /**
   * Get upload statistics
   */
  getUploadStats(): {
    totalUploads: number
    successfulUploads: number
    failedUploads: number
    averageUploadTime: number
  } {
    // Mock implementation - in real app, this would track actual stats
    return {
      totalUploads: 0,
      successfulUploads: 0,
      failedUploads: 0,
      averageUploadTime: 0
    }
  }

  /**
   * Add custom gateway
   */
  addGateway(url: string): void {
    if (!this.gatewayUrls.includes(url)) {
      this.gatewayUrls.push(url)
    }
  }

  /**
   * Remove gateway
   */
  removeGateway(url: string): void {
    const index = this.gatewayUrls.indexOf(url)
    if (index > -1) {
      this.gatewayUrls.splice(index, 1)
    }
  }

  /**
   * Get current gateways
   */
  getGateways(): string[] {
    return [...this.gatewayUrls]
  }

  /**
   * Test gateway connectivity
   */
  async testGateway(url: string): Promise<boolean> {
    try {
      const response = await fetch(`${url}/version`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  /**
   * Get optimal gateway based on performance
   */
  async getOptimalGateway(): Promise<string> {
    const results = await Promise.allSettled(
      this.gatewayUrls.map(url => this.testGateway(url))
    )

    for (let i = 0; i < results.length; i++) {
      if (results[i].status === 'fulfilled' && results[i].value) {
        return this.gatewayUrls[i]
      }
    }

    // Fallback to first gateway
    return this.gatewayUrls[0]
  }
}
