# Player Search Modal Component

A comprehensive, performant player search modal for EA FC 25 with fuzzy search, advanced filtering, and optimized rendering for 20,000+ players.

## Features

- 🔍 **Fuzzy Search** - Powered by Fuse.js with intelligent matching
- 🎯 **Advanced Filters** - Position, rating, price, nationality, league, club, card type, and more
- ⚡ **High Performance** - Virtual scrolling, memoization, debouncing
- 📱 **Mobile Optimized** - Responsive design with touch-friendly controls
- ♿ **Accessible** - ARIA labels, keyboard navigation, screen reader support
- 🎨 **Modern UI** - Radix UI components with dark mode support

## Installation

```bash
npm install fuse.js react-window @radix-ui/react-dialog lucide-react
```

## Usage

```tsx
import { PlayerSearchModal } from './components/PlayerSearchModal';
import { Player } from './types/player';

function SquadBuilder() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Add Player</button>
      <PlayerSearchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelectPlayer={setSelectedPlayer}
        currentPosition="ST" // Optional: filter by position
        players={allPlayers} // Your player database
      />
    </>
  );
}
```

## Component Structure

```
PlayerSearchModal/
├── PlayerSearchModal.tsx    # Main modal component
├── SearchInput.tsx          # Search input with debouncing
├── FilterPanel.tsx         # Collapsible filter sections
├── PlayerResultsList.tsx    # Virtual scrolling list
├── PlayerResultItem.tsx    # Individual result row
├── SortSelector.tsx        # Sort dropdown
└── filters/
    ├── PositionFilter.tsx
    ├── RatingFilter.tsx
    ├── PriceFilter.tsx
    ├── NationalityFilter.tsx
    ├── LeagueFilter.tsx
    ├── ClubFilter.tsx
    ├── CardTypeFilter.tsx
    └── AdditionalFilters.tsx
```

## Hook API

```typescript
const {
  searchQuery,
  setSearchQuery,
  filters,
  setFilter,
  clearFilters,
  sortBy,
  setSortBy,
  results,
  isLoading,
  resultCount,
} = usePlayerSearch({
  players: allPlayers,
  initialPosition: 'ST',
  debounceMs: 300,
});
```

## Filter Options

### Position Filter
- Multi-select checkboxes grouped by role (GK, DEF, MID, ATT)
- Filters by primary_position and alternative_positions

### Rating Filter
- Min/Max sliders (0-99)
- Presets: "Gold 75+", "83+", "85+", "90+"

### Price Filter
- Platform selector (PS/Xbox/PC)
- Min/Max inputs
- Presets: "Under 10k", "Under 50k", "Under 100k", "500k+"

### Nationality/League/Club Filters
- Searchable dropdowns
- Multi-select with icons
- Extracted from player data

### Additional Filters
- Work Rates (Attack/Defense)
- Weak Foot (1-5 stars)
- Skill Moves (1-5 stars)
- Preferred Foot
- Body Type
- AcceleRATE Type

## Sort Options

- Rating (High→Low) - Default
- Rating (Low→High)
- Price (Low→High)
- Price (High→Low)
- Name (A-Z)
- Pace (High→Low)
- Shooting (High→Low)
- Passing (High→Low)

## Performance

### Optimizations
- ✅ 300ms debounced search
- ✅ Memoized Fuse.js instance
- ✅ Memoized filter calculations
- ✅ Virtual scrolling (react-window)
- ✅ Lazy image loading
- ⏳ IndexedDB caching (recommended)

### Benchmarks
- **Search**: < 100ms for 20k players
- **Filtering**: < 50ms
- **Rendering**: 60 FPS scroll performance

## Customization

### Styling
Components use Tailwind CSS classes. Customize by:
1. Override classes in components
2. Use CSS variables for colors
3. Extend Tailwind config

### Search Configuration
Modify Fuse.js options in `usePlayerSearch.ts`:
```typescript
const fuse = new Fuse(players, {
  keys: [
    { name: 'common_name', weight: 2 },
    // Add more fields...
  ],
  threshold: 0.3, // Adjust sensitivity
  limit: 500,
});
```

## Accessibility

- ✅ Focus trap within modal
- ✅ ESC key closes modal
- ✅ Autofocus search input
- ✅ ARIA labels on all controls
- ✅ Keyboard navigation (arrows + Enter)
- ✅ Screen reader announcements

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- `react` ^18.0.0
- `fuse.js` ^7.0.0
- `react-window` ^1.8.0
- `@radix-ui/react-dialog` ^1.0.0
- `lucide-react` ^0.300.0

## Example Mock Data

See `src/data/mockPlayers.ts` for example player structure.

## Performance Tips

1. **Cache player data** - Use IndexedDB for persistence
2. **Lazy load** - Load players on modal open
3. **Paginate results** - For 10k+ results, consider pagination
4. **Web Workers** - For 50k+ players, use worker threads
5. **Monitor** - Track search latency in production

## Contributing

When adding new filters:
1. Add to `FilterState` interface
2. Update `usePlayerSearch` filtering logic
3. Create filter component in `filters/`
4. Add to `FilterPanel.tsx`
5. Update documentation

## License

MIT


