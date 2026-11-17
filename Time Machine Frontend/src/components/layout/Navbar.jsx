import React, { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimeline } from '../../theme/TimelineTheme';
import { useWarp } from '../../motion/warp';
import { LottieIcon } from '../../lottie/LottieIcon';
import { getArchive, subscribeToArchive } from '../../lib/archive';
import { EASE_OUT, DURATION } from '../../motion/easings';
import { Icon } from '../ui/Icon';

const LINKS = {
  past: [
    { to: '/past', label: 'The Chamber', icon: 'chamber', end: true },
    { to: '/past/new', label: 'Begin a reading', icon: 'begin' },
    { to: '/archive', label: 'Archive', icon: 'archive' },
    { to: '/continuum', label: 'Continuum', icon: 'continuum' },
    { to: '/how-it-works', label: 'How it works', icon: 'help' },
  ],
  future: [
    { to: '/future', label: 'Terminal', icon: 'terminal', end: true },
    { to: '/future/new', label: 'Run projection', icon: 'project' },
    { to: '/archive', label: 'Archive', icon: 'archive' },
    { to: '/continuum', label: 'Continuum', icon: 'continuum' },
    { to: '/how-it-works', label: 'How it works', icon: 'help' },
  ],
  portal: [
    { to: '/past', label: 'Time Machine', icon: 'chamber' },
    { to: '/future', label: '2050', icon: 'terminal' },
    { to: '/archive', label: 'Archive', icon: 'archive' },
    { to: '/how-it-works', label: 'How it works', icon: 'help' },
  ],
};

const MARKS = {
  past: { icon: 'hourglass', title: 'Time Machine' },
  future: { icon: 'pulse', title: '2050' },
  portal: { icon: 'orbit', title: 'Time Machine' },
};

function useArchiveCount() {
  return useSyncExternalStore(
    subscribeToArchive,
    () => getArchive().length,
    () => 0
  );
}

export function Navbar() {
  const timeline = useTimeline();
  const location = useLocation();
  const navigate = useNavigate();
  const { runWarp } = useWarp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const archiveCount = useArchiveCount();

  const links = LINKS[timeline.id] || LINKS.portal;
  const mark = MARKS[timeline.id] || MARKS.portal;
  const onPortal = timeline.id === 'portal';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A route change always closes the menu; leaving it open after navigation is
  // the kind of thing that only shows up on a phone.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  /**
   * Back to the threshold, travelling the same way you came.
   *
   * The gate runs in reverse: the page recedes into the centre of the screen,
   * the light closes over it, and the opening scene resolves out of the other
   * side. It is the warp used on the way in, pointed the other way, so coming
   * back feels like the same journey rather than a browser Back.
   */
  const goToThreshold = useCallback(() => {
    const main = document.getElementById('main');
    runWarp({
      tone: timeline.id === 'future' ? 'future' : 'past',
      origin: { x: window.innerWidth / 2, y: window.innerHeight * 0.46 },
      onNavigate: () => navigate('/'),
      build: (tl) => {
        if (!main) return;
        tl.to(main, {
          scale: 0.86,
          opacity: 0,
          filter: 'blur(6px)',
          transformOrigin: '50% 46%',
          duration: 0.68,
          ease: 'power2.in',
        }, 0);
      },
    });
  }, [navigate, runWarp, timeline.id]);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-nav)',
        background: scrolled ? 'color-mix(in srgb, var(--bg) 88%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--rule)' : 'transparent'}`,
        transition:
          'background-color var(--dur-base) var(--ease-soft), border-color var(--dur-base) var(--ease-soft), backdrop-filter var(--dur-base) var(--ease-soft)',
      }}
    >
      <nav
        className="container"
        style={{
          height: 'var(--nav-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-5)',
        }}
      >
        <Link
          to={onPortal ? '/' : `/${timeline.id}`}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
          aria-label={`${mark.title} — home`}
        >
          <LottieIcon name={mark.icon} size={30} primary="--accent" secondary="--ink-soft" trigger="hover" />
          <span
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: timeline.isFuture ? '0.92rem' : '1rem',
              fontWeight: 700,
              letterSpacing: timeline.isFuture ? '0.2em' : '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {mark.title}
          </span>
        </Link>

        {/* Desktop navigation */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}
          className="nav-desktop"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
            >
              <Icon name={link.icon} size={13} className="nav-link-icon" />
              {link.label}
              {link.to === '/archive' && archiveCount > 0 ? (
                <span className="nav-count tabular">{archiveCount}</span>
              ) : null}
            </NavLink>
          ))}

          {!onPortal ? (
            <button type="button" className="btn btn-secondary btn-sm nav-back" onClick={goToThreshold}>
              <Icon name="back" size={13} />
              Back to the gate
            </button>
          ) : null}
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          className="nav-mobile-trigger btn btn-ghost btn-sm"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <Icon name="close" size={20} /> : <Icon name="menu" size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-nav"
            className="nav-mobile-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, transition: { duration: DURATION.fast } }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--rule)', background: 'var(--bg-elevated)' }}
          >
            <div
              className="container"
              style={{ display: 'flex', flexDirection: 'column', paddingBlock: 'var(--space-4)' }}
            >
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} className="nav-mobile-link">
                  <Icon name={link.icon} size={15} style={{ color: 'var(--accent)' }} />
                  {link.label}
                  {link.to === '/archive' && archiveCount > 0 ? (
                    <span className="nav-count tabular">{archiveCount}</span>
                  ) : null}
                </NavLink>
              ))}
              {!onPortal ? (
                <button
                  type="button"
                  className="nav-mobile-link"
                  style={{ color: 'var(--accent)', width: '100%' }}
                  onClick={goToThreshold}
                >
                  <Icon name="back" size={15} />
                  Back to the gate
                </button>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
