import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../../components/layout/PageShell';
import { LottieIcon } from '../../lottie/LottieIcon';

export default function NotFoundPage() {
  return (
    <PageShell timeline="portal" title="Not found — Time Machine">
      <div
        className="container"
        style={{
          paddingBlock: 'var(--space-10)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
          textAlign: 'center',
        }}
      >
        <LottieIcon name="compass" size={72} primary="--accent" secondary="--accent-2" />

        <p className="eyebrow">Off the timeline</p>
        <h1 style={{ fontSize: 'clamp(2.4rem, 1.8rem + 3vw, 4rem)' }}>There is nothing at this moment</h1>
        <p style={{ color: 'var(--ink-muted)', maxWidth: '46ch' }}>
          Whatever used to be here has either moved or has not happened yet. Both doors are still open.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
          <Link to="/past" className="btn btn-secondary">
            Time Machine
          </Link>
          <Link to="/" className="btn btn-primary">
            Both doors
          </Link>
          <Link to="/future" className="btn btn-secondary">
            2050
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
