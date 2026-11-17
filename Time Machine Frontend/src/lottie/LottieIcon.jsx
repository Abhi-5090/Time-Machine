import React, { Suspense, lazy, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { LOTTIE_ICONS } from './library';
import { useTimeline } from '../theme/TimelineTheme';

/**
 * The player is loaded on demand.
 *
 * lottie-web is the single heaviest dependency in the app and every icon is
 * decorative, so it has no business blocking first paint. The wrapper below
 * always reserves its final size, which means the icon appearing a moment later
 * shifts nothing on the page.
 */
const Lottie = lazy(() => import('lottie-react'));

/**
 * Reads live CSS custom properties off the element.
 *
 * Icon colour has to come from the theme rather than from a prop, otherwise
 * every caller would have to know which timeline it is on. Resolution happens
 * after mount (custom properties are not readable before) and again whenever
 * the timeline changes.
 */
function useResolvedColors(ref, names, timelineId) {
  const [colors, setColors] = useState(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const computed = getComputedStyle(node);
    const resolved = {};
    for (const [key, token] of Object.entries(names)) {
      resolved[key] = token.startsWith('--')
        ? computed.getPropertyValue(token).trim() || '#999999'
        : token;
    }
    setColors(resolved);
    // `names` is recreated each render by callers, so it is intentionally
    // excluded; the token set for a given icon never changes at runtime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineId, ref]);

  return colors;
}

/**
 * A themed Lottie icon.
 *
 * @param name     key from the icon library
 * @param size     rendered square size in px
 * @param primary  CSS custom property (or literal colour) for the main shape
 * @param secondary CSS custom property for the accent shape
 * @param trigger  'auto' loops forever, 'hover' plays on pointer enter,
 *                 'once' plays a single time on mount, 'visible' plays when
 *                 scrolled into view
 */
export function LottieIcon({
  name,
  size = 28,
  primary = '--accent',
  secondary = '--ink-soft',
  trigger = 'auto',
  speed = 1,
  className,
  style,
  title,
}) {
  const wrapperRef = useRef(null);
  const lottieRef = useRef(null);
  const timeline = useTimeline();
  const reduceMotion = useReducedMotion();

  const colors = useResolvedColors(wrapperRef, { primary, secondary }, timeline.id);

  const animationData = useMemo(() => {
    const builder = LOTTIE_ICONS[name];
    if (!builder || !colors) return null;
    return builder(colors);
  }, [name, colors]);

  const loop = trigger === 'auto';
  const autoplay = trigger === 'auto' || trigger === 'once';

  useEffect(() => {
    const instance = lottieRef.current;
    if (!instance || !animationData) return;

    instance.setSpeed(speed);

    // Reduced motion: show the shape, hold it still. The icon still reads as an
    // icon, it simply stops moving.
    if (reduceMotion) {
      instance.goToAndStop(Math.floor(animationData.op * 0.35), true);
      return;
    }

    if (autoplay) instance.play();
  }, [animationData, autoplay, reduceMotion, speed]);

  // Play once when scrolled into view.
  useEffect(() => {
    if (trigger !== 'visible' || reduceMotion) return undefined;
    const node = wrapperRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        lottieRef.current?.goToAndPlay(0, true);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [trigger, reduceMotion, animationData]);

  const hoverHandlers =
    trigger === 'hover' && !reduceMotion
      ? {
          onPointerEnter: () => lottieRef.current?.goToAndPlay(0, true),
          onPointerLeave: () => lottieRef.current?.goToAndStop(0, true),
        }
      : {};

  return (
    <span
      ref={wrapperRef}
      className={className}
      style={{
        display: 'inline-flex',
        width: size,
        height: size,
        flex: 'none',
        lineHeight: 0,
        ...style,
      }}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      {...hoverHandlers}
    >
      {animationData ? (
        <Suspense fallback={null}>
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop={loop && !reduceMotion}
            autoplay={autoplay && !reduceMotion}
            style={{ width: '100%', height: '100%' }}
            rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
          />
        </Suspense>
      ) : null}
    </span>
  );
}
