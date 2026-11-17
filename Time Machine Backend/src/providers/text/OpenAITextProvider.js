import OpenAI from 'openai';
import { TextProvider } from './TextProvider.js';
import { PromptService } from '../../services/prompt.service.js';
import { config } from '../../config/env.js';

const MAX_ATTEMPTS = 2;

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

    this.openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });
    this.model = config.OPENAI_TEXT_MODEL || 'gpt-4o-mini';
  }

  /**
   * Shared request/retry/parse loop. `validate` throws when the payload is
   * unusable, which triggers one retry before the error is surfaced.
   */
  async #completeJson({ label, systemPrompt, userPrompt, validate, maxTokens }) {
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        console.log(`[OpenAITextProvider] ${label} via ${this.model} (attempt ${attempt}/${MAX_ATTEMPTS})`);

        const response = await this.openai.chat.completions.create({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.85,
          max_tokens: maxTokens,
        });

        const rawContent = response.choices?.[0]?.message?.content;
        if (!rawContent) throw new Error('Empty response received from OpenAI text model.');

        const parsed = JSON.parse(rawContent);
        validate(parsed);
        return parsed;
      } catch (err) {
        lastError = err;
        console.error(`[OpenAITextProvider] ${label} attempt ${attempt} failed: ${err.message}`);
      }
    }

    const customErr = new Error(`OpenAI ${label} failed: ${lastError?.message || 'unknown error'}`);
    customErr.code = 'GENERATION_FAILED';
    customErr.isCustomError = true;
    customErr.statusCode = 502;
    throw customErr;
  }

  async generateStory(characterProfile, celestialSignature, preferences) {
    const parsed = await this.#completeJson({
      label: 'past-life story generation',
      systemPrompt: PromptService.getStorySystemPrompt(),
      userPrompt: PromptService.getStoryUserPrompt(characterProfile, celestialSignature, preferences),
      maxTokens: 3000,
      validate: (p) => {
        if (!p.storySections?.origins || !p.storySections?.conclusion) {
          throw new Error('OpenAI returned an incomplete storySections structure.');
        }
      },
    });

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
      disclaimer: parsed.disclaimer || PromptService.PAST_DISCLAIMER,
    };
  }

  async generateFuture(futureProfile, celestialSignature, preferences) {
    const parsed = await this.#completeJson({
      label: '2050 chronicle generation',
      systemPrompt: PromptService.getFutureSystemPrompt(),
      userPrompt: PromptService.getFutureUserPrompt(futureProfile, celestialSignature, preferences),
      maxTokens: 3200,
      validate: (p) => {
        if (!p.futureSections?.arrival || !p.futureSections?.horizon) {
          throw new Error('OpenAI returned an incomplete futureSections structure.');
        }
      },
    });

    return {
      title: parsed.title || `${futureProfile.personaName} — ${futureProfile.roleTitle}`,
      futureSections: {
        arrival: parsed.futureSections.arrival || '',
        dailyLife: parsed.futureSections.dailyLife || '',
        breakthrough: parsed.futureSections.breakthrough || '',
        connections: parsed.futureSections.connections || '',
        horizon: parsed.futureSections.horizon || '',
      },
      futureSignalsNarrative: Array.isArray(parsed.futureSignalsNarrative) ? parsed.futureSignalsNarrative : [],
      presentDayDirective: parsed.presentDayDirective || '',
      disclaimer: parsed.disclaimer || PromptService.FUTURE_DISCLAIMER,
    };
  }
}
