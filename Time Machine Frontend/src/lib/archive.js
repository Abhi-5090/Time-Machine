/**
 * The reader's local archive.
 *
 * Readings live on the server behind an owner token, but the list of *which*
 * readings belong to this browser is kept here. It is what powers the Archive
 * page and the Continuum view, and it never leaves the device.
 */

const ARCHIVE_KEY = 'tm.archive';
const MAX_ENTRIES = 60;

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ARCHIVE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(entries) {
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    /* Private window or quota exceeded: the archive is a convenience, not state. */
  }
  notify();
}

/* A tiny subscription so the nav badge and the Archive page stay in step
   without pulling in a state library. */
const listeners = new Set();

function notify() {
  for (const listener of listeners) listener();
}

export function subscribeToArchive(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getArchive() {
  return read();
}

export function getArchiveByTimeline(timeline) {
  return read().filter((entry) => entry.timeline === timeline);
}

/**
 * Inserts or updates an entry, newest first.
 * Called when a reading is created and again when it completes.
 */
export function rememberReading(entry) {
  if (!entry?.readingId) return;

  const entries = read().filter((item) => item.readingId !== entry.readingId);
  const previous = read().find((item) => item.readingId === entry.readingId);

  entries.unshift({
    ...previous,
    ...entry,
    savedAt: previous?.savedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  write(entries);
}

export function forgetReading(readingId) {
  write(read().filter((entry) => entry.readingId !== readingId));
}

export function clearArchive() {
  write([]);
}

/**
 * The most recent completed reading on each timeline.
 * The Continuum view needs one of each to thread a single life together.
 */
export function getContinuumPair() {
  const completed = read().filter((entry) => entry.status === 'completed');
  return {
    past: completed.find((entry) => entry.timeline === 'past') || null,
    future: completed.find((entry) => entry.timeline === 'future') || null,
  };
}
