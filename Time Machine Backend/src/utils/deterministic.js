/**
 * Deterministic helpers.
 *
 * The same reader input must always produce the same character, habitat and
 * signal read-out, so every "random" choice in the generation pipeline is
 * actually a pure function of a seed string.
 */

/** 32-bit FNV-1a-ish string hash. Stable across runs and platforms. */
export function hashString(str) {
  let hash = 0;
  const input = String(str ?? '');
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Creates an independent sub-seed from a base seed and a salt, so two different
 * decisions driven by the same reader never move in lockstep.
 */
export function subSeed(seed, salt) {
  return hashString(`${seed}::${salt}`);
}

/** Picks one element of `list` deterministically. */
export function pick(list, seed, salt = '') {
  if (!Array.isArray(list) || list.length === 0) return undefined;
  return list[subSeed(seed, salt) % list.length];
}

/**
 * Picks `count` distinct elements, preserving list order so the output reads
 * naturally rather than shuffled.
 */
export function pickMany(list, count, seed, salt = '') {
  if (!Array.isArray(list) || list.length === 0) return [];
  const take = Math.min(count, list.length);
  const chosen = new Set();
  let cursor = 0;
  while (chosen.size < take && cursor < take * 8) {
    chosen.add(subSeed(seed, `${salt}:${cursor}`) % list.length);
    cursor++;
  }
  return [...chosen].sort((a, b) => a - b).map((i) => list[i]);
}

/** Deterministic integer in [min, max]. */
export function intBetween(min, max, seed, salt = '') {
  if (max <= min) return min;
  return min + (subSeed(seed, salt) % (max - min + 1));
}
