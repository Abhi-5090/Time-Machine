import Joi from 'joi';
import { VALID_SIGN_NAMES } from '../constants/zodiac.js';

export const zodiacValidateSchema = Joi.object({
  dateOfBirth: Joi.date().iso().allow(null, '').optional(),
  selectedZodiacSign: Joi.string().valid(...VALID_SIGN_NAMES).optional(),
  inputMode: Joi.string().valid('derived_from_date', 'manual_symbolic_choice').default('manual_symbolic_choice'),
  convention: Joi.string().valid('western_tropical').default('western_tropical'),
}).or('dateOfBirth', 'selectedZodiacSign');

export const createReadingSchema = Joi.object({
  profile: Joi.object({
    preferredName: Joi.string().max(60).allow('', null).optional(),
    dateOfBirth: Joi.date().iso().allow(null, '').optional(),
    selectedZodiacSign: Joi.string().valid(...VALID_SIGN_NAMES).required(),
    zodiacInputMode: Joi.string().valid('derived_from_date', 'manual_symbolic_choice').default('manual_symbolic_choice'),
    birthTime: Joi.string().max(10).allow('', null).optional(),
    birthplace: Joi.string().max(100).allow('', null).optional(),
    astrologyMode: Joi.string().valid('mystical_zodiac').default('mystical_zodiac'),
    preferredLanguage: Joi.string().default('en'),
    photoAssetId: Joi.string().allow(null, '').optional(),
  }).required(),
  preferences: Joi.object({
    archetypeId: Joi.string().default('auto'),
    mainTheme: Joi.string().default('wisdom'),
    storyGenre: Joi.string().default('reflective'),
    historicalSetting: Joi.string().default('system_select'),
    readingDepth: Joi.string().default('full'),
    portraitStyle: Joi.string().default('cinematic_mystical_realism'),
    portraitFraming: Joi.string().default('close_up'),
    portraitSetting: Joi.string().default('system_select'),
    characterPresentation: Joi.string().default('system_select'),
  }).default(),
  consent: Joi.object({
    readingProcessing: Joi.boolean().valid(true).required(),
    fictionalReadingAcknowledged: Joi.boolean().valid(true).required(),
    photoProcessing: Joi.boolean().default(false),
  }).required(),
});
