import mongoose from 'mongoose';
import { config } from '../config/env.js';

const ReadingSchema = new mongoose.Schema(
  {
    readingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ownerToken: {
      type: String,
      required: true,
      index: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile',
      default: null,
    },
    profileSummary: {
      preferredName: String,
      selectedSign: String,
      zodiacInputMode: String,
      derivedSign: String,
      hasReferencePhoto: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    currentStage: {
      type: String,
      enum: [
        'preparing_profile',
        'shaping_character',
        'writing_story',
        'creating_portrait',
        'completed',
        'failed',
      ],
      default: 'preparing_profile',
    },
    stageProgressPercent: {
      type: Number,
      default: 10,
    },
    ruleVersion: {
      type: String,
      default: '1.0.0',
    },
    promptVersion: {
      type: String,
      default: '1.0.0',
    },
    providerMode: {
      type: String,
      enum: ['mock', 'openai'],
      default: 'mock',
    },
    celestialSignature: {
      mode: { type: String, default: 'mystical_zodiac' },
      selectedSign: String,
      derivedSign: String,
      symbolicThemes: [String],
      inputMode: String,
      element: String,
      ruler: String,
      mythicRealm: String,
    },
    archetype: {
      id: String,
      name: String,
      description: String,
    },
    imaginedSetting: {
      era: String,
      description: String,
    },
    characterProfile: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    storySections: {
      origins: { type: String, default: '' },
      dailyLife: { type: String, default: '' },
      turningPoint: { type: String, default: '' },
      relationships: { type: String, default: '' },
      conclusion: { type: String, default: '' },
    },
    symbolicKarmicThemes: [
      {
        theme: String,
        interpretation: String,
      },
    ],
    presentDayReflection: {
      type: String,
      default: '',
    },
    disclaimer: {
      type: String,
      default:
        'This is an imaginative, astrology-inspired entertainment reading. It does not claim to prove reincarnation, diagnose personal conditions, or provide verified historical facts.',
    },
    portraitAssetId: {
      type: String,
      default: null,
    },
    portraitUrl: {
      type: String,
      default: null,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + config.READING_RETENTION_DAYS * 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const Reading = mongoose.model('Reading', ReadingSchema);
