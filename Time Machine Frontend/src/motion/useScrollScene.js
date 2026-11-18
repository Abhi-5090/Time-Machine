import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-scrubbed animation, scoped and cleaned up.
 *
 * `setup(scope)` runs inside a `gsap.context`, so every tween and every
 * ScrollTrigger it creates is torn down when the component unmounts — which
 * matters on a routed app, where a stale ScrollTrigger on an unmounted section
 * will keep recalculating against a page that no longer exists.
 *
 * Scrubbing is reserved for things tied to position: a hero receding as you
 * leave it, a read-out that fills as you travel down the page. Reveals are not
 * scrubbed — content that fades back out when you scroll up by a few pixels
 * reads as a bug, not as polish.
 *
 * Skipped entirely under `prefers-reduced-motion`.
 */
export function useScrollScene(setup, deps = []) {
  const scopeRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion || !scopeRef.current) return undefined;

    const context = gsap.context((self) => setup(self), scopeRef);

    // Fonts and the hero image land after first layout and change element
    // heights, so measured trigger positions have to be refreshed once things
    // have settled.
    const refresh = () => ScrollTrigger.refresh();
    const timer = setTimeout(refresh, 400);
    document.fonts?.ready?.then(refresh);

    return () => {
      clearTimeout(timer);
      context.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, ...deps]);

  return scopeRef;
}

/**
 * The standard treatment for a full-height hero: as the reader scrolls past it,
 * the content drifts up a little slower than the page and dims, so the section
 * below arrives over it rather than merely after it.
 *
 * The trigger is the hero *section*, never the piece that moves inside it.
 * That distinction is the whole reason this function takes a `trigger` at all:
 * a selector matching a thin element — a masthead rule, say — gives
 * ScrollTrigger a range only as tall as that strip, and the entire recede then
 * plays out in the first eighty pixels of scroll. The call to action is gone
 * before the reader has decided to leave, which reads as a flicker rather than
 * as a hero receding.
 *
 * The floor is 0.25 rather than near-zero for the same reason: the hero should
 * sink behind what follows, not blink out of existence while it is still the
 * largest thing on screen.
 */
export function heroRecede(selector, { distance = -90, scale = 0.96, opacity = 0.25, trigger } = {}) {
  const target = gsap.utils.toArray(selector);
  if (!target.length) return null;

  const explicit = typeof trigger === 'string' ? document.querySelector(trigger) : trigger;
  const scrollTrigger = explicit || target[0].closest('section') || target[0];

  return gsap.to(target, {
    y: distance,
    scale,
    opacity,
    ease: 'none',
    scrollTrigger: {
      trigger: scrollTrigger,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
    },
  });
}
