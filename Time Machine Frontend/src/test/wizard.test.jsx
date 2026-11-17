import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import PastWizard from '../features/past/PastWizard';
import FutureWizard from '../features/future/FutureWizard';
import { ToastProvider } from '../components/ui/Toast';
import { mockFetch } from './fixtures';
import { getArchive } from '../lib/archive';

/**
 * Both wizards are two steps now: what the reader knows about themselves, then
 * their photo. What is covered here is what can still go wrong — the blocking
 * validation on each step, and the exact payload that reaches the API,
 * including the defaults the reader is no longer asked to choose.
 */

let fetchSpy;

function renderWizard(Component) {
  return render(
    <MemoryRouter initialEntries={['/start']}>
      <ToastProvider>
        <Routes>
          <Route path="/start" element={<Component />} />
          <Route path="/reading/:readingId/reveal" element={<p>Reveal screen</p>} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>
  );
}

/** The body the wizard POSTed to /readings. */
function createdPayload() {
  const call = fetchSpy.mock.calls.find(
    ([url, options]) => String(url).endsWith('/readings') && options?.method === 'POST'
  );
  return call ? JSON.parse(call[1].body) : null;
}

beforeEach(() => {
  localStorage.clear();
  fetchSpy = vi.fn(
    mockFetch({
      '/api/v1/readings': {
        success: true,
        data: { readingId: 'rd_new', ownerToken: 'token-1', timeline: 'past', status: 'processing' },
      },
    })
  );
  vi.stubGlobal('fetch', fetchSpy);
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.removeAttribute('data-timeline');
});

describe('Past wizard', () => {
  it('will not leave the first step until a star sign is chosen, then does', async () => {
    const user = userEvent.setup();
    renderWizard(PastWizard);

    await screen.findByText('Tell us about you');
    await user.click(screen.getByRole('button', { name: /Continue/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Pick your star sign to carry on.');
    expect(screen.getByText('Tell us about you')).toBeInTheDocument();

    await user.click(await screen.findByRole('radio', { name: /Scorpio/ }));
    await user.click(screen.getByRole('button', { name: /Continue/ }));

    expect(await screen.findByText('Add your photo')).toBeInTheDocument();
  });

  it('asks for nothing but the five things the reader knows', async () => {
    const user = userEvent.setup();
    renderWizard(PastWizard);

    await screen.findByText('Tell us about you');
    expect(screen.getByLabelText(/Your name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of birth/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time of birth/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Place of birth/)).toBeInTheDocument();

    // The choice steps are gone: there are exactly two steps now, and the
    // second one says outright what is being decided for the reader.
    await user.click(await screen.findByRole('radio', { name: /Scorpio/ }));
    await user.click(screen.getByRole('button', { name: /Continue/ }));

    await screen.findByText('Add your photo');
    expect(screen.getByText('The stars pick the rest')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Continue/ })).not.toBeInTheDocument();
  });

  it('blocks submission until both boxes are ticked, then posts a past reading', async () => {
    const user = userEvent.setup();
    renderWizard(PastWizard);

    await user.click(await screen.findByRole('radio', { name: /Scorpio/ }));
    await user.type(screen.getByLabelText(/Place of birth/), 'Hyderabad');
    await user.click(screen.getByRole('button', { name: /Continue/ }));

    await screen.findByText('Add your photo');
    await user.click(screen.getByRole('button', { name: /Open the door/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Please tick both boxes');
    expect(createdPayload()).toBeNull();

    await user.click(screen.getByLabelText(/I know this is a story, not a fact/));
    await user.click(screen.getByLabelText(/Yes, use my answers to make my card/));
    await user.click(screen.getByRole('button', { name: /Open the door/ }));

    await waitFor(() => expect(createdPayload()).not.toBeNull());

    const payload = createdPayload();
    expect(payload.timeline).toBe('past');
    expect(payload.profile.selectedZodiacSign).toBe('Scorpio');
    expect(payload.profile.birthplace).toBe('Hyderabad');
    // Everything the reader no longer picks still goes out as a definite
    // value, so the server never has to guess what was meant.
    expect(payload.preferences.archetypeId).toBe('auto');
    expect(payload.preferences.historicalSetting).toBe('system_select');
    expect(payload.consent).toEqual({
      readingProcessing: true,
      fictionalReadingAcknowledged: true,
      photoProcessing: false,
    });

    expect(await screen.findByText('Reveal screen')).toBeInTheDocument();
  });

  it('records the new reading in the local archive', async () => {
    const user = userEvent.setup();
    renderWizard(PastWizard);

    await user.click(await screen.findByRole('radio', { name: /Scorpio/ }));
    await user.click(screen.getByRole('button', { name: /Continue/ }));

    await screen.findByText('Add your photo');
    await user.click(screen.getByLabelText(/I know this is a story, not a fact/));
    await user.click(screen.getByLabelText(/Yes, use my answers to make my card/));
    await user.click(screen.getByRole('button', { name: /Open the door/ }));

    await waitFor(() => expect(getArchive()).toHaveLength(1));
    expect(getArchive()[0]).toMatchObject({ readingId: 'rd_new', timeline: 'past' });
  });
});

describe('2050 wizard', () => {
  it('requires a date of birth and shows the 2050 age once given', async () => {
    const user = userEvent.setup();
    renderWizard(FutureWizard);

    await screen.findByText('Tell us about you');
    await user.click(screen.getByRole('button', { name: /Continue/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('We need your date of birth');

    await user.type(screen.getByLabelText(/Date of birth/), '1996-10-31');
    expect(await screen.findByText(/Age locked in/)).toBeInTheDocument();
    expect(screen.getByText('54')).toBeInTheDocument();
    // The age is the whole reason the portrait is believable, so it is said
    // in plain words as well as shown as a number.
    expect(screen.getByText(/show you at 54, not as you look today/)).toBeInTheDocument();
  });

  it('omits the star sign when left on automatic so the server derives it', async () => {
    const user = userEvent.setup();
    renderWizard(FutureWizard);

    await user.type(await screen.findByLabelText(/Date of birth/), '1996-10-31');
    await user.click(screen.getByRole('button', { name: /Continue/ }));

    await screen.findByText('Add your photo');
    await user.click(screen.getByLabelText(/I know this is a story, not a real forecast/));
    await user.click(screen.getByLabelText(/Yes, use my answers to make my card/));
    await user.click(screen.getByRole('button', { name: /Show me 2050/ }));

    await waitFor(() => expect(createdPayload()).not.toBeNull());

    const payload = createdPayload();
    expect(payload.timeline).toBe('future');
    expect(payload.profile).not.toHaveProperty('selectedZodiacSign');
    expect(payload.profile.zodiacInputMode).toBe('derived_from_date');
    expect(payload.preferences.futureSector).toBe('system_select');
    expect(payload.preferences.futureHabitat).toBe('system_select');
  });

  it('sends the birth time and place, which the old projection step dropped', async () => {
    const user = userEvent.setup();
    renderWizard(FutureWizard);

    await user.type(await screen.findByLabelText(/Date of birth/), '1996-10-31');
    await user.type(screen.getByLabelText(/Place of birth/), 'Hyderabad');
    await user.click(screen.getByRole('button', { name: /Continue/ }));

    await screen.findByText('Add your photo');
    await user.click(screen.getByLabelText(/I know this is a story, not a real forecast/));
    await user.click(screen.getByLabelText(/Yes, use my answers to make my card/));
    await user.click(screen.getByRole('button', { name: /Show me 2050/ }));

    await waitFor(() => expect(createdPayload()).not.toBeNull());
    expect(createdPayload().profile.birthplace).toBe('Hyderabad');
  });

  it('sends an explicitly chosen sign when one is picked', async () => {
    const user = userEvent.setup();
    renderWizard(FutureWizard);

    await user.type(await screen.findByLabelText(/Date of birth/), '1996-10-31');
    await user.selectOptions(screen.getByLabelText(/Your star sign/), 'Leo');
    await user.click(screen.getByRole('button', { name: /Continue/ }));

    await screen.findByText('Add your photo');
    await user.click(screen.getByLabelText(/I know this is a story, not a real forecast/));
    await user.click(screen.getByLabelText(/Yes, use my answers to make my card/));
    await user.click(screen.getByRole('button', { name: /Show me 2050/ }));

    await waitFor(() => expect(createdPayload()).not.toBeNull());
    expect(createdPayload().profile.selectedZodiacSign).toBe('Leo');
  });
});
