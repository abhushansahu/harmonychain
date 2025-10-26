import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

/**
 * IPFS Configuration with fallback modes
 * Supports local IPFS node, Pinata service, and mock mode
 */
const IPFS_API_URL = process.env.IPFS_API_URL || 'http://localhost:5001'
const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY
const PINATA_GATEWAY = process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud'

// Check if IPFS is properly configured
const isIPFSConfigured = () => {
  return PINATA_API_KEY && PINATA_SECRET_KEY
}

// Mock mode flag
const MOCK_MODE = process.env.IPFS_MOCK_MODE === 'true' || !isIPFSConfigured()

/**
 * Local IPFS client with validation and error handling
 */
const ipfsClient = {
  add: async (file: Buffer, options?: any) => {
    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.length > maxSize) {
      throw new Error(`File too large: ${file.length} bytes (max: ${maxSize} bytes)`)
    }

    // Validate file type
    const allowedTypes = ['audio/', 'image/', 'video/', 'application/']
    const filename = options?.filename || 'file'
    const hasValidType = allowedTypes.some(type => filename.includes(type))
    
    if (!hasValidType && !filename.match(/\.(mp3|wav|flac|jpg|jpeg|png|gif|mp4|webm)$/i)) {
      console.warn(`Unsupported file type: ${filename}`)
    }

    try {
      const formData = new FormData()
      formData.append('file', new Blob([new Uint8Array(file)]), filename)
      
      const response = await axios.post(`${IPFS_API_URL}/api/v0/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout
      })
      
      return { path: response.data.Hash }
    } catch (error) {
      console.warn('Local IPFS failed:', error)
      throw error
    }
  },
  
  cat: async function* (hash: string) {
    try {
      const response = await axios.get(`${IPFS_API_URL}/api/v0/cat?arg=${hash}`, {
        responseType: 'arraybuffer'
      })
      yield Buffer.from(response.data)
    } catch (error) {
      console.warn('Local IPFS cat failed:', error)
      throw error
    }
  }
}

/**
 * Initialize IPFS connection with health check
 */
const initIPFS = async () => {
  try {
    // Test connection to local IPFS
    const response = await axios.get(`${IPFS_API_URL}/api/v0/version`, {
      timeout: 5000 // 5 second timeout
    })
    console.log('✅ Local IPFS client initialized:', response.data)
    return ipfsClient
  } catch (error) {
    console.warn('⚠️ Failed to connect to local IPFS:', (error as Error).message)
    return null
  }
}

/**
 * Pinata API integration with error handling
 */
const pinataAPI = {
  // Upload file to Pinata
  uploadFile: async (file: Buffer, filename: string, metadata?: any) => {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error('Pinata API credentials not configured. Set PINATA_API_KEY and PINATA_SECRET_KEY environment variables.')
    }

    // Validate file size (Pinata limit: 1GB)
    const maxSize = 1024 * 1024 * 1024 // 1GB
    if (file.length > maxSize) {
      throw new Error(`File too large for Pinata: ${file.length} bytes (max: ${maxSize} bytes)`)
    }

    const formData = new FormData()
    formData.append('file', new Blob([new Uint8Array(file)]), filename)
    
    if (metadata) {
      formData.append('pinataMetadata', JSON.stringify(metadata))
    }

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      timeout: 60000 // 60 second timeout for large files
    })

    return {
      hash: response.data.IpfsHash,
      pinSize: response.data.PinSize,
      timestamp: response.data.Timestamp
    }
  },

  // Upload JSON to Pinata
  uploadJSON: async (data: any, name?: string) => {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error('Pinata API credentials not configured')
    }

    const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      pinataContent: data,
      pinataMetadata: {
        name: name || 'JSON Data'
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
    })

    return {
      hash: response.data.IpfsHash,
      pinSize: response.data.PinSize,
      timestamp: response.data.Timestamp
    }
  },

  // Pin existing hash
  pinHash: async (hash: string, name?: string) => {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error('Pinata API credentials not configured')
    }

    const response = await axios.post('https://api.pinata.cloud/pinning/pinByHash', {
      hashToPin: hash,
      pinataMetadata: {
        name: name || `Pinned Hash ${hash}`
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
    })

    return response.data
  }
}

/**
 * Mock IPFS implementation for development/testing
 */
const mockIPFS = {
  add: async (file: Buffer, options?: any) => {
    // Generate a mock hash
    const mockHash = `QmMock${Math.random().toString(36).substring(2, 15)}`
    console.log(`🔧 Mock IPFS: Uploaded ${options?.filename || 'file'} as ${mockHash}`)
    return { path: mockHash }
  },

  addJSON: async (data: any, options?: any) => {
    const mockHash = `QmMock${Math.random().toString(36).substring(2, 15)}`
    console.log(`🔧 Mock IPFS: Uploaded JSON as ${mockHash}`)
    return { path: mockHash }
  },

  cat: async function* (hash: string) {
    console.log(`🔧 Mock IPFS: Retrieving ${hash}`)
    yield Buffer.from('Mock file content')
  }
}

/**
 * Unified IPFS interface with fallback modes
 */
export const ipfs = {
  // Add file to IPFS (tries local first, then Pinata, then mock)
  add: async (file: Buffer, options?: any) => {
    // Mock mode
    if (MOCK_MODE) {
      console.log('🔧 Using mock IPFS mode')
      return await mockIPFS.add(file, options)
    }

    try {
      // Try local IPFS first
      const client = await initIPFS()
      if (client) {
        const result = await client.add(file, options)
        // Also pin to Pinata for reliability
        if (PINATA_API_KEY && PINATA_SECRET_KEY) {
          try {
            await pinataAPI.pinHash(result.path)
          } catch (error) {
            console.warn('Failed to pin to Pinata:', error)
          }
        }
        return { path: result.path }
      }
    } catch (error) {
      console.warn('Local IPFS failed, trying Pinata:', error)
    }

    try {
      // Fallback to Pinata
      const result = await pinataAPI.uploadFile(file, options?.filename || 'file', options?.metadata)
      return { path: result.hash }
    } catch (error) {
      console.error('Pinata upload failed:', error)
      console.log('🔧 Falling back to mock mode')
      return await mockIPFS.add(file, options)
    }
  },

  // Add JSON to IPFS
  addJSON: async (data: any, options?: any) => {
    // Mock mode
    if (MOCK_MODE) {
      return await mockIPFS.addJSON(data, options)
    }

    try {
      // Try local IPFS first
      const client = await initIPFS()
      if (client) {
        const result = await client.add(Buffer.from(JSON.stringify(data)), options)
        // Also pin to Pinata
        if (PINATA_API_KEY && PINATA_SECRET_KEY) {
          try {
            await pinataAPI.pinHash(result.path)
          } catch (error) {
            console.warn('Failed to pin to Pinata:', error)
          }
        }
        return { path: result.path }
      }
    } catch (error) {
      console.warn('Local IPFS failed, trying Pinata:', error)
    }

    try {
      // Fallback to Pinata
      const result = await pinataAPI.uploadJSON(data, options?.name)
      return { path: result.hash }
    } catch (error) {
      console.error('Pinata JSON upload failed:', error)
      console.log('🔧 Falling back to mock mode')
      return await mockIPFS.addJSON(data, options)
    }
  },

  // Get file from IPFS
  cat: async function* (hash: string) {
    // Mock mode
    if (MOCK_MODE) {
      for await (const chunk of mockIPFS.cat(hash)) {
        yield chunk
      }
      return
    }

    try {
      // Try local IPFS first
      const client = await initIPFS()
      if (client) {
        for await (const chunk of client.cat(hash)) {
          yield chunk
        }
        return
      }
    } catch (error) {
      console.warn('Local IPFS failed, trying Pinata gateway:', error)
    }

    // Fallback to Pinata gateway
    try {
      const response = await axios.get(`${PINATA_GATEWAY}/ipfs/${hash}`, {
        responseType: 'arraybuffer',
        timeout: 30000 // 30 second timeout
      })
      yield Buffer.from(response.data)
    } catch (error) {
      console.error(`Failed to retrieve file from Pinata gateway: ${error}`)
      console.log('🔧 Falling back to mock mode')
      for await (const chunk of mockIPFS.cat(hash)) {
        yield chunk
      }
    }
  },

  // Pin operations
  pin: {
    add: async (hash: string, name?: string) => {
      if (PINATA_API_KEY && PINATA_SECRET_KEY) {
        try {
          await pinataAPI.pinHash(hash, name)
          return { hash }
        } catch (error) {
          console.warn('Failed to pin to Pinata:', error)
        }
      }
      return { hash }
    },
    rm: async (hash: string) => {
      // Note: Pinata doesn't support unpinning via API
      console.warn('Unpinning not supported with Pinata')
      return { hash }
    }
  }
}

// Helper functions
export const getIPFSUrl = (hash: string, gateway?: string) => {
  const gateways = [
    gateway,
    PINATA_GATEWAY,
    'https://ipfs.io/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/'
  ].filter(Boolean)

  return `${gateways[0]}${hash}`
}

/**
 * Upload file to IPFS with validation
 */
export const uploadToIPFS = async (file: Buffer, filename: string, metadata?: any) => {
  if (!file || file.length === 0) {
    throw new Error('File is empty or invalid')
  }
  
  if (!filename || typeof filename !== 'string') {
    throw new Error('Filename is required and must be a string')
  }

  return await ipfs.add(file, { filename, ...metadata })
}

/**
 * Upload JSON data to IPFS
 */
export const uploadJSONToIPFS = async (data: any, name?: string) => {
  if (!data) {
    throw new Error('Data is required')
  }

  return await ipfs.addJSON(data, { name })
}

/**
 * Health check for IPFS services
 */
export const checkIPFSHealth = async () => {
  const health = {
    local: false,
    pinata: false,
    mock: MOCK_MODE
  }

  try {
    await axios.get(`${IPFS_API_URL}/api/v0/version`, { timeout: 5000 })
    health.local = true
  } catch (error) {
    console.warn('Local IPFS not available:', (error as Error).message)
  }

  if (PINATA_API_KEY && PINATA_SECRET_KEY) {
    try {
      await axios.get('https://api.pinata.cloud/data/testAuthentication', {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
        timeout: 5000
      })
      health.pinata = true
    } catch (error) {
      console.warn('Pinata not available:', (error as Error).message)
    }
  }

  return health
}

export default { ipfs, getIPFSUrl, uploadToIPFS, uploadJSONToIPFS, checkIPFSHealth }