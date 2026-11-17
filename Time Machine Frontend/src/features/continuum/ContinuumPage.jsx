import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageShell } from '../../components/layout/PageShell';
import { SectionHeading, EmptyState, Badge, Skeleton } from '../../components/ui/primitives';
import { LottieIcon } from '../../lottie/LottieIcon';
import { Reveal } from '../../motion/Reveal';
import { useReading } from '../../lib/useReading';
import { getContinuumPair } from '../../lib/archive';
import { EASE_OUT, DURATION } from '../../motion/easings';
import './continuum.css';
import { Icon } from '../../components/ui/Icon';

/**
 * The Continuum.
 *
 * Takes the most recent completed reading from each timeline and sets them
 * either side of now. Nothing new is generated: the thread between them is
 * drawn from what the two readings already say, which keeps this honest — it
 * is an arrangement of two stories, not a third story about you.
 */

function useContinuumReading(entry) {
  // The hook must be called unconditionally, so a placeholder id is passed when
  // there is no entry and the result is discarded.
  const { reading, loading } = useReading(entry?.readingId || '__none__', { poll: false });
  if (!entry) return { reading: null, loading: false };
  return { reading, loading };
}

function Panel({ timeline, reading, loading, fallbackHref, fallbackLabel }) {
  if (loading) {
    return (
      <div className="continuum-panel" data-timeline={timeline}>
        <Skeleton height={260} radius="var(--radius-md)" />
        <Skeleton width="70%" height={28} style={{ marginTop: 'var(--space-4)' }} />
        <Skeleton width="45%" height={14} style={{ marginTop: 'var(--space-3)' }} />
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="continuum-panel continuum-panel-empty" data-timeline={timeline}>
        <LottieIcon
          name={timeline === 'future' ? 'radar' : 'hourglass'}
          size={48}
          primary="--accent"
          secondary="--ink-muted"
        />
        <h3 style={{ fontSize: '1.3rem', marginTop: 'var(--space-4)' }}>
          {timeline === 'future' ? 'No 2050 card yet' : 'No past life card yet'}
        </h3>
        <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', marginBlock: 'var(--space-3) var(--space-5)' }}>
          The Continuum needs one of each to thread together.
        </p>
        <Link to={fallbackHref} className="btn btn-primary">
          {fallbackLabel}
          <Icon name="forward" size={14} />
        </Link>
      </div>
    );
  }

  const persona = timeline === 'future' ? reading.futureProfile : reading.characterProfile;
  const name = timeline === 'future' ? persona?.personaName : persona?.characterName;
  const role = timeline === 'future' ? persona?.roleTitle : persona?.occupation;
  const place = timeline === 'future' ? persona?.habitatName : persona?.eraName;

  return (
    <div className="continuum-panel" data-timeline={timeline}>
      <div className="continuum-portrait">
        {reading.portraitUrl ? (
          <img src={reading.portraitUrl} alt={`Portrait of ${name || 'the subject'}`} loading="lazy" />
        ) : null}
      </div>

      <p className="eyebrow" style={{ marginTop: 'var(--space-5)' }}>
        {timeline === 'future' ? 'Ahead · 2050' : 'Behind · your past life'}
      </p>

      <h2 style={{ fontSize: 'clamp(1.6rem, 1.3rem + 1.4vw, 2.3rem)', marginBlock: 'var(--space-2) var(--space-3)' }}>
        {name || reading.title}
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        {role ? <Badge accent>{role}</Badge> : null}
        {place ? <Badge>{place}</Badge> : null}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.94rem', lineHeight: 1.7 }}>
        {timeline === 'future'
          ? reading.presentDayDirective
          : reading.presentDayReflection}
      </p>

      <Link
        to={`/reading/${reading.readingId}`}
        className="btn btn-secondary btn-sm"
        style={{ marginTop: 'var(--space-5)' }}
      >
        Read it in full
        <Icon name="forward" size={13} />
      </Link>
    </div>
  );
}

export default function ContinuumPage() {
  const pair = useMemo(() => getContinuumPair(), []);
  const past = useContinuumReading(pair.past);
  const future = useContinuumReading(pair.future);

  const both = past.reading && future.reading;

  /** The thread: qualities both readings independently landed on. */
  const sharedThreads = useMemo(() => {
    if (!both) return [];
    const pastThemes = (past.reading.symbolicKarmicThemes || []).map((item) => item.theme);
    const pastTraits = past.reading.characterProfile?.characterTraits || [];
    const futureThemes = (future.reading.futureSignalsNarrative || []).map((item) => item.theme);
    const futureTraits = future.reading.futureProfile?.signalThemes || [];

    const left = [...pastThemes, ...pastTraits].map((value) => String(value));
    const right = [...futureThemes, ...futureTraits].map((value) => String(value));

    const overlap = left.filter((value) =>
      right.some((other) => other.toLowerCase() === value.toLowerCase())
    );

    // With no literal overlap, show one from each side instead of nothing —
    // the point is the juxtaposition, not a word match.
    return overlap.length ? [...new Set(overlap)].slice(0, 4) : [left[0], right[0]].filter(Boolean);
  }, [both, past.reading, future.reading]);

  if (!pair.past && !pair.future) {
    return (
      <PageShell timeline="portal" title="Both sides — Time Machine">
        <div className="container" style={{ paddingBlock: 'var(--space-9)' }}>
          <EmptyState
            icon={<Icon name="continuum" size={28} style={{ color: 'var(--ink-muted)' }} />}
            title="Nothing to put together yet"
            description="This page puts your past life card and your 2050 card side by side. Make one of each and it builds itself."
            action={
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/past/new" className="btn btn-secondary">
                  Begin a reading
                </Link>
                <Link to="/future/new" className="btn btn-primary">
                  Run a projection
                </Link>
              </div>
            }
          />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      timeline="portal"
      title="Both sides — Time Machine"
      description="Your past life card and your 2050 card, read as one long life."
    >
      <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
        <SectionHeading
          eyebrow="Both directions"
          title="Both sides of you"
          description="One life, start to finish. Nothing new is written here — these are the two cards you already have, placed either side of today."
          align="center"
        />

        <div className="continuum" style={{ marginTop: 'var(--space-8)' }}>
          <Panel
            timeline="past"
            reading={past.reading}
            loading={past.loading}
            fallbackHref="/past/new"
            fallbackLabel="Begin a reading"
          />

          <motion.div
            className="continuum-seam"
            initial={{ opacity: 0, scaleY: 0.4 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: DURATION.scene, ease: EASE_OUT, delay: 0.2 }}
            aria-hidden="true"
          >
            <span className="continuum-seam-line" />
            <span className="continuum-now">NOW</span>
            <span className="continuum-seam-line" />
          </motion.div>

          <Panel
            timeline="future"
            reading={future.reading}
            loading={future.loading}
            fallbackHref="/future/new"
            fallbackLabel="Run a projection"
          />
        </div>

        {both && sharedThreads.length ? (
          <Reveal className="card" style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
            <LottieIcon name="spark" size={44} primary="--accent" secondary="--accent-2" trigger="visible" />
            <h3 style={{ fontSize: '1.5rem', marginBlock: 'var(--space-4) var(--space-3)' }}>
              What runs through both
            </h3>
            <p
              style={{
                color: 'var(--ink-soft)',
                maxWidth: '54ch',
                marginInline: 'auto',
                fontSize: '0.95rem',
              }}
            >
              Written separately, twenty-five years apart in either direction, both chronicles kept
              returning to the same qualities.
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
                justifyContent: 'center',
                marginTop: 'var(--space-5)',
              }}
            >
              {sharedThreads.map((thread) => (
                <Badge key={thread} accent>
                  {thread}
                </Badge>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </PageShell>
  );
}
