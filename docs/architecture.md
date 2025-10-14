---
title: Architecture
nav_order: 2
---

# Architecture

## Monorepo Layout
```
apps/
  web/                 # Next.js app
    components/        # Feature and UI components
    lib/               # types, utils, hooks
```

## Key Modules
- Player: `components/player/*`
- Discovery: `components/discovery/*`
- Upload: `components/upload/*`
- Dashboard: `components/dashboard/*`
- NFT: `components/nft/*`
- Licensing: `components/licensing/*`

## Shared Libraries
- UI: `components/ui/*`
- Types/Utils/Hooks: `lib/*`

## Data Flow
1. User uploads audio → IPFS via `IPFSUploadService`
2. Metadata + license serialized → IPFS (metadata hash)
3. Registration tx submitted → blockchain (trackId)
4. Discovery pulls trending/top via API adapters (mocked now)
5. Player streams via IPFS gateway

## State Management
- Local component state for UI controls
- Hooks encapsulate stateful logic (e.g., `useAudioPlayer`)

## Error Handling
- Graceful UI states (loading, error, empty)
- Retry/fallback gateways for IPFS

## Performance
- Lazy load heavy components
- Memoization and derived state via hooks

## Security & Privacy
- SIWE for auth (wallet-based)
- License terms enforced via contract flows
- Avoid sensitive data in client logs

## Design Decisions
- TypeScript for type safety and DX
- Shared UI to enforce consistency
- IPFS-first storage for decentralization
- Unit tests to maintain quality over time


