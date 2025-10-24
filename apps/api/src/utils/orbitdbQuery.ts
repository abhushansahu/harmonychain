import SimpleDB from '../config/simpleDB'

export class OrbitDBQuery {
  // Search and filter helpers
  static async searchTracks(query: string, filters?: any) {
    const tracks = SimpleDB.search('tracks', query, ['title', 'artist', 'genre'])
    
    let filteredTracks = tracks.filter((track: any) => 
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase()) ||
      track.genre.toLowerCase().includes(query.toLowerCase())
    )

    if (filters) {
      if (filters.genre) {
        filteredTracks = filteredTracks.filter((track: any) => 
          track.genre.toLowerCase() === filters.genre.toLowerCase()
        )
      }
      
      if (filters.artistId) {
        filteredTracks = filteredTracks.filter((track: any) => 
          track.artistId === filters.artistId
        )
      }
      
      if (filters.minPrice !== undefined) {
        filteredTracks = filteredTracks.filter((track: any) => 
          track.price >= filters.minPrice
        )
      }
      
      if (filters.maxPrice !== undefined) {
        filteredTracks = filteredTracks.filter((track: any) => 
          track.price <= filters.maxPrice
        )
      }
      
      if (filters.isStreamable !== undefined) {
        filteredTracks = filteredTracks.filter((track: any) => 
          track.isStreamable === filters.isStreamable
        )
      }
    }

    return filteredTracks
  }

  static async searchArtists(query: string, filters?: any) {
    const artists = SimpleDB.search('artists', query, ['name', 'description'])
    
    let filteredArtists = artists.filter((artist: any) => 
      artist.name.toLowerCase().includes(query.toLowerCase()) ||
      artist.description.toLowerCase().includes(query.toLowerCase())
    )

    if (filters) {
      if (filters.isVerified !== undefined) {
        filteredArtists = filteredArtists.filter((artist: any) => 
          artist.isVerified === filters.isVerified
        )
      }
    }

    return filteredArtists
  }

  static async searchNFTs(query: string, filters?: any) {
    const nfts = SimpleDB.search('nfts', query, ['name', 'description'])
    
    let filteredNFTs = nfts.filter((nft: any) => 
      nft.name?.toLowerCase().includes(query.toLowerCase()) ||
      nft.description?.toLowerCase().includes(query.toLowerCase())
    )

    if (filters) {
      if (filters.owner) {
        filteredNFTs = filteredNFTs.filter((nft: any) => 
          nft.owner === filters.owner
        )
      }
      
      if (filters.isListed !== undefined) {
        filteredNFTs = filteredNFTs.filter((nft: any) => 
          nft.isListed === filters.isListed
        )
      }
      
      if (filters.minPrice !== undefined) {
        filteredNFTs = filteredNFTs.filter((nft: any) => 
          nft.price >= filters.minPrice
        )
      }
      
      if (filters.maxPrice !== undefined) {
        filteredNFTs = filteredNFTs.filter((nft: any) => 
          nft.price <= filters.maxPrice
        )
      }
    }

    return filteredNFTs
  }

  // Pagination helpers
  static paginate(items: any[], page: number = 1, limit: number = 10) {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
    return {
      data: items.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: items.length,
        pages: Math.ceil(items.length / limit),
        hasNext: endIndex < items.length,
        hasPrev: page > 1
      }
    }
  }

  // Sorting helpers
  static sortBy(items: any[], field: string, order: 'asc' | 'desc' = 'asc') {
    return items.sort((a, b) => {
      const aVal = a[field]
      const bVal = b[field]
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
      }
    })
  }

  // Analytics helpers
  static async getTrackAnalytics(trackId: string) {
    const analytics = SimpleDB.get('analytics', `track_${trackId}`)
    return analytics || {
      playCount: 0,
      likes: 0,
      shares: 0,
      earnings: 0
    }
  }

  static async getArtistAnalytics(artistId: string) {
    const analytics = SimpleDB.get('analytics', `artist_${artistId}`)
    return analytics || {
      totalTracks: 0,
      totalPlays: 0,
      totalEarnings: 0,
      followers: 0
    }
  }

  static async getPlatformAnalytics() {
    const analytics = SimpleDB.get('analytics', 'platform')
    return analytics || {
      totalUsers: 0,
      totalTracks: 0,
      totalArtists: 0,
      totalNFTs: 0,
      totalVolume: 0
    }
  }

  // Real-time subscription helpers (simplified for SimpleDB)
  static subscribeToTracks(callback: (tracks: any[]) => void) {
    // SimpleDB doesn't support real-time subscriptions
    // This would need to be implemented with WebSockets or Server-Sent Events
    console.log('Real-time subscriptions not implemented for SimpleDB')
  }

  static subscribeToArtists(callback: (artists: any[]) => void) {
    console.log('Real-time subscriptions not implemented for SimpleDB')
  }

  static subscribeToNFTs(callback: (nfts: any[]) => void) {
    console.log('Real-time subscriptions not implemented for SimpleDB')
  }

  static subscribeToProposals(callback: (proposals: any[]) => void) {
    console.log('Real-time subscriptions not implemented for SimpleDB')
  }

  // Complex queries
  static async getTrendingTracks(limit: number = 10) {
    const tracks = SimpleDB.getAll('tracks')
    return tracks
      .sort((a: any, b: any) => (b.playCount || 0) - (a.playCount || 0))
      .slice(0, limit)
  }

  static async getTopArtists(limit: number = 10) {
    const artists = SimpleDB.getAll('artists')
    return artists
      .sort((a: any, b: any) => (b.totalEarnings || 0) - (a.totalEarnings || 0))
      .slice(0, limit)
  }

  static async getRecentNFTs(limit: number = 10) {
    const nfts = SimpleDB.getAll('nfts')
    return nfts
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }

  static async getActiveProposals() {
    const proposals = SimpleDB.getAll('proposals')
    const now = new Date()
    return proposals.filter((proposal: any) => 
      proposal.status === 'active' && 
      new Date(proposal.endTime) > now
    )
  }

  static async getExpiredProposals() {
    const proposals = SimpleDB.getAll('proposals')
    const now = new Date()
    return proposals.filter((proposal: any) => 
      proposal.status === 'active' && 
      new Date(proposal.endTime) <= now
    )
  }
}

export default OrbitDBQuery
