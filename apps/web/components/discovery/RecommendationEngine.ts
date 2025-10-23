/**
 * RecommendationEngine provides AI-powered music recommendations
 * Uses collaborative filtering, content-based filtering, and ML algorithms
 */

import { Track, Artist } from '../../lib/types'

export interface Recommendation {
  track: Track
  score: number
  reason: string
  confidence: number
}

export interface UserProfile {
  userId: string
  listeningHistory: Track[]
  favoriteGenres: string[]
  favoriteArtists: string[]
  playCounts: Record<string, number>
  skipRates: Record<string, number>
  lastActive: number
}

export interface RecommendationContext {
  currentTrack?: Track
  recentTracks: Track[]
  userProfile?: UserProfile
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
  mood?: 'happy' | 'sad' | 'energetic' | 'calm' | 'focused'
  activity?: 'working' | 'exercising' | 'relaxing' | 'socializing'
}

export class RecommendationEngine {
  private tracks: Track[] = []
  private artists: Artist[] = []
  private userProfiles: Map<string, UserProfile> = new Map()
  private similarityMatrix: Map<string, Map<string, number>> = new Map()

  constructor() {
    this.initializeEngine()
  }

  private async initializeEngine() {
    // Load initial data
    await this.loadTracks()
    await this.loadArtists()
    await this.buildSimilarityMatrix()
  }

  private async loadTracks(): Promise<void> {
    // Mock implementation - in real app, this would load from your database
    this.tracks = [
      {
        id: '1',
        title: 'Electronic Dreams',
        artist: 'SynthMaster',
        artistAddress: '0x123...',
        artistId: 'artist-1',
        ipfsHash: 'QmHash1',
        genre: 'Electronic',
        playCount: 5000,
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000,
        duration: 180,
        description: 'An electronic masterpiece',
        tags: ['electronic', 'synth', 'ambient'],
        isPublished: true,
        isNftMinted: false,
        totalRevenue: 0,
        royaltyPercentage: 10
      },
      {
        id: '2',
        title: 'Rock Anthem',
        artist: 'GuitarHero',
        artistAddress: '0x456...',
        artistId: 'artist-2',
        ipfsHash: 'QmHash2',
        genre: 'Rock',
        playCount: 3000,
        createdAt: Date.now() - 172800000,
        updatedAt: Date.now() - 172800000,
        duration: 240,
        description: 'A powerful rock anthem',
        tags: ['rock', 'guitar', 'energy'],
        isPublished: true,
        isNftMinted: false,
        totalRevenue: 0,
        royaltyPercentage: 10
      }
      // Add more tracks...
    ]
  }

  private async loadArtists(): Promise<void> {
    // Mock implementation
    this.artists = [
      {
        id: '1',
        walletAddress: '0x123...',
        name: 'SynthMaster',
        bio: 'Electronic music producer',
        avatar: '',
        totalTracks: 25,
        totalPlays: 50000,
        totalRevenue: 1000,
        isVerified: true,
        socialLinks: [],
        createdAt: Date.now() - 86400000
      }
      // Add more artists...
    ]
  }

  private async buildSimilarityMatrix(): Promise<void> {
    // Build track similarity matrix using collaborative filtering
    for (const track1 of this.tracks) {
      const similarities = new Map<string, number>()
      
      for (const track2 of this.tracks) {
        if (track1.id !== track2.id) {
          const similarity = this.calculateTrackSimilarity(track1, track2)
          similarities.set(track2.id, similarity)
        }
      }
      
      this.similarityMatrix.set(track1.id, similarities)
    }
  }

  private calculateTrackSimilarity(track1: Track, track2: Track): number {
    let similarity = 0

    // Genre similarity (40% weight)
    if (track1.genre === track2.genre) {
      similarity += 0.4
    }

    // Artist similarity (30% weight)
    if (track1.artist === track2.artist) {
      similarity += 0.3
    }

    // Play count similarity (20% weight)
    const playCountDiff = Math.abs(track1.playCount - track2.playCount)
    const maxPlayCount = Math.max(track1.playCount, track2.playCount)
    const playCountSimilarity = 1 - (playCountDiff / maxPlayCount)
    similarity += playCountSimilarity * 0.2

    // Recency similarity (10% weight)
    const timeDiff = Math.abs(track1.createdAt - track2.createdAt)
    const maxTime = Math.max(track1.createdAt, track2.createdAt)
    const recencySimilarity = 1 - (timeDiff / maxTime)
    similarity += recencySimilarity * 0.1

    return Math.min(similarity, 1)
  }

  /**
   * Get personalized recommendations for a user
   */
  async getRecommendations(
    context: RecommendationContext,
    limit: number = 10
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []

    // 1. Collaborative Filtering (40% weight)
    const collaborativeRecs = await this.getCollaborativeRecommendations(context, limit)
    recommendations.push(...collaborativeRecs.map(rec => ({
      ...rec,
      score: rec.score * 0.4
    })))

    // 2. Content-Based Filtering (30% weight)
    const contentRecs = await this.getContentBasedRecommendations(context, limit)
    recommendations.push(...contentRecs.map(rec => ({
      ...rec,
      score: rec.score * 0.3
    })))

    // 3. Contextual Recommendations (20% weight)
    const contextualRecs = await this.getContextualRecommendations(context, limit)
    recommendations.push(...contextualRecs.map(rec => ({
      ...rec,
      score: rec.score * 0.2
    })))

    // 4. Trending Recommendations (10% weight)
    const trendingRecs = await this.getTrendingRecommendations(context, limit)
    recommendations.push(...trendingRecs.map(rec => ({
      ...rec,
      score: rec.score * 0.1
    })))

    // Merge and deduplicate recommendations
    const mergedRecs = this.mergeRecommendations(recommendations)
    
    // Sort by score and return top recommendations
    return mergedRecs
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  private async getCollaborativeRecommendations(
    context: RecommendationContext,
    limit: number
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []
    
    if (!context.userProfile) {
      return recommendations
    }

    // Find users with similar taste
    const similarUsers = this.findSimilarUsers(context.userProfile)
    
    for (const similarUser of similarUsers) {
      const userProfile = this.userProfiles.get(similarUser.userId)
      if (!userProfile) continue

      // Get tracks liked by similar users but not by current user
      const userTrackIds = new Set(context.userProfile.listeningHistory.map(t => t.id))
      
      for (const track of userProfile.listeningHistory) {
        if (!userTrackIds.has(track.id)) {
          const score = similarUser.similarity * (userProfile.playCounts[track.id] || 0)
          recommendations.push({
            track,
            score,
            reason: `Liked by users with similar taste`,
            confidence: similarUser.similarity
          })
        }
      }
    }

    return recommendations
  }

  private async getContentBasedRecommendations(
    context: RecommendationContext,
    limit: number
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []
    
    if (!context.currentTrack) {
      return recommendations
    }

    const similarities = this.similarityMatrix.get(context.currentTrack.id)
    if (!similarities) return recommendations

    for (const [trackId, similarity] of similarities) {
      if (similarity > 0.3) { // Only recommend if similarity > 30%
        const track = this.tracks.find(t => t.id === trackId)
        if (track) {
          recommendations.push({
            track,
            score: similarity,
            reason: `Similar to "${context.currentTrack.title}"`,
            confidence: similarity
          })
        }
      }
    }

    return recommendations
  }

  private async getContextualRecommendations(
    context: RecommendationContext,
    limit: number
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []
    
    // Time-based recommendations
    if (context.timeOfDay) {
      const timeBasedTracks = this.getTracksForTimeOfDay(context.timeOfDay)
      recommendations.push(...timeBasedTracks.map(track => ({
        track,
        score: 0.8,
        reason: `Perfect for ${context.timeOfDay}`,
        confidence: 0.7
      })))
    }

    // Mood-based recommendations
    if (context.mood) {
      const moodBasedTracks = this.getTracksForMood(context.mood)
      recommendations.push(...moodBasedTracks.map(track => ({
        track,
        score: 0.7,
        reason: `Matches your ${context.mood} mood`,
        confidence: 0.6
      })))
    }

    // Activity-based recommendations
    if (context.activity) {
      const activityBasedTracks = this.getTracksForActivity(context.activity)
      recommendations.push(...activityBasedTracks.map(track => ({
        track,
        score: 0.6,
        reason: `Great for ${context.activity}`,
        confidence: 0.5
      })))
    }

    return recommendations
  }

  private async getTrendingRecommendations(
    context: RecommendationContext,
    limit: number
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []
    
    // Get trending tracks (high play count, recent)
    const trendingTracks = this.tracks
      .filter(track => track.playCount > 1000)
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, limit)

    for (const track of trendingTracks) {
      recommendations.push({
        track,
        score: 0.5,
        reason: 'Trending right now',
        confidence: 0.4
      })
    }

    return recommendations
  }

  private findSimilarUsers(userProfile: UserProfile): Array<{userId: string, similarity: number}> {
    const similarUsers: Array<{userId: string, similarity: number}> = []
    
    for (const [userId, profile] of this.userProfiles) {
      if (userId === userProfile.userId) continue
      
      const similarity = this.calculateUserSimilarity(userProfile, profile)
      if (similarity > 0.3) {
        similarUsers.push({ userId, similarity })
      }
    }
    
    return similarUsers.sort((a, b) => b.similarity - a.similarity)
  }

  private calculateUserSimilarity(user1: UserProfile, user2: UserProfile): number {
    let similarity = 0
    let factors = 0

    // Genre overlap
    const genreOverlap = user1.favoriteGenres.filter(g => user2.favoriteGenres.includes(g)).length
    const totalGenres = new Set([...user1.favoriteGenres, ...user2.favoriteGenres]).size
    if (totalGenres > 0) {
      similarity += (genreOverlap / totalGenres) * 0.4
      factors++
    }

    // Artist overlap
    const artistOverlap = user1.favoriteArtists.filter(a => user2.favoriteArtists.includes(a)).length
    const totalArtists = new Set([...user1.favoriteArtists, ...user2.favoriteArtists]).size
    if (totalArtists > 0) {
      similarity += (artistOverlap / totalArtists) * 0.3
      factors++
    }

    // Listening pattern similarity
    const commonTracks = user1.listeningHistory.filter(t1 => 
      user2.listeningHistory.some(t2 => t2.id === t1.id)
    ).length
    const totalTracks = new Set([
      ...user1.listeningHistory.map(t => t.id),
      ...user2.listeningHistory.map(t => t.id)
    ]).size
    
    if (totalTracks > 0) {
      similarity += (commonTracks / totalTracks) * 0.3
      factors++
    }

    return factors > 0 ? similarity / factors : 0
  }

  private getTracksForTimeOfDay(timeOfDay: string): Track[] {
    // Mock implementation - in real app, this would use ML models
    switch (timeOfDay) {
      case 'morning':
        return this.tracks.filter(t => t.genre === 'Ambient' || t.genre === 'Chillout')
      case 'afternoon':
        return this.tracks.filter(t => t.genre === 'Pop' || t.genre === 'Rock')
      case 'evening':
        return this.tracks.filter(t => t.genre === 'Electronic' || t.genre === 'Jazz')
      case 'night':
        return this.tracks.filter(t => t.genre === 'Ambient' || t.genre === 'Blues')
      default:
        return []
    }
  }

  private getTracksForMood(mood: string): Track[] {
    // Mock implementation
    switch (mood) {
      case 'happy':
        return this.tracks.filter(t => t.genre === 'Pop' || t.genre === 'Electronic')
      case 'sad':
        return this.tracks.filter(t => t.genre === 'Blues' || t.genre === 'Folk')
      case 'energetic':
        return this.tracks.filter(t => t.genre === 'Rock' || t.genre === 'Electronic')
      case 'calm':
        return this.tracks.filter(t => t.genre === 'Ambient' || t.genre === 'Classical')
      case 'focused':
        return this.tracks.filter(t => t.genre === 'Ambient' || t.genre === 'Instrumental')
      default:
        return []
    }
  }

  private getTracksForActivity(activity: string): Track[] {
    // Mock implementation
    switch (activity) {
      case 'working':
        return this.tracks.filter(t => t.genre === 'Ambient' || t.genre === 'Instrumental')
      case 'exercising':
        return this.tracks.filter(t => t.genre === 'Electronic' || t.genre === 'Rock')
      case 'relaxing':
        return this.tracks.filter(t => t.genre === 'Ambient' || t.genre === 'Jazz')
      case 'socializing':
        return this.tracks.filter(t => t.genre === 'Pop' || t.genre === 'Hip-Hop')
      default:
        return []
    }
  }

  private mergeRecommendations(recommendations: Recommendation[]): Recommendation[] {
    const merged = new Map<string, Recommendation>()
    
    for (const rec of recommendations) {
      const existing = merged.get(rec.track.id)
      if (existing) {
        // Combine scores and reasons
        existing.score += rec.score
        existing.reason += `; ${rec.reason}`
        existing.confidence = Math.max(existing.confidence, rec.confidence)
      } else {
        merged.set(rec.track.id, { ...rec })
      }
    }
    
    return Array.from(merged.values())
  }

  /**
   * Update user profile with new listening data
   */
  updateUserProfile(userId: string, track: Track, action: 'play' | 'skip' | 'like'): void {
    let profile = this.userProfiles.get(userId)
    
    if (!profile) {
      profile = {
        userId,
        listeningHistory: [],
        favoriteGenres: [],
        favoriteArtists: [],
        playCounts: {},
        skipRates: {},
        lastActive: Date.now()
      }
    }

    // Update listening history
    if (!profile.listeningHistory.some(t => t.id === track.id)) {
      profile.listeningHistory.unshift(track)
      if (profile.listeningHistory.length > 100) {
        profile.listeningHistory = profile.listeningHistory.slice(0, 100)
      }
    }

    // Update play counts and skip rates
    if (action === 'play') {
      profile.playCounts[track.id] = (profile.playCounts[track.id] || 0) + 1
    } else if (action === 'skip') {
      profile.skipRates[track.id] = (profile.skipRates[track.id] || 0) + 1
    }

    // Update favorite genres and artists
    if (action === 'like') {
      if (!profile.favoriteGenres.includes(track.genre)) {
        profile.favoriteGenres.push(track.genre)
      }
      if (!profile.favoriteArtists.includes(track.artist)) {
        profile.favoriteArtists.push(track.artist)
      }
    }

    profile.lastActive = Date.now()
    this.userProfiles.set(userId, profile)
  }

  /**
   * Get recommendation explanation for a track
   */
  getRecommendationExplanation(track: Track, context: RecommendationContext): string {
    // This would analyze why this track was recommended
    return `Recommended based on your listening history and similar user preferences`
  }
}
