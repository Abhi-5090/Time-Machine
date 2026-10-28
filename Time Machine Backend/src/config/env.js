import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = parseInt(process.env.PORT, 10) || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mystical_past_life';
const API_BASE_PATH = process.env.API_BASE_PATH || '/api/v1';

const AI_PROVIDER_MODE = (process.env.AI_PROVIDER_MODE || 'mock').toLowerCase();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini';
const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'dall-e-3';

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'local';
const MAX_UPLOAD_BYTES = parseInt(process.env.MAX_UPLOAD_BYTES, 10) || 5 * 1024 * 1024;
const READING_RETENTION_DAYS = parseInt(process.env.READING_RETENTION_DAYS, 10) || 30;
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 60;

// Validate configuration
export function validateConfig() {
  if (AI_PROVIDER_MODE === 'openai') {
    if (!OPENAI_API_KEY || OPENAI_API_KEY.trim() === '') {
      const errorMsg = 
        '[Config Error] AI_PROVIDER_MODE is set to "openai", but OPENAI_API_KEY is not configured.\n' +
        'Please add your OPENAI_API_KEY to your backend .env file, or set AI_PROVIDER_MODE=mock for local development.\n' +
        'Note: OpenAI API credits are billed separately from ChatGPT Plus subscriptions.';
      
      if (NODE_ENV === 'production') {
        throw new Error(errorMsg);
      } else {
        console.warn('\n⚠️ ' + errorMsg + '\n');
      }
    }
  } else if (AI_PROVIDER_MODE !== 'mock') {
    throw new Error(`[Config Error] Invalid AI_PROVIDER_MODE: "${AI_PROVIDER_MODE}". Allowed values are "openai" or "mock".`);
  }
}

export const config = {
  NODE_ENV,
  PORT,
  CLIENT_ORIGIN,
  MONGODB_URI,
  API_BASE_PATH,
  AI_PROVIDER_MODE,
  OPENAI_API_KEY,
  OPENAI_TEXT_MODEL,
  OPENAI_IMAGE_MODEL,
  STORAGE_PROVIDER,
  MAX_UPLOAD_BYTES,
  READING_RETENTION_DAYS,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
};
