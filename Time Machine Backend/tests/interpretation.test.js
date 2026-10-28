import { describe, it, expect } from 'vitest';
import { InterpretationService } from '../src/services/interpretation.service.js';

describe('InterpretationService', () => {
  it('respects user-selected archetype', () => {
    const archetype = InterpretationService.resolveArchetype('Scorpio', 'guardian');
    expect(archetype.id).toBe('guardian');
    expect(archetype.displayName).toBe('The Guardian');
  });

  it('deterministically selects compatible archetype when auto is selected', () => {
    const arch1 = InterpretationService.resolveArchetype('Scorpio', 'auto', 'seed-alpha');
    const arch2 = InterpretationService.resolveArchetype('Scorpio', 'auto', 'seed-alpha');
    expect(arch1.id).toBe(arch2.id);
  });

  it('builds a structured character profile adhering to schema', () => {
    const profile = {
      preferredName: 'Rowan',
      dateOfBirth: '1998-07-25',
    };
    const preferences = {
      archetypeId: 'sage',
      mainTheme: 'wisdom',
      storyGenre: 'reflective',
      historicalSetting: 'ancient',
      portraitStyle: 'cinematic_mystical_realism',
      portraitFraming: 'close_up',
    };

    const character = InterpretationService.buildCharacterProfile({
      profile,
      preferences,
      effectiveSign: 'Leo',
    });

    expect(character).toHaveProperty('characterName');
    expect(character).toHaveProperty('archetypeId', 'sage');
    expect(character).toHaveProperty('era', 'ancient');
    expect(character).toHaveProperty('occupation');
    expect(character).toHaveProperty('characterTraits');
    expect(character.characterTraits.length).toBeGreaterThan(0);
    expect(character.fictionalDisclaimer).toBe(true);
  });

  it('creates symbolic themes and present day reflection question', () => {
    const characterProfile = {
      characterName: 'Lysander',
      archetypeName: 'The Sage',
      characterTraits: ['Learning', 'Clarity'],
    };

    const { symbolicKarmicThemes, presentDayReflection } =
      InterpretationService.buildSymbolicThemesAndReflection(characterProfile, 'Virgo');

    expect(Array.isArray(symbolicKarmicThemes)).toBe(true);
    expect(symbolicKarmicThemes.length).toBeGreaterThanOrEqual(2);
    expect(typeof presentDayReflection).toBe('string');
    expect(presentDayReflection.length).toBeGreaterThan(10);
  });
});
