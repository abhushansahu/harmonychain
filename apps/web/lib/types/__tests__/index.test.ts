import { Track, Artist, NFT, License } from '../index'

describe('Track interface', () => {
  it('creates a valid track object', () => {
    const track: Track = {
      id: '1',
      title: 'Test Track',
      artist: 'Test Artist',
      artistAddress: '0x123...',
      artistId: 'artist-1',
      ipfsHash: 'QmTestHash',
      genre: 'Electronic',
      playCount: 1000,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      duration: 180,
      description: 'A test track',
      tags: ['test', 'electronic'],
      isPublished: true,
      isNftMinted: false,
      totalRevenue: 0.1,
      royaltyPercentage: 10
    }

    expect(track.id).toBe('1')
    expect(track.title).toBe('Test Track')
    expect(track.artist).toBe('Test Artist')
    expect(track.artistAddress).toBe('0x123...')
    expect(track.artistId).toBe('artist-1')
    expect(track.ipfsHash).toBe('QmTestHash')
    expect(track.genre).toBe('Electronic')
    expect(track.playCount).toBe(1000)
    expect(track.createdAt).toBeGreaterThan(0)
    expect(track.updatedAt).toBeGreaterThan(0)
    expect(track.duration).toBe(180)
    expect(track.description).toBe('A test track')
    expect(track.tags).toEqual(['test', 'electronic'])
    expect(track.isPublished).toBe(true)
    expect(track.isNftMinted).toBe(false)
    expect(track.totalRevenue).toBe(0.1)
    expect(track.royaltyPercentage).toBe(10)
  })

  it('handles optional fields', () => {
    const track: Track = {
      id: '1',
      title: 'Test Track',
      artist: 'Test Artist',
      artistAddress: '0x123...',
      artistId: 'artist-1',
      ipfsHash: 'QmTestHash',
      genre: 'Electronic',
      playCount: 1000,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      duration: 180,
      description: 'A test track',
      tags: ['test', 'electronic'],
      isPublished: true,
      isNftMinted: false,
      totalRevenue: 0.1,
      royaltyPercentage: 10
    }

    expect(track.coverArt).toBeUndefined()
    expect(track.audioSrc).toBeUndefined()
  })

  it('handles edge case values', () => {
    const track: Track = {
      id: '',
      title: '',
      artist: '',
      artistAddress: '',
      artistId: '',
      ipfsHash: '',
      genre: '',
      playCount: 0,
      createdAt: 0,
      updatedAt: 0,
      duration: 0,
      description: '',
      tags: [],
      isPublished: false,
      isNftMinted: false,
      totalRevenue: 0,
      royaltyPercentage: 0
    }

    expect(track.id).toBe('')
    expect(track.title).toBe('')
    expect(track.artist).toBe('')
    expect(track.artistAddress).toBe('')
    expect(track.artistId).toBe('')
    expect(track.ipfsHash).toBe('')
    expect(track.genre).toBe('')
    expect(track.playCount).toBe(0)
    expect(track.createdAt).toBe(0)
    expect(track.updatedAt).toBe(0)
    expect(track.duration).toBe(0)
    expect(track.description).toBe('')
    expect(track.tags).toEqual([])
    expect(track.isPublished).toBe(false)
    expect(track.isNftMinted).toBe(false)
    expect(track.totalRevenue).toBe(0)
    expect(track.royaltyPercentage).toBe(0)
  })
})

describe('Artist interface', () => {
  it('creates a valid artist object', () => {
    const artist: Artist = {
      id: 'artist-1',
      name: 'Test Artist',
      profilePicture: 'https://example.com/profile.jpg',
      bio: 'A test artist bio',
      walletAddress: '0x123...',
      totalTracks: 10,
      totalRevenue: 1.5,
      isVerified: true,
      socialLinks: {
        twitter: 'https://twitter.com/testartist',
        instagram: 'https://instagram.com/testartist'
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    expect(artist.id).toBe('artist-1')
    expect(artist.name).toBe('Test Artist')
    expect(artist.profilePicture).toBe('https://example.com/profile.jpg')
    expect(artist.bio).toBe('A test artist bio')
    expect(artist.walletAddress).toBe('0x123...')
    expect(artist.totalTracks).toBe(10)
    expect(artist.totalRevenue).toBe(1.5)
    expect(artist.isVerified).toBe(true)
    expect(artist.socialLinks).toEqual({
      twitter: 'https://twitter.com/testartist',
      instagram: 'https://instagram.com/testartist'
    })
    expect(artist.createdAt).toBeGreaterThan(0)
    expect(artist.updatedAt).toBeGreaterThan(0)
  })

  it('handles optional fields', () => {
    const artist: Artist = {
      id: 'artist-1',
      name: 'Test Artist',
      profilePicture: 'https://example.com/profile.jpg',
      bio: 'A test artist bio',
      walletAddress: '0x123...',
      totalTracks: 10,
      totalRevenue: 1.5,
      isVerified: true,
      socialLinks: {
        twitter: 'https://twitter.com/testartist',
        instagram: 'https://instagram.com/testartist'
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    expect(artist.coverImage).toBeUndefined()
  })

  it('handles edge case values', () => {
    const artist: Artist = {
      id: '',
      name: '',
      profilePicture: '',
      bio: '',
      walletAddress: '',
      totalTracks: 0,
      totalRevenue: 0,
      isVerified: false,
      socialLinks: {},
      createdAt: 0,
      updatedAt: 0
    }

    expect(artist.id).toBe('')
    expect(artist.name).toBe('')
    expect(artist.profilePicture).toBe('')
    expect(artist.bio).toBe('')
    expect(artist.walletAddress).toBe('')
    expect(artist.totalTracks).toBe(0)
    expect(artist.totalRevenue).toBe(0)
    expect(artist.isVerified).toBe(false)
    expect(artist.socialLinks).toEqual({})
    expect(artist.createdAt).toBe(0)
    expect(artist.updatedAt).toBe(0)
  })
})

describe('NFT interface', () => {
  it('creates a valid NFT object', () => {
    const nft: NFT = {
      id: 'nft-1',
      name: 'Test NFT',
      description: 'A test NFT',
      imageUrl: 'https://example.com/nft.jpg',
      owner: '0x123...',
      price: 1.5,
      currency: 'ETH',
      tokenId: '1',
      contractAddress: '0x456...',
      isListed: true,
      isAuction: false,
      auctionEndTime: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    expect(nft.id).toBe('nft-1')
    expect(nft.name).toBe('Test NFT')
    expect(nft.description).toBe('A test NFT')
    expect(nft.imageUrl).toBe('https://example.com/nft.jpg')
    expect(nft.owner).toBe('0x123...')
    expect(nft.price).toBe(1.5)
    expect(nft.currency).toBe('ETH')
    expect(nft.tokenId).toBe('1')
    expect(nft.contractAddress).toBe('0x456...')
    expect(nft.isListed).toBe(true)
    expect(nft.isAuction).toBe(false)
    expect(nft.auctionEndTime).toBe(0)
    expect(nft.createdAt).toBeGreaterThan(0)
    expect(nft.updatedAt).toBeGreaterThan(0)
  })

  it('handles optional fields', () => {
    const nft: NFT = {
      id: 'nft-1',
      name: 'Test NFT',
      description: 'A test NFT',
      imageUrl: 'https://example.com/nft.jpg',
      owner: '0x123...',
      price: 1.5,
      currency: 'ETH',
      tokenId: '1',
      contractAddress: '0x456...',
      isListed: true,
      isAuction: false,
      auctionEndTime: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    expect(nft.attributes).toBeUndefined()
    expect(nft.royaltyPercentage).toBeUndefined()
  })

  it('handles edge case values', () => {
    const nft: NFT = {
      id: '',
      name: '',
      description: '',
      imageUrl: '',
      owner: '',
      price: 0,
      currency: '',
      tokenId: '',
      contractAddress: '',
      isListed: false,
      isAuction: false,
      auctionEndTime: 0,
      createdAt: 0,
      updatedAt: 0
    }

    expect(nft.id).toBe('')
    expect(nft.name).toBe('')
    expect(nft.description).toBe('')
    expect(nft.imageUrl).toBe('')
    expect(nft.owner).toBe('')
    expect(nft.price).toBe(0)
    expect(nft.currency).toBe('')
    expect(nft.tokenId).toBe('')
    expect(nft.contractAddress).toBe('')
    expect(nft.isListed).toBe(false)
    expect(nft.isAuction).toBe(false)
    expect(nft.auctionEndTime).toBe(0)
    expect(nft.createdAt).toBe(0)
    expect(nft.updatedAt).toBe(0)
  })
})

describe('License interface', () => {
  it('creates a valid license object', () => {
    const license: License = {
      id: 'license-1',
      name: 'Test License',
      description: 'A test license',
      terms: 'Test terms and conditions',
      fee: 0.1,
      currency: 'ETH',
      duration: 365,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    expect(license.id).toBe('license-1')
    expect(license.name).toBe('Test License')
    expect(license.description).toBe('A test license')
    expect(license.terms).toBe('Test terms and conditions')
    expect(license.fee).toBe(0.1)
    expect(license.currency).toBe('ETH')
    expect(license.duration).toBe(365)
    expect(license.isActive).toBe(true)
    expect(license.createdAt).toBeGreaterThan(0)
    expect(license.updatedAt).toBeGreaterThan(0)
  })

  it('handles optional fields', () => {
    const license: License = {
      id: 'license-1',
      name: 'Test License',
      description: 'A test license',
      terms: 'Test terms and conditions',
      fee: 0.1,
      currency: 'ETH',
      duration: 365,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    expect(license.royaltyPercentage).toBeUndefined()
    expect(license.maxUsage).toBeUndefined()
  })

  it('handles edge case values', () => {
    const license: License = {
      id: '',
      name: '',
      description: '',
      terms: '',
      fee: 0,
      currency: '',
      duration: 0,
      isActive: false,
      createdAt: 0,
      updatedAt: 0
    }

    expect(license.id).toBe('')
    expect(license.name).toBe('')
    expect(license.description).toBe('')
    expect(license.terms).toBe('')
    expect(license.fee).toBe(0)
    expect(license.currency).toBe('')
    expect(license.duration).toBe(0)
    expect(license.isActive).toBe(false)
    expect(license.createdAt).toBe(0)
    expect(license.updatedAt).toBe(0)
  })
})