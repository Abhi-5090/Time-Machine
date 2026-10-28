import { Reading } from '../models/Reading.js';

export async function verifyReadingOwnership(req, res, next) {
  const readingId = req.params.id || req.params.readingId;
  const ownerToken = req.headers['x-reading-token'] || req.query.token;

  if (!readingId) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Reading ID is required.',
      },
      requestId: req.id,
    });
  }

  try {
    const reading = await Reading.findOne({ readingId });
    if (!reading) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'READING_NOT_FOUND',
          message: 'The requested celestial reading could not be found.',
        },
        requestId: req.id,
      });
    }

    // If an owner token was supplied or required, verify
    // Note: For reading results, if reading is completed, public view may be allowed if authorized or if token matches
    // But for write/delete/retry operations, ownerToken must strictly match!
    const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    
    if (isWriteOperation) {
      if (!ownerToken || ownerToken !== reading.ownerToken) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You do not have permission to modify or delete this reading.',
          },
          requestId: req.id,
        });
      }
    } else {
      // For GET requests, check if token matches OR reading is completed
      // If token matches, mark caller as owner
      req.isOwner = ownerToken === reading.ownerToken;
    }

    req.reading = reading;
    next();
  } catch (error) {
    next(error);
  }
}
