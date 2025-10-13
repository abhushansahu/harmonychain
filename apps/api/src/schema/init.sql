-- HarmonyChain Database Schema
-- This file contains the initial database schema for the HarmonyChain platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255),
    profile_image_hash VARCHAR(255),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Artists table (extends users)
CREATE TABLE IF NOT EXISTS artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    profile_image_hash VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    total_tracks INTEGER DEFAULT 0,
    total_earnings DECIMAL(18, 8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ipfs_hash VARCHAR(255) NOT NULL UNIQUE,
    artist_address VARCHAR(42) NOT NULL,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    duration INTEGER, -- in seconds
    file_size BIGINT,
    metadata_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    play_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (artist_address) REFERENCES artists(wallet_address)
);

-- Playlists table
CREATE TABLE IF NOT EXISTS playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    ipfs_hash VARCHAR(255),
    track_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Playlist tracks junction table
CREATE TABLE IF NOT EXISTS playlist_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(playlist_id, track_id)
);

-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID REFERENCES tracks(id),
    licensee_address VARCHAR(42) NOT NULL,
    license_type VARCHAR(50) NOT NULL, -- 'personal', 'commercial', 'derivative', 'sampling'
    fee DECIMAL(18, 8) NOT NULL,
    issued_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    purpose TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- NFTs table
CREATE TABLE IF NOT EXISTS nfts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID REFERENCES tracks(id),
    token_id VARCHAR(100) NOT NULL,
    contract_address VARCHAR(42) NOT NULL,
    owner_address VARCHAR(42) NOT NULL,
    price DECIMAL(18, 8),
    is_listed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Governance proposals table
CREATE TABLE IF NOT EXISTS governance_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id INTEGER NOT NULL,
    proposer_address VARCHAR(42) NOT NULL,
    proposal_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    votes_for BIGINT DEFAULT 0,
    votes_against BIGINT DEFAULT 0,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- User votes table
CREATE TABLE IF NOT EXISTS user_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID REFERENCES governance_proposals(id),
    voter_address VARCHAR(42) NOT NULL,
    vote_weight BIGINT NOT NULL,
    support BOOLEAN NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(proposal_id, voter_address)
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID REFERENCES tracks(id),
    event_type VARCHAR(50) NOT NULL, -- 'play', 'pause', 'skip', 'complete'
    user_address VARCHAR(42),
    timestamp TIMESTAMP DEFAULT NOW(),
    metadata JSONB
);

-- Revenue table
CREATE TABLE IF NOT EXISTS revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID REFERENCES tracks(id),
    amount DECIMAL(18, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USDC',
    source VARCHAR(50) NOT NULL, -- 'nft_sale', 'license', 'streaming'
    recipient_address VARCHAR(42) NOT NULL,
    transaction_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(artist_address);
CREATE INDEX IF NOT EXISTS idx_tracks_genre ON tracks(genre);
CREATE INDEX IF NOT EXISTS idx_tracks_active ON tracks(is_active);
CREATE INDEX IF NOT EXISTS idx_tracks_created ON tracks(created_at);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_track ON playlist_tracks(track_id);
CREATE INDEX IF NOT EXISTS idx_licenses_track ON licenses(track_id);
CREATE INDEX IF NOT EXISTS idx_licenses_licensee ON licenses(licensee_address);
CREATE INDEX IF NOT EXISTS idx_nfts_track ON nfts(track_id);
CREATE INDEX IF NOT EXISTS idx_nfts_owner ON nfts(owner_address);
CREATE INDEX IF NOT EXISTS idx_analytics_track ON analytics(track_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_revenue_track ON revenue(track_id);
CREATE INDEX IF NOT EXISTS idx_revenue_recipient ON revenue(recipient_address);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON tracks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON playlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nfts_updated_at BEFORE UPDATE ON nfts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
