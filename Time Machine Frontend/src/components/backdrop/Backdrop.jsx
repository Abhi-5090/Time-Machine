import React from 'react';
import { PastBackdrop } from './PastBackdrop';
import { FutureBackdrop } from './FutureBackdrop';
import { PortalBackdrop } from './PortalBackdrop';
import { useTimeline } from '../../theme/TimelineTheme';

const BACKDROPS = {
  past: PastBackdrop,
  future: FutureBackdrop,
  portal: PortalBackdrop,
};

/**
 * Renders the backdrop belonging to the current timeline.
 *
 * Keyed on the timeline id so switching worlds tears the old canvas down
 * rather than trying to reuse it — the scenes hold their own particle state and
 * share nothing.
 */
export function Backdrop() {
  const timeline = useTimeline();
  const Scene = BACKDROPS[timeline.id] || PortalBackdrop;
  return <Scene key={timeline.id} />;
}
