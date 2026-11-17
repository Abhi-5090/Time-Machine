import React from 'react';
import { LottieIcon } from '../../lottie/LottieIcon';

/**
 * Shown while a lazily-loaded route is fetched.
 *
 * Deliberately almost empty: on a fast connection this is on screen for a
 * handful of frames, and anything that animates in would be a flash rather
 * than a transition. The indicator is only revealed after a delay, so a quick
 * load shows nothing at all instead of a flicker.
 */
export function RouteFallback() {
  return (
    <div
      style={{
        flex: 1,
        minHeight: '60dvh',
        display: 'grid',
        placeItems: 'center',
        opacity: 0,
        animation: 'tm-fallback-in 1ms linear 320ms forwards',
      }}
      role="status"
      aria-label="Loading"
    >
      <LottieIcon name="loader" size={44} primary="--accent" secondary="--ink-muted" />
    </div>
  );
}
