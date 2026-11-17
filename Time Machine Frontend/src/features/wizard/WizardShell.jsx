import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PageShell } from '../../components/layout/PageShell';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/primitives';
import { EASE_OUT, DURATION } from '../../motion/easings';
import './wizard.css';
import { Icon } from '../../components/ui/Icon';

/**
 * The frame both wizards run inside.
 *
 * Owns the step rail, progress, transitions and the forward/back controls, so a
 * timeline only has to describe its steps. Two behaviours are deliberate:
 *
 *   · Enter advances, but only from inside the step body and never from a
 *     textarea — an onboarding flow where Return does nothing feels broken, and
 *     one where it submits early feels hostile;
 *   · the step heading takes focus on every change, so a screen reader
 *     announces where it just arrived rather than staying on a now-detached
 *     Continue button.
 */
export function WizardShell({
  timeline,
  title,
  description,
  wizard,
  submitting = false,
  submitLabel = 'Begin',
  onSubmit,
  footnote,
}) {
  const headingRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { index, direction, step, steps, error, isFirst, isLast, furthest, next, back, goTo, trySubmit, progress } =
    wizard;

  // Submission goes through the step machine so the last step is validated and
  // its blocking message revealed, exactly as Continue does on every other step.
  const handleSubmit = () => trySubmit(onSubmit);

  useEffect(() => {
    headingRef.current?.focus();
  }, [index]);

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return;
    const tag = event.target.tagName;
    if (tag === 'TEXTAREA' || tag === 'BUTTON' || event.target.isContentEditable) return;
    event.preventDefault();
    if (isLast) handleSubmit();
    else next();
  };

  const offset = reduceMotion ? 0 : 24;

  return (
    <PageShell timeline={timeline} title={title} description={description}>
      <div className="wizard container-narrow">
        {/* ── Rail ─────────────────────────────────────────────────── */}
        <nav className="wizard-rail" aria-label="Progress">
          <ol>
            {steps.map((item, itemIndex) => {
              const state =
                itemIndex === index ? 'current' : itemIndex < index ? 'done' : 'upcoming';
              const reachable = itemIndex <= furthest;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    data-state={state}
                    disabled={!reachable}
                    onClick={() => goTo(itemIndex)}
                    aria-current={itemIndex === index ? 'step' : undefined}
                  >
                    <span className="wizard-rail-index">{String(itemIndex + 1).padStart(2, '0')}</span>
                    <span className="wizard-rail-label">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <Progress value={progress} label={`Step ${index + 1} of ${steps.length}`} showValue />

        {/* ── Step ─────────────────────────────────────────────────── */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div className="wizard-body" onKeyDown={handleKeyDown}>
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.section
              key={step.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * offset }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -offset, transition: { duration: DURATION.fast } }}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
              aria-labelledby={`${step.id}-heading`}
            >
              <header className="wizard-step-head">
                <h1
                  id={`${step.id}-heading`}
                  ref={headingRef}
                  tabIndex={-1}
                  style={{ fontSize: 'clamp(1.7rem, 1.4rem + 1.4vw, 2.5rem)', outline: 'none' }}
                >
                  {step.title}
                </h1>
                {step.description ? <p className="wizard-step-description">{step.description}</p> : null}
              </header>

              <div className="wizard-step-body">{step.render(wizard)}</div>
            </motion.section>
          </AnimatePresence>
        </div>

        {/* ── Blocking message ─────────────────────────────────────── */}
        <AnimatePresence>
          {error ? (
            <motion.p
              role="alert"
              className="wizard-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: DURATION.fast } }}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
            >
              <Icon name="warning" size={15} />
              {error}
            </motion.p>
          ) : null}
        </AnimatePresence>

        {/* ── Controls ─────────────────────────────────────────────── */}
        <div className="wizard-controls">
          <Button variant="ghost" onClick={back} disabled={isFirst || submitting} icon={<Icon name="back" size={15} />}>
            Back
          </Button>

          {isLast ? (
            <Button onClick={handleSubmit} loading={submitting} size="lg">
              {submitLabel}
            </Button>
          ) : (
            <Button onClick={next} iconAfter={<Icon name="forward" size={15} />} size="lg">
              Continue
            </Button>
          )}
        </div>

        {footnote ? <p className="wizard-footnote">{footnote}</p> : null}
      </div>
    </PageShell>
  );
}
