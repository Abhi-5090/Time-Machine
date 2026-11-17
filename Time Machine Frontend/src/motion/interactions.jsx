import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { SPRING, EASE_OUT, DURATION } from './easings';

/**
 * Pointer-tracking helpers.
 *
 * Every effect in this file is decorative: none of them convey state. That is
 * the licence for them to exist at all, and it is also why each one is wired
 * through a spring — tying a visual directly to a raw pointer coordinate feels
 * artificial because real objects have momentum.
 *
 * All of them no-op under `prefers-reduced-motion`.
 */

/** Follows the pointer with spring lag. Used on portal doors and CTAs. */
export function Magnetic({ children, strength = 0.28, className, style, ...rest }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING.pointer);
  const springY = useSpring(y, SPRING.pointer);
  const transform = useTransform(
    [springX, springY],
    ([latestX, latestY]) => `translate3d(${latestX}px, ${latestY}px, 0)`
  );

  const handleMove = useCallback(
    (event) => {
      if (reduceMotion || !ref.current) return;
      const bounds = ref.current.getBoundingClientRect();
      x.set((event.clientX - (bounds.left + bounds.width / 2)) * strength);
      y.set((event.clientY - (bounds.top + bounds.height / 2)) * strength);
    },
    [reduceMotion, strength, x, y]
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={className}
      // A transform string rather than the x/y shorthand: the shorthand runs on
      // the main thread and drops frames while the page is still loading.
      style={{ ...style, transform }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Tilts in 3D toward the pointer. Reserved for large feature surfaces. */
export function TiltCard({
  children,
  maxTilt = 7,
  glare = false,
  className,
  style,
  ...rest
}) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const rotateX = useSpring(useMotionValue(0), SPRING.pointer);
  const rotateY = useSpring(useMotionValue(0), SPRING.pointer);
  const glareX = useSpring(useMotionValue(50), SPRING.pointer);
  const glareY = useSpring(useMotionValue(50), SPRING.pointer);

  const handleMove = (event) => {
    if (reduceMotion || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;

    rotateY.set((px - 0.5) * maxTilt * 2);
    rotateX.set((0.5 - py) * maxTilt * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 55%)`
  );

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={className}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        perspective: 1100,
        rotateX,
        rotateY,
      }}
      {...rest}
    >
      {children}
      {glare && !reduceMotion ? (
        <motion.span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            background: glareBackground,
          }}
        />
      ) : null}
    </motion.div>
  );
}

/**
 * Counts a number up when it scrolls into view.
 * Uses rAF rather than a CSS transition because the value itself is the content.
 */
export function CountUp({ value, duration = 1100, decimals = 0, className, style }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    const target = Number(value) || 0;

    if (reduceMotion || !node || typeof IntersectionObserver === 'undefined') {
      setDisplay(target);
      return undefined;
    }

    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const startedAt = performance.now();

        const tick = (now) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          // Matches --ease-out: fast departure, long settle.
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(target * eased);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration, reduceMotion]);

  return (
    <span ref={ref} className={className} style={style}>
      {display.toFixed(decimals)}
    </span>
  );
}

/**
 * Resolves text out of random glyphs, character by character.
 * 2050 only — this is a decode effect, and the past has nothing to decode.
 */
export function ScrambleText({
  text,
  className,
  style,
  speed = 28,
  revealEvery = 2,
  as: Component = 'span',
}) {
  const [output, setOutput] = useState(text);
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);

  useEffect(() => {
    const target = String(text ?? '');
    const node = ref.current;

    if (reduceMotion || !node || typeof IntersectionObserver === 'undefined') {
      setOutput(target);
      return undefined;
    }

    const glyphs = '▚▞▙▟01<>/\\=+*#%&@';
    let timer = 0;
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;

        let frame = 0;
        timer = setInterval(() => {
          const revealed = Math.floor(frame / revealEvery);
          if (revealed > target.length) {
            clearInterval(timer);
            setOutput(target);
            return;
          }
          setOutput(
            target
              .split('')
              .map((char, index) => {
                if (index < revealed || char === ' ') return char;
                return glyphs[Math.floor(Math.random() * glyphs.length)];
              })
              .join('')
          );
          frame += 1;
        }, speed);

        observer.disconnect();
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [text, speed, revealEvery, reduceMotion]);

  return (
    <Component ref={ref} className={className} style={style} aria-label={String(text ?? '')}>
      <span aria-hidden="true">{output}</span>
    </Component>
  );
}

/**
 * Continuous horizontal scroll. Linear easing, because constant motion with any
 * other curve reads as broken.
 */
export function Marquee({ children, speed = 42, reverse = false, className, style }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={{ ...style, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 'var(--space-6)' }}>{children}</div>
      </div>
    );
  }

  return (
    <div className={className} style={{ ...style, overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
      <motion.div
        style={{ display: 'flex', gap: 'var(--space-6)', width: 'max-content' }}
        animate={{ transform: reverse ? ['translateX(-50%)', 'translateX(0%)'] : ['translateX(0%)', 'translateX(-50%)'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {children}
        <span aria-hidden="true" style={{ display: 'flex', gap: 'var(--space-6)' }}>
          {children}
        </span>
      </motion.div>
    </div>
  );
}

/** Moves a layer at a fraction of scroll speed. Backgrounds only. */
export function useParallaxStyle(strength = 0.12) {
  const [offset, setOffset] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setOffset(window.scrollY * strength));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [strength, reduceMotion]);

  return { transform: `translate3d(0, ${offset}px, 0)` };
}

export const transitions = { EASE_OUT, DURATION };
