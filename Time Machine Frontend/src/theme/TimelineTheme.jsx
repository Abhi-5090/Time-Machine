import React, { createContext, useContext, useEffect, useMemo } from 'react';

/**
 * Timeline theming.
 *
 * Routes declare which world they belong to; this writes `data-timeline` onto
 * <html> so every token in tokens.css re-resolves, and keeps the browser UI
 * colour in step. Components read `useTimeline()` when they need to branch on
 * behaviour rather than on styling — styling should come from tokens alone.
 */

const THEME_COLORS = {
  portal: '#06080F',
  past: '#E9DFCA',
  future: '#04070E',
};

export const TIMELINES = {
  portal: {
    id: 'portal',
    label: 'Time Machine',
    isPast: false,
    isFuture: false,
  },
  past: {
    id: 'past',
    label: 'Time Machine',
    tagline: 'Step into your past.',
    accentName: 'brass',
    isPast: true,
    isFuture: false,
  },
  future: {
    id: 'future',
    label: '2050',
    tagline: 'Do you want to know about your future?',
    accentName: 'signal',
    isPast: false,
    isFuture: true,
  },
};

const TimelineContext = createContext(TIMELINES.portal);

export function TimelineProvider({ timeline = 'portal', children }) {
  const value = useMemo(() => TIMELINES[timeline] || TIMELINES.portal, [timeline]);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-timeline');
    root.setAttribute('data-timeline', value.id);

    const meta = document.querySelector('meta[name="theme-color"]');
    const previousColor = meta?.getAttribute('content');
    meta?.setAttribute('content', THEME_COLORS[value.id] || THEME_COLORS.portal);

    return () => {
      if (previous) root.setAttribute('data-timeline', previous);
      if (meta && previousColor) meta.setAttribute('content', previousColor);
    };
  }, [value.id]);

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>;
}

export function useTimeline() {
  return useContext(TimelineContext);
}
