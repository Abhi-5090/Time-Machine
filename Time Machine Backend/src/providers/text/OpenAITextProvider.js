import OpenAI from 'openai';
import { TextProvider } from './TextProvider.js';
import { PromptService } from '../../services/prompt.service.js';
import { config } from '../../config/env.js';

export class OpenAITextProvider extends TextProvider {
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
    this.model = config.OPENAI_TEXT_MODEL || 'gpt-4o-mini';
  }

  async generateStory(characterProfile, celestialSignature, preferences) {
    const systemPrompt = PromptService.getStorySystemPrompt();
    const userPrompt = PromptService.getStoryUserPrompt(characterProfile, celestialSignature, preferences);

    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`[OpenAITextProvider] Requesting story generation with model: ${this.model} (attempt ${attempts})`);
        
        const response = await this.openai.chat.completions.create({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.8,
          max_tokens: 3000,
        });

        const rawContent = response.choices?.[0]?.message?.content;
        if (!rawContent) {
          throw new Error('Empty response received from OpenAI text model.');
        }

        const parsed = JSON.parse(rawContent);

        // Validate required sections
        if (!parsed.storySections || !parsed.storySections.origins || !parsed.storySections.conclusion) {
          throw new Error('OpenAI returned incomplete story JSON structure.');
        }

        return {
          title: parsed.title || `${characterProfile.characterName} — ${characterProfile.occupation}`,
          storySections: {
            origins: parsed.storySections.origins || '',
            dailyLife: parsed.storySections.dailyLife || '',
            turningPoint: parsed.storySections.turningPoint || '',
            relationships: parsed.storySections.relationships || '',
            conclusion: parsed.storySections.conclusion || '',
          },
          symbolicKarmicThemes: Array.isArray(parsed.symbolicKarmicThemes) ? parsed.symbolicKarmicThemes : [],
          presentDayReflection: parsed.presentDayReflection || '',
          disclaimer:
            parsed.disclaimer ||
            'This is an imaginative, astrology-inspired entertainment reading. It does not claim to prove reincarnation, diagnose personal conditions, or provide verified historical facts.',
        };
      } catch (err) {
        console.error(`[OpenAITextProvider Error] Attempt ${attempts} failed:`, err.message);
        if (attempts >= maxAttempts) {
          const customErr = new Error(`OpenAI text generation failed: ${err.message}`);
          customErr.code = 'GENERATION_FAILED';
          customErr.isCustomError = true;
          customErr.statusCode = 502;
          throw customErr;
        }
      }
    }
  }
}
