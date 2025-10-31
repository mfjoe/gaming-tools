# Squad Sharing System

A comprehensive squad sharing system that allows users to save, share, and load EA FC 25 squads via URL encoding.

## Features

- 🔗 **Shareable URLs** - Generate compact URLs with base64 encoding
- 💾 **Local Storage** - Save up to 50 squads locally
- 📱 **Social Sharing** - Share to Twitter, Reddit, Discord, Facebook, WhatsApp
- 📸 **Image Export** - Download squad as shareable image
- 🔍 **QR Codes** - Generate QR codes for mobile sharing
- 🔄 **Import/Export** - Backup and restore squads as JSON
- ⭐ **Favorites** - Mark squads as favorites
- 🆚 **Comparison** - Compare two squads side-by-side

## Installation

Required dependencies:

```bash
npm install qrcode.react html2canvas
```

Optional for better compression:

```bash
npm install lz-string
```

## Usage

### 1. Encoding & Decoding

```typescript
import { encodeSquad, decodeSquad, generateSquadURL } from './services/squadEncoder';

// Encode squad to string
const encoded = encodeSquad(mySquad);
console.log(encoded); // "eyJ2IjoxLCJmIjoiNC00LTIiLCJwI..."

// Decode string back to squad data
const decoded = decodeSquad(encoded);
console.log(decoded.f); // "4-4-2"
console.log(decoded.p); // ["player-id-1", "player-id-2", ...]

// Generate shareable URL
const url = generateSquadURL(mySquad);
// https://gaming-tools.co.uk/squad/eyJ2IjoxLCJmI...
```

### 2. Local Storage

```typescript
import { saveSquad, getSavedSquads, loadSquad } from './services/squadStorage';

// Save squad
const squadId = saveSquad(mySquad, "My Best Squad", thumbnailBase64);

// Load all squads
const allSquads = getSavedSquads();

// Load specific squad
const squad = loadSquad(squadId);

// Update squad
updateSquad(squadId, updatedSquad);

// Delete squad
deleteSquad(squadId);

// Toggle favorite
toggleFavorite(squadId);

// Export all squads
const json = exportSquads();

// Import squads
const count = importSquads(jsonString);
```

### 3. Sharing Hook

```typescript
import { useSquadSharing } from './hooks/useSquadSharing';

function MyComponent() {
  const { generateURL, copyToClipboard, shareToSocial, downloadImage } = useSquadSharing();

  const handleShare = async () => {
    const url = generateURL(mySquad);
    const copied = await copyToClipboard(url);
    
    if (copied) {
      alert('URL copied!');
    }
  };

  const handleShareTwitter = () => {
    shareToSocial('twitter', mySquad);
  };

  const handleDownload = async () => {
    await downloadImage(mySquad, 'my-squad.png');
  };

  return (
    <div>
      <button onClick={handleShare}>Copy URL</button>
      <button onClick={handleShareTwitter}>Share to Twitter</button>
      <button onClick={handleDownload}>Download Image</button>
    </div>
  );
}
```

### 4. Loading Squad from URL

```typescript
import { useSquadFromURL } from './hooks/useSquadFromURL';
import { usePlayerData } from './hooks/usePlayerData';

function SquadBuilder() {
  const { players } = usePlayerData();
  const { squad, isLoading, error, hasSquadInURL } = useSquadFromURL(players);

  if (isLoading) return <div>Loading squad from URL...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (hasSquadInURL && squad) {
    // Squad loaded from URL
    return <div>Loaded: {squad.name}</div>;
  }

  // Normal squad builder
  return <div>Build your squad</div>;
}
```

### 5. Share Modal Component

```typescript
import { ShareSquadModal } from './components/ShareSquadModal';

function App() {
  const [showShare, setShowShare] = useState(false);

  return (
    <>
      <button onClick={() => setShowShare(true)}>Share Squad</button>
      
      <ShareSquadModal
        squad={mySquad}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />
    </>
  );
}
```

### 6. My Squads Component

```typescript
import { MySquads } from './components/MySquads';

function App() {
  const handleLoadSquad = (squad: Squad) => {
    console.log('Loading squad:', squad);
    // Load squad into builder
  };

  return <MySquads onLoadSquad={handleLoadSquad} />;
}
```

### 7. Squad Comparison

```typescript
import { SquadComparison } from './components/SquadComparison';

function App() {
  return (
    <SquadComparison
      squad1={mySquad1}
      squad2={mySquad2}
      squad1Name="Meta Squad"
      squad2Name="Budget Squad"
    />
  );
}
```

## URL Format Examples

### Base64 Encoded (Current Implementation)

```
https://gaming-tools.co.uk/squad/eyJ2IjoxLCJmIjoiNC00LTIiLCJwIjpbInBsYXllci0xIiwicGxheWVyLTIiLCJwbGF5ZXItMyIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsXSwibSI6eyJuIjoibmF0aW9uLTEiLCJsIjoibGVhZ3VlLTEifSwibiI6Ik15IFNxdWFkIiwiYyI6MTcwMTM2MDAwMDAwMH0=
```

### Query Parameter Alternative

```
https://gaming-tools.co.uk/squad-builder?s=eyJ2IjoxLCJmIjoiNC00LTIi...
```

### Short URL (Requires Backend)

```
https://gaming-tools.co.uk/s/abc123
```

## Encoded Squad Structure

```json
{
  "v": 1,
  "f": "4-4-2",
  "p": [
    "player-id-1",
    "player-id-2",
    "player-id-3",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  "s": [
    "sub-player-1",
    null,
    null,
    null,
    null,
    null,
    null
  ],
  "m": {
    "n": "nationality-id",
    "l": "league-id"
  },
  "n": "My Squad Name",
  "c": 1701360000000
}
```

## Social Media Share Examples

### Twitter/X

```
Check out my EA FC 25 squad "Meta Squad"!

⭐ 87 Rating
🔗 28/33 Chemistry

https://gaming-tools.co.uk/squad/eyJ2IjoxLCJmIjoiNC00...
```

### Reddit

```
Title: My EA FC 25 Squad: Meta Squad (87 Rating, 28 Chemistry)
Link: https://gaming-tools.co.uk/squad/eyJ2IjoxLCJmIjoiNC00...
```

### Discord

```
**Meta Squad**
⭐ Rating: 87
🔗 Chemistry: 28/33
https://gaming-tools.co.uk/squad/eyJ2IjoxLCJmIjoiNC00...
```

## Image Export

Generated images are:
- **Dimensions:** 1200x630px (optimized for social media)
- **Format:** PNG
- **Content:** Formation layout, player cards, ratings, chemistry
- **Watermark:** "Created with gaming-tools.co.uk"

```typescript
import { generateSquadImage, downloadSquadImage } from './services/squadImageGenerator';

// Generate as Blob
const blob = await generateSquadImage(mySquad);

// Download
await downloadSquadImage(mySquad, 'my-squad.png');

// Copy to clipboard
await copySquadImageToClipboard(mySquad);
```

## Storage Limits

- **Max Squads:** 50
- **localStorage Limit:** ~5MB (varies by browser)
- **Recommended:** Export squads regularly as backup

```typescript
import { getStorageInfo } from './services/squadStorage';

const info = getStorageInfo();
console.log(`${info.count} of ${info.maxCount} squads (${info.usage}KB used)`);
```

## Testing

```typescript
import { runEncoderTests } from './tests/squadEncoder.test';

// Run all encoding/decoding tests
const results = await runEncoderTests();
console.log(`Passed: ${results.passed}, Failed: ${results.failed}`);
```

## Security Considerations

1. **URL Length:** Keep under 2000 characters for browser compatibility
2. **Validation:** Always validate decoded squad data
3. **Sanitization:** Sanitize squad names before display
4. **localStorage:** Clear old squads if quota exceeded

## Future Enhancements

### Short URL Service (Backend Required)

```typescript
// Store squad on server
async function generateShortURL(squad: Squad): Promise<string> {
  const response = await fetch('/api/squads/shorten', {
    method: 'POST',
    body: JSON.stringify({ squad })
  });
  const { code } = await response.json();
  return `https://gaming-tools.co.uk/s/${code}`;
}
```

### Community Squads

```typescript
interface CommunitySquad {
  id: string;
  name: string;
  author: string;
  squad: Squad;
  likes: number;
  views: number;
  tags: string[];
}

async function publishSquad(squad: Squad): Promise<string> {
  // Upload to community
}

async function getCommunitySquads(
  sort: 'popular' | 'recent'
): Promise<CommunitySquad[]> {
  // Fetch from API
}
```

### Import from Competitors

```typescript
// Import from FUTBIN
async function importFromFUTBIN(url: string): Promise<Squad> {
  // Parse FUTBIN URL
  // Map player IDs
  // Return squad
}

// Import from FUT.GG
async function importFromFUTGG(url: string): Promise<Squad> {
  // Parse FUT.GG URL
}
```

## API Reference

### squadEncoder.ts

- `encodeSquad(squad: Squad): string`
- `decodeSquad(encoded: string): EncodedSquad | null`
- `generateSquadURL(squad: Squad, useQueryParam?: boolean): string`
- `getEncodedSquadFromURL(): string | null`
- `validateEncodedSquad(encoded: string): ValidationResult`
- `getPlayerIdsFromEncoded(encoded: string): string[]`

### squadStorage.ts

- `saveSquad(squad: Squad, name: string, thumbnail?: string): string`
- `getSavedSquads(): SavedSquad[]`
- `loadSquad(id: string): SavedSquad | null`
- `updateSquad(id: string, updates: Partial<SavedSquad>): void`
- `deleteSquad(id: string): void`
- `toggleFavorite(id: string): void`
- `duplicateSquad(id: string): string`
- `renameSquad(id: string, newName: string): void`
- `exportSquads(): string`
- `importSquads(json: string, replace?: boolean): number`
- `sortSquads(squads: SavedSquad[], sortBy: SortOption): SavedSquad[]`
- `searchSquads(query: string): SavedSquad[]`

### squadImageGenerator.ts

- `generateSquadImage(squad: Squad): Promise<Blob>`
- `downloadSquadImage(squad: Squad, filename?: string): Promise<void>`
- `generateSquadThumbnail(squad: Squad): Promise<string>`
- `copySquadImageToClipboard(squad: Squad): Promise<void>`

## License

MIT

## Credits

Built with React, TypeScript, and Tailwind CSS

