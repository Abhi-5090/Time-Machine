import { getZodiacSignByName } from '../constants/zodiac.js';
import { ARCHETYPES, getArchetypeById } from '../constants/archetypes.js';

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

const HISTORICAL_ERAS = [
  { id: 'ancient', label: 'Ancient Era', desc: 'A bronze-age realm of monumental ziggurats, river valleys, and starlit rites' },
  { id: 'medieval', label: 'High Medieval Era', desc: 'An era of stone fortresses, illuminated heraldry, cathedral spires, and mountain keeps' },
  { id: 'renaissance', label: 'Early Modern / Renaissance', desc: 'An age of maritime exploration, celestial cartography, mechanical clocks, and velvet courts' },
  { id: 'timeless', label: 'Timeless Mystical Realm', desc: 'A mythic sanctuary beyond mortal calendars, where starlight reflects upon eternal waters' },
];

const FICTIONAL_NAMES = {
  sage: ['Lysander of the Whispering Spire', 'Kaelen the Star-Weaver', 'Master Theron of Aethelgard', 'Mirabai of the Crystal Reach', 'Elowen of the Silver Vellum'],
  guardian: ['Valerius the Iron-Bane', 'Althea of the Solstice Gate', 'Commander Gareth of High Bastion', 'Rhea of the Azure Shield', 'Talon of the Sunken Watch'],
  healer: ['Seraphina of the Lotus Glen', 'Brother Alden of the Cedar Springs', 'Elysia the Mend-Weaver', 'Rowan of the Deep Well', 'Isolde of the Morning Herbarium'],
  ruler: ['Aurelius of the Sunlit Court', 'Queen Vespera of the Astral Reach', 'Lord Corin the Peace-Bringer', 'Empress Danika of High Solstice', 'Sovereign Cassian of the Sunken Isles'],
  seeker: ['Zephyr the Dune-Strider', 'Maris of the Cloudless Deep', 'Kieran of the Obsidian Compass', 'Lyra the Star-Chaser', 'Orion the Drift-Farer'],
  artist: ['Julian of the Gilded Lyre', 'Calliope the Mosaicist', 'Bastian of the Prismatic Spires', 'Fiora of the Twilight Loom', 'Dante the Fresco-Master'],
  diplomat: ['Lady Genevieve of the Accord', 'Silas the Peacemaker', 'Ambassador Vivienne of the Silver Lake', 'Lord Ronin the Bridge-Builder', 'Lucian the Quiet Voice'],
  wanderer: ['Bramble of the Far Ridges', 'Finnian the Open-Road', 'Astrid of the Wild Pines', 'Rory the Storm-Drifter', 'Kaia of the Borderless Steppe'],
};

export class InterpretationService {
  /**
   * Resolves the archetype: either user-selected or deterministically matched from sign themes.
   */
  static resolveArchetype(selectedSignName, preferredArchetypeId, seedString = '') {
    if (preferredArchetypeId && preferredArchetypeId !== 'auto') {
      const found = getArchetypeById(preferredArchetypeId);
      if (found) return found;
    }

    const sign = getZodiacSignByName(selectedSignName);
    if (!sign) return ARCHETYPES[0];

    const hash = hashString(seedString || selectedSignName);
    const candidateIds = sign.primaryArchetypes || ['sage', 'guardian'];
    const chosenId = candidateIds[hash % candidateIds.length];
    return getArchetypeById(chosenId) || ARCHETYPES[0];
  }

  /**
   * Resolves historical era based on preference or deterministic seed.
   */
  static resolveEra(eraPreference, seed = 0) {
    if (eraPreference && eraPreference !== 'system_select') {
      const matched = HISTORICAL_ERAS.find((e) => e.id === eraPreference);
      if (matched) return matched;
    }
    return HISTORICAL_ERAS[seed % HISTORICAL_ERAS.length];
  }

  /**
   * Builds the structured character profile deterministically.
   */
  static buildCharacterProfile({ profile, preferences, effectiveSign }) {
    const sign = getZodiacSignByName(effectiveSign);
    const seedStr = `${profile.preferredName || ''}-${effectiveSign}-${profile.dateOfBirth || ''}-${preferences.mainTheme || ''}`;
    const hash = hashString(seedStr);

    const archetype = this.resolveArchetype(effectiveSign, preferences.archetypeId, seedStr);
    const era = this.resolveEra(preferences.historicalSetting, hash);

    const namesList = FICTIONAL_NAMES[archetype.id] || FICTIONAL_NAMES.sage;
    const characterName = namesList[hash % namesList.length];

    const compatibleRoles = archetype.compatibleRoles || ['Keeper of the Celestial Vault'];
    const occupation = compatibleRoles[hash % compatibleRoles.length];

    const possibleSettings = archetype.possibleSettings || ['An ancient terrace open to the night sky'];
    const settingDesc = possibleSettings[hash % possibleSettings.length];

    const visualMotifs = archetype.visualMotifs || ['Velvet robes and celestial jewelry'];
    const clothingDesc = visualMotifs[hash % visualMotifs.length];

    const traits = [
      ...archetype.symbolicThemes.slice(0, 2),
      ...(sign ? sign.symbolicThemes.slice(0, 1) : ['Honor']),
    ];

    const visualStyle = preferences.portraitStyle || 'cinematic_mystical_realism';
    const portraitFraming = preferences.portraitFraming || 'close_up';

    return {
      characterName,
      archetypeId: archetype.id,
      archetypeName: archetype.displayName,
      era: era.id,
      eraName: era.label,
      setting: settingDesc,
      regionStyle: 'Historically inspired celestial realm, framed as creative storytelling',
      occupation,
      characterTraits: traits,
      coreConflict: `Balancing the sacred expectations of the ${occupation} with the quiet longing for personal truth`,
      turningPoint: `A crucial celestial eclipse where ${characterName} chose conscience and compassion over rigid convention`,
      relationshipThemes: ['Loyalty to kindred souls', 'Forging peace across divided allegiances', 'Mentorship of rising seekers'],
      symbolicLessons: ['True strength lies in quiet resilience', 'Every season of life carries its own constellation of wisdom'],
      appearanceDescription: `A distinguished, serene presence with contemplative eyes, framed by the atmospheric glow of an ancient ${era.label}`,
      clothingDescription: clothingDesc,
      portraitSetting: settingDesc,
      visualStyle,
      portraitFraming,
      fictionalDisclaimer: true,
    };
  }

  /**
   * Generates reflective present-day question and symbolic karmic themes.
   */
  static buildSymbolicThemesAndReflection(characterProfile, effectiveSign) {
    const sign = getZodiacSignByName(effectiveSign);
    const signThemes = sign ? sign.symbolicThemes : ['Wisdom', 'Courage'];

    const themes = [
      {
        theme: signThemes[0] || 'Initiative',
        interpretation: `In this imagined narrative, the ${characterProfile.archetypeName} embodied ${signThemes[0]?.toLowerCase()} through steadfast stewardship. In your present life, consider where gentle decisive action is inviting you forward.`,
      },
      {
        theme: characterProfile.characterTraits[0] || 'Reflection',
        interpretation: `The journey of ${characterProfile.characterName} reveals that enduring balance requires honoring boundaries while keeping one’s heart open to fellowship.`,
      },
      {
        theme: 'Transformation',
        interpretation: `Every turning point in the story reflects the alchemy of releasing what has passed to welcome an illuminated horizon.`,
      },
    ];

    const reflections = [
      `How might the quiet courage of ${characterProfile.characterName} inspire one decision you face this week?`,
      `Where in your present world are you called to be a steady guardian of what matters most?`,
      `What wisdom from your past challenges can become a guiding starlight for someone walking beside you today?`,
    ];

    const hash = hashString(characterProfile.characterName);
    const presentDayReflection = reflections[hash % reflections.length];

    return {
      symbolicKarmicThemes: themes,
      presentDayReflection,
    };
  }
}
