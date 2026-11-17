import { getZodiacSignByName } from '../constants/zodiac.js';
import {
  FUTURE_ARCHETYPES,
  FUTURE_HABITATS,
  FUTURE_CALLSIGNS,
  SIGNAL_DEFINITIONS,
  ELEMENT_TO_FUTURE_ARCHETYPES,
  SECTOR_TO_FUTURE_ARCHETYPES,
  getFutureArchetypeById,
  getFutureHabitatById,
} from '../constants/future.js';
import { hashString, pick, pickMany, intBetween } from '../utils/deterministic.js';

const TARGET_YEAR = 2050;

/**
 * Builds the deterministic scaffolding for a 2050 reading.
 *
 * This is the future-timeline counterpart to InterpretationService: it decides
 * *who* the reader becomes before any language model is asked to write about it.
 * Keeping the skeleton deterministic means a reading is reproducible, the mock
 * provider and the live provider agree on the facts, and a retry never silently
 * changes the character.
 */
export class ForesightService {
  /** Resolves the 2050 persona from explicit choice, sector affinity, or star sign. */
  static resolveArchetype({ preferredArchetypeId, sector, signName, seed }) {
    if (preferredArchetypeId && preferredArchetypeId !== 'auto') {
      const explicit = getFutureArchetypeById(preferredArchetypeId);
      if (explicit) return explicit;
    }

    if (sector && sector !== 'system_select' && SECTOR_TO_FUTURE_ARCHETYPES[sector]) {
      const candidate = pick(SECTOR_TO_FUTURE_ARCHETYPES[sector], seed, 'sector-archetype');
      const resolved = getFutureArchetypeById(candidate);
      if (resolved) return resolved;
    }

    const sign = getZodiacSignByName(signName);
    const byElement = ELEMENT_TO_FUTURE_ARCHETYPES[sign?.element];
    if (byElement) {
      const candidate = pick(byElement, seed, 'element-archetype');
      const resolved = getFutureArchetypeById(candidate);
      if (resolved) return resolved;
    }

    return pick(FUTURE_ARCHETYPES, seed, 'fallback-archetype') || FUTURE_ARCHETYPES[0];
  }

  static resolveHabitat({ preferredHabitatId, seed }) {
    if (preferredHabitatId && preferredHabitatId !== 'system_select') {
      const explicit = getFutureHabitatById(preferredHabitatId);
      if (explicit) return explicit;
    }
    return pick(FUTURE_HABITATS, seed, 'habitat') || FUTURE_HABITATS[0];
  }

  /**
   * Estimates the reader's age in 2050 so the narrative can address a plausible
   * life stage. Returns null when no date of birth was shared, in which case the
   * story stays age-neutral.
   */
  static projectAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) return null;
    const age = TARGET_YEAR - dob.getUTCFullYear();
    if (age < 5 || age > 120) return null;
    return age;
  }

  static describeLifeStage(age) {
    if (age === null) return 'at the height of their working life';
    if (age < 25) return 'early in a career that is already moving fast';
    if (age < 40) return 'in the decade where the work starts to compound';
    if (age < 55) return 'at the height of their influence';
    if (age < 70) return 'in the years where they mostly build other people';
    return 'in a long, deliberate, unhurried chapter';
  }

  /**
   * Produces the full deterministic future profile.
   */
  static buildFutureProfile({ profile, preferences, effectiveSign }) {
    const seed = [
      profile.preferredName || 'anonymous',
      effectiveSign,
      profile.dateOfBirth || 'undated',
      preferences.futureSector || 'system_select',
      preferences.futureOutlook || 'luminous',
    ].join('|');

    const sign = getZodiacSignByName(effectiveSign);
    const archetype = this.resolveArchetype({
      preferredArchetypeId: preferences.futureArchetypeId,
      sector: preferences.futureSector,
      signName: effectiveSign,
      seed,
    });
    const habitat = this.resolveHabitat({
      preferredHabitatId: preferences.futureHabitat,
      seed,
    });

    const callsigns = FUTURE_CALLSIGNS[archetype.id] || FUTURE_CALLSIGNS.architect;
    const personaName = profile.preferredName?.trim()
      ? profile.preferredName.trim()
      : pick(callsigns, seed, 'callsign');

    const roleTitle = pick(archetype.roles, seed, 'role');
    const environment = pick(archetype.environments, seed, 'environment');
    const attire = pick(archetype.visualMotifs, seed, 'attire');
    const technologies = pickMany(archetype.technologies, 3, seed, 'tech');

    const projectedAge = this.projectAge(profile.dateOfBirth);
    const traits = [
      ...archetype.signalThemes.slice(0, 2),
      ...(sign ? sign.symbolicThemes.slice(0, 1) : ['Resolve']),
    ];

    return {
      targetYear: TARGET_YEAR,
      personaName,
      archetypeId: archetype.id,
      archetypeName: archetype.displayName,
      archetypeSummary: archetype.shortDescription,
      roleTitle,
      habitatId: habitat.id,
      habitatName: habitat.label,
      habitatTagline: habitat.tagline,
      habitatDescription: habitat.description,
      sector: preferences.futureSector || 'system_select',
      outlook: preferences.futureOutlook || 'luminous',
      environment,
      attire,
      technologies,
      signalThemes: traits,
      projectedAge,
      lifeStage: this.describeLifeStage(projectedAge),
      definingTension: `Holding the scale of the work against the small, specific life ${personaName} actually wants to live inside it`,
      breakthroughSeed: `A decision in the early 2040s that nobody else wanted to be responsible for`,
      aesthetic: preferences.futureAesthetic || 'holographic_realism',
      portraitFraming: preferences.portraitFraming || 'close_up',
      narrativeGuidance: archetype.narrativeGuidance,
      speculativeDisclaimer: true,
    };
  }

  /**
   * Derives the HUD read-out shown beside the 2050 report.
   * Values are deterministic flavour, clamped to sensible ranges.
   */
  static buildSignals(futureProfile) {
    const seed = `${futureProfile.personaName}|${futureProfile.archetypeId}|${futureProfile.habitatId}`;
    const ranges = {
      momentum: [62, 97],
      reach: [3, 240],
      novelty: [48, 95],
      stability: [55, 92],
    };

    return SIGNAL_DEFINITIONS.map((definition) => {
      const [min, max] = ranges[definition.key] || [40, 90];
      const value = intBetween(min, max, seed, definition.key);
      const delta = intBetween(-6, 18, seed, `${definition.key}-delta`);
      return {
        key: definition.key,
        label: definition.label,
        value,
        unit: definition.unit,
        delta,
        note: definition.note,
      };
    });
  }

  /**
   * Builds the 2026 → 2050 milestone track rendered as the results timeline.
   * Years are spaced deterministically but always strictly increasing.
   */
  static buildTimelineMarkers(futureProfile) {
    const seed = `${futureProfile.personaName}|${futureProfile.roleTitle}`;
    const name = futureProfile.personaName;

    const beats = [
      {
        anchor: 2027,
        spread: 2,
        title: 'The unglamorous start',
        body: `${name} takes on work that looks like a sideways move and turns out to be the only door that led anywhere.`,
      },
      {
        anchor: 2031,
        spread: 2,
        title: 'First real responsibility',
        body: `Ownership of something that breaks if it is handled badly. It is handled well, mostly, and the lessons from the "mostly" stick.`,
      },
      {
        anchor: 2036,
        spread: 3,
        title: 'The pivot',
        body: `A move into ${futureProfile.habitatName.toLowerCase()} — expensive, disruptive, and the decision everything afterwards depends on.`,
      },
      {
        anchor: 2042,
        spread: 3,
        title: 'The breakthrough',
        body: futureProfile.breakthroughSeed + ', which becomes the work this name is attached to.',
      },
      {
        anchor: 2047,
        spread: 2,
        title: 'Handing it on',
        body: `The quieter craft of making the next people better at it than ${name} ever was.`,
      },
      {
        anchor: 2050,
        spread: 0,
        title: 'Where the signal lands',
        body: `${futureProfile.roleTitle}, ${futureProfile.lifeStage}, in ${futureProfile.habitatName}.`,
      },
    ];

    let previousYear = 2025;
    return beats.map((beat, index) => {
      const jitter = beat.spread === 0 ? 0 : intBetween(-beat.spread, beat.spread, seed, `year-${index}`);
      const year = Math.max(previousYear + 1, Math.min(TARGET_YEAR, beat.anchor + jitter));
      previousYear = year;
      return { year, title: beat.title, description: beat.body };
    });
  }

  /**
   * Fallback directives used when a provider omits them.
   */
  static buildPresentDayDirective(futureProfile) {
    const options = [
      `What is the smallest version of ${futureProfile.roleTitle.toLowerCase()} that you could start practising this month?`,
      `${futureProfile.personaName} in 2050 is built out of decisions made now. Which one have you been postponing?`,
      `If the work in ${futureProfile.habitatName} needs a skill you do not have yet, what is step one of getting it?`,
    ];
    return pick(options, hashString(futureProfile.personaName), 'directive');
  }
}
