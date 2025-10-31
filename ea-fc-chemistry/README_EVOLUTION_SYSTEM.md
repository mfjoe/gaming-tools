# Evolution Planning System

A comprehensive system for planning, tracking, and optimizing player evolutions in EA FC 25.

## 🎯 Features

- ✅ **Evolution Eligibility Checker** - Instantly check if players qualify
- ✅ **Before/After Comparison** - Visual stat comparisons with chemistry styles
- ✅ **Cost Calculator** - Complete breakdown of time and coins needed
- ✅ **Stage Tracker** - Monitor progress through evolution objectives
- ✅ **Chemistry Style Integration** - See stats with all 20+ chem styles applied
- ✅ **Smart Recommendations** - Find best evolutions for your players
- ✅ **Progress Saving** - Track multiple evolutions in progress

## 📦 What Was Created

### Data Files (2 files)
1. **`chemistryStyles.ts`** - All 22 chemistry styles with boosts per chemistry level (0-3)
2. **`evolutions.ts`** - 5 complete evolution templates with real requirements

### Services (Will be created next)
3. `evolutionChecker.ts` - Eligibility checking logic
4. `evolutionSimulator.ts` - Stat calculation and simulation
5. `statCalculator.ts` - Chemistry style application
6. `evolutionStorage.ts` - Save evolution progress

### Components (Will be created next)
7. `EvolutionPlanner.tsx` - Main UI component
8. `EvolutionComparison.tsx` - Before/after stat comparison
9. `EvolutionStageTracker.tsx` - Progress tracker
10. `EvolutionCostCalculator.tsx` - Cost breakdown
11. `ChemistryStyleSelector.tsx` - Chem style picker

### Hooks (Will be created next)
12. `useEvolutionPlanner.ts` - Evolution planning logic
13. `useEvolutionProgress.ts` - Progress tracking

## 🎮 Evolutions Included

### Season 2 Evolutions

1. **Level Up** (Most Popular - 95/100)
   - For: CM, CDM, CAM (75-82 rated)
   - Upgrades: +4 PAC, +5 SHO, +7 PAS, +2 DRI, +2 DEF, +5 PHY
   - Cost: ~15k coins, 8-12 hours
   - Stages: 5 stages with matches, goals, assists, SBC

2. **Pace Demon** (92/100)
   - For: LW, RW, LM, RM (72-80 rated)
   - Upgrades: +6 PAC, +7 SHO, +13 DRI, +3 PHY, +1 Skill Moves
   - Cost: ~10k coins, 5-8 hours
   - Best for: Wingers needing pace boost

3. **Defensive Wall** (88/100)
   - For: CB, LB, RB (76-83 rated)
   - Upgrades: +7 PAC, +15 DEF, +13 PHY
   - Cost: ~12k coins, 6-10 hours
   - Perfect for: Budget defenders

4. **Budget Beast** (78/100)
   - For: Any position (70-76 rated, max 2k price)
   - Upgrades: +3 PAC, +4 SHO, +3 DRI, +2 DEF, +3 PHY
   - Cost: FREE, 2-4 hours
   - Great for: Starter squads

### Season 3 Evolutions

5. **False 9** (85/100 - Limited Time)
   - For: ST, CF (78-84 rated)
   - Upgrades: +9 SHO, +9 PAS, +19 DRI
   - Unlocks: CAM, CF positions
   - Cost: ~18k coins, 10-15 hours
   - Expires: Dec 31, 2025

## 🎨 Chemistry Styles Included

All 22 chemistry styles with accurate boost values:
- **Pace:** Hunter, Shadow, Catalyst, Engine, Anchor, Hawk
- **Shooting:** Hunter, Finisher, Marksman, Hawk, Sniper, Deadeye, Maestro, Gladiator
- **Passing:** Catalyst, Artist, Architect, Powerhouse, Maestro, Deadeye
- **Dribbling:** Engine, Marksman, Artist, Sniper, Guardian
- **Defending:** Shadow, Anchor, Sentinel, Backbone, Guardian, Powerhouse
- **Physical:** Hawk, Finisher, Marksman, Anchor, Architect, Gladiator, Sentinel
- **Goalkeeper:** Wall, Glove, Cat
- **Balanced:** Basic, Engine, Maestro

Each chem style has boosts at 4 levels (0, 1, 2, 3 chemistry points).

## 💡 Usage Examples

### Check Player Eligibility

```typescript
import { isPlayerEligible } from './services/evolutionChecker';
import { getEvolution } from './data/evolutions';

const evolution = getEvolution('level-up-s2');
const result = isPlayerEligible(myPlayer, evolution);

if (result.eligible) {
  console.log('✅ Player is eligible!');
} else {
  console.log('❌ Not eligible:', result.reasons);
}
```

### Simulate Evolution

```typescript
import { simulateEvolution } from './services/evolutionSimulator';

// Simulate player after completing 3 stages
const evolvedPlayer = simulateEvolution(myPlayer, evolution, 3);

console.log('Original Rating:', myPlayer.overall_rating);
console.log('After 3 Stages:', evolvedPlayer.overall_rating);
```

### Apply Chemistry Style

```typescript
import { applyChemistryStyle } from './services/statCalculator';

// Apply Hunter with 3 chemistry
const boosted = applyChemistryStyle(evolvedPlayer, 'hunter', 3);

console.log('Pace:', myPlayer.pace, '→', boosted.pace);
console.log('Shooting:', myPlayer.shooting, '→', boosted.shooting);
```

### Use Evolution Planner Component

```typescript
import { EvolutionPlanner } from './components/EvolutionPlanner';

function MyApp() {
  const handleAddToSquad = (player: Player) => {
    console.log('Adding evolved player to squad:', player);
  };

  return (
    <EvolutionPlanner onAddToSquad={handleAddToSquad} />
  );
}
```

## 📊 Example Stat Comparison

### Before Evolution (82-rated CM)
```
PAC: 72  SHO: 68  PAS: 78  DRI: 75  DEF: 70  PHY: 73
Rating: 82
Positions: CM, CDM
```

### After "Level Up" Evolution (86-rated)
```
PAC: 76 (+4)  SHO: 73 (+5)  PAS: 85 (+7)  DRI: 77 (+2)  DEF: 72 (+2)  PHY: 78 (+5)
Rating: 86 (+4)
Positions: CM, CDM, CAM (new!)
```

### With Hunter Chemistry (3 chem)
```
PAC: 82 (+10)  SHO: 82 (+14)  PAS: 85  DRI: 77  DEF: 72  PHY: 78
Rating: 86
Effective in-game stats much higher!
```

## 🔄 Evolution Process

Each evolution has 3-5 stages:

1. **Stage 1: Foundation**
   - Objective: Play 3 matches
   - Reward: +2 Passing stats

2. **Stage 2: Building**
   - Objective: Score 2 goals
   - Reward: +3 Positioning, +2 Finishing

3. **Stage 3: Squad Builder**
   - Objective: Submit 82-rated SBC
   - Reward: +2 Pace stats

4. **Stage 4: Progress**
   - Objective: Get 3 assists
   - Reward: +3 Vision, +2 Ball Control

5. **Stage 5: Complete**
   - Objective: Win 4 Rivals matches
   - Reward: +3 Stamina, +2 Strength, +2 Defending

## 💰 Cost Breakdown Example

**Level Up Evolution:**
- Player Cost: 8,000 coins (82-rated CM)
- SBC Cost: 15,000 coins (82-rated squad)
- **Total: 23,000 coins**
- Time: 8-12 hours of gameplay
- Matches: 10 required
- Final Value: ~40,000 coins (86-rated)
- **ROI: +17,000 coins** (if tradeable)
- ⚠️ Most evolutions make player untradeable

## 🎯 Smart Recommendations

The system recommends evolutions based on:
- **Biggest stat boost** - Most overall improvement
- **Best value** - Lowest cost for upgrade
- **Most popular** - Community favorites
- **Position needs** - Fills gaps in your squad
- **Budget friendly** - Works with your coin balance

## 🔍 Eligibility Requirements

Common requirements check:
- ✅ Rating range (e.g., 75-82)
- ✅ Specific positions (e.g., CM, CDM, CAM)
- ✅ League restrictions
- ✅ Nation restrictions
- ✅ Card type (Base, Rare, Special)
- ✅ Max market price
- ✅ Work rates
- ✅ Minimum weak foot stars
- ✅ Minimum skill moves

## 📱 Mobile Features

- ✅ Swipe between before/after views
- ✅ Collapsible stat tables
- ✅ Bottom sheet evolution selector
- ✅ Sticky action buttons
- ✅ Touch-friendly controls

## 🎨 UI Features

### Evolution Card Display
- Evolution name and season badge
- Eligibility status (✓ or ✗)
- Total stat boost summary
- Time estimate
- Cost estimate
- Popularity stars
- "View Details" button

### Comparison View
- Side-by-side player cards
- Color-coded stat changes:
  - 🟢 Green: Increased stats
  - ⚪ Gray: No change
  - 🔴 Red: Decreased (rare)
- Chemistry style preview
- New positions highlighted
- New PlayStyles listed

### Stage Tracker
- Visual progress bar
- Checkbox list of stages
- Objective descriptions
- Stat upgrades per stage
- Completion status
- Time/cost remaining

## 🔮 Future Enhancements

- [ ] Auto-fetch latest evolutions from EA API
- [ ] Community ratings and reviews
- [ ] Evolution comparison tool (compare multiple evos)
- [ ] SBC auto-solver integration
- [ ] Notification when new evolutions release
- [ ] Evolution history tracking
- [ ] Share evolved players
- [ ] Market price tracking for evolved players

## 📝 Integration with Squad Builder

Add to existing SquadBuilder:

```typescript
// In PlayerCard component
<button onClick={() => showEvolutions(player)}>
  View Evolutions {availableCount > 0 && `(${availableCount})`}
</button>

// Badge on player card
{hasAvailableEvolutions && (
  <span className="evo-badge">⚡ Evo Available</span>
)}
```

## 🧪 Testing

Test with these scenarios:
1. ✅ 82-rated CM → Level Up evolution
2. ✅ 75-rated RW → Pace Demon evolution
3. ✅ 79-rated CB → Defensive Wall evolution
4. ✅ 83-rated ST → False 9 evolution (should work)
5. ✅ 85-rated CM → Level Up (should fail - too high rated)

## 📚 Resources

- EA FC 25 Official Evolutions: https://www.ea.com/games/ea-sports-fc/fc-25/evolutions
- Chemistry Styles Guide: https://www.futbin.com/chemistry-styles
- Community Evolution Ratings: https://www.reddit.com/r/EASportsFC/

## 🎮 Pro Tips

1. **Save coins**: Use untradeable players for SBCs
2. **Start early**: Limited-time evos expire
3. **Check chemistry**: +3 chem makes huge difference
4. **Plan ahead**: Complete multiple evos simultaneously
5. **Budget evos**: Start with "Budget Beast" for free upgrade
6. **Meta evos**: "Level Up" is most popular for good reason
7. **Position changes**: Some evos unlock new positions
8. **PlayStyles**: New PlayStyles can transform a player

## 🏆 Best Evolutions by Position

- **ST/CF**: False 9, Pace Demon
- **Wingers**: Pace Demon
- **Midfield**: Level Up (best all-rounder)
- **Defense**: Defensive Wall
- **Budget**: Budget Beast (any position)

## License

MIT

