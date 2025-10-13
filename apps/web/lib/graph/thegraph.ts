import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

// GraphQL queries
export const GET_TRACKS = gql`
  query GetTracks($first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
    tracks(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      title
      artist
      artistAddress
      ipfsHash
      genre
      playCount
      createdAt
      isActive
    }
  }
`

export const GET_TRACK = gql`
  query GetTrack($id: ID!) {
    track(id: $id) {
      id
      title
      artist
      artistAddress
      ipfsHash
      genre
      playCount
      createdAt
      isActive
    }
  }
`

export const SEARCH_TRACKS = gql`
  query SearchTracks($search: String!, $first: Int, $skip: Int) {
    tracks(
      where: { 
        title_contains_nocase: $search 
        OR: { 
          artist_contains_nocase: $search 
          OR: { genre_contains_nocase: $search }
        }
      }
      first: $first
      skip: $skip
      orderBy: playCount
      orderDirection: desc
    ) {
      id
      title
      artist
      artistAddress
      ipfsHash
      genre
      playCount
      createdAt
    }
  }
`

export const GET_TRACKS_BY_ARTIST = gql`
  query GetTracksByArtist($artistAddress: String!, $first: Int, $skip: Int) {
    tracks(
      where: { artistAddress: $artistAddress }
      first: $first
      skip: $skip
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      title
      artist
      ipfsHash
      genre
      playCount
      createdAt
    }
  }
`

export const GET_TRACKS_BY_GENRE = gql`
  query GetTracksByGenre($genre: String!, $first: Int, $skip: Int) {
    tracks(
      where: { genre: $genre }
      first: $first
      skip: $skip
      orderBy: playCount
      orderDirection: desc
    ) {
      id
      title
      artist
      artistAddress
      ipfsHash
      genre
      playCount
      createdAt
    }
  }
`

export const GET_ARTISTS = gql`
  query GetArtists($first: Int, $skip: Int) {
    artists(
      first: $first
      skip: $skip
      orderBy: totalTracks
      orderDirection: desc
    ) {
      id
      walletAddress
      name
      totalTracks
      totalEarnings
      isVerified
    }
  }
`

export const GET_ARTIST = gql`
  query GetArtist($walletAddress: String!) {
    artist(id: $walletAddress) {
      id
      walletAddress
      name
      totalTracks
      totalEarnings
      isVerified
    }
  }
`

export const GET_TOP_TRACKS = gql`
  query GetTopTracks($first: Int) {
    tracks(
      first: $first
      orderBy: playCount
      orderDirection: desc
    ) {
      id
      title
      artist
      artistAddress
      ipfsHash
      genre
      playCount
      createdAt
    }
  }
`

export const GET_RECENT_TRACKS = gql`
  query GetRecentTracks($first: Int) {
    tracks(
      first: $first
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      title
      artist
      artistAddress
      ipfsHash
      genre
      playCount
      createdAt
    }
  }
`

// Apollo Client configuration
const createApolloClient = (subgraphUrl: string) => {
  return new ApolloClient({
    uri: subgraphUrl,
    cache: new InMemoryCache({
      typePolicies: {
        Track: {
          keyFields: ['id']
        },
        Artist: {
          keyFields: ['walletAddress']
        }
      }
    }),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all'
      },
      query: {
        errorPolicy: 'all'
      }
    }
  })
}

// Default subgraph URL (replace with your deployed subgraph)
const DEFAULT_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/harmonychain/harmonychain'

class HarmonyGraph {
  private client: ApolloClient<any>
  private subgraphUrl: string

  constructor(subgraphUrl: string = DEFAULT_SUBGRAPH_URL) {
    this.subgraphUrl = subgraphUrl
    this.client = createApolloClient(subgraphUrl)
  }

  // Track queries
  async getTracks(
    first: number = 20,
    skip: number = 0,
    orderBy: string = 'createdAt',
    orderDirection: string = 'desc'
  ) {
    try {
      const { data } = await this.client.query({
        query: GET_TRACKS,
        variables: { first, skip, orderBy, orderDirection }
      })
      return data.tracks || []
    } catch (error) {
      console.error('Failed to get tracks:', error)
      return []
    }
  }

  async getTrack(id: string) {
    try {
      const { data } = await this.client.query({
        query: GET_TRACK,
        variables: { id }
      })
      return data.track || null
    } catch (error) {
      console.error('Failed to get track:', error)
      return null
    }
  }

  async searchTracks(search: string, first: number = 20, skip: number = 0) {
    try {
      const { data } = await this.client.query({
        query: SEARCH_TRACKS,
        variables: { search, first, skip }
      })
      return data.tracks || []
    } catch (error) {
      console.error('Failed to search tracks:', error)
      return []
    }
  }

  async getTracksByArtist(artistAddress: string, first: number = 20, skip: number = 0) {
    try {
      const { data } = await this.client.query({
        query: GET_TRACKS_BY_ARTIST,
        variables: { artistAddress, first, skip }
      })
      return data.tracks || []
    } catch (error) {
      console.error('Failed to get tracks by artist:', error)
      return []
    }
  }

  async getTracksByGenre(genre: string, first: number = 20, skip: number = 0) {
    try {
      const { data } = await this.client.query({
        query: GET_TRACKS_BY_GENRE,
        variables: { genre, first, skip }
      })
      return data.tracks || []
    } catch (error) {
      console.error('Failed to get tracks by genre:', error)
      return []
    }
  }

  async getTopTracks(first: number = 10) {
    try {
      const { data } = await this.client.query({
        query: GET_TOP_TRACKS,
        variables: { first }
      })
      return data.tracks || []
    } catch (error) {
      console.error('Failed to get top tracks:', error)
      return []
    }
  }

  async getRecentTracks(first: number = 10) {
    try {
      const { data } = await this.client.query({
        query: GET_RECENT_TRACKS,
        variables: { first }
      })
      return data.tracks || []
    } catch (error) {
      console.error('Failed to get recent tracks:', error)
      return []
    }
  }

  // Artist queries
  async getArtists(first: number = 20, skip: number = 0) {
    try {
      const { data } = await this.client.query({
        query: GET_ARTISTS,
        variables: { first, skip }
      })
      return data.artists || []
    } catch (error) {
      console.error('Failed to get artists:', error)
      return []
    }
  }

  async getArtist(walletAddress: string) {
    try {
      const { data } = await this.client.query({
        query: GET_ARTIST,
        variables: { walletAddress }
      })
      return data.artist || null
    } catch (error) {
      console.error('Failed to get artist:', error)
      return null
    }
  }

  // Utility methods
  async getTrackCount(): Promise<number> {
    try {
      const { data } = await this.client.query({
        query: gql`
          query GetTrackCount {
            tracks(first: 1) {
              id
            }
          }
        `
      })
      return data.tracks?.length || 0
    } catch (error) {
      console.error('Failed to get track count:', error)
      return 0
    }
  }

  async getArtistCount(): Promise<number> {
    try {
      const { data } = await this.client.query({
        query: gql`
          query GetArtistCount {
            artists(first: 1) {
              id
            }
          }
        `
      })
      return data.artists?.length || 0
    } catch (error) {
      console.error('Failed to get artist count:', error)
      return 0
    }
  }

  // Update subgraph URL
  updateSubgraphUrl(newUrl: string) {
    this.subgraphUrl = newUrl
    this.client = createApolloClient(newUrl)
  }

  // Get current subgraph URL
  getSubgraphUrl(): string {
    return this.subgraphUrl
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const { data } = await this.client.query({
        query: gql`
          query HealthCheck {
            _meta {
              hasIndexingErrors
              block {
                number
                hash
              }
            }
          }
        `
      })
      return !data._meta.hasIndexingErrors
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

// Singleton instance
export const harmonyGraph = new HarmonyGraph()
export default harmonyGraph
