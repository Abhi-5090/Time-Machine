import { isDbConnected } from '../config/database.js';
import { config } from '../config/env.js';
import { getProviderHealth } from '../services/providerHealth.js';

export function getHealth(req, res) {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      database: isDbConnected() ? 'connected' : 'disconnected',
      // 'local' on a hosted instance means portraits are lost on every deploy.
      storage: config.STORAGE_PROVIDER,
      // Which build is actually serving. Without this there is no way to tell
      // a deploy that has not happened from a change that did not work.
      commit: (process.env.RENDER_GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || 'local').slice(0, 7),
      imageFormat: config.OPENAI_IMAGE_FORMAT,
      providerMode: config.AI_PROVIDER_MODE,
      textModel: config.OPENAI_TEXT_MODEL,
      imageModel: config.OPENAI_IMAGE_MODEL,
      // What will actually happen on the next reading, as opposed to what the
      // configuration asks for.
      provider: getProviderHealth(),
      timestamp: new Date().toISOString(),
    },
    requestId: req.id,
  });
}

/**
 * The keep-alive target.
 *
 * Deliberately the cheapest endpoint in the service: no database round trip,
 * no provider check, nothing that can fail. It exists to be inbound traffic
 * every five minutes so a free instance is never idle long enough to be spun
 * down — see services/keepAlive.js. `/health` would also serve, but it reads
 * the database and provider state, and that is not work worth doing 288 times
 * a day to prove the process is running.
 */
export function getPing(req, res) {
  res.status(200).json({
    success: true,
    data: {
      status: 'awake',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    requestId: req.id,
  });
}
