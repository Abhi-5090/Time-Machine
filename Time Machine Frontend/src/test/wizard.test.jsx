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
 * The wizards are where a reader can actually get stuck, so the mechanics are
 * covered directly: blocking validation, the step rail, and the exact payload
 * that reaches the API.
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
  it('will not advance past identity until a sign is chosen, then does', async () => {
    const user = userEvent.setup();
    renderWizard(PastWizard);

    await screen.findByText('Who is this reading for?');
    await user.click(screen.getByRole('button', { name: /Continue/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Choose a star sign to continue.');
    expect(screen.getByText('Who is this reading for?')).toBeInTheDocument();

    await user.click(await screen.findByRole('radio', { name: /Scorpio/ }));
    await user.click(screen.getByRole('button', { name: /Continue/ }));

    expect(await screen.findByText('Optional celestial coordinates')).toBeInTheDocument();
  });

  it('warns when the date of birth disagrees with the chosen sign, without overriding it', async () => {
    const user = userEvent.setup();
    renderWizard(PastWizard);

    await user.click(await screen.findByRole('radio', { name: /Scorpio/ }));
    await user.click(screen.getByRole('button', { name: /Continue/ }));

    const dateField = await screen.findByLabelText(/Date of birth/);
    await user.type(dateField, '1996-08-01');

    expect(await screen.findByText(/falls under Leo, but you chose Scorpio/)).toBeInTheDocument();
    expect(screen.getByText(/the reading follows the sign you picked/)).toBeInTheDocument();
  });

  it('blocks submission until both consents are given, then posts a past reading', async () => {
    const user = userEvent.setup();
    renderWizard(PastWizard);

    await user.click(await screen.findByRole('radio', { name: /Scorpio/ }));
    for (let step = 0; step < 4; step++) {
      await user.click(screen.getByRole('button', { name: /Continue/ }));
    }

    await screen.findByText('Before the chamber opens');
    await user.click(screen.getByRole('button', { name: /Open the chamber/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Both acknowledgements are required');
    expect(createdPayload()).toBeNull();

    await user.click(screen.getByLabelText(/I understand this is a work of fiction/));
    await user.click(screen.getByLabelText(/I agree to my answers being processed/));
    await user.click(screen.getByRole('button', { name: /Open the chamber/ }));

    await waitFor(() => expect(createdPayload()).not.toBeNull());

    const payload = createdPayload();
    expect(payload.timeline).toBe('past');
    expect(payload.profile.selectedZodiacSign).toBe('Scorpio');
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
    for (let step = 0; step < 4; step++) {
      await user.click(screen.getByRole('button', { name: /Continue/ }));
    }
    await screen.findByText('Before the chamber opens');
    await user.click(screen.getByLabelText(/I understand this is a work of fiction/));
    await user.click(screen.getByLabelText(/I agree to my answers being processed/));
    await user.click(screen.getByRole('button', { name: /Open the chamber/ }));

    await waitFor(() => expect(getArchive()).toHaveLength(1));
    expect(getArchive()[0]).toMatchObject({ readingId: 'rd_new', timeline: 'past' });
  });
});

describe('2050 wizard', () => {
  it('requires a date of birth and shows the projected age once given', async () => {
    const user = userEvent.setup();
    renderWizard(FutureWizard);

    await screen.findByText('Who are we projecting?');
    await user.click(screen.getByRole('button', { name: /Continue/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('A date of birth is needed');

    await user.type(screen.getByLabelText(/Date of birth/), '1996-10-31');
    expect(await screen.findByText(/Reference frame locked/)).toBeInTheDocument();
    expect(screen.getByText('54')).toBeInTheDocument();
  });

  it('omits the star sign when left on automatic so the server derives it', async () => {
    const user = userEvent.setup();
    renderWizard(FutureWizard);

    await user.type(await screen.findByLabelText(/Date of birth/), '1996-10-31');
    for (let step = 0; step < 4; step++) {
      await user.click(screen.getByRole('button', { name: /Continue/ }));
    }

    await screen.findByText('Confirm the projection');
    await user.click(screen.getByLabelText(/I understand this is speculative fiction/));
    await user.click(screen.getByLabelText(/I agree to my answers being processed/));
    await user.click(screen.getByRole('button', { name: /Lock the frame/ }));

    await waitFor(() => expect(createdPayload()).not.toBeNull());

    const payload = createdPayload();
    expect(payload.timeline).toBe('future');
    expect(payload.profile).not.toHaveProperty('selectedZodiacSign');
    expect(payload.profile.zodiacInputMode).toBe('derived_from_date');
    expect(payload.preferences.futureSector).toBe('system_select');
  });

  it('sends an explicitly chosen sign when one is picked', async () => {
    const user = userEvent.setup();
    renderWizard(FutureWizard);

    await user.type(await screen.findByLabelText(/Date of birth/), '1996-10-31');
    await user.selectOptions(screen.getByLabelText(/Star sign/), 'Leo');

    for (let step = 0; step < 4; step++) {
      await user.click(screen.getByRole('button', { name: /Continue/ }));
    }
    await screen.findByText('Confirm the projection');
    await user.click(screen.getByLabelText(/I understand this is speculative fiction/));
    await user.click(screen.getByLabelText(/I agree to my answers being processed/));
    await user.click(screen.getByRole('button', { name: /Lock the frame/ }));

    await waitFor(() => expect(createdPayload()).not.toBeNull());
    expect(createdPayload().profile.selectedZodiacSign).toBe('Leo');
  });
});
