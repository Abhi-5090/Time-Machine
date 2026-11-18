import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CameraCapture } from '../components/ui/CameraCapture';
import PastWizard from '../features/past/PastWizard';
import { ToastProvider } from '../components/ui/Toast';
import { mockFetch } from './fixtures';

/**
 * The camera path.
 *
 * Two of these are about trust rather than about features: the stream has to
 * be released when the card goes away, and nothing may reach the server before
 * the reader has ticked the shot. The rest covers the ways opening a camera
 * fails in the wild, because on a phone at a stall that is the common case.
 */

/** A fake camera. Returns the stream plus the track spies to assert on. */
function fakeCamera({ fail = null, cameras = 1 } = {}) {
  const track = { kind: 'video', readyState: 'live', stop: vi.fn(() => { track.readyState = 'ended'; }) };
  const stream = { getTracks: () => [track] };

  navigator.mediaDevices = {
    getUserMedia: vi.fn(() => (fail ? Promise.reject(fail) : Promise.resolve(stream))),
    enumerateDevices: vi.fn(() =>
      Promise.resolve(Array.from({ length: cameras }, (_, i) => ({ kind: 'videoinput', deviceId: `cam${i}` })))
    ),
  };

  return { track, stream };
}

function deniedError() {
  const error = new Error('Permission denied');
  error.name = 'NotAllowedError';
  return error;
}

beforeEach(() => {
  // jsdom has no media pipeline: a <video> never loads, never plays and
  // reports no intrinsic size, all of which the card reads.
  HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
  Object.defineProperty(HTMLVideoElement.prototype, 'videoWidth', { configurable: true, value: 1280 });
  Object.defineProperty(HTMLVideoElement.prototype, 'videoHeight', { configurable: true, value: 720 });
  HTMLCanvasElement.prototype.toBlob = vi.fn((callback) =>
    callback(new Blob(['x'], { type: 'image/jpeg' }))
  );
});

afterEach(() => {
  delete navigator.mediaDevices;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('The camera card', () => {
  it('stops every track when it is closed, so the camera light goes out', async () => {
    const { track } = fakeCamera();
    const { unmount } = render(<CameraCapture onCapture={vi.fn()} onCancel={vi.fn()} />);

    await screen.findByLabelText('Take the photo');
    expect(track.readyState).toBe('live');

    unmount();

    await waitFor(() => expect(track.stop).toHaveBeenCalled());
    expect(track.readyState).toBe('ended');
  });

  it('hands back a JPEG only once the shot has been ticked', async () => {
    fakeCamera();
    const onCapture = vi.fn();
    const user = userEvent.setup();
    render(<CameraCapture onCapture={onCapture} onCancel={vi.fn()} />);

    await user.click(await screen.findByLabelText('Take the photo'));

    // Reviewing, and nothing has been handed over yet.
    expect(await screen.findByRole('button', { name: /use this photo/i })).toBeInTheDocument();
    expect(onCapture).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /use this photo/i }));

    expect(onCapture).toHaveBeenCalledTimes(1);
    const file = onCapture.mock.calls[0][0];
    expect(file).toBeInstanceOf(File);
    expect(file.type).toBe('image/jpeg');
  });

  it('goes back to the live view when the shot is rejected', async () => {
    fakeCamera();
    const user = userEvent.setup();
    render(<CameraCapture onCapture={vi.fn()} onCancel={vi.fn()} />);

    await user.click(await screen.findByLabelText('Take the photo'));
    await user.click(await screen.findByRole('button', { name: /take it again/i }));

    expect(await screen.findByLabelText('Take the photo')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /use this photo/i })).not.toBeInTheDocument();
  });

  it('explains a refused camera and still offers a way to add a photo', async () => {
    fakeCamera({ fail: deniedError() });
    render(<CameraCapture onCapture={vi.fn()} onCancel={vi.fn()} />);

    expect(await screen.findByText(/camera is blocked/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pick a file instead/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('offers the flip only when there is a second camera to flip to', async () => {
    fakeCamera({ cameras: 1 });
    const { unmount } = render(<CameraCapture onCapture={vi.fn()} onCancel={vi.fn()} />);
    await screen.findByLabelText('Take the photo');
    await waitFor(() => expect(navigator.mediaDevices.enumerateDevices).toHaveBeenCalled());
    expect(screen.queryByRole('button', { name: /flip/i })).not.toBeInTheDocument();
    unmount();

    fakeCamera({ cameras: 2 });
    render(<CameraCapture onCapture={vi.fn()} onCancel={vi.fn()} />);
    expect(await screen.findByRole('button', { name: /flip/i })).toBeInTheDocument();
  });
});

describe('The photo step', () => {
  function renderWizard() {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        mockFetch({
          '/api/v1/portraits/reference': { success: true, data: { assetId: 'ast_cam' } },
        })
      )
    );

    return render(
      <MemoryRouter initialEntries={['/start']}>
        <ToastProvider>
          <Routes>
            <Route path="/start" element={<PastWizard />} />
            <Route path="/reading/:readingId/reveal" element={<p>Reveal screen</p>} />
          </Routes>
        </ToastProvider>
      </MemoryRouter>
    );
  }

  /** Walk to step two and tick the photo consent, which is what reveals it. */
  async function reachPhotoStep(user) {
    await user.click((await screen.findAllByText(/Leo/i))[0]);
    await user.click(screen.getByRole('button', { name: /continue/i }));
    await user.click(await screen.findByText(/use my photo to draw my picture/i));
  }

  it('offers both a file and the camera when the browser has one', async () => {
    fakeCamera();
    const user = userEvent.setup();
    renderWizard();
    await reachPhotoStep(user);

    expect(await screen.findByRole('button', { name: /choose a photo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /take a photo/i })).toBeInTheDocument();
  });

  it('hides the camera where the browser cannot open one', async () => {
    // No navigator.mediaDevices at all — http on a phone, or an old browser.
    const user = userEvent.setup();
    renderWizard();
    await reachPhotoStep(user);

    expect(await screen.findByRole('button', { name: /choose a photo/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /take a photo/i })).not.toBeInTheDocument();
  });

  it('uploads the ticked shot and closes the camera', async () => {
    fakeCamera();
    const user = userEvent.setup();
    renderWizard();
    await reachPhotoStep(user);

    await user.click(await screen.findByRole('button', { name: /take a photo/i }));
    await user.click(await screen.findByLabelText('Take the photo'));
    await user.click(await screen.findByRole('button', { name: /use this photo/i }));

    expect(await screen.findByText(/photo added/i)).toBeInTheDocument();
    expect(screen.queryByLabelText('Take the photo')).not.toBeInTheDocument();

    const uploaded = fetch.mock.calls.find(([url]) =>
      String(url).includes('/portraits/reference')
    );
    expect(uploaded).toBeTruthy();
  });
});
