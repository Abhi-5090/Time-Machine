import React, { useId } from 'react';

/**
 * The stand-in picture, shown when no photograph was shared.
 *
 * A reading only draws a portrait when the reader gave us a face to draw from.
 * Without one there is nothing to generate, so the card prints this instead of
 * an invented stranger. It is deliberately a plain bust — the same shape every
 * account menu on earth uses for "no picture" — because the one thing it must
 * never do is look like an attempt at the reader's face.
 *
 * Two reasons it is inline SVG rather than a file:
 *
 *  1. The card is exported to PNG and PDF by rendering this exact DOM to a
 *     canvas. An <img> has to be fetched and inlined first, which is the step
 *     most likely to fail quietly and leave a blank square in the file people
 *     keep. Inline geometry is simply there.
 *  2. It re-colours itself with the sheet. Every colour below is currentColor
 *     at some opacity, so the single `color` on the wrapper — resolved from
 *     the timeline's tokens — carries the whole drawing. That matters for the
 *     export too: getComputedStyle resolves `color` to a literal rgb() the
 *     cloned node inherits, where a var() inside a fill attribute would not
 *     survive the clone.
 */

/** Head and shoulders. The shoulders meet the head at their apex, so the two
 *  read as one silhouette rather than a circle resting on a hill. */
const HEAD = { cx: 150, cy: 176, r: 60 };
const SHOULDERS = 'M 20 400 C 20 330, 74 254, 150 254 C 226 254, 280 330, 280 400 Z';

export function PortraitPlaceholder({ timeline = 'past', className, style }) {
  // Gradient ids must be unique per instance, or two cards on one page would
  // both paint with whichever mounted last. Colons from useId are stripped
  // because url(#…) references dislike them.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const isFuture = timeline === 'future';

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 300 400"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A drawn stand-in, shown because no photo was shared"
    >
      <defs>
        <linearGradient id={`wash-${uid}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="400">
          <stop offset="0%" stopColor="currentColor" stopOpacity={isFuture ? 0.1 : 0.07} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={isFuture ? 0.02 : 0.015} />
        </linearGradient>

        {/* userSpaceOnUse, not the default objectBoundingBox: the head and the
            shoulders are separate shapes and have to share one continuous
            gradient, or the silhouette visibly restarts at the neck. */}
        <linearGradient id={`bust-${uid}`} gradientUnits="userSpaceOnUse" x1="0" y1="110" x2="0" y2="400">
          <stop offset="0%" stopColor="currentColor" stopOpacity={isFuture ? 0.16 : 0.3} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={isFuture ? 0.04 : 0.12} />
        </linearGradient>
      </defs>

      <rect width="300" height="400" fill={`url(#wash-${uid})`} />

      <g fill={`url(#bust-${uid})`}>
        <circle cx={HEAD.cx} cy={HEAD.cy} r={HEAD.r} />
        <path d={SHOULDERS} />
      </g>

      {/* 2050 reads its stand-in as an unresolved capture: the silhouette is
          drawn as geometry and ruled with scan lines. */}
      {isFuture ? (
        <>
          <g fill="none" stroke="currentColor" strokeOpacity="0.42" strokeWidth="1.5">
            <circle cx={HEAD.cx} cy={HEAD.cy} r={HEAD.r} />
            <path d={SHOULDERS} />
          </g>
          <g fill="currentColor" fillOpacity="0.13">
            {Array.from({ length: 33 }, (_, i) => (
              <rect key={i} x="0" y={i * 12} width="300" height="1" />
            ))}
          </g>
        </>
      ) : null}
    </svg>
  );
}
