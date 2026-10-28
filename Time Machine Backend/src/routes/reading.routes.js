import { Router } from 'express';
import {
  createReading,
  getReadingStatus,
  retryReading,
  deleteReading,
} from '../controllers/reading.controller.js';
import { validateBody } from '../middleware/validate.js';
import { createReadingSchema } from '../validators/schemas.js';
import { verifyReadingOwnership } from '../middleware/auth.js';
import { creationLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Create reading
router.post('/', creationLimiter, validateBody(createReadingSchema), createReading);

// Get reading by ID
router.get('/:id', verifyReadingOwnership, getReadingStatus);

// Retry reading portrait or story
router.post('/:id/retry', verifyReadingOwnership, retryReading);

// Delete reading and its private assets
router.delete('/:id', verifyReadingOwnership, deleteReading);

export default router;
