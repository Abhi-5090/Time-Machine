import { Router } from 'express';
import { validateZodiac } from '../controllers/zodiac.controller.js';
import { validateBody } from '../middleware/validate.js';
import { zodiacValidateSchema } from '../validators/schemas.js';

const router = Router();
router.post('/validate', validateBody(zodiacValidateSchema), validateZodiac);

export default router;
