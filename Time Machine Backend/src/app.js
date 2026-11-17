import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { requestId } from './middleware/requestId.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import healthRoutes from './routes/health.routes.js';
import zodiacRoutes from './routes/zodiac.routes.js';
import readingRoutes from './routes/reading.routes.js';
import portraitRoutes from './routes/portrait.routes.js';
import catalogRoutes from './routes/catalog.routes.js';

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cross-origin resource sharing
//
// In development any localhost port is allowed so the Vite dev server can move
// freely. In production only CLIENT_ORIGIN (comma-separated list supported) is
// accepted — the previous behaviour allowed every origin unconditionally.
const allowedOrigins = config.CLIENT_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
const isLocalOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      // Same-origin requests, curl and native clients send no Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (config.NODE_ENV !== 'production' && isLocalOrigin(origin)) return callback(null, true);

      /*
       * Not allow-listed: omit the CORS headers rather than reject the request.
       *
       * Throwing here turns a policy decision into a 500, and it punishes the
       * wrong caller. A request the host proxies under its own domain is
       * same-origin to the browser, but still carries an Origin header on
       * anything other than GET — so throwing made every POST through a
       * front-end proxy fail while GETs sailed through.
       *
       * Returning false is the correct behaviour: the response simply carries
       * no CORS headers, so a genuine cross-origin read is blocked by the
       * browser while a same-origin one is unaffected.
       */
      return callback(null, false);
    },
    credentials: true,
  })
);

// Request tracking & rate limiting
app.use(requestId);
app.use(globalLimiter);

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Mount API routes
const apiBase = config.API_BASE_PATH; // /api/v1
app.use(`${apiBase}/health`, healthRoutes);
app.use(`${apiBase}/catalog`, catalogRoutes);
app.use(`${apiBase}/zodiac`, zodiacRoutes);
app.use(`${apiBase}/readings`, readingRoutes);
app.use(`${apiBase}/portraits`, portraitRoutes);

// Catch 404 and global errors
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
