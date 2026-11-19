import { config } from '../config/env.js';

/**
 * The keep-alive ping.
 *
 * A free Render web service is spun down after fifteen minutes with no
 * inbound traffic, and waking it again takes the better part of a minute.
 * That cold start is what a visitor sees as a 502: the first person to open
 * the door after a quiet spell waits, and often gives up.
 *
 * So the service calls its own public URL every five minutes. The request
 * leaves the instance, crosses the internet and arrives back as ordinary
 * inbound traffic, which is what the idle timer actually measures — an
 * internal call to localhost would not count.
 *
 * What this does and does not do, stated plainly because it matters:
 *
 *   · It keeps a running instance from going to sleep. That is the whole job.
 *   · It cannot wake one that is already asleep. Nothing is running to send
 *     the ping. If the service does go down — a restart, a failed deploy, a
 *     gap before this change was live — the next visitor still pays the cold
 *     start, and only an outside pinger would prevent that.
 *   · It does not touch the database or the image provider, so it costs
 *     nothing beyond the request itself.
 */

/** Five minutes: comfortably inside Render's fifteen-minute idle window, with
 *  room for two pings to fail before the service is at risk. */
const DEFAULT_INTERVAL_MS = 5 * 60 * 1000;

/** A ping that has not answered in ten seconds has failed. Without this a
 *  stalled request would sit open until the next one joined it. */
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Where to ping, or null when there is nowhere sensible to ping.
 *
 * `RENDER_EXTERNAL_URL` is set by Render on every web service, so hosting
 * needs no configuration at all. `KEEP_ALIVE_URL` overrides it — for another
 * host, for a custom domain, or to exercise this locally.
 */
export function resolveKeepAliveUrl(env = process.env) {
  const base = (env.KEEP_ALIVE_URL || env.RENDER_EXTERNAL_URL || '').trim();
  if (!base) return null;

  // A bare hostname is a configuration mistake worth catching here rather
  // than discovering as a failed ping every five minutes.
  if (!/^https?:\/\//i.test(base)) return null;

  return `${base.replace(/\/+$/, '')}${config.API_BASE_PATH}/ping`;
}

/**
 * Starts pinging. Returns a handle with `stop()`, or null when it did not
 * start — no URL, or a development run that did not ask for one.
 */
export function startKeepAlive({
  intervalMs,
  env = process.env,
  fetchImpl = globalThis.fetch,
  logger = console,
} = {}) {
  // An explicit argument wins; otherwise KEEP_ALIVE_INTERVAL_MS, so the rate
  // can be changed from the dashboard without a deploy.
  const fromEnv = parseInt(env.KEEP_ALIVE_INTERVAL_MS, 10);
  const interval = intervalMs ?? (Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : DEFAULT_INTERVAL_MS);

  // In development the service is not hosted and nothing spins it down, so
  // pinging would be noise. Setting KEEP_ALIVE_URL explicitly opts in anyway.
  if (config.NODE_ENV !== 'production' && !env.KEEP_ALIVE_URL) return null;

  const url = resolveKeepAliveUrl(env);
  if (!url) {
    logger.warn(
      '[KeepAlive] No RENDER_EXTERNAL_URL or KEEP_ALIVE_URL, so the service may sleep after 15 minutes idle.'
    );
    return null;
  }

  // One ping at a time. If a ping is slow, the next tick skips rather than
  // piling a second request on top of the first.
  let inFlight = false;

  const ping = async () => {
    if (inFlight) return false;
    inFlight = true;

    try {
      const response = await fetchImpl(url, {
        method: 'GET',
        headers: { 'user-agent': 'time-machine-keepalive' },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        logger.warn(`[KeepAlive] Ping answered ${response.status}.`);
        return false;
      }
      // Success is silent. A line every five minutes buries anything useful
      // in a log that is read only when something has gone wrong.
      return true;
    } catch (error) {
      // A failed ping is never fatal — the next one is five minutes away.
      logger.warn(`[KeepAlive] Ping failed: ${error.message}`);
      return false;
    } finally {
      inFlight = false;
    }
  };

  const timer = setInterval(ping, interval);
  // Never hold the process open on this timer alone, so shutdown stays clean.
  timer.unref?.();

  logger.log(`[KeepAlive] Pinging ${url} every ${Math.round(interval / 1000)}s.`);

  return {
    url,
    ping,
    stop: () => clearInterval(timer),
  };
}
