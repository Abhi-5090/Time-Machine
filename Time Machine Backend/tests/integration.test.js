import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';

describe('End-to-End Reading Workflow', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('completes the full flow with no photo: create -> poll -> story but no portrait -> authorized delete', async () => {
    // 1. Submit valid onboarding details
    const createRes = await request(app)
      .post('/api/v1/readings')
      .send({
        profile: {
          preferredName: 'Aria',
          dateOfBirth: '1996-10-31',
          selectedZodiacSign: 'Scorpio',
          zodiacInputMode: 'manual_symbolic_choice',
          astrologyMode: 'mystical_zodiac',
          preferredLanguage: 'en',
        },
        preferences: {
          archetypeId: 'sage',
          mainTheme: 'wisdom',
          storyGenre: 'reflective',
          historicalSetting: 'ancient',
          readingDepth: 'full',
          portraitStyle: 'cinematic_mystical_realism',
          portraitFraming: 'close_up',
        },
        consent: {
          readingProcessing: true,
          fictionalReadingAcknowledged: true,
          photoProcessing: false,
        },
      });

    expect(createRes.status).toBe(202);
    expect(createRes.body.success).toBe(true);
    const { readingId, ownerToken } = createRes.body.data;
    expect(readingId).toBeDefined();
    expect(ownerToken).toBeDefined();

    // 2. Poll status until completed (Mock engine is fast)
    let completedReading = null;
    for (let i = 0; i < 10; i++) {
      const getRes = await request(app)
        .get(`/api/v1/readings/${readingId}`)
        .set('X-Reading-Token', ownerToken);

      expect(getRes.status).toBe(200);
      if (getRes.body.data.status === 'completed') {
        completedReading = getRes.body.data;
        break;
      }
      await new Promise((r) => setTimeout(r, 400));
    }

    expect(completedReading).not.toBeNull();
    expect(completedReading.status).toBe('completed');
    expect(completedReading.currentStage).toBe('completed');
    expect(completedReading.stageProgressPercent).toBe(100);

    // Verify structured story sections
    expect(completedReading.storySections.origins).toContain('beneath a sky painted with untamed constellations');
    expect(completedReading.storySections.dailyLife).toBeDefined();
    expect(completedReading.storySections.turningPoint).toBeDefined();
    expect(completedReading.storySections.conclusion).toBeDefined();

    // No photograph was shared, so no picture was drawn and no image call was
    // made. The card prints a stand-in; the server simply has nothing to serve.
    expect(completedReading.portraitUrl).toBeNull();
    expect(completedReading.profileSummary.hasReferencePhoto).toBe(false);

    // The stage list never promised a picture either.
    expect(completedReading.stages.map((stage) => stage.id)).toEqual([
      'preparing_profile',
      'shaping_character',
      'writing_story',
    ]);

    // And there is nothing to redo.
    const retryRes = await request(app)
      .post(`/api/v1/readings/${readingId}/retry`)
      .set('X-Reading-Token', ownerToken);
    expect(retryRes.status).toBe(400);
    expect(retryRes.body.error.code).toBe('NO_REFERENCE_PHOTO');

    // 3. Authorized deletion of reading and assets
    const deleteRes = await request(app)
      .delete(`/api/v1/readings/${readingId}`)
      .set('X-Reading-Token', ownerToken);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.data.deleted).toBe(true);

    // Verify reading is now gone
    const verifyRes = await request(app).get(`/api/v1/readings/${readingId}`);
    expect(verifyRes.status).toBe(404);
  });
  it('draws a picture when, and only when, a photograph was shared', async () => {
    // A one-pixel PNG is enough: the mock image provider never looks at the
    // bytes, and what is under test is the branch, not the likeness.
    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );

    const uploadRes = await request(app)
      .post('/api/v1/portraits/reference')
      .field('photoConsent', 'true')
      .attach('photo', pixel, { filename: 'visitor.png', contentType: 'image/png' });

    expect(uploadRes.status).toBe(201);
    const { assetId } = uploadRes.body.data;
    expect(assetId).toBeTruthy();

    const createRes = await request(app)
      .post('/api/v1/readings')
      .send({
        profile: {
          preferredName: 'Aria',
          dateOfBirth: '1996-10-31',
          selectedZodiacSign: 'Scorpio',
          zodiacInputMode: 'manual_symbolic_choice',
          photoAssetId: assetId,
        },
        preferences: { archetypeId: 'auto', historicalSetting: 'system_select' },
        consent: {
          readingProcessing: true,
          fictionalReadingAcknowledged: true,
          photoProcessing: true,
        },
      });

    expect(createRes.status).toBe(202);
    const { readingId, ownerToken } = createRes.body.data;

    // The portrait step is back in the list the reveal screen will show.
    expect(createRes.body.data.stages.map((stage) => stage.id)).toContain('creating_portrait');

    let reading = null;
    for (let i = 0; i < 12; i++) {
      const getRes = await request(app)
        .get(`/api/v1/readings/${readingId}`)
        .set('X-Reading-Token', ownerToken);
      if (getRes.body.data.status === 'completed') {
        reading = getRes.body.data;
        break;
      }
      await new Promise((r) => setTimeout(r, 400));
    }

    expect(reading).not.toBeNull();
    expect(reading.profileSummary.hasReferencePhoto).toBe(true);
    expect(reading.portraitUrl).toBeTruthy();

    const portraitRes = await request(app).get(reading.portraitUrl);
    expect(portraitRes.status).toBe(200);

    await request(app).delete(`/api/v1/readings/${readingId}`).set('X-Reading-Token', ownerToken);
  });
});
