import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './features/landing/LandingPage';
import { OnboardingWizard } from './features/onboarding/OnboardingWizard';
import { RevealScreen } from './features/reveal/RevealScreen';
import { ResultsPage } from './features/results/ResultsPage';
import { HowItWorksPage } from './features/static/HowItWorksPage';
import { PrivacyPage } from './features/static/PrivacyPage';
import { TermsPage } from './features/static/TermsPage';
import { NotFoundPage } from './features/static/NotFoundPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/reading/new" element={<OnboardingWizard />} />
      <Route path="/reading/:readingId/reveal" element={<RevealScreen />} />
      <Route path="/reading/:readingId" element={<ResultsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
