/**
 * Motion constants, mirroring the CSS custom properties in tokens.css.
 *
 * Framer Motion takes bezier control points as an array, so the same curve is
 * declared once here and once in CSS. If one changes, change both.
 */

export const EASE_OUT = [0.23, 1, 0.32, 1];
export const EASE_IN_OUT = [0.77, 0, 0.175, 1];
export const EASE_DRAWER = [0.32, 0.72, 0, 1];
export const EASE_SOFT = [0.4, 0, 0.2, 1];

export const DURATION = {
  press: 0.14,
  fast: 0.18,
  base: 0.24,
  slow: 0.4,
  scene: 0.7,
};

/** Apple-style spring parameters: easier to reason about than mass/stiffness. */
export const SPRING = {
  /** Decorative pointer tracking — loose, with visible momentum. */
  pointer: { type: 'spring', stiffness: 110, damping: 18, mass: 0.6 },
  /** Interface elements that must settle fast and not wobble. */
  snappy: { type: 'spring', duration: 0.4, bounce: 0.08 },
  /** Playful, used sparingly — portal doors and celebratory moments only. */
  playful: { type: 'spring', duration: 0.6, bounce: 0.24 },
};

/**
 * Shared enter/exit variants.
 *
 * Nothing starts at scale(0): real objects do not appear out of nothing, so
 * entrances begin at 0.97 with opacity carrying the rest of the change.
 * Exits run faster than entrances because the system responding should feel
 * quicker than the user deciding.
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.scene, ease: EASE_OUT } },
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.base, ease: EASE_OUT } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE_OUT } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: DURATION.fast, ease: EASE_OUT } },
};

/**
 * Container for staggered children. Keep the step between 30–80ms: longer and
 * the page feels like it is loading rather than arriving.
 */
export function staggerContainer(step = 0.055, delay = 0) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: step, delayChildren: delay },
    },
  };
}

/** Page transitions. Short, because they sit between the user and the content. */
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE_OUT } },
};
