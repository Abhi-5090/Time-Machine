import { isDbConnected } from '../config/database.js';
import { config } from '../config/env.js';

export function getHealth(req, res) {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      database: isDbConnected() ? 'connected' : 'disconnected',
      providerMode: config.AI_PROVIDER_MODE,
      textModel: config.OPENAI_TEXT_MODEL,
      imageModel: config.OPENAI_IMAGE_MODEL,
      timestamp: new Date().toISOString(),
    },
    requestId: req.id,
  });
}
