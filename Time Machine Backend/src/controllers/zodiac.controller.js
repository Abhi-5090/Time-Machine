import { ZodiacService } from '../services/zodiac.service.js';

export function validateZodiac(req, res, next) {
  try {
    const { dateOfBirth, selectedZodiacSign, inputMode } = req.validatedBody;
    const result = ZodiacService.validateSignAlignment({
      dateOfBirth,
      selectedZodiacSign,
      inputMode,
    });

    res.status(200).json({
      success: true,
      data: result,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
}
