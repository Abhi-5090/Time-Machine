import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { ForesightService } from '../src/services/foresight.service.js';

const CONSENT = {
  readingProcessing: true,
  fictionalReadingAcknowledged: true,
  photoProcessing: false,
};

async function pollUntilComplete(readingId, ownerToken, attempts = 12) {
  for (let i = 0; i < attempts; i++) {
    const res = await request(app)
      .get(`/api/v1/readings/${readingId}`)
      .set('X-Reading-Token', ownerToken);
    expect(res.status).toBe(200);
    if (res.body.data.status === 'completed') return res.body.data;
    if (res.body.data.status === 'failed') throw new Error(res.body.data.errorMessage);
    await new Promise((r) => setTimeout(r, 400));
  }
  return null;
}

describe('ForesightService', () => {
  const profile = { preferredName: 'Aria', dateOfBirth: '1996-10-31' };
  const preferences = { futureSector: 'space', futureOutlook: 'tempered' };

  it('is deterministic for identical input', () => {
    const a = ForesightService.buildFutureProfile({ profile, preferences, effectiveSign: 'Scorpio' });
    const b = ForesightService.buildFutureProfile({ profile, preferences, effectiveSign: 'Scorpio' });
    expect(a).toEqual(b);
  });

  it('honours an explicitly chosen persona over sector affinity', () => {
    const result = ForesightService.buildFutureProfile({
      profile,
      preferences: { ...preferences, futureArchetypeId: 'biosmith' },
      effectiveSign: 'Scorpio',
    });
    expect(result.archetypeId).toBe('biosmith');
  });

  it('resolves a persona from the sector when none is chosen', () => {
    const result = ForesightService.buildFutureProfile({ profile, preferences, effectiveSign: 'Scorpio' });
    expect(['navigator', 'voyager', 'architect']).toContain(result.archetypeId);
  });

  it('projects age in 2050 and omits it when the date of birth is unknown', () => {
    expect(ForesightService.projectAge('1996-10-31')).toBe(54);
    expect(ForesightService.projectAge(null)).toBeNull();
    expect(ForesightService.projectAge('not-a-date')).toBeNull();
  });

  it('produces strictly increasing milestone years ending in 2050', () => {
    const futureProfile = ForesightService.buildFutureProfile({ profile, preferences, effectiveSign: 'Scorpio' });
    const markers = ForesightService.buildTimelineMarkers(futureProfile);

    expect(markers.length).toBeGreaterThan(3);
    expect(markers.at(-1).year).toBe(2050);
    for (let i = 1; i < markers.length; i++) {
      expect(markers[i].year).toBeGreaterThan(markers[i - 1].year);
    }
  });

  it('clamps every signal into its documented range', () => {
    const futureProfile = ForesightService.buildFutureProfile({ profile, preferences, effectiveSign: 'Scorpio' });
    for (const signal of ForesightService.buildSignals(futureProfile)) {
      expect(signal.value).toBeGreaterThan(0);
      expect(signal.label).toBeTruthy();
      expect(typeof signal.delta).toBe('number');
    }
  });
});

describe('2050 reading workflow', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('creates a future reading without a star sign and completes with a chronicle', async () => {
    const createRes = await request(app)
      .post('/api/v1/readings')
      .send({
        timeline: 'future',
        // No selectedZodiacSign: the future timeline derives it from the date.
        profile: { preferredName: 'Aria', dateOfBirth: '1996-10-31' },
        preferences: { futureSector: 'climate', futureOutlook: 'tempered', futureAesthetic: 'clean_solarpunk' },
        consent: CONSENT,
      });

    expect(createRes.status).toBe(202);
    const { readingId, ownerToken, timeline } = createRes.body.data;
    expect(timeline).toBe('future');

    const reading = await pollUntilComplete(readingId, ownerToken);
    expect(reading).not.toBeNull();
    expect(reading.timeline).toBe('future');
    expect(reading.stageProgressPercent).toBe(100);

    // Future payload is present…
    expect(reading.futureProfile.targetYear).toBe(2050);
    expect(reading.futureProfile.projectedAge).toBe(54);
    expect(reading.futureSections.arrival).toBeTruthy();
    expect(reading.futureSections.horizon).toBeTruthy();
    expect(reading.signals.length).toBeGreaterThan(0);
    expect(reading.timelineMarkers.at(-1).year).toBe(2050);
    expect(reading.presentDayDirective).toBeTruthy();
    expect(reading.disclaimer).toContain('speculative fiction');

    // …and past-only fields are not leaked into the response.
    expect(reading.storySections).toBeUndefined();
    expect(reading.symbolicKarmicThemes).toBeUndefined();

    // No photograph was shared, so 2050 has a story but no face: there was
    // nothing to age forty-five years, and the card draws a stand-in instead.
    expect(reading.portraitUrl).toBeNull();
    expect(reading.stages.map((stage) => stage.id)).not.toContain('rendering_portrait');

    await request(app).delete(`/api/v1/readings/${readingId}`).set('X-Reading-Token', ownerToken);
  });

  it('still requires a star sign for a past reading', async () => {
    const res = await request(app)
      .post('/api/v1/readings')
      .send({
        timeline: 'past',
        profile: { preferredName: 'Aria', dateOfBirth: '1996-10-31' },
        preferences: {},
        consent: CONSENT,
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects an option the generator does not support', async () => {
    const res = await request(app)
      .post('/api/v1/readings')
      .send({
        timeline: 'future',
        profile: { preferredName: 'Aria', dateOfBirth: '1996-10-31' },
        preferences: { futureSector: 'teleportation' },
        consent: CONSENT,
      });

    expect(res.status).toBe(400);
    expect(res.body.error.details.some((d) => d.field === 'preferences.futureSector')).toBe(true);
  });
});

describe('Catalog endpoint', () => {
  it('serves every option both timelines accept', async () => {
    const res = await request(app).get('/api/v1/catalog');
    expect(res.status).toBe(200);

    const { zodiacSigns, past, future, shared } = res.body.data;
    expect(zodiacSigns).toHaveLength(12);
    expect(past.archetypes[0].id).toBe('auto');
    expect(past.stages).toHaveLength(4);
    expect(future.targetYear).toBe(2050);
    expect(future.habitats[0].id).toBe('system_select');
    expect(future.stages).toHaveLength(4);
    expect(shared.portraitFramings.length).toBeGreaterThan(0);
  });
});
