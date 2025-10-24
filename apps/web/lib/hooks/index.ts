// Custom hooks for HarmonyChain

import { useState, useEffect, useCallback, useRef } from 'react'
import { Track, PlayerState } from '@/lib/types'

// Audio Player Hook
export function useAudioPlayer() {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    queue: [],
    currentIndex: 0,
    repeatMode: 'none',
    shuffleMode: false
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio()
      audioRef.current.preload = 'metadata'
      
      const audio = audioRef.current
      
      const handleLoadedMetadata = () => {
        setPlayerState(prev => ({
          ...prev,
          duration: audio.duration
        }))
      }
      
      const handleTimeUpdate = () => {
        setPlayerState(prev => ({
          ...prev,
          currentTime: audio.currentTime
        }))
      }
      
      const handleEnded = () => {
        handleNext()
      }
      
      const handlePlay = () => {
        setPlayerState(prev => ({ ...prev, isPlaying: true }))
      }
      
      const handlePause = () => {
        setPlayerState(prev => ({ ...prev, isPlaying: false }))
      }
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('play', handlePlay)
      audio.addEventListener('pause', handlePause)
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('play', handlePlay)
        audio.removeEventListener('pause', handlePause)
      }
    }
  }, [])

  const playTrack = useCallback((track: Track) => {
    if (!audioRef.current) return
    
    setPlayerState(prev => ({
      ...prev,
      currentTrack: track,
      currentTime: 0
    }))
    
    // Handle IPFS URLs - use the audioFile if it's already a URL, otherwise construct from IPFS hash
    let audioUrl = track.audioFile
    if (track.ipfsHash && !track.audioFile.startsWith('http')) {
      // If we have an IPFS hash but no URL, construct the URL
      audioUrl = `https://ipfs.io/ipfs/${track.ipfsHash}`
    }
    
    audioRef.current.src = audioUrl
    audioRef.current.play()
  }, [])

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return
    
    if (playerState.isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }, [playerState.isPlaying])

  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return
    
    audioRef.current.currentTime = time
    setPlayerState(prev => ({ ...prev, currentTime: time }))
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return
    
    const clampedVolume = Math.max(0, Math.min(1, volume))
    audioRef.current.volume = clampedVolume
    setPlayerState(prev => ({ ...prev, volume: clampedVolume }))
  }, [])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return
    
    if (playerState.isMuted) {
      audioRef.current.volume = playerState.volume
      setPlayerState(prev => ({ ...prev, isMuted: false }))
    } else {
      audioRef.current.volume = 0
      setPlayerState(prev => ({ ...prev, isMuted: true }))
    }
  }, [playerState.isMuted, playerState.volume])

  const addToQueue = useCallback((track: Track) => {
    setPlayerState(prev => ({
      ...prev,
      queue: [...prev.queue, track]
    }))
  }, [])

  const removeFromQueue = useCallback((index: number) => {
    setPlayerState(prev => ({
      ...prev,
      queue: prev.queue.filter((_, i) => i !== index)
    }))
  }, [])

  const handleNext = useCallback(() => {
    if (playerState.queue.length === 0) return
    
    const nextIndex = (playerState.currentIndex + 1) % playerState.queue.length
    const nextTrack = playerState.queue[nextIndex]
    
    if (nextTrack) {
      setPlayerState(prev => ({ ...prev, currentIndex: nextIndex }))
      playTrack(nextTrack)
    }
  }, [playerState.queue, playerState.currentIndex, playTrack])

  const handlePrevious = useCallback(() => {
    if (playerState.queue.length === 0) return
    
    const prevIndex = playerState.currentIndex === 0 
      ? playerState.queue.length - 1 
      : playerState.currentIndex - 1
    const prevTrack = playerState.queue[prevIndex]
    
    if (prevTrack) {
      setPlayerState(prev => ({ ...prev, currentIndex: prevIndex }))
      playTrack(prevTrack)
    }
  }, [playerState.queue, playerState.currentIndex, playTrack])

  const setRepeatMode = useCallback((mode: 'none' | 'one' | 'all') => {
    setPlayerState(prev => ({ ...prev, repeatMode: mode }))
  }, [])

  const toggleShuffle = useCallback(() => {
    setPlayerState(prev => ({ ...prev, shuffleMode: !prev.shuffleMode }))
  }, [])

  return {
    playerState,
    playTrack,
    togglePlayPause,
    seekTo,
    setVolume,
    toggleMute,
    addToQueue,
    removeFromQueue,
    handleNext,
    handlePrevious,
    setRepeatMode,
    toggleShuffle
  }
}

// Wallet Connection Hook
export function useWallet() {
  const [walletState, setWalletState] = useState({
    isConnected: false,
    address: null as string | null,
    chainId: null as number | null,
    balance: null as string | null
  })

  const connectWallet = useCallback(async () => {
    // This would integrate with wagmi/rainbowkit
    // For now, just mock the connection
    setWalletState({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
      chainId: 1666600000, // Harmony mainnet
      balance: '100.0'
    })
  }, [])

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null
    })
  }, [])

  return {
    walletState,
    connectWallet,
    disconnectWallet
  }
}

// Local Storage Hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// Debounced Value Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Intersection Observer Hook
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      options
    )

    observer.observe(elementRef.current)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, options])

  return isIntersecting
}

// Media Query Hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

// Copy to Clipboard Hook
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }, [])

  return { copied, copy }
}

// Async Hook
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    setData(null)
    setError(null)

    try {
      const result = await asyncFunction()
      setData(result)
      setStatus('success')
    } catch (err) {
      setError(err as E)
      setStatus('error')
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { execute, status, data, error }
}
