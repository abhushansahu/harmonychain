import { Track } from '../../lib/types'

export interface StreamingConfig {
  bufferSize: number
  maxRetries: number
  retryDelay: number
  quality: 'low' | 'medium' | 'high'
  enableCaching: boolean
  cacheSize: number
}

export interface StreamingStats {
  bytesLoaded: number
  bytesTotal: number
  loadTime: number
  bufferHealth: number
  quality: string
  errors: number
}

export interface StreamingEvent {
  type: 'loadstart' | 'progress' | 'canplay' | 'error' | 'ended'
  data?: any
  timestamp: number
}

export class StreamingService {
  private static instance: StreamingService
  private audioContext: AudioContext | null = null
  private audioElement: HTMLAudioElement | null = null
  private currentTrack: Track | null = null
  private config: StreamingConfig
  private stats: StreamingStats
  private eventListeners: Map<string, Function[]> = new Map()
  private retryCount: number = 0
  private isInitialized: boolean = false

  constructor(config: Partial<StreamingConfig> = {}) {
    this.config = {
      bufferSize: 1024 * 1024, // 1MB
      maxRetries: 3,
      retryDelay: 1000,
      quality: 'medium',
      enableCaching: true,
      cacheSize: 50 * 1024 * 1024, // 50MB
      ...config
    }

    this.stats = {
      bytesLoaded: 0,
      bytesTotal: 0,
      loadTime: 0,
      bufferHealth: 100,
      quality: this.config.quality,
      errors: 0
    }
  }

  // Singleton pattern
  public static getInstance(config?: Partial<StreamingConfig>): StreamingService {
    if (!StreamingService.instance) {
      StreamingService.instance = new StreamingService(config)
    }
    return StreamingService.instance
  }

  // Initialize the streaming service
  public async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create audio element
      this.audioElement = new Audio()
      this.audioElement.crossOrigin = 'anonymous'
      this.audioElement.preload = 'metadata'
      
      // Set up event listeners
      this.setupEventListeners()
      
      this.isInitialized = true
      this.emit('initialized')
    } catch (error) {
      this.handleError('Failed to initialize streaming service', error)
      throw error
    }
  }

  // Load a track for streaming
  public async loadTrack(track: Track): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (!this.audioElement) {
      throw new Error('Audio element not initialized')
    }

    try {
      this.currentTrack = track
      this.retryCount = 0
      this.stats.loadTime = Date.now()

      // Build IPFS URL
      const ipfsUrl = this.buildIPFSUrl(track.ipfsHash)
      
      // Set audio source
      this.audioElement.src = ipfsUrl
      this.audioElement.load()

      this.emit('loadstart', { track })
    } catch (error) {
      this.handleError('Failed to load track', error)
      throw error
    }
  }

  // Play the current track
  public async play(): Promise<void> {
    if (!this.audioElement) {
      throw new Error('Audio element not initialized')
    }

    try {
      // Resume audio context if suspended
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume()
      }

      await this.audioElement.play()
      this.emit('play')
    } catch (error) {
      this.handleError('Failed to play track', error)
      throw error
    }
  }

  // Pause the current track
  public pause(): void {
    if (!this.audioElement) {
      throw new Error('Audio element not initialized')
    }

    this.audioElement.pause()
    this.emit('pause')
  }

  // Stop the current track
  public stop(): void {
    if (!this.audioElement) {
      throw new Error('Audio element not initialized')
    }

    this.audioElement.pause()
    this.audioElement.currentTime = 0
    this.emit('stop')
  }

  // Seek to a specific time
  public seek(time: number): void {
    if (!this.audioElement) {
      throw new Error('Audio element not initialized')
    }

    this.audioElement.currentTime = time
    this.emit('seek', { time })
  }

  // Set volume
  public setVolume(volume: number): void {
    if (!this.audioElement) {
      throw new Error('Audio element not initialized')
    }

    this.audioElement.volume = Math.max(0, Math.min(1, volume))
    this.emit('volumechange', { volume })
  }

  // Get current time
  public getCurrentTime(): number {
    return this.audioElement?.currentTime || 0
  }

  // Get duration
  public getDuration(): number {
    return this.audioElement?.duration || 0
  }

  // Get progress percentage
  public getProgress(): number {
    const current = this.getCurrentTime()
    const duration = this.getDuration()
    return duration > 0 ? (current / duration) * 100 : 0
  }

  // Get streaming stats
  public getStats(): StreamingStats {
    return { ...this.stats }
  }

  // Get current track
  public getCurrentTrack(): Track | null {
    return this.currentTrack
  }

  // Check if track is playing
  public isPlaying(): boolean {
    return !!(this.audioElement && !this.audioElement.paused && !this.audioElement.ended)
  }

  // Check if track is paused
  public isPaused(): boolean {
    return !!(this.audioElement && this.audioElement.paused)
  }

  // Check if track is ended
  public isEnded(): boolean {
    return !!(this.audioElement && this.audioElement.ended)
  }

  // Set up event listeners
  private setupEventListeners(): void {
    if (!this.audioElement) return

    // Load events
    this.audioElement.addEventListener('loadstart', () => {
      this.emit('loadstart')
    })

    this.audioElement.addEventListener('loadeddata', () => {
      this.emit('loadeddata')
    })

    this.audioElement.addEventListener('canplay', () => {
      this.emit('canplay')
    })

    this.audioElement.addEventListener('canplaythrough', () => {
      this.emit('canplaythrough')
    })

    // Progress events
    this.audioElement.addEventListener('progress', () => {
      this.updateStats()
      this.emit('progress', this.stats)
    })

    // Playback events
    this.audioElement.addEventListener('play', () => {
      this.emit('play')
    })

    this.audioElement.addEventListener('pause', () => {
      this.emit('pause')
    })

    this.audioElement.addEventListener('ended', () => {
      this.emit('ended')
    })

    // Time update
    this.audioElement.addEventListener('timeupdate', () => {
      this.emit('timeupdate', {
        currentTime: this.getCurrentTime(),
        duration: this.getDuration(),
        progress: this.getProgress()
      })
    })

    // Error handling
    this.audioElement.addEventListener('error', (event) => {
      this.handleError('Audio playback error', event)
    })

    // Buffer events
    this.audioElement.addEventListener('waiting', () => {
      this.emit('waiting')
    })

    this.audioElement.addEventListener('stalled', () => {
      this.emit('stalled')
    })
  }

  // Update streaming stats
  private updateStats(): void {
    if (!this.audioElement) return

    const buffered = this.audioElement.buffered
    if (buffered.length > 0) {
      this.stats.bytesLoaded = buffered.end(buffered.length - 1)
    }

    this.stats.bytesTotal = this.audioElement.duration || 0
    this.stats.bufferHealth = this.calculateBufferHealth()
  }

  // Calculate buffer health
  private calculateBufferHealth(): number {
    if (!this.audioElement) return 0

    const buffered = this.audioElement.buffered
    const currentTime = this.audioElement.currentTime
    const duration = this.audioElement.duration

    if (duration === 0) return 100

    let bufferedTime = 0
    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(i) <= currentTime && buffered.end(i) > currentTime) {
        bufferedTime = buffered.end(i) - currentTime
        break
      }
    }

    return Math.min(100, (bufferedTime / duration) * 100)
  }

  // Build IPFS URL
  private buildIPFSUrl(ipfsHash: string): string {
    // Use a public IPFS gateway
    const gateway = 'https://ipfs.io/ipfs/'
    return `${gateway}${ipfsHash}`
  }

  // Handle errors with retry logic
  private handleError(message: string, error: any): void {
    this.stats.errors++
    this.emit('error', { message, error })

    if (this.retryCount < this.config.maxRetries) {
      this.retryCount++
      setTimeout(() => {
        this.retry()
      }, this.config.retryDelay * this.retryCount)
    } else {
      this.emit('error', { message: 'Max retries exceeded', error })
    }
  }

  // Retry loading
  private async retry(): Promise<void> {
    if (this.currentTrack) {
      try {
        await this.loadTrack(this.currentTrack)
      } catch (error) {
        this.handleError('Retry failed', error)
      }
    }
  }

  // Event system
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  public off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Error in event listener:', error)
        }
      })
    }
  }

  // Cleanup
  public destroy(): void {
    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.src = ''
      this.audioElement = null
    }

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    this.eventListeners.clear()
    this.isInitialized = false
    this.currentTrack = null
  }
}

// Export singleton instance
export const streamingService = StreamingService.getInstance()