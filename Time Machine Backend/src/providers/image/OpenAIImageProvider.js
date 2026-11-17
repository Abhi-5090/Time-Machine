import OpenAI, { toFile } from 'openai';
import { ImageProvider } from './ImageProvider.js';
import { PromptService } from '../../services/prompt.service.js';
import { StorageService } from '../../services/storage.service.js';
import { config } from '../../config/env.js';
import { getProviderHealth } from '../../services/providerHealth.js';
import {
  IMAGE_MODEL_PREFERENCE,
  capabilities,
  resolveSize,
  isAuthFailure,
  isModelUnavailable,
  isUnsupportedParameter,
} from './imageModels.js';

/**
 * Portraits, from OpenAI.
 *
 * The model is whatever the boot preflight resolved against the account, not a
 * name baked into the source. Every request is assembled from that model's
 * capabilities, and the two failures that are not the caller's fault — the
 * model having been retired, or a parameter it does not implement — are
 * recovered from in place rather than surfaced as a broken reading.
 *
 * When the reader has consented to a photograph the edit endpoint is used, not
 * generation: it is the only way the resulting face is actually theirs.
 */

const EXT_BY_MIME = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
};

export class OpenAIImageProvider extends ImageProvider {
  constructor() {
    super();
    if (!config.OPENAI_API_KEY) {
      const err = new Error(
        'OpenAI API key is missing. Set OPENAI_API_KEY in your backend .env file or switch to AI_PROVIDER_MODE=mock.'
      );
      err.code = 'PROVIDER_NOT_CONFIGURED';
      err.isCustomError = true;
      err.statusCode = 503;
      throw err;
    }

    // Image generation regularly takes a minute; the default timeout is not
    // generous enough and produces spurious failures under load.
    this.openai = new OpenAI({ apiKey: config.OPENAI_API_KEY, maxRetries: 2, timeout: 240000 });

    const health = getProviderHealth();
    this.model = health.imageModel || config.OPENAI_IMAGE_MODEL || IMAGE_MODEL_PREFERENCE[0];
    this.available = health.availableImageModels || [];
    this.requestedSize = config.OPENAI_IMAGE_SIZE || '1024x1536';
  }

  /** Models to try, best first, limited to what the account can see. */
  #candidates() {
    const seen = new Set([this.model]);
    const chain = [this.model];
    for (const model of IMAGE_MODEL_PREFERENCE) {
      if (seen.has(model)) continue;
      if (this.available.length && !this.available.includes(model)) continue;
      seen.add(model);
      chain.push(model);
    }
    return chain;
  }

  async #toBuffer(payload) {
    const first = payload?.data?.[0];
    if (!first) throw new Error('OpenAI returned no image data.');

    if (first.b64_json) return Buffer.from(first.b64_json, 'base64');

    if (first.url) {
      const res = await fetch(first.url);
      if (!res.ok) throw new Error(`Could not download the generated image: ${res.status} ${res.statusText}`);
      return Buffer.from(await res.arrayBuffer());
    }

    throw new Error('OpenAI image response contained neither b64_json nor url.');
  }

  async #generate(model, prompt) {
    const caps = capabilities(model);
    const options = { model, prompt, n: 1, size: resolveSize(model, this.requestedSize) };
    if (!caps.returnsBase64) options.response_format = 'b64_json';
    return this.openai.images.generate(options);
  }

  /** Restages the reader's own photograph, which is what preserves the face. */
  async #edit(model, prompt, reference) {
    const caps = capabilities(model);
    const extension = EXT_BY_MIME[reference.mimeType] || '.png';
    const image = await toFile(reference.buffer, `reference${extension}`, { type: reference.mimeType });

    const options = { model, image, prompt, n: 1, size: resolveSize(model, this.requestedSize) };
    if (caps.supportsInputFidelity) options.input_fidelity = 'high';

    try {
      return await this.openai.images.edit(options);
    } catch (error) {
      // A capability table can fall behind the API. If the model rejects a
      // parameter, drop it and try once more rather than losing the edit — and
      // with it the reader's likeness.
      if (isUnsupportedParameter(error) && options.input_fidelity) {
        console.warn(`[OpenAIImageProvider] ${model} rejected input_fidelity; retrying without it.`);
        delete options.input_fidelity;
        return this.openai.images.edit(options);
      }
      throw error;
    }
  }

  /**
   * One path for both timelines. Walks the candidate models until one produces
   * an image, preferring an identity-preserving edit whenever a consented
   * photograph is on disk.
   */
  async #render({ label, prompt, promptWithoutReference, referenceAssetId }) {
    // Read through the storage service rather than the filesystem, so a
    // consented photo is found whether it lives on disk or in the database.
    const reference = referenceAssetId ? await StorageService.readReference(referenceAssetId) : null;
    const hasReference = Boolean(reference?.buffer?.length);

    if (referenceAssetId && !hasReference) {
      console.warn(`[OpenAIImageProvider] Reference asset ${referenceAssetId} could not be read; generating without it.`);
    }

    const attempt = async (model) => {
      if (hasReference && capabilities(model).supportsEdit) {
        try {
          console.log(`[OpenAIImageProvider] ${label}: identity-preserving edit via ${model}.`);
          return await this.#edit(model, prompt, reference);
        } catch (editError) {
          if (isAuthFailure(editError) || isModelUnavailable(editError)) throw editError;
          console.warn(
            `[OpenAIImageProvider] ${label}: edit failed on ${model} (${editError.message}). ` +
              'Falling back to generation with the identity-preservation prompt.'
          );
        }
      }
      console.log(`[OpenAIImageProvider] ${label}: generating via ${model}.`);
      return this.#generate(model, hasReference ? prompt : promptWithoutReference);
    };

    let payload = null;
    let lastError = null;

    for (const model of this.#candidates()) {
      try {
        payload = await attempt(model);
        if (model !== this.model) {
          console.warn(`[OpenAIImageProvider] Produced with "${model}" after "${this.model}" was unusable.`);
        }
        break;
      } catch (error) {
        lastError = error;

        if (isAuthFailure(error)) {
          const err = new Error(
            'OpenAI rejected the API key. Create a new key, update OPENAI_API_KEY in the backend .env, and restart.'
          );
          err.code = 'PROVIDER_NOT_CONFIGURED';
          err.isCustomError = true;
          err.statusCode = 503;
          throw err;
        }

        if (isModelUnavailable(error)) {
          console.warn(`[OpenAIImageProvider] "${model}" is not available to this account; trying the next model.`);
          continue;
        }

        break; // A real generation failure: retrying other models will not help.
      }
    }

    if (!payload) {
      console.error(`[OpenAIImageProvider] ${label}: all candidate models failed — ${lastError?.message}`);
      const err = new Error(`OpenAI image generation failed: ${lastError?.message || 'no model produced an image'}`);
      err.code = 'GENERATION_FAILED';
      err.isCustomError = true;
      err.statusCode = 502;
      throw err;
    }

    let buffer;
    try {
      buffer = await this.#toBuffer(payload);
    } catch (bufferError) {
      console.error(`[OpenAIImageProvider] ${label}: could not read image bytes — ${bufferError.message}`);
      const err = new Error('Could not persist the generated portrait from the provider.');
      err.code = 'GENERATION_FAILED';
      err.isCustomError = true;
      err.statusCode = 502;
      throw err;
    }

    const saved = await StorageService.saveGeneratedPortrait(buffer, '.png', 'image/png');
    console.log(`[OpenAIImageProvider] ${label}: saved ${(buffer.length / 1024).toFixed(0)}KB as ${saved.assetId}`);
    return saved;
  }

  async generatePortrait(characterProfile, preferences, referenceAssetId = null) {
    return this.#render({
      label: `past portrait for ${characterProfile.characterName}`,
      prompt: PromptService.getImagePrompt(characterProfile, preferences, true),
      promptWithoutReference: PromptService.getImagePrompt(characterProfile, preferences, false),
      referenceAssetId,
    });
  }

  async generateFuturePortrait(futureProfile, preferences, referenceAssetId = null) {
    return this.#render({
      label: `2050 portrait for ${futureProfile.personaName}`,
      prompt: PromptService.getFutureImagePrompt(futureProfile, preferences, true),
      promptWithoutReference: PromptService.getFutureImagePrompt(futureProfile, preferences, false),
      referenceAssetId,
    });
  }
}
