import mongoose from 'mongoose';
import { VALID_SIGN_NAMES } from '../constants/zodiac.js';

const UserProfileSchema = new mongoose.Schema(
  {
    preferredName: {
      type: String,
      trim: true,
      maxlength: 60,
      default: '',
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    selectedZodiacSign: {
      type: String,
      required: true,
      enum: VALID_SIGN_NAMES,
    },
    zodiacInputMode: {
      type: String,
      required: true,
      enum: ['derived_from_date', 'manual_symbolic_choice'],
      default: 'manual_symbolic_choice',
    },
    birthTime: {
      type: String,
      trim: true,
      maxlength: 10,
      default: '',
    },
    birthplace: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },
    astrologyMode: {
      type: String,
      default: 'mystical_zodiac',
      enum: ['mystical_zodiac'],
    },
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    preferences: {
      archetypeId: { type: String, default: 'auto' },
      mainTheme: { type: String, default: 'wisdom' },
      storyGenre: { type: String, default: 'reflective' },
      historicalSetting: { type: String, default: 'system_select' },
      readingDepth: { type: String, default: 'full' },
      portraitStyle: { type: String, default: 'cinematic_mystical_realism' },
      portraitFraming: { type: String, default: 'close_up' },
      portraitSetting: { type: String, default: 'system_select' },
      characterPresentation: { type: String, default: 'system_select' },
    },
    consent: {
      readingProcessing: { type: Boolean, required: true },
      fictionalReadingAcknowledged: { type: Boolean, required: true },
      photoProcessing: { type: Boolean, default: false },
      consentedAt: { type: Date, default: Date.now },
    },
    photoAssetId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
