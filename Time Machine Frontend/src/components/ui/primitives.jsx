import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { EASE_OUT, DURATION } from '../../motion/easings';

/** A small labelled pill. */
export function Badge({ children, accent = false, icon = null, className, ...rest }) {
  return (
    <span className={cn('badge', accent && 'badge-accent', className)} {...rest}>
      {icon}
      {children}
    </span>
  );
}

/** A horizontal rule with centred content. */
export function Ornament({ children }) {
  return (
    <div className="rule-ornament" aria-hidden={children ? undefined : 'true'}>
      {children ? (
        <span className="eyebrow" style={{ letterSpacing: 'var(--tracking-label)' }}>
          {children}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Determinate progress.
 *
 * The fill is transformed rather than resized, so it composites on the GPU and
 * retargets smoothly when a new value arrives mid-transition.
 */
export function Progress({ value, label, showValue = false }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div>
      {label || showValue ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 'var(--space-2)',
            gap: 'var(--space-3)',
          }}
        >
          {label ? <span className="eyebrow">{label}</span> : <span />}
          {showValue ? (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--accent)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {Math.round(clamped)}%
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        className="progress"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div className="progress-fill" style={{ transform: `scaleX(${clamped / 100})` }} />
      </div>
    </div>
  );
}

/** A section header: eyebrow, title, and optional supporting line. */
export function SectionHeading({ eyebrow, title, description, align = 'left', split = false, children, className }) {
  return (
    <header
      className={cn(split && 'section-split', className)}
      style={{
        textAlign: align,
        marginInline: align === 'center' ? 'auto' : undefined,
        maxWidth: align === 'center' ? '720px' : undefined,
      }}
    >
      {eyebrow ? (
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
          style={{ marginBottom: 'var(--space-3)' }}
        >
          {eyebrow}
        </motion.p>
      ) : null}

      {title ? (
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: DURATION.scene, ease: EASE_OUT, delay: 0.04 }}
        >
          {title}
        </motion.h2>
      ) : null}

      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: DURATION.scene, ease: EASE_OUT, delay: 0.08 }}
          style={{
            marginTop: 'var(--space-4)',
            color: 'var(--ink-soft)',
            fontSize: '1.05rem',
            maxWidth: '62ch',
            marginInline: align === 'center' ? 'auto' : undefined,
          }}
        >
          {description}
        </motion.p>
      ) : null}

      {children}
    </header>
  );
}

/** A labelled statistic. Used in the 2050 HUD and the archive summary. */
export function Stat({ label, value, unit, note, delta }) {
  return (
    <div
      className="card hud-frame"
      style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}
    >
      <span className="eyebrow" style={{ fontSize: '0.64rem' }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 1.3rem + 1vw, 2.2rem)',
          fontWeight: 700,
          lineHeight: 1,
          color: 'var(--ink)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
        {unit ? (
          <span style={{ fontSize: '0.55em', color: 'var(--accent)', marginLeft: 2 }}>{unit}</span>
        ) : null}
      </span>
      {typeof delta === 'number' ? (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: delta >= 0 ? 'var(--color-positive)' : 'var(--color-caution)',
          }}
        >
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}
        </span>
      ) : null}
      {note ? (
        <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', lineHeight: 1.45 }}>{note}</span>
      ) : null}
    </div>
  );
}

/** Loading placeholder. Shimmer is linear — constant motion with a curve reads as broken. */
export function Skeleton({ width = '100%', height = 16, radius = 'var(--radius-sm)', style }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          'linear-gradient(90deg, var(--surface-sunken) 0%, var(--surface) 40%, var(--surface-sunken) 80%)',
        backgroundSize: '200% 100%',
        animation: 'tm-shimmer 1.6s linear infinite',
        ...style,
      }}
    />
  );
}

/** Empty state: an explanation and a way out of it. */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div
      className="card"
      style={{
        textAlign: 'center',
        padding: 'var(--space-8) var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-3)',
      }}
    >
      {icon}
      <h3 style={{ fontSize: '1.3rem' }}>{title}</h3>
      {description ? (
        <p style={{ color: 'var(--ink-muted)', maxWidth: '44ch', fontSize: '0.95rem' }}>{description}</p>
      ) : null}
      {action ? <div style={{ marginTop: 'var(--space-3)' }}>{action}</div> : null}
    </div>
  );
}
