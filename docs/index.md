---
title: Overview
nav_order: 1
---

# HarmonyChain Documentation

Welcome to the HarmonyChain documentation. This site is designed for both developers and users. It provides end-to-end onboarding, detailed architecture, design decisions, security model, and operational workflows.

## Quick Links
- Architecture: System design, modules, and data flow
- Components: UI and feature modules overview
- Developer Guide: Setup, scripts, testing, CI/CD
- User Guide: Upload, licensing, NFTs, discovery
- Roadmap: What's next and how to contribute

## What is HarmonyChain?
HarmonyChain is a decentralized music platform enabling free listening, fair artist monetization, and composability via licensing and NFTs.

## Current Implementation Status

### ✅ Completed
- **Core Infrastructure**: Monorepo structure with Turborepo
- **Smart Contracts**: MusicRegistry, NFTMarketplace, RoyaltyDistributor, GovernanceDAO (written, not deployed)
- **API Backend**: Express.js with track, artist, NFT, and governance endpoints
- **Frontend**: Next.js with navigation, pages, and layout components
- **Web3 Integration**: Wagmi and RainbowKit configuration
- **TypeScript**: Full type safety across all packages
- **UI Components**: Reusable components (Button, Input, Card, Modal)
- **Music Player**: HTML5 audio player with controls and queue management
- **Discovery**: Search interface, genre filters, and trending tracks
- **Upload System**: File upload, metadata forms, and license settings
- **Artist Dashboard**: Analytics, revenue tracking, and content management
- **NFT Marketplace**: NFT creation, marketplace, and ownership display
- **Licensing**: License management, permission matrix, and revenue splitting

### 🚧 In Development / Needs Configuration
- **IPFS Integration**: Mock mode working, real IPFS requires API keys
- **Blockchain Integration**: Smart contracts ready but need deployment
- **Database**: Using JSON files with sample data, needs production migration
- **Authentication**: JWT working, SIWE frontend integration needed
- **Real Data**: Currently uses sample data for demonstration

### 📋 Planned
- **Cross-chain Support**: Multi-blockchain compatibility
- **Social Features**: User profiles and social interactions
- **AI Recommendations**: Machine learning-based suggestions
- **Mobile App**: Native mobile applications
- **Real-time Features**: Live updates and notifications

## Principles and Design Goals
- Open access to music (free consumption)
- Fair compensation for modification/usage
- Decentralized-first storage and identity
- Strong DX via TypeScript, testing, and modularity

## System Overview
1. Next.js web app for client UX
2. IPFS for asset storage and retrieval
3. Smart contract layer for registration, NFTs, licensing
4. Shared UI and types for consistency and reuse
5. Comprehensive tests and Storybook for reliability

## Onboarding Paths
- Developers: Start with Developer Guide → Architecture → Components
- Artists/Users: Start with User Guide → Upload & Registration → NFTs & Licensing



