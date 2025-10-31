import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import HomePage from './pages/HomePage';
import { SquadBuilderPage } from './pages/SquadBuilderPage';
import { SBCSolverPage } from './pages/SBCSolverPage';
import { EvolutionPlannerPage } from './pages/EvolutionPlannerPage';
import { MySquadsPage } from './pages/MySquadsPage';
import { SharedSquadPage } from './pages/SharedSquadPage';
import { trackPageView } from './services/analytics';
import { OfflineBanner } from './hooks/useMobileDetect';

function App() {
  const location = useLocation();

  // Track page views on route changes
  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location]);

  return (
    <>
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="squad-builder" element={<SquadBuilderPage />} />
          <Route path="sbc-solver" element={<SBCSolverPage />} />
          <Route path="evolution-planner" element={<EvolutionPlannerPage />} />
          <Route path="my-squads" element={<MySquadsPage />} />
          <Route path="squad/:encodedSquad" element={<SharedSquadPage />} />
          <Route path="s/:shortCode" element={<SharedSquadPage />} />
          
          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

