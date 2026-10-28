import { Router } from 'express';
import multer from 'multer';
import { uploadReferencePhoto, deleteReferencePhoto, servePortrait } from '../controllers/portrait.controller.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { config } from '../config/env.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.MAX_UPLOAD_BYTES,
  },
});

const router = Router();

// Upload reference photo
router.post('/reference', uploadLimiter, upload.single('photo'), uploadReferencePhoto);

// Delete reference photo
router.delete('/reference/:assetId', deleteReferencePhoto);

// Serve generated portrait
router.get('/:assetId', servePortrait);

export default router;
