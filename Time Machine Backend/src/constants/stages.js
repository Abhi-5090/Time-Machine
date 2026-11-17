/**
 * The generation pipeline, described once and shared by the API and the UI.
 *
 * The reveal screen renders one panel per stage, so the copy lives here rather
 * than being duplicated in the frontend where it could drift out of sync with
 * what the server is actually doing.
 */
export const PAST_STAGES = [
  {
    id: 'preparing_profile',
    label: 'Reading the chart',
    detail: 'Aligning your star sign, birth details and chosen themes.',
    progress: 25,
  },
  {
    id: 'shaping_character',
    label: 'Shaping the soul',
    detail: 'Drawing out an archetype, an era and a name from the alignment.',
    progress: 45,
  },
  {
    id: 'writing_story',
    label: 'Writing the chronicle',
    detail: 'Setting down five chapters of a life that never happened.',
    progress: 70,
  },
  {
    id: 'creating_portrait',
    label: 'Painting the portrait',
    detail: 'Committing the likeness to canvas under old light.',
    progress: 90,
  },
];

export const FUTURE_STAGES = [
  {
    id: 'calibrating_signal',
    label: 'Calibrating signal',
    detail: 'Locking your inputs to the 2050 reference frame.',
    progress: 25,
  },
  {
    id: 'projecting_persona',
    label: 'Projecting persona',
    detail: 'Resolving a role, a habitat and twenty-five years of trajectory.',
    progress: 45,
  },
  {
    id: 'composing_chronicle',
    label: 'Composing chronicle',
    detail: 'Writing one life, from the morning of the arrival to the horizon.',
    progress: 70,
  },
  {
    id: 'rendering_portrait',
    label: 'Rendering portrait',
    detail: 'Resolving the capture at 2050 fidelity.',
    progress: 90,
  },
];

export const STAGES_BY_TIMELINE = {
  past: PAST_STAGES,
  future: FUTURE_STAGES,
};

export function getStages(timeline) {
  return STAGES_BY_TIMELINE[timeline] || PAST_STAGES;
}
