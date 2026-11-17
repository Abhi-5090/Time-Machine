import { StorageService } from '../services/storage.service.js';

export async function uploadReferencePhoto(req, res, next) {
  try {
    const photoConsent = req.body.photoConsent === true || req.body.photoConsent === 'true';
    if (!photoConsent) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CONSENT_REQUIRED',
          message: 'Explicit user consent is required to process a reference photograph for portrait generation.',
        },
        requestId: req.id,
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'No photograph file was attached to the celestial transmission.',
        },
        requestId: req.id,
      });
    }

    const saved = await StorageService.saveReferencePhoto(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.status(201).json({
      success: true,
      data: {
        assetId: saved.assetId,
        message: 'Reference photograph securely received. It will be used solely for visual identity styling.',
      },
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteReferencePhoto(req, res, next) {
  try {
    const assetId = req.params.assetId;
    const deleted = await StorageService.deleteReferencePhoto(assetId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Reference photo asset not found or already deleted.',
        },
        requestId: req.id,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        assetId,
        deleted: true,
        message: 'Reference photograph has been permanently removed.',
      },
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function servePortrait(req, res, next) {
  try {
    const asset = await StorageService.readPortrait(req.params.assetId);

    if (!asset) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'The requested portrait asset was not found.' },
        requestId: req.id,
      });
    }

    res.setHeader('Content-Type', asset.mimeType);
    res.setHeader('Content-Length', asset.buffer.length);
    // Immutable: an asset id is never reused, so this can be cached hard.
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.end(asset.buffer);
  } catch (error) {
    next(error);
  }
}
