import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ShareQr } from '../components/reading/ShareQr';
import { ToastProvider } from '../components/ui/Toast';
import { cardUrl } from '../lib/export';

/**
 * The QR code beside the card.
 *
 * The one thing that genuinely matters here is *what the code points at*. A
 * code that encodes a URL only the machine that made the card can open is
 * worse than no code at all — the reader scans it at a stall, gets an error,
 * and has nothing. So the address is asserted directly, and the fact that the
 * API lets a tokenless visitor read a completed card is what makes it work.
 */

// node-qrcode wants a real canvas; jsdom has none. The encoder is not what is
// under test — where it is pointed is.
const toDataURL = vi.fn(async () => 'data:image/png;base64,QVJU');
vi.mock('qrcode', () => ({
  default: { toDataURL: (...args) => toDataURL(...args) },
  toDataURL: (...args) => toDataURL(...args),
}));

function renderQr(props = {}) {
  return render(
    <ToastProvider>
      <ShareQr readingId="rd_past" name="Aria" {...props} />
    </ToastProvider>
  );
}

beforeEach(() => {
  toDataURL.mockClear();
  toDataURL.mockResolvedValue('data:image/png;base64,QVJU');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('The address a card is reachable at', () => {
  it('is the card page on this origin, with no token in it', () => {
    const url = cardUrl('rd_past', 'https://time-machine.example');
    expect(url).toBe('https://time-machine.example/reading/rd_past');

    // A token in the QR would hand delete rights to anyone who photographs it.
    expect(url).not.toMatch(/token/i);
  });

  it('tolerates a trailing slash on the origin', () => {
    expect(cardUrl('rd_past', 'https://time-machine.example/')).toBe(
      'https://time-machine.example/reading/rd_past'
    );
  });
});

describe('The QR panel', () => {
  it('encodes the card address and says what to do with it', async () => {
    renderQr();

    const image = await screen.findByAltText(/QR code that opens Aria's card/i);
    expect(image).toHaveAttribute('src', 'data:image/png;base64,QVJU');

    expect(toDataURL).toHaveBeenCalledWith(
      `${window.location.origin}/reading/rd_past`,
      expect.anything()
    );

    expect(screen.getByText(/scan for your card/i)).toBeInTheDocument();
    expect(screen.getByText(/point your phone/i)).toBeInTheDocument();
  });

  it('renders the code black on white, whatever the timeline is', async () => {
    renderQr();
    await screen.findByAltText(/QR code/i);

    // Tinting a QR to match the page is how a pretty card becomes unscannable.
    const [, options] = toDataURL.mock.calls[0];
    expect(options.color).toEqual({ dark: '#101010', light: '#ffffff' });
    expect(options.margin).toBeGreaterThan(0); // the quiet zone
  });

  it('will not offer the download until there is something to download', async () => {
    let settle;
    toDataURL.mockReturnValue(new Promise((resolve) => { settle = resolve; }));

    renderQr();
    expect(screen.getByRole('button', { name: /save qr code/i })).toBeDisabled();

    settle('data:image/png;base64,QVJU');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /save qr code/i })).toBeEnabled()
    );
  });

  it('saves the code under the reader’s own name', async () => {
    const user = userEvent.setup();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    renderQr();
    await screen.findByAltText(/QR code/i);
    await user.click(screen.getByRole('button', { name: /save qr code/i }));

    expect(click).toHaveBeenCalled();
    await screen.findByText(/QR code saved/i);
  });

  it('points the reader at Share when the code cannot be made', async () => {
    toDataURL.mockRejectedValue(new Error('no canvas'));
    renderQr();

    expect(await screen.findByText(/could not be made/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save qr code/i })).toBeDisabled();
  });
});
