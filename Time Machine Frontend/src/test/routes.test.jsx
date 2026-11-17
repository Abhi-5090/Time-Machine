import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    expect(await screen.findByText('Tell us about you')).toBeInTheDocument();
    expect(screen.getByText('Your name')).toBeInTheDocument();
    expect(await screen.findByRole('radio', { name: /Scorpio/ })).toBeInTheDocument();
  });

  it('opens the 2050 wizard on its first step', async () => {
    renderRoute('/future/new');

    expect(await screen.findByText('Tell us about you')).toBeInTheDocument();
    expect(screen.getByText('Date of birth')).toBeInTheDocument();
  });
});

describe('Results', () => {
  it('shows the past card with the reader\u2019s own details and one paragraph', async () => {
    renderRoute('/reading/rd_past');

    expect(await screen.findByText('Your Past Life Report')).toBeInTheDocument();

    // The card is about the person who filled the form, not the character:
    // their name, their birthday, their sign.
    expect(screen.getByText('Aria')).toBeInTheDocument();
    expect(screen.getByText('31 October 1996')).toBeInTheDocument();
    expect(screen.getByText('2:05 pm')).toBeInTheDocument();
    expect(screen.getByText('Hyderabad, India')).toBeInTheDocument();
    expect(screen.getByText(/Archivist of Lost Constellations/)).toBeInTheDocument();

    expect(screen.getByText('Who you were')).toBeInTheDocument();
    expect(screen.getByText(/an archivist of lost constellations/)).toBeInTheDocument();
  });

  it('keeps the long chronicle closed until it is asked for', async () => {
    const user = userEvent.setup();
    renderRoute('/reading/rd_past');

    await screen.findByText('Your Past Life Report');
    expect(screen.queryByText('Origins & Awakening')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Read the long story/ }));

    expect(await screen.findByText('Origins & Awakening')).toBeInTheDocument();
    expect(screen.getByText('The Turning Point')).toBeInTheDocument();
    // Prose still splits into real paragraphs once it is on screen.
    expect(screen.getByText('Born under the twilight conjunction.')).toBeInTheDocument();
    expect(screen.getByText('A second paragraph of origins.')).toBeInTheDocument();
  });

  it('puts the 2050 age on the future card, since that is what the picture shows', async () => {
    renderRoute('/reading/rd_future');

    expect(await screen.findByText('Your 2050 Report')).toBeInTheDocument();
    expect(screen.getByText('Your age in 2050')).toBeInTheDocument();
    expect(screen.getByText('54 years old')).toBeInTheDocument();
    expect(screen.getByText('Your life in 2050')).toBeInTheDocument();
    expect(screen.getByText(/working as a flight director/)).toBeInTheDocument();
  });

  it('themes a 2050 result as the future timeline', async () => {
    renderRoute('/reading/rd_future');
    await screen.findByText('Your 2050 Report');
    await waitFor(() => expect(document.documentElement.getAttribute('data-timeline')).toBe('future'));
  });

  it('shows the drawn stand-in, and says so, when no photo was shared', async () => {
    renderRoute('/reading/rd_nophoto');

    await screen.findByText('Your Past Life Report');

    // No <img> on the card at all — nothing was generated to put there.
    expect(screen.queryByAltText(/^Portrait of/)).not.toBeInTheDocument();
    expect(
      screen.getByLabelText('A drawn stand-in, shown because no photo was shared')
    ).toBeInTheDocument();
    expect(
      screen.getByText('No photo was shared, so this picture is a stand-in.')
    ).toBeInTheDocument();

    // Nothing was drawn, so neither picture action is offered.
    expect(screen.queryByRole('button', { name: /Just the picture/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Redo the picture/ })).not.toBeInTheDocument();

    // The card itself is unchanged in every other respect.
    expect(screen.getByText('31 October 1996')).toBeInTheDocument();
    expect(screen.getByText('Who you were')).toBeInTheDocument();
  });

  it('still shows the generated picture when a photo was shared', async () => {
    renderRoute('/reading/rd_past');

    await screen.findByText('Your Past Life Report');
    expect(screen.getByAltText('Portrait of Aria')).toBeInTheDocument();
    expect(
      screen.queryByText('No photo was shared, so this picture is a stand-in.')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Just the picture/ })).toBeInTheDocument();
  });

  it('explains a reading that is gone instead of failing silently', async () => {
    renderRoute('/reading/rd_missing');
    expect(await screen.findByText('We could not find that card')).toBeInTheDocument();
  });
});

describe('Supporting routes', () => {
  it('renders an empty archive with a way out of it', async () => {
    renderRoute('/archive');
    expect(await screen.findByText('Nothing here yet')).toBeInTheDocument();
  });

  it('renders the continuum empty state when neither half exists', async () => {
    renderRoute('/continuum');
    expect(await screen.findByText('Nothing to put together yet')).toBeInTheDocument();
  });

  it('renders how it works', async () => {
    renderRoute('/how-it-works');
    expect(await screen.findByText('How your card gets made')).toBeInTheDocument();
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
    expect(await screen.findByText('Tell us about you')).toBeInTheDocument();
  });
});
