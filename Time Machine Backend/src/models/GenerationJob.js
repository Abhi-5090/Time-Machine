import mongoose from 'mongoose';

const GenerationJobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    readingId: {
      type: String,
      required: true,
      index: true,
    },
    jobType: {
      type: String,
      enum: ['story', 'portrait', 'all'],
      default: 'all',
    },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'queued',
      index: true,
    },
    currentStage: {
      type: String,
      default: 'preparing_profile',
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
    errorCode: {
      type: String,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const GenerationJob = mongoose.model('GenerationJob', GenerationJobSchema);
