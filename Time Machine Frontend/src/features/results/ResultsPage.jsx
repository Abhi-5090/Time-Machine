import React, { useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { PageShell } from '../../components/layout/PageShell';
import { ActionBar } from '../../components/reading/ActionBar';
import { Skeleton } from '../../components/ui/primitives';
import { useReading } from '../../lib/useReading';
import { PastReport } from './PastReport';
import { FutureReport } from './FutureReport';
import './results.css';
import { Icon } from '../../components/ui/Icon';

function LoadingReport() {
  return (
    <div className="report container">
      <Skeleton width="38%" height={14} />
      <Skeleton width="72%" height={56} style={{ marginTop: 'var(--space-4)' }} />
      <div className="report-layout" style={{ marginTop: 'var(--space-7)' }}>
        <Skeleton height={420} radius="var(--radius-md)" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {Array.from({ length: 9 }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Skeleton key={index} width={index % 4 === 3 ? '64%' : '100%'} height={14} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The finished reading.
 *
 * Picks the report for the reading's own timeline and themes the whole page to
 * match, so the same URL renders as parchment or as a console depending only on
 * what was generated. A reading still in flight is sent back to the reveal
 * screen rather than shown half-empty.
 */
export default function ResultsPage() {
  const { readingId } = useParams();
  const exportRef = useRef(null);

  // Polling stays on: a reader who lands here while a portrait is still being
  // re-rendered should watch it arrive rather than have to refresh.
  const { reading, error, loading } = useReading(readingId);

  if (loading && !reading) {
    return (
      <PageShell timeline="portal" title="Loading reading…">
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
          <h1 style={{ fontSize: '2.2rem' }}>That reading is not here</h1>
          <p style={{ color: 'var(--ink-muted)', maxWidth: '48ch' }}>
            It may have been deleted, or it may have expired — readings are kept for 30 days and then
            removed automatically.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/archive" className="btn btn-secondary">
              Open the archive
            </Link>
            <Link to="/" className="btn btn-primary">
              Back to both doors
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
  const title =
    reading.title ||
    (timeline === 'future' ? reading.futureProfile?.personaName : reading.characterProfile?.characterName) ||
    'Time Machine reading';

  return (
    <PageShell
      timeline={timeline}
      title={`${title} — ${timeline === 'future' ? '2050' : 'Time Machine'}`}
      description={
        timeline === 'future'
          ? 'A speculative chronicle of one life in the year 2050.'
          : 'An imaginative chronicle of a life that might have been.'
      }
    >
      <div className="container" style={{ paddingTop: 'var(--space-5)' }}>
        <div className="report-actions">
          <ActionBar reading={reading} exportRef={exportRef} title={title} />
        </div>
      </div>

      {/* The export target: everything inside is what lands in the PNG/PDF. */}
      <div ref={exportRef}>
        {timeline === 'future' ? <FutureReport reading={reading} /> : <PastReport reading={reading} />}
      </div>
    </PageShell>
  );
}
