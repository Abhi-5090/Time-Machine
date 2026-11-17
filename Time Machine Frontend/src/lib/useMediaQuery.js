import { useSyncExternalStore } from 'react';

/**
 * Subscribes to a media query.
 *
 * Used where a layout difference is structural rather than cosmetic — the
 * portal renders its two choices either inside the painted frames or as
 * standalone cards, and rendering both and hiding one with CSS would duplicate
 * the text for screen readers and run two copies of every animation.
 *
 * Falls back to `false` where matchMedia is unavailable, which is also the
 * right answer during server rendering and in tests: the wide layout.
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const list = window.matchMedia(query);
      list.addEventListener?.('change', onChange);
      return () => list.removeEventListener?.('change', onChange);
    },
    () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false),
    () => false
  );
}
