import multer from 'multer';

function redactSecrets(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[REDACTED_API_KEY]')
    .replace(/Bearer\s+[a-zA-Z0-9_.-]+/g, 'Bearer [REDACTED_TOKEN]');
}

export function errorHandler(err, req, res, next) {
  console.error(`[Error] Request ID ${req.id || 'N/A'}:`, redactSecrets(err.stack || err.message));

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: {
          code: 'UPLOAD_TOO_LARGE',
          message: 'The uploaded photograph exceeds the maximum allowed size of 5 MB.',
          details: [],
        },
        requestId: req.id,
      });
    }
    return res.status(400).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: err.message,
        details: [],
      },
      requestId: req.id,
    });
  }

  // Known custom errors
  if (err.isCustomError) {
    return res.status(err.statusCode || 400).json({
      success: false,
      error: {
        code: err.code || 'BAD_REQUEST',
        message: redactSecrets(err.message),
        details: err.details || [],
      },
      requestId: req.id,
    });
  }

  // Default server error
  const statusCode = err.status || err.statusCode || 500;
  const safeMessage =
    statusCode >= 500
      ? 'An unexpected celestial distortion occurred while processing your reading. Please try again.'
      : redactSecrets(err.message);

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: safeMessage,
      details: [],
    },
    requestId: req.id,
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `The celestial pathway ${req.method} ${req.originalUrl} does not exist.`,
      details: [],
    },
    requestId: req.id,
  });
}
