/**
 * Concept → icon, for options that come from the server catalog.
 *
 * The catalog is the source of truth for *what* can be chosen; this is the
 * source of truth for how each choice is pictured. Anything missing falls back
 * to a neutral icon rather than rendering nothing, so adding an option to the
 * backend can never leave a hole in the UI.
 */

const PAST_ARCHETYPES = {
  auto: 'magic',
  sage: 'book',
  guardian: 'shield',
  healer: 'health',
  ruler: 'landmark',
  seeker: 'compass',
  artist: 'palette',
  diplomat: 'governance',
  wanderer: 'route',
};

const FUTURE_ARCHETYPES = {
  auto: 'magic',
  architect: 'city',
  biosmith: 'seedling',
  navigator: 'rocket',
  empath: 'brain',
  cartographer: 'world',
  luminary: 'theater',
  mediator: 'governance',
  guardian_future: 'shield',
  voyager: 'route',
};

const SECTORS = {
  system_select: 'magic',
  climate: 'seedling',
  space: 'rocket',
  intelligence: 'brain',
  health: 'health',
  culture: 'theater',
  governance: 'governance',
  infrastructure: 'city',
  frontier: 'compass',
};

const HABITATS = {
  system_select: 'magic',
  vertical_metropolis: 'city',
  solar_coast: 'world',
  orbital_ring: 'rocket',
  reclaimed_interior: 'seedling',
  polar_commons: 'lab',
  equatorial_exchange: 'route',
};

const ERAS = {
  system_select: 'magic',
  ancient: 'columns',
  medieval: 'shield',
  renaissance: 'compass',
  timeless: 'star',
};

const THEMES = {
  wisdom: 'book',
  courage: 'shield',
  healing: 'health',
  leadership: 'landmark',
  creativity: 'palette',
  freedom: 'route',
  love: 'star',
  transformation: 'magic',
  discovery: 'compass',
};

const GENRES = {
  reflective: 'quote',
  mysterious: 'star',
  adventurous: 'compass',
  royal: 'landmark',
  spiritual: 'magic',
};

const OUTLOOKS = {
  luminary: 'star',
  luminous: 'star',
  tempered: 'governance',
  audacious: 'rocket',
  intimate: 'quote',
};

const AESTHETICS = {
  holographic_realism: 'scan',
  clean_solarpunk: 'seedling',
  high_contrast_neon: 'chip',
  archival_documentary: 'capture',
  cinematic_mystical_realism: 'palette',
  antique_astrology_illustration: 'penNib',
  celestial_fantasy_art: 'star',
};

const FRAMINGS = {
  close_up: 'identity',
  half_body: 'persona',
  full_body: 'capture',
};

const GROUPS = {
  pastArchetype: PAST_ARCHETYPES,
  futureArchetype: FUTURE_ARCHETYPES,
  sector: SECTORS,
  habitat: HABITATS,
  era: ERAS,
  theme: THEMES,
  genre: GENRES,
  outlook: OUTLOOKS,
  aesthetic: AESTHETICS,
  framing: FRAMINGS,
};

export function iconFor(group, id, fallback = 'star') {
  return GROUPS[group]?.[id] || fallback;
}

/**
 * Decorates catalog options with the icon for their group, ready for ChoiceGrid.
 * `map` renames the server's field names onto `{ id, label, note }`.
 */
export function withIcons(options = [], group, map = (option) => option) {
  return options.map((option) => {
    const mapped = map(option);
    return { ...mapped, icon: iconFor(group, mapped.id) };
  });
}
