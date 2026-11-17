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

/** The one stage per timeline that calls the image provider. */
export const PORTRAIT_STAGE_IDS = new Set(['creating_portrait', 'rendering_portrait']);

const PORTRAIT_PROGRESS = 90;

/**
 * The stages a given reading will actually run through.
 *
 * A reading only draws a picture when the reader shared a photograph to draw
 * from. Without one there is no portrait step at all, so it is dropped from
 * the list rather than shown and silently skipped — the reveal screen renders
 * this list verbatim, and a step that never happens should never be promised.
 * The last remaining stage inherits the portrait stage's progress so the bar
 * still fills to the same place before the reading completes.
 */
export function getStages(timeline, { withPortrait = true } = {}) {
  const stages = STAGES_BY_TIMELINE[timeline] || PAST_STAGES;
  if (withPortrait) return stages;

  const kept = stages.filter((stage) => !PORTRAIT_STAGE_IDS.has(stage.id));
  return kept.map((stage, index) =>
    index === kept.length - 1 ? { ...stage, progress: PORTRAIT_PROGRESS } : stage
  );
}
