import { isDbConnected } from '../config/database.js';
import { config } from '../config/env.js';
import { getProviderHealth } from '../services/providerHealth.js';

export function getHealth(req, res) {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      database: isDbConnected() ? 'connected' : 'disconnected',
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
