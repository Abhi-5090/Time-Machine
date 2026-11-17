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
    label: 'Reading your stars',
    detail: 'Looking at your star sign and the day you were born.',
    progress: 25,
  },
  {
    id: 'shaping_character',
    label: 'Finding who you were',
    detail: 'Working out your name, your job and the time you lived in.',
    progress: 45,
  },
  {
    id: 'writing_story',
    label: 'Writing your story',
    detail: 'Putting your past life into words.',
    progress: 70,
  },
  {
    id: 'creating_portrait',
    label: 'Painting your picture',
    detail: 'Drawing your face as it looked back then.',
    progress: 90,
  },
];

export const FUTURE_STAGES = [
  {
    id: 'calibrating_signal',
    label: 'Setting the year to 2050',
    detail: 'Working out how old you will be and what has changed.',
    progress: 25,
  },
  {
    id: 'projecting_persona',
    label: 'Finding who you become',
    detail: 'Working out your job and the place you live in.',
    progress: 45,
  },
  {
    id: 'composing_chronicle',
    label: 'Writing your story',
    detail: 'Putting one day in your 2050 life into words.',
    progress: 70,
  },
  {
    id: 'rendering_portrait',
    label: 'Making your picture',
    detail: 'Drawing your face at the age you will be in 2050.',
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
