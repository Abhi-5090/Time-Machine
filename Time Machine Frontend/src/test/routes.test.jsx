import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AppRouter } from '../router';
import { ToastProvider } from '../components/ui/Toast';
import { mockFetch } from './fixtures';

/**
 * Every route is rendered at least once.
 *
 * Most of this app is lazily loaded, which means a broken import or a bad
 * default export does not fail the build — it fails at runtime, on the route
 * nobody opened before shipping. These tests close that gap.
 */

function renderRoute(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(mockFetch()));
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.removeAttribute('data-timeline');
});

describe('Portal', () => {
  it('offers both doors with the required titles and captions', async () => {
    renderRoute('/');

    // "Time Machine" is both the product name and the left door, so the door
    // is addressed as the region it is rather than by text alone.
    expect(await screen.findByRole('region', { name: 'Time Machine' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '2050' })).toBeInTheDocument();

    expect(screen.getByText('Step into your past. Know who you were.')).toBeInTheDocument();
    expect(screen.getByText('Do you want to know about your future?')).toBeInTheDocument();
  });

  it('themes the document as the threshold', async () => {
    renderRoute('/');
    await waitFor(() => expect(document.documentElement.getAttribute('data-timeline')).toBe('portal'));
  });
});

describe('Landing pages', () => {
  it('renders the past timeline and themes it', async () => {
    renderRoute('/past');

    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
    // The headline is split into per-word spans for the reveal; the accessible
    // name on the wrapper is the reliable way to assert the copy.
    expect(screen.getByLabelText('You have been')).toBeInTheDocument();
    expect(screen.getByLabelText('someone before.')).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement.getAttribute('data-timeline')).toBe('past'));
  });

  it('renders the 2050 timeline and themes it', async () => {
    renderRoute('/future');

    expect(await screen.findByText('Do you want to know about your future?')).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement.getAttribute('data-timeline')).toBe('future'));
  });

  it('shows signs on the past landing page from the catalog', async () => {
    renderRoute('/past');
    expect(await screen.findByText('Scorpio')).toBeInTheDocument();
  });
});

describe('Wizards', () => {
  it('opens the past wizard on its first step', async () => {
    renderRoute('/past/new');

    expect(await screen.findByText('Who is this reading for?')).toBeInTheDocument();
    expect(screen.getByText('Preferred name')).toBeInTheDocument();
    expect(await screen.findByRole('radio', { name: /Scorpio/ })).toBeInTheDocument();
  });

  it('opens the 2050 wizard on its first step', async () => {
    renderRoute('/future/new');

    expect(await screen.findByText('Who are we projecting?')).toBeInTheDocument();
    expect(screen.getByText('Date of birth')).toBeInTheDocument();
  });
});

describe('Results', () => {
  it('renders a past chronicle with all five chapters', async () => {
    renderRoute('/reading/rd_past');

    // The name appears in the title and again in the dossier, which is correct.
    expect(await screen.findByRole('heading', { level: 1, name: /Lysander of the Whispering Spire/ })).toBeInTheDocument();
    expect(screen.getByText('Origins & Awakening')).toBeInTheDocument();
    expect(screen.getByText('The Turning Point')).toBeInTheDocument();
    expect(screen.getByText('The Quiet Legacy')).toBeInTheDocument();
    expect(screen.getByText(/Born under the twilight conjunction/)).toBeInTheDocument();
    expect(screen.getByText(/Where might quiet reflection guide you today/)).toBeInTheDocument();
  });

  it('splits generated prose into separate paragraphs', async () => {
    renderRoute('/reading/rd_past');

    expect(await screen.findByText('Born under the twilight conjunction.')).toBeInTheDocument();
    expect(screen.getByText('A second paragraph of origins.')).toBeInTheDocument();
  });

  it('renders a 2050 projection with its dossier, signals and trajectory', async () => {
    renderRoute('/reading/rd_future');

    expect(await screen.findByRole('heading', { level: 1, name: /Ori Lindqvist/ })).toBeInTheDocument();
    expect(screen.getByText('Arrival')).toBeInTheDocument();
    expect(screen.getByText('The Breakthrough')).toBeInTheDocument();
    expect(screen.getByText('Momentum Index')).toBeInTheDocument();
    expect(screen.getByText('2027')).toBeInTheDocument();
    expect(screen.getByText('Pick the problem nobody wants to own.')).toBeInTheDocument();
  });

  it('themes a 2050 result as the future timeline', async () => {
    renderRoute('/reading/rd_future');
    await screen.findByRole('heading', { level: 1, name: /Ori Lindqvist/ });
    await waitFor(() => expect(document.documentElement.getAttribute('data-timeline')).toBe('future'));
  });

  it('explains a reading that is gone instead of failing silently', async () => {
    renderRoute('/reading/rd_missing');
    expect(await screen.findByText('That reading is not here')).toBeInTheDocument();
  });
});

describe('Supporting routes', () => {
  it('renders an empty archive with a way out of it', async () => {
    renderRoute('/archive');
    expect(await screen.findByText('Nothing here yet')).toBeInTheDocument();
  });

  it('renders the continuum empty state when neither half exists', async () => {
    renderRoute('/continuum');
    expect(await screen.findByText('Nothing to thread together yet')).toBeInTheDocument();
  });

  it('renders how it works', async () => {
    renderRoute('/how-it-works');
    expect(await screen.findByText('How a life gets written')).toBeInTheDocument();
  });

  it('renders privacy and terms', async () => {
    const privacy = renderRoute('/privacy');
    expect(await screen.findByText('What happens to what you tell us')).toBeInTheDocument();
    privacy.unmount();

    renderRoute('/terms');
    expect(await screen.findByText('The terms, plainly')).toBeInTheDocument();
  });

  it('renders a not-found page for an unknown route', async () => {
    renderRoute('/nowhere-at-all');
    expect(await screen.findByText('There is nothing at this moment')).toBeInTheDocument();
  });

  it('redirects the old single-timeline wizard route to the past wizard', async () => {
    renderRoute('/reading/new');
    expect(await screen.findByText('Who is this reading for?')).toBeInTheDocument();
  });
});
