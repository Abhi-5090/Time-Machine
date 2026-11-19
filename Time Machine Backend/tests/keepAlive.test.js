import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { resolveKeepAliveUrl, startKeepAlive } from '../src/services/keepAlive.js';

/**
 * The keep-alive.
 *
 * What is worth covering is not that a timer fires — it is that the ping is
 * cheap, that it is aimed at the public URL rather than at localhost, that a
 * failing ping cannot take the process down with it, and that it stays out of
 * the way in development.
 */

const quiet = { log: () => {}, warn: () => {}, error: () => {} };

afterEach(() => {
  vi.useRealTimers();
});

describe('GET /api/v1/ping', () => {
  it('answers without touching the database or the provider', async () => {
    const res = await request(app).get('/api/v1/ping');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('awake');
    expect(res.body.data.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('stays cheap — the response carries nothing but liveness', async () => {
    const res = await request(app).get('/api/v1/ping');

    // Anything added here is paid for 288 times a day for no reason.
    expect(Object.keys(res.body.data).sort()).toEqual(['status', 'timestamp', 'uptimeSeconds']);
  });
});

describe('Resolving where to ping', () => {
  it('uses the public URL Render provides, not localhost', () => {
    const url = resolveKeepAliveUrl({ RENDER_EXTERNAL_URL: 'https://time-machine-api.onrender.com' });
    expect(url).toBe('https://time-machine-api.onrender.com/api/v1/ping');
  });

  it('prefers an explicit override, and tolerates a trailing slash', () => {
    const url = resolveKeepAliveUrl({
      KEEP_ALIVE_URL: 'https://api.example.com/',
      RENDER_EXTERNAL_URL: 'https://ignored.onrender.com',
    });
    expect(url).toBe('https://api.example.com/api/v1/ping');
  });

  it('refuses a value that is not a URL rather than pinging nothing every five minutes', () => {
    expect(resolveKeepAliveUrl({ KEEP_ALIVE_URL: 'time-machine-api.onrender.com' })).toBeNull();
    expect(resolveKeepAliveUrl({})).toBeNull();
  });
});

describe('Starting the keep-alive', () => {
  it('does not run in development unless it is asked to', () => {
    // NODE_ENV is 'test' under vitest, so this is the non-production path.
    expect(startKeepAlive({ env: {}, logger: quiet })).toBeNull();
  });

  it('pings the resolved URL on every interval', async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn(async () => ({ ok: true, status: 200 }));

    const handle = startKeepAlive({
      intervalMs: 1000,
      env: { KEEP_ALIVE_URL: 'https://api.example.com' },
      fetchImpl,
      logger: quiet,
    });

    expect(handle.url).toBe('https://api.example.com/api/v1/ping');
    expect(fetchImpl).not.toHaveBeenCalled(); // nothing on start

    await vi.advanceTimersByTimeAsync(3000);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(fetchImpl.mock.calls[0][0]).toBe('https://api.example.com/api/v1/ping');

    handle.stop();
    await vi.advanceTimersByTimeAsync(3000);
    expect(fetchImpl).toHaveBeenCalledTimes(3); // stopped means stopped
  });

  it('survives a ping that throws, and keeps pinging afterwards', async () => {
    vi.useFakeTimers();
    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new Error('socket hang up'))
      .mockResolvedValue({ ok: true, status: 200 });

    const handle = startKeepAlive({
      intervalMs: 1000,
      env: { KEEP_ALIVE_URL: 'https://api.example.com' },
      fetchImpl,
      logger: quiet,
    });

    await vi.advanceTimersByTimeAsync(2000);

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    await expect(handle.ping()).resolves.toBe(true);
    handle.stop();
  });

  it('reports a non-200 as a failure rather than treating it as alive', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: false, status: 503 }));
    const handle = startKeepAlive({
      env: { KEEP_ALIVE_URL: 'https://api.example.com' },
      fetchImpl,
      logger: quiet,
    });

    await expect(handle.ping()).resolves.toBe(false);
    handle.stop();
  });

  it('never lets two pings overlap', async () => {
    let release;
    const fetchImpl = vi.fn(
      () => new Promise((resolve) => {
        release = () => resolve({ ok: true, status: 200 });
      })
    );

    const handle = startKeepAlive({
      env: { KEEP_ALIVE_URL: 'https://api.example.com' },
      fetchImpl,
      logger: quiet,
    });

    const first = handle.ping();
    // A second tick while the first is still open must not open another.
    await expect(handle.ping()).resolves.toBe(false);
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    release();
    await first;
    handle.stop();
  });
});
