import { Router } from 'express';
import { getPing } from '../controllers/health.controller.js';

const router = Router();
router.get('/', getPing);

export default router;
