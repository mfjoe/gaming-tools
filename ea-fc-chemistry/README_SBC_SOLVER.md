# SBC Solver - Intelligent Squad Building Challenge Optimizer

An intelligent SBC solver that minimizes cost while meeting all requirements, with the critical advantage of using only 11 players (no bench waste like EA's companion app).

## Features

- 🎯 **Smart Optimization** - Minimizes cost while meeting all requirements
- ⚡ **No Bench Waste** - Only uses exactly 11 players (starting XI)
- 💰 **Cost Minimization** - Prioritizes untradeable fodder and cheapest options
- 🧮 **Rating Optimization** - Efficiently calculates cheapest combinations
- 🔗 **Chemistry Calculation** - Ensures minimum chemistry requirements
- 📊 **Value Assessment** - Warns if SBC costs more than reward value
- 🔄 **Alternative Solutions** - Shows multiple options with trade-offs

## Key Advantage: No Bench Waste

EA's companion app often wastes bench players in SBCs. This solver:

- ✅ Uses exactly 11 players (required for SBC)
- ✅ Compares to EA app: "EA's app would use 18+ players"
- ✅ Validates solution before displaying

## Usage

```tsx
import { SBCHelper } from './components/SBCHelper';
import { usePlayerData } from './hooks/usePlayerData';

function App() {
  const { players } = usePlayerData();
  
  return (
    <SBCHelper 
      allPlayers={players}
      userClub={myClubPlayers} // Optional
    />
  );
}
```

## Solver Algorithm

### Step 1: Filter Eligible Players
- Remove players that don't meet basic requirements
- Check rating, league, club, nation filters
- Ensure players have market prices

### Step 2: Prioritize Untradeable Fodder
- Sort by "fodder value" (rating / price ratio)
- Untradeable cards first
- Duplicates next
- Best value players prioritized

### Step 3: Fill Specific Requirements
- Lock slots for required leagues/clubs/nations
- Fill Icon/Hero requirements
- Handle special card requirements

### Step 4: Optimize Rating
- Calculate minimum total rating needed
- Use cheapest efficient players first
- Fill remaining slots with minimum needed rating
- Upgrade if needed to reach target

### Step 5: Chemistry Optimization
- Build around strong links (same club + nation)
- Use Icons/Heroes as chemistry bridges
- Ensure minimum chemistry met

### Step 6: Cost Calculation
- Separate owned vs market buys
- Calculate actual cost (only market buys)
- Show savings from using club players

### Step 7: Validation
- Verify exactly 11 players (no bench!)
- Check all requirements met
- Validate chemistry and rating

## Example SBC Requirements

```typescript
{
  minRating: 83,
  exactPlayers: 11,
  minChemistry: 24,
  minPlayersFromLeague: [{ league: "Premier League", count: 11 }],
  minSpecialCards: 1 // TOTW required
}
```

## Solver Options

```typescript
{
  userClub: Player[],           // Your available players
  preferUntradeable: true,      // Use untradeables first
  maxBudget: 50000,             // Optional budget limit
  platform: 'ps',               // 'ps' | 'xbox' | 'pc'
  allowPartialSolution: false   // Require full solution
}
```

## Solver Result

```typescript
{
  success: true,
  squad: Player[],              // EXACTLY 11 players
  totalCost: 25000,             // Actual coins needed
  untradeableUsed: 5,           // Untradeable cards used
  marketBuys: Player[],         // Players to buy
  reasoning: string[],          // Explanation
  warnings: string[],           // Any issues
  totalRating: 83,              // Squad rating
  totalChemistry: 28            // Total chemistry
}
```

## Popular SBC Templates

Pre-loaded templates:
- 83+ Rated Squad
- 84+ Rated Squad (1 TOTW)
- 85+ Rated Squad (Min 5 Leagues)
- Premier League 85+ Rated
- 86+ Rated Squad (Max 3 Same Club)
- Icon SBC (82+ Rated)
- And more...

## Cost Breakdown

Shows:
- Club players used (cost: 0 coins)
- Market buys required
- Total market value if buying all
- Actual cost (only market buys)
- Savings from using club

## Value Assessment

Warns about SBC value:
- ✅ "Good value: Costs 15k, estimated return 25k"
- ⚠️ "This SBC costs 45k but reward pack value is ~30k"
- ℹ️ "Costs 20k, estimated return ~22k"

## Alternative Solutions

Generates 3-5 alternatives:
- Cheapest solution
- Best chemistry solution
- Balanced (recommended)
- Use your club (maximizes owned cards)

## Testing

Run test suite:

```typescript
import { testSolver, testBenchValidation } from './tests/sbcSolver.test';

// Run all tests
const results = await testSolver();
console.log(`Passed: ${results.passed}, Failed: ${results.failed}`);

// Test bench validation
const benchTest = testBenchValidation();
console.log('Bench validation:', benchTest ? 'PASSED' : 'FAILED');
```

## Performance

- Optimized for 5,000+ player database
- Greedy algorithm for fast solving
- Early termination when solution found
- Cached solutions for repeated requirements

## File Structure

```
src/
├── services/
│   ├── sbcSolver.ts           # Main solver algorithm
│   ├── ratingOptimizer.ts     # Rating calculations
│   └── chemistryOptimizer.ts  # Chemistry logic
├── components/
│   ├── SBCHelper.tsx          # Main UI
│   ├── ClubInventory.tsx      # Club management
│   └── SBCSolution.tsx        # Result display
├── data/
│   └── popularSBCs.ts         # Common templates
├── hooks/
│   └── useSBCSolver.ts        # React hook
└── tests/
    └── sbcSolver.test.ts       # Test suite
```

## Algorithm Strategy

### Rating Optimization

For an 83 rated squad (total needed: 913):
1. Try to use exactly 11 × 83 rated players
2. If not available, use cheapest combination summing to 913+
3. Example: 10 × 83 + 1 × 84 = 914 ✅
4. Avoid: 9 × 82 + 2 × 86 = 910 ❌

### Chemistry Strategy

1. Group players by club/league/nation
2. Use Icons/Heroes as bridges (always get chemistry)
3. Build chains: Same club + same nation = strong link
4. Ensure minimum chemistry achievable

### Cost Optimization

1. Use untradeable duplicates first (free!)
2. Use high-rated untradeables (save coins)
3. Compare market prices for equivalent players
4. Suggest cheaper alternatives with same rating

## Limitations & Future Enhancements

Current limitations:
- Chemistry optimization is basic (can be improved)
- Alternative solutions limited (can generate more)
- No Web Worker support yet

Future enhancements:
- Advanced chemistry optimization with player swapping
- More alternative solution strategies
- Web Worker for heavy calculations
- Integration with EA API for live prices
- SBC history and tracking

## License

MIT


