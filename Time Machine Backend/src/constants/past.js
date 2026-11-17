/**
 * Selectable options and name pools for the past timeline.
 *
 * These were previously inlined in the interpretation service and duplicated
 * again in the frontend. They live here so the catalog endpoint can serve the
 * exact set the generator actually honours.
 */

export const HISTORICAL_ERAS = [
  {
    id: 'ancient',
    label: 'Ancient Era',
    desc: 'A bronze-age realm of monumental ziggurats, river valleys, and starlit rites',
  },
  {
    id: 'medieval',
    label: 'High Medieval Era',
    desc: 'An era of stone fortresses, illuminated heraldry, cathedral spires, and mountain keeps',
  },
  {
    id: 'renaissance',
    label: 'Early Modern / Renaissance',
    desc: 'An age of maritime exploration, celestial cartography, mechanical clocks, and velvet courts',
  },
  {
    id: 'timeless',
    label: 'Timeless Mystical Realm',
    desc: 'A mythic sanctuary beyond mortal calendars, where starlight reflects upon eternal waters',
  },
];

export const HISTORICAL_SETTING_OPTIONS = [
  { id: 'system_select', label: 'Let the stars choose' },
  ...HISTORICAL_ERAS.map((era) => ({ id: era.id, label: era.label, note: era.desc })),
];

export const SOUL_THEMES = [
  { id: 'wisdom', label: 'Wisdom & Discernment' },
  { id: 'courage', label: 'Courage & Valour' },
  { id: 'healing', label: 'Healing & Compassion' },
  { id: 'leadership', label: 'Leadership & Stewardship' },
  { id: 'creativity', label: 'Creativity & Beauty' },
  { id: 'freedom', label: 'Freedom & Autonomy' },
  { id: 'love', label: 'Love & Devotion' },
  { id: 'transformation', label: 'Transformation & Rebirth' },
  { id: 'discovery', label: 'Discovery & Wonder' },
];

export const STORY_GENRES = [
  { id: 'reflective', label: 'Reflective & Philosophical' },
  { id: 'mysterious', label: 'Mysterious & Esoteric' },
  { id: 'adventurous', label: 'Adventurous & Epic' },
  { id: 'royal', label: 'Royal & Historical' },
  { id: 'spiritual', label: 'Gentle & Spiritual' },
];

export const PORTRAIT_STYLES = [
  { id: 'cinematic_mystical_realism', label: 'Cinematic Mystical Realism' },
  { id: 'antique_astrology_illustration', label: 'Antique Astrological Engraving' },
  { id: 'celestial_fantasy_art', label: 'Celestial Fantasy Oil Painting' },
];

export const PORTRAIT_FRAMINGS = [
  { id: 'close_up', label: 'Close-up' },
  { id: 'half_body', label: 'Half body' },
  { id: 'full_body', label: 'Full body' },
];

export const FICTIONAL_NAMES = {
  sage: [
    'Lysander of the Whispering Spire',
    'Kaelen the Star-Weaver',
    'Master Theron of Aethelgard',
    'Mirabai of the Crystal Reach',
    'Elowen of the Silver Vellum',
  ],
  guardian: [
    'Valerius the Iron-Bane',
    'Althea of the Solstice Gate',
    'Commander Gareth of High Bastion',
    'Rhea of the Azure Shield',
    'Talon of the Sunken Watch',
  ],
  healer: [
    'Seraphina of the Lotus Glen',
    'Brother Alden of the Cedar Springs',
    'Elysia the Mend-Weaver',
    'Rowan of the Deep Well',
    'Isolde of the Morning Herbarium',
  ],
  ruler: [
    'Aurelius of the Sunlit Court',
    'Queen Vespera of the Astral Reach',
    'Lord Corin the Peace-Bringer',
    'Empress Danika of High Solstice',
    'Sovereign Cassian of the Sunken Isles',
  ],
  seeker: [
    'Zephyr the Dune-Strider',
    'Maris of the Cloudless Deep',
    'Kieran of the Obsidian Compass',
    'Lyra the Star-Chaser',
    'Orion the Drift-Farer',
  ],
  artist: [
    'Julian of the Gilded Lyre',
    'Calliope the Mosaicist',
    'Bastian of the Prismatic Spires',
    'Fiora of the Twilight Loom',
    'Dante the Fresco-Master',
  ],
  diplomat: [
    'Lady Genevieve of the Accord',
    'Silas the Peacemaker',
    'Ambassador Vivienne of the Silver Lake',
    'Lord Ronin the Bridge-Builder',
    'Lucian the Quiet Voice',
  ],
  wanderer: [
    'Bramble of the Far Ridges',
    'Finnian the Open-Road',
    'Astrid of the Wild Pines',
    'Rory the Storm-Drifter',
    'Kaia of the Borderless Steppe',
  ],
};
