---
title: Developer Guide
nav_order: 4
---

# Developer Guide

## Setup
```bash
npm install
npm run dev
```

## Testing & Linting
```bash
npm test
npm run lint
npm run storybook
```

## Conventions
- TypeScript, strict types
- Modular components, shared UI
- Hooks for stateful logic
- Jest + Testing Library

## Environment Variables
Create `.env.local` in `apps/web`:
```
NEXT_PUBLIC_PINATA_API_KEY=...
NEXT_PUBLIC_PINATA_SECRET_KEY=...
NEXT_PUBLIC_API_BASE=https://api.yourdomain.tld
```

## Running Storybook
```bash
cd apps/web
npm run storybook
```

## CI/CD
- GitHub Actions deploys docs on push to `main`
- Add build/test workflows for app as needed

## Code Organization
- Features in `components/<feature>`
- Reusable UI in `components/ui`
- Shared logic in `lib/types`, `lib/utils`, `lib/hooks`

## Troubleshooting
- Node version mismatch → use nvm
- IPFS gateway timeouts → retry or switch gateway
- Test flakiness → ensure mocks and timers are reset per test


