import mongoose from 'mongoose';
import { config } from '../config/env.js';

/**
 * Binary assets held in the database.
 *
 * Hosted platforms give a web service an ephemeral filesystem: anything written
 * to disk is gone on the next deploy or restart. Portraits written there would
 * outlive their own reading by minutes, leaving every archived reading pointing
 * at a dead image.
 *
 * Portraits run around 2 MB, well inside MongoDB's 16 MB document limit, so the
 * bytes live here and expire on the same clock as the reading that produced
 * them. No object store to provision, nothing else to pay for.
 */
const AssetSchema = new mongoose.Schema(
  {
    assetId: { type: String, required: true, unique: true, index: true },
    kind: { type: String, enum: ['portrait', 'reference'], required: true, index: true },
    mimeType: { type: String, required: true },
    bytes: { type: Buffer, required: true },
    size: { type: Number, required: true },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + config.READING_RETENTION_DAYS * 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

export const Asset = mongoose.model('Asset', AssetSchema);
