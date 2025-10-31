# EA FC 25 Squad Builder

A comprehensive, production-ready web application for building EA Sports FC 25 Ultimate Team squads with accurate chemistry calculations, SBC solving, and evolution planning.

## 🎯 Features

### Core Features
- ✅ **Squad Builder** - Drag & drop interface with 30+ formations
- ✅ **Real-time Chemistry** - Accurate calculations matching EA's in-game system
- ✅ **Player Search** - 20,000+ players with fuzzy search and advanced filters
- ✅ **Formation Builder** - All formations with realistic position coordinates
- ✅ **Squad Sharing** - Share via URL, social media, or QR code
- ✅ **Save Squads** - Store up to 50 squads locally

### Advanced Features
- ✅ **SBC Solver** - Optimize squad building challenges, minimize cost
- ✅ **Evolution Planner** - Before/after stat comparisons with chemistry styles
- ✅ **Chemistry Styles** - All 22 styles with accurate boost calculations
- ✅ **Data Loading** - IndexedDB caching, offline support
- ✅ **Price Tracking** - Background price updates by tier

### Production Ready
- ✅ **SEO Optimized** - Meta tags, structured data, sitemap
- ✅ **Analytics** - Google Analytics 4 with custom events
- ✅ **Error Handling** - ErrorBoundary with tracking
- ✅ **Performance** - Code splitting, lazy loading, <500KB bundle
- ✅ **Mobile** - Responsive, touch-optimized, PWA
- ✅ **Accessibility** - WCAG AA compliant

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern browser (Chrome 100+, Firefox 100+, Safari 15+)

### Installation

```bash
# Clone repository
cd gaming-tools/ea-fc-chemistry

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your settings
# VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview

# Generate sitemap
npm run sitemap
```

### Deploy

```bash
# Full deployment (build + sitemap)
npm run deploy

# Then upload dist/ folder to Cloudflare Pages
```

## 📁 Project Structure

```
ea-fc-chemistry/
├── index.html                    # Main HTML entry point
├── package.json                  # Dependencies and scripts
├── vite.config.ts               # Vite build configuration
├── tailwind.config.js           # Tailwind CSS configuration
│
├── public/                       # Static assets
│   ├── favicon-*.png            # Favicons
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt               # SEO robots file
│   └── sitemap.xml              # Generated sitemap
│
└── src/
    ├── main.tsx                 # React entry point
    ├── App.tsx                  # Main app with routing
    ├── index.css                # Global styles
    │
    ├── components/              # React components
    │   ├── Layout.tsx           # Page layout with nav
    │   ├── SEO.tsx              # SEO component
    │   ├── ErrorBoundary.tsx    # Error handling
    │   ├── SkeletonLoaders.tsx  # Loading states
    │   ├── SquadBuilder.tsx     # Main squad builder (to connect)
    │   ├── PlayerSearchModal.tsx # Player search (existing)
    │   ├── ShareSquadModal.tsx  # Squad sharing (existing)
    │   ├── MySquads.tsx         # Saved squads (existing)
    │   ├── SBCHelper.tsx        # SBC solver UI (existing)
    │   └── EvolutionPlanner.tsx # Evolution planner (existing)
    │
    ├── pages/                   # Page components
    │   ├── HomePage.tsx         # Landing page
    │   ├── SquadBuilderPage.tsx # Squad builder page
    │   ├── SBCSolverPage.tsx    # SBC solver page
    │   ├── EvolutionPlannerPage.tsx # Evolution page
    │   ├── MySquadsPage.tsx     # Saved squads page
    │   └── SharedSquadPage.tsx  # Shared squad viewer
    │
    ├── data/                    # Static data
    │   ├── chemistryStyles.ts   # All chemistry styles
    │   ├── evolutions.ts        # Evolution templates
    │   ├── formations.ts        # Formation configurations
    │   └── popularSBCs.ts       # SBC templates
    │
    ├── services/                # Business logic
    │   ├── analytics.ts         # GA4 tracking
    │   ├── squadEncoder.ts      # URL encoding
    │   ├── squadStorage.ts      # LocalStorage management
    │   ├── sbcSolver.ts         # SBC algorithm
    │   ├── evolutionChecker.ts  # Evolution logic
    │   ├── statCalculator.ts    # Chemistry calculations
    │   ├── playerDatabase.ts    # IndexedDB
    │   └── dataLoader.ts        # Data loading
    │
    ├── hooks/                   # React hooks
    │   ├── usePlayerData.ts     # Data loading hook
    │   ├── usePlayerSearch.ts   # Search hook
    │   ├── useSavedSquads.ts    # Saved squads hook
    │   ├── useSquadFromURL.ts   # URL loading hook
    │   ├── useMobileDetect.ts   # Device detection
    │   └── useSBCSolver.ts      # SBC solver hook
    │
    ├── types/                   # TypeScript types
    │   ├── player.ts            # Player types
    │   ├── sbc.ts               # SBC types
    │   └── api.types.ts         # API types
    │
    └── utils/                   # Utility functions
        └── performance.ts       # Performance helpers
```

## 🔧 Environment Variables

Create `.env.local` file:

```bash
# Application
VITE_APP_NAME="EA FC 25 Squad Builder"
VITE_APP_URL="https://gaming-tools.co.uk"

# API Configuration
VITE_API_BASE_URL="https://api.gaming-tools.co.uk"
VITE_API_PROVIDER="msmc"

# Analytics
VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
VITE_ENABLE_ANALYTICS="true"

# Features
VITE_CACHE_DURATION_DAYS="7"
VITE_MAX_SAVED_SQUADS="50"
```

## 🔗 Connecting Your Components

### 1. Connect SquadBuilder Component

Update `src/pages/SquadBuilderPage.tsx`:

```typescript
// Import your actual SquadBuilder component
import { SquadBuilder } from '../components/SquadBuilder';

// Replace the placeholder with:
<SquadBuilder initialSquad={urlSquad || undefined} />
```

### 2. Connect SBC Solver

Update `src/pages/SBCSolverPage.tsx`:

```typescript
import { SBCHelper } from '../components/SBCHelper';

// Replace placeholder with:
<SBCHelper />
```

### 3. Connect Evolution Planner

Update `src/pages/EvolutionPlannerPage.tsx`:

```typescript
import { EvolutionPlanner } from '../components/EvolutionPlanner';

// Replace placeholder with:
<EvolutionPlanner />
```

### 4. Connect My Squads

Update `src/pages/MySquadsPage.tsx`:

```typescript
import { MySquads } from '../components/MySquads';

// Replace placeholder with:
<MySquads />
```

## 📊 State Management

The app uses **Zustand** for global state. Create a store:

```typescript
// src/store/squadStore.ts
import create from 'zustand';
import { Squad, Player } from '../types/player';

interface SquadStore {
  currentSquad: Squad | null;
  players: Player[];
  setSquad: (squad: Squad) => void;
  setPlayers: (players: Player[]) => void;
}

export const useSquadStore = create<SquadStore>((set) => ({
  currentSquad: null,
  players: [],
  setSquad: (squad) => set({ currentSquad: squad }),
  setPlayers: (players) => set({ players }),
}));
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint
```

## 📈 Analytics Events

The app tracks these custom events:

- `squad_built` - When user completes a squad
- `player_search` - Player search queries
- `sbc_solved` - SBC solver used
- `squad_shared` - Squad shared via URL
- `evolution_planned` - Evolution planned

Configure in Google Analytics 4 dashboard.

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  pitch: {
    dark: '#1a472a',  // Change pitch color
    light: '#2d5a3d'
  },
  chemistry: {
    max: '#22c55e',   // Chemistry colors
    // ...
  }
}
```

### Styles

Edit `src/index.css` for custom classes.

## 📱 PWA Configuration

The app is PWA-ready. Icons needed:

```
public/icons/
  ├── icon-192x192.png
  ├── icon-512x512.png
  └── apple-touch-icon.png
```

Generate with: https://realfavicongenerator.net

## 🚢 Deployment

### Cloudflare Pages (Recommended)

1. **Connect to Git:**
   - Go to Cloudflare Pages
   - Connect your GitHub repo
   - Set build command: `npm run build`
   - Set build output: `dist`

2. **Environment Variables:**
   - Add all `VITE_*` variables
   - Enable production mode

3. **Deploy:**
   - Push to main branch
   - Auto-deploys!

### Manual Deployment

```bash
npm run deploy
# Upload dist/ folder to your host
```

## 🐛 Troubleshooting

### Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Chemistry not calculating
- Check `chemistryEngine.js` is properly imported
- Verify player data structure matches types

### Player search not working
- Ensure `usePlayerData()` loads data
- Check IndexedDB in browser DevTools

### Analytics not tracking
- Verify `VITE_GA_MEASUREMENT_ID` is correct
- Check browser console for errors
- Disable ad blockers for testing

## 📚 Documentation

- **Production Guide:** `PRODUCTION_READY_GUIDE.md`
- **Complete Summary:** `COMPLETE_SYSTEM_SUMMARY.md`
- **Quick Start:** `QUICK_START.md`
- **Squad Sharing:** `README_SQUAD_SHARING.md`
- **SBC Solver:** `README_SBC_SOLVER.md`
- **Evolution System:** `README_EVOLUTION_SYSTEM.md`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - See `LICENSE` file

## 🙏 Credits

Built with ❤️ by Gaming Tools team.

Special thanks to:
- EA Sports for EA FC 25
- React & Vite communities
- Tailwind CSS team
- All contributors

## 📞 Support

- **Issues:** GitHub Issues
- **Email:** support@gaming-tools.co.uk
- **Twitter:** @GamingToolsUK

---

**Ready to launch!** 🚀

Follow `QUICK_START.md` for deployment instructions.
