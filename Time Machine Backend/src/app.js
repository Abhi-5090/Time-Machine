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

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cross-origin resource sharing
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or matching origins
      if (!origin || origin === config.CLIENT_ORIGIN || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true); // Dev flexible origin
      }
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
app.use(`${apiBase}/zodiac`, zodiacRoutes);
app.use(`${apiBase}/readings`, readingRoutes);
app.use(`${apiBase}/portraits`, portraitRoutes);

// Catch 404 and global errors
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
