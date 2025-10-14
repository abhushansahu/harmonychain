---
title: Components
nav_order: 3
---

# Components

## Player
- MusicPlayer, AudioControls, ProgressBar, VolumeControl, QueueManager
  - Responsibilities: playback state, controls, visualization, queue
  - Key props: `track`, `onPlay`, `onPause`, `queue`
  - Testing: Jest + Testing Library in `components/player/__tests__`

## Discovery
- SearchInterface, GenreFilter, TrendingTracks, RecommendationEngine, ArtistDiscovery
  - Responsibilities: content discovery and filtering
  - Interactions: shared `Input`, `Button`, `Select`

## Upload
- TrackUpload, MetadataForm, LicenseSettings, IPFSUploadService, BlockchainRegistration
  - Flow: validate → upload → metadata → license → register
  - Errors: size/type validation, network errors, retries

## Dashboard
- ArtistDashboard, AnalyticsView, RevenueTracker, FanEngagement, ContentManager
  - Data: plays, revenue, demographics (mocked adapters)

## NFT
- NFTCreator, NFTMarketplace, PricingStrategy, OwnershipDisplay, TransferManager
  - Flow: tier/custom pricing → metadata → preview → mint

## Licensing
- LicenseManager, PermissionMatrix, RevenueSplit
  - Flow: create license → requests → approve/reject → track revenue

## UI
- Button, Input, Select
  - Consistent styling and accessibility patterns


