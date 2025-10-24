import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

// Import routes
import tracksRouter from './routes/tracks'
import artistsRouter from './routes/artists'
import nftsRouter from './routes/nfts'
import playlistsRouter from './routes/playlists'
import authRouter from './routes/auth'
import governanceRouter from './routes/governance'
import licensesRouter from './routes/licenses'

// Import middleware
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'

// Import blockchain
import { initBlockchain } from './config/blockchain'

// Import SimpleDB
import SimpleDB from './config/simpleDB'
import { seedDatabase } from './seedData'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HarmonyChain API',
      version: '1.0.0',
      description: 'Decentralized music platform API built on Harmony Network',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(rateLimiter())

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      services: {
        database: 'OK',
        ipfs: 'Unknown',
        blockchain: 'Unknown'
      }
    }

    // Check IPFS health
    try {
      const { checkIPFSHealth } = await import('./config/ipfs')
      const ipfsHealth = await checkIPFSHealth()
      health.services.ipfs = ipfsHealth.mock ? 'Mock Mode' : 
        (ipfsHealth.pinata ? 'Pinata Connected' : 'Local IPFS')
    } catch (error) {
      health.services.ipfs = 'Error'
    }

    // Check blockchain health
    try {
      const { getBlockchainHealth } = await import('./config/blockchain')
      const blockchainHealth = await getBlockchainHealth()
      health.services.blockchain = blockchainHealth.connected ? 
        `Connected to ${blockchainHealth.network}` : 'Disconnected'
    } catch (error) {
      health.services.blockchain = 'Error'
    }

    res.json(health)
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Debug endpoint for development
app.get('/debug', (req, res) => {
  try {
    const debug = {
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      database: {
        type: 'SimpleDB (JSON files)',
        location: './orbitdb/',
        stats: SimpleDB.getStats()
      },
      services: {
        ipfs: {
          mockMode: process.env.IPFS_MOCK_MODE === 'true',
          configured: !!(process.env.PINATA_API_KEY && process.env.PINATA_SECRET_KEY)
        },
        blockchain: {
          mockMode: process.env.BLOCKCHAIN_MOCK_MODE === 'true',
          network: process.env.NETWORK || 'localhost'
        }
      }
    }

    res.json(debug)
  } catch (error) {
    res.status(500).json({
      error: 'Debug information unavailable',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'HarmonyChain API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
      tracks: '/api/tracks',
      artists: '/api/artists',
      nfts: '/api/nfts',
      playlists: '/api/playlists',
      auth: '/api/auth',
      governance: '/api/governance',
      licenses: '/api/licenses'
    }
  })
})

// API routes
app.use('/api/tracks', tracksRouter)
app.use('/api/artists', artistsRouter)
app.use('/api/nfts', nftsRouter)
app.use('/api/playlists', playlistsRouter)
app.use('/api/auth', authRouter)
app.use('/api/governance', governanceRouter)
app.use('/api/licenses', licensesRouter)

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'The requested resource was not found'
  })
})

// Initialize services
const initializeServices = async () => {
  try {
    // SimpleDB is initialized automatically
    console.log('✅ SimpleDB initialized successfully')
    
    // Seed database with sample data (disabled in production)
    // seedDatabase()
    
    await initBlockchain()
    console.log('✅ All services initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize services:', error)
    process.exit(1)
  }
}

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('🔄 Shutting down gracefully...')
  process.exit(0)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

// Start server
const startServer = async () => {
  await initializeServices()
  
  app.listen(PORT, () => {
    console.log(`🚀 HarmonyChain API server running on port ${PORT}`)
    console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`)
  })
}

startServer().catch(console.error)

export default app
