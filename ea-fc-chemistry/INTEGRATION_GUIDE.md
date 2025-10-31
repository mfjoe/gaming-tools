# Integration Guide - Complete Application Setup

This guide explains how all the components fit together to create a working EA FC 25 Squad Builder application.

## 📋 Files Created (20 Files)

### ✅ Core Application Files (5 files)
1. **`index.html`** - HTML entry point with meta tags and root div
2. **`src/main.tsx`** - React entry point, initializes analytics and routing
3. **`src/App.tsx`** - Main app with React Router setup
4. **`src/components/Layout.tsx`** - Page layout with navigation
5. **`src/index.css`** - Global styles with Tailwind and custom classes

### ✅ Page Components (6 files)
6. **`src/pages/HomePage.tsx`** - Landing page with features
7. **`src/pages/SquadBuilderPage.tsx`** - Main squad builder page
8. **`src/pages/SBCSolverPage.tsx`** - SBC solver page
9. **`src/pages/EvolutionPlannerPage.tsx`** - Evolution planner page
10. **`src/pages/MySquadsPage.tsx`** - Saved squads management
11. **`src/pages/SharedSquadPage.tsx`** - Shared squad viewer

### ✅ Configuration Files (4 files)
12. **`package.json`** - Dependencies and npm scripts
13. **`vite.config.ts`** - Vite build configuration
14. **`tailwind.config.js`** - Tailwind CSS configuration
15. **`README.md`** - Complete project documentation

---

## 🔌 Integration Steps

### Step 1: Install Dependencies

```bash
cd /Users/josefhare-brown/Desktop/Coding/gaming-tools/ea-fc-chemistry

npm install
```

This installs all required packages from `package.json`:
- React 18 & React Router
- Zustand (state management)
- DND Kit (drag & drop)
- Radix UI (components)
- Fuse.js (fuzzy search)
- Analytics & PWA tools

### Step 2: Connect Existing Components

You mentioned you already have these components. Connect them to the pages:

#### A. Connect SquadBuilder Component

In `src/pages/SquadBuilderPage.tsx`, replace the placeholder:

```typescript
// Remove this line:
const SquadBuilder = React.lazy(() => import('../components/SquadBuilder')...

// Add this import at the top:
import { SquadBuilder } from '../components/SquadBuilder';

// Use directly (remove React.lazy):
<SquadBuilder initialSquad={urlSquad || undefined} />
```

#### B. Connect SBCHelper Component

In `src/pages/SBCSolverPage.tsx`:

```typescript
import { SBCHelper } from '../components/SBCHelper';

// Replace placeholder with:
<SBCHelper />
```

#### C. Connect EvolutionPlanner Component

In `src/pages/EvolutionPlannerPage.tsx`:

```typescript
import { EvolutionPlanner } from '../components/EvolutionPlanner';

// Replace placeholder with:
<EvolutionPlanner />
```

#### D. Connect MySquads Component

In `src/pages/MySquadsPage.tsx`:

```typescript
import { MySquads } from '../components/MySquads';

// Replace placeholder with:
<MySquads />
```

### Step 3: Create Environment File

Create `.env.local` in the project root:

```bash
# Application
VITE_APP_NAME="EA FC 25 Squad Builder"
VITE_APP_URL="https://gaming-tools.co.uk"

# API Configuration
VITE_API_BASE_URL="https://api.gaming-tools.co.uk"
VITE_API_PROVIDER="msmc"

# Analytics (Get from https://analytics.google.com)
VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
VITE_ENABLE_ANALYTICS="true"

# Features
VITE_CACHE_DURATION_DAYS="7"
VITE_MAX_SAVED_SQUADS="50"
```

### Step 4: Verify File Structure

Ensure your existing files are in the correct locations:

```
src/
├── components/
│   ├── SquadBuilder.tsx          ← Your existing component
│   ├── PitchView.tsx             ← Your existing component
│   ├── PlayerCard.tsx            ← Your existing component
│   ├── PlayerSearchModal.tsx     ← Your existing component
│   ├── ShareSquadModal.tsx       ← Your existing component
│   ├── MySquads.tsx              ← Your existing component
│   ├── SBCHelper.tsx             ← Your existing component
│   ├── EvolutionPlanner.tsx      ← Your existing component
│   ├── DataLoadingScreen.tsx     ← Your existing component
│   └── ... (new Layout.tsx, SEO.tsx, etc.)
│
├── services/
│   ├── squadEncoder.ts           ← Your existing service
│   ├── squadStorage.ts           ← Your existing service
│   ├── sbcSolver.ts              ← Your existing service
│   ├── evolutionChecker.ts       ← Your existing service
│   ├── statCalculator.ts         ← Your existing service
│   └── ... (new analytics.ts, etc.)
│
├── data/
│   ├── chemistryStyles.ts        ← Your existing data
│   ├── evolutions.ts             ← Your existing data
│   ├── formations.ts             ← Your existing data
│   └── popularSBCs.ts            ← Your existing data
│
├── hooks/
│   ├── usePlayerData.ts          ← Your existing hook
│   ├── usePlayerSearch.ts        ← Your existing hook
│   ├── useSavedSquads.ts         ← Your existing hook
│   ├── useSquadFromURL.ts        ← Your existing hook
│   └── ... (new useMobileDetect.ts, etc.)
│
└── chemistryEngine.js            ← Your existing engine
```

### Step 5: Run Development Server

```bash
npm run dev
```

This should:
- Start Vite dev server on http://localhost:3000
- Open your browser automatically
- Show the HomePage with navigation

### Step 6: Test Navigation Flow

1. **HomePage** (/)
   - Click "Start Building" → Goes to Squad Builder
   - Click "Solve SBCs" → Goes to SBC Solver

2. **Squad Builder** (/squad-builder)
   - Should load player data with progress indicator
   - Should show formation and player slots
   - Should allow searching and adding players

3. **My Squads** (/my-squads)
   - Should show saved squads from localStorage
   - Should allow loading/deleting squads

4. **Shared Squad** (/squad/[encoded])
   - Should decode squad from URL
   - Should show "Copy to My Squads" and "Edit Squad" buttons

---

## 🔄 Data Flow

### Application Startup

```
1. main.tsx
   ↓
2. Initialize Analytics (analytics.ts)
   ↓
3. Render App.tsx with ErrorBoundary
   ↓
4. Setup React Router
   ↓
5. Render Layout.tsx (navigation + Outlet)
   ↓
6. Route to page component
```

### Squad Builder Page Flow

```
1. SquadBuilderPage.tsx loads
   ↓
2. usePlayerData() hook fetches player database
   ↓
3. Show DataLoadingScreen during load
   ↓
4. Once loaded, render SquadBuilder component
   ↓
5. SquadBuilder uses:
   - usePlayerSearch() for player search
   - useSquadFromURL() for URL-loaded squads
   - useSavedSquads() for saving/loading
   ↓
6. User actions trigger analytics events
```

### State Management

The app should use Zustand for global state. Create this file:

```typescript
// src/store/squadStore.ts
import { create } from 'zustand';
import { Squad, Player } from '../types/player';

interface SquadStore {
  // Current squad being edited
  currentSquad: Squad | null;
  setCurrentSquad: (squad: Squad | null) => void;
  
  // Player database
  players: Player[];
  setPlayers: (players: Player[]) => void;
  
  // Clubs, Leagues, Nationalities
  clubs: Club[];
  leagues: League[];
  nationalities: Nationality[];
  setClubs: (clubs: Club[]) => void;
  setLeagues: (leagues: League[]) => void;
  setNationalities: (nationalities: Nationality[]) => void;
}

export const useSquadStore = create<SquadStore>((set) => ({
  currentSquad: null,
  setCurrentSquad: (squad) => set({ currentSquad: squad }),
  
  players: [],
  setPlayers: (players) => set({ players }),
  
  clubs: [],
  leagues: [],
  nationalities: [],
  setClubs: (clubs) => set({ clubs }),
  setLeagues: (leagues) => set({ leagues }),
  setNationalities: (nationalities) => set({ nationalities }),
}));
```

Then update `usePlayerData()` to populate this store:

```typescript
// In usePlayerData.ts
import { useSquadStore } from '../store/squadStore';

export function usePlayerData() {
  const setPlayers = useSquadStore((state) => state.setPlayers);
  const setClubs = useSquadStore((state) => state.setClubs);
  // ... etc

  useEffect(() => {
    async function loadData() {
      const data = await loadAllData();
      setPlayers(data.players);
      setClubs(data.clubs);
      // ... etc
    }
    loadData();
  }, []);
}
```

---

## 🎯 Component Integration Checklist

### SquadBuilder Component
- [ ] Accepts `initialSquad?: Squad` prop
- [ ] Uses `useSquadStore()` for state
- [ ] Calls `trackSquadBuilt()` when squad complete
- [ ] Integrates with PlayerSearchModal
- [ ] Shows chemistry in real-time
- [ ] Allows saving via ShareSquadModal

### PlayerSearchModal Component
- [ ] Accepts `onSelectPlayer(player: Player)` prop
- [ ] Uses `usePlayerSearch()` hook
- [ ] Calls `trackPlayerSearch()` on search
- [ ] Shows 20,000+ players with filters
- [ ] Virtual scrolling for performance

### SBCHelper Component
- [ ] Uses `useSBCSolver()` hook
- [ ] Accepts SBC requirements
- [ ] Shows solution with 11 players
- [ ] Calls `trackSBCSolved()` on solve
- [ ] Validates no bench waste

### EvolutionPlanner Component
- [ ] Shows evolution options
- [ ] Before/after stat comparison
- [ ] Chemistry style integration
- [ ] Calls `trackEvolutionPlanned()`

### MySquads Component
- [ ] Uses `useSavedSquads()` hook
- [ ] Shows grid of saved squads
- [ ] Allows load/delete/share
- [ ] Navigates to SquadBuilder on load

---

## 🧪 Testing the Integration

### 1. Test Homepage
```bash
npm run dev
# Visit http://localhost:3000
```

✅ Should see:
- Header with "Gaming Tools" logo
- Hero section with "Start Building" button
- 6 feature cards
- Footer with links

### 2. Test Squad Builder
```bash
# Click "Start Building" or visit /squad-builder
```

✅ Should see:
- Data loading screen (if first load)
- Squad builder with empty formation
- Player search button
- Formation selector
- Chemistry display

### 3. Test Player Search
```bash
# Click empty player slot or search button
```

✅ Should see:
- Modal with search input
- Player results list
- Filters panel
- Click player → adds to squad

### 4. Test Squad Sharing
```bash
# Build a squad, click "Share"
```

✅ Should see:
- Share modal with URL
- Copy button
- Social media buttons
- URL should encode squad data

### 5. Test Saved Squads
```bash
# Save a squad, then visit /my-squads
```

✅ Should see:
- Grid of saved squads
- Squad cards with thumbnail
- Load/Delete/Share buttons

---

## 📊 Analytics Integration

The app tracks these events automatically:

### Page Views
- Tracked on every route change
- Sent to GA4 with page path and title

### User Actions
- `squad_built` - When squad reaches 11 players
- `player_search` - On every search query
- `sbc_solved` - When SBC solution found
- `squad_shared` - When share URL generated
- `evolution_planned` - When evolution selected

### Example Usage in Your Components

```typescript
// In SquadBuilder.tsx
import { trackSquadBuilt } from '../services/analytics';

function onSquadComplete(squad: Squad) {
  trackSquadBuilt(
    squad.formation,
    squad.averageRating,
    squad.chemistry
  );
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "Module not found"
**Solution:** Ensure all imports use correct paths
```typescript
// Correct:
import { SEO } from '../components/SEO';

// Wrong:
import { SEO } from 'components/SEO';
```

### Issue: "usePlayerData is not a function"
**Solution:** Check hook is properly exported
```typescript
// In usePlayerData.ts
export function usePlayerData() { ... }

// In component
import { usePlayerData } from '../hooks/usePlayerData';
```

### Issue: "Chemistry not calculating"
**Solution:** Ensure chemistryEngine.js is imported
```typescript
import { calculateChemistry } from '../chemistryEngine';
```

### Issue: "Squad not saving"
**Solution:** Check localStorage is enabled
```typescript
// Test in browser console:
localStorage.setItem('test', 'value');
console.log(localStorage.getItem('test'));
```

---

## 🚀 Deploy Checklist

### Pre-Deploy
- [ ] All components connected
- [ ] Navigation works
- [ ] Player search works
- [ ] Chemistry calculates correctly
- [ ] Squads save/load
- [ ] No console errors
- [ ] Mobile responsive

### Build
```bash
npm run build
# Should create dist/ folder
# Should be < 500KB gzipped
```

### Deploy
```bash
# Option 1: Cloudflare Pages (auto-deploy)
git push origin main

# Option 2: Manual upload
npm run deploy
# Upload dist/ folder
```

### Post-Deploy
- [ ] Visit live site
- [ ] Test all features
- [ ] Check analytics working
- [ ] Submit sitemap to Google
- [ ] Monitor error rates

---

## 📚 Next Steps

1. **Connect Your Components** - Follow Step 2 above
2. **Test Locally** - Run `npm run dev`
3. **Fix Any Issues** - Use troubleshooting guide
4. **Deploy** - Push to Cloudflare Pages
5. **Monitor** - Check analytics and errors

---

## 🎉 You're Ready!

All files are created and ready to integrate. Follow the steps above to connect your existing components and launch your EA FC 25 Squad Builder!

**Questions?** Check `README.md` or `PRODUCTION_READY_GUIDE.md`

**Need help?** Create an issue on GitHub

Good luck! 🚀

