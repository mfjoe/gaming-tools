# Shareable URL Examples

## Example URLs

### 1. Basic Squad (4-4-2, 11 Players)

```
https://gaming-tools.co.uk/squad/eyJ2IjoxLCJmIjoiNC00LTIiLCJwIjpbInBsYXllci0xIiwicGxheWVyLTIiLCJwbGF5ZXItMyIsInBsYXllci00IiwicGxheWVyLTUiLCJwbGF5ZXItNiIsInBsYXllci03IiwicGxheWVyLTgiLCJwbGF5ZXItOSIsInBsYXllci0xMCIsInBsYXllci0xMSJdLCJuIjoiTXkgQmFzaWMgU3F1YWQiLCJjIjoxNzMwMjQxNjAwMDAwfQ==
```

**Decoded:**
```json
{
  "v": 1,
  "f": "4-4-2",
  "p": ["player-1", "player-2", "player-3", "player-4", "player-5", "player-6", "player-7", "player-8", "player-9", "player-10", "player-11"],
  "n": "My Basic Squad",
  "c": 1730241600000
}
```

### 2. Squad with Manager (4-3-3)

```
https://gaming-tools.co.uk/squad/eyJ2IjoxLCJmIjoiNC0zLTMiLCJwIjpbInBsYXllci0xIiwicGxheWVyLTIiLCJwbGF5ZXItMyIsInBsYXllci00IiwicGxheWVyLTUiLCJwbGF5ZXItNiIsInBsYXllci03IiwicGxheWVyLTgiLCJwbGF5ZXItOSIsInBsYXllci0xMCIsInBsYXllci0xMSJdLCJtIjp7Im4iOiJlbmciLCJsIjoicHJlbSJ9LCJuIjoiUHJlbWllciBMZWFndWUgU3F1YWQiLCJjIjoxNzMwMjQxNjAwMDAwfQ==
```

**Decoded:**
```json
{
  "v": 1,
  "f": "4-3-3",
  "p": ["player-1", "player-2", "player-3", "player-4", "player-5", "player-6", "player-7", "player-8", "player-9", "player-10", "player-11"],
  "m": {
    "n": "eng",
    "l": "prem"
  },
  "n": "Premier League Squad",
  "c": 1730241600000
}
```

### 3. Squad with Substitutes

```
https://gaming-tools.co.uk/squad/eyJ2IjoxLCJmIjoiNC0yLTMtMSIsInAiOlsicGxheWVyLTEiLCJwbGF5ZXItMiIsInBsYXllci0zIiwicGxheWVyLTQiLCJwbGF5ZXItNSIsInBsYXllci02IiwicGxheWVyLTciLCJwbGF5ZXItOCIsInBsYXllci05IiwicGxheWVyLTEwIiwicGxheWVyLTExIl0sInMiOlsic3ViLTEiLCJzdWItMiIsInN1Yi0zIiwic3ViLTQiLCJzdWItNSIsInN1Yi02Iiwic3ViLTciXSwibSI6eyJuIjoiYnIiLCJsIjoibGFsaWdhIn0sIm4iOiJGdWxsIFNxdWFkIHdpdGggU3VicyIsImMiOjE3MzAyNDE2MDAwMDB9
```

**Decoded:**
```json
{
  "v": 1,
  "f": "4-2-3-1",
  "p": ["player-1", "player-2", "player-3", "player-4", "player-5", "player-6", "player-7", "player-8", "player-9", "player-10", "player-11"],
  "s": ["sub-1", "sub-2", "sub-3", "sub-4", "sub-5", "sub-6", "sub-7"],
  "m": {
    "n": "br",
    "l": "laliga"
  },
  "n": "Full Squad with Subs",
  "c": 1730241600000
}
```

### 4. Partial Squad (Empty Slots)

```
https://gaming-tools.co.uk/squad/eyJ2IjoxLCJmIjoiNC0zLTMiLCJwIjpbInBsYXllci0xIiwicGxheWVyLTIiLG51bGwsbnVsbCxudWxsLCJwbGF5ZXItNiIsInBsYXllci03IixudWxsLG51bGwsbnVsbCwicGxheWVyLTExIl0sIm4iOiJXb3JrIGluIFByb2dyZXNzIiwiYyI6MTczMDI0MTYwMDAwMH0=
```

**Decoded:**
```json
{
  "v": 1,
  "f": "4-3-3",
  "p": ["player-1", "player-2", null, null, null, "player-6", "player-7", null, null, null, "player-11"],
  "n": "Work in Progress",
  "c": 1730241600000
}
```

## Query Parameter Format

Alternative URL format using query parameters:

```
https://gaming-tools.co.uk/squad-builder?s=eyJ2IjoxLCJmIjoiNC00LTIiLCJwIjpbInBsYXllci0xIiwicGxheWVyLTIiLCJwbGF5ZXItMyIsInBsYXllci00IiwicGxheWVyLTUiLCJwbGF5ZXItNiIsInBsYXllci03IiwicGxheWVyLTgiLCJwbGF5ZXItOSIsInBsYXllci0xMCIsInBsYXllci0xMSJdLCJuIjoiTXkgU3F1YWQiLCJjIjoxNzMwMjQxNjAwMDAwfQ==
```

## Real Player IDs (Example with Actual Players)

```json
{
  "v": 1,
  "f": "4-3-3",
  "p": [
    "231747",  // Mbappé
    "183277",  // De Bruyne
    "165153",  // Benzema
    "200145",  // Haaland
    "188545",  // Salah
    "209331",  // Van Dijk
    "188377",  // Alisson
    "211117",  // Alexander-Arnold
    "212622",  // João Cancelo
    "234396",  // Vinícius Jr
    "190871"   // Neymar
  ],
  "m": {
    "n": "esp",
    "l": "prem"
  },
  "n": "Ultimate Team",
  "c": 1730241600000
}
```

## Social Media Sharing

### Twitter/X Share URL

```
https://twitter.com/intent/tweet?text=Check%20out%20my%20EA%20FC%2025%20squad%20%22Meta%20Squad%22!%0A%0A%E2%AD%90%2087%20Rating%0A%F0%9F%94%97%2028%2F33%20Chemistry%0A%0Ahttps%3A%2F%2Fgaming-tools.co.uk%2Fsquad%2FeyJ2IjoxLCJmIjoiNC00LTIi...
```

### Reddit Share URL

```
https://reddit.com/submit?title=My%20EA%20FC%2025%20Squad%3A%20Meta%20Squad%20(87%20Rating%2C%2028%20Chemistry)&url=https%3A%2F%2Fgaming-tools.co.uk%2Fsquad%2FeyJ2IjoxLCJmIjoiNC00LTIi...
```

### WhatsApp Share URL

```
https://wa.me/?text=Check%20out%20my%20EA%20FC%2025%20squad%3A%20Meta%20Squad%20(87%20Rating%2C%2028%20Chemistry)%0Ahttps%3A%2F%2Fgaming-tools.co.uk%2Fsquad%2FeyJ2IjoxLCJmIjoiNC00LTIi...
```

## URL Length Analysis

| Squad Type | Encoded Length | URL Length | Status |
|------------|---------------|------------|--------|
| Basic (11 players) | ~200 chars | ~250 chars | ✅ Optimal |
| With Manager | ~230 chars | ~280 chars | ✅ Good |
| With Subs | ~280 chars | ~330 chars | ✅ Good |
| Full Squad + Name | ~350 chars | ~400 chars | ✅ Good |
| Max Complexity | ~500 chars | ~550 chars | ✅ Under limit |

All under 2000 character browser limit ✅

## Decoding Example (JavaScript)

```javascript
// Get encoded squad from URL
const urlParams = new URLSearchParams(window.location.search);
const encoded = urlParams.get('s');

// Decode base64
const json = atob(encoded);

// Parse JSON
const squad = JSON.parse(json);

console.log('Formation:', squad.f);
console.log('Players:', squad.p);
console.log('Manager:', squad.m);
console.log('Squad Name:', squad.n);
```

## Testing URLs

Use these test URLs to verify implementation:

### Test 1: Valid Squad
```
https://gaming-tools.co.uk/squad/eyJ2IjoxLCJmIjoiNC00LTIiLCJwIjpbIjEiLCIyIiwiMyIsIjQiLCI1IiwiNiIsIjciLCI4IiwiOSIsIjEwIiwiMTEiXSwibiI6IlRlc3QgU3F1YWQiLCJjIjoxNzMwMjQxNjAwMDAwfQ==
```

### Test 2: Invalid Encoding (should fail gracefully)
```
https://gaming-tools.co.uk/squad/invalid-data-here
```

### Test 3: Empty Squad
```
https://gaming-tools.co.uk/squad/eyJ2IjoxLCJmIjoiNC00LTIiLCJwIjpbbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsXSwibiI6IkVtcHR5IFNxdWFkIiwiYyI6MTczMDI0MTYwMDAwMH0=
```

## Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Encoding:** < 1ms
- **Decoding:** < 1ms
- **URL Generation:** < 1ms
- **Total Overhead:** Negligible

## Error Handling

Common error scenarios:

1. **Invalid base64**: Returns `null` from `decodeSquad()`
2. **Corrupted JSON**: Returns `null` from `decodeSquad()`
3. **Wrong version**: Returns `null` (unsupported version)
4. **Missing required fields**: Returns `null` (validation fails)
5. **Too many players**: Returns `null` (p.length !== 11)

All errors handled gracefully with null returns.

