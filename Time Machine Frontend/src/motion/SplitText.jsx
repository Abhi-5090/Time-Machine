import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'framer-motion';

/**
 * Line-safe text splitting with a GSAP reveal.
 *
 * Words are wrapped in a `overflow: hidden` mask and lifted into place, which
 * reads as type being set rather than text fading in. Splitting by word rather
 * than by character keeps the text selectable, keeps screen readers happy (the
 * original string is exposed via aria-label) and avoids the ransom-note effect
 * that per-character staggering produces on long headlines.
 *
 * This is a headline-only effect. It is slow and deliberate, so it is used on
 * elements a reader sees once, never on anything they interact with repeatedly.
 */
export function SplitText({
  text,
  as: Component = 'span',
  className,
  style,
  delay = 0,
  stagger = 0.045,
  duration = 0.9,
  mode = 'word',
  trigger = true,
}) {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const tokens = useMemo(() => {
    const source = String(text ?? '');
    if (mode === 'char') return source.split('');
    return source.split(/(\s+)/);
  }, [text, mode]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || !trigger) return undefined;

    const targets = node.querySelectorAll('[data-split-token]');
    if (!targets.length) return undefined;

    if (reduceMotion) {
      gsap.set(targets, { yPercent: 0, opacity: 1 });
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        targets,
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: 'expo.out',
          force3D: true,
        }
      );
    }, node);

    return () => context.revert();
  }, [tokens, delay, stagger, duration, reduceMotion, trigger]);

  return (
    <Component ref={containerRef} className={className} style={style} aria-label={String(text ?? '')}>
      {tokens.map((token, index) => {
        if (/^\s+$/.test(token)) {
          return (
            <span key={`space-${index}`} aria-hidden="true">
              {token}
            </span>
          );
        }

        return (
          <span
            key={`${token}-${index}`}
            aria-hidden="true"
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}
          >
            <span
              data-split-token
              style={{ display: 'inline-block', willChange: 'transform', opacity: 0 }}
            >
              {token}
            </span>
          </span>
        );
      })}
    </Component>
  );
}
