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

  it('completes the full flow: create reading -> poll status -> verify story & portrait -> authorized delete', async () => {
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

    // Verify portrait URL and serving
    expect(completedReading.portraitUrl).toBeDefined();
    const portraitRes = await request(app).get(completedReading.portraitUrl);
    expect(portraitRes.status).toBe(200);

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
});
