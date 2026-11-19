import React, { useRef, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PageShell } from '../../components/layout/PageShell';
import { ActionBar } from '../../components/reading/ActionBar';
import { ShareQr } from '../../components/reading/ShareQr';
import { Skeleton } from '../../components/ui/primitives';
import { useReading } from '../../lib/useReading';
import { ReportCard } from './ReportCard';
import { PastReport } from './PastReport';
import { FutureReport } from './FutureReport';
import { EASE_OUT, DURATION } from '../../motion/easings';
import { Icon } from '../../components/ui/Icon';
import './results.css';

function LoadingReport() {
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-7)' }}>
      <div className="sheet-frame" style={{ aspectRatio: '794 / 1123' }}>
        <Skeleton height="100%" radius="var(--radius-sm)" />
      </div>
    </div>
  );
}

/**
 * The finished reading.
 *
 * The card is the output. It carries the portrait, the reader's own details
 * and the short paragraph, and it is what the download buttons produce — one
 * sheet, the same on every screen.
 *
 * The full chronicle is still generated and still here, folded away behind a
 * disclosure that starts closed. Someone who wants the nine sections can open
 * them; nobody has to scroll past them to find the thing they came for.
 */
export default function ResultsPage() {
  const { readingId } = useParams();
  const sheetRef = useRef(null);
  const [showFull, setShowFull] = useState(false);

  // Polling stays on: a reader who lands here while a portrait is still being
  // re-rendered should watch it arrive rather than have to refresh.
  const { reading, error, loading } = useReading(readingId);

  if (loading && !reading) {
    return (
      <PageShell timeline="portal" title="Loading your card…">
        <LoadingReport />
      </PageShell>
    );
  }

  if (error && !reading) {
    return (
      <PageShell timeline="portal" title="Reading not found">
        <div
          className="container"
          style={{
            paddingBlock: 'var(--space-9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-4)',
            textAlign: 'center',
          }}
        >
          <Icon name="error" size={30} style={{ color: 'var(--color-danger)' }} />
          <h1 style={{ fontSize: '2.2rem' }}>We could not find that card</h1>
          <p style={{ color: 'var(--ink-muted)', maxWidth: '48ch' }}>
            It may have been deleted, or it may be too old — we keep cards for 30 days and then
            remove them.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/archive" className="btn btn-secondary">
              See your saved cards
            </Link>
            <Link to="/" className="btn btn-primary">
              Back to the start
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  if (reading && reading.status !== 'completed') {
    return <Navigate to={`/reading/${readingId}/reveal`} replace />;
  }

  const timeline = reading.timeline || 'past';
  const name =
    reading.profileSummary?.preferredName?.trim() ||
    (timeline === 'future' ? reading.futureProfile?.personaName : reading.characterProfile?.characterName) ||
    'Time Machine';

  return (
    <PageShell
      timeline={timeline}
      title={`${name} — ${timeline === 'future' ? '2050' : 'Time Machine'}`}
      description={
        timeline === 'future'
          ? 'A made-up story about your life in the year 2050.'
          : 'A made-up story about a life you might have lived.'
      }
    >
      <div className="container card-page">
        <div className="card-page__head">
          <p className="card-page__lede">
            {timeline === 'future'
              ? 'Here is your 2050 card. Save it, or show it to a friend.'
              : 'Here is your past life card. Save it, or show it to a friend.'}
          </p>
          <ActionBar reading={reading} sheetRef={sheetRef} title={name} />
        </div>

        {/* The card and the way to carry it off, side by side. Both
            timelines get this: the code is the same idea either way. */}
        <div className="card-page__spread">
          <ReportCard reading={reading} ref={sheetRef} />
          <ShareQr readingId={reading.readingId} name={name} />
        </div>

        <div className="card-page__more">
          <button
            type="button"
            className="btn btn-ghost"
            aria-expanded={showFull}
            onClick={() => setShowFull((open) => !open)}
          >
            <Icon name={showFull ? 'close' : 'book'} size={14} />
            {showFull ? 'Hide the long story' : 'Read the long story'}
          </button>

          <AnimatePresence initial={false}>
            {showFull ? (
              <motion.div
                key="full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, transition: { duration: DURATION.fast } }}
                transition={{ duration: DURATION.base, ease: EASE_OUT }}
                style={{ overflow: 'hidden' }}
              >
                {timeline === 'future' ? (
                  <FutureReport reading={reading} />
                ) : (
                  <PastReport reading={reading} />
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </PageShell>
  );
}
