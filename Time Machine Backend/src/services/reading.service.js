import { v4 as uuidv4 } from 'uuid';
import { Reading } from '../models/Reading.js';
import { GenerationJob } from '../models/GenerationJob.js';
import { UserProfile } from '../models/UserProfile.js';
import { ZodiacService } from './zodiac.service.js';
import { InterpretationService } from './interpretation.service.js';
import { StorageService } from './storage.service.js';
import { MockTextProvider } from '../providers/text/MockTextProvider.js';
import { OpenAITextProvider } from '../providers/text/OpenAITextProvider.js';
import { MockImageProvider } from '../providers/image/MockImageProvider.js';
import { OpenAIImageProvider } from '../providers/image/OpenAIImageProvider.js';
import { config } from '../config/env.js';

function getProviders() {
  const isLive = config.AI_PROVIDER_MODE === 'openai' && Boolean(config.OPENAI_API_KEY);
  return {
    textProvider: isLive ? new OpenAITextProvider() : new MockTextProvider(),
    imageProvider: isLive ? new OpenAIImageProvider() : new MockImageProvider(),
    providerMode: isLive ? 'openai' : 'mock',
  };
}

export class ReadingService {
  /**
   * Initializes a new reading and generation job.
   */
  static async createReading({ profile, preferences, consent, ownerToken }) {
    // 1. Enforce required consents
    if (!consent?.readingProcessing || !consent?.fictionalReadingAcknowledged) {
      const err = new Error('You must acknowledge that this is a fictional entertainment reading and consent to processing.');
      err.code = 'CONSENT_REQUIRED';
      err.isCustomError = true;
      err.statusCode = 400;
      throw err;
    }

    // 2. Validate zodiac alignment and calculate effective sign
    const alignment = ZodiacService.validateSignAlignment({
      dateOfBirth: profile.dateOfBirth,
      selectedZodiacSign: profile.selectedZodiacSign,
      inputMode: profile.zodiacInputMode || 'manual_symbolic_choice',
    });

    const effectiveSign = alignment.effectiveSign;
    const zodiacData = alignment.zodiacData;

    // 3. Save or persist profile
    let userProfile = null;
    try {
      userProfile = new UserProfile({
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
    } catch (dbErr) {
      console.warn('[ReadingService] MongoDB UserProfile save skipped or failed:', dbErr.message);
    }

    const readingId = `rd_${uuidv4()}`;
    const token = ownerToken || uuidv4();
    const jobId = `job_${uuidv4()}`;
    const { providerMode } = getProviders();

    // 4. Create reading record in database
    const reading = new Reading({
      readingId,
      ownerToken: token,
      profileId: userProfile ? userProfile._id : null,
      profileSummary: {
        preferredName: profile.preferredName || '',
        selectedSign: effectiveSign,
        zodiacInputMode: profile.zodiacInputMode,
        derivedSign: alignment.derivedSign,
        hasReferencePhoto: Boolean(profile.photoAssetId && consent.photoProcessing),
      },
      status: 'processing',
      currentStage: 'preparing_profile',
      stageProgressPercent: 15,
      providerMode,
      celestialSignature: {
        mode: 'mystical_zodiac',
        selectedSign: effectiveSign,
        derivedSign: alignment.derivedSign,
        symbolicThemes: zodiacData ? zodiacData.symbolicThemes : ['Wisdom', 'Mystery'],
        inputMode: profile.zodiacInputMode,
        element: zodiacData?.element || 'Celestial',
        ruler: zodiacData?.ruler || 'Starlight',
        mythicRealm: zodiacData?.mythicRealm || 'The Astral Sphere',
      },
      archetype: {
        id: preferences.archetypeId || 'auto',
        name: 'Pending Celestial Calculation',
        description: '',
      },
    });

    await reading.save();

    const job = new GenerationJob({
      jobId,
      readingId,
      jobType: 'all',
      status: 'processing',
      currentStage: 'preparing_profile',
      startedAt: new Date(),
    });
    await job.save();

    // 5. Kick off asynchronous generation
    this.executeGeneration(readingId, profile, preferences, consent, jobId).catch((err) => {
      console.error(`[ReadingService] Background generation failed for ${readingId}:`, err);
    });

    return {
      readingId,
      ownerToken: token,
      status: 'processing',
      currentStage: 'preparing_profile',
      jobId,
    };
  }

  /**
   * Executes the multi-stage generation asynchronously.
   */
  static async executeGeneration(readingId, profile, preferences, consent, jobId) {
    const reading = await Reading.findOne({ readingId });
    if (!reading) return;

    const { textProvider, imageProvider } = getProviders();

    try {
      // Stage 1: Preparing profile
      reading.currentStage = 'preparing_profile';
      reading.stageProgressPercent = 25;
      await reading.save();

      // Stage 2: Shaping character
      reading.currentStage = 'shaping_character';
      reading.stageProgressPercent = 45;
      await reading.save();

      const characterProfile = InterpretationService.buildCharacterProfile({
        profile,
        preferences,
        effectiveSign: reading.celestialSignature.selectedSign,
      });

      reading.characterProfile = characterProfile;
      reading.archetype = {
        id: characterProfile.archetypeId,
        name: characterProfile.archetypeName,
        description: `The sacred soul archetype representing ${characterProfile.characterTraits.join(', ')}.`,
      };
      reading.imaginedSetting = {
        era: characterProfile.era,
        description: `${characterProfile.eraName} — ${characterProfile.setting}`,
      };
      await reading.save();

      // Stage 3: Writing story
      reading.currentStage = 'writing_story';
      reading.stageProgressPercent = 65;
      await reading.save();

      const storyData = await textProvider.generateStory(
        characterProfile,
        reading.celestialSignature,
        preferences
      );

      reading.storySections = storyData.storySections;
      reading.symbolicKarmicThemes = storyData.symbolicKarmicThemes;
      reading.presentDayReflection = storyData.presentDayReflection;
      reading.disclaimer = storyData.disclaimer;
      await reading.save();

      // Stage 4: Creating portrait
      reading.currentStage = 'creating_portrait';
      reading.stageProgressPercent = 85;
      await reading.save();

      const referenceAssetId = consent.photoProcessing && profile.photoAssetId ? profile.photoAssetId : null;
      const portraitAsset = await imageProvider.generatePortrait(
        characterProfile,
        preferences,
        referenceAssetId
      );

      reading.portraitAssetId = portraitAsset.assetId;
      reading.portraitUrl = `/api/v1/portraits/${portraitAsset.assetId}`;

      // Complete!
      reading.currentStage = 'completed';
      reading.stageProgressPercent = 100;
      reading.status = 'completed';
      await reading.save();

      await GenerationJob.findOneAndUpdate(
        { jobId },
        { status: 'completed', currentStage: 'completed', completedAt: new Date() }
      );

      console.log(`[ReadingService] Reading ${readingId} completed successfully!`);
    } catch (err) {
      console.error(`[ReadingService] Generation failed for ${readingId}:`, err);
      reading.status = 'failed';
      reading.currentStage = 'failed';
      reading.errorMessage = err.message || 'Celestial alignment disrupted during generation.';
      await reading.save();

      await GenerationJob.findOneAndUpdate(
        { jobId },
        { status: 'failed', errorCode: err.code || 'GENERATION_FAILED', errorMessage: err.message }
      );
    }
  }

  /**
   * Retrieves reading by ID.
   */
  static async getReading(readingId) {
    const reading = await Reading.findOne({ readingId });
    if (!reading) return null;
    return reading;
  }

  /**
   * Retries portrait or full generation.
   */
  static async retryGeneration(readingId, ownerToken) {
    const reading = await Reading.findOne({ readingId });
    if (!reading) {
      const err = new Error('Reading not found.');
      err.code = 'READING_NOT_FOUND';
      err.isCustomError = true;
      err.statusCode = 404;
      throw err;
    }

    if (reading.retryCount >= 3) {
      const err = new Error('Maximum retry attempts reached for this reading.');
      err.code = 'RATE_LIMITED';
      err.isCustomError = true;
      err.statusCode = 429;
      throw err;
    }

    reading.retryCount += 1;
    reading.status = 'processing';
    reading.currentStage = 'creating_portrait';
    reading.stageProgressPercent = 80;
    reading.errorMessage = null;
    await reading.save();

    const jobId = `job_${uuidv4()}`;
    const { imageProvider } = getProviders();

    // Asynchronously retry portrait
    (async () => {
      try {
        const referenceAssetId = reading.profileSummary?.hasReferencePhoto
          ? (await UserProfile.findById(reading.profileId))?.photoAssetId
          : null;

        const portraitAsset = await imageProvider.generatePortrait(
          reading.characterProfile,
          {},
          referenceAssetId
        );

        reading.portraitAssetId = portraitAsset.assetId;
        reading.portraitUrl = `/api/v1/portraits/${portraitAsset.assetId}`;
        reading.status = 'completed';
        reading.currentStage = 'completed';
        reading.stageProgressPercent = 100;
        await reading.save();
      } catch (retryErr) {
        reading.status = 'failed';
        reading.currentStage = 'failed';
        reading.errorMessage = retryErr.message;
        await reading.save();
      }
    })();

    return {
      readingId,
      status: 'processing',
      currentStage: 'creating_portrait',
      retryCount: reading.retryCount,
    };
  }

  /**
   * Deletes a reading and all associated assets.
   */
  static async deleteReading(readingId) {
    const reading = await Reading.findOne({ readingId });
    if (!reading) return false;

    // Delete generated portrait if exists
    if (reading.portraitAssetId) {
      await StorageService.deletePortrait(reading.portraitAssetId);
    }

    // Delete reference photo if profile exists
    if (reading.profileId) {
      const profile = await UserProfile.findById(reading.profileId);
      if (profile?.photoAssetId) {
        await StorageService.deleteReferencePhoto(profile.photoAssetId);
      }
      await UserProfile.findByIdAndDelete(reading.profileId);
    }

    await Reading.findOneAndDelete({ readingId });
    await GenerationJob.deleteMany({ readingId });

    return true;
  }
}
