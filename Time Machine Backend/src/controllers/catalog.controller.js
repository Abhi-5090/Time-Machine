import { ZODIAC_SIGNS } from '../constants/zodiac.js';
import { ARCHETYPES } from '../constants/archetypes.js';
import {
  HISTORICAL_SETTING_OPTIONS,
  SOUL_THEMES,
  STORY_GENRES,
  PORTRAIT_STYLES,
  PORTRAIT_FRAMINGS,
} from '../constants/past.js';
import {
  FUTURE_ARCHETYPES,
  FUTURE_HABITATS,
  FUTURE_SECTORS,
  FUTURE_OUTLOOKS,
  FUTURE_AESTHETICS,
} from '../constants/future.js';
import { PAST_STAGES, FUTURE_STAGES } from '../constants/stages.js';

/**
 * Serves every selectable option for both timelines.
 *
 * The wizard builds its steps from this, which means an option can never be
 * offered in the UI that the validator would then reject.
 */
export function getCatalog(req, res) {
  res.status(200).json({
    success: true,
    data: {
      zodiacSigns: ZODIAC_SIGNS.map(({ id, name, symbol, element, modality, ruler, symbolicThemes, mythicRealm, dateRange }) => ({
        id,
        name,
        symbol,
        element,
        modality,
        ruler,
        symbolicThemes,
        mythicRealm,
        dateRange,
      })),
      past: {
        stages: PAST_STAGES,
        archetypes: [
          {
            id: 'auto',
            displayName: 'Let the stars decide',
            shortDescription: 'Your sign and your answers choose the archetype for you.',
          },
          ...ARCHETYPES.map(({ id, displayName, shortDescription, symbolicThemes }) => ({
            id,
            displayName,
            shortDescription,
            symbolicThemes,
          })),
        ],
        settings: HISTORICAL_SETTING_OPTIONS,
        themes: SOUL_THEMES,
        genres: STORY_GENRES,
        portraitStyles: PORTRAIT_STYLES,
      },
      future: {
        stages: FUTURE_STAGES,
        targetYear: 2050,
        archetypes: [
          {
            id: 'auto',
            displayName: 'Let the signal decide',
            shortDescription: 'Your sector and your answers resolve the persona for you.',
          },
          ...FUTURE_ARCHETYPES.map(({ id, displayName, shortDescription, signalThemes, technologies }) => ({
            id,
            displayName,
            shortDescription,
            signalThemes,
            technologies,
          })),
        ],
        habitats: [
          { id: 'system_select', label: 'Let the signal decide', tagline: 'Resolve a habitat from everything else you chose.' },
          ...FUTURE_HABITATS,
        ],
        sectors: FUTURE_SECTORS,
        outlooks: FUTURE_OUTLOOKS,
        aesthetics: FUTURE_AESTHETICS,
      },
      shared: {
        portraitFramings: PORTRAIT_FRAMINGS,
      },
    },
    requestId: req.id,
  });
}
