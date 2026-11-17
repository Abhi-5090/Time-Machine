import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LottieIcon } from '../../lottie/LottieIcon';
import { EASE_OUT, EASE_IN_OUT, DURATION } from '../../motion/easings';
import { Icon } from '../ui/Icon';

/**
 * The generated portrait.
 *
 * The image is revealed with a clip-path wipe rather than a fade: a portrait
 * that fades up looks like it is loading, while one that is uncovered looks
 * like it is being shown. The direction differs by timeline — the past is
 * unveiled downward like a drape, 2050 resolves upward like a scan.
 *
 * The frame holds its aspect ratio from the first paint so nothing below it
 * moves when the image lands.
 */
export function PortraitFrame({ src, alt, timeline = 'past', caption, eyebrow, ratio = '4 / 5', placeholder = false }) {
  const [state, setState] = useState(src ? 'loading' : 'empty');

  const wipe =
    timeline === 'future'
      ? { from: 'inset(100% 0 0 0)', to: 'inset(0% 0 0 0)' }
      : { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0% 0)' };

  return (
    <figure style={{ margin: 0 }}>
      <div
        className={timeline === 'future' ? 'hud-frame' : undefined}
        style={{
          position: 'relative',
          aspectRatio: ratio,
          overflow: 'hidden',
          background: 'var(--surface-sunken)',
          border: '1px solid var(--rule-strong)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Inner hairline — a mount inside the frame on the past, a HUD
            boundary in 2050. */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: timeline === 'future' ? 8 : 10,
            border: '1px solid var(--rule)',
            borderRadius: 'var(--radius-xs)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        <AnimatePresence>
          {state === 'loading' ? (
            <motion.div
              key="pending"
              exit={{ opacity: 0, transition: { duration: DURATION.fast } }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                gap: 'var(--space-3)',
              }}
            >
              <LottieIcon
                name={timeline === 'future' ? 'scan' : 'hourglass'}
                size={56}
                primary="--accent"
                secondary="--ink-muted"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {state === 'error' ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              gap: 'var(--space-2)',
              color: 'var(--ink-muted)',
              textAlign: 'center',
              padding: 'var(--space-5)',
            }}
          >
            <Icon name="portrait" size={24} />
            <p style={{ fontSize: '0.86rem' }}>The portrait could not be loaded.</p>
          </div>
        ) : null}

        {src ? (
          <motion.img
            src={src}
            alt={alt}
            onLoad={() => setState('ready')}
            onError={() => setState('error')}
            initial={{ clipPath: wipe.from, opacity: 0 }}
            animate={
              state === 'ready'
                ? { clipPath: wipe.to, opacity: 1 }
                : { clipPath: wipe.from, opacity: 0 }
            }
            transition={{
              clipPath: { duration: 1.1, ease: EASE_IN_OUT },
              opacity: { duration: DURATION.base, ease: EASE_OUT },
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }}
          />
        ) : null}
      </div>

      {placeholder ? (
        <p className="portrait-placeholder-note" role="note">
          <Icon name="warning" size={13} />
          This is a stand-in, not a generated portrait — the image provider was unavailable.
        </p>
      ) : null}

      {eyebrow || caption ? (
        <figcaption style={{ marginTop: 'var(--space-4)' }}>
          {eyebrow ? (
            <p className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
              {eyebrow}
            </p>
          ) : null}
          {caption ? (
            <p style={{ color: 'var(--ink-muted)', fontSize: '0.86rem', lineHeight: 1.6 }}>{caption}</p>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
