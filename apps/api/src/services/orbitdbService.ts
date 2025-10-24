import SimpleDB from '../config/simpleDB'
import { v4 as uuidv4 } from 'uuid'

export class OrbitDBService {
  // User operations
  static async createUser(userData: any) {
    return SimpleDB.create('users', userData)
  }

  static async getUser(id: string) {
    return SimpleDB.get('users', id)
  }

  static async getUserByWallet(walletAddress: string) {
    const users = SimpleDB.query('users', (user: any) => user.walletAddress === walletAddress)
    return users[0] || null
  }

  static async updateUser(id: string, userData: any) {
    return SimpleDB.update('users', id, userData)
  }

  // Track operations
  static async createTrack(trackData: any) {
    return SimpleDB.create('tracks', trackData)
  }

  static async getTrack(id: string) {
    return SimpleDB.get('tracks', id)
  }

  static async getTracksByArtist(artistId: string) {
    return SimpleDB.query('tracks', (track: any) => track.artistId === artistId)
  }

  static async getAllTracks() {
    return SimpleDB.getAll('tracks')
  }

  static async updateTrack(id: string, trackData: any) {
    return SimpleDB.update('tracks', id, trackData)
  }

  // Artist operations
  static async createArtist(artistData: any) {
    return SimpleDB.create('artists', artistData)
  }

  static async getArtist(id: string) {
    return SimpleDB.get('artists', id)
  }

  static async getArtistByWallet(walletAddress: string) {
    const artists = SimpleDB.query('artists', (artist: any) => artist.walletAddress === walletAddress)
    return artists[0] || null
  }

  static async getAllArtists() {
    return SimpleDB.getAll('artists')
  }

  static async updateArtist(id: string, artistData: any) {
    return SimpleDB.update('artists', id, artistData)
  }

  // NFT operations
  static async createNFT(nftData: any) {
    return SimpleDB.create('nfts', nftData)
  }

  static async getNFT(id: string) {
    return SimpleDB.get('nfts', id)
  }

  static async getNFTsByOwner(owner: string) {
    return SimpleDB.query('nfts', (nft: any) => nft.owner === owner)
  }

  static async getAllNFTs() {
    return SimpleDB.getAll('nfts')
  }

  static async updateNFT(id: string, nftData: any) {
    return SimpleDB.update('nfts', id, nftData)
  }

  // Playlist operations
  static async createPlaylist(playlistData: any) {
    return SimpleDB.create('playlists', playlistData)
  }

  static async getPlaylist(id: string) {
    return SimpleDB.get('playlists', id)
  }

  static async getPlaylistsByOwner(ownerId: string) {
    return SimpleDB.query('playlists', (playlist: any) => playlist.ownerId === ownerId)
  }

  static async getAllPlaylists() {
    return SimpleDB.getAll('playlists')
  }

  // License operations
  static async createLicense(licenseData: any) {
    return SimpleDB.create('licenses', licenseData)
  }

  static async getLicense(id: string) {
    return SimpleDB.get('licenses', id)
  }

  static async getLicensesByTrack(trackId: string) {
    return SimpleDB.query('licenses', (license: any) => license.trackId === trackId)
  }

  // Governance operations
  static async createProposal(proposalData: any) {
    return SimpleDB.create('proposals', proposalData)
  }

  static async getProposal(id: string) {
    return SimpleDB.get('proposals', id)
  }

  static async getAllProposals() {
    return SimpleDB.getAll('proposals')
  }

  static async createVote(voteData: any) {
    return SimpleDB.create('votes', voteData)
  }

  static async getVotesByProposal(proposalId: string) {
    return SimpleDB.query('votes', (vote: any) => vote.proposalId === proposalId)
  }

  // Transaction operations
  static async createTransaction(transactionData: any) {
    return SimpleDB.create('transactions', transactionData)
  }

  static async getTransaction(id: string) {
    return SimpleDB.get('transactions', id)
  }

  static async getTransactionsByAddress(address: string) {
    return SimpleDB.query('transactions', (tx: any) => 
      tx.fromAddress === address || tx.toAddress === address
    )
  }

  // Analytics operations
  static async updateAnalytics(type: string, data: any) {
    const analytics = SimpleDB.get('analytics', type) || {}
    const updatedAnalytics = {
      ...analytics,
      ...data,
      updatedAt: new Date().toISOString()
    }
    SimpleDB.update('analytics', type, updatedAnalytics)
    return updatedAnalytics
  }

  static async getAnalytics(type: string) {
    return SimpleDB.get('analytics', type)
  }
}

export default OrbitDBService
