# EA FC 25 Data Loading & Caching System

A comprehensive IndexedDB-based data loading and caching system for EA FC 25 player data with offline support, incremental loading, and automatic price updates.

## Features

- 🗄️ **IndexedDB Storage** - Local database with indexed queries
- 📥 **Multi-Source Loading** - API, bundled JSON, or cached data
- ⚡ **Incremental Loading** - Load essential players first, full database in background
- 💰 **Price Updates** - Automatic price refreshes without full reload
- 🔄 **Smart Caching** - 7-day cache with freshness checks
- 📱 **Offline Support** - Works without internet using cached data
- 🎯 **Performance** - Optimized for 20,000+ players

## Installation

```bash
# Install dependencies (already included in main package.json)
npm install
```

## Configuration

Create a `.env` file in the project root:

```env
# API Provider: 'futdb', 'msmc', or 'sofifa'
VITE_API_PROVIDER=msmc

# FutDB API Key (required if using futdb provider)
VITE_FUTDB_API_KEY=your_api_key_here

# Cache duration in days (default: 7)
VITE_CACHE_DURATION_DAYS=7

# Enable automatic price updates
VITE_ENABLE_PRICE_UPDATES=true

# Price update interval in milliseconds (default: 3600000 = 1 hour)
VITE_PRICE_UPDATE_INTERVAL_MS=3600000
```

## Quick Start

### Using the Hook

```tsx
import { usePlayerData } from './hooks/usePlayerData';
import { DataLoadingScreen } from './components/DataLoadingScreen';

function App() {
  const {
    players,
    isLoading,
    isError,
    error,
    progress,
    loadingMessage,
    refetch,
  } = usePlayerData();

  return (
    <>
      <DataLoadingScreen
        isLoading={isLoading}
        isError={isError}
        error={error}
        progress={progress}
        loadingMessage={loadingMessage}
        onRetry={refetch}
      />
      
      {!isLoading && (
        <PlayerSearchModal players={players} />
      )}
    </>
  );
}
```

### Incremental Loading

For better UX, load essential players first:

```tsx
const { players, isLoading } = usePlayerData({ incremental: true });
// Essential players (85+ rated, icons, heroes) load immediately
// Full database loads in background
```

## API Providers

### Option 1: MSMC API (Free, Recommended)

No authentication required. Best for development and testing.

```env
VITE_API_PROVIDER=msmc
```

### Option 2: FutDB API

Requires API key. More reliable for production.

```env
VITE_API_PROVIDER=futdb
VITE_FUTDB_API_KEY=your_key_here
```

Get your API key at: https://futdb.app/

### Option 3: SoFIFA Partner API

Requires partner ID. Check SoFIFA documentation.

```env
VITE_API_PROVIDER=sofifa
VITE_SOFIFA_PARTNER_ID=your_partner_id
```

## Database Structure

### IndexedDB Schema

- **Database**: `eafc25-squad-builder`
- **Version**: 1

#### Object Stores

1. **players** - Main player data
   - Indexes: by-rating, by-name, by-club, by-league, by-nationality, by-position, by-price-ps/xbox/pc

2. **clubs** - Club information

3. **leagues** - League information

4. **nationalities** - Nationality information

5. **metadata** - Cache metadata, version info

## Loading Strategy

### Priority 1: Local Cache (Instant)

- Check IndexedDB for cached data
- Verify cache is fresh (< 7 days old)
- Return cached data if valid

### Priority 2: API Fetch

- Fetch from configured API provider
- Save to IndexedDB
- Update metadata with timestamp

### Priority 3: Bundled JSON (Fallback)

- Load from `/public/data/players.json`
- Show warning: "Using cached data, prices may be outdated"
- Still save to IndexedDB for offline use

## Incremental Loading Stages

### Stage 1: Essential Players (~5 seconds)
- Top 1000 players (85+ rated)
- All Icons and Heroes
- Current TOTW/Special cards
- **Enables basic search immediately**

### Stage 2: Common Players (Background, ~30 seconds)
- 75-84 rated players
- Popular leagues

### Stage 3: Full Database (Background, ~2 minutes)
- All remaining players
- Complete database

## Price Updates

Price updates run automatically in the background:

- **High-rated (85+)**: Every 30-60 minutes
- **Mid-tier (75-84)**: Every 2-4 hours
- **Low-tier (<75)**: Every 24 hours

Prices are updated incrementally without reloading the entire database.

### Manual Price Update

```typescript
import { priceUpdater } from './services/priceUpdater';

await priceUpdater.updatePrices('ps'); // or 'xbox', 'pc'
```

## API Usage Examples

### Direct Database Access

```typescript
import { playerDB } from './db/playerDatabase';

// Get all players
const players = await playerDB.getAllPlayers();

// Get players by rating
const highRated = await playerDB.getPlayersByRating(85, 99);

// Get cache info
const cacheInfo = await playerDB.getCacheInfo();

// Clear cache
await playerDB.clearAllData();
```

### Data Loader

```typescript
import { dataLoader } from './services/dataLoader';

// Load all players
const players = await dataLoader.loadPlayers();

// Load incrementally
const essential = await dataLoader.loadPlayersIncremental();

// Check for updates
const hasUpdates = await dataLoader.checkForUpdates();

// Get cache info
const info = await dataLoader.getCacheInfo();
```

## Testing Utilities

### Generate Mock Data

```typescript
import { generateMockPlayers, seedMockData, resetDatabase } from './utils/mockDataGenerator';

// Generate 1000 mock players
const mockPlayers = generateMockPlayers(1000);

// Seed IndexedDB with mock data
await seedMockData(1000);

// Reset database
await resetDatabase();
```

## Data Loading Screen Component

The `DataLoadingScreen` component shows:
- Progress bar (0-100%)
- Current status message
- Player count (current/total)
- Estimated time remaining
- Error state with retry option
- Skip option (use cached data)

## File Structure

```
src/
├── db/
│   └── playerDatabase.ts          # IndexedDB setup & operations
├── services/
│   ├── apiClient.ts               # API wrapper (FutDB, MSMC, SoFIFA)
│   ├── dataLoader.ts              # Data loading logic
│   └── priceUpdater.ts            # Price update service
├── hooks/
│   └── usePlayerData.ts           # React hook for data loading
├── components/
│   └── DataLoadingScreen.tsx     # Loading UI
└── utils/
    └── mockDataGenerator.ts       # Testing utilities
```

## Performance Optimizations

1. **Bulk Insert** - Players saved in batches of 100
2. **Indexed Queries** - Fast lookups using indexes
3. **Incremental Loading** - Essential players first
4. **Background Updates** - Non-blocking price updates
5. **Cache Validation** - Only fetch when cache is stale

## Error Handling

- **Network Timeout**: Retry 3 times with exponential backoff
- **API Rate Limit**: Queue requests, show warning
- **Corrupted Cache**: Auto-clear and re-fetch
- **No Internet + No Cache**: Show error, load minimal bundled data
- **Partial Data**: Allow usage with warning banner

## Compression (Future Enhancement)

For very large datasets, consider adding compression:

```typescript
import LZString from 'lz-string';

// Compress before storing
const compressed = LZString.compress(JSON.stringify(players));

// Decompress on read
const decompressed = JSON.parse(LZString.decompress(compressed));
```

## Browser Support

- Chrome/Edge 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Mobile browsers ✅

## Troubleshooting

### Cache Not Updating

```typescript
// Force clear cache
await playerDB.clearAllData();
await dataLoader.refetch();
```

### Price Updates Not Working

Check browser console for errors. Ensure:
1. `VITE_ENABLE_PRICE_UPDATES=true` in `.env`
2. Network connection available
3. API endpoint is accessible

### Database Errors

If IndexedDB fails to open:
1. Clear browser storage
2. Try in incognito mode
3. Check browser storage permissions

## Production Checklist

- [ ] Set correct API provider and credentials
- [ ] Test with real API endpoints
- [ ] Verify bundled JSON fallback works
- [ ] Test offline functionality
- [ ] Monitor IndexedDB storage limits
- [ ] Set appropriate cache duration
- [ ] Configure price update intervals
- [ ] Add error monitoring

## License

MIT


