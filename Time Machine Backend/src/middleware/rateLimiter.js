import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

/**
 * Rate limiting.
 *
 * The shape of the traffic matters here. One reader generating one reading
 * sends a single expensive POST and then polls for status roughly every 1.3
 * seconds for the forty-odd seconds it takes to generate — thirty-plus cheap
 * GETs for one unit of real work. A flat per-IP budget therefore gets consumed
 * by polling long before it ever restrains the thing that actually costs money,
 * and it collapses completely behind a shared IP (a venue, an office, a
 * conference kiosk), where every visitor looks like the same client.
 *
 * So the budget is split: generous for reads, strict for generation and
 * uploads, which are the calls that cost provider credits and disk.
 */

function limitResponse(message) {
  return {
    success: false,
    error: { code: 'RATE_LIMITED', message, details: [] },
  };
}

/** Applies to everything. Sized for polling, not for restraint. */
export const globalLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  // Health and portrait reads are cheap, static and polled by monitors; they
  // should never be the reason a reader cannot see their own reading.
  skip: (req) => req.path === '/' || req.method === 'OPTIONS',
  message: limitResponse(
    'Too many requests from this connection. Please wait a moment and try again.'
  ),
});

/** The expensive one: starting a generation spends provider credits. */
export const creationLimiter = rateLimit({
  windowMs: config.CREATION_RATE_LIMIT_WINDOW_MS,
  max: config.CREATION_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: limitResponse(
    'Generation limit reached for this connection. Please wait a few minutes before starting another reading.'
  ),
});

/** Uploads consume disk and are the only route accepting arbitrary bytes. */
export const uploadLimiter = rateLimit({
  windowMs: config.UPLOAD_RATE_LIMIT_WINDOW_MS,
  max: config.UPLOAD_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: limitResponse('Upload limit reached. Please wait before uploading another photograph.'),
});
