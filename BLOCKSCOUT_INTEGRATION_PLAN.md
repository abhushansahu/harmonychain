# Blockscout Integration Plan for HarmonyChain

## Overview
This document outlines the implementation plan for integrating Blockscout services into HarmonyChain to create a custom blockchain explorer and enhance user experience, making the platform eligible for Blockscout's $10,000 prize pool.

## Current State
HarmonyChain currently uses:
- **Harmony Explorer**: https://explorer.harmony.one (mainnet)
- **Harmony Testnet Explorer**: https://explorer.pops.one (testnet)
- **Basic Transaction Tracking**: Simple transaction hash display

## Blockscout Integration Points

### 1. Autoscout Self-Service Explorer Launchpad
**Prize**: $3,500 (1st place: $2,000, 2nd place: $1,000, 3rd place: $500)

#### Current Implementation:
```typescript
// Current transaction viewer: apps/web/components/ui/TransactionViewer.tsx
const getExplorerUrl = () => {
  if (chainId === 1337) {
    return `http://localhost:8545/tx/${txHash}`
  } else if (chainId === 1666600000) {
    return `https://explorer.harmony.one/tx/${txHash}`
  } else if (chainId === 1666700000) {
    return `https://explorer.pops.one/tx/${txHash}`
  }
  return `https://explorer.harmony.one/tx/${txHash}`
}
```

#### With Autoscout:
- Deploy custom explorer for HarmonyChain
- Track all music-related transactions
- Provide detailed analytics and insights
- Custom branding and features

#### Technical Implementation:
```typescript
// New service: apps/api/src/services/blockscoutService.ts
export class BlockscoutService {
  private explorerUrl: string
  private apiKey: string

  constructor() {
    this.explorerUrl = process.env.BLOCKSCOUT_EXPLORER_URL
    this.apiKey = process.env.BLOCKSCOUT_API_KEY
  }

  // Get transaction details from custom explorer
  async getTransactionDetails(txHash: string) {
    const response = await fetch(`${this.explorerUrl}/api?module=transaction&action=gettxinfo&txhash=${txHash}&apikey=${this.apiKey}`)
    return response.json()
  }

  // Get contract details
  async getContractDetails(contractAddress: string) {
    const response = await fetch(`${this.explorerUrl}/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${this.apiKey}`)
    return response.json()
  }

  // Get music-specific analytics
  async getMusicAnalytics() {
    const response = await fetch(`${this.explorerUrl}/api?module=stats&action=musictransactions&apikey=${this.apiKey}`)
    return response.json()
  }
}
```

### 2. Blockscout SDK Integration
**Prize**: $3,000 (1st place: $2,000, 2nd place: $1,000)

#### Current Implementation:
```typescript
// Current API client: apps/web/lib/api/client.ts
async getTransactionDetails(txHash: string, chainId: number = 1337): Promise<ApiResponse<any>> {
  try {
    // For local Hardhat network, use local explorer
    if (chainId === 1337) {
      const response = await fetch(`http://localhost:8545/api/transaction/${txHash}`)
      if (response.ok) {
        const data = await response.json()
        return { success: true, data }
      }
    }
    
    // For Harmony networks, use Blockscout
    const blockscoutUrl = chainId === 1666600000 
      ? 'https://explorer.harmony.one/api' 
      : 'https://explorer.pops.one/api'
    
    const response = await fetch(`${blockscoutUrl}?module=transaction&action=gettxinfo&txhash=${txHash}`)
    const data = await response.json()
    
    if (data.status === '1') {
      return { success: true, data: data.result }
    } else {
      throw new Error(data.message || 'Transaction not found')
    }
  } catch (error) {
    console.error('Failed to fetch transaction details:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transaction details'
    }
  }
}
```

#### With Blockscout SDK:
```typescript
// Enhanced implementation with Blockscout SDK
import { BlockscoutSDK } from '@blockscout/sdk'

export class EnhancedApiClient {
  private blockscout: BlockscoutSDK

  constructor() {
    this.blockscout = new BlockscoutSDK({
      apiKey: process.env.BLOCKSCOUT_API_KEY,
      baseUrl: process.env.BLOCKSCOUT_EXPLORER_URL
    })
  }

  async getTransactionDetails(txHash: string, chainId: number) {
    try {
      const transaction = await this.blockscout.getTransaction(txHash)
      
      // Enhanced transaction data with music-specific info
      const enhancedTransaction = {
        ...transaction,
        musicMetadata: await this.getMusicTransactionMetadata(transaction),
        gasOptimization: await this.analyzeGasUsage(transaction),
        relatedTransactions: await this.getRelatedTransactions(txHash)
      }

      return { success: true, data: enhancedTransaction }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Music-specific transaction analysis
  private async getMusicTransactionMetadata(transaction: any) {
    if (transaction.to === process.env.MUSIC_REGISTRY_ADDRESS) {
      return {
        type: 'music-registration',
        trackId: transaction.logs[0]?.topics[1],
        artist: transaction.logs[0]?.topics[2]
      }
    }
    
    if (transaction.to === process.env.NFT_MARKETPLACE_ADDRESS) {
      return {
        type: 'nft-trade',
        tokenId: transaction.logs[0]?.topics[1],
        price: transaction.value
      }
    }

    return null
  }
}
```

### 3. Custom Explorer Features

#### Music-Specific Analytics Dashboard
```typescript
// New component: apps/web/components/explorer/MusicAnalytics.tsx
export function MusicAnalytics() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      const response = await blockscoutService.getMusicAnalytics()
      setAnalytics(response)
    }
    fetchAnalytics()
  }, [])

  return (
    <div className="music-analytics-dashboard">
      <h2>HarmonyChain Music Analytics</h2>
      
      <div className="stats-grid">
        <StatCard title="Total Tracks" value={analytics?.totalTracks} />
        <StatCard title="NFTs Minted" value={analytics?.nftsMinted} />
        <StatCard title="Trading Volume" value={analytics?.tradingVolume} />
        <StatCard title="Active Artists" value={analytics?.activeArtists} />
      </div>

      <div className="charts">
        <TradingVolumeChart data={analytics?.volumeOverTime} />
        <PopularGenresChart data={analytics?.genreDistribution} />
        <TopArtistsChart data={analytics?.topArtists} />
      </div>
    </div>
  )
}
```

#### Real-time Transaction Feed
```typescript
// New component: apps/web/components/explorer/TransactionFeed.tsx
export function TransactionFeed() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const ws = new WebSocket(process.env.BLOCKSCOUT_WS_URL)
    
    ws.onmessage = (event) => {
      const transaction = JSON.parse(event.data)
      if (isMusicTransaction(transaction)) {
        setTransactions(prev => [transaction, ...prev.slice(0, 49)])
      }
    }

    return () => ws.close()
  }, [])

  return (
    <div className="transaction-feed">
      <h3>Live Music Transactions</h3>
      {transactions.map(tx => (
        <TransactionItem key={tx.hash} transaction={tx} />
      ))}
    </div>
  )
}
```

## Integration Steps

### Phase 1: Autoscout Setup
1. Create Blockscout account at https://deploy.blockscout.com/
2. Request credits in ETHGlobal Discord
3. Deploy custom explorer for HarmonyChain
4. Configure custom branding and features

### Phase 2: SDK Integration
1. Install Blockscout SDK
2. Replace existing API calls with SDK
3. Add enhanced transaction analysis
4. Implement music-specific features

### Phase 3: Custom Features
1. Build music analytics dashboard
2. Create real-time transaction feed
3. Add custom transaction categorization
4. Implement advanced search and filtering

### Phase 4: UI Enhancement
1. Integrate explorer into main app
2. Add transaction tracking widgets
3. Create analytics visualization
4. Implement responsive design

## Expected Benefits

### For Users:
- Detailed transaction information
- Real-time transaction tracking
- Music-specific analytics
- Better transaction history

### For Platform:
- Custom branding and identity
- Advanced analytics and insights
- Better user engagement
- Professional appearance

## Prize Eligibility

This integration makes HarmonyChain eligible for:
- **Best use of Autoscout self-service explorer launchpad**: $3,500
- **Best Blockscout SDK Integration**: $3,000
- **Best use of Blockscout MCP**: $3,500

## Technical Requirements

### Dependencies:
```json
{
  "@blockscout/sdk": "^1.0.0",
  "@blockscout/ui": "^1.0.0"
}
```

### Environment Variables:
```bash
BLOCKSCOUT_API_KEY=your-blockscout-api-key
BLOCKSCOUT_EXPLORER_URL=https://your-explorer.blockscout.com
BLOCKSCOUT_WS_URL=wss://your-explorer.blockscout.com/ws
```

### Smart Contract Updates:
- Add custom events for better tracking
- Implement transaction categorization
- Add metadata for analytics

## Timeline
- **Week 1**: Autoscout setup and basic explorer deployment
- **Week 2**: SDK integration and API enhancement
- **Week 3**: Custom features and analytics
- **Week 4**: UI integration and testing

## Success Metrics
- Custom explorer usage
- Transaction tracking accuracy
- User engagement with analytics
- API response times
