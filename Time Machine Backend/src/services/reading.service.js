import { v4 as uuidv4 } from 'uuid';
import { Reading } from '../models/Reading.js';
import { GenerationJob } from '../models/GenerationJob.js';
import { UserProfile } from '../models/UserProfile.js';
import { ZodiacService } from './zodiac.service.js';
import { InterpretationService } from './interpretation.service.js';
import { ForesightService } from './foresight.service.js';
import { StorageService } from './storage.service.js';
import { MockTextProvider } from '../providers/text/MockTextProvider.js';
import { OpenAITextProvider } from '../providers/text/OpenAITextProvider.js';
import { MockImageProvider } from '../providers/image/MockImageProvider.js';
import { OpenAIImageProvider } from '../providers/image/OpenAIImageProvider.js';
import { PromptService } from './prompt.service.js';
import { ZODIAC_SIGNS, getZodiacSignByName } from '../constants/zodiac.js';
import { getStages } from '../constants/stages.js';
import { hashString } from '../utils/deterministic.js';
import { config } from '../config/env.js';
import { isProviderLive, getProviderHealth } from './providerHealth.js';

const MAX_RETRIES = 3;

function appError(message, code, statusCode) {
  const err = new Error(message);
  err.code = code;
  err.isCustomError = true;
  err.statusCode = statusCode;
  return err;
}

/**
 * Chooses the generators for a reading.
 *
 * Live output is used only when the boot-time preflight actually succeeded.
 * Attempting it with a key already known to be rejected would make every
 * reader wait out an API timeout before failing, so a known-bad provider
 * degrades to the offline generator immediately — the reading still completes
 * end to end, with a placeholder portrait and an honest note.
 */
function getProviders() {
  const live = isProviderLive();
  if (!live) {
    const health = getProviderHealth();
    return {
      textProvider: new MockTextProvider(),
      imageProvider: new MockImageProvider(),
      providerMode: 'mock',
      degradedReason:
        config.AI_PROVIDER_MODE === 'openai' && !health.live ? health.reason : null,
    };
  }

  return {
    textProvider: new OpenAITextProvider(),
    imageProvider: new OpenAIImageProvider(),
    providerMode: 'openai',
    degradedReason: null,
  };
}

export class ReadingService {
  /**
   * Resolves the star sign used by both timelines.
   *
   * `past` readings require an explicit sign (enforced by the validator).
   * `future` readings treat it as a motif, so it is derived from the date of
   * birth when possible and otherwise chosen deterministically from the name —
   * never left empty, because downstream code assumes a valid sign.
   */
  static resolveSign({ timeline, profile }) {
    const alignment = ZodiacService.validateSignAlignment({
      dateOfBirth: profile.dateOfBirth,
      selectedZodiacSign: profile.selectedZodiacSign,
      inputMode: profile.zodiacInputMode || 'manual_symbolic_choice',
    });

    if (alignment.effectiveSign) return alignment;

    if (timeline === 'future') {
      const seed = hashString(profile.preferredName || profile.dateOfBirth || 'unsigned');
      const fallback = ZODIAC_SIGNS[seed % ZODIAC_SIGNS.length];
      return {
        ...alignment,
        effectiveSign: fallback.name,
        zodiacData: fallback,
        isConsistent: true,
      };
    }

    throw appError(
      'A star sign is required for a Time Machine reading.',
      'VALIDATION_ERROR',
      400
    );
  }

  /** Persists the reader's profile. Failure is non-fatal: the reading still runs. */
  static async persistProfile({ profile, preferences, consent, effectiveSign }) {
    try {
      const userProfile = new UserProfile({
        preferredName: profile.preferredName || '',
        dateOfBirth: profile.dateOfBirth || null,
        selectedZodiacSign: effectiveSign,
        zodiacInputMode: profile.zodiacInputMode || 'manual_symbolic_choice',
        birthTime: profile.birthTime || '',
        birthplace: profile.birthplace || '',
        astrologyMode: profile.astrologyMode || 'mystical_zodiac',
        preferredLanguage: profile.preferredLanguage || 'en',
        preferences: preferences || {},
        consent: {
          readingProcessing: true,
          fictionalReadingAcknowledged: true,
          photoProcessing: Boolean(consent.photoProcessing),
          consentedAt: new Date(),
        },
        photoAssetId: profile.photoAssetId || null,
      });
      await userProfile.save();
      return userProfile;
    } catch (dbErr) {
      console.warn('[ReadingService] UserProfile persistence skipped:', dbErr.message);
      return null;
    }
  }

  /**
   * Creates a reading and kicks off generation in the background.
   * Returns as soon as the record exists so the client can start polling.
   */
  static async createReading({ timeline = 'past', profile, preferences = {}, consent, ownerToken }) {
    if (!consent?.readingProcessing || !consent?.fictionalReadingAcknowledged) {
      throw appError(
        'You must acknowledge that this is a work of fiction and consent to processing before continuing.',
        'CONSENT_REQUIRED',
        400
      );
    }

    const alignment = this.resolveSign({ timeline, profile });
    const effectiveSign = alignment.effectiveSign;
    const zodiacData = alignment.zodiacData || getZodiacSignByName(effectiveSign);

    const userProfile = await this.persistProfile({ profile, preferences, consent, effectiveSign });

    const readingId = `rd_${uuidv4()}`;
    const token = ownerToken || uuidv4();
    const jobId = `job_${uuidv4()}`;
    const { providerMode, degradedReason } = getProviders();
    const [firstStage] = getStages(timeline);

    const reading = new Reading({
      readingId,
      ownerToken: token,
      timeline,
      profileId: userProfile ? userProfile._id : null,
      profileSummary: {
        preferredName: profile.preferredName || '',
        selectedSign: effectiveSign,
        zodiacInputMode: profile.zodiacInputMode,
        derivedSign: alignment.derivedSign,
        hasReferencePhoto: Boolean(profile.photoAssetId && consent.photoProcessing),
      },
      status: 'processing',
      currentStage: firstStage.id,
      stageProgressPercent: 15,
      providerMode,
      degradedReason,
      celestialSignature: {
        mode: 'mystical_zodiac',
        selectedSign: effectiveSign,
        derivedSign: alignment.derivedSign,
        symbolicThemes: zodiacData?.symbolicThemes || ['Wisdom', 'Mystery'],
        inputMode: profile.zodiacInputMode,
        element: zodiacData?.element || 'Celestial',
        ruler: zodiacData?.ruler || 'Starlight',
        mythicRealm: zodiacData?.mythicRealm || 'The Astral Sphere',
      },
      disclaimer: timeline === 'future' ? PromptService.FUTURE_DISCLAIMER : PromptService.PAST_DISCLAIMER,
    });

    if (timeline === 'past') {
      reading.archetype = { id: preferences.archetypeId || 'auto', name: 'Awaiting alignment', description: '' };
    }

    await reading.save();

    await new GenerationJob({
      jobId,
      readingId,
      jobType: 'all',
      status: 'processing',
      currentStage: firstStage.id,
      startedAt: new Date(),
    }).save();

    this.executeGeneration({ readingId, timeline, profile, preferences, consent, jobId }).catch((err) => {
      console.error(`[ReadingService] Background generation crashed for ${readingId}:`, err);
    });

    return {
      readingId,
      ownerToken: token,
      timeline,
      status: 'processing',
      currentStage: firstStage.id,
      jobId,
    };
  }

  /** Advances the stored stage so pollers see live progress. */
  static async advance(reading, stageId, timeline) {
    const stage = getStages(timeline).find((s) => s.id === stageId);
    reading.currentStage = stageId;
    reading.stageProgressPercent = stage ? stage.progress : reading.stageProgressPercent;
    await reading.save();
  }

  static async executeGeneration({ readingId, timeline, profile, preferences, consent, jobId }) {
    const reading = await Reading.findOne({ readingId });
    if (!reading) return;

    const { textProvider, imageProvider } = getProviders();
    const referenceAssetId =
      consent.photoProcessing && profile.photoAssetId ? profile.photoAssetId : null;

    try {
      if (timeline === 'future') {
        await this.#generateFuture({ reading, profile, preferences, textProvider, imageProvider, referenceAssetId });
      } else {
        await this.#generatePast({ reading, profile, preferences, textProvider, imageProvider, referenceAssetId });
      }

      reading.currentStage = 'completed';
      reading.stageProgressPercent = 100;
      reading.status = 'completed';
      await reading.save();

      await GenerationJob.findOneAndUpdate(
        { jobId },
        { status: 'completed', currentStage: 'completed', completedAt: new Date() }
      );

      console.log(`[ReadingService] ${timeline} reading ${readingId} completed.`);
    } catch (err) {
      console.error(`[ReadingService] Generation failed for ${readingId}:`, err);
      reading.status = 'failed';
      reading.currentStage = 'failed';
      reading.errorMessage = err.message || 'Generation was interrupted. Please try again.';
      await reading.save();

      await GenerationJob.findOneAndUpdate(
        { jobId },
        { status: 'failed', errorCode: err.code || 'GENERATION_FAILED', errorMessage: err.message }
      );
    }
  }

  static async #generatePast({ reading, profile, preferences, textProvider, imageProvider, referenceAssetId }) {
    await this.advance(reading, 'preparing_profile', 'past');
    await this.advance(reading, 'shaping_character', 'past');

    const characterProfile = InterpretationService.buildCharacterProfile({
      profile,
      preferences,
      effectiveSign: reading.celestialSignature.selectedSign,
    });

    reading.characterProfile = characterProfile;
    reading.archetype = {
      id: characterProfile.archetypeId,
      name: characterProfile.archetypeName,
      description: `The soul archetype of ${characterProfile.characterTraits.join(', ').toLowerCase()}.`,
    };
    reading.imaginedSetting = {
      era: characterProfile.era,
      description: `${characterProfile.eraName} — ${characterProfile.setting}`,
    };
    await reading.save();

    await this.advance(reading, 'writing_story', 'past');
    const story = await textProvider.generateStory(
      characterProfile,
      reading.celestialSignature,
      preferences
    );

    const fallback = InterpretationService.buildSymbolicThemesAndReflection(
      characterProfile,
      reading.celestialSignature.selectedSign
    );

    reading.title = story.title || `${characterProfile.characterName} — ${characterProfile.occupation}`;
    reading.storySections = story.storySections;
    reading.symbolicKarmicThemes = story.symbolicKarmicThemes?.length
      ? story.symbolicKarmicThemes
      : fallback.symbolicKarmicThemes;
    reading.presentDayReflection = story.presentDayReflection || fallback.presentDayReflection;
    reading.disclaimer = story.disclaimer || PromptService.PAST_DISCLAIMER;
    await reading.save();

    await this.advance(reading, 'creating_portrait', 'past');
    const portrait = await imageProvider.generatePortrait(characterProfile, preferences, referenceAssetId);
    reading.portraitAssetId = portrait.assetId;
    reading.portraitUrl = `${config.API_BASE_PATH}/portraits/${portrait.assetId}`;
    await reading.save();
  }

  static async #generateFuture({ reading, profile, preferences, textProvider, imageProvider, referenceAssetId }) {
    await this.advance(reading, 'calibrating_signal', 'future');
    await this.advance(reading, 'projecting_persona', 'future');

    const futureProfile = ForesightService.buildFutureProfile({
      profile,
      preferences,
      effectiveSign: reading.celestialSignature.selectedSign,
    });

    reading.futureProfile = futureProfile;
    reading.signals = ForesightService.buildSignals(futureProfile);
    reading.timelineMarkers = ForesightService.buildTimelineMarkers(futureProfile);
    reading.archetype = {
      id: futureProfile.archetypeId,
      name: futureProfile.archetypeName,
      description: futureProfile.archetypeSummary,
    };
    reading.imaginedSetting = {
      era: String(futureProfile.targetYear),
      description: `${futureProfile.habitatName} — ${futureProfile.habitatTagline}`,
    };
    await reading.save();

    await this.advance(reading, 'composing_chronicle', 'future');
    const chronicle = await textProvider.generateFuture(
      futureProfile,
      reading.celestialSignature,
      preferences
    );

    reading.title = chronicle.title || `${futureProfile.personaName} — ${futureProfile.roleTitle}`;
    reading.futureSections = chronicle.futureSections;
    reading.futureSignalsNarrative = chronicle.futureSignalsNarrative || [];
    reading.presentDayDirective =
      chronicle.presentDayDirective || ForesightService.buildPresentDayDirective(futureProfile);
    reading.disclaimer = chronicle.disclaimer || PromptService.FUTURE_DISCLAIMER;
    await reading.save();

    await this.advance(reading, 'rendering_portrait', 'future');
    const portrait = await imageProvider.generateFuturePortrait(futureProfile, preferences, referenceAssetId);
    reading.portraitAssetId = portrait.assetId;
    reading.portraitUrl = `${config.API_BASE_PATH}/portraits/${portrait.assetId}`;
    await reading.save();
  }

  static async getReading(readingId) {
    return Reading.findOne({ readingId });
  }

  /**
   * Re-renders the portrait only. The narrative is deliberately preserved so a
   * retry never changes the story the reader has already seen.
   */
  static async retryGeneration(readingId) {
    const reading = await Reading.findOne({ readingId });
    if (!reading) throw appError('Reading not found.', 'READING_NOT_FOUND', 404);

    if (reading.retryCount >= MAX_RETRIES) {
      throw appError(
        `This reading has already been retried ${MAX_RETRIES} times.`,
        'RATE_LIMITED',
        429
      );
    }

    const timeline = reading.timeline || 'past';
    const portraitStage = timeline === 'future' ? 'rendering_portrait' : 'creating_portrait';

    reading.retryCount += 1;
    reading.status = 'processing';
    reading.currentStage = portraitStage;
    reading.stageProgressPercent = 90;
    reading.errorMessage = null;
    await reading.save();

    const { imageProvider } = getProviders();

    (async () => {
      try {
        const owner = reading.profileId ? await UserProfile.findById(reading.profileId) : null;
        const referenceAssetId = reading.profileSummary?.hasReferencePhoto ? owner?.photoAssetId || null : null;
        const preferences = owner?.preferences ? owner.preferences.toObject?.() ?? owner.preferences : {};

        const portrait =
          timeline === 'future'
            ? await imageProvider.generateFuturePortrait(reading.futureProfile, preferences, referenceAssetId)
            : await imageProvider.generatePortrait(reading.characterProfile, preferences, referenceAssetId);

        // Clean up the superseded asset so retries don't accumulate orphans.
        const previousAssetId = reading.portraitAssetId;
        reading.portraitAssetId = portrait.assetId;
        reading.portraitUrl = `${config.API_BASE_PATH}/portraits/${portrait.assetId}`;
        reading.status = 'completed';
        reading.currentStage = 'completed';
        reading.stageProgressPercent = 100;
        await reading.save();

        if (previousAssetId && previousAssetId !== portrait.assetId) {
          await StorageService.deletePortrait(previousAssetId).catch(() => {});
        }
      } catch (retryErr) {
        reading.status = 'failed';
        reading.currentStage = 'failed';
        reading.errorMessage = retryErr.message;
        await reading.save();
      }
    })();

    return {
      readingId,
      timeline,
      status: 'processing',
      currentStage: portraitStage,
      retryCount: reading.retryCount,
    };
  }

  /** Permanently removes the reading, its portrait, and the stored profile. */
  static async deleteReading(readingId) {
    const reading = await Reading.findOne({ readingId });
    if (!reading) return false;

    if (reading.portraitAssetId) {
      await StorageService.deletePortrait(reading.portraitAssetId).catch(() => {});
    }

    if (reading.profileId) {
      const profile = await UserProfile.findById(reading.profileId);
      if (profile?.photoAssetId) {
        await StorageService.deleteReferencePhoto(profile.photoAssetId).catch(() => {});
      }
      await UserProfile.findByIdAndDelete(reading.profileId);
    }

    await Reading.findOneAndDelete({ readingId });
    await GenerationJob.deleteMany({ readingId });
    return true;
  }
}
