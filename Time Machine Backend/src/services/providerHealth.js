import OpenAI from 'openai';
import { config } from '../config/env.js';
import { resolveImageModel, IMAGE_MODEL_PREFERENCE } from '../providers/image/imageModels.js';

/**
 * Preflight for the AI provider.
 *
 * Without this, a bad key fails silently in the worst possible place: the
 * reader fills in the whole wizard, waits through the reveal, and only then
 * gets "something interrupted it". The credentials are checked once at boot
 * instead, so the operator learns about it from the server log and every
 * reading afterwards degrades immediately rather than after an API timeout.
 *
 * The result is cached. Generation reads it synchronously; it is never on the
 * request path.
 */

const UNRECOVERABLE = new Set([
  'invalid_api_key',
  'expired_secret_key',
  'account_deactivated',
  'billing_hard_limit_reached',
  'insufficient_quota',
]);

let state = {
  mode: config.AI_PROVIDER_MODE,
  live: false,
  reason: config.AI_PROVIDER_MODE === 'openai' ? 'not checked yet' : 'running in offline mode',
  code: null,
  checkedAt: null,
};

export function getProviderHealth() {
  return { ...state };
}

/** True when live generation should actually be attempted. */
export function isProviderLive() {
  return config.AI_PROVIDER_MODE === 'openai' && state.live;
}

function describe(error) {
  const code = error?.code || error?.error?.code || null;
  const status = error?.status ?? null;

  if (code === 'expired_secret_key') {
    return { code, reason: 'The OPENAI_API_KEY has expired. Create a new key and update the backend .env.' };
  }
  if (code === 'invalid_api_key' || status === 401) {
    return { code: code || 'invalid_api_key', reason: 'The OPENAI_API_KEY was rejected. Check it is a current, full key.' };
  }
  if (code === 'insufficient_quota' || status === 429) {
    return { code: code || 'insufficient_quota', reason: 'The OpenAI account has no remaining quota. Add credit, then restart.' };
  }
  return { code, reason: `Could not reach OpenAI: ${error?.message || 'unknown error'}` };
}

/**
 * Checks credentials and reports which image model is usable.
 * Called at boot; safe to call again.
 */
export async function checkProvider({ quiet = false } = {}) {
  if (config.AI_PROVIDER_MODE !== 'openai') {
    state = { mode: 'mock', live: false, reason: 'running in offline mode', code: null, checkedAt: new Date() };
    return getProviderHealth();
  }

  if (!config.OPENAI_API_KEY?.trim()) {
    state = {
      mode: 'openai',
      live: false,
      reason: 'AI_PROVIDER_MODE is "openai" but OPENAI_API_KEY is empty.',
      code: 'missing_api_key',
      checkedAt: new Date(),
    };
  } else {
    try {
      const client = new OpenAI({ apiKey: config.OPENAI_API_KEY, maxRetries: 1, timeout: 15000 });
      const page = await client.models.list();
      const available = new Set(page.data.map((model) => model.id));

      // Resolve the image model against what this account can actually see,
      // rather than trusting a name in configuration that may have been
      // retired or may never have been enabled for the organisation.
      const resolved = resolveImageModel({ configured: config.OPENAI_IMAGE_MODEL, available });

      state = {
        mode: 'openai',
        live: true,
        reason: 'ready',
        code: null,
        checkedAt: new Date(),
        textModel: config.OPENAI_TEXT_MODEL,
        textModelAvailable: available.has(config.OPENAI_TEXT_MODEL),
        imageModel: resolved.model,
        imageModelSubstituted: resolved.substituted,
        imageModelReason: resolved.reason,
        availableImageModels: IMAGE_MODEL_PREFERENCE.filter((model) => available.has(model)),
      };
    } catch (error) {
      const { code, reason } = describe(error);
      state = {
        mode: 'openai',
        live: false,
        reason,
        code,
        unrecoverable: UNRECOVERABLE.has(code),
        checkedAt: new Date(),
      };
    }
  }

  if (!quiet) logProviderState();
  return getProviderHealth();
}

export function logProviderState() {
  if (state.mode !== 'openai') {
    console.log('[Provider] Offline mode — readings use the built-in generator. Set AI_PROVIDER_MODE=openai for live output.');
    return;
  }

  if (state.live) {
    console.log(`[Provider] OpenAI ready. text=${config.OPENAI_TEXT_MODEL} image=${state.imageModel}`);
    if (state.imageModelSubstituted) {
      console.warn(`[Provider] ${state.imageModelReason}. Set OPENAI_IMAGE_MODEL to silence this.`);
    }
    if (state.textModelAvailable === false) {
      console.warn(`[Provider] "${config.OPENAI_TEXT_MODEL}" is not listed for this account.`);
    }
    return;
  }

  console.error(
    '\n──────────────────────────────────────────────────────────────\n' +
      '  LIVE GENERATION IS NOT AVAILABLE\n' +
      `  ${state.reason}\n` +
      '\n  Until this is fixed, readings still complete — but the\n' +
      '  portraits are placeholders, not generated images.\n' +
      '  Fix it, then restart the server.\n' +
      '──────────────────────────────────────────────────────────────\n'
  );
}
