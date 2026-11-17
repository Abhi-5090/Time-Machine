import { ReadingService } from '../services/reading.service.js';
import { getStages } from '../constants/stages.js';

/**
 * Shapes a stored reading for the client.
 *
 * Only the fields belonging to the reading's own timeline are sent, so the
 * frontend never has to guess which half of the document is meaningful.
 */
function serializeReading(reading, { isOwner = false } = {}) {
  const timeline = reading.timeline || 'past';

  const base = {
    readingId: reading.readingId,
    timeline,
    status: reading.status,
    currentStage: reading.currentStage,
    stageProgressPercent: reading.stageProgressPercent,
    stages: getStages(timeline),
    providerMode: reading.providerMode,
    degradedReason: reading.degradedReason || null,
    title: reading.title,
    summary: reading.summary || '',
    archetype: reading.archetype,
    imaginedSetting: reading.imaginedSetting,
    celestialSignature: reading.celestialSignature,
    profileSummary: reading.profileSummary,
    disclaimer: reading.disclaimer,
    portraitUrl: reading.portraitUrl,
    errorMessage: reading.errorMessage,
    retryCount: reading.retryCount,
    createdAt: reading.createdAt,
    isOwner,
  };

  if (timeline === 'future') {
    return {
      ...base,
      futureProfile: reading.futureProfile,
      futureSections: reading.futureSections,
      futureSignalsNarrative: reading.futureSignalsNarrative,
      signals: reading.signals,
      timelineMarkers: reading.timelineMarkers,
      presentDayDirective: reading.presentDayDirective,
    };
  }

  return {
    ...base,
    characterProfile: reading.characterProfile,
    storySections: reading.storySections,
    symbolicKarmicThemes: reading.symbolicKarmicThemes,
    presentDayReflection: reading.presentDayReflection,
  };
}

export async function createReading(req, res, next) {
  try {
    const ownerToken = req.headers['x-reading-token'];
    const { timeline, profile, preferences, consent } = req.validatedBody;

    const result = await ReadingService.createReading({
      timeline,
      profile,
      preferences,
      consent,
      ownerToken,
    });

    res.status(202).json({
      success: true,
      data: { ...result, stages: getStages(result.timeline) },
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function getReadingStatus(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      data: serializeReading(req.reading, { isOwner: Boolean(req.isOwner) }),
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function retryReading(req, res, next) {
  try {
    const result = await ReadingService.retryGeneration(req.params.id);
    res.status(200).json({ success: true, data: result, requestId: req.id });
  } catch (error) {
    next(error);
  }
}

export async function deleteReading(req, res, next) {
  try {
    const readingId = req.params.id;
    await ReadingService.deleteReading(readingId);

    res.status(200).json({
      success: true,
      data: {
        readingId,
        deleted: true,
        message: 'This reading and every asset generated for it have been permanently deleted.',
      },
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
}
