import React from 'react';
import { Link } from 'react-router-dom';
import { useTimeline } from '../../theme/TimelineTheme';
import { LottieIcon } from '../../lottie/LottieIcon';
import { Icon } from '../ui/Icon';

const DISCLAIMERS = {
  past:
    'Time Machine writes imaginative, astrology-inspired fiction. It does not claim to prove reincarnation, diagnose anything, or report verified history.',
  future:
    '2050 is speculative fiction. It is not a forecast and not advice about your real health, finances, relationships, or future.',
  portal:
    'Everything here is fiction, on both sides of now. Nothing on this site is a prediction, a diagnosis, or advice.',
};

/** A labelled column of icon-led links. */
function FooterNav({ label, links }) {
  return (
    <nav aria-label={label}>
      <p className="eyebrow" style={{ marginBottom: 'var(--space-4)' }}>
        {label}
      </p>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="footer-link">
              <Icon name={link.icon} size={13} />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const timeline = useTimeline();
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 'var(--z-content)',
        marginTop: 'var(--space-10)',
        borderTop: '1px solid var(--rule)',
        background: 'color-mix(in srgb, var(--bg-deep) 55%, transparent)',
      }}
    >
      <div
        className="container"
        style={{
          paddingBlock: 'var(--space-7)',
          display: 'grid',
          gap: 'var(--space-6)',
          // `min(100%, …)` caps the track at the container width. Without it the
          // 260px minimum plus two 150px columns exceeds a phone's content box
          // and pushes the whole document into horizontal scroll.
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <LottieIcon name="orbit" size={26} primary="--accent" secondary="--ink-muted" trigger="hover" />
            <span
              style={{
                fontFamily: 'var(--font-label)',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontSize: '0.9rem',
              }}
            >
              Time Machine
            </span>
          </div>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.86rem', maxWidth: '46ch', lineHeight: 1.6 }}>
            {DISCLAIMERS[timeline.id] || DISCLAIMERS.portal}
          </p>
        </div>

        <FooterNav
          label="Journeys"
          links={[
            { to: '/past', label: 'Time Machine', icon: 'chamber' },
            { to: '/future', label: '2050', icon: 'terminal' },
            { to: '/continuum', label: 'Continuum', icon: 'continuum' },
            { to: '/archive', label: 'Archive', icon: 'archive' },
          ]}
        />

        <FooterNav
          label="About"
          links={[
            { to: '/how-it-works', label: 'How it works', icon: 'help' },
            { to: '/privacy', label: 'Privacy', icon: 'shield' },
            { to: '/terms', label: 'Terms', icon: 'signature' },
          ]}
        />
      </div>

      <div
        className="container"
        style={{
          paddingBottom: 'var(--space-6)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: 'var(--ink-muted)',
        }}
      >
        <span>© {year} Time Machine. A work of fiction, in both directions.</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>
          {timeline.isFuture ? 'FRAME // 2050' : timeline.isPast ? 'Ad astra per memoriam' : 'Two doors, one now'}
        </span>
      </div>
    </footer>
  );
}
