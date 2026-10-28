import fs from 'fs';
import OpenAI from 'openai';
import { ImageProvider } from './ImageProvider.js';
import { PromptService } from '../../services/prompt.service.js';
import { StorageService } from '../../services/storage.service.js';
import { config } from '../../config/env.js';

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

    this.openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
    });
    this.model = config.OPENAI_IMAGE_MODEL || 'dall-e-3';
  }

  async generatePortrait(characterProfile, preferences, referenceAssetId = null) {
    const hasPhoto = Boolean(referenceAssetId);
    const prompt = PromptService.getImagePrompt(characterProfile, preferences, hasPhoto);

    console.log(`[OpenAIImageProvider] Generating portrait for: ${characterProfile.characterName} (Reference photo: ${hasPhoto})`);

    let imageUrl = null;
    let imageBuffer = null;

    if (hasPhoto) {
      const referencePath = StorageService.getReferencePath(referenceAssetId);
      if (referencePath && fs.existsSync(referencePath)) {
        try {
          console.log(`[OpenAIImageProvider] Attempting OpenAI image edit with reference photo: ${referencePath}`);
          // Attempt official images.edit endpoint
          const response = await this.openai.images.edit({
            image: fs.createReadStream(referencePath),
            prompt: prompt,
            n: 1,
            size: '1024x1024',
          });
          imageUrl = response.data?.[0]?.url;
        } catch (editError) {
          console.warn(`[OpenAIImageProvider] OpenAI images.edit attempt failed (${editError.message}). Falling back to high-fidelity generation with identity prompt.`);
          // Fallback to high-fidelity generation with the strict identity-preservation prompt
          const genResponse = await this.openai.images.generate({
            model: this.model,
            prompt: prompt,
            n: 1,
            size: '1024x1024',
            quality: 'standard',
          });
          imageUrl = genResponse.data?.[0]?.url;
        }
      } else {
        console.warn(`[OpenAIImageProvider] Reference asset ${referenceAssetId} not found on disk. Generating without reference.`);
        const genResponse = await this.openai.images.generate({
          model: this.model,
          prompt: PromptService.getImagePrompt(characterProfile, preferences, false),
          n: 1,
          size: '1024x1024',
        });
        imageUrl = genResponse.data?.[0]?.url;
      }
    } else {
      // Standard image generation
      try {
        const response = await this.openai.images.generate({
          model: this.model,
          prompt: prompt,
          n: 1,
          size: '1024x1024',
        });
        imageUrl = response.data?.[0]?.url;
      } catch (genError) {
        console.error(`[OpenAIImageProvider Error] Image generation failed:`, genError.message);
        const err = new Error(`OpenAI image generation failed: ${genError.message}`);
        err.code = 'GENERATION_FAILED';
        err.isCustomError = true;
        err.statusCode = 502;
        throw err;
      }
    }

    if (!imageUrl) {
      const err = new Error('No image URL returned by OpenAI.');
      err.code = 'GENERATION_FAILED';
      err.isCustomError = true;
      err.statusCode = 502;
      throw err;
    }

    // Download the generated image bytes and store locally in private storage
    try {
      console.log(`[OpenAIImageProvider] Downloading generated image from OpenAI CDN...`);
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) {
        throw new Error(`Failed to fetch image from CDN: ${imgRes.statusText}`);
      }
      const arrayBuffer = await imgRes.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } catch (dlError) {
      console.error(`[OpenAIImageProvider Error] Could not download image bytes:`, dlError.message);
      const err = new Error('Could not persist generated portrait from provider.');
      err.code = 'GENERATION_FAILED';
      err.isCustomError = true;
      err.statusCode = 502;
      throw err;
    }

    const saved = await StorageService.saveGeneratedPortrait(imageBuffer, '.png', 'image/png');
    console.log(`[OpenAIImageProvider] Portrait saved successfully as asset: ${saved.assetId}`);
    return saved;
  }
}
