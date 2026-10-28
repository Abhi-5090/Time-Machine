import app from './app.js';
import { config, validateConfig } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

async function bootstrap() {
  try {
    // 1. Validate environment configuration
    validateConfig();

    // 2. Connect to MongoDB
    await connectDatabase();

    // 3. Start HTTP server
    const server = app.listen(config.PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🌌 Mystical Past-Life Astrology API Server Running`);
      console.log(`🪐 Port: ${config.PORT}`);
      console.log(`🔮 Mode: AI_PROVIDER_MODE=${config.AI_PROVIDER_MODE}`);
      console.log(`📜 Text Model: ${config.OPENAI_TEXT_MODEL}`);
      console.log(`🎨 Image Model: ${config.OPENAI_IMAGE_MODEL}`);
      console.log(`🛡️  Base URL: http://localhost:${config.PORT}${config.API_BASE_PATH}`);
      console.log(`======================================================\n`);
    });

    // 4. Graceful shutdown handler
    const shutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Initiating graceful celestial shutdown...`);
      server.close(async () => {
        await disconnectDatabase();
        console.log('[Server] Process closed cleanly. Blessed be the journey.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('[Server Fatal] Celestial launch halted:', error.message);
    process.exit(1);
  }
}

bootstrap();
