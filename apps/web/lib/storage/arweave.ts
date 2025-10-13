import Arweave from 'arweave'

export interface ArweaveTrack {
  id: string
  title: string
  artist: string
  artistAddress: string
  ipfsHash: string
  genre: string
  description?: string
  duration?: number
  fileSize?: number
  tags?: string[]
  license?: string
  createdAt: number
  updatedAt: number
}

export interface ArweaveMetadata {
  title: string
  description: string
  type: 'track' | 'artist' | 'playlist'
  version: string
  app: 'HarmonyChain'
  timestamp: number
}

class HarmonyArweave {
  private arweave: Arweave
  private wallet: any = null
  private isInitialized = false

  constructor() {
    this.arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
      timeout: 20000,
      logging: false
    })
  }

  async init(wallet?: any): Promise<void> {
    if (this.isInitialized) return

    try {
      if (wallet) {
        this.wallet = wallet
      } else {
        // Try to load wallet from environment or create new one
        const walletData = process.env.ARWEAVE_WALLET
        if (walletData) {
          this.wallet = JSON.parse(walletData)
        } else {
          console.warn('No Arweave wallet provided. Some operations will not be available.')
        }
      }

      this.isInitialized = true
      console.log('Arweave initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Arweave:', error)
      throw error
    }
  }

  // Store track permanently
  async storeTrack(track: ArweaveTrack): Promise<string> {
    if (!this.isInitialized) await this.init()
    if (!this.wallet) throw new Error('Arweave wallet not available')

    try {
      const metadata: ArweaveMetadata = {
        title: track.title,
        description: track.description || '',
        type: 'track',
        version: '1.0',
        app: 'HarmonyChain',
        timestamp: Date.now()
      }

      const transaction = await this.arweave.createTransaction({
        data: JSON.stringify(track),
        tags: [
          { name: 'Content-Type', value: 'application/json' },
          { name: 'App-Name', value: 'HarmonyChain' },
          { name: 'App-Version', value: '1.0' },
          { name: 'Type', value: 'track' },
          { name: 'Track-ID', value: track.id },
          { name: 'Title', value: track.title },
          { name: 'Artist', value: track.artist },
          { name: 'Genre', value: track.genre },
          { name: 'IPFS-Hash', value: track.ipfsHash },
          { name: 'Created-At', value: track.createdAt.toString() }
        ]
      }, this.wallet)

      // Sign and submit transaction
      await this.arweave.transactions.sign(transaction, this.wallet)
      const response = await this.arweave.transactions.post(transaction)

      if (response.status === 200) {
        console.log(`Track stored permanently: ${transaction.id}`)
        return transaction.id
      } else {
        throw new Error(`Failed to store track: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to store track:', error)
      throw error
    }
  }

  // Retrieve track from Arweave
  async getTrack(transactionId: string): Promise<ArweaveTrack | null> {
    if (!this.isInitialized) await this.init()

    try {
      const transaction = await this.arweave.transactions.get(transactionId)
      const data = await this.arweave.transactions.getData(transactionId, { decode: true, string: true })
      
      if (data) {
        return JSON.parse(data as string) as ArweaveTrack
      }
      
      return null
    } catch (error) {
      console.error('Failed to get track:', error)
      return null
    }
  }

  // Search tracks by tags
  async searchTracks(query: string, limit: number = 10): Promise<ArweaveTrack[]> {
    if (!this.isInitialized) await this.init()

    try {
      const transactions = await this.arweave.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: 'HarmonyChain'
        },
        expr2: {
          op: 'equals',
          expr1: 'Type',
          expr2: 'track'
        }
      })

      const tracks: ArweaveTrack[] = []
      
      for (let i = 0; i < Math.min(transactions.length, limit); i++) {
        try {
          const track = await this.getTrack(transactions[i])
          if (track && (
            track.title.toLowerCase().includes(query.toLowerCase()) ||
            track.artist.toLowerCase().includes(query.toLowerCase()) ||
            track.genre.toLowerCase().includes(query.toLowerCase())
          )) {
            tracks.push(track)
          }
        } catch (error) {
          console.warn(`Failed to load track ${transactions[i]}:`, error)
        }
      }

      return tracks
    } catch (error) {
      console.error('Failed to search tracks:', error)
      return []
    }
  }

  // Get tracks by artist
  async getTracksByArtist(artistAddress: string, limit: number = 10): Promise<ArweaveTrack[]> {
    if (!this.isInitialized) await this.init()

    try {
      const transactions = await this.arweave.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: 'HarmonyChain'
        },
        expr2: {
          op: 'equals',
          expr1: 'Type',
          expr2: 'track'
        }
      })

      const tracks: ArweaveTrack[] = []
      
      for (let i = 0; i < Math.min(transactions.length, limit); i++) {
        try {
          const track = await this.getTrack(transactions[i])
          if (track && track.artistAddress === artistAddress) {
            tracks.push(track)
          }
        } catch (error) {
          console.warn(`Failed to load track ${transactions[i]}:`, error)
        }
      }

      return tracks
    } catch (error) {
      console.error('Failed to get tracks by artist:', error)
      return []
    }
  }

  // Store artist profile permanently
  async storeArtistProfile(profile: any): Promise<string> {
    if (!this.isInitialized) await this.init()
    if (!this.wallet) throw new Error('Arweave wallet not available')

    try {
      const metadata: ArweaveMetadata = {
        title: profile.name,
        description: profile.bio || '',
        type: 'artist',
        version: '1.0',
        app: 'HarmonyChain',
        timestamp: Date.now()
      }

      const transaction = await this.arweave.createTransaction({
        data: JSON.stringify(profile),
        tags: [
          { name: 'Content-Type', value: 'application/json' },
          { name: 'App-Name', value: 'HarmonyChain' },
          { name: 'App-Version', value: '1.0' },
          { name: 'Type', value: 'artist' },
          { name: 'Artist-Address', value: profile.walletAddress },
          { name: 'Name', value: profile.name },
          { name: 'Created-At', value: profile.createdAt.toString() }
        ]
      }, this.wallet)

      await this.arweave.transactions.sign(transaction, this.wallet)
      const response = await this.arweave.transactions.post(transaction)

      if (response.status === 200) {
        console.log(`Artist profile stored permanently: ${transaction.id}`)
        return transaction.id
      } else {
        throw new Error(`Failed to store artist profile: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to store artist profile:', error)
      throw error
    }
  }

  // Get transaction info
  async getTransactionInfo(transactionId: string): Promise<any> {
    if (!this.isInitialized) await this.init()

    try {
      const transaction = await this.arweave.transactions.get(transactionId)
      return {
        id: transaction.id,
        tags: transaction.tags,
        dataSize: transaction.data_size,
        reward: transaction.reward,
        timestamp: transaction.timestamp
      }
    } catch (error) {
      console.error('Failed to get transaction info:', error)
      return null
    }
  }

  // Get wallet balance
  async getWalletBalance(): Promise<string> {
    if (!this.isInitialized) await this.init()
    if (!this.wallet) throw new Error('Arweave wallet not available')

    try {
      const balance = await this.arweave.wallets.getBalance(this.wallet.address)
      return this.arweave.ar.winstonToAr(balance)
    } catch (error) {
      console.error('Failed to get wallet balance:', error)
      return '0'
    }
  }

  // Get wallet address
  getWalletAddress(): string | null {
    if (!this.wallet) return null
    return this.wallet.address
  }

  // Create new wallet
  async createWallet(): Promise<any> {
    try {
      const wallet = await this.arweave.wallets.generate()
      console.log('New Arweave wallet created')
      return wallet
    } catch (error) {
      console.error('Failed to create wallet:', error)
      throw error
    }
  }
}

// Singleton instance
export const harmonyArweave = new HarmonyArweave()
export default harmonyArweave
