import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StoryReport } from '../components/report/StoryReport';

describe('StoryReport Component', () => {
  const mockReading = {
    readingId: 'rd_test123',
    archetype: { name: 'The Sage', id: 'sage' },
    characterProfile: {
      characterName: 'Lysander',
      occupation: 'Archivist of Lost Constellations',
      eraName: 'Ancient Era',
      setting: 'The cliffside observatory of Aethelgard',
      characterTraits: ['Learning', 'Clarity'],
      coreConflict: 'Balancing secret wisdom with mortal humility',
    },
    celestialSignature: {
      selectedSign: 'Scorpio',
    },
    storySections: {
      origins: 'Born under the twilight conjunction...',
      dailyLife: 'Polishing brass astrolabes each morning...',
      turningPoint: 'Standing against the council during the eclipse...',
      relationships: 'Mentoring young stargazers...',
      conclusion: 'Resting in peaceful solitude...',
    },
    symbolicKarmicThemes: [
      { theme: 'Stewardship', interpretation: 'Protecting quiet knowledge with care.' },
    ],
    presentDayReflection: 'Where in your life today might quiet reflection guide you?',
    disclaimer: 'Imaginative astrology-inspired entertainment.',
  };

  it('renders story report preview with character title, chapters, and reflection', () => {
    render(<StoryReport reading={mockReading} onClose={() => {}} />);

    expect(screen.getByText(/CELESTIAL PAST-LIFE CHRONICLE/i)).toBeInTheDocument();
    expect(screen.getByText(/LYSANDER/i)).toBeInTheDocument();
    expect(screen.getByText(/I. Origins & Awakening/i)).toBeInTheDocument();
    expect(screen.getByText(/Born under the twilight conjunction.../i)).toBeInTheDocument();
    expect(screen.getByText(/PRESENT-DAY SOUL REFLECTION/i)).toBeInTheDocument();
    expect(screen.getByText(/Download PNG/i)).toBeInTheDocument();
    expect(screen.getByText(/Export PDF/i)).toBeInTheDocument();
  });
});
