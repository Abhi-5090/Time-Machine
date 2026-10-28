import { describe, it, expect } from 'vitest';
import { ZodiacService } from '../src/services/zodiac.service.js';

describe('ZodiacService', () => {
  it('correctly calculates sign for Capricorn boundary dates (Dec 22 and Jan 19)', () => {
    const dec22 = ZodiacService.deriveSignFromDate('1995-12-22');
    expect(dec22?.name).toBe('Capricorn');

    const jan19 = ZodiacService.deriveSignFromDate('2000-01-19');
    expect(jan19?.name).toBe('Capricorn');
  });

  it('correctly calculates sign across seasonal transitions (Aries & Taurus)', () => {
    const aries = ZodiacService.deriveSignFromDate('1990-03-21');
    expect(aries?.name).toBe('Aries');

    const taurus = ZodiacService.deriveSignFromDate('1990-04-20');
    expect(taurus?.name).toBe('Taurus');
  });

  it('correctly calculates sign for Scorpio', () => {
    const scorpio = ZodiacService.deriveSignFromDate('2005-11-05');
    expect(scorpio?.name).toBe('Scorpio');
  });

  it('identifies alignment when date and selected sign match', () => {
    const alignment = ZodiacService.validateSignAlignment({
      dateOfBirth: '2005-11-05',
      selectedZodiacSign: 'Scorpio',
      inputMode: 'derived_from_date',
    });
    expect(alignment.isConsistent).toBe(true);
    expect(alignment.derivedSign).toBe('Scorpio');
    expect(alignment.effectiveSign).toBe('Scorpio');
  });

  it('identifies mismatch when date and selected sign differ in manual mode without overriding choice', () => {
    const alignment = ZodiacService.validateSignAlignment({
      dateOfBirth: '2005-04-26', // Taurus
      selectedZodiacSign: 'Scorpio',
      inputMode: 'manual_symbolic_choice',
    });
    expect(alignment.isConsistent).toBe(false);
    expect(alignment.derivedSign).toBe('Taurus');
    expect(alignment.selectedSign).toBe('Scorpio');
    expect(alignment.effectiveSign).toBe('Scorpio'); // Preserves symbolic choice!
    expect(alignment.message).toContain('differs from the date-derived');
  });

  it('allows manual sign selection without providing date of birth', () => {
    const alignment = ZodiacService.validateSignAlignment({
      dateOfBirth: null,
      selectedZodiacSign: 'Leo',
      inputMode: 'manual_symbolic_choice',
    });
    expect(alignment.isConsistent).toBe(true);
    expect(alignment.effectiveSign).toBe('Leo');
    expect(alignment.derivedSign).toBe(null);
  });
});
