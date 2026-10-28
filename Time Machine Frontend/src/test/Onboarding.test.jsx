import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { OnboardingWizard } from '../features/onboarding/OnboardingWizard';

describe('OnboardingWizard Component', () => {
  it('renders Step 1: Celestial Identity with zodiac options', () => {
    render(
      <BrowserRouter>
        <OnboardingWizard />
      </BrowserRouter>
    );

    expect(screen.getByText(/Connect With Your Star Sign/i)).toBeInTheDocument();
    expect(screen.getByText(/Preferred Name or Nickname/i)).toBeInTheDocument();
    expect(screen.getByText(/Scorpio/i)).toBeInTheDocument();
    expect(screen.getByText(/Taurus/i)).toBeInTheDocument();
  });

  it('allows selecting different zodiac signs and navigating steps', () => {
    render(
      <BrowserRouter>
        <OnboardingWizard />
      </BrowserRouter>
    );

    const ariesBtn = screen.getByText(/Aries/i);
    fireEvent.click(ariesBtn);

    const continueBtn = screen.getByText(/Continue/i);
    fireEvent.click(continueBtn);

    // Navigates to Step 2: Birth Details
    expect(screen.getByText(/Optional Celestial Coordinates/i)).toBeInTheDocument();
  });

  it('navigates through steps to Step 5: Review & Consents', () => {
    render(
      <BrowserRouter>
        <OnboardingWizard />
      </BrowserRouter>
    );

    // Step 1 -> Step 2
    fireEvent.click(screen.getByText(/Continue/i));
    // Step 2 -> Step 3
    fireEvent.click(screen.getByText(/Continue/i));
    // Step 3 -> Step 4
    fireEvent.click(screen.getByText(/Continue/i));
    // Step 4 -> Step 5
    fireEvent.click(screen.getByText(/Continue/i));

    expect(screen.getByText(/Review Your Celestial Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Fictional Entertainment Acknowledgment/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Processing Consent/i)).toBeInTheDocument();
  });
});
