import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { TimelineProvider } from '../../theme/TimelineTheme';
import { Backdrop } from '../backdrop/Backdrop';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DURATION, EASE_OUT } from '../../motion/easings';
import { useWarp } from '../../motion/warp';

/**
 * The frame every page sits in.
 *
 * Takes a timeline, which sets the theme for everything inside it — backdrop,
 * navigation, typography and colour all follow from this one prop.
 *
 * Pages that own the whole viewport (the portal, the reveal sequence) pass
 * `chrome={false}` and get the theming without the furniture.
 */
export function PageShell({
  timeline = 'portal',
  chrome = true,
  scrim = true,
  children,
  title,
  description,
  className,
}) {
  const location = useLocation();
  // A page arrived through the gate is revealed by the warp timeline; running
  // the shell's own fade as well would cross-fade two entrances.
  const { isWarping } = useWarp();

  // Document title is set here rather than per page so it can never drift from
  // the route that is actually rendered.
  useEffect(() => {
    if (!title) return;
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);

  useEffect(() => {
    if (!description) return;
    const meta = document.querySelector('meta[name="description"]');
    const previous = meta?.getAttribute('content');
    meta?.setAttribute('content', description);
    return () => {
      if (meta && previous) meta.setAttribute('content', previous);
    };
  }, [description]);

  // A new route always starts at the top. Without this, navigating from the
  // bottom of a long reading drops the reader into the middle of the next page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <TimelineProvider timeline={timeline}>
      <Backdrop />

      {/*
        A veil between the backdrop and the content.
        2050's backdrop is a live perspective grid, which is the right thing
        behind a hero and the wrong thing behind a form — the horizon line lands
        wherever it lands and cuts straight through a field label. Pages whose
        content is the point draw the veil; pages whose backdrop is the point
        (the portal, the landing heroes, the reveal) pass `scrim={false}`.
      */}
      {scrim ? <div className="page-scrim" aria-hidden="true" /> : null}

      {chrome ? (
        <>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Navbar />
        </>
      ) : null}

      <motion.main
        id="main"
        className={className}
        style={{ flex: 1, position: 'relative', zIndex: 'var(--z-content)' }}
        initial={isWarping ? false : { opacity: 0 }}
        animate={isWarping ? undefined : { opacity: 1 }}
        transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      >
        {children}
      </motion.main>

      {chrome ? <Footer /> : null}
    </TimelineProvider>
  );
}
