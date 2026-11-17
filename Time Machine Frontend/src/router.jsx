import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PortalPage } from './features/portal/PortalPage';
import { RouteFallback } from './components/layout/RouteFallback';

/*
 * The portal is eager because it is the first paint on nearly every visit.
 * Everything else is split out, which keeps the entry bundle to the threshold
 * plus the shared design system.
 */
/*
 * The two timeline entrances keep their import functions in reach so the warp
 * can prefetch a destination while it is still animating toward it. Without
 * that, travelling through the gate would end on a Suspense fallback.
 */
const importPastLanding = () => import('./features/past/PastLandingPage');
const importFutureLanding = () => import('./features/future/FutureLandingPage');

export const preloadRoute = {
  past: importPastLanding,
  future: importFutureLanding,
};

const PastLandingPage = lazy(importPastLanding);
const PastWizard = lazy(() => import('./features/past/PastWizard'));
const FutureLandingPage = lazy(importFutureLanding);
const FutureWizard = lazy(() => import('./features/future/FutureWizard'));
const RevealScreen = lazy(() => import('./features/reveal/RevealScreen'));
const ResultsPage = lazy(() => import('./features/results/ResultsPage'));
const ArchivePage = lazy(() => import('./features/archive/ArchivePage'));
const ContinuumPage = lazy(() => import('./features/continuum/ContinuumPage'));
const HowItWorksPage = lazy(() => import('./features/static/HowItWorksPage'));
const PrivacyPage = lazy(() => import('./features/static/PrivacyPage'));
const TermsPage = lazy(() => import('./features/static/TermsPage'));
const NotFoundPage = lazy(() => import('./features/static/NotFoundPage'));

export function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense key={location.pathname} fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route path="/" element={<PortalPage />} />

          <Route path="/past" element={<PastLandingPage />} />
          <Route path="/past/new" element={<PastWizard />} />

          <Route path="/future" element={<FutureLandingPage />} />
          <Route path="/future/new" element={<FutureWizard />} />

          <Route path="/reading/:readingId/reveal" element={<RevealScreen />} />
          <Route path="/reading/:readingId" element={<ResultsPage />} />

          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/continuum" element={<ContinuumPage />} />

          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Routes carried over from the previous single-timeline app. */}
          <Route path="/reading/new" element={<Navigate to="/past/new" replace />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
