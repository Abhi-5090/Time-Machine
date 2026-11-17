import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { EASE_OUT, DURATION } from './easings';

/**
 * Reveals its children once, when they scroll into view.
 *
 * `once: true` matters: re-animating on every scroll-past is the single most
 * common way a landing page starts to feel cheap. The negative margin fires the
 * animation slightly before the element reaches the fold so it is already
 * settled by the time the reader looks at it.
 */
export function Reveal({
  children,
  as: Component = 'div',
  delay = 0,
  distance = 16,
  duration = DURATION.scene,
  className,
  style,
  ...rest
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -8% 0px' });
  const reduceMotion = useReducedMotion();

  const MotionComponent = motion[Component] || motion.div;

  return (
    <MotionComponent
      ref={ref}
      className={className}
      style={style}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: distance }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration, ease: EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * Staggers direct children as the group enters view.
 * Children must be `<RevealItem>` (or any motion element using the same variants).
 */
export function RevealGroup({
  children,
  step = 0.055,
  delay = 0,
  as: Component = 'div',
  className,
  style,
  ...rest
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px -6% 0px' });

  const MotionComponent = motion[Component] || motion.div;

  return (
    <MotionComponent
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: step, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}

export function RevealItem({
  children,
  as: Component = 'div',
  distance = 14,
  className,
  style,
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const MotionComponent = motion[Component] || motion.div;

  return (
    <MotionComponent
      className={className}
      style={style}
      variants={{
        hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0, transition: { duration: DURATION.scene, ease: EASE_OUT } },
      }}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
