import SimpleDB from './config/simpleDB'

/**
 * Seed the database with initial data
 */
export async function seedDatabase() {
  console.log('🌱 Seeding database with initial data...')
  
  try {
    // Initialize SimpleDB
    const db = new SimpleDB()
    
    // Seed users
    const users = [
      {
        id: 'user-1',
        walletAddress: '0x1234567890123456789012345678901234567890',
        username: 'demo_user',
        email: 'demo@harmonychain.com',
        role: 'artist',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    
    for (const user of users) {
      await SimpleDB.create('users', user)
    }
    
    // Seed artists
    const artists = [
      {
        id: 'artist-1',
        walletAddress: '0x1234567890123456789012345678901234567890',
        name: 'Demo Artist',
        bio: 'A demo artist for testing',
        genre: 'Electronic',
        socialLinks: {
          twitter: 'https://twitter.com/demoartist',
          instagram: 'https://instagram.com/demoartist'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    
    for (const artist of artists) {
      await SimpleDB.create('artists', artist)
    }
    
    // Seed tracks
    const tracks = [
      {
        id: 'track-1',
        artistId: 'artist-1',
        title: 'Demo Track',
        description: 'A demo track for testing',
        genre: 'Electronic',
        duration: 180,
        fileHash: 'QmDemoHash123456789',
        metadata: {
          bpm: 120,
          key: 'C Major'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    
    for (const track of tracks) {
      await SimpleDB.create('tracks', track)
    }
    
    console.log('✅ Database seeded successfully')
  } catch (error) {
    console.error('❌ Failed to seed database:', error)
  }
}
