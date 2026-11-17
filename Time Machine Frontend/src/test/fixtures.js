/** Shapes matching what the API actually returns, used across the tests. */

export const CATALOG = {
  success: true,
  data: {
    zodiacSigns: [
      {
        id: 'scorpio',
        name: 'Scorpio',
        symbol: '♏',
        element: 'Water',
        modality: 'Fixed',
        ruler: 'Pluto',
        symbolicThemes: ['Depth', 'Transformation'],
        mythicRealm: 'The Obsidian Depths',
        dateRange: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
      },
      {
        id: 'leo',
        name: 'Leo',
        symbol: '♌',
        element: 'Fire',
        modality: 'Fixed',
        ruler: 'Sun',
        symbolicThemes: ['Radiance', 'Courage'],
        mythicRealm: 'The Gilded Expanse',
        dateRange: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
      },
    ],
    past: {
      stages: [
        { id: 'preparing_profile', label: 'Reading the chart', detail: 'Aligning.', progress: 25 },
        { id: 'shaping_character', label: 'Shaping the soul', detail: 'Drawing.', progress: 45 },
        { id: 'writing_story', label: 'Writing the chronicle', detail: 'Setting down.', progress: 70 },
        { id: 'creating_portrait', label: 'Painting the portrait', detail: 'Committing.', progress: 90 },
      ],
      archetypes: [
        { id: 'auto', displayName: 'Let the stars decide', shortDescription: 'Automatic.' },
        { id: 'sage', displayName: 'The Sage', shortDescription: 'Keeper of truths.' },
      ],
      settings: [
        { id: 'system_select', label: 'Let the stars choose' },
        { id: 'ancient', label: 'Ancient Era', note: 'Bronze age.' },
      ],
      themes: [{ id: 'wisdom', label: 'Wisdom & Discernment' }],
      genres: [{ id: 'reflective', label: 'Reflective & Philosophical' }],
      portraitStyles: [{ id: 'cinematic_mystical_realism', label: 'Cinematic Mystical Realism' }],
    },
    future: {
      stages: [
        { id: 'calibrating_signal', label: 'Calibrating signal', detail: 'Locking.', progress: 25 },
        { id: 'projecting_persona', label: 'Projecting persona', detail: 'Resolving.', progress: 45 },
        { id: 'composing_chronicle', label: 'Composing chronicle', detail: 'Writing.', progress: 70 },
        { id: 'rendering_portrait', label: 'Rendering portrait', detail: 'Resolving.', progress: 90 },
      ],
      targetYear: 2050,
      archetypes: [
        { id: 'auto', displayName: 'Let the signal decide', shortDescription: 'Automatic.' },
        { id: 'navigator', displayName: 'The Orbital Navigator', shortDescription: 'Keeps the road open.' },
      ],
      habitats: [
        { id: 'system_select', label: 'Let the signal decide', tagline: 'Resolve it for me.' },
        {
          id: 'orbital_ring',
          label: 'The Orbital Ring',
          tagline: 'Four hundred kilometres up.',
          description: 'A rotating habitat.',
        },
      ],
      sectors: [
        { id: 'system_select', label: 'Let the signal decide' },
        { id: 'space', label: 'Space & Orbital Industry' },
      ],
      outlooks: [{ id: 'luminous', label: 'Luminous', note: 'Mostly went right.' }],
      aesthetics: [{ id: 'holographic_realism', label: 'Holographic Realism (Default)' }],
    },
    shared: {
      portraitFramings: [{ id: 'close_up', label: 'Close-up' }],
    },
  },
};

export const PAST_READING = {
  success: true,
  data: {
    readingId: 'rd_past',
    timeline: 'past',
    status: 'completed',
    currentStage: 'completed',
    stageProgressPercent: 100,
    stages: CATALOG.data.past.stages,
    providerMode: 'mock',
    title: 'Lysander of the Whispering Spire',
    summary:
      'In your past life you were Lysander, an archivist of lost constellations. ' +
      'You lived in the ancient era, in a library cut into a cliff. ' +
      'You spent your days copying star charts by candlelight. ' +
      'Once, you stood up to the council and refused to burn a map. ' +
      'People remembered you as the one who kept the quiet things safe.',
    archetype: { id: 'sage', name: 'The Sage', description: 'Keeper of truths.' },
    imaginedSetting: { era: 'ancient', description: 'Ancient Era — a cliffside observatory' },
    celestialSignature: {
      selectedSign: 'Scorpio',
      element: 'Water',
      ruler: 'Pluto',
      mythicRealm: 'The Obsidian Depths',
      symbolicThemes: ['Depth'],
    },
    profileSummary: {
      preferredName: 'Aria',
      selectedSign: 'Scorpio',
      dateOfBirth: '1996-10-31',
      birthTime: '14:05',
      birthplace: 'Hyderabad, India',
      hasReferencePhoto: true,
    },
    characterProfile: {
      characterName: 'Lysander of the Whispering Spire',
      occupation: 'Archivist of Lost Constellations',
      eraName: 'Ancient Era',
      setting: 'A candlelit library carved into a cliffside',
      characterTraits: ['Learning', 'Clarity'],
      coreConflict: 'Balancing secret wisdom with mortal humility',
    },
    storySections: {
      origins: 'Born under the twilight conjunction.\n\nA second paragraph of origins.',
      dailyLife: 'Polishing brass astrolabes each morning.',
      turningPoint: 'Standing against the council during the eclipse.',
      relationships: 'Mentoring young stargazers.',
      conclusion: 'Resting in peaceful solitude.',
    },
    symbolicKarmicThemes: [{ theme: 'Stewardship', interpretation: 'Protecting quiet knowledge.' }],
    presentDayReflection: 'Where might quiet reflection guide you today?',
    disclaimer: 'This is an imaginative, astrology-inspired entertainment reading.',
    portraitUrl: '/api/v1/portraits/prt_test',
    retryCount: 0,
    createdAt: '2026-11-12T00:00:00.000Z',
    isOwner: true,
  },
};

export const FUTURE_READING = {
  success: true,
  data: {
    readingId: 'rd_future',
    timeline: 'future',
    status: 'completed',
    currentStage: 'completed',
    stageProgressPercent: 100,
    stages: CATALOG.data.future.stages,
    providerMode: 'mock',
    title: 'Ori Lindqvist — Flight Director',
    summary:
      'In 2050 you are 54 years old and working as a flight director. ' +
      'You live on a ring that turns four hundred kilometres above the sea. ' +
      'Most of your day is spent deciding what a machine should not decide alone. ' +
      'The work you are known for took four years and cost you a friendship. ' +
      'You are still there, teaching the people who will do it better.',
    archetype: { id: 'navigator', name: 'The Orbital Navigator', description: 'Keeps the road open.' },
    imaginedSetting: { era: '2050', description: 'The Orbital Ring' },
    celestialSignature: { selectedSign: 'Scorpio', element: 'Water' },
    profileSummary: {
      preferredName: 'Aria',
      selectedSign: 'Scorpio',
      dateOfBirth: '1996-10-31',
      birthTime: '14:05',
      birthplace: 'Hyderabad, India',
      hasReferencePhoto: true,
    },
    futureProfile: {
      targetYear: 2050,
      personaName: 'Ori Lindqvist',
      archetypeName: 'The Orbital Navigator',
      archetypeSummary: 'Keeps the thin silver road open.',
      roleTitle: 'Flight Director, Lagrange Transfer Authority',
      habitatName: 'The Orbital Ring',
      habitatTagline: 'Four hundred kilometres up.',
      environment: 'A rotating habitat ring',
      technologies: ['Autonomous docking swarms', 'Orbital debris sweepers'],
      signalThemes: ['Courage', 'Precision'],
      projectedAge: 54,
      lifeStage: 'at the height of their influence',
      definingTension: 'Holding the scale of the work against the small life inside it',
    },
    futureSections: {
      arrival: 'The alarm in 2050 is not a sound.\n\nIt is a warming of the wall.',
      dailyLife: 'Most of the job turns out to be arbitration.',
      breakthrough: 'It took four years and cost a friendship.',
      connections: 'There is a mentor who still sends corrections.',
      horizon: 'The unfinished part is the part worth staying for.',
    },
    futureSignalsNarrative: [{ theme: 'Nerve', interpretation: 'Signing your name to a decision.' }],
    signals: [
      { key: 'momentum', label: 'Momentum Index', value: 81, unit: '', delta: 7, note: 'How fast this compounds.' },
    ],
    timelineMarkers: [
      { year: 2027, title: 'The unglamorous start', description: 'A sideways move.' },
      { year: 2050, title: 'Where the signal lands', description: 'Flight Director.' },
    ],
    presentDayDirective: 'Pick the problem nobody wants to own.',
    disclaimer: 'This is speculative fiction set in an imagined 2050.',
    portraitUrl: '/api/v1/portraits/prt_future',
    retryCount: 0,
    createdAt: '2026-11-12T00:00:00.000Z',
    isOwner: true,
  },
};

/** Routes a mocked fetch to the right fixture. */
/**
 * The other half of the rule: a finished reading for someone who shared no
 * photograph, so no picture was ever drawn and the card falls back to the
 * stand-in. The portrait stage is absent from `stages` for the same reason.
 */
export const PAST_READING_NO_PHOTO = {
  success: true,
  data: {
    ...PAST_READING.data,
    readingId: 'rd_nophoto',
    portraitUrl: null,
    stages: CATALOG.data.past.stages.filter((stage) => stage.id !== 'creating_portrait'),
    profileSummary: { ...PAST_READING.data.profileSummary, hasReferencePhoto: false },
  },
};

export function mockFetch(overrides = {}) {
  return async (input) => {
    const url = typeof input === 'string' ? input : input.url;

    const respond = (payload, status = 200) => ({
      ok: status < 400,
      status,
      json: async () => payload,
      blob: async () => new Blob(['x']),
    });

    if (overrides[url]) return respond(overrides[url]);
    if (url.includes('/catalog')) return respond(CATALOG);
    if (url.includes('/readings/rd_nophoto')) return respond(PAST_READING_NO_PHOTO);
    if (url.includes('/readings/rd_past')) return respond(PAST_READING);
    if (url.includes('/readings/rd_future')) return respond(FUTURE_READING);
    if (url.includes('/readings/rd_missing')) {
      return respond({ success: false, error: { code: 'READING_NOT_FOUND', message: 'Not found.' } }, 404);
    }

    return respond({ success: true, data: {} });
  };
}
