import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export async function connectDatabase() {
  if (isConnected) return mongoose.connection;

  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });
    isConnected = true;
    console.log(`[Database] MongoDB connected to: ${conn.connection.name} @ ${conn.connection.host}:${conn.connection.port}`);
    return conn.connection;
  } catch (error) {
    console.error(`[Database Error] Could not connect to MongoDB at ${config.MONGODB_URI}:`, error.message);
    if (config.NODE_ENV === 'production') {
      throw error;
    } else {
      console.warn('[Database Warning] Running in development mode without MongoDB connection. Some persistence endpoints may fail.');
    }
    return null;
  }
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

export async function disconnectDatabase() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[Database] MongoDB disconnected cleanly.');
  }
}
