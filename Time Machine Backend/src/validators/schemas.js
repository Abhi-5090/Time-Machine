import Joi from 'joi';
import { VALID_SIGN_NAMES } from '../constants/zodiac.js';
import { VALID_ARCHETYPE_IDS } from '../constants/archetypes.js';
import {
  VALID_FUTURE_ARCHETYPE_IDS,
  VALID_FUTURE_HABITAT_IDS,
  VALID_FUTURE_SECTOR_IDS,
  VALID_FUTURE_OUTLOOK_IDS,
  VALID_FUTURE_AESTHETIC_IDS,
} from '../constants/future.js';

export const zodiacValidateSchema = Joi.object({
  dateOfBirth: Joi.date().iso().allow(null, '').optional(),
  selectedZodiacSign: Joi.string().valid(...VALID_SIGN_NAMES).optional(),
  inputMode: Joi.string()
    .valid('derived_from_date', 'manual_symbolic_choice')
    .default('manual_symbolic_choice'),
  convention: Joi.string().valid('western_tropical').default('western_tropical'),
}).or('dateOfBirth', 'selectedZodiacSign');

/**
 * A `past` reading is anchored on the star sign, so it stays required there.
 * A `future` reading treats the sign as a light motif and is anchored on the
 * date of birth instead (it drives the projected age in 2050), so either field
 * is enough and the service resolves whichever is missing.
 */
export const createReadingSchema = Joi.object({
  timeline: Joi.string().valid('past', 'future').default('past'),

  profile: Joi.object({
    preferredName: Joi.string().max(60).allow('', null).optional(),
    dateOfBirth: Joi.date().iso().allow(null, '').optional(),
    selectedZodiacSign: Joi.string()
      .valid(...VALID_SIGN_NAMES)
      .when(Joi.ref('/timeline'), {
        is: 'future',
        then: Joi.optional().allow(null, ''),
        otherwise: Joi.required(),
      }),
    zodiacInputMode: Joi.string()
      .valid('derived_from_date', 'manual_symbolic_choice')
      .default('manual_symbolic_choice'),
    birthTime: Joi.string().max(10).allow('', null).optional(),
    birthplace: Joi.string().max(100).allow('', null).optional(),
    astrologyMode: Joi.string().valid('mystical_zodiac').default('mystical_zodiac'),
    preferredLanguage: Joi.string().default('en'),
    photoAssetId: Joi.string().allow(null, '').optional(),
  }).required(),

  preferences: Joi.object({
    // Past timeline
    archetypeId: Joi.string()
      .valid('auto', ...VALID_ARCHETYPE_IDS)
      .default('auto'),
    mainTheme: Joi.string().max(40).default('wisdom'),
    storyGenre: Joi.string().max(40).default('reflective'),
    historicalSetting: Joi.string().max(40).default('system_select'),
    readingDepth: Joi.string().valid('brief', 'full').default('full'),
    portraitStyle: Joi.string().max(60).default('cinematic_mystical_realism'),
    portraitSetting: Joi.string().max(60).default('system_select'),
    characterPresentation: Joi.string().max(60).default('system_select'),

    // Future timeline
    futureArchetypeId: Joi.string()
      .valid('auto', ...VALID_FUTURE_ARCHETYPE_IDS)
      .default('auto'),
    futureSector: Joi.string()
      .valid(...VALID_FUTURE_SECTOR_IDS)
      .default('system_select'),
    futureHabitat: Joi.string()
      .valid('system_select', ...VALID_FUTURE_HABITAT_IDS)
      .default('system_select'),
    futureOutlook: Joi.string()
      .valid(...VALID_FUTURE_OUTLOOK_IDS)
      .default('luminous'),
    futureAesthetic: Joi.string()
      .valid(...VALID_FUTURE_AESTHETIC_IDS)
      .default('holographic_realism'),

    // Shared
    portraitFraming: Joi.string().valid('close_up', 'half_body', 'full_body').default('close_up'),
  }).default(),

  consent: Joi.object({
    readingProcessing: Joi.boolean().valid(true).required(),
    fictionalReadingAcknowledged: Joi.boolean().valid(true).required(),
    photoProcessing: Joi.boolean().default(false),
  }).required(),
});
