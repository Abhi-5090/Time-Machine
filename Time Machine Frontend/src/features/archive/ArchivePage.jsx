import React, { useMemo, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageShell } from '../../components/layout/PageShell';
import { SectionHeading, EmptyState, Badge } from '../../components/ui/primitives';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { useToast } from '../../components/ui/Toast';
import { LottieIcon } from '../../lottie/LottieIcon';
import { getArchive, subscribeToArchive, forgetReading, clearArchive } from '../../lib/archive';
import { api } from '../../lib/api';
import { EASE_OUT, DURATION } from '../../motion/easings';
import { Icon } from '../../components/ui/Icon';

const FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'past', label: 'Time Machine' },
  { id: 'future', label: '2050' },
];

function useArchiveEntries() {
  const serialised = useSyncExternalStore(
    subscribeToArchive,
    () => JSON.stringify(getArchive()),
    () => '[]'
  );
  return useMemo(() => JSON.parse(serialised), [serialised]);
}

function formatWhen(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Everything this browser has made.
 *
 * The list is local: readings live on the server behind an owner token, but
 * only this device knows which ones belong to it. That is also why removing an
 * entry offers to delete the server-side reading rather than just hiding the
 * row — otherwise a reading would be orphaned, unreachable and still stored.
 */
export default function ArchivePage() {
  const entries = useArchiveEntries();
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const [confirming, setConfirming] = useState(null);
  const [clearing, setClearing] = useState(false);

  const visible = useMemo(
    () => (filter === 'all' ? entries : entries.filter((entry) => entry.timeline === filter)),
    [entries, filter]
  );

  const counts = useMemo(
    () => ({
      past: entries.filter((entry) => entry.timeline === 'past').length,
      future: entries.filter((entry) => entry.timeline === 'future').length,
    }),
    [entries]
  );

  const hasPair = counts.past > 0 && counts.future > 0;

  const removeEntry = async (entry) => {
    setConfirming(null);
    forgetReading(entry.readingId);
    try {
      await api.deleteReading(entry.readingId);
      toast('Deleted from this device and from the server.', { tone: 'success' });
    } catch {
      // The local entry is gone either way; say what actually happened.
      toast('Removed from this device. The server copy will expire on its own.', { tone: 'info' });
    }
  };

  return (
    <PageShell
      timeline="portal"
      title="Archive — Time Machine"
      description="Every reading and projection made on this device."
    >
      <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
        <SectionHeading
          eyebrow="This device"
          title="The archive"
          description="Readings are kept on the server for 30 days. This list is stored only in this browser — clear it and the links are gone, even if the readings have not expired yet."
        />

        {hasPair ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.scene, ease: EASE_OUT }}
            className="card"
            style={{
              marginTop: 'var(--space-6)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'var(--space-4)',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <LottieIcon name="orbit" size={40} primary="--accent" secondary="--accent-2" />
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>You have both halves</h3>
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.88rem' }}>
                  Read them as one life, end to end.
                </p>
              </div>
            </div>
            <Link to="/continuum" className="btn btn-primary">
              <Icon name="continuum" size={15} />
              Open the Continuum
            </Link>
          </motion.div>
        ) : null}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBlock: 'var(--space-7) var(--space-5)',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }} role="tablist">
            {FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={filter === option.id}
                onClick={() => setFilter(option.id)}
                className={`btn btn-sm ${filter === option.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {option.label}
                {option.id !== 'all' ? (
                  <span style={{ opacity: 0.7, marginLeft: 4 }}>{counts[option.id]}</span>
                ) : null}
              </button>
            ))}
          </div>

          {entries.length ? (
            <Button variant="ghost" size="sm" onClick={() => setClearing(true)} icon={<Icon name="delete" size={14} />}>
              Clear this list
            </Button>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={<Icon name="archive" size={28} style={{ color: 'var(--ink-muted)' }} />}
            title="Nothing here yet"
            description="Readings you make will appear here so you can come back to them. Nothing is stored anywhere but this browser."
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
        ) : (
          <motion.ul
            layout
            style={{
              display: 'grid',
              gap: 'var(--space-4)',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            }}
          >
            <AnimatePresence mode="popLayout">
              {visible.map((entry) => (
                <motion.li
                  key={entry.readingId}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97, transition: { duration: DURATION.fast } }}
                  transition={{ duration: DURATION.base, ease: EASE_OUT }}
                  data-timeline={entry.timeline}
                  className="card"
                  style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                >
                  <div
                    style={{
                      aspectRatio: '16 / 10',
                      // aspect-ratio only wins once the box is allowed to be
                      // shorter than its content; the portrait is 4:5, so
                      // without these the card grows to the full image height.
                      minHeight: 0,
                      overflow: 'hidden',
                      background: 'var(--surface-sunken)',
                      display: 'grid',
                      placeItems: 'center',
                      borderBottom: '1px solid var(--rule)',
                    }}
                  >
                    {entry.portraitUrl ? (
                      <img
                        src={entry.portraitUrl}
                        alt=""
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <LottieIcon
                        name={entry.timeline === 'future' ? 'radar' : 'hourglass'}
                        size={42}
                        primary="--accent"
                        secondary="--ink-muted"
                      />
                    )}
                  </div>

                  <div
                    style={{
                      padding: 'var(--space-4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-2)',
                      flex: 1,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <Badge accent>{entry.timeline === 'future' ? '2050' : 'Time Machine'}</Badge>
                      {entry.status !== 'completed' ? <Badge>{entry.status}</Badge> : null}
                    </div>

                    <h3 style={{ fontSize: '1.15rem', lineHeight: 1.25 }}>
                      {entry.title || entry.name || 'Untitled reading'}
                    </h3>

                    {entry.archetype ? (
                      <p style={{ color: 'var(--ink-muted)', fontSize: '0.84rem' }}>{entry.archetype}</p>
                    ) : null}

                    <p style={{ color: 'var(--ink-muted)', fontSize: '0.76rem', marginTop: 'auto' }}>
                      {formatWhen(entry.savedAt)}
                    </p>

                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                      <Link
                        to={
                          entry.status === 'completed'
                            ? `/reading/${entry.readingId}`
                            : `/reading/${entry.readingId}/reveal`
                        }
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1 }}
                      >
                        Open
                        <Icon name="forward" size={13} />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Delete this reading"
                        onClick={() => setConfirming(entry)}
                      >
                        <Icon name="delete" size={14} />
                      </Button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      <Dialog
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        title="Delete this reading?"
        description="The chronicle, the portrait and any photograph you shared will be removed from the server. This cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirming(null)}>
              Keep it
            </Button>
            <Button variant="danger" onClick={() => removeEntry(confirming)} icon={<Icon name="delete" size={14} />}>
              Delete permanently
            </Button>
          </>
        }
      >
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem' }}>
          {confirming?.title || confirming?.name || 'This reading'} will stop being reachable for
          everyone with the link.
        </p>
      </Dialog>

      <Dialog
        open={clearing}
        onClose={() => setClearing(false)}
        title="Clear this device's list?"
        description="This only forgets the links. The readings themselves stay on the server until they expire, but you will not be able to find them again."
        footer={
          <>
            <Button variant="ghost" onClick={() => setClearing(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearArchive();
                setClearing(false);
                toast('Archive cleared on this device.', { tone: 'info' });
              }}
            >
              Clear the list
            </Button>
          </>
        }
      >
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem' }}>
          If you want the readings deleted properly, delete them one at a time instead.
        </p>
      </Dialog>
    </PageShell>
  );
}
