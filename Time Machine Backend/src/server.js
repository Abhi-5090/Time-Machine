import app from './app.js';
import { config, validateConfig } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { checkProvider, getProviderHealth } from './services/providerHealth.js';

async function bootstrap() {
  try {
    // 1. Validate environment configuration
    validateConfig();

    // 2. Connect to MongoDB
    await connectDatabase();

    // 3. Verify the AI provider before taking traffic, so a bad key is
    //    reported here rather than discovered by the first reader.
    await checkProvider();

    // 4. Start HTTP server
    const server = app.listen(config.PORT, () => {
      const provider = getProviderHealth();
      console.log(`\n======================================================`);
      console.log(`  Time Machine API — past and 2050`);
      console.log(`  Port       ${config.PORT}`);
      console.log(`  Base URL   http://localhost:${config.PORT}${config.API_BASE_PATH}`);
      console.log(`  Generation ${provider.live ? `live (text ${config.OPENAI_TEXT_MODEL}, image ${config.OPENAI_IMAGE_MODEL})` : `offline — ${provider.reason}`}`);
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
