import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PageShell } from '../../components/layout/PageShell';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/primitives';
import { LottieIcon } from '../../lottie/LottieIcon';
import { ScrambleText } from '../../motion/interactions';
import { useReading } from '../../lib/useReading';
import { api } from '../../lib/api';
import { useToast } from '../../components/ui/Toast';
import { EASE_OUT, DURATION } from '../../motion/easings';
import './reveal.css';
import { Icon } from '../../components/ui/Icon';

const COPY = {
  past: {
    eyebrow: 'The chamber is open',
    heading: 'The chart is being read',
    sub: 'This takes a little under a minute. The chronicle is written chapter by chapter, and the portrait last.',
    icon: 'hourglass',
    doneIcon: 'bloom',
    doneHeading: 'Your chronicle is ready',
    doneAction: 'Read the chronicle',
  },
  future: {
    eyebrow: 'Frame locked',
    heading: 'Projecting 2050',
    sub: 'Resolving twenty-five years of trajectory, then the capture. This takes a little under a minute.',
    icon: 'radar',
    doneIcon: 'aperture',
    doneHeading: 'Projection resolved',
    doneAction: 'Open the projection',
  },
};

/**
 * The generation screen.
 *
 * It is the only place in the app where the reader is made to wait, so it is
 * the one place where a longer, more theatrical animation is justified: the
 * stage list is the actual server pipeline, ticked off as the job advances, and
 * the progress bar is the real figure rather than a fake creep.
 *
 * On completion it holds for a beat before navigating. Snapping straight to the
 * results would throw away the only moment of arrival the experience has.
 */
export default function RevealScreen() {
  const { readingId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const reduceMotion = useReducedMotion();
  const [retrying, setRetrying] = useState(false);

  const { reading, error, loading } = useReading(readingId);
  const timeline = reading?.timeline || 'past';
  const copy = COPY[timeline] || COPY.past;

  const stages = reading?.stages || [];
  const currentIndex = useMemo(() => {
    if (!reading) return 0;
    if (reading.status === 'completed') return stages.length;
    const found = stages.findIndex((stage) => stage.id === reading.currentStage);
    return found === -1 ? 0 : found;
  }, [reading, stages]);

  const done = reading?.status === 'completed';
  const failed = reading?.status === 'failed';

  useEffect(() => {
    if (!done) return undefined;
    const timer = setTimeout(() => navigate(`/reading/${readingId}`, { replace: true }), reduceMotion ? 300 : 2100);
    return () => clearTimeout(timer);
  }, [done, navigate, readingId, reduceMotion]);

  const retry = async () => {
    setRetrying(true);
    try {
      await api.retryReading(readingId);
      toast('Trying again.', { tone: 'info' });
    } catch (retryError) {
      toast(retryError.message || 'That retry did not go through.', { tone: 'error' });
    } finally {
      setRetrying(false);
    }
  };

  if (error && !reading) {
    return (
      <PageShell timeline="portal" title="Reading not found">
        <div className="container reveal-shell">
          <Icon name="error" size={30} style={{ color: 'var(--color-danger)' }} />
          <h1 style={{ fontSize: '2rem' }}>That reading could not be found</h1>
          <p style={{ color: 'var(--ink-muted)', maxWidth: '48ch' }}>
            It may have been deleted, or it may have expired — readings are kept for 30 days.
          </p>
          <Link to="/" className="btn btn-primary">
            Back to both doors
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      timeline={timeline}
      chrome={false}
      scrim={false}
      title={done ? copy.doneHeading : copy.heading}
      className="reveal"
    >
      <div className="container reveal-shell">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              className="reveal-stage"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT }}
            >
              <LottieIcon
                name={copy.doneIcon}
                size={96}
                primary="--accent"
                secondary="--accent-2"
                trigger="once"
              />
              <p className="eyebrow">{copy.eyebrow}</p>
              <h1 className="reveal-heading">{copy.doneHeading}</h1>
              <p className="reveal-sub">{reading.title}</p>
              <Button as={Link} to={`/reading/${readingId}`} size="lg">
                {copy.doneAction}
              </Button>
            </motion.div>
          ) : failed ? (
            <motion.div
              key="failed"
              className="reveal-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT }}
            >
              <Icon name="error" size={34} style={{ color: 'var(--color-danger)' }} />
              <h1 className="reveal-heading">Something interrupted it</h1>
              <p className="reveal-sub">
                {reading.errorMessage || 'The generation stopped before it finished.'}
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button onClick={retry} loading={retrying} icon={<Icon name="retry" size={15} />}>
                  Try again
                </Button>
                <Button as={Link} to={`/${timeline}`} variant="secondary">
                  Start over
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="working"
              className="reveal-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: DURATION.fast } }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT }}
            >
              <LottieIcon name={copy.icon} size={96} primary="--accent" secondary="--accent-2" />

              <p className="eyebrow">
                {timeline === 'future' ? <ScrambleText text={copy.eyebrow} /> : copy.eyebrow}
              </p>
              <h1 className="reveal-heading">{copy.heading}</h1>
              <p className="reveal-sub">{copy.sub}</p>

              <div style={{ width: 'min(100%, 520px)', marginTop: 'var(--space-5)' }}>
                <Progress
                  value={loading ? 8 : reading?.stageProgressPercent || 0}
                  label={timeline === 'future' ? 'Projection' : 'Reading'}
                  showValue
                />
              </div>

              <ol className="reveal-stages" aria-live="polite">
                {stages.map((stage, index) => {
                  const state = index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'waiting';
                  return (
                    <motion.li
                      key={stage.id}
                      data-state={state}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: index * 0.07 }}
                    >
                      <span className="reveal-stage-marker" aria-hidden="true">
                        {state === 'done' ? (
                          <Icon name="check" size={13} />
                        ) : state === 'active' ? (
                          <span className="reveal-stage-pulse" />
                        ) : null}
                      </span>
                      <span>
                        <span className="reveal-stage-label">{stage.label}</span>
                        <span className="reveal-stage-detail">{stage.detail}</span>
                      </span>
                    </motion.li>
                  );
                })}
              </ol>

              {reading?.providerMode === 'mock' ? (
                <p className="reveal-note">
                  {reading.degradedReason
                    ? 'Live generation is unavailable — the portrait will be a placeholder.'
                    : 'Offline mode — this reading is generated locally, without an AI provider.'}
                </p>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
