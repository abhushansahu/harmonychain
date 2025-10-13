import { BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { 
  TrackRegistered,
  ArtistRegistered,
  TrackUpdated,
  LicenseIssued,
  NFTMinted,
  ProposalCreated,
  VoteCast,
  RevenueDistributed
} from '../generated/MusicRegistry/MusicRegistry'
import { 
  Track,
  Artist,
  Playlist,
  License,
  NFT,
  GovernanceProposal,
  UserVote,
  Analytics,
  Revenue
} from '../generated/schema'

// Track events
export function handleTrackRegistered(event: TrackRegistered): void {
  let track = new Track(event.params.trackId.toString())
  
  track.title = event.params.title
  track.artist = event.params.artist
  track.artistAddress = event.params.artist
  track.ipfsHash = event.params.ipfsHash
  track.genre = event.params.genre
  track.isActive = true
  track.playCount = BigInt.fromI32(0)
  track.createdAt = event.block.timestamp
  track.updatedAt = event.block.timestamp
  
  track.save()
}

export function handleTrackUpdated(event: TrackUpdated): void {
  let track = Track.load(event.params.trackId.toString())
  
  if (track) {
    track.title = event.params.newTitle
    track.genre = event.params.newGenre
    track.updatedAt = event.block.timestamp
    
    track.save()
  }
}

// Artist events
export function handleArtistRegistered(event: ArtistRegistered): void {
  let artist = new Artist(event.params.artist.toHexString())
  
  artist.walletAddress = event.params.artist
  artist.name = event.params.name
  artist.bio = event.params.bio
  artist.profileImageHash = event.params.profileImageHash
  artist.isVerified = false
  artist.totalTracks = BigInt.fromI32(0)
  artist.totalEarnings = BigInt.fromI32(0)
  artist.createdAt = event.block.timestamp
  artist.updatedAt = event.block.timestamp
  
  artist.save()
}

// License events
export function handleLicenseIssued(event: LicenseIssued): void {
  let license = new License(event.params.licenseId.toString())
  
  license.trackId = event.params.trackId
  license.licenseeAddress = event.params.licensee
  license.licenseType = event.params.licenseType.toString()
  license.fee = event.params.fee
  license.issuedAt = event.block.timestamp
  license.isActive = true
  license.createdAt = event.block.timestamp
  
  license.save()
}

// NFT events
export function handleNFTMinted(event: NFTMinted): void {
  let nft = new NFT(event.params.tokenId.toString())
  
  nft.trackId = event.params.trackId
  nft.tokenId = event.params.tokenId.toString()
  nft.contractAddress = event.params.contractAddress
  nft.ownerAddress = event.params.owner
  nft.price = event.params.price
  nft.isListed = event.params.isListed
  nft.createdAt = event.block.timestamp
  nft.updatedAt = event.block.timestamp
  
  nft.save()
}

// Governance events
export function handleProposalCreated(event: ProposalCreated): void {
  let proposal = new GovernanceProposal(event.params.proposalId.toString())
  
  proposal.proposalId = event.params.proposalId
  proposal.proposerAddress = event.params.proposer
  proposal.proposalType = event.params.proposalType.toString()
  proposal.title = event.params.title
  proposal.description = event.params.description
  proposal.votesFor = BigInt.fromI32(0)
  proposal.votesAgainst = BigInt.fromI32(0)
  proposal.startTime = event.block.timestamp
  proposal.endTime = event.params.endTime
  proposal.status = 'active'
  proposal.createdAt = event.block.timestamp
  
  proposal.save()
}

export function handleVoteCast(event: VoteCast): void {
  let vote = new UserVote(
    event.transaction.hash.toHexString() + '-' + event.logIndex.toString()
  )
  
  vote.proposalId = event.params.proposalId
  vote.voterAddress = event.params.voter
  vote.voteWeight = event.params.weight
  vote.support = event.params.support
  vote.reason = event.params.reason
  vote.createdAt = event.block.timestamp
  
  vote.save()
  
  // Update proposal vote counts
  let proposal = GovernanceProposal.load(event.params.proposalId.toString())
  if (proposal) {
    if (event.params.support) {
      proposal.votesFor = proposal.votesFor.plus(event.params.weight)
    } else {
      proposal.votesAgainst = proposal.votesAgainst.plus(event.params.weight)
    }
    proposal.save()
  }
}

// Revenue events
export function handleRevenueDistributed(event: RevenueDistributed): void {
  let revenue = new Revenue(
    event.transaction.hash.toHexString() + '-' + event.logIndex.toString()
  )
  
  revenue.trackId = event.params.trackId
  revenue.amount = event.params.amount
  revenue.currency = 'USDC'
  revenue.source = event.params.source
  revenue.recipientAddress = event.params.recipient
  revenue.transactionHash = event.transaction.hash.toHexString()
  revenue.createdAt = event.block.timestamp
  
  revenue.save()
}
