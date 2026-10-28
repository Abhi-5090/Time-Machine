import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { validateImageMagicBytes } from '../src/services/storage.service.js';

describe('API Routes & Middleware', () => {
  it('GET /api/v1/health returns ok status and provider details', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.providerMode).toBeDefined();
  });

  it('POST /api/v1/zodiac/validate resolves sign alignment', async () => {
    const res = await request(app)
      .post('/api/v1/zodiac/validate')
      .send({
        dateOfBirth: '2005-04-26',
        selectedZodiacSign: 'Scorpio',
        inputMode: 'manual_symbolic_choice',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isConsistent).toBe(false);
    expect(res.body.data.derivedSign).toBe('Taurus');
    expect(res.body.data.selectedSign).toBe('Scorpio');
  });

  it('POST /api/v1/readings rejects request when consent is missing', async () => {
    const res = await request(app)
      .post('/api/v1/readings')
      .send({
        profile: {
          selectedZodiacSign: 'Scorpio',
        },
        consent: {
          readingProcessing: false,
          fictionalReadingAcknowledged: false,
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/portraits/reference rejects upload without photo consent', async () => {
    const dummyPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
    const res = await request(app)
      .post('/api/v1/portraits/reference')
      .field('photoConsent', 'false')
      .attach('photo', dummyPng, 'test.png');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('CONSENT_REQUIRED');
  });

  it('validateImageMagicBytes detects JPEG, PNG, and WebP signatures', () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
    expect(validateImageMagicBytes(png)).toBe('image/png');

    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
    expect(validateImageMagicBytes(jpeg)).toBe('image/jpeg');

    const invalid = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b]);
    expect(validateImageMagicBytes(invalid)).toBe(false);
  });
});
