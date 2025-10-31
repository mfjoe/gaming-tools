# SBC Solver Algorithm Strategy

This document explains the algorithm strategy behind the SBC solver.

## Overview

The SBC solver is a multi-step optimization algorithm that:
1. Minimizes cost while meeting all requirements
2. Uses exactly 11 players (no bench waste - critical!)
3. Prioritizes untradeable and duplicate cards
4. Optimizes rating and chemistry

## Algorithm Flow

### Phase 1: Filtering

```
Input: All players database (20,000+)
Output: Eligible players based on requirements

Steps:
1. Filter by rating range (if specified)
2. Filter by required clubs/leagues/nations (if specified)
3. Remove players without prices
4. Result: Reduced pool of candidates
```

### Phase 2: Prioritization

```
Input: Eligible players
Output: Sorted by "SBC value"

Sorting Key (in order):
1. isUntradeable? (true first - free!)
2. isDuplicate? (true second - duplicates are fodder)
3. SBC Value = rating / market_price (higher is better)

Rationale:
- Untradeables cost 0 coins
- Duplicates should be used first
- High rating/low price = best fodder value
```

### Phase 3: Requirement Filling

```
For each specific requirement:
  - minPlayersFromLeague: Lock slots for league players
  - minPlayersFromClub: Lock slots for club players
  - minPlayersFromNation: Lock slots for nation players
  - minSpecialCards: Lock slots for Icons/Heroes/TOTW
  - minRatingPlayers: Ensure exact count at rating

Result: Some slots filled, remaining slots calculated
```

### Phase 4: Rating Optimization

```
Target: minRating × 11 = minimum total rating

Strategy:
1. If exact rating players available: Use 11 × targetRating
2. Otherwise: Greedy fill
   - Use cheapest efficient players first
   - Calculate remaining needed: minTotal - currentTotal
   - Fill with minimum needed rating to reach target
   - Upgrade if still short

Example for 83 rated:
- Perfect: 11 × 83 = 913 ✅
- Good: 10 × 83 + 1 × 84 = 914 ✅
- Bad: 9 × 82 + 2 × 86 = 910 ❌ (too low)

Optimization:
- Sort by price/rating efficiency
- Prefer players slightly above minimum (gives buffer)
```

### Phase 5: Chemistry Check

```
Current Implementation:
- Calculate chemistry with current formation
- Validate meets minimum requirement
- If fails: Try different formations (4-4-2, 4-3-3, etc.)

Future Enhancement:
- Swap players for better chemistry
- Build chemistry chains (same club + nation)
- Use Icons/Heroes as bridges
```

### Phase 6: Cost Calculation

```
Breakdown:
1. Separate owned vs market players
2. ownedPlayers = squad.filter(p => p.id in userClub)
3. marketBuys = squad.filter(p => p.id NOT in userClub)
4. actualCost = sum(marketBuys.map(p => p.price))
5. savings = totalMarketValue - actualCost

Key Insight:
- Using owned players = 0 cost
- Only market buys count toward budget
```

### Phase 7: Validation

```
Check:
1. ✅ Exactly 11 players (no bench!)
2. ✅ Rating >= minRating
3. ✅ Chemistry >= minChemistry  
4. ✅ All position requirements met
5. ✅ All club/league/nation requirements met
6. ✅ Special cards count met
7. ✅ Diversity requirements (clubs/leagues/nations) met

If any fail: Add to warnings, try to fix, or mark as partial solution
```

## Critical Feature: No Bench Waste

**EA's companion app flaw:** Often includes bench players in SBCs, wasting valuable cards.

**Our solution:**
```typescript
validateNoBenchWaste(squad: Player[]): {
  if (squad.length > 11) {
    return { valid: false, error: "⚠️ WARNING: Includes bench players!" }
  }
  return { valid: true }
}
```

**Result:** Always exactly 11 players, saving 7+ cards per SBC.

## Cost Optimization Examples

### Example 1: 83 Rated Squad

**Requirements:**
- Min rating: 83
- Min chemistry: 24
- Exact players: 11

**Strategy:**
1. Find cheapest 83 rated players
2. If available: 11 × 83 rated = perfect
3. Cost: ~15,000 coins (market value)
4. If using untradeables: 0-5,000 coins (only buying gaps)

**EA App Approach:**
- Uses 18 players (11 + 7 bench)
- Wastes 7 bench players
- Actual cost: Similar, but wastes cards

**Our Approach:**
- Uses exactly 11 players
- No bench waste
- Saves 7 cards per SBC

### Example 2: Premier League 85 Rated

**Requirements:**
- All Premier League
- 85+ rated
- Min chemistry: 33

**Strategy:**
1. Filter to Premier League only
2. Sort by price/rating efficiency
3. Fill with cheapest 85+ rated PL players
4. Ensure chemistry links (same club helps)

**Cost:** ~65,000 coins (all PL players expensive)

**Optimization Tips:**
- Use high-rated untradeable PL players first
- Look for cheaper alternatives (84 Rodri vs 84 De Bruyne)
- Build around strong links for chemistry

## Rating Calculation Formula

EA's Squad Rating Formula:
```
Squad Rating = floor(sum of all ratings / 11)
```

**Example:**
- Players: [83, 83, 83, 83, 83, 83, 83, 83, 83, 83, 83]
- Sum: 913
- Average: 83.0
- Squad Rating: floor(913 / 11) = 83 ✅

**Important:** Must reach exactly 913+ total for 83 rating.

### Rating Optimization Algorithm

```typescript
function optimizeForRating(target: 83, available: Player[], count: 11) {
  const minTotal = target * 11; // 913
  
  // Strategy 1: Perfect match
  const perfect = available.filter(p => p.rating === target);
  if (perfect.length >= count) {
    return perfect.sortByPrice().take(count);
  }
  
  // Strategy 2: Greedy fill
  const selected = [];
  let currentTotal = 0;
  
  for (const player of available.sortByPriceEfficiency()) {
    if (selected.length >= count) break;
    
    const remaining = count - selected.length;
    const needed = minTotal - currentTotal;
    const minNeeded = ceil(needed / remaining);
    
    if (player.rating >= minNeeded) {
      selected.push(player);
      currentTotal += player.rating;
    }
  }
  
  return selected;
}
```

## Chemistry Calculation

### Chemistry Rules

1. **Position Chemistry:** Player in correct position = +1
2. **Link Chemistry:** Adjacent players with same club/league/nation = +1 per link
3. **Max Chemistry:** 3 per player
4. **Total Chemistry:** Sum of all player chemistry (max 33)

### Example

```
Player: Mbappé (ST)
- In ST position: +1
- Next to Verratti (same club): +1
- Next to Neymar (same club + nation): +1
Total: 3 chemistry ✅
```

### Optimization Strategy

1. Group players by club/nation
2. Place linked players adjacent in formation
3. Use Icons/Heroes as bridges (always get chemistry)
4. Ensure minimum chemistry achievable

## Alternative Solutions

Generate multiple solutions with different trade-offs:

1. **Cheapest:** Minimize cost, may sacrifice chemistry
2. **Best Chemistry:** Maximize chemistry, may cost more
3. **Balanced:** Good cost/chemistry ratio (recommended)
4. **Use Your Club:** Maximize owned cards, minimize market buys

## Performance Optimizations

1. **Early Filtering:** Reduce search space early
2. **Greedy Algorithm:** Fast, good solutions
3. **Caching:** Cache solutions for same requirements
4. **Limit Search:** Only consider players ±5 rating from target

## Limitations & Future Work

**Current Limitations:**
- Chemistry optimization is basic (validates, doesn't optimize)
- Alternative solutions limited
- No player swapping for better chemistry

**Future Enhancements:**
- Advanced chemistry optimization with swapping
- Genetic algorithm for better solutions
- Web Worker for heavy calculations
- Machine learning for price predictions
- Integration with live market data

## Testing

Test suite includes:
- Basic 83 rated squad
- Premier League 85 rated
- Bench waste validation
- Untradeable usage
- Rating edge cases

Run tests:
```typescript
import { testSolver } from './tests/sbcSolver.test';
const results = await testSolver();
```

## Conclusion

The SBC solver uses a greedy optimization approach that:
- ✅ Minimizes cost
- ✅ Uses exactly 11 players (no bench waste)
- ✅ Meets all requirements
- ✅ Prioritizes untradeable cards
- ✅ Provides alternative solutions

The key advantage over EA's app is the **bench waste prevention**, which saves 7+ cards per SBC.


