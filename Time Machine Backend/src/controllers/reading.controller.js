import { ReadingService } from '../services/reading.service.js';

export async function createReading(req, res, next) {
  try {
    const ownerToken = req.headers['x-reading-token'];
    const { profile, preferences, consent } = req.validatedBody;

    const result = await ReadingService.createReading({
      profile,
      preferences,
      consent,
      ownerToken,
    });

    res.status(202).json({
      success: true,
      data: result,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function getReadingStatus(req, res, next) {
  try {
    const reading = req.reading;
    
    // Return safe data without secrets
    res.status(200).json({
      success: true,
      data: {
        readingId: reading.readingId,
        status: reading.status,
        currentStage: reading.currentStage,
        stageProgressPercent: reading.stageProgressPercent,
        providerMode: reading.providerMode,
        celestialSignature: reading.celestialSignature,
        archetype: reading.archetype,
        imaginedSetting: reading.imaginedSetting,
        characterProfile: reading.characterProfile,
        storySections: reading.storySections,
        symbolicKarmicThemes: reading.symbolicKarmicThemes,
        presentDayReflection: reading.presentDayReflection,
        disclaimer: reading.disclaimer,
        portraitUrl: reading.portraitUrl,
        errorMessage: reading.errorMessage,
        retryCount: reading.retryCount,
        createdAt: reading.createdAt,
        isOwner: Boolean(req.isOwner),
      },
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function retryReading(req, res, next) {
  try {
    const readingId = req.params.id;
    const ownerToken = req.headers['x-reading-token'] || req.query.token;

    const result = await ReadingService.retryGeneration(readingId, ownerToken);

    res.status(200).json({
      success: true,
      data: result,
      requestId: req.id,
    });
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
        message: 'Your celestial reading and all associated assets have been permanently deleted.',
      },
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
}
