# Quick Start Guide - Production Deployment

## 🚀 Deploy in 10 Minutes

### Step 1: Install Dependencies (1 min)
```bash
cd gaming-tools/ea-fc-chemistry
npm install
```

### Step 2: Create Environment File (1 min)
Create `.env.production`:
```bash
VITE_APP_NAME="EA FC 25 Squad Builder"
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_API_PROVIDER=msmc
VITE_ENABLE_ANALYTICS=true
VITE_CACHE_DURATION_DAYS=7
```

### Step 3: Build (2 min)
```bash
npm run build
```

### Step 4: Test Locally (1 min)
```bash
npm run preview
# Open http://localhost:4173
```

### Step 5: Deploy to Cloudflare (5 min)

#### Option A: Git Integration (Recommended)
```bash
# 1. Push to GitHub
git add .
git commit -m "Production build"
git push origin main

# 2. Connect to Cloudflare Pages
# - Go to https://dash.cloudflare.com/
# - Pages > Create a project > Connect to Git
# - Select your repository
# - Build command: npm run build
# - Build output: dist
# - Environment: Add VITE_* variables
# - Deploy!
```

#### Option B: Direct Upload
```bash
# 1. Install Wrangler
npm install -g wrangler

# 2. Login
wrangler login

# 3. Deploy
wrangler pages publish dist
```

### Step 6: Configure Domain (Optional)
```bash
# In Cloudflare Pages dashboard:
# Custom domains > Add custom domain
# gaming-tools.co.uk
# Add DNS records as instructed
```

---

## ✅ Post-Deployment Checklist

### Immediate (5 minutes)
- [ ] Visit your site: https://gaming-tools.co.uk
- [ ] Test squad builder
- [ ] Test player search
- [ ] Check mobile view
- [ ] Verify no console errors

### SEO Setup (10 minutes)
- [ ] Submit sitemap to Google Search Console
  * Go to: https://search.google.com/search-console
  * Add property: gaming-tools.co.uk
  * Add sitemap: https://gaming-tools.co.uk/sitemap.xml
  
- [ ] Test structured data
  * Go to: https://validator.schema.org
  * Paste your URL
  * Fix any errors

- [ ] Test Open Graph tags
  * Go to: https://opengraph.xyz
  * Enter your URL
  * Verify image and title appear

### Analytics (5 minutes)
- [ ] Create Google Analytics 4 property
  * Go to: https://analytics.google.com
  * Create property
  * Get Measurement ID (G-XXXXXXXXXX)
  * Add to .env.production
  * Redeploy

### Marketing (10 minutes)
- [ ] Create social media posts
- [ ] Post on Reddit r/EASportsFC
- [ ] Tweet with #EAFC25
- [ ] Share in Discord servers

---

## 🎯 Example Usage

### Using SEO Component
```typescript
import { SEO, webAppSchema } from './components/SEO';

function App() {
  return (
    <>
      <SEO
        title="EA FC 25 Squad Builder"
        description="Build your perfect squad"
        structuredData={webAppSchema}
      />
      <YourContent />
    </>
  );
}
```

### Using Analytics
```typescript
import { 
  trackSquadBuilt, 
  trackPlayerSearch 
} from './services/analytics';

// When user builds squad
trackSquadBuilt('4-3-3', 86, 33);

// When user searches
trackPlayerSearch('mbappe', 5, 12);
```

### Using Error Boundary
```typescript
import { ErrorBoundary } from './components/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Using Mobile Detect
```typescript
import { useMobileDetect } from './hooks/useMobileDetect';

function MyComponent() {
  const { isMobile, isTablet } = useMobileDetect();
  
  return (
    <div className={isMobile ? 'mobile-view' : 'desktop-view'}>
      {/* Your content */}
    </div>
  );
}
```

### Using Skeleton Loaders
```typescript
import { SquadBuilderSkeleton } from './components/SkeletonLoaders';

function SquadBuilder() {
  const { isLoading } = usePlayerData();
  
  if (isLoading) return <SquadBuilderSkeleton />;
  
  return <YourSquadBuilder />;
}
```

---

## 📊 Monitoring

### Google Analytics Dashboard
1. Go to https://analytics.google.com
2. Select your property
3. Monitor:
   - Real-time users
   - Page views
   - Events (squad_built, player_search, etc.)
   - User flow

### Cloudflare Analytics
1. Go to Cloudflare dashboard
2. Select your site
3. Analytics tab
4. Monitor:
   - Traffic
   - Performance
   - Security

### Error Tracking
- Check browser console
- Monitor ErrorBoundary catches
- Review analytics error events

---

## 🐛 Common Issues

### Issue: Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Images not loading
```bash
# Check paths are correct
# Use /images/... not ./images/...
# Verify files exist in public/
```

### Issue: Analytics not working
```bash
# Verify GA_MEASUREMENT_ID is correct
# Check browser console for gtag errors
# Disable ad blockers for testing
```

### Issue: Mobile layout broken
```bash
# Test on real device
# Check viewport meta tag
# Verify TailwindCSS breakpoints
```

---

## 🔄 Update Workflow

### Make Changes
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# ... edit files ...

# 3. Test locally
npm run dev

# 4. Build and test
npm run build
npm run preview

# 5. Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# 6. Merge to main
# Create PR on GitHub
# Review and merge

# 7. Auto-deploy
# Cloudflare Pages auto-deploys main branch
```

---

## 📈 Growth Tips

### Week 1: Launch
- Post on r/EASportsFC
- Share on Twitter with #EAFC25
- Join EA FC Discord servers
- Ask for feedback

### Week 2-4: Iterate
- Fix bugs reported by users
- Add most-requested features
- Improve SEO
- Create content (blog posts)

### Month 2-3: Scale
- Reach out to YouTubers
- Partner with streamers
- Guest blog posts
- Backlink building

### Month 4+: Monetize
- Consider premium features
- Add affiliate links
- Maintain free core features

---

## 🎉 Success Indicators

### Good Signs
- ✅ 100+ visitors on launch day
- ✅ < 5% bounce rate
- ✅ 2+ minutes average session
- ✅ Positive Reddit comments
- ✅ Users sharing squads

### Red Flags
- ❌ High bounce rate (>70%)
- ❌ Short session time (<30s)
- ❌ High error rate (>5%)
- ❌ Slow load time (>5s)
- ❌ Negative feedback

---

## 🆘 Need Help?

### Resources
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Google Analytics Help](https://support.google.com/analytics/)
- [React Performance](https://react.dev/learn)
- [Web.dev Guides](https://web.dev/)

### Community
- GitHub Issues
- Reddit: r/EASportsFC
- Discord: EA FC Community
- Twitter: #EAFC25

---

## 🎯 Next Steps

1. ✅ Deploy to production
2. ✅ Set up analytics
3. ✅ Submit sitemap
4. ✅ Launch on social media
5. ✅ Monitor for 24 hours
6. ✅ Gather feedback
7. ✅ Plan next features

---

**You're ready to launch! 🚀**

Good luck and may your site be fast, bug-free, and popular!

---

*Questions? Open an issue on GitHub or reach out on Twitter.*

